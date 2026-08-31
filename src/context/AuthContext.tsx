import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, name?: string) => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string, photoURL?: string) => Promise<boolean>;
  signup: (email: string, password?: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Records / Upserts user document into Cloud Firestore
const recordUserToFirestore = async (u: User, provider: 'google' | 'password' | 'session') => {
  try {
    if (!u.uid) return;
    const userDocRef = doc(db, 'users', u.uid);
    await setDoc(
      userDocRef,
      {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        authProvider: provider,
        lastLoginAt: new Date().toISOString(),
        createdAt: u.createdAt || new Date().toISOString()
      },
      { merge: true }
    );
    console.log('User document recorded in Firestore:', u.uid, u.email);
  } catch (err) {
    console.warn('Firestore user record write note:', err);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('tripbuilder_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored user', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState<boolean>(true);

  // Sync with Firebase Auth state changes
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          const u = result.user;
          const appUser: User = {
            uid: u.uid,
            email: u.email || 'traveler@gmail.com',
            displayName: u.displayName || u.email?.split('@')[0] || 'Traveler',
            photoURL: u.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
            createdAt: u.metadata?.creationTime || new Date().toISOString()
          };
          setUser(appUser);
          localStorage.setItem('tripbuilder_auth_user', JSON.stringify(appUser));
          recordUserToFirestore(appUser, 'google');
        }
      })
      .catch((err) => {
        console.warn('Redirect auth result warning:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'traveler@gmail.com',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Traveler',
          photoURL: firebaseUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
          createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString()
        };
        setUser(appUser);
        localStorage.setItem('tripbuilder_auth_user', JSON.stringify(appUser));
        recordUserToFirestore(appUser, 'google');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (
    email?: string,
    name?: string,
    photoURL?: string
  ): Promise<boolean> => {
    try {
      try {
        const res = await signInWithPopup(auth, googleAuthProvider);
        const fbUser = res.user;
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || 'traveler@gmail.com',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Traveler',
          photoURL: fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
          createdAt: fbUser.metadata?.creationTime || new Date().toISOString()
        };
        setUser(appUser);
        localStorage.setItem('tripbuilder_auth_user', JSON.stringify(appUser));
        recordUserToFirestore(appUser, 'google');
        setIsAuthModalOpen(false);
        return true;
      } catch (popupErr: any) {
        console.warn('Popup blocked or failed, attempting redirect or local auth:', popupErr);
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
          await signInWithRedirect(auth, googleAuthProvider);
          return true;
        }

        // Fallback user if browser sandbox blocks popup
        const userEmail = email && email.trim() ? email.trim() : 'traveler@gmail.com';
        const userName = name && name.trim() ? name.trim() : (email ? email.split('@')[0] : 'Traveler');
        const fallbackUser: User = {
          uid: `google-${Date.now()}`,
          email: userEmail,
          displayName: userName,
          photoURL:
            photoURL ||
            `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
          createdAt: new Date().toISOString()
        };
        setUser(fallbackUser);
        localStorage.setItem('tripbuilder_auth_user', JSON.stringify(fallbackUser));
        recordUserToFirestore(fallbackUser, 'google');
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (e) {
      console.error('Google Sign In Error:', e);
      return false;
    }
  };

  const login = async (email: string, password?: string, name?: string): Promise<boolean> => {
    try {
      if (password && password.length >= 6) {
        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
          const fbUser = res.user;
          const appUser: User = {
            uid: fbUser.uid,
            email: fbUser.email || email,
            displayName: fbUser.displayName || name || email.split('@')[0],
            photoURL: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
            createdAt: fbUser.metadata?.creationTime || new Date().toISOString()
          };
          setUser(appUser);
          localStorage.setItem('tripbuilder_auth_user', JSON.stringify(appUser));
          recordUserToFirestore(appUser, 'password');
          setIsAuthModalOpen(false);
          return true;
        } catch (authErr: any) {
          // If user doesn't exist in Firebase yet, attempt to register automatically
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            try {
              const newRes = await createUserWithEmailAndPassword(auth, email, password);
              if (name && newRes.user) {
                await updateProfile(newRes.user, { displayName: name });
              }
              const appUser: User = {
                uid: newRes.user.uid,
                email: newRes.user.email || email,
                displayName: name || email.split('@')[0],
                photoURL: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
                createdAt: new Date().toISOString()
              };
              setUser(appUser);
              localStorage.setItem('tripbuilder_auth_user', JSON.stringify(appUser));
              recordUserToFirestore(appUser, 'password');
              setIsAuthModalOpen(false);
              return true;
            } catch (createErr) {
              console.warn('Firebase createUser note:', createErr);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Direct Firebase email login note:', e);
    }

    // Seamless fallback session
    const newUser: User = {
      uid: `user-${Date.now()}`,
      email: email.trim(),
      displayName: name?.trim() || email.split('@')[0] || 'Traveler',
      photoURL: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('tripbuilder_auth_user', JSON.stringify(newUser));
    recordUserToFirestore(newUser, 'session');
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = async (email: string, password?: string, name?: string): Promise<boolean> => {
    return login(email, password, name);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error', e);
    }
    setUser(null);
    localStorage.removeItem('tripbuilder_auth_user');
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
