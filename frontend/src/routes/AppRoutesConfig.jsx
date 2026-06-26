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
import { EmailVerificationPending } from '../pages/common/EmailVerification'
import RegistrationSuccess from '../pages/common/RegistrationSuccess'
import PlayerLayout from '../layouts/PlayerLayout'
import TournamentLanding from '../components/sections/TournamentLanding'
import EmptyTeamState from '../pages/player/team/EmptyTeam'
import TeamCreatePage from '../pages/player/team/TeamCreatePage'


function AppRoutesConfig() {

  return (
  
    <Routes>

        {/* Public Routes */}
        <Route element={<AuthLayout/>}>
            <Route path='/login' element={<LoginPage/>} /> 
            <Route path='/register' element={<RegisterPage/>} />
            <Route path='/verify-email' element={<EmailVerificationPending/>}/>
            <Route path='/activate-account' element={<RegistrationSuccess/>}/>
        </Route>

        {/* Platform Home */}
        <Route path='/' element={<PlatformLayout/>}>
          
        </Route>

        <Route path='/player-dashboard' element={<PlayerLayout/>}>
          <Route index element = {<EmptyTeamState/>}/>
          <Route path= '/player-dashboard/team-creation' element =  {<TeamCreatePage/>}/>

        </Route>


        {/* Admin Routes */}


        {/* Forbidden Or Invalid Routes */}
        {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>
    
  )

}

export default AppRoutesConfig