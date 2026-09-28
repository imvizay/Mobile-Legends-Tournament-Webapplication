import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/LandingNavbar'
import HeroSection from '../features/landing/components/HeroSection'
import TournamentLanding from '../features/landing/components/TournamentLanding'

function PlatformLayout() {
  return (
    <>
    {/* navbar */}
    <Navbar/>

    <main className='min-h-screen'>
        <HeroSection/>
        <TournamentLanding/>
    </main>

    {/* footer */}
    </>
  )
}

export default PlatformLayout