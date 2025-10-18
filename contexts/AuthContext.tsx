'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('User profile not found, creating one...', error);
        // Try to create a profile if it doesn't exist
        const created = await createUserProfile(userId);
        if (!created) {
          // Create a minimal profile as last resort
          const minimalProfile = {
            id: userId,
            email: '',
            full_name: '',
            role: 'customer' as const,
            status: 'active' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUserProfile(minimalProfile);
        }
      } else {
        console.log('User profile found:', data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Create a minimal profile as fallback
      const minimalProfile = {
        id: userId,
        email: '',
        full_name: '',
        role: 'customer' as const,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUserProfile(minimalProfile);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string): Promise<boolean> => {
    try {
      // Get user data from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Creating user profile for:', user.email);
        
        // Try direct insert first
        const { data, error } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'customer',
            status: 'active'
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating user profile:', error);
          
          // If it's a conflict error (409), the user already exists, try to fetch it
          if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('conflict')) {
            console.log('User profile already exists, trying to fetch it...');
            try {
              const { data: existingData, error: fetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();
              
              if (fetchError) {
                console.error('Failed to fetch existing profile:', fetchError);
                // Create minimal profile as fallback
                const minimalProfile = {
                  id: userId,
                  email: user.email || '',
                  full_name: user.user_metadata?.full_name || '',
                  role: 'customer' as const,
                  status: 'active' as const,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                setUserProfile(minimalProfile);
                return true;
              } else {
                console.log('Found existing profile:', existingData);
                setUserProfile(existingData);
                return true;
              }
            } catch (fetchError) {
              console.error('Error fetching existing profile:', fetchError);
              // Create minimal profile as fallback
              const minimalProfile = {
                id: userId,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || '',
                role: 'customer' as const,
                status: 'active' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(minimalProfile);
              return true;
            }
          }
          
          // For other errors, try RPC function as fallback
          try {
            const { data: fallbackData, error: fallbackError } = await supabase
              .rpc('create_user_profile', {
                user_id: userId,
                user_email: user.email || '',
                user_full_name: user.user_metadata?.full_name || ''
              });
              
            if (fallbackError) {
              console.error('RPC fallback also failed:', fallbackError);
              // Create a minimal profile object for now
              const minimalProfile = {
                id: userId,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || '',
                role: 'customer' as const,
                status: 'active' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(minimalProfile);
              return true;
            } else {
              console.log('RPC profile creation succeeded');
              setUserProfile(fallbackData);
              return true;
            }
          } catch (rpcError) {
            console.error('RPC call failed:', rpcError);
            // Create a minimal profile object for now
            const minimalProfile = {
              id: userId,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || '',
              role: 'customer' as const,
              status: 'active' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(minimalProfile);
            return true;
          }
        } else {
          console.log('User profile created successfully:', data);
          setUserProfile(data);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error creating user profile:', error);
      setUserProfile(null);
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('AuthContext: Sign in response:', { data, error });
      return { error };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } as AuthError };
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      return { error: error as AuthError | null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isModerator = userProfile?.role === 'moderator' || isAdmin;

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isModerator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}