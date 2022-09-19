import { createClient, User, UserCredentials } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const supabase = createClient(
    'https://scgobacrsgcstxlcxyqq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZ29iYWNyc2djc3R4bGN4eXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM0OTc3ODksImV4cCI6MTk3OTA3Mzc4OX0.VzkQtHXBwyrNPAo8OUNQeAbO7pQpzxgaW04XQd4IPyY',
    {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
    }
)

interface AuthState {
    user: User | null,
    login?: (data: UserCredentials) => Promise<any>,
    logout?: () => Promise<any>
}

// create a context
const AuthContext = createContext<AuthState>({user: null});


export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // user object
    const [user, setUser] = useState<User | null>(null);

    // subscribe to changes
    useEffect(() => {
        // check for a session
        const session = supabase.auth.session();
        setUser(session?.user ?? null);

        // subscribe to changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(session?.user);
                setUser(session?.user ?? null);
            }
        );

        // return unsubscribe function
        return () => listener?.unsubscribe()

    }, []);

    // create the context functions
    const value = {
        login: (data: UserCredentials) => supabase.auth.signIn(data),
        logout: () => supabase.auth.signOut(),
        user
    };

    return <>
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    </>
}

export const useAuth = () => {
    return useContext(AuthContext)
}