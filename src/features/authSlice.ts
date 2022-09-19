import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AuthState {
    user?: string;
    token?: string;
}

const initialState: AuthState = {}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => {},
        login: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user
            state.token = action.payload.token
        }
    }
})

export const { login, logout } = authSlice.actions

export const isLoggedIn = (state: RootState) => !!state.auth.user

export default authSlice.reducer