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
import TeamDashboard from '../pages/player/team/dashboard/TeamDashboard'
import TournamentDetail from '../pages/player/onboarding/components/TournamentDetail'
import TournamentPage from '../pages/player/team/components/TournamentDetailPage'


export const dummyTournament = {
  id: 1,

  tournament_name: "MLBB Legends Cup S4",
  game_name: "Mobile Legends: Bang Bang",
  tournament_type: "Double Elimination",
  team_format: "5v5",

  min_teams: 16,
  max_teams: 32,

  background_image_url:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",

  banner_image_url:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=2000&q=80",

  description: `The ultimate battleground for champions.

MLBB Legends Cup Season 4 is back and bigger than ever. This season brings together the most skilled, strategic, and passionate teams from across the region to compete for glory, honor, and a massive prize pool.

Whether you are a rising contender or a seasoned champion, Legends Cup S4 is where legacies are built and champions are made. Only the best will rise to the top.

About the Tournament

Legends Cup S4 is an official competitive tournament organized by Gamix Esports. The tournament follows a Double Elimination bracket format, ensuring every team has a fair chance to prove their strength.

Tournament Highlights

• Double Elimination Bracket for maximum competitive fairness
• High-stakes matches with top-tier teams
• Official match supervision and fair play enforcement
• Exciting rewards and recognition for top performers
• Live updates, match schedules, and standings

Eligibility

• Every team must have 5 active players and up to 2 substitutes.
• All players must meet the minimum account level and rank requirements.
• Teams must adhere to all tournament rules and Code of Conduct.

Rules Summary

• Use of any third-party apps, hacks, or cheats is strictly prohibited.
• Toxic behavior, harassment, or unsportsmanlike conduct will not be tolerated.
• Match results must be reported accurately.
• Organizers' decisions are final and binding.

Match Format

The tournament will be played in a Double Elimination format. All matches except the Grand Final are Best of 3 (Bo3). The Grand Final will be Best of 5 (Bo5).

Rewards & Recognition

• The winning team will receive the Champion title, prize money, and exclusive recognition.
• The runner-up team will receive prize money and official recognition.
• Top teams may be invited to future official events and collaborations.

Join the Legends

Gather your squad, sharpen your strategy, and prepare for battle. Legends Cup S4 is more than just a tournament — it's your chance to make history.

Glory awaits the Legends. Are you ready?`,

  platform_fee: 4000,
  winner_share: 30000,
  runner_up_share: 12000,

  reg_open_date: "2026-08-12",
  reg_open_time: "21:00:00",

  reg_close_date: "2026-08-14",
  reg_close_time: "19:30:00",

  tournament_start_date: "2026-08-15",
  tournament_start_time: "21:00:00",

  tournament_end_date: "2026-08-17",
  tournament_end_time: "19:30:00",

  check_in: "30 Minutes",
  grace_period: "10 Minutes",

  bracket_format: "Double Elimination",
  category: "Weekly",
  competition_type: "Competitive",
  seeding_method: "Rank Based",

  entry_fee: 999,
  entry_type: "Paid",

  minimum_account_level: 30,
  minimum_rank: "Mythic",

  registration_access: "Open",
  registration_approval: "Admin Approval",

  server: "India",

  registration_status: "open",
  status: "upcoming",
  visibility_status: "unpublished",
};

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
        
        <Route index element = {<PlayerDashboard/>}/>
        
        <Route path='tournament/:id/detail' element={<TournamentPage
    
        />} />

        {/* =============================================== */}
        {/* TEAM */}
        {/* =============================================== */}

        <Route path='team/create' element={<TeamCreatePage />} />
        <Route path='team/discover' element={<DiscoverTeamPage />} />

        {/* Team Routes */}
        <Route path="team" element={<RequireTeam />}>
          <Route element={<TeamLayout />}>
            <Route index element = {<TeamDashboard/>}/>
          </Route>

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
          <Route path='create' element={<CreateTournament />} />
        </Route>

      </Route>


      {/* Forbidden Or Invalid Routes */}
      {/* <Route path='*' element={<NotFound/>}/> */}

    </Routes>

  )

}

export default AppRoutesConfig