import { User, UserCredentials } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';


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