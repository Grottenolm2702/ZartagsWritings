import { STORAGE_KEYS } from "../types/campaign";

/**
 * Safe localStorage operations with error handling.
 * All operations wrap try-catch to prevent errors from crashing the app.
 */
export const storageUtils = {
  /**
   * Get item from localStorage, return null if not found or on error
   */
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage, silently fail on error
   */
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore errors (quota exceeded, private mode, etc)
    }
  },

  /**
   * Get parsed JSON item from localStorage
   */
  getJSON: <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Set JSON item in localStorage
   */
  setJSON: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore errors
    }
  },

  // Convenience methods for campaign storage
  getPlayers: <T,>(fallback: T): T =>
    storageUtils.getJSON(STORAGE_KEYS.PLAYERS, fallback),

  setPlayers: (value: unknown): void =>
    storageUtils.setJSON(STORAGE_KEYS.PLAYERS, value),

  getDmId: (): string | null => storageUtils.getItem(STORAGE_KEYS.DM_ID),

  setDmId: (value: string): void =>
    storageUtils.setItem(STORAGE_KEYS.DM_ID, value),

  getCurrentPlayerId: (): string | null =>
    storageUtils.getItem(STORAGE_KEYS.CURRENT_PLAYER_ID),

  setCurrentPlayerId: (value: string): void =>
    storageUtils.setItem(STORAGE_KEYS.CURRENT_PLAYER_ID, value),
};
