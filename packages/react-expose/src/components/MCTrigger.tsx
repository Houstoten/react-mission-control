import type React from "react";
import { useCallback } from "react";
import { useMCActions, useIsMCActive } from "../store/mcStore";

interface MCTriggerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Render prop — receives `{ isActive, toggle, activate, deactivate }` */
  render?: (api: {
    isActive: boolean;
    toggle: () => void;
    activate: () => void;
    deactivate: () => void;
  }) => React.ReactNode;
  /** HTML element to render. Defaults to "button". */
  as?: React.ElementType;
}

export const MCTrigger: React.FC<MCTriggerProps> = ({
  children,
  className,
  style,
  render,
  as: Component = "button",
}) => {
  const isActive = useIsMCActive();
  const { activate, deactivate } = useMCActions();

  const toggle = useCallback(() => {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }, [isActive, activate, deactivate]);

  if (render) {
    return <>{render({ isActive, toggle, activate, deactivate })}</>;
  }

  return (
    <Component
      className={className}
      style={style}
      onClick={toggle}
      aria-pressed={isActive}
      aria-label={isActive ? "Deactivate Mission Control" : "Activate Mission Control"}
      type={Component === "button" ? "button" : undefined}
    >
      {children}
    </Component>
  );
};

// Legacy alias for backward compatibility
export const ExposeTrigger = MCTrigger;
