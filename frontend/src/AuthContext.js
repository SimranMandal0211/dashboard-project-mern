import React, {createContext, useEffect, useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    const [token, setToken] = useState(()=> localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        const verifyToken = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
            });
            setUser(res.data);
            setToken(storedToken);
        } catch (err) {
            console.error('Token verification failed:', err);
            logout(false); // silent logout (no redirect)
        } finally {
            setLoading(false);
        }
        };

        verifyToken();
    }, []);


    const saveAuth = ({ token, user }) => {
        if (token) localStorage.setItem('token', token);

        if (user) localStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const logout = (redirect = true) => {
        localStorage.removeItem('token');            localStorage.removeItem('user');
            setToken(null);
            setUser(null);

            if (redirect) navigate('/login');
        };
    
    const isAuthenticated = !!token;
    const getToken = () => localStorage.getItem('token');

    return (
        <AuthContext.Provider 
            value={{ 
                user,
                token,
                isAuthenticated,
                saveAuth,
                logout,
                getToken,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
    
}