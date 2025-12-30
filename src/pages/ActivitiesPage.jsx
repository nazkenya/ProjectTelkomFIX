import React, { useState, useMemo } from 'react'
import { FaPlus, FaCalendar, FaList, FaFilter, FaBell } from 'react-icons/fa'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SearchInput from '../components/ui/SearchInput'
import ActivityFormModal from '../components/activities/ActivityFormModal'
import ActivityCard from '../components/activities/ActivityCard'
import ActivityDetailModal from '../components/activities/ActivityDetailModal'
import ActivityCalendar from '../components/activities/ActivityCalendar'
import { FaCalendarPlus, FaCheckCircle } from 'react-icons/fa'

export default function ActivitiesPage() {
  const [view, setView] = useState('calendar')
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | perluUpdate | upcoming | completed

  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'Meeting with PT Telkom Regional',
      type: 'Meeting',
      date: '2025-12-02',
      time: '10:00',
      location: 'Telkom Office Jakarta',
      topic: 'Q4 Business Review',
      description: 'Quarterly business review meeting to discuss performance and future plans.',
      withCustomer: true,
      customer: 'PT Telkom Regional',
      invitees: ['John Doe', 'Jane Smith'],
      status: 'upcoming',
      createdBy: 'Current User',
      proof: null,
      mom: null,
      outlookAdded: true,
      outlookUrl: '',
    },
    {
      id: 2,
      title: 'Sales Planning Session',
      type: 'Internal Meeting',
      date: '2025-11-08',
      time: '14:00',
      location: 'Conference Room A',
      topic: 'Monthly Sales Target Review',
      description: 'Monthly internal meeting to review sales targets and strategies.',
      withCustomer: false,
      customer: null,
      invitees: ['Alice Johnson', 'Bob Williams'],
      status: 'completed',
      createdBy: 'Current User',
      proof: null,
      mom: null,
      outlookAdded: false,
      outlookUrl: '',
    },
  ])

  const buildOutlookDeeplink = (activity) => {
    if (!activity) return ''
    const date = activity.date || ''
    const time = activity.time || '09:00'
    const [hh, mm] = time.split(':').map((t) => parseInt(t, 10))
    const start = new Date(`${date || ''}T${Number.isInteger(hh) ? String(hh).padStart(2, '0') : '09'}:${Number.isInteger(mm) ? String(mm).padStart(2, '0') : '00'}:00`)
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: activity.title || 'Aktivitas Baru',
      body: `${activity.topic ? `Topik: ${activity.topic}\n` : ''}${activity.description || 'Detail aktivitas'}\n\n(Simulated Outlook entry)`,
      location: activity.location || '',
      startdt: isNaN(start.getTime()) ? '' : start.toISOString(),
      enddt: isNaN(end.getTime()) ? '' : end.toISOString(),
    })

    if (activity.invitees && activity.invitees.length > 0) {
      params.append('attendees', activity.invitees.join(';'))
    }

    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  const markOutlookAdded = (id) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, outlookAdded: true, outlookUrl: a.outlookUrl || buildOutlookDeeplink(a) } : a))
    )
  }

  const handleAddToOutlook = (activity) => {
    if (!activity) return
    const url = activity.outlookUrl || buildOutlookDeeplink(activity)
    try {
      if (url && typeof window !== 'undefined') {
        window.open(url, '_blank', 'noreferrer')
      }
    } catch {
      // noop
    }
    markOutlookAdded(activity.id)
  }

  // --- Helper untuk parsing tanggal aktivitas ---
  const parseActivityDate = (activity) => {
    if (!activity?.date) return null
    const dateString = activity.time ? `${activity.date}T${activity.time}` : activity.date
    const d = new Date(dateString)
    if (Number.isNaN(d.getTime())) return null
    return d
  }

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities
    const q = searchQuery.toLowerCase()
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.topic.toLowerCase().includes(q) ||
        (a.customer && a.customer.toLowerCase().includes(q))
    )
  }, [activities, searchQuery])

  // Hitung notifikasi (perlu update & upcoming) berdasarkan computed status
  const notificationStats = useMemo(() => {
    const now = new Date()

    return filteredActivities.reduce(
      (acc, activity) => {
        const baseStatus = activity.status?.toLowerCase()
        const activityDate = parseActivityDate(activity)

        let computedStatus = baseStatus

        if (baseStatus === 'completed') {
          computedStatus = 'completed'
        } else {
          // Kalau belum completed → cek tanggal
          if (!activityDate) {
            computedStatus = 'upcoming'
          } else if (activityDate < now) {
            computedStatus = 'perluUpdate'
          } else {
            computedStatus = 'upcoming'
          }
        }

        if (computedStatus === 'perluUpdate') acc.perluUpdate += 1
        if (computedStatus === 'upcoming') acc.upcoming += 1

        return acc
      },
      { perluUpdate: 0, upcoming: 0 }
    )
  }, [filteredActivities])

  const hasNotifications = notificationStats.perluUpdate > 0 || notificationStats.upcoming > 0

  // List view: satu list panjang, dengan computedStatus + filter status
  const listActivities = useMemo(() => {
    const now = new Date()

    const withComputedStatus = filteredActivities.map((activity) => {
      const baseStatus = activity.status?.toLowerCase()
      const activityDate = parseActivityDate(activity)

      let computedStatus = baseStatus

      if (baseStatus === 'completed') {
        computedStatus = 'completed'
      } else {
        if (!activityDate) {
          computedStatus = 'upcoming'
        } else if (activityDate < now) {
          computedStatus = 'perluUpdate'
        } else {
          computedStatus = 'upcoming'
        }
      }

      return { ...activity, computedStatus }
    })

    const filteredByStatus =
      statusFilter === 'all'
        ? withComputedStatus
        : withComputedStatus.filter((a) => a.computedStatus === statusFilter)

    return filteredByStatus.sort((a, b) => {
      const da = parseActivityDate(a)
      const db = parseActivityDate(b)
      if (!da || !db) return 0
      return da - db
    })
  }, [filteredActivities, statusFilter])

  const handleCreateActivity = (newActivity) => {
    const activity = {
      ...newActivity,
      id: Date.now(),
      status: 'upcoming',
      createdBy: 'Current User',
      proof: null,
      mom: null,
      outlookAdded: false,
      outlookUrl: buildOutlookDeeplink(newActivity),
    }
    setActivities((prev) => [...prev, activity])
    setShowFormModal(false)
  }

  const handleUpdateActivity = (updatedActivity) => {
    setActivities((prev) => prev.map((a) => (a.id === updatedActivity.id ? updatedActivity : a)))
    setSelectedActivity(null)
    setShowDetailModal(false)
  }

  const handleDeleteActivity = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
    setSelectedActivity(null)
    setShowDetailModal(false)
  }

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity)
    setShowDetailModal(true)
  }

  const renderStatusFilterChip = (value, label) => (
    <button
      key={value}
      onClick={() => setStatusFilter(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        statusFilter === value
          ? 'bg-[#E60012] text-white border-[#E60012]'
          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
      }`}
    >
      {label}
    </button>
  )

  const getBorderClass = (computedStatus) => {
    if (computedStatus === 'perluUpdate') return 'border-l-4 border-[#E60012]'
    if (computedStatus === 'upcoming') return 'border-l-4 border-[#EA580C]'
    if (computedStatus === 'completed') return 'border-l-4 border-emerald-500'
    return 'border-l border-neutral-200'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        variant="hero"
        title="Aktivitas"
        subtitle="Kelola dan pantau semua aktivitas sales dan customer engagement"
      />

      {hasNotifications && (
        <Card className="bg-gradient-to-br from-white to-[#FFE4E6] border border-[#FECACA]">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[#E60012]">
              <FaBell className="w-5 h-5" />
            </span>
            <div className="space-y-1 text-sm text-neutral-700">
              <p className="text-base font-semibold text-[#B91C1C]">Pengingat Aktivitas</p>
              {notificationStats.perluUpdate > 0 && (
                <p>
                  {notificationStats.perluUpdate} aktivitas berstatus{' '}
                  <span className="font-semibold text-[#E60012]">Perlu Update</span>. Segera
                  perbarui catatan atau statusnya.
                </p>
              )}
              {notificationStats.upcoming > 0 && (
                <p>
                  {notificationStats.upcoming} aktivitas{' '}
                  <span className="font-semibold text-[#EA580C]">akan datang</span>. Pastikan
                  seluruh persiapan telah selesai.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex flex-col gap-3 md:flex-row">
            <div className="w-full max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari aktivitas, topik, atau customer..."
              />
            </div>
            <Button variant="secondary" className="inline-flex items-center gap-2 justify-center">
              <FaFilter />
              Filter
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-2 border border-neutral-200 rounded-lg p-1 justify-between sm:justify-start">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-[#E60012] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <FaCalendar className="inline mr-2" />
                Kalender
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-[#E60012] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                >
                  <FaList className="inline mr-2" />
                  List
                </button>
              </div>

            <Button
              variant="primary"
              onClick={() => setShowFormModal(true)}
              size="md"
              className="inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0 justify-center w-full sm:w-auto"
            >
              <FaPlus />
              Tambah Aktivitas
            </Button>
          </div>
        </div>
      </Card>

      {view === 'calendar' ? (
        <ActivityCalendar activities={filteredActivities} onActivityClick={handleViewActivity} />
      ) : (
        <div className="space-y-4">
          {/* Toolbar khusus List: filter status + legend */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {renderStatusFilterChip('all', 'Semua')}
              {renderStatusFilterChip('perluUpdate', 'Perlu Update')}
              {renderStatusFilterChip('upcoming', 'Akan Datang')}
              {renderStatusFilterChip('completed', 'Selesai')}
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#E60012]" />
                Perlu Update
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#EA580C]" />
                Akan Datang
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Selesai
              </span>
            </div>
          </div>

          {listActivities.length === 0 ? (
            <Card className="bg-white text-center py-12">
              <p className="text-neutral-500">Tidak ada aktivitas ditemukan</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {listActivities.map((activity) => {
                const borderClass = getBorderClass(activity.computedStatus)
                // Override status yang dikirim ke card supaya badge/status di dalam card ikut sesuai
                const activityForCard = {
                  ...activity,
                  status: activity.computedStatus,
                }

                return (
                  <div key={activity.id} className={`${borderClass} pl-3`}>
                    <ActivityCard
                      activity={activityForCard}
                      onClick={() => handleViewActivity(activityForCard)}
                      onAddToOutlook={() => handleAddToOutlook(activityForCard)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <ActivityFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleCreateActivity}
      />

      {selectedActivity && (
        <ActivityDetailModal
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedActivity(null)
          }}
          activity={selectedActivity}
          onUpdate={handleUpdateActivity}
          onDelete={handleDeleteActivity}
        />
      )}
    </div>
  )
}
