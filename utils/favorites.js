import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FAVORITE_MOVIES_V1";

// ---- simple subscribers (works on web + native) ----
const listeners = new Set();

function notify(updatedFavorites) {
  listeners.forEach((fn) => {
    try {
      fn(updatedFavorites);
    } catch {}
  });
}

export function subscribeFavorites(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---- storage helpers ----
export async function getFavorites() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function isFavorite(movieId) {
  const favs = await getFavorites();
  return favs.some((m) => m?.id === movieId);
}

export async function toggleFavorite(movie) {
  if (!movie?.id) return [];

  const favs = await getFavorites();
  const exists = favs.some((m) => m?.id === movie.id);

  const updated = exists ? favs.filter((m) => m?.id !== movie.id) : [movie, ...favs];

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));

  // ✅ tell all screens immediately
  notify(updated);

  return updated;
}

export async function clearFavorites() {
  await AsyncStorage.removeItem(KEY);
  notify([]); // ✅ notify screens
}