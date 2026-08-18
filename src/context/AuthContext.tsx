import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, ADMIN_EMAIL, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfile: (nickname: string, customPhotoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(
    user &&
    user.email &&
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Listen to user profile document
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              // Create initial profile if it doesn't exist
              const initialProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || 'Bảo bối',
                nickname: currentUser.displayName || 'Bảo bối',
                photoURL: currentUser.photoURL,
                updatedAt: new Date().toISOString(),
              };
              setDoc(userDocRef, initialProfile).catch((err) => {
                console.warn('Could not auto-create profile:', err);
              });
              setProfile(initialProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('Profile snapshot error:', error);
            setLoading(false);
          }
        );
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const saveUserProfile = async (nickname: string, customPhotoURL?: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const updatedData: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      nickname: nickname.trim() || user.displayName || 'Bảo bối',
      photoURL: customPhotoURL !== undefined ? customPhotoURL : (profile?.photoURL || user.photoURL),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userDocRef, updatedData, { merge: true });
      setProfile((prev) => (prev ? { ...prev, ...updatedData } : (updatedData as UserProfile)));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, login, logout, saveUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
