import React, { useMemo, useState } from 'react'
import Card from '../ui/Card'
import SearchInput from '../ui/SearchInput'
import Button from '../ui/Button'
import ActivityCardCompact from '../activities/ActivityCardCompact'
import ActivityCalendarCompact from '../activities/ActivityCalendarCompact'
import ActivityFormModal from '../activities/ActivityFormModal'
import { FiPlus } from 'react-icons/fi'

const mockCustomerActivities = [
  {
    id: 'cust-act-1',
    title: 'Executive Briefing',
    type: 'Meeting',
    date: '2025-10-14',
    time: '10:00',
    location: 'HQ Jakarta',
    topic: 'Q4 Business Review',
    description: 'Review performance & plan next quarter initiatives.',
    withCustomer: true,
    customer: 'PT Telkom Regional',
    invitees: ['Tim Account Manager'],
    status: 'upcoming',
    createdBy: 'Manager',
  },
  {
    id: 'cust-act-2',
    title: 'Technical Workshop',
    type: 'Workshop',
    date: '2025-10-10',
    time: '13:30',
    location: 'Customer Site - Bandung',
    topic: 'SD-WAN POC',
    description: 'Hands-on session untuk tim IT pelanggan.',
    withCustomer: true,
    customer: 'PT Telkom Regional',
    invitees: ['Tim Presales'],
    status: 'upcoming',
    createdBy: 'Sales Engineer',
  },
]

export default function CustomerVisitingSection({ customerName }) {
  const [query, setQuery] = useState('')
  const [activities, setActivities] = useState(mockCustomerActivities)
  const [showForm, setShowForm] = useState(false)

  const filteredData = useMemo(() => {
    if (!query.trim()) return activities
    const q = query.toLowerCase()
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.topic.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
    )
  }, [activities, query])

  const handleAddActivity = () => setShowForm(true)
  const handleExport = () => alert('Export ICS untuk aktivitas customer.')

  const handleSubmitActivity = (payload) => {
    const activityDate = payload.date
      ? new Date(`${payload.date}T${payload.time || '00:00'}`)
      : new Date()
    const newActivity = {
      ...payload,
      id: `cust-act-${Date.now()}`,
      customer: customerName,
      withCustomer: true,
      status: activityDate < new Date() ? 'completed' : 'upcoming',
    }
    setActivities((prev) => [...prev, newActivity])
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50/60 px-4 py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-[18px] font-semibold text-slate-900">Visiting & Aktivitas</h3>
            <p className="text-[13.5px] text-neutral-600 mt-1">
              Aktivitas khusus untuk {customerName}
            </p>
          </div>
          <Button onClick={handleAddActivity} className="inline-flex items-center gap-2">
            <FiPlus /> Tambah Aktivitas
          </Button>
        </div>
      </div>

      {/* Search & Export Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari aktivitas atau lokasi"
          variant="subtle"
        />
        <div className="w-full sm:w-56">
          <Button
            variant="secondary"
            onClick={handleExport}
            className="w-full sm:w-auto"
          >
            Export ICS
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-sm text-neutral-500 border border-dashed border-neutral-200 rounded-2xl">
            Tidak ada aktivitas untuk filter ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:[grid-template-columns:320px_1fr] gap-6">
            {/* Left: Calendar */}
            <aside className="lg:sticky lg:top-2 self-start">
              <div className="w-[320px]">
                <div className="aspect-square border border-neutral-200 rounded-xl bg-white shadow-sm p-3">
                  <ActivityCalendarCompact
                    activities={filteredData}
                    onActivityClick={() => {}}
                  />
                </div>
              </div>
            </aside>

            {/* Right: List */}
            <section className="space-y-3 text-[13.5px]">
              {filteredData.map((act) => (
                <ActivityCardCompact key={act.id} activity={act} onClick={() => {}} />
              ))}
            </section>
          </div>
        )}
      </Card>

      {/* Modal for Add Activity */}
      <ActivityFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitActivity}
        lockedCustomer={{ name: customerName }}
      />
    </div>
  )
}
