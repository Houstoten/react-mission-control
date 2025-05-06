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
    
    // Find all windows that are being exposed and create grid
    const allWindows = document.querySelectorAll('.expose-window');
    const count = allWindows.length;
    const columns = Math.ceil(Math.sqrt(count));
    
    // Get this element's index
    const index = Array.from(allWindows).indexOf(element);
    
    // Calculate grid position
    const gridCol = index % columns;
    const gridRow = Math.floor(index / columns);
    
    // Calculate target scale
    const targetScale = Math.max(0.3, 1 - (count * 0.05));
    
    // Calculate grid cell dimensions
    const cellWidth = viewportWidth / columns;
    const cellHeight = viewportHeight / Math.ceil(count / columns);
    
    // Add subtle randomness for natural feel
    const randomOffsetX = (Math.random() - 0.5) * 20;
    const randomOffsetY = (Math.random() - 0.5) * 20;
    
    // Calculate center position for this grid cell in the visible viewport
    // Note: We don't add scroll position since we want all windows in the current viewport
    const centerX = (gridCol + 0.5) * cellWidth + randomOffsetX;
    const centerY = (gridRow + 0.5) * cellHeight + randomOffsetY;
    
    // Calculate the current position relative to the viewport (already accounts for scroll)
    const currentCenterX = rect.left + rect.width / 2;
    const currentCenterY = rect.top + rect.height / 2;
    
    // Calculate transform to move from current position to target position in viewport
    const translateX = centerX - currentCenterX;
    const translateY = centerY - currentCenterY;
    
    setAnimationStyles({
      transform: `translate(${translateX}px, ${translateY}px)`,
      scale: targetScale,
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
        transform: animationStyles && isActive 
          ? `${animationStyles.transform} scale(${animationStyles.scale})` 
          : 'translate(0, 0) scale(1)'
      }}
      data-expose-id={componentId.current}
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