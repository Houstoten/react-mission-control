export interface FineBitesProps {
  /**
   * Keyboard shortcut to activate Mission Control
   */
  shortcut?: string;
  
  /**
   * CSS selector for elements that should be treated as windows
   */
  windowSelector?: string;
  
  /**
   * Duration of zoom animations in milliseconds
   */
  animationDuration?: number;
  
  /**
   * Scale factor for zoomed-out windows
   */
  zoomOutScale?: number;
  
  /**
   * Callback fired when Mission Control is activated
   */
  onActivate?: () => void;
  
  /**
   * Callback fired when Mission Control is deactivated
   */
  onDeactivate?: () => void;
  
  /**
   * Children to be rendered and included in Mission Control
   */
  children: React.ReactNode;
}

export interface WindowData {
  id: string;
  element: HTMLElement;
  group?: string;
  name?: string;
  rect: DOMRect;
  clone?: HTMLElement;
}

export interface FineBitesContextValue {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  windows: WindowData[];
  selectedWindowId: string | null;
  setSelectedWindowId: (id: string | null) => void;
}