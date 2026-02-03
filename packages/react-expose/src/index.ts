// Export components
export { ExposeWrapper } from "./components/ExposeWrapper";
export { ExposeProvider } from "./context/ExposeProvider";
export { ExposeTrigger } from "./components/ExposeTrigger";
// Export hooks from Zustand store
// Legacy hook for backward compatibility
export {
  exposeActions,
  useExposeActions,
  useExposeBorderWidth,
  useExposeStore,
  useExposeStore as useExpose,
  useExposeWindows,
  useHighlightedComponent,
  useIsExposeActive,
  useIsMobile,
} from "./store/exposeStore";

// Export types
export type {
  AnimationStyles,
  ExposeProviderProps,
  ExposeWrapperProps,
} from "./types";

// Import styles
import "./components/styles.css";
