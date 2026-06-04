
import React,{useEffect, useState} from 'react'
import {ArrowUpRight, Moon, Sun} from 'lucide-react'
import ThemeToggle from '../button/ThemeToggle'

import { useNavigate } from  'react-router-dom'

function DesktopNavbar() {

    const [activeLink ,setActiveLink] = useState(1)

    const navigate = useNavigate()

    const navigationLinks = [
        {id:1,path:'/',label:'home'},
        {id:2,path:'/tournaments',label:'tournaments'},
        {id:3,path:'/highlights',label:'Highlights'},
        // {id:3,path:'/friends',label:'friends'},
        {id:4,path:'/leaderboards',label:'leaderboards'},
        {id:5,path:'/membership',label:'Membership'},
    ]

    useEffect(()=>{
       
        console.log('active-link',activeLink)

    },[activeLink])

  return (

    <header className='
    fixed z-999 top-5 left-1/2 -translate-x-1/2 
    px-4 h-[68px] w-[980px] rounded-full 
    flex items-center justify-around
    bg-[var(--glass-navbar)] backdrop-blur-[2px]
    border border-[var(--border-default)] shadow-[0_8px_32px_rgba(255,255,255,0.15)]
    '>
        <div>
           <h1 className='font-["Google_Sans"] text-[var(--text-primary)] font-[900] text-[20px]'>Gamix.</h1>
        </div>

        <nav className='pl-20 uppercase font-[Inter] text-[var(--text-primary)] text-[12px] flex gap-3'>

            {/* <div className=" absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"/> */}

            {navigationLinks.map((element)=>(
                <div key={element.id} onClick = { () => setActiveLink(element.id)} className='flex flex-col items-center '>
                    <span className='inline'>{element.label}</span>
                    {activeLink == element.id ? <span className='w-1 h-1 bg-[var(--nav-active)] rounded-2xl'></span> : ''}
                </div>
            ))}
            
        </nav>

        <div>
            <ThemeToggle/>
        </div>

        {/* LOGIN/REGISTER BUTTONS */}

        <div className='font-[Inter] text-[14px] font-[500] flex gap-2'>

            <button
            onClick={ () => navigate('/login') }
            className='
            backdrop-blur-1xl px-4 py-1.5 border rounded-2xl 
            flex items-center justify-center
            bg-[var(--action-secondary-bg)]
            text-[var(--action-secondary-text)]
            border
            border-[var(--action-secondary-border)]
            '>
                Login 
                <span className='inline'><ArrowUpRight size={20} fontWeight={200}/></span>
            </button>

            <button 
            onClick={ () => navigate('/register') }
            className='
            backdrop-blur-1xl px-4 py-2 rounded-2xl
            bg-[var(--action-primary-bg)]
            text-[var(--action-primary-text)]
            border border-[var(--action-primary-border)]
            '>
                Register
            </button>

        </div>
    </header>
  )
}

export default DesktopNavbar