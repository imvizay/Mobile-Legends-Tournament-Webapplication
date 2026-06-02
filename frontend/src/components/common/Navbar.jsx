import React,{useEffect, useState} from 'react'
import {ArrowUpRight} from 'lucide-react'

function Navbar() {
    const [activeLink ,setActiveLink] = useState(1)
    const navigationLinks = [
        {id:1,path:'/',label:'home'},
        {id:2,path:'/tournaments',label:'tournaments'},
        {id:3,path:'/leaderboards',label:'leaderboards'},
        {id:4,path:'/membership',label:'membership'},
        {id:5,path:'/aboutus',label:'About Us'},
    ]

    useEffect(()=>{
        console.log('active-link',activeLink)
    },[activeLink])

  return (
    <header className='fixed z-999 top-5 left-1/2 -translate-x-1/2 px-4 h-[68px] w-[980px] rounded-full flex items-center justify-between
     bg-white/30
    backdrop-blur-[20px]
    border border-gray-200
    shadow-[0_8px_32px_rgba(255,255,255,0.15)]
      '
    >
        <div>
           <h1 className='font-["Google_Sans"] font-[900] text-[20px]'>Gamix.</h1>
        </div>

        <nav className='uppercase font-[Inter] text-[12px] flex gap-3'>

            <div className=" absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"/>

            {navigationLinks.map((element)=>(
                <div key={element.id} onClick = { () => setActiveLink(element.id)} className='flex flex-col items-center '>
                    <span className='inline'>{element.label}</span>
                    {activeLink == element.id ? <span className='w-1 h-1 bg-black rounded-2xl'></span> : ''}
                </div>
            ))}
            
        </nav>

        <div className='font-[Inter] text-[14px] font-[500] flex gap-2'>
            <button className= 'backdrop-blur-1xl bg-black/[0.8] text-white px-4 py-1.5 rounded-2xl flex items-center justify-center '>
                Login 
                <span className='inline'><ArrowUpRight size={20} fontWeight={200}/></span>
            </button>
            <button className='backdrop-blur-1xl bg-white/[0.8] border border-gray-200 text-black px-4 py-2 rounded-2xl '>Register</button>
        </div>
    </header>
  )
}

export default Navbar