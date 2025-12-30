import React, { useMemo, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Modal from '../ui/Modal' // ⬅️ ganti kalau pakai alias lain

/**
 * Compact month-view calendar optimized for a square container.
 * - 7 x 6 grid (always shows all dates)
 * - Day cell shows only colored dots (status) instead of text pills
 * - Clicking a date opens a modal with that day's activities
 *
 * Expected activity shape:
 * { id, date: 'YYYY-MM-DD', time: 'HH:mm', title, status: 'completed'|'upcoming', location, ... }
 */
export default function ActivityCalendarCompact({
  activities = [],
  onActivityClick = () => {},
  initialDate = new Date(),
  className = '',
}) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState(null) // 'YYYY-MM-DD'
  const [modalActivities, setModalActivities] = useState([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startDow = firstDayOfMonth.getDay()

  const monthName = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })

  // Group activities by date key 'YYYY-MM-DD'
  const activitiesByDate = useMemo(() => {
    const map = {}
    for (const a of activities) {
      const key = a.date
      if (!map[key]) map[key] = []
      map[key].push(a)
    }
    // sort by time
    Object.values(map).forEach((list) =>
      list.sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    )
    return map
  }, [activities])

  const goPrev = () => setCurrentDate(new Date(year, month - 1, 1))
  const goNext = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const openDayModal = (key) => {
    setModalDate(key)
    setModalActivities(activitiesByDate[key] || [])
    setModalOpen(true)
  }

  const cells = []
  // Leading blanks
  for (let i = 0; i < startDow; i++) {
    cells.push(<div key={`lead-${i}`} className="rounded-lg" />)
  }

  // Helper for dot color by activity
  const dotClass = (a) => {
    const dt = new Date(`${a.date}T${a.time || '00:00'}`)
    const isPast = dt < new Date()
    const isCompleted = a.status === 'completed'
    if (isCompleted) return 'bg-green-500'
    if (isPast) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  // Month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const key = date.toLocaleDateString('sv-SE') // 'YYYY-MM-DD'
    const dayActs = activitiesByDate[key] || []
    const isToday = new Date().toDateString() === date.toDateString()

    cells.push(
      <button
        type="button"
        key={`d-${d}`}
        onClick={() => dayActs.length > 0 && openDayModal(key)}
        className={[
          'rounded-lg border transition-colors min-w-0 min-h-0 p-1.5',
          'flex flex-col justify-between overflow-hidden text-left',
          isToday
            ? 'border-blue-300 bg-blue-50'
            : 'border-neutral-200 bg-white hover:bg-neutral-50',
          dayActs.length > 0 ? 'cursor-pointer' : 'cursor-default',
          'focus:outline-none focus:ring-2 focus:ring-blue-400/50',
        ].join(' ')}
      >
        <div
          className={[
            'text-[11px] font-semibold leading-none',
            isToday ? 'text-blue-600' : 'text-neutral-700',
          ].join(' ')}
        >
          {d}
        </div>

        {/* Dots row (up to 4 dots). Only markers, no text. */}
        {dayActs.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {dayActs.slice(0, 4).map((a) => (
              <span
                key={a.id}
                className={[
                  'inline-block h-1.5 w-1.5 rounded-full',
                  dotClass(a),
                ].join(' ')}
                title={`${a.time || ''} ${a.title || ''}`}
              />
            ))}
            {dayActs.length > 4 && (
              <span className="text-[10px] text-neutral-500">
                +{dayActs.length - 4}
              </span>
            )}
          </div>
        )}
      </button>
    )
  }

  // Trailing blanks to 42 cells
  const total = startDow + daysInMonth
  for (let i = total; i < 42; i++) {
    cells.push(<div key={`trail-${i}`} className="rounded-lg" />)
  }

  // Format tanggal untuk title modal
  const formattedModalDate = modalDate
    ? new Date(modalDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  return (
    <>
      <div className={['flex h-full w-full flex-col', className].join(' ')}>
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-800 leading-none truncate">
            {monthName}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={goPrev}
              className="px-2 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              aria-label="Bulan sebelumnya"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={goToday}
              className="px-2 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[11px]"
            >
              Hari Ini
            </button>
            <button
              onClick={goNext}
              className="px-2 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              aria-label="Bulan berikutnya"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((w) => (
            <div
              key={w}
              className="text-center text-[11px] font-semibold text-neutral-600"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 grid-rows-6 gap-1 min-h-0 flex-1">
          {cells}
        </div>
      </div>

      {/* Modal pakai komponen Modal global */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={formattedModalDate ? `Aktivitas • ${formattedModalDate}` : 'Aktivitas'}
        panelClassName="max-w-lg"
      >
        <div className="space-y-3">
          {modalActivities.length === 0 ? (
            <div className="text-sm text-neutral-500">
              Tidak ada aktivitas pada tanggal ini.
            </div>
          ) : (
            modalActivities.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setModalOpen(false)
                  onActivityClick(a)
                }}
                className="w-full text-left rounded-xl border border-neutral-200 hover:bg-neutral-50 p-3 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-semibold text-neutral-900">
                      {a.title}
                    </div>
                    <div className="text-[12px] text-neutral-600">
                      {a.time || '-'} • {a.location || '—'}
                    </div>
                  </div>
                  <span
                    className={[
                      'mt-0.5 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full',
                      a.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : new Date(`${a.date}T${a.time || '00:00'}`) < new Date()
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700',
                    ].join(' ')}
                  >
                    ● {a.status || 'upcoming'}
                  </span>
                </div>
                {a.description && (
                  <div className="mt-1.5 text-[12px] text-neutral-700 line-clamp-2">
                    {a.description}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </Modal>
    </>
  )
}
