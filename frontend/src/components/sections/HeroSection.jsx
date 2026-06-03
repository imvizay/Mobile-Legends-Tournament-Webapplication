// hooks
import React from 'react'
import { useThemeAsset } from '../../hooks/useThemeAsset';

// Components
import { Gamepad,ArrowBigLeft, ArrowLeft, ArrowRight, Crown } from 'lucide-react'
import JoinTournamentButton from '../button/JoinTournament';


function HeroSection() {

    const imageAsset = useThemeAsset()


  return (
    <section className='max-w-[screen] mx-auto relative h-screen'>

    <img className='absolute -z-10 inset-0 h-full w-full object-cover' src={imageAsset?.img} alt="benedetta-img" />

    {/* <div className=" absolute -z-[10] inset-0 bg-[#f7f4f1]/20 " /> */}

    <div className='pt-30 pl-40 flex flex-col gap-2'>
        <div className='px-4 py-1 rounded-2xl text-[var(--text-secondary)] bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--border-default)] w-fit
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
           


            <p className='font-[BebasNeue] text-7xl font-extrabold  text-[var(--headline-primary)] '>Your Name</p>
            <p className='font-rouge text-6xl text-[var(--headline-script)] '>Deserves the</p>
            <p className='font-[BebasNeue] text-7xl font-bold text-[var(--headline-accent)] '>Spotlight</p>
        </div>

        <div>
            <p className='w-90 text-[14px] text-[var(--text-muted)]'>The ultimate esports platform champions. <br />
            Join tournaments,climb leaderboards and earn exclusive rewards.
            </p>
        </div>

        
        <div>
         <JoinTournamentButton/>
        </div>        
        
    </div>

    {/* floating card */}

    <div className='absolute px-4 py-2 rounded-2xl bg-[var(--glass-surface)] backdrop-blur-[10px] border border-[var(--border-default)] bottom-20 right-20 grid grid-cols-[3fr_1fr] gap-5 w-[300px]'>
       
       <div className='flex flex-col gap-1'>
             <p className='text-[12px] uppercase text-gray-400'>next torunament</p>
            <h5 className='font-bold text-[var(--text-secondary)]'>CHAMPIONS CLASH S2</h5>
            <p className='text-[12px] text-gray-500'>20-23 May 2026</p>
       </div>

       <div className='place-items-center place-self-center'>
        <Crown className='text-[var(--text-primary)]'/>
       </div>

    </div>

    
    </section>
  )
}

export default HeroSection