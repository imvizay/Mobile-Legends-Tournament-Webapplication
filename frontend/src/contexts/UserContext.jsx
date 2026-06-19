import React from 'react'

import { useState,useEffect } from 'react'

import { createContext,useContext } from 'react'

export const UserContext = createContext(null)

export const UserProvider = ({children}) => {

    let [user,setUser] = useState({
        username:null,
        email:null,
        mlbb_id:null,
        mlbb_server:null
    })

    const logoutUser = () => {
        // backendapi call to blacklist token
    }

  return (
    <UserContext.Provider>
        {children}
    </UserContext.Provider>
  )
}


export const useUser = () => {
  return useContext(UserContext)
}