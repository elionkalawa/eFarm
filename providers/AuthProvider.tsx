"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { type User, type Profile } from "@/types";
import { logoutAction } from "@/app/auth/actions";
import { usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    // We don't want to set loading to true on every route change,
    // only on initial mount.
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
    // Re-verification of session on every navigation ensures state stays in sync
  }, [fetchUser, pathname]);

  const signOut = async () => {
    // Clear state immediately for better UX
    setUser(null);
    setProfile(null);
    await logoutAction();
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
