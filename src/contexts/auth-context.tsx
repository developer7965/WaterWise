
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { type User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Your Firebase auth instance

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    // Only subscribe if auth object is available (i.e., Firebase is configured)
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    } else {
      // If auth is null, Firebase is not configured.
      // AppShell should be handling the display of a configuration error.
      // Set loading to false and user to null to reflect this state.
      setUser(null);
      setLoading(false);
    }
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string): Promise<User | null> => {
    if (!auth) throw new Error("Firebase not configured for sign up.");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      setUser(userCredential.user); // Update local state immediately
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
      throw error; // Rethrow to be caught by the caller
    }
  };

  const signIn = async (email: string, password: string): Promise<User | null> => {
    if (!auth) throw new Error("Firebase not configured for sign in.");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) throw new Error("Firebase not configured for sign out.");
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

