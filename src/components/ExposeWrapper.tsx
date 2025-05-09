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
  
  // For storing precomputed position values for smooth scrolling
  const positionCache = useRef<{scrollY: number | null}>({
    scrollY: null
  });

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
      // Reset position cache on unmount
      positionCache.current.scrollY = null;
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

  // Use useLayoutEffect for immediate visual update when component is highlighted
  // This runs synchronously right after DOM mutations but before browser paints
  useLayoutEffect(() => {
    const isThisHighlighted = highlightedComponent === componentId.current;

    if (isThisHighlighted && wrapperRef.current) {
      // Apply visual highlight styling
      
      // Apply immediate visual changes to highlight element
      wrapperRef.current.style.zIndex = '1000';
      wrapperRef.current.style.transform = 'scale(1.02)';
      wrapperRef.current.style.boxShadow = '0 0 0 4px rgba(64, 156, 255, 0.7), 0 5px 20px rgba(0, 0, 0, 0.2)';
      
      // We're now handling all scrolling within the click handler's callback
      // Don't try to scroll here to avoid conflicts
      
      // Cleanup highlight after a delay
      const maxHighlightTimeout = setTimeout(() => {
        setHighlightedComponent(null);
        // Reset position cache after highlight ends
        positionCache.current.scrollY = null;
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
  // Removed unnecessary console log
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
                  // Store element ID before we make any changes
                  const elementId = componentId.current;
                
                  // Get a direct reference to this element that won't be affected 
                  // by React's state changes - this is critical for accurate positioning
                  const domElement = document.querySelector(`[data-expose-id="${elementId}"]`);
                  
                  // Calculate element's position relative to document
                  // Using element.offsetTop gives us document position accounting for scrolling
                  let targetScrollY = 0;
                  
                  if (domElement) {
                    // Get element coordinates in viewport
                    const rect = domElement.getBoundingClientRect();
                    
                    // Use the original scroll position from Context if available
                    // @ts-ignore - accessing property on window
                    const originalScrollY = window.__restoreScrollY !== undefined ? 
                      // @ts-ignore
                      window.__restoreScrollY : window.pageYOffset;
                    
                    // Calculate absolute position accounting for restoration of scroll
                    // This ensures we get coordinates relative to our target scroll position
                    targetScrollY = originalScrollY + rect.top - 50;
                    
                    // Position calculation complete
                    
                    // Cleanup the global variable so it doesn't interfere with future calls
                    // @ts-ignore
                    delete window.__restoreScrollY;
                  }
                  
                  // Save target position in ref
                  positionCache.current.scrollY = targetScrollY;
                  
                  // Exit expose mode first
                  if (exposeObj.setActive) {
                    exposeObj.setActive(false);
                  }
                  
                  // We now set the component as highlighted in the callback
                  // after the expose mode is deactivated
                  
                  // Store the position for use in case we need it
                  positionCache.current.scrollY = targetScrollY;
                  
                  // Handle state changes and scrolling in a careful sequence
                  if (exposeObj.setActive) {
                    // Step 1: Deactivate expose mode first
                    exposeObj.setActive(false);
                    
                    // Step 2: Highlight the component AFTER expose mode is deactivated
                    setTimeout(() => {
                      setHighlightedComponent(elementId);
                      
                      // Step 3: Handle scrolling after ALL state changes
                      setTimeout(() => {
                        // Get a fresh reference to the element now that state has changed
                        const actualElement = document.querySelector(`[data-expose-id="${elementId}"]`);
                        
                        if (actualElement) {
                          // Get the element's position in the document
                          const rect = actualElement.getBoundingClientRect();
                          const actualY = window.pageYOffset + rect.top - 50;
                          
                          // Scroll directly to the position - instant response
                          window.scrollTo(0, actualY);
                        }
                      }, 10); // Small delay for state updates
                    }, 5); // Minimal delay between state changes
                  }
                }
              }
            : undefined
        }
        style={{
          ...style,
          transition:
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease",
          transformOrigin: "center center",
          willChange:
            isActive || highlightedComponent === componentId.current
              ? "transform, opacity, filter, scroll-position" 
              : "auto",
          zIndex:
            animationStyles && isActive
              ? animationStyles.zIndex
              : highlightedComponent === componentId.current
                ? 1000
                : "auto",
          // Performance optimized transform with will-change property
          transform:
            animationStyles && isActive
              ? `translate(${animationStyles.transform.match(/translate\((.*?)px,/)?.[1] || 0}px, ${animationStyles.transform.match(/px,\s*(.*?)px\)/)?.[1] || 0}px) scale(${animationStyles?.scale || 1})`
              : (highlightedComponent === componentId.current ? "scale(1.02)" : "none"),
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
