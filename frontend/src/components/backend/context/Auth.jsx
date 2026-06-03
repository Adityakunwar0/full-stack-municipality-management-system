import { createContext, useState } from "react";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const userInfo = localStorage.getItem("userInfo");
    const [user, SetUser] = useState(
        userInfo ? JSON.parse(userInfo) : null
    );

    const login = (userData) => {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        SetUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        SetUser(null);
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
};