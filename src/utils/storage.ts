/**
 * Safe localStorage wrapper that gracefully falls back to an in-memory store
 * if localStorage is inaccessible (e.g. sandboxed iframes, strict third-party cookie blocking, Incognito).
 */

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[Storage] localStorage.getItem failed for "${key}", falling back to memory store:`, e);
    }
    return memoryStore[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[Storage] localStorage.setItem failed for "${key}", falling back to memory store:`, e);
    }
    memoryStore[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[Storage] localStorage.removeItem failed for "${key}":`, e);
    }
    delete memoryStore[key];
  }
};
