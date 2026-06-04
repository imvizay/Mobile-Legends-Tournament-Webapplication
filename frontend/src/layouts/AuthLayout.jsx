import React from 'react'
import { Outlet } from 'react-router-dom'
function AuthLayout() {
  return (
    <>
    <section>


    <main>
        <Outlet/>
    </main>
    
    <div>
        
    </div>
    
    </section>
    </>
  )
}

export default AuthLayout