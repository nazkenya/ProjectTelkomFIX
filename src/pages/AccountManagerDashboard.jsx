import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUsers,
  FaCalendarAlt,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaCheckCircle,
  FaCalendarPlus,
  FaCompass,
  FaUserPlus,
  FaPen,
  FaExclamationCircle,
  FaUserAlt,
} from 'react-icons/fa'

import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import StatsCard from '../components/ui/StatsCard'
import Button from '../components/ui/Button'
import SearchInput from '../components/ui/SearchInput'
import Table from '../components/ui/Table' // ✅ gunakan reusable Table

import ActivityCalendarCompact from '../components/activities/ActivityCalendarCompact'
import ActivityCardCompact from '../components/activities/ActivityCardCompact'
import ActivityCardDashboard from '../components/activities/ActivityCardDashboard'

const getInitials = (name = '') => {
  const parts = name.split(' ')
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return `${first}${last}`.toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
]

const getAvatarColor = (name = '') => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

// helper buat slug nama -> alia-smith
const slugifyName = (name = '') =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

// ---------- Mock data (replace with API later) ----------
const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Samsung Electronics Indonesia', relationship: 'Promotor', freq: 14, lastContactDays: 2 },
  { id: 'c2', name: 'Tokopedia', relationship: 'Netral',   freq: 7,  lastContactDays: 6 },
  { id: 'c3', name: 'Grab Indonesia', relationship: 'Detractor', freq: 7, lastContactDays: 18 },
  { id: 'c4', name: 'Astra International', relationship: 'Netral', freq: 30, lastContactDays: 9 },
]

// Upcoming activities (mixed)
const MOCK_ACTIVITIES = [
  {
    id: 'a1',
    title: 'Quarterly Business Review',
    type: 'Meeting',
    date: '2025-11-19',
    time: '10:00',
    location: 'Customer HQ',
    topic: 'QBR Q4',
    description: 'Review KPI, renewal & upsell opportunities',
    withCustomer: true,
    customer: 'Samsung Electronics Indonesia',
    invitees: ['Account Manager', 'Customer Director'],
    status: 'upcoming',
  },
  {
    id: 'a2',
    title: 'Solution Workshop SD-WAN',
    type: 'Workshop',
    date: '2025-11-20',
    time: '14:30',
    location: 'Online',
    topic: 'SD-WAN POC',
    description: 'Technical hands-on & architecture deep dive',
    withCustomer: true,
    customer: 'Tokopedia',
    invitees: ['Presales', 'Network Team'],
    status: 'upcoming',
  },
  {
    id: 'a3',
    title: 'Follow-up Incident & RCA',
    type: 'Internal',
    date: '2025-11-18',
    time: '09:00',
    location: 'Office',
    topic: 'RCA ticket #4321',
    description: 'Prepare talking points for customer call',
    withCustomer: false,
    customer: null,
    invitees: ['Care Lead'],
    status: 'completed',
  },
]

// To-Dos now include plan & company
const MOCK_TODOS = [
  { id: 't1', title: 'Kirim proposal SD-WAN', due: '2025-11-20', done: false, planTitle: 'SP-Q4 Telco Modernization', company: 'Grab' },
  { id: 't2', title: 'Update contact PIC',     due: '2025-11-18', done: true,  planTitle: 'SP-Retention 2025',      company: 'Samsung Electronics Indonesia' },
  { id: 't3', title: 'Submit visit report QBR',due: '2025-11-21', done: false, planTitle: 'SP-QBR Q4',               company: 'Tokopedia' },
  { id: 't4', title: 'Brief Manager soal SLA', due: '2025-11-22', done: false, planTitle: 'SP-Improve SLA',          company: 'Astra International' },
]

// PIC contact-due (nama orang, bukan perusahaan)
const MOCK_PIC_CONTACTS = [
  { id: 'p1', name: 'Alia Smith',   company: 'Tokopedia', targetDays: 7,  lastContactDays: 18 },
  { id: 'p2', name: 'Budi Hartono', company: 'Grab',   targetDays: 7,  lastContactDays: 6  },
  { id: 'p3', name: 'Catherine Lee',company: 'Samsung Electronics Indonesia',        targetDays: 14, lastContactDays: 15 },
  { id: 'p4', name: 'David Kim',    company: 'Astra International',      targetDays: 30, lastContactDays: 9  },
]

// ---------- Small helpers ----------
const fmtDateId = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

export default function AccountManagerDashboard() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  // Derive quick metrics
  const totalCustomers = MOCK_CUSTOMERS.length
  const upcomingVisits = useMemo(
    () => MOCK_ACTIVITIES.filter(a => a.status !== 'completed'),
    []
  )
  const detractors = useMemo(
    () => MOCK_CUSTOMERS.filter(c => c.relationship === 'Detractor'),
    []
  )
  const openTodos = useMemo(
    () => MOCK_TODOS.filter(t => !t.done),
    []
  )

  // KPI row
  const stats = [
    { label: 'Total Pelanggan', value: String(totalCustomers), icon: FaUsers,        trend: '+1',  trendUp: true },
    { label: 'Upcoming Visits (7 hari)', value: String(upcomingVisits.length), icon: FaCalendarAlt, trend: '+2',  trendUp: true },
    { label: 'To-Do Terbuka', value: String(openTodos.length), icon: FaClipboardCheck, trend: '-1', trendUp: false },
    { label: 'Relationship Risk', value: String(detractors.length), icon: FaExclamationTriangle, trend: '0', trendUp: false },
  ]

  const filteredUpcoming = useMemo(() => {
    if (!q.trim()) return upcomingVisits
    const s = q.toLowerCase()
    return upcomingVisits.filter(
      a =>
        a.title.toLowerCase().includes(s) ||
        (a.customer || '').toLowerCase().includes(s) ||
        (a.location || '').toLowerCase().includes(s)
    )
  }, [q, upcomingVisits])

  // ===== handler row click PIC -> redirect ke /contacts/alia-smith =====
  const handlePicRowClick = (row) => {
    const slug = slugifyName(row.name)
    navigate(`/contacts/${slug}`)
    // kalau mau hard URL:
    // window.location.href = `http://localhost:5173/contacts/${slug}`
  }

  // ===== Columns config for PIC Table (reusable Table) =====
  const picColumns = useMemo(() => [
    {
      key: 'name',
      label: 'Nama PIC',
      render: (c) => {
        const initials = getInitials(c.name)
        const avatarColor = getAvatarColor(c.name)
        return (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${avatarColor} flex-shrink-0`}
            >
              {initials || <FaUserAlt />}
            </div>
            {/* Name */}
            <div>
              <strong className="block font-semibold text-neutral-800">
                {c.name}
              </strong>
              {/* Kalau nanti punya email/tag, bisa ditambah di sini */}
            </div>
          </div>
        )
      },
    },
    {
      key: 'company',
      label: 'Perusahaan',
      sortable: true,
    },
    {
      key: 'targetDays',
      label: 'Target',
      sortable: true,
      render: (row) => `${row.targetDays} hari`,
      className: 'w-28',
    },
    {
      key: 'lastContactDays',
      label: 'Terakhir Dihubungi',
      sortable: true,
      render: (row) => `${row.lastContactDays} hari lalu`,
      className: 'w-40',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const overdue = row.lastContactDays > row.targetDays
        const diff = row.lastContactDays - row.targetDays
        return (
          <span
            className={[
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs',
              overdue ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
            ].join(' ')}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${overdue ? 'bg-rose-600' : 'bg-emerald-600'}`} />
            {overdue ? `Terlambat ${diff} hari` : 'On track'}
          </span>
        )
      },
      className: 'w-40',
      cellClass: 'align-middle',
    },
  ], [])

  // Default order: paling telat di atas
  const picData = useMemo(
    () =>
      [...MOCK_PIC_CONTACTS].sort(
        (a, b) => (b.lastContactDays - b.targetDays) - (a.lastContactDays - a.targetDays)
      ),
    []
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        variant="hero"
        title="Dashboard Account Manager"
        subtitle="Cockpit harian untuk prioritas kunjungan, tugas, dan hubungan pelanggan."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <StatsCard {...stat}>
              <div className="flex items-center gap-2 text-xs mt-2">
                <span className={`flex items-center gap-1 font-semibold ${stat.trendUp ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}`}>
                  {stat.trendUp ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.trend}
                </span>
                <span className="text-neutral-400">vs minggu lalu</span>
              </div>
            </StatsCard>
          </div>
        ))}
      </div>

      {/* Main grid: Upcoming + To-Do */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Visits (Calendar + List) */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">Upcoming Visits</h2>
                <p className="text-xs text-neutral-500">Prioritas 7 hari ke depan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:[grid-template-columns:320px_1fr] gap-6">
              {/* Compact calendar */}
              <aside className="lg:sticky lg:top-2 self-start">
                <div className="w-[320px]">
                  <div className="aspect-square border border-neutral-200 rounded-xl bg-white shadow-sm p-3">
                    <ActivityCalendarCompact
                      activities={filteredUpcoming}
                      onActivityClick={() => {}}
                    />
                  </div>
                </div>
              </aside>

              {/* Upcoming list */}
              <section className="space-y-2">
                {filteredUpcoming
                    .sort((a, b) =>
                    `${a.date}T${a.time || '00:00'}`.localeCompare(
                        `${b.date}T${b.time || '00:00'}`
                    )
                    )
                    .map((act) => (
                    <ActivityCardDashboard
                        key={act.id}
                        activity={act}
                        onClick={() => {}}
                    />
                    ))}
            </section>
            </div>
          </Card>
        </div>

        {/* To-Do List (show plan & company) */}
<div>
  <Card className="h-full">
    {/* Header */}
    <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/70">
      <div>
        <h2 className="text-lg font-semibold text-neutral-800">To-Do &amp; Follow-up</h2>
        <p className="text-xs text-neutral-500">
          Tugas singkat terkait pelanggan &amp; sales plan
        </p>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E0EDFF] text-[#2C5CC5] px-3 py-1 text-[11px] font-medium">
        <FaClipboardCheck className="w-3.5 h-3.5" />
        <span>{openTodos.length} aktif</span>
      </div>
    </div>

    {/* List */}
    <ul className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
      {MOCK_TODOS.map((t) => {
        const dueDate = new Date(t.due)
        const today = new Date()
        const isOverdue = !t.done && dueDate < today

        return (
          <li
            key={t.id}
            className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-transparent bg-white/90 hover:bg-[#F3F5FF] hover:border-[#2C5CC5]/30 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all duration-150"
          >
            {/* Custom checkbox */}
            <label className="mt-0.5 inline-flex items-center justify-center">
              <input
                type="checkbox"
                defaultChecked={t.done}
                onChange={() => {}}
                className="peer sr-only"
              />
              <span className="flex h-4 w-4 items-center justify-center rounded-md border border-[#CBD5F5] bg-white peer-checked:bg-[#2C5CC5] peer-checked:border-[#2C5CC5] transition-colors">
                <svg
                  className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 10.5L8.00033 13.5L15 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-sm font-medium truncate ${
                    t.done ? 'text-neutral-400 line-through' : 'text-neutral-900'
                  }`}
                >
                  {t.title}
                </p>
                {/* Status kecil di kanan */}
                <span
                  className={[
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                    t.done
                      ? 'bg-emerald-50 text-emerald-700'
                      : isOverdue
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-blue-50 text-blue-700',
                  ].join(' ')}
                >
                  {t.done ? 'Selesai' : isOverdue ? 'Terlambat' : 'Aktif'}
                </span>
              </div>

              {/* Meta info: plan & company */}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100/70 px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2C5CC5]" />
                  <span className="font-medium text-neutral-700 truncate max-w-[140px]">
                    {t.planTitle}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100/70 px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span className="truncate max-w-[140px]">{t.company}</span>
                </span>
              </div>

              {/* Due date */}
              <p className="mt-1 text-[11px] text-neutral-500">
                Due{' '}
                <span className="font-medium text-neutral-700">
                  {fmtDateId(t.due)}
                </span>
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  </Card>
</div>

      </div>

      {/* PIC yang perlu dihubungi (pakai reusable Table) */}
      <Card className="bg-gradient-to-br from-white to-neutral-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaExclamationCircle className="text-rose-600" />
            <h2 className="text-lg font-semibold text-neutral-800">PIC yang Perlu Dihubungi</h2>
          </div>
          <div className="text-xs text-neutral-500">
            Tampilkan PIC yang melewati target frekuensi komunikasi
          </div>
        </div>

        <Table
          columns={picColumns}
          data={picData}
          rowKey="id"
          dense
          mode="readonly"
          onRowClick={handlePicRowClick}
          className="text-[14px] [&_td]:text-[14px] [&_th]:text-[13px]"
        />
      </Card>

      {/* Recent Activities + Quick Actions */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Aktivitas Terakhir */}
  <div className="lg:col-span-2">
    <Card className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/70">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Aktivitas Terakhir</h2>
          <p className="text-xs text-neutral-500">
            Ringkasan aktivitas terbaru terkait pelanggan
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E0EDFF] text-[#1D4ED8] px-3 py-1 text-[11px] font-medium">
          <FaBell className="w-3.5 h-3.5" />
          <span>{MOCK_ACTIVITIES.length} aktivitas</span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {MOCK_ACTIVITIES.slice(0, 5).map((a) => {
          const isCompleted = a.status === 'completed'
          const isInternal = !a.withCustomer

          return (
            <div
              key={a.id}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-white hover:bg-[#F3F5FF] border border-transparent hover:border-[#1D4ED8]/20 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-150"
            >
              {/* Status icon */}
              <div className="mt-0.5">
                <FaCheckCircle
                  className={
                    isCompleted
                      ? 'text-emerald-500'
                      : 'text-neutral-300'
                  }
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {a.title} {a.customer ? `• ${a.customer}` : ''}
                  </p>
                  {/* Status pill */}
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : isInternal
                        ? 'bg-neutral-100 text-neutral-700'
                        : 'bg-blue-50 text-blue-700',
                    ].join(' ')}
                  >
                    {isCompleted ? 'Selesai' : isInternal ? 'Internal' : 'Dengan Pelanggan'}
                  </span>
                </div>

                <p className="text-[11.5px] text-neutral-500 mt-0.5">
                  {fmtDateId(`${a.date}T${a.time || '00:00'}`)} • {a.location || '—'}
                </p>

                {a.topic && (
                  <p className="text-[11.5px] text-neutral-500 mt-0.5 line-clamp-1">
                    {a.topic}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  </div>

  {/* Quick Actions */}
    <div>
    <Card className="h-full flex flex-col">
        {/* Header */}
        <div className="pb-3 mb-3 border-b border-neutral-200/70">
        <h2 className="text-lg font-semibold text-neutral-800">Quick Actions</h2>
        <p className="text-xs text-neutral-500">
            Aksi cepat untuk aktivitas harian
        </p>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {[
            { label: 'Tambah Aktivitas', icon: <FaCalendarPlus size={18} /> },
            { label: 'Buat Sales Plan',  icon: <FaCompass size={18} /> },
            { label: 'Tambah Kontak',    icon: <FaUserPlus size={18} /> },
            { label: 'Catat Follow-up',  icon: <FaPen size={18} /> },
        ].map((action) => (
            <Button
            key={action.label}
            variant="secondary"
            size="md"
            fullWidth
            className="
                h-full
                flex items-center 
                bg-white/95 border border-[#D0D7F2] 
                hover:bg-[#EFF3FF] hover:border-[#1D4ED8] 
                shadow-sm hover:shadow 
                group gap-4 px-4 py-4
            "
            >
            {/* ICON BIGGER & BALANCED */}
            <span className="
                flex h-11 w-11 items-center justify-center 
                rounded-xl bg-[#E3ECFF]
                text-[#1D4ED8] 
                group-hover:scale-110 transition-transform duration-150
            ">
                {action.icon}
            </span>

            {/* TEXT SLIGHTLY BIGGER */}
            <span className="text-[15px] font-medium text-neutral-800 group-hover:text-[#1D4ED8]">
                {action.label}
            </span>
            </Button>
        ))}
        </div>
    </Card>
    </div>


</div>

    </div>
  )
}
