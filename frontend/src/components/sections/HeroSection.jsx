import React from 'react'

import benedetaBgImg from '../../assets/webcore_imgs/benedetta.png'
import { Gamepad,ArrowBigLeft, ArrowLeft, ArrowRight, Crown } from 'lucide-react'
import JoinTournamentButton from '../button/JoinTournament'

function HeroSection() {
  return (
    <section className='max-w-[screen] mx-auto relative h-screen'>

    <img className='absolute -z-10 inset-0 h-full w-full object-cover' src={benedetaBgImg} alt="" />

    <div className=" absolute -z-[10] inset-0 bg-[#f7f4f1]/20 " />

    <div className='pt-30 pl-40 flex flex-col gap-2'>
        <div className='px-4 py-1 rounded-2xl bg-white/[0.8] backdrop-blur-2xl border border-gray-200 w-fit
        flex items-center justify-center gap-2 text-[13px] font-[Inter]
        '>
            <span><Gamepad/></span>
            <p>5v5 Mobile Legends Tournament</p>
        </div>

        <div className='pl-2 mt-4 flex items-center justify-center w-fit gap-2 text-gray-500 uppercase text-[12px]'>
            <span className='inline-flex w-6 h-0.5 bg-gray-500'></span>
            <p>for those who refuse to lose.</p>
        </div>

        <div className='mt-4'>
            <p className='font-[BebasNeue] text-7xl font-extrabold'>Your Name</p>
            <p className='font-rouge text-6xl'>Deserves the</p>
            <p className='font-[BebasNeue] text-7xl text-green-700 font-bold'>Spotlight</p>
        </div>

        <div>
            <p className='w-90 text-[14px] text-[#606060]'>The ultimate esports platform champions. <br />
            Join tournaments,climb leaderboards and earn exclusive rewards.
            </p>
        </div>

        
        <div className='w-[300px]'>
         <JoinTournamentButton/>
        </div>        
        
    </div>

    {/* floating card */}

    {/* <div className='absolute b-0 r-0 grid grid-cols-2 w-[300px]'>
       
       <div className='flex flex-col gap-2'>
             <p className='uppercase text-gray-400'>next torunament</p>
            <h5>CHAMPIONS CLASH S2</h5>
            <p>20-23 May 2026</p>
       </div>

       <div>
        <Crown/>
       </div>

    </div> */}

    
    </section>
  )
}

export default HeroSection