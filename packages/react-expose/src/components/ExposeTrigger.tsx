import type React from "react";
import { useCallback } from "react";
import { useExposeActions, useIsExposeActive } from "../store/exposeStore";

interface ExposeTriggerProps {
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

export const ExposeTrigger: React.FC<ExposeTriggerProps> = ({
  children,
  className,
  style,
  render,
  as: Component = "button",
}) => {
  const isActive = useIsExposeActive();
  const { activate, deactivate } = useExposeActions();

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
      aria-label={isActive ? "Deactivate exposé view" : "Activate exposé view"}
      type={Component === "button" ? "button" : undefined}
    >
      {children}
    </Component>
  );
};
