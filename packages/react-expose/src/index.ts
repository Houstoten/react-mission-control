// Export components
export { ExposeWrapper } from "./components/ExposeWrapper";
export { ExposeProvider } from "./context/ExposeProvider";
// Export hooks from Zustand store
// Legacy hook for backward compatibility
export {
  useExposeActions,
  useExposeBorderWidth,
  useExposeStore,
  useExposeStore as useExpose,
  useExposeWindows,
  useHighlightedComponent,
  useIsExposeActive,
} from "./store/exposeStore";

// Export types
export type {
  AnimationStyles,
  ExposeProviderProps,
  ExposeWrapperProps,
} from "./types";

// Import styles
import "./components/styles.css";
