import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../SideBar/SideBar'
import NavBar from '../NavBar/NavBar'

const AdminLayout = () => {
  const [isSideBarVisible, setSidebarVisible] = useState(false)

  const toogleSidebar = () => {
    setSidebarVisible(!isSideBarVisible)
  }
  return (
    <div className="flex flex-col">
      <NavBar toogleSidebar={toogleSidebar} />
      <Sidebar isVisible={isSideBarVisible} toogleSidebar={toogleSidebar} />

      {/* Main Content Area */}
      <div className="flex-grow p-4 mt-0">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout











