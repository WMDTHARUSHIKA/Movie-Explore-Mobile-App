import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FAVORITE_MOVIES_V1";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);

  // load once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        setFavorites(raw ? JSON.parse(raw) : []);
      } catch {
        setFavorites([]);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = async (next) => {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const isFavorite = (id) => favorites.some((m) => m?.id === id);

  const toggleFavorite = async (movie) => {
    if (!movie?.id) return;

    const exists = favorites.some((m) => m?.id === movie.id);
    const next = exists ? favorites.filter((m) => m?.id !== movie.id) : [movie, ...favorites];
    await persist(next);
  };

  const clearFavorites = async () => {
    await persist([]);
    try {
      await AsyncStorage.removeItem(KEY);
    } catch {}
  };

  const value = useMemo(
    () => ({ favorites, ready, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, ready]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}