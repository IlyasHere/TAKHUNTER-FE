import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function DashboardLayout({
  title,
  children,
  menuItems,
  homePath,
  brandSubtitle,
  searchPlaceholder,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F7FD] font-sans text-textDark">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={menuItems}
        homePath={homePath}
        brandSubtitle={brandSubtitle}
      />
      <div className="min-h-screen lg:pl-[260px]">
        <Topbar
          title={title}
          onMenuClick={() => setIsSidebarOpen(true)}
          searchPlaceholder={searchPlaceholder}
        />
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
