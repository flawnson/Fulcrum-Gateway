// Library imports
import React, {createContext, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTypes} from "../types";

// Create a context
const AuthContext = createContext({auth: "NONE", setAuth: (auth: any) => {}});

const AuthProvider = ({ children }: any) => {
    const [auth, setAuthState] = useState("NONE");

    // Get current auth state from AsyncStorage
    const getAuthState = async () => {
        try {
            const authDataString = await AsyncStorage.getItem("auth");
            const authData = authDataString ? JSON.parse(authDataString) : undefined
            console.log(auth)
            setAuthState(authData);
            console.log(auth)
        } catch (err) {
            setAuthState("NONE");
        }
    };

    // Update AsyncStorage & context state
    const setAuth = async (auth: any) => {
        try {
            await AsyncStorage.setItem("auth", JSON.stringify(auth));
            // Configure axios headers
            // Reducer to change authentication state according to what kind of user is logged in
            setAuthState(auth);
        } catch (error) {
            await Promise.reject(error);
        }
    };

    useEffect(() => {
        getAuthState().then()
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
