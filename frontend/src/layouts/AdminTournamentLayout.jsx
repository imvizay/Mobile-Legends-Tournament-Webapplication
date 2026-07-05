import React from 'react'
import { Outlet } from 'react-router-dom'
function AdminTournamentLayout() {

  return (
    <div>

      <main className='min-h-screen'>
        <Outlet />
      </main>

    </div>
  )
}

export default AdminTournamentLayout