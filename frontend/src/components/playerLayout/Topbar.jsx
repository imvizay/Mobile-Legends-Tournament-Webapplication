import React,{useState} from 'react';
import {Search,BellDot,ChevronDown , LucideBadgePlus , Wallet , Shield } from 'lucide-react';

import ThemeToggle from '../button/ThemeToggle';

function TopbarHeader() {

    const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
     <header
          className="relative h-[80px] px-8 flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--surface-base)] backdrop-blur-xl " >
                
          {/* Search */}
          <div
            className=" h-12 w-[360px] px-4 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-surface)] flex items-center gap-3
              transition-all
              duration-300
              focus-within:border-[var(--accent-gold)]"
          >

            <Search size={18} className="text-[var(--text-muted)]" />
                
            <input
              type="search"
              placeholder="Search tournaments, teams, players..."

              className=" flex-1 bg-transparent outline-none text-sm
                text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)]"/>
          </div>
                
          {/* Actions */}
          <div className="flex items-center gap-3">
                
            {/* Wallet */}
            <button
              className=" h-12 px-4 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-surface)] flex items-center gap-3
                hover:bg-[var(--surface-elevated)]
                transition-all">
              <Wallet size={16} className="text-[var(--accent-gold)]" />
                
              <div className="text-left">
                <p className="text-[10px] text-[var(--text-muted)] leading-none"> Wallet </p>
                
                <p className="text-sm font-semibold text-[var(--text-primary)]"> ₹2,450 </p>
              </div>
            </button>
                
           
                  
            {/* Theme */}
            <div
              className=" h-12 px-2 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-surface)] flex items-center " >
              <ThemeToggle />
            </div>
                
            {/* Notifications */}
            <button
              className=" relative size-12 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-surface)] flex items-center justify-center
                hover:bg-[var(--surface-elevated)]
                transition-all">
              <BellDot size={18} className="text-[var(--text-primary)]" />
                
              <span className=" absolute top-2 right-2 size-2 rounded-full bg-orange-500 " />
            </button>
                
            {/* Profile */}
            <button
                 onClick={() => setShowProfileMenu(prev => !prev)}
              className=" h-12 pl-2 pr-3 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-surface)] flex items-center gap-3 hover:bg-[var(--surface-elevated)] transition-all " >
              <div
                className=" size-8 rounded-xl bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-light)] shrink-0 " />
        
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--text-primary)]"> Vijay Meena </p>
                
                <p className="text-[11px] text-[var(--text-muted)]"> Player </p>
              </div>
                
              <ChevronDown size={16} className="text-[var(--text-muted)]" />
            </button>

             {/* {showProfileMenu && <ProfileDialog />} */}
                
          </div>
                
        </header>
    </>
  )
}

export default TopbarHeader




