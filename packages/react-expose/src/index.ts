// Export components (new names)

export { ExposeTrigger, MCTrigger } from "./components/MCTrigger";
export { ExposeWrapper, MCWrapper } from "./components/MCWrapper";
export { ExposeProvider, MCProvider } from "./context/MCProvider";

// Export hooks from Zustand store (new names with legacy aliases)
export {
  exposeActions,
  mcActions,
  useExposeActions,
  useExposeBorderWidth,
  useExposeStore,
  useExposeStore as useExpose,
  useExposeWindows,
  useHighlightedComponent,
  useIsExposeActive,
  useIsMCActive,
  useIsMobile,
  useMCActions,
  useMCBorderWidth,
  useMCStore,
  useMCStore as useMC,
  useMCWindows,
} from "./store/mcStore";

// Export types (new names with legacy aliases)
export type {
  AnimationStyles,
  ExposeProviderProps,
  ExposeWrapperProps,
  MCProviderProps,
  MCWrapperProps,
} from "./types";

// Import styles
import "./components/styles.css";
