import React, { useRef, useEffect, useState } from "react";
import { useExpose } from "../ExposeContext";
import { createUniqueId } from "../utils";
import "./Expose.css";

interface ExposeWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const ExposeWrapper: React.FC<ExposeWrapperProps> = ({
  children,
  id: propId,
  className = "",
  style = {},
  label,
}) => {
  // Generate a unique ID if none provided
  const componentId = useRef(propId || createUniqueId());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const exposeObj = useExpose();
  const { isActive, registerWindow, unregisterWindow, borderWidth } = exposeObj;

  // Store calculated transform and scale for this window
  const [animationStyles, setAnimationStyles] = useState<{
    transform: string;
    scale: number;
    zIndex: number;
  } | null>(null);

  // Get highlighted component state from context
  const { highlightedComponent, setHighlightedComponent } = exposeObj;

  // Register/unregister this window with the Expose context
  useEffect(() => {
    registerWindow(componentId.current, wrapperRef);

    return () => {
      unregisterWindow(componentId.current);
    };
  }, [registerWindow, unregisterWindow]);

  // Reference for the border overlay
  const borderRef = useRef<HTMLDivElement | null>(null);

  // Handle hover state for border element
  useEffect(() => {
    if (!isActive) return;

    // Create border overlay element if it doesn't exist
    if (!borderRef.current) {
      const borderElem = document.createElement("div");
      borderElem.className = "expose-window-border-overlay";
      document.body.appendChild(borderElem);
      borderRef.current = borderElem;

      // Add handlers for hover
      const handleMouseEnter = () => {
        if (borderRef.current) borderRef.current.classList.add("hover");
      };

      const handleMouseLeave = () => {
        if (borderRef.current) borderRef.current.classList.remove("hover");
      };

      if (wrapperRef.current) {
        wrapperRef.current.addEventListener("mouseenter", handleMouseEnter);
        wrapperRef.current.addEventListener("mouseleave", handleMouseLeave);
      }
    }

    return () => {
      // Clean up
      if (borderRef.current) {
        document.body.removeChild(borderRef.current);
        borderRef.current = null;
      }

      if (wrapperRef.current) {
        // Remove event listeners
        wrapperRef.current.removeEventListener("mouseenter", () => {});
        wrapperRef.current.removeEventListener("mouseleave", () => {});
      }
    };
  }, [isActive]);

  // Handle scroll events to detect when scroll has ended
  useEffect(() => {
    const isThisHighlighted = highlightedComponent === componentId.current;

    if (isThisHighlighted) {
      const maxHighlightTimeout = setTimeout(() => {
        setHighlightedComponent(null);
      }, 500); // Maximum highlight time

      return () => {
        clearTimeout(maxHighlightTimeout);
      };
    }
  }, [highlightedComponent, componentId, setHighlightedComponent]);

  // Calculate and store animation properties
  useEffect(() => {
    if (!wrapperRef.current || !isActive) return;

    const element = wrapperRef.current;
    const rect = element.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Find all windows that are being exposed
    const allWindows = document.querySelectorAll(".expose-window");
    const count = allWindows.length;

    // Calculate optimal grid layout
    const aspectRatio = viewportWidth / viewportHeight;
    const columnsBase = Math.sqrt(count * aspectRatio);
    const columns = Math.ceil(columnsBase);
    const rows = Math.ceil(count / columns);

    // Get this element's index
    const index = Array.from(allWindows).indexOf(element);

    // Calculate grid position
    const gridCol = index % columns;
    const gridRow = Math.floor(index / columns);

    // Calculate cell dimensions with padding between cells
    const padding = Math.min(viewportWidth, viewportHeight) * 0.05; // 5% of viewport
    const cellWidth = (viewportWidth - padding * (columns + 1)) / columns;
    const cellHeight = (viewportHeight - padding * (rows + 1)) / rows;

    // Determine scaling factor based on component size and available space
    const isSmall = rect.width < 200 || rect.height < 150;
    const isVeryLarge =
      rect.width > viewportWidth * 0.6 || rect.height > viewportHeight * 0.6;

    // Calculate max scale that would fit in cell with padding
    const maxWidthScale = (cellWidth / rect.width) * 0.85; // 85% of cell width
    const maxHeightScale = (cellHeight / rect.height) * 0.85; // 85% of cell height
    let targetScale = Math.min(maxWidthScale, maxHeightScale);

    // Simple adjustment for very small components
    if (isSmall && targetScale < 0.7) {
      targetScale = Math.max(targetScale, 0.7); // Ensure small components aren't too tiny
    }

    // Handle very large components
    if (isVeryLarge) {
      targetScale = Math.min(targetScale, 0.25); // Cap for very large components
    }

    // Calculate center position for this grid cell in the visible viewport
    const centerX = padding + gridCol * (cellWidth + padding) + cellWidth / 2;
    const centerY = padding + gridRow * (cellHeight + padding) + cellHeight / 2;

    // Calculate the current position relative to the viewport
    const currentCenterX = rect.left + rect.width / 2;
    const currentCenterY = rect.top + rect.height / 2;

    // Calculate transform to move from current position to target position in viewport
    const translateX = centerX - currentCenterX;
    const translateY = centerY - currentCenterY;

    // Store final values
    const finalTranslateX = Math.round(translateX);
    const finalTranslateY = Math.round(translateY);
    const finalScale = parseFloat(targetScale.toFixed(3));

    setAnimationStyles({
      transform: `translate(${finalTranslateX}px, ${finalTranslateY}px)`,
      scale: finalScale,
      zIndex: 10000,
    });

    // Update border overlay position to match the visual (transformed) position of the component
    if (borderRef.current && isActive) {
      // Scale width and height based on the scale factor
      const visualWidth = rect.width * finalScale;
      const visualHeight = rect.height * finalScale;

      // Calculate visual center position after transform
      const visualCenterX = currentCenterX + finalTranslateX;
      const visualCenterY = currentCenterY + finalTranslateY;

      // Use the global border width from context - consistent across all components

      // Adjust the offset range for different component sizes
      // Small components get more space, large components get less
      const minOffset = 4; // Minimum offset in pixels
      const maxOffset = 12; // Maximum offset in pixels

      // Calculate a more generous border offset based on the component's scale
      // This creates more breathing room between the component and its border
      const borderOffset = Math.max(
        minOffset,
        Math.min(maxOffset, 14 * (1 - finalScale)),
      );

      // Make the component slightly smaller (97%) for better visual balance
      const scaledVisualWidth = visualWidth * 0.97;
      const scaledVisualHeight = visualHeight * 0.97;

      // Create a container that's larger than the component by the offset amount
      const containerWidth = scaledVisualWidth + borderOffset * 2;
      const containerHeight = scaledVisualHeight + borderOffset * 2;

      // Calculate positions based on the transformed component's actual center
      // Instead of trying to calculate offsets, use the component's center
      // and position the border relative to that

      // Reset any transforms on the border to ensure clean positioning
      borderRef.current.style.transform = "none";

      // Set dimensions first to ensure the border has the correct size
      borderRef.current.style.width = `${containerWidth}px`;
      borderRef.current.style.height = `${containerHeight}px`;

      // Apply positioning with more correction on left/top to fix asymmetry
      // +2px on left and top creates better visual balance
      borderRef.current.style.left = `${Math.round(visualCenterX - containerWidth / 2)}px`;
      borderRef.current.style.top = `${Math.round(visualCenterY - containerHeight / 2)}px`;
      borderRef.current.style.borderWidth = `${borderWidth}px`;
    }
  }, [isActive, componentId]);
  console.log(highlightedComponent, componentId.current);
  return (
    <div className="expose-container">
      <div
        ref={wrapperRef}
        className={`expose-window ${isActive ? "expose-window-active" : ""} ${highlightedComponent === componentId.current ? "expose-window-highlighted" : ""} ${className}`}
        onClick={
          isActive
            ? (e) => {
                e.stopPropagation();
                // Get the element's original position and scroll to it
                if (wrapperRef.current) {
                  // Deactivate expose mode if clicked
                  if (exposeObj.setActive) {
                    exposeObj.setActive(false);
                  }

                  // Set this component as highlighted
                  setHighlightedComponent(componentId.current);

                  // Wait for the transition to complete before scrolling
                  setTimeout(() => {
                    const rect = wrapperRef.current?.getBoundingClientRect();
                    if (rect) {
                      // Calculate position relative to the document
                      const scrollY = window.scrollY + rect.top - 50; // 50px top margin
                      window.scrollTo({
                        top: scrollY,
                        behavior: "smooth",
                      });
                    }
                  }, 200); // Match the transition time (0.2s)
                }
              }
            : undefined
        }
        style={{
          ...style,
          transition:
            "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
          transformOrigin: "center center",
          willChange:
            isActive || highlightedComponent === componentId.current
              ? "transform, opacity, filter"
              : "auto",
          zIndex:
            animationStyles && isActive
              ? animationStyles.zIndex
              : highlightedComponent === componentId.current
                ? 1000
                : "auto",
          // Direct style application for maximum compatibility
          transform:
            animationStyles && isActive
              ? `translate(${animationStyles.transform.match(/translate\((.*?)px,/)?.[1] || 0}px, ${animationStyles.transform.match(/px,\s*(.*?)px\)/)?.[1] || 0}px) scale(${animationStyles?.scale || 1})`
              : "none",
          // Make wrapper invisible (but don't affect children) when not in expose mode
          background: isActive ? undefined : "transparent",
          boxShadow: isActive
            ? undefined
            : highlightedComponent === componentId.current
              ? "0 0 0 4px rgba(64, 156, 255, 0.7), 0 5px 20px rgba(0, 0, 0, 0.2)"
              : "none",
          width: "100%",
          height: "100%",
          // We rely on the ::before overlay to block pointer events to children
          pointerEvents: "auto",
          // Apply blur to other elements when this one is highlighted - note other elements get blurred via CSS classes
          filter:
            highlightedComponent === componentId.current ? "none" : "blur(0px)",
        }}
        data-expose-id={componentId.current}
        data-scale={animationStyles?.scale || 1}
        data-highlighted={
          highlightedComponent === componentId.current ? "true" : "false"
        }
      >
        {children}

        {/* Display label when component is exposed and hovered */}
        {label && isActive && (
          <div className="expose-window-label">{label}</div>
        )}
      </div>
    </div>
  );
};
