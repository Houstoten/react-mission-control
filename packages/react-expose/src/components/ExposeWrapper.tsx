import type React from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  useExposeActions,
  useExposeBorderWidth,
  useHighlightedComponent,
  useIsExposeActive,
  useIsMobile,
  useMobileScrollContainer,
} from "../store/exposeStore";
import type { AnimationStyles, ExposeWrapperProps } from "../types";
import "./styles.css";

export const ExposeWrapper: React.FC<ExposeWrapperProps> = ({
  children,
  id: propId,
  className = "",
  style = {},
  label,
}) => {
  // Use React's useId for SSR-safe ID generation
  const generatedId = useId();
  const componentId = useRef(propId || `expose-${generatedId}`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store calculated transform and scale for this window
  const [animationStyles, setAnimationStyles] = useState<AnimationStyles | null>(null);

  // Suppress CSS transition during resize to prevent glitchy intermediate animation
  const [suppressTransition, setSuppressTransition] = useState(false);

  // Hover state for border overlay (replaces imperative event listeners)
  const [isHovered, setIsHovered] = useState(false);

  // Border position state for the portal (desktop only)
  const [borderPosition, setBorderPosition] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);

  // Store last known rect before activation (for portal positioning)
  const lastRectRef = useRef<DOMRect | null>(null);

  // Store original dimensions for the placeholder
  const [placeholderSize, setPlaceholderSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Use Zustand hooks
  const isActive = useIsExposeActive();
  const isMobile = useIsMobile();
  const mobileScrollContainer = useMobileScrollContainer();
  const borderWidth = useExposeBorderWidth();
  const highlightedComponent = useHighlightedComponent();
  const { registerWindow, unregisterWindow, setHighlightedComponent, setActive } =
    useExposeActions();

  // Register/unregister this window with the Expose context
  useEffect(() => {
    registerWindow(componentId.current, wrapperRef);

    return () => {
      unregisterWindow(componentId.current);

      // Clean up any pending animation frames
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [registerWindow, unregisterWindow]);

  // Track the element's rect when not active
  // so we know where to position the portal when expose activates
  useLayoutEffect(() => {
    if (!isActive && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      lastRectRef.current = rect;
      setPlaceholderSize((prev) => {
        if (prev && prev.width === rect.width && prev.height === rect.height) return prev;
        return { width: rect.width, height: rect.height };
      });
    }
  }, [isActive]);

  // Handle highlight timeout after selection
  useEffect(() => {
    const isThisHighlighted = highlightedComponent === componentId.current;

    if (isThisHighlighted) {
      const maxHighlightTimeout = setTimeout(() => {
        setHighlightedComponent(null);
      }, 500);

      return () => {
        clearTimeout(maxHighlightTimeout);
      };
    }

    return undefined;
  }, [highlightedComponent, setHighlightedComponent]);

  // Reset hover state when expose deactivates
  useEffect(() => {
    if (!isActive) {
      setIsHovered(false);
    }
  }, [isActive]);

  // Calculate and store animation properties (desktop grid layout only)
  useLayoutEffect(() => {
    if (!wrapperRef.current || !isActive) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      setAnimationStyles(null);
      setBorderPosition(null);
      setSuppressTransition(false);
      return;
    }

    // Mobile: CSS handles layout via the scroll container — no JS transforms needed
    if (isMobile) {
      setAnimationStyles({
        translateX: 0,
        translateY: 0,
        scale: 1,
        zIndex: 100001,
      });
      setBorderPosition(null);
      return;
    }

    // Desktop: FLIP-inspired position calculation
    const updatePosition = () => {
      if (!wrapperRef.current) return;

      const element = wrapperRef.current;
      const baseRect = lastRectRef.current;
      if (!baseRect) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const allWindows = document.querySelectorAll(".expose-window");
      const count = allWindows.length;

      const aspectRatio = viewportWidth / viewportHeight;
      const columnsBase = Math.sqrt(count * aspectRatio);
      const columns = Math.ceil(columnsBase);
      const rows = Math.ceil(count / columns);

      const index = Array.from(allWindows).indexOf(element);

      const gridCol = index % columns;
      const gridRow = Math.floor(index / columns);

      const padding = Math.min(viewportWidth, viewportHeight) * 0.05;
      const cellWidth = (viewportWidth - padding * (columns + 1)) / columns;
      const cellHeight = (viewportHeight - padding * (rows + 1)) / rows;

      const origWidth = baseRect.width;
      const origHeight = baseRect.height;

      const isSmall = origWidth < 200 || origHeight < 150;
      const isVeryLarge = origWidth > viewportWidth * 0.6 || origHeight > viewportHeight * 0.6;

      const maxWidthScale = (cellWidth / origWidth) * 0.85;
      const maxHeightScale = (cellHeight / origHeight) * 0.85;
      let targetScale = Math.min(maxWidthScale, maxHeightScale);

      if (isSmall && targetScale < 0.7) targetScale = Math.max(targetScale, 0.7);
      if (isVeryLarge) targetScale = Math.min(targetScale, 0.25);

      const centerX = padding + gridCol * (cellWidth + padding) + cellWidth / 2;
      const centerY = padding + gridRow * (cellHeight + padding) + cellHeight / 2;
      const baseCenterX = baseRect.left + origWidth / 2;
      const baseCenterY = baseRect.top + origHeight / 2;

      const translateX = Math.round(centerX - baseCenterX);
      const translateY = Math.round(centerY - baseCenterY);
      const scale = parseFloat(targetScale.toFixed(3));

      setAnimationStyles({
        translateX,
        translateY,
        scale,
        zIndex: 100001,
      });

      const visualWidth = origWidth * scale;
      const visualHeight = origHeight * scale;
      const visualCenterX = baseCenterX + translateX;
      const visualCenterY = baseCenterY + translateY;

      const borderOffset = Math.max(4, Math.min(12, 14 * (1 - scale)));

      const scaledVisualWidth = visualWidth * 0.97;
      const scaledVisualHeight = visualHeight * 0.97;
      const containerWidth = scaledVisualWidth + borderOffset * 2;
      const containerHeight = scaledVisualHeight + borderOffset * 2;

      setBorderPosition({
        width: containerWidth,
        height: containerHeight,
        left: Math.round(visualCenterX - containerWidth / 2),
        top: Math.round(visualCenterY - containerHeight / 2),
      });
    };

    updatePosition();

    const handleResize = () => {
      setSuppressTransition(true);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updatePosition);

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        setSuppressTransition(false);
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [isActive, isMobile, borderWidth, label]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive) return;
      e.stopPropagation();

      const exposeId = componentId.current;

      setActive(false);
      setHighlightedComponent(exposeId);

      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.querySelector(`[data-expose-id="${exposeId}"]`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      });
    },
    [isActive, setActive, setHighlightedComponent],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent);
      }
    },
    [isActive, handleClick],
  );

  const handleMouseEnter = useCallback(() => {
    if (isActive) setIsHovered(true);
  }, [isActive]);

  const handleMouseLeave = useCallback(() => {
    if (isActive) setIsHovered(false);
  }, [isActive]);

  // ── Build computed style values ──

  const isHighlighted = highlightedComponent === componentId.current;

  // Mobile: no transform needed (CSS handles layout via scroll container)
  // Desktop: translate + scale to grid cell
  const transformValue =
    animationStyles && isActive && !isMobile
      ? `translate(${animationStyles.translateX}px, ${animationStyles.translateY}px) scale(${animationStyles.scale})`
      : "none";

  const transitionValue = suppressTransition
    ? "none"
    : `transform var(--expose-transition-duration) var(--expose-transition-easing), opacity var(--expose-transition-duration) ease, box-shadow 0.3s ease, filter var(--expose-transition-duration) ease`;

  // ── Positioning styles ──

  const getPositionStyles = (): React.CSSProperties => {
    if (!isActive) {
      return { width: "100%", height: "100%" };
    }

    // Mobile: relative positioning within scroll container (CSS handles dimensions)
    if (isMobile) {
      return {
        background: "var(--expose-window-bg, #ffffff)",
      };
    }

    // Desktop: fixed positioning at original location
    if (lastRectRef.current) {
      return {
        position: "fixed" as const,
        left: lastRectRef.current.left,
        top: lastRectRef.current.top,
        width: lastRectRef.current.width,
        height: lastRectRef.current.height,
      };
    }

    return { width: "100%", height: "100%" };
  };

  // ── Window element ──

  const windowElement = (
    <div
      ref={wrapperRef}
      className={`expose-window ${isActive ? "expose-window-active" : ""} ${isHighlighted ? "expose-window-highlighted" : ""} ${className}`}
      onClick={isActive ? handleClick : undefined}
      onKeyDown={isActive ? handleKeyDown : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={isActive ? "button" : undefined}
      tabIndex={isActive ? 0 : undefined}
      aria-label={isActive ? (label || "Exposed window") : undefined}
      style={{
        ...style,
        ...getPositionStyles(),
        transition: transitionValue,
        transformOrigin: "center center",
        willChange:
          isActive || isHighlighted ? "transform, opacity, filter" : "auto",
        zIndex:
          animationStyles && isActive
            ? animationStyles.zIndex
            : isHighlighted
              ? 1000
              : "auto",
        transform: transformValue,
        background: isActive ? "var(--expose-window-bg, #ffffff)" : "transparent",
        boxShadow: isActive
          ? undefined
          : isHighlighted
            ? "0 0 0 4px var(--expose-highlight-muted), 0 5px 20px rgba(0, 0, 0, 0.2)"
            : "none",
        pointerEvents: "auto",
        filter: isHighlighted ? "none" : "blur(0px)",
      }}
      data-expose-id={componentId.current}
      data-scale={animationStyles?.scale || 1}
      data-highlighted={isHighlighted ? "true" : "false"}
    >
      {children}

      {/* Mobile: inline border overlay */}
      {isActive && isMobile && (
        <div className="expose-mobile-border" />
      )}

      {/* Mobile: inline label (always visible, no hover needed on touch) */}
      {isActive && isMobile && label && (
        <div className="expose-mobile-label">
          {label}
        </div>
      )}
    </div>
  );

  // ── Determine portal target ──
  // Mobile: portal into the shared scroll container
  // Desktop: portal directly to document.body
  const getPortalTarget = () => {
    if (isMobile && mobileScrollContainer) return mobileScrollContainer;
    if (typeof document !== "undefined") return document.body;
    return null;
  };

  const portalTarget = isActive ? getPortalTarget() : null;

  return (
    <>
      <div
        className="expose-container"
        style={{
          position: "relative",
          zIndex: isActive ? 100000 : "auto",
          ...(isActive && placeholderSize
            ? {
                width: placeholderSize.width,
                height: placeholderSize.height,
              }
            : {}),
        }}
      >
        {isActive && portalTarget ? createPortal(windowElement, portalTarget) : windowElement}
      </div>

      {/* Desktop border overlay via React Portal (skipped on mobile — inline instead) */}
      {isActive &&
        !isMobile &&
        borderPosition &&
        createPortal(
          <div
            className="expose-window-border-container"
            style={{
              position: "fixed",
              pointerEvents: "none",
              zIndex: 100002,
              overflow: "visible",
              boxSizing: "border-box",
              width: `${borderPosition.width}px`,
              height: `${borderPosition.height}px`,
              left: `${borderPosition.left}px`,
              top: `${borderPosition.top}px`,
            }}
          >
            <div
              className={`expose-window-border-overlay ${isHovered ? "hover" : ""}`}
              style={{
                borderWidth: `${borderWidth}px`,
                borderStyle: "solid",
                borderColor: isHovered ? "var(--expose-highlight)" : "transparent",
                borderRadius: "6px",
              }}
            />
            {label && (
              <div
                className="expose-window-label"
                style={{
                  opacity: isHovered ? 1 : 0,
                  position: "absolute",
                  top: "auto",
                  bottom: "-30px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  height: "auto",
                  minHeight: "fit-content",
                  maxWidth: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--expose-label-bg)",
                  color: "var(--expose-label-color)",
                  padding: "var(--expose-label-padding)",
                  borderRadius: "4px",
                  fontSize: "var(--expose-label-font-size)",
                  fontWeight: "var(--expose-label-font-weight)",
                  whiteSpace: "nowrap",
                  transition: "opacity var(--expose-transition-duration) ease",
                  pointerEvents: "none",
                  zIndex: 100003,
                }}
              >
                {label}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};
