import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import HeroSection from '../components/sections/HeroSection'
import TournamentLanding from '../components/sections/TournamentLanding'

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