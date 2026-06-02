import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import HeroSection from '../components/sections/HeroSection'

function PlatformLayout() {
  return (
    <>
    {/* navbar */}
    <Navbar/>

    <main>
        <HeroSection/>
        {/* <Outlet/> */}
    </main>

    {/* footer */}
    </>
  )
}

export default PlatformLayout