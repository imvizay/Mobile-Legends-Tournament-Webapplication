import { Route, Routes } from 'react-router-dom'

// layouts
import AuthLayout from '../layouts/AuthLayout'
import PlatformLayout from '../layouts/PlatformLayout'

// components

/* Auth components */
// common components
import LoginPage from '../pages/common/LoginPage'
import RegisterPage from '../pages/common/SignupPage'

// auth verification component
import { EmailVerificationPending } from '../pages/common/EmailVerification'
import RegistrationSuccess from '../pages/common/RegistrationSuccess'

// Default Home page component.

/* PlayerDashboard Components */
import PlayerLayout from '../layouts/PlayerLayout'
// Teams
import TeamListingPage from '../pages/player/team/DiscoverTeamPage'


import Overview from '../features/team/pages/Overview'
import TeamLayout from '../layouts/TeamLayout'
import EmptyTeamState from '../pages/player/team/EmptyTeam'
import TeamCreatePage from '../pages/player/team/TeamCreatePage'
import RequireTeam from './RequireTeam'
import DiscoverTeamPage from '../pages/player/team/DiscoverTeamPage'


function AppRoutesConfig() {

  return (

    <Routes>

      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-email' element={<EmailVerificationPending />} />
        <Route path='/activate-account' element={<RegistrationSuccess />} />
      </Route>

      {/* Platform Home */}
      <Route path='/' element={<PlatformLayout />}>

      </Route>

      {/* Player Dashboard */}
      <Route path='/player/' element={<PlayerLayout />}>

        <Route path='create' element={<TeamCreatePage />} />
        <Route path='discover' element={<DiscoverTeamPage />} />

        {/* Team Routes */}
        <Route path="team" element={<RequireTeam />}>

            <Route element={<TeamLayout />}>
                <Route index element={<Overview />} />       
                {/* <Route path="members" element={<Members />} />
                <Route path="applications" element={<Applications />} />
                <Route path="settings" element={<Settings />} /> */}
            </Route>

        </Route>
      
      </Route>


      {/* Admin Routes */}


      {/* Forbidden Or Invalid Routes */}
      {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>

  )

}

export default AppRoutesConfig