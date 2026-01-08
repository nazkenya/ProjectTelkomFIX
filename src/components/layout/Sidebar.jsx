import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaChevronDown,
  FaSearch,
  FaPlus,
  FaAddressBook,
  FaCalendarAlt,
  FaUserTie,
  FaSignOutAlt,
} from 'react-icons/fa'
import { useAuth } from '../../auth/AuthContext'

// 🔥 MENU SEKARANG LANGSUNG MENGGUNAKAN STRING ROLE DARI DATABASE
const MENU = {
  base: [],

  admin: [
    { to: '/executive', label: 'Executive Dashboard', icon: FaChartLine },
    { to: '/admin/approval', label: 'User Approval', icon: FaUsers },
    { to: '/manager/approval', label: 'User Approval', icon: FaUsers },


  {
      label: 'ECRM Workspace',
      icon: FaUserTie,
      subMenu: [
        { to: '/ecrm-workspace', label: 'Data AM', icon: FaUserTie },
        { to: '/ecrm-workspace/validation', label: 'Validation AM', icon: FaChartLine },
      ],
    },
  ],

  sales: [
    { to: '/', label: 'Beranda', icon: FaHome },
    { to: '/customers', label: 'Pelanggan', icon: FaUsers },
    { to: '/contacts', label: 'Kontak', icon: FaAddressBook },
    { to: '/aktivitas', label: 'Aktivitas', icon: FaCalendarAlt },
    { to: '/sales-plans', label: 'Sales Plan', icon: FaFileAlt },
    {
      label: 'Account Manager',
      icon: FaUserTie,
      subMenu: [
        { to: '/profile/am', label: 'Profile AM', icon: FaUserTie },
        { to: '/profile/am/update', label: 'Update AM', icon: FaChartLine },
      ],
    },
  ],

  manager: [
    { to: '/manager', label: 'Dashboard Kinerja', icon: FaChartLine },
    { to: '/manager/sales-plans', label: 'Sales Plan', icon: FaFileAlt },
    { to: '/manager/approval', label: 'User Approval', icon: FaUsers },
    {
      label: 'Account Manager',
      icon: FaUserTie,
      subMenu: [
        { to: '/profile/am', label: 'Profile AM', icon: FaUserTie },
        { to: '/profile/am/update', label: 'Update AM', icon: FaChartLine },
      ],
    },
  ],
}

export default function Sidebar() {
  const { user, role, logout } = useAuth()

  // 👉 user belum login → sidebar tidak muncul
  if (!user) return null

  const roleItems = MENU[role] || []
  const items = [...MENU.base, ...roleItems]

  const [openMenus, setOpenMenus] = useState({})

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <nav className="fixed left-0 top-0 w-[240px] h-[100dvh] bg-[#0F162A] text-white/80 flex flex-col py-4 z-40">
      
      {/* HEADER */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 grid place-items-center ring-1 ring-white/10 text-white font-semibold">
            M
          </div>
          <div>
            <div className="text-white font-semibold">KAMS</div>
            <div className="text-white/50 text-[11px]">
              Key Account Management System
            </div>
          </div>
        </div>
        <FaChevronDown className="text-white/50" />
      </div>

      <div className="h-px bg-white/10 mx-4" />

      {/* SECTION LABEL */}
      <div className="px-4 py-2 mt-2 flex items-center justify-between">
        <span className="text-xs text-white/60">Main</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-md hover:bg-white/5"><FaSearch /></button>
          <button className="p-1.5 rounded-md hover:bg-white/5"><FaPlus /></button>
        </div>
      </div>

      {/* MENU */}
      <ul className="flex-1 mt-1">
        {items.map((item) => {
          
          // menu dengan submenu
          if (item.subMenu) {
            const isOpen = openMenus[item.label]
            const ParentIcon = item.icon

            return (
              <li key={item.label} className="mx-3 my-1">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    isOpen ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <ParentIcon />
                  <span>{item.label}</span>
                  <FaChevronDown className={`ml-auto ${isOpen && 'rotate-180'}`} />
                </button>

                <ul className={`mt-1 ${isOpen ? 'block' : 'hidden'}`}>
                  {item.subMenu.map((sub) => (
                    <li key={sub.label} className="mx-2 my-1">
                      <NavLink
                        to={sub.to}
                        className={({ isActive }) =>
                          `ml-6 flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                            isActive ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                          }`
                        }
                      >
                        <sub.icon />
                        <span>{sub.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            )
          }

          // menu biasa
          return (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `mx-3 my-1 flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                    isActive ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>

      {/* LOGOUT */}
      <div className="mt-2 pt-3 border-t border-white/10 px-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}
