import type React from "react";

export interface MCProviderProps {
  children: React.ReactNode;
  shortcut?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
  blurAmount?: number;
  ariaLabel?: string;
}

export interface MCWrapperProps {
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

// Legacy aliases for backward compatibility
export type ExposeProviderProps = MCProviderProps;
export type ExposeWrapperProps = MCWrapperProps;
