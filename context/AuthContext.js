import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email, password) => {
    return signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const register = useCallback(async (email, password) => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    // Create a profile doc (optional but recommended)
    try {
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          email: cred.user.email ?? email.trim(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.log("create user profile doc failed:", e);
    }

    return cred;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      uid: user?.uid ?? null,
      initializing,
      login,
      register,
      logout,
    }),
    [user, initializing, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}