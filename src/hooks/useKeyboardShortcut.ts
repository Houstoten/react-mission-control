import { useEffect, useRef } from 'react';

interface UseKeyboardShortcutProps {
  shortcut: string;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

/**
 * Custom hook to handle keyboard shortcuts for Exposé activation/deactivation
 */
export const useKeyboardShortcut = ({
  shortcut,
  isActive,
  onActivate,
  onDeactivate
}: UseKeyboardShortcutProps) => {
  // Ref for the key hold timer for held arrow key activation
  const keyHoldTimerRef = useRef<number | null>(null);
  
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
          onActivate();
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
          onActivate();
          keyHoldTimerRef.current = null;
        }, 1000);
      }

      // Handle escape to deactivate
      if (isActive && e.key === "Escape") {
        e.preventDefault();
        onDeactivate();
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
  }, [isActive, onActivate, onDeactivate, shortcut]);
};