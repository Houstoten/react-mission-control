let idCounter = 0;

/**
 * Creates a unique ID for component tracking
 * Uses a counter instead of Math.random() to ensure SSR compatibility
 * @returns A unique string ID
 */
export const createUniqueId = (): string => {
  return `expose-${(++idCounter).toString(36)}`;
};
