import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { setAuthTokenGetter } from '@workspace/api-client-react';

type AuthUser = Pick<User, 'id' | 'email' | 'user_metadata'> & { role?: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);
let supabase: SupabaseClient | null = null;
setAuthTokenGetter(async () => {
  const result = await supabase?.auth.getSession();
  return result?.data.session?.access_token ?? null;
});

async function hydrateUser(nextUser: User): Promise<AuthUser> {
  let role: string | undefined;
  if (supabase) {
    const profile = await supabase.from('profiles').select('role').eq('id', nextUser.id).maybeSingle();
    role = profile.data?.role ?? undefined;
  }
  return {
    id: nextUser.id,
    email: nextUser.email,
    user_metadata: nextUser.user_metadata,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let listener: { subscription: { unsubscribe: () => void } } | null = null;
    void fetch('/api/auth/config')
      .then((response) => response.ok ? response.json() as Promise<{ url: string; anonKey: string }> : Promise.reject(new Error('Supabase configuration is unavailable.')))
      .then((config) => {
        if (!active) return;
        supabase = createClient(config.url, config.anonKey);
        return supabase.auth.getUser();
      })
      .then((result) => {
        if (!active || !result) return;
        if (!result.data.user) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        void hydrateUser(result.data.user).then((next) => {
          if (active) {
            setUser(next);
            setIsLoading(false);
          }
        });
        listener = supabase!.auth.onAuthStateChange((_event, session) => {
          if (active && session?.user) void hydrateUser(session.user).then((next) => active && setUser(next));
          else if (active) setUser(null);
        }).data;
      })
      .catch(() => active && setIsLoading(false));
    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAdmin: user?.role === 'admin' || user?.user_metadata?.role === 'admin',
    signIn: async (email, password) => {
      if (supabase) {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) return { error: result.error.message ?? 'Unable to sign in.' };
        if (result.data.user) setUser(await hydrateUser(result.data.user));
        return {};
      }
      return { error: 'Supabase authentication is not configured.' };
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
      setUser(null);
    },
  }), [isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}