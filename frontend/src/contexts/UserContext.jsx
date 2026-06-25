import { LogOut } from 'lucide-react'
import React from 'react'

import { useState,useEffect } from 'react'

import { createContext,useContext } from 'react'

export const UserContext = createContext()

export const UserProvider = ({children}) => {

    const [user,setUser] = useState(null)

    useEffect( () => {
      const storedUser = JSON.parse(localStorage.getItem("MLBB_User"))
      
      if(!storedUser){
        setUser(null)
        return
      }

      setUser(storedUser)
      console.log("Context user",storedUser)
    } ,[])

  
    const logout = () => {
        localStorage.removeItem("MLBB_User")
        setUser(null)
        // call backend server to blacklist the token.
    }

  return (
    <UserContext.Provider value={{user,setUser,logout}}>
        {children}
    </UserContext.Provider>
  )
}


export const useUserContext = () => {
  return useContext(UserContext)
}