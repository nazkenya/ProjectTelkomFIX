import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { useAuth } from '../../auth/AuthContext'
import { ROLES, ROLE_LABELS } from '../../auth/roles'
import mockNotifications from '../../data/mockNotifications'

export default function Header() {
  const { user, role } = useAuth()

  const displayName = user?.nama_lengkap || user?.name 
  const initial = displayName?.charAt(0)?.toUpperCase()

  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const panelRef = useRef(null)
  const bellRef = useRef(null)

  const isNotificationRole =
    role === ROLES.manager || role === ROLES.admin || role === ROLES.sales

  const roleLabel = role ? (ROLE_LABELS[role] || role) : null

  useEffect(() => {
    if (isNotificationRole) {
      const feed = mockNotifications
        .filter((notif) => notif.roles.includes(role))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      setNotifications(feed)
    } else {
      setNotifications([])
    }

    setShowNotifications(false)
  }, [role, isNotificationRole])

  useEffect(() => {
    if (!showNotifications) return

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <header className="fixed left-[260px] right-0 top-0 h-[70px] bg-white/90 border-b border-neutral-200 flex items-center justify-end px-6 shadow-sm backdrop-blur-sm z-40">
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={() => isNotificationRole && setShowNotifications((p) => !p)}
            className={`relative p-2 rounded-lg transition-colors duration-200 group ${
              isNotificationRole
                ? 'hover:bg-neutral-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
            aria-label="Notifications"
          >
            <FaBell className="text-neutral-600 text-lg group-hover:text-[#7C3AED] transition-colors" />
            {isNotificationRole && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EC4899] rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {isNotificationRole && showNotifications && (
            <div
              ref={panelRef}
              className="absolute right-0 mt-3 w-[320px] rounded-2xl border border-neutral-200 bg-white shadow-2xl ring-1 ring-neutral-100 overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Notifikasi
                  </p>
                  <p className="text-xs text-neutral-500">
                    {unreadCount > 0
                      ? `${unreadCount} belum dibaca`
                      : 'Semua notifikasi telah dibaca'}
                  </p>
                </div>
                <button
                  onClick={handleMarkAll}
                  className="text-xs font-semibold text-[#2C5CC5] hover:text-[#1E3E99]"
                >
                  Tandai semua
                </button>
              </div>

              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-neutral-500">
                    Belum ada notifikasi
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`w-full text-left px-4 py-3 border-b border-neutral-100 transition-colors ${
                        notif.isRead ? 'bg-white' : 'bg-[#F8FAFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-neutral-900">
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#2C5CC5]" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {formatTimestamp(notif.timestamp)}
                      </p>
                      <p className="text-sm text-neutral-700 mt-1">
                        {notif.message}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#2E3048] font-semibold text-sm ring-1 ring-neutral-200 shadow-sm">
            {initial}
          </div>

          <div className="text-sm">
            <div className="font-semibold text-neutral-800">{displayName}</div>

            {roleLabel && (
              <div className="text-xs text-neutral-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
                {roleLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
