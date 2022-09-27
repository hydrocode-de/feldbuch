import { User, UserCredentials } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const ADMIN_EMAILS = ['mareike.mohr@waldbau.uni-freiburg.de', 'mirko@hydrocode.de']
const { REACT_APP_REDIRECT_URL } = process.env;

interface AuthState {
    user: User | null,
    isAdmin: boolean,
    login?: (data: UserCredentials) => Promise<any>,
    logout?: () => Promise<any>
}

// create a context
const AuthContext = createContext<AuthState>({
    user: null,
    isAdmin: false
});


export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // user object
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // subscribe to changes
    useEffect(() => {
        // check for a session
        const session = supabase.auth.session();
        setUser(session?.user ?? null);

        // subscribe to changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
            }
        );

        // return unsubscribe function
        return () => listener?.unsubscribe()

    }, []);

    // update admin information
    useEffect(() => {
        if (user) {
            const admin = ADMIN_EMAILS.includes(user.email as string)
            setIsAdmin(admin)
        } else {
            setIsAdmin(false)
        }
    }, [user])

    // create the context functions
    const value = {
        login: (data: UserCredentials) => supabase.auth.signIn(data, {redirectTo: REACT_APP_REDIRECT_URL}),
        logout: () => supabase.auth.signOut(),
        user,
        isAdmin
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