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
  const lastKeyPressRef = useRef<number>(0);
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
      // Handle double-tap shortcut (e.g., "ArrowUp+ArrowUp")
      if (!isActive && shortcut === "ArrowUp+ArrowUp") {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const now = Date.now();
          const timeSinceLastPress = now - lastKeyPressRef.current;
          
          // If the last press was within 300ms, activate
          if (timeSinceLastPress < 300) {
            activate();
            lastKeyPressRef.current = 0; // Reset
          } else {
            // Record this press time
            lastKeyPressRef.current = now;
          }
        }
      }
      // Handle activate shortcut with modifiers
      else if (!isActive && shortcut.includes("+")) {
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
      // Handle single key shortcut
      else if (!isActive && e.key === shortcut) {
        e.preventDefault();
        activate();
      }

      // Handle escape to deactivate
      if (isActive && e.key === "Escape") {
        e.preventDefault();
        deactivate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, activate, deactivate, shortcut]);

  // Create backdrop element when Expose is active
  useLayoutEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const backdropRef = { current: null as HTMLDivElement | null };
    const portalRef = { current: null as HTMLDivElement | null };
    let animationFrameId: number | null = null;
    let animationEndTimer: number | null = null;

    // Create backdrop with requestAnimationFrame for smoother animation
    animationFrameId = requestAnimationFrame(() => {
      // Check if a backdrop already exists
      const existingBackdrop = document.getElementById("expose-backdrop-main");
      if (existingBackdrop) {
        // If backdrop already exists, just return
        backdropRef.current = existingBackdrop as HTMLDivElement;
        return;
      }

      // Create backdrop overlay
      const backdrop = document.createElement("div");
      backdropRef.current = backdrop;
      backdrop.id = "expose-backdrop-main";
      backdrop.className = "expose-backdrop";
      backdrop.style.position = "fixed";
      backdrop.style.top = "0";
      backdrop.style.left = "0";
      backdrop.style.width = "100vw";
      backdrop.style.height = "100vh";
      backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Dark overlay
      backdrop.style.opacity = "0"; // Start with 0 opacity
      backdrop.style.zIndex = "9999"; // High z-index for backdrop
      backdrop.style.transition = "opacity 0.2s ease";

      // Add click handler to close on backdrop click
      backdrop.addEventListener("click", deactivate);
      
      // Insert backdrop as first child of body to ensure it's below all other elements
      if (document.body.firstChild) {
        document.body.insertBefore(backdrop, document.body.firstChild);
      } else {
        document.body.appendChild(backdrop);
      }

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

      // Find and remove the backdrop
      const backdrop = document.getElementById("expose-backdrop-main");
      if (backdrop) {
        // Animate out
        backdrop.style.opacity = "0";
        
        // Remove after animation
        setTimeout(() => {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }, 200);
      }
      
      // Also clean up any stray backdrops (for safety)
      const allBackdrops = document.querySelectorAll(".expose-backdrop");
      allBackdrops.forEach((bd) => {
        if (bd instanceof HTMLElement && bd.id !== "expose-backdrop-main") {
          bd.remove();
        }
      });

      // Restore scrolling and position
      const scrollY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      // Restore scroll position
      window.scrollTo(0, scrollY);

      // Clean up any remaining timeout
      if (animationEndTimer !== null) {
        window.clearTimeout(animationEndTimer);
      }
    };
  }, [isActive, deactivate, blurAmount]);

  return <>{children}</>;
};
