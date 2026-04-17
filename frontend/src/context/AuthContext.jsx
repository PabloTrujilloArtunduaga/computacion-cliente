import { Children, createContext, useContext, useState } from "react";


import { registerRequest } from "../api/auth";


export const AuthConext = createContext()

export const useAuth = () => {
    const context = useContext(AuthConext)

    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
} 

export const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null)

        const signup = async (user) => {
            const res = await registerRequest(values)
            console.log(res.data)
            setUser(res.data)
        }

        return(
            <AuthConext.Provider>
                value = {{
                    signup,
                    user,
                }}

                {children}

            </AuthConext.Provider>
        )
}