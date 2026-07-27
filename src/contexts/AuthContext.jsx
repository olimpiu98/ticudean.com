import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

// Define who is allowed to access the admin panel
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'olimpiu.ticudean@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const isUserAdmin = currentUser?.email === ADMIN_EMAIL;
      setIsAdmin(isUserAdmin);

      if (currentUser && db) {
        try {
          await setDoc(doc(db, 'members', currentUser.uid), {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            role: isUserAdmin ? 'Admin' : 'Member',
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn("Error syncing member profile to Firestore:", err);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      alert("Firebase is not configured yet. Set up .env to enable admin login.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const logout = () => {
    if (auth) signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
