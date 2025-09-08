import type React from "react";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface ExposeState {
  // State
  isActive: boolean;
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
  create<ExposeState>()(
    devtools(
      subscribeWithSelector((set, get) => ({
      // Initial state
      isActive: false,
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
          state.setActive(true);
          state.updateBorderWidthForScreen();
        }
      },

      deactivate: () => {
        const state = get();
        if (state.isActive) {
          state.setActive(false);
        }
      },

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
      name: "expose-store",
    },
  ),
);

export const useExposeStore = createStore();

// Selector hooks for performance optimization
export const useIsExposeActive = () => useExposeStore((state) => state.isActive);
export const useExposeWindows = () => useExposeStore((state) => state.windows);
export const useHighlightedComponent = () => useExposeStore((state) => state.highlightedComponent);
export const useExposeBorderWidth = () => useExposeStore((state) => state.borderWidth);

// Get the store actions directly - these are stable
export const exposeActions = {
  activate: () => useExposeStore.getState().activate(),
  deactivate: () => useExposeStore.getState().deactivate(),
  setActive: (active: boolean) => useExposeStore.getState().setActive(active),
  registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) => 
    useExposeStore.getState().registerWindow(id, ref),
  unregisterWindow: (id: string) => useExposeStore.getState().unregisterWindow(id),
  setHighlightedComponent: (id: string | null) => 
    useExposeStore.getState().setHighlightedComponent(id),
  setConfig: (config: Parameters<ExposeState['setConfig']>[0]) => 
    useExposeStore.getState().setConfig(config),
  updateBorderWidthForScreen: () => useExposeStore.getState().updateBorderWidthForScreen(),
};

// Actions hook that returns the stable actions object
export const useExposeActions = () => exposeActions;
