/**
 * LocalStorage utilities with error handling
 */

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get item from localStorage
 * @returns The stored value or null if not found/error
 */
export function getLocalStorageItem(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get localStorage item "${key}":`, error);
    return null;
  }
}

/**
 * Set item in localStorage
 * @returns true if successful, false otherwise
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set localStorage item "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 * @returns true if successful, false otherwise
 */
export function removeLocalStorageItem(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove localStorage item "${key}":`, error);
    return false;
  }
}

/**
 * Get and parse JSON from localStorage
 * @returns Parsed object or null if not found/parse error
 */
export function getLocalStorageJSON<T>(key: string): T | null {
  const value = getLocalStorageItem(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage JSON for "${key}":`, error);
    return null;
  }
}

/**
 * Stringify and set JSON in localStorage
 * @returns true if successful, false otherwise
 */
export function setLocalStorageJSON<T>(key: string, value: T): boolean {
  try {
    const json = JSON.stringify(value);
    return setLocalStorageItem(key, json);
  } catch (error) {
    console.warn(`Failed to stringify JSON for localStorage "${key}":`, error);
    return false;
  }
}
