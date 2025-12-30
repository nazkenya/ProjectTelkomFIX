import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SearchInput from '../components/ui/SearchInput'
import Pagination from '../components/ui/Pagination'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StatsCard from '../components/ui/StatsCard'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import Select from '../components/ui/Select'

import {
  FaFilter,
  FaPlus,
  FaUsers,
  FaStar,
  FaBuilding,
  FaUserAlt,
  FaDownload,
} from 'react-icons/fa'

import rawContactsData from '../data/mockContacts'

/* -------------------------------------------------------
 * Helper Functions
 * ----------------------------------------------------- */

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

/* -------------------------------------------------------
 * Hardcoded enrichment (karena belum ada backend)
 * ----------------------------------------------------- */

const RELATIONSHIP_OPTIONS = [
  { value: 'promotor', label: 'Promotor' },
  { value: 'neutral', label: 'Netral' },
  { value: 'detractor', label: 'Detractor' },
]

const DECISION_ROLE_OPTIONS = [
  { value: 'decision-maker', label: 'Decision Maker' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'user', label: 'User' },
]

const RELATIONSHIP_BADGE = {
  promotor: { label: 'Promotor', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  neutral: { label: 'Netral', className: 'bg-neutral-100 text-neutral-700 border border-neutral-200' },
  detractor: { label: 'Detractor', className: 'bg-rose-50 text-rose-700 border border-rose-200' },
}

const DECISION_ROLE_BADGE = {
  'decision-maker': { label: 'Decision Maker', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  influencer: { label: 'Influencer', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  user: { label: 'User', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
}

const inferDecisionRole = (tagText) => {
  if (!tagText) return 'user'
  const normalized = tagText.toLowerCase()
  if (normalized.includes('decision')) return 'decision-maker'
  if (normalized.includes('influencer')) return 'influencer'
  return 'user'
}

const CONTACTS = rawContactsData.map((c, idx) => ({
  ...c,
  isPriority: idx < 3,
  relationshipStatus: c.relationshipStatus || 'neutral',
  decisionRole: c.decisionRole || inferDecisionRole(c.tag?.text),
}))

const createEmptyContactForm = () => ({
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  relationshipStatus: 'neutral',
  decisionRole: 'user',
  isPriority: false,
})

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `contact-${Date.now()}`

const ADD_CONTACT_FORM_ID = 'add-contact-form'

/* -------------------------------------------------------
 * Main Contact Management Page
 * ----------------------------------------------------- */

export default function ContactManagementPage() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState(CONTACTS)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState(createEmptyContactForm)
  const [formErrors, setFormErrors] = useState({})

  const companyOptions = useMemo(() => {
    return Array.from(new Set(contacts.map((c) => c.company))).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [contacts])

  /* -------------------------------------------------------
   * Filtering
   * ----------------------------------------------------- */
  const filtered = useMemo(() => {
    if (!query) return contacts
    const q = query.toLowerCase()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    )
  }, [query, contacts])

  /* -------------------------------------------------------
   * Pagination
   * ----------------------------------------------------- */
  const total = filtered.length
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, total)
  const pageRows = filtered.slice(startIndex, endIndex)

  const onPrev = () => setPage((p) => Math.max(1, p - 1))
  const onNext = () => setPage((p) => (endIndex < total ? p + 1 : p))

  /* -------------------------------------------------------
   * Table Columns + ⭐ PRIORITY BADGE
   * ----------------------------------------------------- */

  const columns = [
    {
      key: 'name',
      label: 'Kontak',
      render: (c) => {
        const initials = getInitials(c.name)
        const avatarColor = getAvatarColor(c.name)
        const relation = c.relationshipStatus || 'neutral'
        const role = c.decisionRole || 'user'

        return (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${avatarColor}`}
            >
              {initials || <FaUserAlt />}
            </div>

            {/* Name + email + badge */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <strong className="font-semibold text-[#2E3048]">
                  {c.name}
                </strong>

                {/* ⭐ PRIORITAS (hardcode dari CONTACTS di atas) */}
                {c.isPriority && (
                  <FaStar
                    className="text-[#E60012] text-sm"
                    title="Kontak Penting"
                  />
                )}
              </div>

              <span className="text-neutral-500 text-[13px]">
                {c.email}
              </span>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {relation && RELATIONSHIP_BADGE[relation] && (
                  <span className={`px-2 py-0.5 rounded-full ${RELATIONSHIP_BADGE[relation].className}`}>
                    {RELATIONSHIP_BADGE[relation].label}
                  </span>
                )}
                {role && DECISION_ROLE_BADGE[role] && (
                  <span className={`px-2 py-0.5 rounded-full ${DECISION_ROLE_BADGE[role].className}`}>
                    {DECISION_ROLE_BADGE[role].label}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    { key: 'title', label: 'Jabatan' },
    { key: 'company', label: 'Perusahaan' },
    { key: 'phone', label: 'Telepon' },
  ]

  /* -------------------------------------------------------
   * Stats Cards (pakai data hardcoded CONTACTS)
   * ----------------------------------------------------- */

  const stats = useMemo(() => {
    const importantCount = contacts.filter((c) => c.isPriority).length
    const companyCount = new Set(contacts.map((c) => c.company)).size
    return [
      { label: 'Total Kontak', value: contacts.length, icon: FaUsers },
      { label: 'Kontak Penting', value: importantCount, icon: FaStar },
      { label: 'Perusahaan Terhubung', value: companyCount, icon: FaBuilding },
    ]
  }, [contacts])

  const openAddModal = () => {
    setForm(createEmptyContactForm())
    setFormErrors({})
    setIsAddOpen(true)
  }

  const closeAddModal = () => {
    setIsAddOpen(false)
  }

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const errors = {}
    if (!form.name.trim()) errors.name = 'Nama kontak wajib diisi.'
    if (!form.title.trim()) errors.title = 'Jabatan wajib diisi.'
    if (!form.company.trim()) errors.company = 'Pilih perusahaan terlebih dahulu.'
    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi.'
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(form.email.trim())) {
        errors.email = 'Format email tidak valid.'
      }
    }

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    const idBase = slugify(form.name)
    const newContact = {
      id: `${idBase}-${Date.now()}`,
      name: form.name.trim(),
      title: form.title.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      relationshipStatus: form.relationshipStatus,
      decisionRole: form.decisionRole,
      isPriority: form.isPriority,
    }

    setContacts((prev) => [newContact, ...prev])
    setPage(1)
    setIsAddOpen(false)
    setForm(createEmptyContactForm())
    setFormErrors({})
  }

  /* -------------------------------------------------------
   * JSX
   * ----------------------------------------------------- */

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Manajemen Kontak"
        subtitle="Kelola dan pantau semua kontak pelanggan Anda"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <StatsCard
            key={idx}
            {...stat}
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          />
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex flex-col gap-3 md:flex-row">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari kontak, jabatan, perusahaan, atau email..."
            />

            <Button variant="secondary" className="inline-flex items-center gap-2 justify-center">
              <FaFilter /> Filter
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="inline-flex items-center gap-2 justify-center w-full sm:w-auto"
                onClick={openAddModal}
              >
                <FaPlus /> Tambah Kontak
              </Button>
              <Button
                variant="secondary"
                className="inline-flex items-center gap-2 justify-center w-full sm:w-auto"
              >
                <FaDownload /> Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <Table
          columns={columns}
          data={pageRows}
          rowKey="id"
          onRowClick={(c) => navigate(`/contacts/${c.id}`)}
        />
      </div>

      {/* Pagination */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            <span className="text-neutral-800 font-semibold">
              {total === 0 ? 0 : startIndex + 1}-{endIndex}
            </span>
            <span className="text-neutral-500"> dari {total} Kontak</span>
          </div>

          <Pagination
            page={page}
            onPrev={onPrev}
            onNext={onNext}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n)
              setPage(1)
            }}
          />
        </div>
      </Card>

      <Modal
        open={isAddOpen}
        onClose={closeAddModal}
        title="Tambah Kontak Baru"
        panelClassName="max-w-xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={closeAddModal}>
              Batal
            </Button>
            <Button type="submit" form={ADD_CONTACT_FORM_ID}>
              Simpan Kontak
            </Button>
          </div>
        }
      >
        <form id={ADD_CONTACT_FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Nama Kontak</span>
              <input
                className="mt-1 w-full rounded-xl border-2 border-neutral-200 px-3 py-2 text-sm focus:border-[#2C5CC5] focus:ring-2 focus:ring-[#2C5CC5]/20"
                value={form.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Jabatan</span>
              <input
                className="mt-1 w-full rounded-xl border-2 border-neutral-200 px-3 py-2 text-sm focus:border-[#2C5CC5] focus:ring-2 focus:ring-[#2C5CC5]/20"
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Contoh: Procurement Manager"
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Perusahaan</span>
              <Select
                className="mt-1 w-full"
                value={form.company}
                onChange={(e) => handleFieldChange('company', e.target.value)}
              >
                <option value="">Pilih perusahaan</option>
                {companyOptions.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </Select>
              {formErrors.company && (
                <p className="mt-1 text-xs text-red-600">{formErrors.company}</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Email</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border-2 border-neutral-200 px-3 py-2 text-sm focus:border-[#2C5CC5] focus:ring-2 focus:ring-[#2C5CC5]/20"
                value={form.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="nama@perusahaan.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
              )}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Nomor Telepon</span>
            <input
              className="mt-1 w-full rounded-xl border-2 border-neutral-200 px-3 py-2 text-sm focus:border-[#2C5CC5] focus:ring-2 focus:ring-[#2C5CC5]/20"
              value={form.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="+62 812 xxxx xxxx"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Relasi</span>
              <Select
                className="mt-1 w-full"
                value={form.relationshipStatus}
                onChange={(e) => handleFieldChange('relationshipStatus', e.target.value)}
              >
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Peran</span>
              <Select
                className="mt-1 w-full"
                value={form.decisionRole}
                onChange={(e) => handleFieldChange('decisionRole', e.target.value)}
              >
                {DECISION_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-[#2C5CC5] focus:ring-[#2C5CC5]"
              checked={form.isPriority}
              onChange={(e) => handleFieldChange('isPriority', e.target.checked)}
            />
            Tandai sebagai kontak penting
          </label>
        </form>
      </Modal>
    </div>
  )
}
