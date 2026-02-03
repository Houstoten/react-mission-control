import type React from "react";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface MCState {
  // State
  isActive: boolean;
  isMobile: boolean;
  bodyScreenshot: string | null;
  bodyScrollY: number; // scroll position in pixels when screenshot was taken
  bodyViewportHeight: number; // viewport height when screenshot was taken
  mobileScrollContainer: HTMLDivElement | null;
  windows: Map<string, React.RefObject<HTMLDivElement>>;
  borderWidth: number;
  highlightedComponent: string | null;
  shortcut: string;
  blurAmount: number;
  onActivate?: () => void;
  onDeactivate?: () => void;

  // Actions
  setActive: (active: boolean) => void;
  activate: () => void;
  deactivate: () => void;
  setBodyScreenshot: (url: string | null, scrollY?: number, viewportHeight?: number) => void;
  setMobileScrollContainer: (el: HTMLDivElement | null) => void;
  registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
  unregisterWindow: (id: string) => void;
  setHighlightedComponent: (id: string | null) => void;
  setBorderWidth: (width: number) => void;
  setConfig: (config: {
    shortcut?: string;
    blurAmount?: number;
    onActivate?: () => void;
    onDeactivate?: () => void;
  }) => void;
  updateBorderWidthForScreen: () => void;
}

// Create store with SSR support
const createStore = () =>
  create<MCState>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        // Initial state
        isActive: false,
        isMobile: false,
        bodyScreenshot: null,
        bodyScrollY: 0,
        bodyViewportHeight: 0,
        mobileScrollContainer: null,
        windows: new Map(),
        borderWidth: 3,
        highlightedComponent: null,
        shortcut: "Control+ArrowUp",
        blurAmount: 10,

        // Actions
        setActive: (active) =>
          set((state) => {
            if (active && state.onActivate) {
              state.onActivate();
            } else if (!active && state.onDeactivate) {
              state.onDeactivate();
            }
            return { isActive: active };
          }),

        activate: () => {
          const state = get();
          if (!state.isActive) {
            const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
            set({ isMobile });
            state.setActive(true);
            state.updateBorderWidthForScreen();
          }
        },

        deactivate: () => {
          const state = get();
          if (state.isActive) {
            state.setActive(false);
            set({
              isMobile: false,
              bodyScreenshot: null,
              bodyScrollY: 0,
              bodyViewportHeight: 0,
              mobileScrollContainer: null,
            });
          }
        },

        setBodyScreenshot: (url, scrollY = 0, viewportHeight = 0) =>
          set({ bodyScreenshot: url, bodyScrollY: scrollY, bodyViewportHeight: viewportHeight }),

        setMobileScrollContainer: (el) => set({ mobileScrollContainer: el }),

        registerWindow: (id, ref) =>
          set((state) => {
            const newWindows = new Map(state.windows);
            newWindows.set(id, ref);
            return { windows: newWindows };
          }),

        unregisterWindow: (id) =>
          set((state) => {
            const newWindows = new Map(state.windows);
            newWindows.delete(id);
            return { windows: newWindows };
          }),

        setHighlightedComponent: (id) => set({ highlightedComponent: id }),

        setBorderWidth: (width) => set({ borderWidth: width }),

        setConfig: (config) =>
          set((state) => ({
            ...state,
            ...config,
          })),

        updateBorderWidthForScreen: () => {
          if (typeof window === "undefined") return;
          const screenWidth = window.innerWidth;
          let borderWidth = 3;

          if (screenWidth < 768) {
            borderWidth = 4; // Thicker borders on small screens
          } else if (screenWidth >= 768 && screenWidth < 1200) {
            borderWidth = 3; // Medium borders on medium screens
          } else if (screenWidth >= 1200) {
            borderWidth = 2.5; // Thinner borders on large screens
          }

          set({ borderWidth });
        },
      })),
      {
        name: "mc-store",
      },
    ),
  );

export const useMCStore = createStore();

// Selector hooks for performance optimization
export const useIsMCActive = () => useMCStore((state) => state.isActive);
export const useMCWindows = () => useMCStore((state) => state.windows);
export const useHighlightedComponent = () => useMCStore((state) => state.highlightedComponent);
export const useMCBorderWidth = () => useMCStore((state) => state.borderWidth);
export const useIsMobile = () => useMCStore((state) => state.isMobile);
export const useBodyScreenshot = () => useMCStore((state) => state.bodyScreenshot);
export const useBodyScrollY = () => useMCStore((state) => state.bodyScrollY);
export const useBodyViewportHeight = () => useMCStore((state) => state.bodyViewportHeight);
export const useMobileScrollContainer = () => useMCStore((state) => state.mobileScrollContainer);

// Get the store actions directly - these are stable
export const mcActions = {
  activate: () => useMCStore.getState().activate(),
  deactivate: () => useMCStore.getState().deactivate(),
  setActive: (active: boolean) => useMCStore.getState().setActive(active),
  setBodyScreenshot: (url: string | null, scrollY?: number, viewportHeight?: number) =>
    useMCStore.getState().setBodyScreenshot(url, scrollY, viewportHeight),
  registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) =>
    useMCStore.getState().registerWindow(id, ref),
  unregisterWindow: (id: string) => useMCStore.getState().unregisterWindow(id),
  setHighlightedComponent: (id: string | null) => useMCStore.getState().setHighlightedComponent(id),
  setConfig: (config: Parameters<MCState["setConfig"]>[0]) =>
    useMCStore.getState().setConfig(config),
  updateBorderWidthForScreen: () => useMCStore.getState().updateBorderWidthForScreen(),
  setMobileScrollContainer: (el: HTMLDivElement | null) =>
    useMCStore.getState().setMobileScrollContainer(el),
};

// Actions hook that returns the stable actions object
export const useMCActions = () => mcActions;

// Legacy aliases for backward compatibility
export const useExposeStore = useMCStore;
export const useIsExposeActive = useIsMCActive;
export const useExposeWindows = useMCWindows;
export const useExposeBorderWidth = useMCBorderWidth;
export const exposeActions = mcActions;
export const useExposeActions = useMCActions;
