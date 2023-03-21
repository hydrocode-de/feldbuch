import React, { createContext, useContext, useEffect, useState } from "react";
import localforage from "localforage";
import { useAuth } from "../supabase/auth";

interface SettingsState {
    user_id?: string;
}

const initialState: SettingsState = {}

const SettingsContext = createContext(initialState)

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user_id, setUserId] = useState<string | undefined>(undefined)

    // get the auth context
    const { user } = useAuth()

    // load the user id from localStorage
    useEffect(() => {
        localforage.getItem<string>('last_user_id', (err, value) => {
            if (value) {
                setUserId(value)
            } else {
                setUserId(undefined)
            }
        })
    }, [])

    // subscribe to user changes
    useEffect(() => {
        if (user && user.id !== user_id) {
            localforage.setItem<string>('last_user_id', user.id)
                .then(() => {
                    setUserId(user.id)
                })
        }
    }, [user])

    // build the value
    const value = {
        user_id
    }

    return <>
        <SettingsContext.Provider value={value}>
            { children }
        </SettingsContext.Provider>
    </>
}

export const useSettings = () => {
    return useContext(SettingsContext);
}