import React, {createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        // verify token here or mount
    }, []);


    const saveAuth = ({ token, user }) => {
        localStorage.setItem('token', token);
        if(user){
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user || null);
        };
    }
    const logout = () => {
        localStorage.removeItem('token');            localStorage.removeItem('user');
            setUser(null);
        };


    return (
        <AuthContext.Provider value={{ user, saveAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
}