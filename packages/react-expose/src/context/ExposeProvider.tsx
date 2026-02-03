import type React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScreenshot, useBodyScrollY, useBodyViewportHeight, useIsExposeActive, useIsMobile, useExposeActions } from "../store/exposeStore";

interface ExposeProviderProps {
  children: React.ReactNode;
  shortcut?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  blurAmount?: number;
  ariaLabel?: string;
}

/**
 * "Current View" card rendered as the first item in the mobile scroll container.
 * Displays a CSS-scaled snapshot of the page captured before activation.
 * Tapping it dismisses the exposé view.
 */
const CurrentViewCard: React.FC<{
  screenshot: string | null;
  scrollY: number;
  viewportHeight: number;
  onClose: () => void;
}> = ({ screenshot, scrollY, viewportHeight, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = useState(0);

  useLayoutEffect(() => {
    if (cardRef.current && viewportHeight > 0) {
      const cardHeight = cardRef.current.offsetHeight;
      const scale = (cardHeight / viewportHeight) * 5;
      setMarginTop(-scrollY * scale);
    }
  }, [scrollY, viewportHeight]);

  return (
    <div
      ref={cardRef}
      className="expose-current-view-card"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Current view — tap to return"
    >
      {screenshot ? (
        <img
          src={screenshot}
          alt=""
          aria-hidden="true"
          className="expose-current-view-img"
          style={{
            width: "100%",
            transformOrigin: "top",
            marginTop,
          }}
        />
      ) : (
        <div className="expose-current-view-placeholder" />
      )}
      <div className="expose-mobile-label">Current View</div>
    </div>
  );
};

export const ExposeProvider: React.FC<ExposeProviderProps> = ({
  children,
  shortcut = "ArrowUp+ArrowUp",
  onActivate,
  onDeactivate,
  blurAmount = 10,
  ariaLabel,
}) => {
  const lastKeyPressRef = useRef<number>(0);
  const previousFocusRef = useRef<Element | null>(null);
  const isActive = useIsExposeActive();
  const isMobile = useIsMobile();
  const { activate, deactivate, setConfig, updateBorderWidthForScreen, setMobileScrollContainer, setBodyScreenshot } = useExposeActions();

  // Capture a screenshot of the page BEFORE activating expose,
  // so the image shows the unblurred page content.
  const handleActivate = useCallback(async () => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (mobile) {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      try {
        const { toJpeg } = await import("html-to-image");
        const dataUrl = await toJpeg(document.body, {
          quality: 0.7,
          cacheBust: true,
          filter: (node: HTMLElement) => {
            if (!(node instanceof HTMLElement)) return true;
            const cls = node.className;
            if (typeof cls === "string" && (
              cls.includes("expose-backdrop") ||
              cls.includes("expose-mobile-scroll-container") ||
              cls.includes("expose-sr-only")
            )) {
              return false;
            }
            return true;
          },
        });
        setBodyScreenshot(dataUrl, scrollY, viewportHeight);
      } catch {
        // Continue without screenshot — card shows shimmer placeholder
      }
    }
    activate();
  }, [activate, setBodyScreenshot]);

  // Callback ref for the mobile scroll container — stores the DOM element in Zustand
  const mobileScrollRef = useCallback(
    (node: HTMLDivElement | null) => {
      setMobileScrollContainer(node);
    },
    [setMobileScrollContainer],
  );

  // State to manage backdrop mount/unmount with exit animation
  const [backdropMounted, setBackdropMounted] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);

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

  // Bridge blurAmount prop to CSS custom property
  useEffect(() => {
    if (blurAmount !== undefined) {
      document.documentElement.style.setProperty('--expose-blur-amount', `${blurAmount}px`);
    }
    return () => {
      document.documentElement.style.removeProperty('--expose-blur-amount');
    };
  }, [blurAmount]);

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
            handleActivate();
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
          handleActivate();
        }
      }
      // Handle single key shortcut
      else if (!isActive && e.key === shortcut) {
        e.preventDefault();
        handleActivate();
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
  }, [isActive, handleActivate, deactivate, shortcut]);

  // Manage backdrop mount/visible state for enter/exit animations
  useEffect(() => {
    if (isActive) {
      setBackdropMounted(true);
      // Delay visibility to next frame so CSS transition triggers
      const rafId = requestAnimationFrame(() => {
        setBackdropVisible(true);
      });
      return () => cancelAnimationFrame(rafId);
    }

    setBackdropVisible(false);
    // Wait for exit animation before unmounting
    const timer = setTimeout(() => {
      setBackdropMounted(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [isActive]);

  // Apply blur to the app content by blurring body's direct children
  // (except expose windows and our own elements). Also disable pointer events
  // on blurred content so only expose windows and backdrop are interactive.
  useLayoutEffect(() => {
    if (!isActive) return undefined;

    const blurredElements: {
      element: HTMLElement;
      savedFilter: string;
      savedTransition: string;
      savedPointerEvents: string;
    }[] = [];

    for (const child of document.body.children) {
      if (!(child instanceof HTMLElement)) continue;
      // Skip expose windows (portaled), border containers, backdrop, and mobile scroll container
      if (
        child.classList.contains("expose-window") ||
        child.classList.contains("expose-window-border-container") ||
        child.classList.contains("expose-backdrop") ||
        child.classList.contains("expose-mobile-scroll-container")
      ) {
        continue;
      }

      blurredElements.push({
        element: child,
        savedFilter: child.style.filter,
        savedTransition: child.style.transition,
        savedPointerEvents: child.style.pointerEvents,
      });
      child.style.transition = "filter 0.3s ease";
      child.style.filter = `blur(${blurAmount}px)`;
      child.style.pointerEvents = "none";
    }

    return () => {
      for (const { element, savedFilter, savedTransition, savedPointerEvents } of blurredElements) {
        element.style.filter = savedFilter;
        element.style.transition = savedTransition;
        element.style.pointerEvents = savedPointerEvents;
      }
    };
  }, [isActive, blurAmount]);

  // Scroll locking when expose is active
  useLayoutEffect(() => {
    if (!isActive) {
      return undefined;
    }

    // Store current scroll position
    const scrollY = window.scrollY;

    // Prevent scrolling by fixing the body position
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll"; // Prevents layout shift

    return () => {
      // Restore scrolling and position
      const savedScrollY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      // Restore scroll position instantly (not smoothly).
      // Pages with `html { scroll-behavior: smooth }` would otherwise
      // animate from 0 to savedScrollY, causing a visible scroll-from-top.
      window.scrollTo({ top: savedScrollY, behavior: "instant" });
    };
  }, [isActive]);

  // Focus management + focus trapping
  useEffect(() => {
    if (isActive) {
      // Store currently focused element
      previousFocusRef.current = document.activeElement;

      // Focus the first exposed window after layout settles
      requestAnimationFrame(() => {
        const firstWindow = document.querySelector(".expose-window-active") as HTMLElement;
        if (firstWindow) {
          firstWindow.focus();
        }
      });

      // Focus trap: constrain Tab/Shift+Tab to exposed windows only
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const focusableWindows = Array.from(
          document.querySelectorAll<HTMLElement>(".expose-window-active[tabindex]"),
        );
        if (focusableWindows.length === 0) return;

        const currentIndex = focusableWindows.indexOf(document.activeElement as HTMLElement);

        e.preventDefault();
        if (e.shiftKey) {
          // Move backward
          const prevIndex = currentIndex <= 0 ? focusableWindows.length - 1 : currentIndex - 1;
          focusableWindows[prevIndex].focus();
        } else {
          // Move forward
          const nextIndex = currentIndex >= focusableWindows.length - 1 ? 0 : currentIndex + 1;
          focusableWindows[nextIndex].focus();
        }
      };

      window.addEventListener("keydown", handleFocusTrap);

      return () => {
        window.removeEventListener("keydown", handleFocusTrap);
      };
    }

    // Restore focus to previously focused element
    if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
    }
    previousFocusRef.current = null;
    return undefined;
  }, [isActive]);

  // Dismiss expose when clicking anywhere outside an expose window.
  // Uses a document-level capture listener for reliability regardless of z-index stacking.
  useEffect(() => {
    if (!isActive) return undefined;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicked on an expose window or the current view card, let their handler deal with it
      if (target.closest(".expose-window") || target.closest(".expose-current-view-card")) return;
      // Clicked outside any expose window — dismiss
      deactivate();
    };

    // Use capture phase so we intercept before anything else, with a small delay
    // to avoid catching the activation click itself
    const timer = setTimeout(() => {
      document.addEventListener("click", handleDocumentClick, true);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isActive, deactivate]);

  const bodyScreenshot = useBodyScreenshot();
  const bodyScrollY = useBodyScrollY();
  const bodyViewportHeight = useBodyViewportHeight();

  return (
    <>
      {children}

      {/* ARIA live region — always rendered, visually hidden */}
      <div aria-live="polite" aria-atomic="true" className="expose-sr-only">
        {isActive ? "Exposé view activated" : ""}
      </div>

      {/* Backdrop via React Portal — appended to body, paints above blurred app content */}
      {backdropMounted &&
        createPortal(
          <div
            id="expose-backdrop-main"
            className="expose-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || "Exposé view"}
            style={{
              opacity: backdropVisible ? 1 : 0,
              transition: "opacity var(--expose-backdrop-duration) ease",
            }}
          />,
          document.body,
        )}

      {/* Mobile scroll container — ExposeWrapper cards portal into this.
          Includes a "Current View" card as the first item that shows a scaled
          snapshot of the page and dismisses expose when tapped. */}
      {isActive &&
        isMobile &&
        createPortal(
          <div
            ref={mobileScrollRef}
            className="expose-mobile-scroll-container"
          >
            <CurrentViewCard screenshot={bodyScreenshot} scrollY={bodyScrollY} viewportHeight={bodyViewportHeight} onClose={deactivate} />
          </div>,
          document.body,
        )}
    </>
  );
};
