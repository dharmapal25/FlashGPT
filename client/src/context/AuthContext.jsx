import React, { createContext, useContext, useEffect, useState } from 'react'
import API from "../services/api";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);


    const checkAuth = async () => {
        try {
            setLoading(true)
            const response = await API.get("/auth/protected",
                { withCredentials: true }
            )
            setUser(response.data.user)

            console.log("AuthContext >>> : ", response.data.user)
        } catch (err) {
            console.log("Error : ", err)
            setError(err.message || "Something went wrong")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (

        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>

    )
}


export const useAuth = () => useContext(AuthContext);