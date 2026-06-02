import React from 'react'
import { Outlet } from 'react-router-dom'
function AuthLayout() {
  return (
    <>
    <section>
    {/* short navbar heading  */}
    <div>
    <h2>Gamix</h2>
    </div>

    <main>
        <Outlet/>
    </main>
    
    <div>
        <p>secured account creation</p>
    </div>
    
    </section>
    </>
  )
}

export default AuthLayout