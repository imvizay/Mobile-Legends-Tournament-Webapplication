// hooks
import React from 'react'
import { useThemeAsset } from '../../hooks/common/useThemeAsset';

// Components
import { Gamepad,ArrowBigLeft, ArrowLeft, ArrowRight, Crown, Calendar } from 'lucide-react'
import JoinTournamentButton from '../button/JoinTournament';


function HeroSection() {

    const imageAsset = useThemeAsset()


  return (
    <section className='max-w-[screen] mx-auto relative h-screen'>

    <img className='absolute -z-10 inset-0 h-full w-full  object-cover' 
    
    src={imageAsset?.img} alt="benedetta-img" />

    {/* <div className=" absolute -z-[10] inset-0 bg-[#f7f4f1]/20 " /> */}

    <div className='pt-22 pl-2 md:pt-30 md:pl-40 flex flex-col gap-2'>

        <div className='px-2 text-[10px] rounded-2xl text-[var(--text-secondary)] bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--border-default)] w-fit
        flex items-center justify-center gap-2 font-[Inter]

        md:px-4 md:py-1 md:text-[13px] 
        '>
            <span><Gamepad/></span>
            <p>5v5 Mobile Legends Tournament</p>
        </div>

        <div className='pl-2 mt-2 flex items-center justify-center w-fit gap-2 text-[var(--text-muted)] uppercase text-[10px]
        md:mt-4
        md:text-[12px]
        '>
            <span className=' m:inline-flex w-6 h-0.5 bg-gray-500'></span>
            <p>for those who refuse to lose.</p>
        </div>

        <div className='mt-2 md:mt-4'>
           
            <p className='text-5xl font-[BebasNeue]  font-extrabold  text-[var(--headline-primary)] 
            md:text-7xl
            '>Your Name</p>
            <p className='font-rouge text-5xl md:text-6xl text-[var(--headline-script)] '>Deserves the</p>
            <p className='font-[BebasNeue] text-5xl md:text-7xl font-bold text-[var(--headline-accent)] '>Spotlight</p>
        </div>

        <div>
            <p className='w-45 md:w-90 text-[12px] md:text-[14px] text-[var(--text-muted)]'>The ultimate esports platform champions. <br />
            Join tournaments,climb leaderboards and earn exclusive rewards.
            </p>
        </div>

        <div>
         <JoinTournamentButton/>
        </div>        
        
    </div>

    {/* floating card */}

    <div className='absolute px-4 md:px-4 py-1 md:py-2 rounded-2xl 
    bg-[var(--glass-surface)] 
    backdrop-blur-[10px] 
    border 
    border-[var(--border-default)] 
    bottom-1
    md:bottom-20 md:right-20 
    grid 
    md:grid-cols-[3fr_1fr]  grid-cols-[4fr_1fr]
    gap-5  
    w-[95%]
    ml-[2.5%]
    md:w-[300px]'>
       
       <div className='flex flex-col gap-1'>
             <p className=' text-[10px] md:text-[12px] uppercase text-gray-400'>next torunament</p>
            <h5 className='font-bold text-[var(--text-secondary)]'>CHAMPIONS CLASH S2</h5>
            <p className='flex items-center gap-1 text-[12px] text-[var(--text-muted)]'>
               <Calendar size={10}/> 20-23 May 2026</p>
       </div>

       <div className='flex flex-col items-center justify-center gap-3 md:place-items-center'>
        <Crown className='text-[var(--text-primary)]'/>
        <ArrowRight className='md:hidden text-[var(--text-primary)]'/>
       </div>

    </div>

    
    </section>
  )
}

export default HeroSection