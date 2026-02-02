import type React from "react";

export interface ExposeProviderProps {
  children: React.ReactNode;
  shortcut?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  blurAmount?: number;
  ariaLabel?: string;
}

export interface ExposeWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export interface AnimationStyles {
  translateX: number;
  translateY: number;
  scale: number;
  zIndex: number;
}
