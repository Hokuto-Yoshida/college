import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_USERS_KEY = 'mind_univ_users_v1';
const STORAGE_SESSION_KEY = 'mind_univ_session_v1';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load session on startup
    useEffect(() => {
        const session = localStorage.getItem(STORAGE_SESSION_KEY);
        if (session) {
            try {
                setUser(JSON.parse(session));
            } catch (e) {
                console.error('Session parse error:', e);
                localStorage.removeItem(STORAGE_SESSION_KEY);
            }
        }
        setLoading(false);
    }, []);

    const getUsers = () => {
        const saved = localStorage.getItem(STORAGE_USERS_KEY);
        return saved ? JSON.parse(saved) : [];
    };

    const saveUsers = (users) => {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    };

    const register = (username, password) => {
        const users = getUsers();
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'このユーザー名は既に使用されています' };
        }

        const newUser = {
            id: `u-${Date.now()}`,
            username,
            password, // In a real app, hash this!
            joinedAt: new Date().toISOString(),
            studentId: `MU-${Math.floor(1000 + Math.random() * 9000)}`
        };

        saveUsers([...users, newUser]);

        // Auto login
        const sessionUser = { ...newUser };
        delete sessionUser.password;
        setUser(sessionUser);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));

        return { success: true };
    };

    const login = (username, password) => {
        const users = getUsers();
        const found = users.find(u => u.username === username && u.password === password);

        if (found) {
            const sessionUser = { ...found };
            delete sessionUser.password;
            setUser(sessionUser);
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
            return { success: true };
        }

        return { success: false, message: 'ユーザー名またはパスワードが間違っています' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_SESSION_KEY);
    };

    const updateProfile = (updates) => {
        if (!user) return;

        const users = getUsers();
        const updatedUsers = users.map(u => {
            if (u.id === user.id) {
                return { ...u, ...updates };
            }
            return u;
        });
        saveUsers(updatedUsers);

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
