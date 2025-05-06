import React, { useEffect, useRef, useCallback } from 'react';
import { FineBitesProps } from '../types';
import { FineBitesProvider, useFineBites } from '../FineBitesContext';
import './FineBites.css';

const MissionControl: React.FC = () => {
  const { isActive, windows, deactivate, selectedWindowId, setSelectedWindowId } = useFineBites();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    
    switch (e.key) {
      case 'Escape':
        deactivate();
        break;
      case 'ArrowRight':
        // Navigate right logic
        break;
      case 'ArrowLeft':
        // Navigate left logic
        break;
      case 'ArrowUp':
        // Navigate up logic
        break;
      case 'ArrowDown':
        // Navigate down logic
        break;
      case 'Enter':
        // Select current window
        if (selectedWindowId) {
          // Focus the selected window
          const selectedWindow = windows.find(w => w.id === selectedWindowId);
          if (selectedWindow) {
            selectedWindow.element.focus();
            deactivate();
          }
        }
        break;
    }
  }, [isActive, windows, deactivate, selectedWindowId, setSelectedWindowId]);
  
  // Register keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Create window clones when Mission Control activates
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Clone each window and position it in the Mission Control view
    windows.forEach(windowData => {
      const { element, rect, id } = windowData;
      
      // Create a clone of the original element
      const clone = element.cloneNode(true) as HTMLElement;
      clone.classList.add('fb-window-clone');
      clone.style.position = 'absolute';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      
      // Initial position (matches the original window)
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.transform = 'scale(1)';
      
      // Add transition for smooth animation
      clone.style.transition = 'all 0.3s ease-out';
      
      // Add click handler
      clone.addEventListener('click', () => {
        setSelectedWindowId(id);
        element.focus();
        deactivate();
      });
      
      // Add to container
      container.appendChild(clone);
      
      // Force layout reflow
      void clone.offsetWidth;
      
      // Calculate final position for the window in Mission Control view
      // This is where you'd implement your layout algorithm
      // For now, we'll just use a simple grid layout
      const targetScale = 0.5;
      const margin = 20;
      const index = windows.indexOf(windowData);
      const columns = Math.ceil(Math.sqrt(windows.length));
      const row = Math.floor(index / columns);
      const col = index % columns;
      
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const scaledWidth = rect.width * targetScale;
      const scaledHeight = rect.height * targetScale;
      
      const targetLeft = margin + col * (scaledWidth + margin);
      const targetTop = margin + row * (scaledHeight + margin);
      
      // Center the grid in the viewport
      const gridWidth = columns * scaledWidth + (columns - 1) * margin;
      const offsetX = (containerWidth - gridWidth) / 2;
      
      // Apply the zoomed out position
      requestAnimationFrame(() => {
        clone.style.transform = `scale(${targetScale})`;
        clone.style.left = `${offsetX + targetLeft}px`;
        clone.style.top = `${targetTop}px`;
      });
    });
    
    // Add zoom-out animation to original windows
    windows.forEach(({ element }) => {
      element.classList.add('fb-window-hidden');
    });
    
    return () => {
      // Cleanup when Mission Control deactivates
      windows.forEach(({ element }) => {
        element.classList.remove('fb-window-hidden');
      });
    };
  }, [isActive, windows, setSelectedWindowId, deactivate]);
  
  if (!isActive) return null;
  
  return (
    <div className="fb-mission-control">
      <div className="fb-overlay" onClick={deactivate}></div>
      <div className="fb-windows-container" ref={containerRef}></div>
      <input 
        className="fb-search" 
        type="text" 
        placeholder="Search windows..."
        autoFocus 
      />
    </div>
  );
};

export const FineBites: React.FC<FineBitesProps> = ({ 
  children,
  shortcut = 'Control+ArrowUp',
  animationDuration = 300,
  zoomOutScale = 0.5,
  onActivate,
  onDeactivate
}) => {
  const { activate, deactivate, isActive } = useFineBites();
  
  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const parts = shortcut.split('+');
      const key = parts.pop()?.toLowerCase();
      const modifiers = parts.map(mod => mod.toLowerCase());
      
      const keyMatches = e.key.toLowerCase() === key;
      const modifiersMatch = (
        (modifiers.includes('control') === e.ctrlKey) &&
        (modifiers.includes('alt') === e.altKey) &&
        (modifiers.includes('shift') === e.shiftKey) &&
        (modifiers.includes('meta') === e.metaKey)
      );
      
      if (keyMatches && modifiersMatch) {
        e.preventDefault();
        if (!isActive) {
          activate();
          onActivate?.();
        } else {
          deactivate();
          onDeactivate?.();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcut, activate, deactivate, isActive, onActivate, onDeactivate]);
  
  return (
    <>
      {children}
      <MissionControl />
    </>
  );
};

// Main export with provider
export const FineBitesRoot: React.FC<FineBitesProps> = (props) => {
  return (
    <FineBitesProvider>
      <FineBites {...props} />
    </FineBitesProvider>
  );
};