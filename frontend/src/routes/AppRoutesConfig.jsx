import React from 'react'
import { Routes, Route } from 'react-router-dom'

// layouts
import AuthLayout from '../layouts/AuthLayout'
import PlatformLayout from '../layouts/PlatformLayout'

// components
import HeroSection from '../components/sections/HeroSection'

/* Auth components */
// common components
import LoginPage from '../pages/common/LoginPage'
import RegisterPage from '../pages/common/SignupPage'

// auth verification component
import { EmailVerificationPending } from '../pages/common/EmailVerification'
import RegistrationSuccess from '../pages/common/RegistrationSuccess'

// Default Home page component.
import TournamentLanding from '../components/sections/TournamentLanding'

/* PlayerDashboard Components */
import PlayerLayout from '../layouts/PlayerLayout'
// Teams
import TeamListingPage from '../pages/player/team/TeamListingPage';


import EmptyTeamState from '../pages/player/team/EmptyTeam';
import TeamCreatePage from '../pages/player/team/TeamCreatePage';
import TeamPageSkeleton from '../skeletons/playerdash/my_team/TeamPageSkeleton'
import TeamLayout from '../layouts/TeamLayout'
import Overview from '../pages/player/team/Overview'


function AppRoutesConfig() {

  return (
  
    <Routes>

        {/* Public Routes */}
        <Route element  = {<AuthLayout/>}>
            <Route path = '/login' element = {<LoginPage/>} /> 
            <Route path = '/register' element = {<RegisterPage/>} />
            <Route path = '/verify-email' element = {<EmailVerificationPending/>}/>
            <Route path = '/activate-account' element = {<RegistrationSuccess/>}/>
        </Route>

        {/* Platform Home */}
        <Route path='/' element={<PlatformLayout/>}>
          
        </Route>

        <Route path ='/player-dashboard' element = {<PlayerLayout/>}>

          <Route path="team" element={<TeamLayout />}>
            <Route index element={<Overview />} />
            {/* <Route path = "history" element = {<TournamentHistory />} /> */}
            {/* <Route path = "applications" element = {<TeamApplications />} /> */}
            {/* <Route path = "chat" element = {<TeamChat />} /> */}
            {/* <Route path = "settings" element = {<TeamSettings />} /> */}
          </Route>
          
          <Route path = 'no-team'    element =  {<EmptyTeamState/>}/>
          <Route path = 'create-team'   element =  {<TeamCreatePage/>}/>
          <Route path = 'discover-team' element =  {<TeamListingPage/>}/>

        </Route>


        {/* Admin Routes */}


        {/* Forbidden Or Invalid Routes */}
        {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>
    
  )

}

export default AppRoutesConfig