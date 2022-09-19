import { createClient } from '@supabase/supabase-js';
import { createContext } from 'react';

export const supabase = createClient(
    'https://scgobacrsgcstxlcxyqq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZ29iYWNyc2djc3R4bGN4eXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM0OTc3ODksImV4cCI6MTk3OTA3Mzc4OX0.VzkQtHXBwyrNPAo8OUNQeAbO7pQpzxgaW04XQd4IPyY',
    {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
    }
)


// create a context
const AuthContext = createContext({})

export function AuthProvider({ children }) {
    
}