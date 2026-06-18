import { Home, User } from 'lucide-react';
import React from 'react'

function AsideSidebar({dashboardLinks}) {
  return (
    <>
    {/* Sidebar */}
      <aside className="flex flex-col h-screen border-r border-[var(--border-default)] bg-[var(--surface-base)]">

        <div className="px-6 py-8">
          <h1
            className="text-3xl font-black tracking-tight text-[var(--text-primary)]"
            style={{ fontFamily: "Google Sans" }}>
            GAMIX.
          </h1>
        </div>

        {/* Navigation */}
        <div className="sidebar-scrollbar flex-1 overflow-y-auto px-4">

            <button
                className="mb-2 flex items-center gap-3 w-full px-3 py-1.5 rounded-xl
                  transition-all
                  duration-200
                  text-[var(--text-secondary)]
                  hover:bg-[var(--surface-elevated)]
                  hover:text-[var(--text-primary)]"
            >
                <Home className='size-4'/>
                <span className="text-sm font-medium" style={{ fontFamily: "Google Sans" }} >
                  Home
                </span>
            </button>

          {dashboardLinks.map((group) => (
            <div key={group.section} className="mb-7">
            
              <h3 className="px-3 mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)]">
                {group.section}
              </h3>
          
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                
                  return (
                    <button
                      key={link.path}
                      className=" flex items-center gap-3 w-full px-3 py-1.5 rounded-xl
                        transition-all
                        duration-200
                        text-[var(--text-secondary)]
                        hover:bg-[var(--surface-elevated)]
                        hover:text-[var(--text-primary)]"
                    >

                      <Icon className="size-4" />
                      <span className="text-sm font-medium" style={{ fontFamily: "Google Sans" }} >
                        {link.name}
                      </span>
                    </button>
                  )
                })}
              </div>
              
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="border-t border-[var(--border-default)] p-4 space-y-4">
          
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[var(--surface-elevated)]" />
        
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Vijay
              </p>
        
              <p className="text-xs text-[var(--text-muted)]">
                Mythic Player
              </p>
            </div>
          </div>
        
        </div>
        
      </aside>
    </>
  )
}

export default AsideSidebar