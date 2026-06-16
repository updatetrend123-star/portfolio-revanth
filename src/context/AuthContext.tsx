import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_UID = 'zEsmnrVMPBMKPzhjV6MmVng65Qi1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.uid === ADMIN_UID) {
        const token = await firebaseUser.getIdToken();
        const userData = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || "Admin User",
          uid: firebaseUser.uid
        };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const loggedUser = userCredential.user;
      
      if (loggedUser.uid === ADMIN_UID) {
        const token = await loggedUser.getIdToken();
        const userData = {
          email: loggedUser.email,
          name: loggedUser.displayName || "Admin User",
          uid: loggedUser.uid
        };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        // Logged in user is not the specified administrator
        await signOut(auth);
        return false;
      }
    } catch (e) {
      console.error('Login failed', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout failed', e);
    }
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

