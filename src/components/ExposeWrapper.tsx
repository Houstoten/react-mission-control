import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
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
  const rafRef = useRef<number | null>(null);

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

      // Clean up any pending animation frames
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [registerWindow, unregisterWindow]);

  // Reference for the border overlay
  const borderRef = useRef<HTMLDivElement | null>(null);

  // Handle hover state for border element
  useLayoutEffect(() => {
    if (!isActive) return;

    // Create border overlay container if it doesn't exist
    if (!borderRef.current) {
      const borderContainer = document.createElement("div");
      borderContainer.className = "expose-window-border-container";

      const borderElem = document.createElement("div");
      borderElem.className = "expose-window-border-overlay";

      // Create label element at the same level as the border
      const labelElem = document.createElement("div");
      labelElem.className = "expose-window-label";
      labelElem.style.opacity = "0"; // Initially hidden

      // Append both elements to the container
      borderContainer.appendChild(borderElem);
      borderContainer.appendChild(labelElem);

      document.body.appendChild(borderContainer);
      borderRef.current = borderContainer;

      // Add handlers for hover
      const handleMouseEnter = () => {
        if (borderRef.current) {
          borderRef.current.querySelector('.expose-window-border-overlay')?.classList.add("hover");

          // Show the label on hover
          const labelEl = borderRef.current.querySelector('.expose-window-label');
          if (labelEl) (labelEl as HTMLElement).style.opacity = '1';
        }
      };

      const handleMouseLeave = () => {
        if (borderRef.current) {
          borderRef.current.querySelector('.expose-window-border-overlay')?.classList.remove("hover");

          // Hide the label when not hovering
          const labelEl = borderRef.current.querySelector('.expose-window-label');
          if (labelEl) (labelEl as HTMLElement).style.opacity = '0';
        }
      };

      if (wrapperRef.current) {
        wrapperRef.current.addEventListener("mouseenter", handleMouseEnter);
        wrapperRef.current.addEventListener("mouseleave", handleMouseLeave);
      }
    }

    return () => {
      // Clean up the container and all its children
      if (borderRef.current) {
        document.body.removeChild(borderRef.current);
        borderRef.current = null;
      }

      if (wrapperRef.current) {
        // Remove event listeners properly with named functions
        const handleMouseEnter = () => {
          if (borderRef.current) {
            borderRef.current.querySelector('.expose-window-border-overlay')?.classList.add("hover");
            const labelEl = borderRef.current.querySelector('.expose-window-label');
            if (labelEl) (labelEl as HTMLElement).style.opacity = '1';
          }
        };

        const handleMouseLeave = () => {
          if (borderRef.current) {
            borderRef.current.querySelector('.expose-window-border-overlay')?.classList.remove("hover");
            const labelEl = borderRef.current.querySelector('.expose-window-label');
            if (labelEl) (labelEl as HTMLElement).style.opacity = '0';
          }
        };

        wrapperRef.current.removeEventListener("mouseenter", handleMouseEnter);
        wrapperRef.current.removeEventListener("mouseleave", handleMouseLeave);
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
  useLayoutEffect(() => {
    if (!wrapperRef.current || !isActive) {
      // Cancel any pending animation frames when not active
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    // Use requestAnimationFrame for smoother animations
    const updatePosition = () => {
      if (!wrapperRef.current) return;

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

      // Adjust scale for edge cases
      if (isSmall && targetScale < 0.7) targetScale = Math.max(targetScale, 0.7);
      if (isVeryLarge) targetScale = Math.min(targetScale, 0.25);

      // Calculate center positions
      const centerX = padding + gridCol * (cellWidth + padding) + cellWidth / 2;
      const centerY = padding + gridRow * (cellHeight + padding) + cellHeight / 2;
      const currentCenterX = rect.left + rect.width / 2;
      const currentCenterY = rect.top + rect.height / 2;

      // Calculate transform values
      const translateX = centerX - currentCenterX;
      const translateY = centerY - currentCenterY;
      const finalTranslateX = Math.round(translateX);
      const finalTranslateY = Math.round(translateY);
      const finalScale = parseFloat(targetScale.toFixed(3));

      setAnimationStyles({
        transform: `translate(${finalTranslateX}px, ${finalTranslateY}px)`,
        scale: finalScale,
        zIndex: 10000,
      });

      // Update border container and its children
      if (borderRef.current) {
        const visualWidth = rect.width * finalScale;
        const visualHeight = rect.height * finalScale;
        const visualCenterX = currentCenterX + finalTranslateX;
        const visualCenterY = currentCenterY + finalTranslateY;

        const borderOffset = Math.max(
          4, // min offset
          Math.min(12, 14 * (1 - finalScale)) // max offset
        );

        const scaledVisualWidth = visualWidth * 0.97;
        const scaledVisualHeight = visualHeight * 0.97;
        const containerWidth = scaledVisualWidth + borderOffset * 2;
        const containerHeight = scaledVisualHeight + borderOffset * 2;

        // Position the container
        borderRef.current.style.transform = "none";
        borderRef.current.style.width = `${containerWidth}px`;
        borderRef.current.style.height = `${containerHeight}px`;
        borderRef.current.style.left = `${Math.round(visualCenterX - containerWidth / 2)}px`;
        borderRef.current.style.top = `${Math.round(visualCenterY - containerHeight / 2)}px`;
        borderRef.current.style.position = "fixed";
        borderRef.current.style.pointerEvents = "none";
        borderRef.current.style.zIndex = "10001";
        borderRef.current.style.overflow = "visible";

        // Style the border overlay
        const borderOverlay = borderRef.current.querySelector('.expose-window-border-overlay') as HTMLElement;
        if (borderOverlay) {
          borderOverlay.style.position = "absolute";
          borderOverlay.style.top = "0";
          borderOverlay.style.left = "0";
          borderOverlay.style.width = "100%";
          borderOverlay.style.height = "100%";
          borderOverlay.style.borderWidth = `${borderWidth}px`;
          borderOverlay.style.borderStyle = "solid";
          borderOverlay.style.borderColor = "rgba(255, 255, 255, 0.5)";
          borderOverlay.style.borderRadius = "6px";
          borderOverlay.style.boxSizing = "border-box";
          borderOverlay.style.pointerEvents = "none";
          borderOverlay.style.transition = "border-color 0.2s ease";
        }

        // Position the label
        const labelElem = borderRef.current.querySelector('.expose-window-label') as HTMLElement;
        if (labelElem && label) {
          labelElem.textContent = label;
          labelElem.style.position = "absolute";
          labelElem.style.bottom = "-30px";
          labelElem.style.left = "50%";
          labelElem.style.transform = "translateX(-50%)";
          labelElem.style.height = "auto";
          labelElem.style.minHeight = "fit-content";
          labelElem.style.maxWidth = "none";
          labelElem.style.display = "flex";
          labelElem.style.alignItems = "center";
          labelElem.style.justifyContent = "center";
          labelElem.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
          labelElem.style.color = "white";
          labelElem.style.padding = "4px 8px";
          labelElem.style.borderRadius = "4px";
          labelElem.style.fontSize = "12px";
          labelElem.style.fontWeight = "bold";
          labelElem.style.whiteSpace = "nowrap";
          labelElem.style.transition = "opacity 0.2s ease";
          labelElem.style.pointerEvents = "none";
          labelElem.style.zIndex = "10002"; // Higher than container
        }
      }
    };

    // Run immediately once for initial positioning
    updatePosition();

    // Then listen for resize events which might require recalculation
    const handleResize = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, borderWidth]);
  // Handle label text updates
  useEffect(() => {
    // Only update label when in expose mode with a valid label
    if (isActive && label && borderRef.current) {
      // Get label element that's already created as a sibling to border
      const labelElem = borderRef.current.querySelector('.expose-window-label');

      if (labelElem) {
        // Update label text
        labelElem.textContent = label;
      }
    }
  }, [isActive, label]);

  return (
    <div className="expose-container">
      <div
        ref={wrapperRef}
        className={`expose-window ${isActive ? "expose-window-active" : ""} ${highlightedComponent === componentId.current ? "expose-window-highlighted" : ""} ${className}`}
        onClick={
          isActive
            ? (e) => {
                e.stopPropagation();
                if (wrapperRef.current) {
                  // Deactivate expose mode
                  if (exposeObj.setActive) {
                    exposeObj.setActive(false);
                  }

                  // Set this component as highlighted
                  setHighlightedComponent(componentId.current);

                  // Use requestAnimationFrame for smoother scrolling after transition
                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      if (!wrapperRef.current) return;
                      const rect = wrapperRef.current.getBoundingClientRect();
                      // Calculate position relative to the document with a small margin
                      const scrollY = window.scrollY + rect.top - 50;
                      window.scrollTo({
                        top: scrollY,
                        behavior: "smooth",
                      });
                    }, 200); // Match transition time
                  });
                }
              }
            : undefined
        }
        style={{
          ...style,
          transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
          transformOrigin: "center center",
          willChange: (isActive || highlightedComponent === componentId.current) ? "transform, opacity, filter" : "auto",
          zIndex: animationStyles && isActive
            ? animationStyles.zIndex
            : highlightedComponent === componentId.current ? 1000 : "auto",
          transform: animationStyles && isActive
            ? `translate(${animationStyles.transform.match(/translate\((.*?)px,/)?.[1] || 0}px, ${animationStyles.transform.match(/px,\s*(.*?)px\)/)?.[1] || 0}px) scale(${animationStyles?.scale || 1})`
            : "none",
          background: isActive ? undefined : "transparent",
          boxShadow: isActive
            ? undefined
            : highlightedComponent === componentId.current
              ? "0 0 0 4px rgba(64, 156, 255, 0.7), 0 5px 20px rgba(0, 0, 0, 0.2)"
              : "none",
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
          filter: highlightedComponent === componentId.current ? "none" : "blur(0px)",
        }}
        data-expose-id={componentId.current}
        data-scale={animationStyles?.scale || 1}
        data-highlighted={highlightedComponent === componentId.current ? "true" : "false"}
      >
        {children}
      </div>
    </div>
  );
};
