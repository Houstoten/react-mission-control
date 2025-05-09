import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { createPortal } from 'react-dom';

// Import custom hooks and styles
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import "./styles/exposeProvider.css";
import "./styles/backdrop.css";

interface ExposeContextType {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
  unregisterWindow: (id: string) => void;
  windows: Map<string, React.RefObject<HTMLDivElement>>;
  borderWidth: number; // Global border width based on screen size
  setActive?: (active: boolean) => void; // Optional method to set active state directly
  highlightedComponent: string | null; // ID of the currently highlighted component
  setHighlightedComponent: (id: string | null) => void; // Set the highlighted component
}

interface ExposeProviderProps {
  children: React.ReactNode;
  shortcut?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  blurAmount?: number;
}

// Create a component for the backdrop that will be rendered via portal
const Backdrop: React.FC<{
  isActive: boolean;
  blurAmount: number;
  onClick: () => void;
}> = ({ isActive, blurAmount, onClick }) => {
  // Create a portal to render the backdrop at the document body level
  return createPortal(
    <div
      className={`expose-backdrop ${isActive ? "visible" : ""}`}
      onClick={onClick}
      style={{
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      }}
    />,
    document.body
  );
};

const ExposeContext = createContext<ExposeContextType>({
  isActive: false,
  activate: () => {},
  deactivate: () => {},
  registerWindow: () => {},
  unregisterWindow: () => {},
  windows: new Map(),
  borderWidth: 3, // Default border width
  highlightedComponent: null,
  setHighlightedComponent: () => {},
});

export const useExpose = () => useContext(ExposeContext);

export const ExposeProvider: React.FC<ExposeProviderProps> = ({
  children,
  shortcut = "Control+ArrowUp",
  onActivate,
  onDeactivate,
  blurAmount = 10,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [windows, setWindows] = useState<
    Map<string, React.RefObject<HTMLDivElement>>
  >(new Map());
  
  // Calculate global border width based on screen size
  const [borderWidth, setBorderWidth] = useState(3); // Default border width
  
  // State to track highlighted component
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);
  
  // Reference to store scroll position
  const scrollPositionRef = useRef(0);

  // Update border width based on screen size when activated
  useEffect(() => {
    if (isActive) {
      const smallScreen = window.innerWidth < 768;
      const mediumScreen = window.innerWidth >= 768 && window.innerWidth < 1200;
      const largeScreen = window.innerWidth >= 1200;
      
      // Set border width based on screen size
      if (smallScreen) {
        setBorderWidth(4); // Thicker borders on small screens
      } else if (mediumScreen) {
        setBorderWidth(3); // Medium borders on medium screens
      } else if (largeScreen) {
        setBorderWidth(2.5); // Thinner borders on large screens
      }
    }
  }, [isActive]);

  const activate = useCallback(() => {
    // Store current scroll position
    scrollPositionRef.current = window.scrollY;
    
    // Prevent scrolling
    document.body.classList.add('expose-active');
    document.body.style.top = `-${scrollPositionRef.current}px`;
    
    // Update state
    setIsActive(true);
    onActivate?.();
  }, [onActivate]);

  const deactivate = useCallback(() => {
    // Restore scrolling and position
    document.body.classList.remove('expose-active');
    document.body.style.top = '';

    // Check if we need to scroll to a selected component
    const scrollTarget = sessionStorage.getItem('exposeScrollTarget');

    // Remove the stored value
    sessionStorage.removeItem('exposeScrollTarget');

    if (scrollTarget) {
      // Use a short timeout to allow the DOM to update before scrolling
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(scrollTarget, 10),
          behavior: 'smooth'
        });
      }, 50);
    } else {
      // Otherwise restore original scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    // Update state
    setIsActive(false);
    onDeactivate?.();
  }, [onDeactivate]);

  const registerWindow = useCallback(
    (id: string, ref: React.RefObject<HTMLDivElement>) => {
      setWindows((prev) => {
        const newMap = new Map(prev);
        newMap.set(id, ref);
        return newMap;
      });
    },
    [],
  );

  const unregisterWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  // Use custom hook for keyboard shortcuts
  useKeyboardShortcut({
    shortcut,
    isActive,
    onActivate: activate,
    onDeactivate: deactivate
  });
  
  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    deactivate();
  }, [deactivate]);

  return (
    <div className="expose-provider">
      {/* Backdrop component rendered via portal */}
      <Backdrop 
        isActive={isActive}
        blurAmount={blurAmount}
        onClick={handleBackdropClick} 
      />
      
      <ExposeContext.Provider
        value={{
          isActive,
          activate,
          deactivate,
          registerWindow,
          unregisterWindow,
          windows,
          borderWidth,
          setActive: setIsActive, // Expose the setState function
          highlightedComponent,
          setHighlightedComponent, // Expose the highlighted component state
        }}
      >
        <div className="expose-content">
          {children}
        </div>
      </ExposeContext.Provider>
    </div>
  );
};