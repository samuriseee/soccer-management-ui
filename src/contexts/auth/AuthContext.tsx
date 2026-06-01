/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import {
    Dispatch,
    FC,
    createContext,
    useEffect,
    useReducer,
    useContext,
    PropsWithChildren,
} from 'react'
import { initialize, reducer, signOut } from './reducers'
import { localStorageService } from '@/core/services/LocalStorage.service'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'

export enum AuthActionType {
    INITIALIZE = 'INITIALIZE',
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT',
}

export interface PayloadAction<T> {
    type: AuthActionType
    payload: T
}

export interface AuthContextType extends AuthState {
    dispatch: Dispatch<PayloadAction<AuthState>>
}

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
}

const AuthContext = createContext<AuthContextType>({
    ...initialState,
    dispatch: () => null,
})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        (async () => {
            const accessToken = localStorageService.getToken()

            if (!accessToken) {
                return dispatch(
                    initialize({ isAuthenticated: false, user: null })
                )
            }
            try {
                const user = await authenticationService.getInformationUser()
                dispatch(initialize({ isAuthenticated: true, user: user }))
            } catch (error) {
                dispatch(initialize({ isAuthenticated: false, user: null }))
                dispatch(signOut())
            }
        })()
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
