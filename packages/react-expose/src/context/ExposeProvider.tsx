import type React from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useIsExposeActive, useExposeActions } from "../store/exposeStore";

interface ExposeProviderProps {
  children: React.ReactNode;
  shortcut?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  blurAmount?: number;
}

export const ExposeProvider: React.FC<ExposeProviderProps> = ({
  children,
  shortcut = "Control+ArrowUp",
  onActivate,
  onDeactivate,
  blurAmount = 10,
}) => {
  const keyHoldTimerRef = useRef<number | null>(null);
  const isActive = useIsExposeActive();
  const { activate, deactivate, setConfig, updateBorderWidthForScreen } = useExposeActions();

  // Initialize and update configuration
  useEffect(() => {
    setConfig({
      shortcut,
      blurAmount,
      onActivate,
      onDeactivate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcut, blurAmount, setConfig]); // Intentionally omit callback functions to prevent infinite loops

  // Update border width when activated
  useEffect(() => {
    if (isActive) {
      updateBorderWidthForScreen();
    }
  }, [isActive, updateBorderWidthForScreen]);

  // Handle keyboard shortcuts
  useEffect(() => {
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
      // Handle arrow key held (without modifiers), activate after 1 second
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
      if (!isActive && shortcut.toLowerCase() === "arrowup" && e.key.toLowerCase() === "arrowup") {
        // If the key was released before the 1 second timer completed, cancel activation
        if (keyHoldTimerRef.current !== null) {
          window.clearTimeout(keyHoldTimerRef.current);
          keyHoldTimerRef.current = null;
        }
      }
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

  // Create backdrop element when Expose is active
  useLayoutEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const backdropRef = { current: null as HTMLDivElement | null };
    let animationFrameId: number | null = null;
    let animationEndTimer: number | null = null;

    // Create backdrop with requestAnimationFrame for smoother animation
    animationFrameId = requestAnimationFrame(() => {
      // Create backdrop overlay
      const backdrop = document.createElement("div");
      backdropRef.current = backdrop;
      backdrop.className = "expose-backdrop";
      backdrop.style.position = "fixed";
      backdrop.style.top = "0";
      backdrop.style.left = "0";
      backdrop.style.width = "100vw";
      backdrop.style.height = "100vh";
      backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Dark overlay instead of blur
      backdrop.style.opacity = "0"; // Start with 0 opacity
      backdrop.style.zIndex = "9000"; // Lower z-index so exposed windows appear above
      backdrop.style.transition = "opacity 0.2s ease";

      // Add click handler to close on backdrop click
      backdrop.addEventListener("click", deactivate);
      document.body.appendChild(backdrop);

      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling by fixing the body position
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Prevents layout shift

      // Animate in
      requestAnimationFrame(() => {
        if (backdrop) backdrop.style.opacity = "1";
      });
    });

    return () => {
      // Clean up animation frame if component unmounts before it runs
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      if (backdropRef.current) {
        const backdrop = backdropRef.current;
        // Animate out
        backdrop.style.opacity = "0";

        // Restore scrolling and position
        const scrollY = parseInt(document.body.style.top || "0", 10) * -1;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);

        // Remove backdrop after animation completes
        animationEndTimer = window.setTimeout(() => {
          requestAnimationFrame(() => {
            if (backdrop.parentNode === document.body) {
              document.body.removeChild(backdrop);
            }
          });
        }, 200);
      }

      // Clean up any remaining timeout
      if (animationEndTimer !== null) {
        window.clearTimeout(animationEndTimer);
      }
    };
  }, [isActive, deactivate, blurAmount]);

  return <>{children}</>;
};
