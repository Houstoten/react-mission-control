import React, { useRef, useEffect, useState } from 'react';
import { useExpose } from '../ExposeContext';
import { createUniqueId } from '../utils';
import './Expose.css';

interface ExposeWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const ExposeWrapper: React.FC<ExposeWrapperProps> = ({
  children,
  id: propId,
  className = '',
  style = {},
  title,
}) => {
  // Generate a unique ID if none provided
  const componentId = useRef(propId || createUniqueId());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isActive, registerWindow, unregisterWindow } = useExpose();
  
  // Store calculated transform and scale for this window
  const [animationStyles, setAnimationStyles] = useState<{
    transform: string;
    scale: number;
    zIndex: number;
  } | null>(null);
  
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
      const borderElem = document.createElement('div');
      borderElem.className = 'expose-window-border-overlay';
      document.body.appendChild(borderElem);
      borderRef.current = borderElem;
      
      // Add handlers for hover
      const handleMouseEnter = () => {
        if (borderRef.current) borderRef.current.classList.add('hover');
      };
      
      const handleMouseLeave = () => {
        if (borderRef.current) borderRef.current.classList.remove('hover');
      };
      
      if (wrapperRef.current) {
        wrapperRef.current.addEventListener('mouseenter', handleMouseEnter);
        wrapperRef.current.addEventListener('mouseleave', handleMouseLeave);
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
        wrapperRef.current.removeEventListener('mouseenter', () => {});
        wrapperRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, [isActive]);
  
  // Calculate and store animation properties
  useEffect(() => {
    if (!wrapperRef.current || !isActive) return;
  
    const element = wrapperRef.current;
    const rect = element.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Find all windows that are being exposed
    const allWindows = document.querySelectorAll('.expose-window');
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
    const cellWidth = (viewportWidth - (padding * (columns + 1))) / columns;
    const cellHeight = (viewportHeight - (padding * (rows + 1))) / rows;
    
    // Determine scaling factor based on component size and available space
    const isSmall = rect.width < 200 || rect.height < 150;
    const isVeryLarge = rect.width > viewportWidth * 0.6 || rect.height > viewportHeight * 0.6;
    
    // Calculate max scale that would fit in cell with padding
    const maxWidthScale = cellWidth / rect.width * 0.85; // 85% of cell width
    const maxHeightScale = cellHeight / rect.height * 0.85; // 85% of cell height
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
    const centerX = padding + (gridCol * (cellWidth + padding)) + (cellWidth / 2);
    const centerY = padding + (gridRow * (cellHeight + padding)) + (cellHeight / 2);
    
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
      zIndex: 10000
    });
    
    // Update border overlay position to match the visual (transformed) position of the component
    if (borderRef.current && isActive) {
      // Scale width and height based on the scale factor
      const visualWidth = rect.width * finalScale;
      const visualHeight = rect.height * finalScale;
      
      // Calculate visual center position after transform
      const visualCenterX = currentCenterX + finalTranslateX;
      const visualCenterY = currentCenterY + finalTranslateY;
      
      // Position border overlay around the visual center, accounting for scale
      borderRef.current.style.width = `${visualWidth}px`;
      borderRef.current.style.height = `${visualHeight}px`;
      borderRef.current.style.left = `${visualCenterX - visualWidth/2}px`;
      borderRef.current.style.top = `${visualCenterY - visualHeight/2}px`;
    }
  }, [isActive, componentId]);
  
  return (
    <div 
      ref={wrapperRef}
      className={`expose-window ${isActive ? 'expose-window-active' : ''} ${className}`} 
      style={{
        ...style,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
        transformOrigin: 'center center',
        willChange: isActive ? 'transform, opacity' : 'auto',
        zIndex: animationStyles && isActive ? animationStyles.zIndex : 'auto',
        // Direct style application for maximum compatibility
        transform: animationStyles && isActive 
          ? `translate(${animationStyles.transform.match(/translate\((.*?)px,/)?.[1] || 0}px, ${animationStyles.transform.match(/px,\s*(.*?)px\)/)?.[1] || 0}px) scale(${animationStyles?.scale || 1})`
          : 'none'
      }}
      data-expose-id={componentId.current}
      data-scale={animationStyles?.scale || 1}
    >
      
      {title && isActive && (
        <div className="expose-window-title">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};