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
    
    // Collect all window dimensions for better layout calculation
    const windowRects = Array.from(allWindows).map(win => 
      (win as HTMLElement).getBoundingClientRect()
    );
    
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
    
    // Debug log for problematic scaling
    if (targetScale < 0.2 || targetScale > 2) {
      console.log(`Unusual scale for ${componentId.current}: ${targetScale}`);
    }
    
    setAnimationStyles({
      transform: `translate(${finalTranslateX}px, ${finalTranslateY}px)`,
      scale: finalScale,
      zIndex: 10000
    });
    
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