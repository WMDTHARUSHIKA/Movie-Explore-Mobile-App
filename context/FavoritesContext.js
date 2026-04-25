import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid;

  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    console.log("[Favorites] uid =", uid);

    if (!uid) {
      setFavorites([]);
      setReady(true);
      return;
    }

    const colRef = collection(db, "users", uid, "favorites");

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => d.data());
        console.log("[Favorites] snapshot size =", list.length);
        setFavorites(list);
        setReady(true);
      },
      (err) => {
        console.log("[Favorites] onSnapshot ERROR:", err?.message || err);
        setFavorites([]);
        setReady(true);
      }
    );

    return unsub;
  }, [uid]);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => String(m?.id) === String(id)),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (movie) => {
      try {
        console.log("[Favorites] toggle called:", movie?.id);

        if (!uid) return console.log("[Favorites] toggle blocked: not logged in");
        if (!movie?.id) return console.log("[Favorites] toggle blocked: missing movie.id", movie);

        const ref = doc(db, "users", uid, "favorites", String(movie.id));
        const snap = await getDoc(ref);

        if (snap.exists()) {
          await deleteDoc(ref);
          console.log("[Favorites] removed", movie.id);
        } else {
          await setDoc(ref, { ...movie, id: movie.id, createdAt: serverTimestamp() });
          console.log("[Favorites] added", movie.id);
        }
      } catch (e) {
        console.log("[Favorites] toggle ERROR:", e?.message || e);
      }
    },
    [uid]
  );

  const clearFavorites = useCallback(async () => {
    try {
      if (!uid) return;
      const batch = writeBatch(db);
      favorites.forEach((m) => {
        if (!m?.id) return;
        batch.delete(doc(db, "users", uid, "favorites", String(m.id)));
      });
      await batch.commit();
      console.log("[Favorites] cleared");
    } catch (e) {
      console.log("[Favorites] clearFavorites ERROR:", e?.message || e);
    }
  }, [uid, favorites]);

  const value = useMemo(
    () => ({ favorites, ready, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, ready, isFavorite, toggleFavorite, clearFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}