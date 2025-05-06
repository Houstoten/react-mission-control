import React, { createContext, useContext, useState } from 'react';
import { FineBitesContextValue, WindowData } from './types';

// Create context with default values
const FineBitesContext = createContext<FineBitesContextValue>({
  isActive: false,
  activate: () => {},
  deactivate: () => {},
  windows: [],
  selectedWindowId: null,
  setSelectedWindowId: () => {},
});

export const useFineBites = () => useContext(FineBitesContext);

export const FineBitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);

  const activate = () => {
    // Discover all windows when activating
    const windowElements = document.querySelectorAll('[data-fb-window]');
    
    const windowsData: WindowData[] = Array.from(windowElements).map((element, index) => {
      const windowElement = element as HTMLElement;
      const windowId = windowElement.getAttribute('data-fb-window') || `window-${index}`;
      const [group, name] = windowId.includes('/') ? windowId.split('/') : [undefined, windowId];
      
      return {
        id: windowId,
        element: windowElement,
        group,
        name,
        rect: windowElement.getBoundingClientRect(),
      };
    });
    
    setWindows(windowsData);
    setIsActive(true);
  };

  const deactivate = () => {
    setIsActive(false);
    setSelectedWindowId(null);
  };

  return (
    <FineBitesContext.Provider 
      value={{ 
        isActive, 
        activate, 
        deactivate, 
        windows, 
        selectedWindowId, 
        setSelectedWindowId 
      }}
    >
      {children}
    </FineBitesContext.Provider>
  );
};