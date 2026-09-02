export interface UserProfileData {
  name?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  signatureDataUrl?: string;
  updatedAt?: string;
}

const PROFILES_STORAGE_KEY = "smartsarabun_saved_user_profiles";

export function getSavedUserProfile(userKey: string): UserProfileData | null {
  if (typeof window === "undefined" || !userKey) return null;
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw);
    const cleanKey = userKey.trim().toLowerCase();
    return store[cleanKey] || null;
  } catch (err) {
    console.error("Failed to load user profile:", err);
    return null;
  }
}

export function saveUserProfile(userKey: string, data: UserProfileData): void {
  if (typeof window === "undefined" || !userKey) return;
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const cleanKey = userKey.trim().toLowerCase();
    store[cleanKey] = {
      ...store[cleanKey],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error("Failed to save user profile:", err);
  }
}
