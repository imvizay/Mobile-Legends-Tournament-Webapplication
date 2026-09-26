import { Route, Routes } from 'react-router-dom'

// layouts
import AuthLayout from '../layouts/AuthLayout'
import PlatformLayout from '../layouts/PlatformLayout'

// components

/* Auth components */
// common components
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/SignupPage'

// auth verification component
import { EmailVerificationPending } from '../pages/auth/EmailVerificationPage'
import RegistrationSuccess from '../pages/auth/RegistrationSuccessPage'

// Default Home page component.

/* PlayerDashboardPage Components */

import TeamLayout from '../features/team/layouts/TeamLayout'
import DiscoverTeamsPage from '../pages/player/team/DiscoverTeamsPage'
import CreateTeamPage from '../pages/player/team/CreateTeamPage'
import RequireTeam from './RequireTeam'

import AdminTournamentLayout from '../layouts/AdminTournamentLayout'
import AdminTournamentOverview from '../pages/admin/tournaments/AdminTournamentOverviewPage'
import CreateTournamentPage from '../pages/admin/tournaments/CreateTournamentPage'

import ProtectedRoutes from './ProtectedRoutes'

import AdminUsersOverview from '../pages/admin/users/AdminUsersOverviewPage'
import AdminUsersLayout from '../layouts/AdminUsersLayout'

import PlayerDashboardPage from '../pages/player/PlayerDashboardPage'
import TeamDashboardPage from '../pages/player/team/TeamDashboardPage'
import TeamTournamentDetailsPage from '../pages/player/tournaments/TeamTournamentDetailsPage'
import TournamentEntryCheckoutPage from '../pages/player/tournaments/TournamentEntryCheckoutPage'
import PaymentSuccess from '../pages/player/payments/PaymentSuccessPage'
import OngoingRegistrationPage from '../pages/admin/tournaments/registration/OngoingRegistrationPage'
import OngoingRegistrationDetailsPage from '../pages/admin/tournaments/registration/OngoingRegistrationDetailsPage'
import BracketAdminLayout from '../features/tournaments/bracket/admin/BracketAdminLayout'
import BracketBuilderPage from '../features/tournaments/bracket/admin/BracketBuilderPage'



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

      {/* =================================================== */}
      {/* PLAYER DASHBOARD */}
      {/* =================================================== */}

      <Route
        path='/player'
        element={<ProtectedRoutes role="player" />}>

        <Route index element={<PlayerDashboardPage />} />

        {/* <Route path='tournament/:id/detail' element={<TeamTournamentDetailsPage />} /> */}

        {/* PAYMENTS */}
        <Route path='payments/success/:payment_reference' element={<PaymentSuccess/>}/>
        <Route path='payments/success/already_paid/:payment_reference' element={<PaymentSuccess/>}/>


        {/* TEAM */}
        <Route path='team/create' element={<CreateTeamPage />} />
        <Route path='team/discover' element={<DiscoverTeamsPage />} />

        {/* Team Routes */}
        <Route path="team" element={<RequireTeam />}>
          <Route element={<TeamLayout />}>
            <Route index element={<TeamDashboardPage />} />
          </Route>
        </Route>

        {/* Tournaments Detail and Payment Flow */}
        <Route path='tournament/:id'>
          <Route path='detail' element={<TeamTournamentDetailsPage />} />
          <Route path='review-contribution' element={<TournamentEntryCheckoutPage />} />
          <Route path='paymethod-wallet' />
          <Route path='verify-payment' />
          <Route path='payment-success' />
        </Route>

      </Route>

      {/* ======================================== */}
      {/* ADMIN ROUTES */}
      {/* ======================================== */}

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
          <Route path='create' element={<CreateTournamentPage />} />
          <Route path='ongoing-registration' element={<OngoingRegistrationPage />} />
          <Route path='ongoing-registration/:ongoingTournamentRegistrationId' element={<OngoingRegistrationDetailsPage />} />

          {/* <Route path='ongoing-registration/:id' element={<PublishedTournament />} /> */}
        
        </Route>

        <Route path='bracket/:tournamentId' element={<BracketAdminLayout/>}> 
          <Route path='create' element={<BracketBuilderPage/>} />

        </Route>

      </Route>

    

      {/* Forbidden Or Invalid Routes */}
      {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>

  )

}

export default AppRoutesConfig