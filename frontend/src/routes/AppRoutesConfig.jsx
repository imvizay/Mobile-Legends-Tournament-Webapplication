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
// Teams


import Overview from '../features/team/pages/Overview'
import TeamApplication from '../features/team/pages/TeamApplication'
import TeamMembers from '../features/team/pages/TeamMembers'
import TeamLayout from '../pages/player/layouts/TeamLayout'
import DiscoverTeamPage from '../pages/player/team/DiscoverTeamPage'
import TeamCreatePage from '../pages/player/team/TeamCreatePage'
import RequireTeam from './RequireTeam'

import AdminTournamentLayout from '../pages/admin/pages/layouts/AdminTournamentLayout'
import AdminTournamentOverview from '../pages/admin/pages/tournament/AdminTournamentOverview'
import CreateTournament from '../pages/admin/pages/tournament/CreateTournament'

import ProtectedRoutes from './ProtectedRoutes'

import AdminUsersOverview from '../pages/admin/pages/users/AdminUsersOverview'
import AdminUsersLayout from '../pages/admin/pages/layouts/AdminUsersLayout'

import PlayerDashboard from '../pages/player/onboarding/PlayerDashboard'


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
      <Route
        path='/player'
        element={<ProtectedRoutes role="player" />}>
        
        <Route index element = {<PlayerDashboard/>}/>

        <Route path='create' element={<TeamCreatePage />} />
        <Route path='discover' element={<DiscoverTeamPage />} />

        {/* Team Routes */}
        <Route path="team" element={<RequireTeam />}>
          <Route element={<TeamLayout />}>
            <Route index element={<Overview />} />
            <Route path="members" element={<TeamMembers />} />
            <Route path="application" element={<TeamApplication />} />
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

        </Route>

      </Route>


      {/* Admin Routes */}
      <Route
        path="/admin"
        element={<ProtectedRoutes role="admin" />}>

        {/* Users */}
        <Route path='users' element={<AdminUsersLayout />}>
          <Route index element={<AdminUsersOverview />} />
        </Route>
        
        {/* Tournaments */}
        <Route path="tournaments" element={<AdminTournamentLayout />}>
          {/* Index Component */}
          <Route index element={<AdminTournamentOverview />} />
          <Route path='create' element={<CreateTournament />} />
        </Route>

      </Route>


      {/* Forbidden Or Invalid Routes */}
      {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>

  )

}

export default AppRoutesConfig