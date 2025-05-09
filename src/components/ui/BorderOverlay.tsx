import React, { useEffect, useRef } from 'react';
import '../../styles/exposeWrapper.css';

interface BorderOverlayProps {
  targetRef: React.RefObject<HTMLDivElement>;
  isActive: boolean;
  scale: number;
  borderWidth: number;
  label?: string;
}

/**
 * Component that creates a decorative border around elements in Exposé view
 */
export const BorderOverlay: React.FC<BorderOverlayProps> = ({
  targetRef,
  isActive,
  scale,
  borderWidth,
  label
}) => {
  const borderRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!isActive || !targetRef.current) return;
    
    // Create border container if it doesn't exist
    if (!borderRef.current) {
      const borderContainer = document.createElement('div');
      borderContainer.className = 'expose-window-border-container';
      
      const borderElem = document.createElement('div');
      borderElem.className = 'expose-window-border-overlay';
      
      // Add label element if needed
      const labelElem = document.createElement('div');
      labelElem.className = 'expose-window-label';
      labelElem.style.opacity = '0'; // Initially hidden
      
      // Append both elements to the container
      borderContainer.appendChild(borderElem);
      borderContainer.appendChild(labelElem);
      
      document.body.appendChild(borderContainer);
      borderRef.current = borderContainer;
    }
    
    // Grab reference to the container element with CSS variables
    const container = targetRef.current.closest('.expose-container') as HTMLElement;
    if (container && borderRef.current) {
      // Add event listeners for hover
      const handleMouseEnter = () => {
        if (!borderRef.current) return;
        
        // Add hover class and directly set border color
        const borderOverlay = borderRef.current.querySelector('.expose-window-border-overlay') as HTMLElement;
        if (borderOverlay) {
          borderOverlay.classList.add('hover');
          borderOverlay.style.borderColor = 'rgba(64, 156, 255, 0.85)';
        }
        
        // Show the label on hover
        const labelEl = borderRef.current.querySelector('.expose-window-label');
        if (labelEl) (labelEl as HTMLElement).style.opacity = '1';
      };
      
      const handleMouseLeave = () => {
        if (!borderRef.current) return;
        
        // Remove hover class and set transparent border
        const borderOverlay = borderRef.current.querySelector('.expose-window-border-overlay') as HTMLElement;
        if (borderOverlay) {
          borderOverlay.classList.remove('hover');
          borderOverlay.style.borderColor = 'transparent';
        }
        
        // Hide the label when not hovering
        const labelEl = borderRef.current.querySelector('.expose-window-label');
        if (labelEl) (labelEl as HTMLElement).style.opacity = '0';
      };
      
      // Add the hover handlers
      targetRef.current.addEventListener('mouseenter', handleMouseEnter);
      targetRef.current.addEventListener('mouseleave', handleMouseLeave);
      
      // Function to update border positioning using CSS variables from the container
      const updateBorderFromCssVars = () => {
        if (!borderRef.current || !container) return;
        
        // Set styles on the border container
        const borderLeft = container.style.getPropertyValue('--expose-border-left') || '0px';
        const borderTop = container.style.getPropertyValue('--expose-border-top') || '0px';
        const borderContainerWidth = container.style.getPropertyValue('--expose-border-width') || '0px';
        const borderContainerHeight = container.style.getPropertyValue('--expose-border-height') || '0px';
        
        borderRef.current.style.left = borderLeft;
        borderRef.current.style.top = borderTop;
        borderRef.current.style.width = borderContainerWidth;
        borderRef.current.style.height = borderContainerHeight;
        
        // Style the border overlay
        const borderOverlay = borderRef.current.querySelector('.expose-window-border-overlay') as HTMLElement;
        if (borderOverlay) {
          borderOverlay.style.borderWidth = `${borderWidth}px`;
          borderOverlay.style.borderStyle = 'solid';
          borderOverlay.style.borderColor = 'transparent';
        }
        
        // Update label text
        const labelElem = borderRef.current.querySelector('.expose-window-label') as HTMLElement;
        if (labelElem && label) {
          labelElem.textContent = label;
        }
      };
      
      // Initial update
      updateBorderFromCssVars();
      
      // Create an observer to watch for changes to the CSS variables
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            updateBorderFromCssVars();
          }
        });
      });
      
      // Start observing the container
      observer.observe(container, { attributes: true });
      
      // Clean up function
      return () => {
        observer.disconnect();
        
        if (targetRef.current) {
          targetRef.current.removeEventListener('mouseenter', handleMouseEnter);
          targetRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
        
        if (borderRef.current) {
          document.body.removeChild(borderRef.current);
          borderRef.current = null;
        }
      };
    }
  }, [isActive, targetRef, borderWidth, label]);
  
  // This component doesn't render anything directly to the DOM
  return null;
};