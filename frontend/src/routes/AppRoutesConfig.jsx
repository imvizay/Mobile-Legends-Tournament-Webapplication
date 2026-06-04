import React from 'react'
import { Routes, Route } from 'react-router-dom'

// layouts
import AuthLayout from '../layouts/AuthLayout'
import PlatformLayout from '../layouts/PlatformLayout'

// components
import HeroSection from '../components/sections/HeroSection'

// common components
import LoginPage from '../pages/common/LoginPage'
import RegisterPage from '../pages/common/SignupPage'


function AppRoutesConfig() {

  return (
    <Routes>

        {/* Public Routes */}
        <Route element={<AuthLayout/>}>
            <Route path='/login' element={<LoginPage/>} /> 
            <Route path='/register' element={<RegisterPage/>} />
        </Route>

        {/* Platform Home */}
        <Route path='/' element={<PlatformLayout/>}>
          <Route element={<HeroSection/>}/>
        </Route>


        {/* Admin Routes */}


        {/* Forbidden Or Invalid Routes */}
        {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>
  )

}

export default AppRoutesConfig