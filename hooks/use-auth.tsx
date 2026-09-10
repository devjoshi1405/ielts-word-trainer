"use client";

import * as React from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileRow } from "@/types/database.types";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signInWithDemo: () => Promise<{ error: null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    options?: { fullName?: string; targetBand?: string }
  ) => Promise<{ error: AuthError | Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
const LOCAL_BACKUP_USER_KEY = "ielts_auth_user_backup_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<ProfileRow | null>(null);
  const [loading, setLoading] = React.useState(true);
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = React.useCallback(async (userId: string) => {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    try {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as ProfileRow);
      }
    } catch (err) {
      console.warn("Failed to fetch user profile:", err);
    }
  }, []);

  React.useEffect(() => {
    const client = getSupabaseBrowserClient();
    
    // Check backup local user first to prevent flash
    if (typeof window !== "undefined") {
      try {
        const backupUserStr = localStorage.getItem(LOCAL_BACKUP_USER_KEY);
        if (backupUserStr) {
          const backup = JSON.parse(backupUserStr);
          if (backup?.id) {
            setUser(backup);
          }
        }
      } catch (e) {
        // ignore
      }
    }

    if (!client) {
      setLoading(false);
      return;
    }

    // Get current initial session from Supabase
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_BACKUP_USER_KEY, JSON.stringify(session.user));
        }
        fetchProfile(session.user.id);
      } else {
        // If Supabase session is null and not demo, clear user
        if (typeof window !== "undefined") {
          const backupUserStr = localStorage.getItem(LOCAL_BACKUP_USER_KEY);
          if (backupUserStr) {
            const backup = JSON.parse(backupUserStr);
            if (backup?.id === "demo-candidate-uuid") {
              setUser(backup);
              setProfile({
                id: "demo-candidate-uuid",
                email: "candidate@ielts.trainer",
                display_name: "IELTS Candidate",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen to Supabase auth state changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_BACKUP_USER_KEY, JSON.stringify(session.user));
        }
        fetchProfile(session.user.id);
      } else {
        if (typeof window !== "undefined") {
          const backupUserStr = localStorage.getItem(LOCAL_BACKUP_USER_KEY);
          if (backupUserStr && JSON.parse(backupUserStr)?.id !== "demo-candidate-uuid") {
            localStorage.removeItem(LOCAL_BACKUP_USER_KEY);
          }
        }
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithPassword = async (email: string, password: string) => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return {
        error: new Error(
          "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file."
        ),
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      setUser(data.user);
      setSession(data.session);
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem(LOCAL_BACKUP_USER_KEY, JSON.stringify(data.user));
      }
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithDemo = async () => {
    const demoUser = {
      id: "demo-candidate-uuid",
      app_metadata: {},
      user_metadata: { full_name: "IELTS Candidate", target_band: "8.5" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: "candidate@ielts.trainer",
      phone: "",
      role: "authenticated",
      updated_at: new Date().toISOString(),
    } as unknown as User;

    setUser(demoUser);
    setProfile({
      id: "demo-candidate-uuid",
      email: "candidate@ielts.trainer",
      display_name: "IELTS Candidate",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_BACKUP_USER_KEY, JSON.stringify(demoUser));
    }
    return { error: null };
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    options?: { fullName?: string; targetBand?: string }
  ) => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return {
        error: new Error(
          "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file."
        ),
        user: null,
      };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.fullName,
            target_band: options?.targetBand || "8.0",
          },
        },
      });

      if (error) return { error, user: null };

      // Also create profile if possible
      if (data.user) {
        try {
          await (client.from("profiles") as any).upsert({
            id: data.user.id,
            email: data.user.email || email,
            display_name: options?.fullName || email.split("@")[0],
          });
        } catch {
          // Ignored if handled by SQL trigger
        }
      }

      setUser(data.user);
      setSession(data.session);
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem(LOCAL_BACKUP_USER_KEY, JSON.stringify(data.user));
      }
      return { error: null, user: data.user };
    } catch (err: any) {
      return { error: err, user: null };
    }
  };

  const signOut = async () => {
    const client = getSupabaseBrowserClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {
        // ignore
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_BACKUP_USER_KEY);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && user.id !== "demo-candidate-uuid") {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        signInWithPassword,
        signInWithDemo,
        signUpWithPassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

