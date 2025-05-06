/**
 * Creates a unique ID for component tracking
 * @returns A unique string ID
 */
export const createUniqueId = (): string => {
  return 'expose-' + Math.random().toString(36).slice(2, 11);
};