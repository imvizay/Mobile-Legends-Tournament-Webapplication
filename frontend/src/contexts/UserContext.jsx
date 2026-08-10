import { LogOut } from 'lucide-react'
import React from 'react'

import { useState, useEffect } from 'react'

import { createContext, useContext } from 'react'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("MLBB_User"));

    if (storedUser) {
      setUser(storedUser)
    }

    setLoading(false)
  }, [])


  const logout = () => {
    localStorage.removeItem("MLBB_User")
    setUser(null)
    // call backend server to blacklist the token.
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}


export const useUserContext = () => {
  return useContext(UserContext)
}