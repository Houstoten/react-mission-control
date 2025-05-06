import React, { useEffect, useRef } from 'react';
import { useExpose } from '../ExposeContext';

/**
 * Component to handle double up arrow click detection for Exposé activation
 */
export const ExposeTrigger = () => {
  const { isActive, activate, deactivate } = useExpose();
  const lastClickTimeRef = useRef(0);
  const doubleClickThreshold = 300; // milliseconds between clicks to count as a double click
  
  useEffect(() => {
    const handleKeyUp = (e) => {
      // Only handle arrow up key when not active
      if (isActive || e.key !== 'ArrowUp') return;
      
      e.preventDefault();
      
      const currentTime = Date.now();
      const timeSinceLastClick = currentTime - lastClickTimeRef.current;
      
      if (timeSinceLastClick < doubleClickThreshold) {
        // Double click detected
        console.log('Double up arrow click detected, activating Exposé');
        activate();
        // Reset timer to prevent triple click counting as another double click
        lastClickTimeRef.current = 0;
      } else {
        // First click, start timer
        lastClickTimeRef.current = currentTime;
      }
    };
    
    const handleEscapeKey = (e) => {
      // Only deactivate with Escape key when active
      if (isActive && e.key === 'Escape') {
        e.preventDefault();
        deactivate();
      }
    };
    
    // Add event listeners - using keyup for more reliable double-click detection
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleEscapeKey);
    
    // Clean up
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, activate, deactivate]);
  
  // This component doesn't render anything
  return null;
};