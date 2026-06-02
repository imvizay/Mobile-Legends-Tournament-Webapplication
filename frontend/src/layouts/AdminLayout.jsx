import React from 'react'
import { Outlet } from 'react-router-dom'
function AdminLayout() {
  return (
    <>
    
    <main>
        <Outlet/>
    </main>

    </>
  )
}

export default AdminLayout