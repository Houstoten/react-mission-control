// Export components (new names)
export { MCWrapper, ExposeWrapper } from "./components/MCWrapper";
export { MCProvider, ExposeProvider } from "./context/MCProvider";
export { MCTrigger, ExposeTrigger } from "./components/MCTrigger";

// Export hooks from Zustand store (new names with legacy aliases)
export {
  mcActions,
  exposeActions,
  useMCActions,
  useExposeActions,
  useMCBorderWidth,
  useExposeBorderWidth,
  useMCStore,
  useExposeStore,
  useMCStore as useMC,
  useExposeStore as useExpose,
  useMCWindows,
  useExposeWindows,
  useHighlightedComponent,
  useIsMCActive,
  useIsExposeActive,
  useIsMobile,
} from "./store/mcStore";

// Export types (new names with legacy aliases)
export type {
  AnimationStyles,
  MCProviderProps,
  MCWrapperProps,
  ExposeProviderProps,
  ExposeWrapperProps,
} from "./types";

// Import styles
import "./components/styles.css";
