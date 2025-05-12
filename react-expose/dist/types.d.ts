/// <reference types="react" />
export interface ExposeContextType {
    isActive: boolean;
    activate: () => void;
    deactivate: () => void;
    registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
    unregisterWindow: (id: string) => void;
    windows: Map<string, React.RefObject<HTMLDivElement>>;
    borderWidth: number;
    setActive?: (active: boolean) => void;
    highlightedComponent: string | null;
    setHighlightedComponent: (id: string | null) => void;
}
export interface ExposeProviderProps {
    children: React.ReactNode;
    shortcut?: string;
    onActivate?: () => void;
    onDeactivate?: () => void;
    blurAmount?: number;
}
export interface ExposeWrapperProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
}
export interface AnimationStyles {
    transform: string;
    scale: number;
    zIndex: number;
}
