/**
 * Hook for managing user preferences in localStorage
 * Stores non-sensitive user preferences like theme, language, etc.
 */

import { useLocalStorage } from "./use-local-storage";

export interface UserPreferences {
  // UI preferences
  theme?: "light" | "dark" | "system";

  // Analysis preferences
  showLowConfidenceRecommendations?: boolean;
  defaultView?: "summary" | "detailed";

  // Notification preferences (if you add notifications)
  emailNotifications?: boolean;

  // Other preferences
  [key: string]: unknown;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  showLowConfidenceRecommendations: true,
  defaultView: "summary",
  emailNotifications: false,
};

/**
 * Hook to manage user preferences
 */
export function useUserPreferences() {
  const [preferences, setPreferences, clearPreferences] = useLocalStorage<UserPreferences>(
    "cloudsaver_user_preferences",
    DEFAULT_PREFERENCES
  );

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    clearPreferences();
  };

  return {
    preferences: { ...DEFAULT_PREFERENCES, ...preferences },
    updatePreference,
    resetPreferences,
    setPreferences,
  };
}
