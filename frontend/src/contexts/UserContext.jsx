import { LogOut } from 'lucide-react'
import React from 'react'

import { useState, useEffect } from 'react'


import { createContext, useContext } from 'react'

export const UserContext = createContext()

import { authService } from '../services/authService'

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("MLBB_User");

    if (!storedUser || storedUser === "undefined") {
      setLoading(false)
      return
    }
    try {

      let parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      return

    } catch (error) {

      console.error("Invalid stored user data:", error);
      localStorage.removeItem("MLBB_User");
      setUser(null);

    } finally {

      setLoading(false)

    }

  }, [])


  const logout = async () => {
    try {
      await authService.logoutUser();
    } catch (error) {
      console.error("Error while logout:", error);
    } finally {
      localStorage.removeItem("MLBB_User");
      setUser(null);
      window.location.replace("/");
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}


export const useUserContext = () => {
  return useContext(UserContext)
}