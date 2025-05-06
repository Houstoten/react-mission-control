import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface ExposeContextType {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
  unregisterWindow: (id: string) => void;
  windows: Map<string, React.RefObject<HTMLDivElement>>;
}

interface ExposeProviderProps {
  children: React.ReactNode;
  shortcut?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  blurAmount?: number;
}

const ExposeContext = createContext<ExposeContextType>({
  isActive: false,
  activate: () => {},
  deactivate: () => {},
  registerWindow: () => {},
  unregisterWindow: () => {},
  windows: new Map(),
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

  const activate = useCallback(() => {
    setIsActive(true);
    onActivate?.();
  }, [onActivate]);

  const deactivate = useCallback(() => {
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

  // State to track key hold timer
  const keyHoldTimerRef = useRef<number | null>(null);

  // Handle keyboard shortcut
  useEffect(() => {
    let keyDownTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle activate shortcut with modifiers
      if (!isActive && shortcut.includes("+")) {
        const parts = shortcut.split("+");
        const key = parts.pop()?.toLowerCase();
        const modifiers = parts.map((mod) => mod.toLowerCase());

        const keyMatches = e.key.toLowerCase() === key?.toLowerCase();
        const modifiersMatch =
          modifiers.includes("control") === e.ctrlKey &&
          modifiers.includes("alt") === e.altKey &&
          modifiers.includes("shift") === e.shiftKey &&
          modifiers.includes("meta") === e.metaKey;

        if (keyMatches && modifiersMatch) {
          e.preventDefault();
          activate();
        }
      }
      // Handle arrow key held (without modifiers), but only activate after 1 second
      else if (
        !isActive &&
        shortcut.toLowerCase() === "arrowup" &&
        e.key.toLowerCase() === "arrowup"
      ) {
        e.preventDefault();

        // Clear any existing timer
        if (keyHoldTimerRef.current !== null) {
          window.clearTimeout(keyHoldTimerRef.current);
        }

        // Record when the key was pressed
        keyDownTime = Date.now();

        // Set a timer to activate Exposé after 1 second
        keyHoldTimerRef.current = window.setTimeout(() => {
          activate();
          keyHoldTimerRef.current = null;
        }, 1000);
      }

      // Handle escape to deactivate
      if (isActive && e.key === "Escape") {
        e.preventDefault();
        deactivate();
      }
    };

    // Handle key up to cancel activation if released before 1 second
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        !isActive &&
        shortcut.toLowerCase() === "arrowup" &&
        e.key.toLowerCase() === "arrowup"
      ) {
        // If the key was released before the 1 second timer completed, cancel activation
        if (keyHoldTimerRef.current !== null) {
          window.clearTimeout(keyHoldTimerRef.current);
          keyHoldTimerRef.current = null;
        }
      }
      // We no longer deactivate on key release - only with Escape
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (keyHoldTimerRef.current !== null) {
        window.clearTimeout(keyHoldTimerRef.current);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive, activate, deactivate, shortcut]);

  // Create backdrop element when Expose is active and handle body scrolling
  useEffect(() => {
    if (isActive) {
      // Create backdrop overlay
      const backdrop = document.createElement("div");
      backdrop.className = "expose-backdrop";
      backdrop.style.position = "fixed";
      backdrop.style.top = "0";
      backdrop.style.left = "0";
      backdrop.style.width = "100vw";
      backdrop.style.height = "100vh";
      backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      backdrop.style.backdropFilter = `blur(${blurAmount}px)`;
      backdrop.style.zIndex = "9998";
      backdrop.style.transition = "opacity 0.3s ease";

      // Add click handler to close on backdrop click
      backdrop.addEventListener("click", deactivate);

      document.body.appendChild(backdrop);
      
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling by fixing the body position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Prevents layout shift by keeping scrollbar visible
      
      // Animate in
      setTimeout(() => {
        backdrop.style.opacity = "1";
      }, 10);

      return () => {
        // Animate out
        backdrop.style.opacity = "0";
        
        // Restore scrolling and position
        const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);

        // Remove backdrop after animation completes
        setTimeout(() => {
          document.body.removeChild(backdrop);
        }, 300);
      };
    }
  }, [isActive, deactivate, blurAmount]);

  return (
    <ExposeContext.Provider
      value={{
        isActive,
        activate,
        deactivate,
        registerWindow,
        unregisterWindow,
        windows,
      }}
    >
      {children}
    </ExposeContext.Provider>
  );
};
