// src/pages/SalesMySalesPlans.jsx
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageHeader from '@components/ui/PageHeader'
import Card from '@components/ui/Card'
import SearchInput from '@components/ui/SearchInput'
import Select from '@components/ui/Select'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import FormInput from '@components/ui/FormInput'
import { FiPaperclip, FiPlus } from 'react-icons/fi'
import { ROLES, ROLE_LABELS } from '@auth/roles'

const MANAGER_LABEL = ROLE_LABELS[ROLES.manager] || 'Manager Business Service'

// ---------- Dummy Data (hardcoded) ----------
const MOCK_SALES_PLANS = [
  {
    id: 'sp-001',
    title: 'SP-Q4 Retention Enterprise',
    customerId: 'samsung',
    customerName: 'Samsung Electronics Indonesia',
    ownerName: 'Budi Santoso',
    status: 'Draft',
    approvalStatus: 'Pending',
    dateStart: '2025-10-01',
    dateEnd: '2025-12-31',
    description:
      'Fokus retaining top 10 key accounts dengan peningkatan cross-sell layanan managed service dan SD-WAN.',
    attachment: {
      fileName: 'SP-Q4-Retention-PT-Sinar-Jaya.pdf',
      url: '/dummy/sp-q4-sinarjaya.pdf',
      size: '1.2 MB',
    },
    managerComment: '',
    managerDecisionDate: null,
  },
  {
    id: 'sp-002',
    title: 'SP-Modernization DC & Cloud',
    customerId: 'c2',
    customerName: 'PT Andalan Telekom',
    ownerName: 'Budi Santoso',
    status: 'Active',
    approvalStatus: 'Approved',
    dateStart: '2025-07-01',
    dateEnd: '2025-12-31',
    description:
      'Modernisasi data center dan migrasi workload kritikal ke cloud untuk meningkatkan reliability dan agility.',
    attachment: {
      fileName: 'SP-Modernization-DC-Cloud-Andalan.pdf',
      url: '/dummy/sp-modernization-andalan.pdf',
      size: '900 KB',
    },
    managerComment:
      'Fokus dulu di 3 workload prioritas, pastikan ada quick win yang bisa di-showcase ke manajemen pelanggan.',
    managerDecisionDate: '2025-07-15T09:30:00.000Z',
  },
  {
    id: 'sp-003',
    title: 'SP-Upsell Collaboration Suite',
    customerId: 'c3',
    customerName: 'Tokopedia',
    ownerName: 'Budi Santoso',
    status: 'Closed',
    approvalStatus: 'Approved',
    dateStart: '2025-01-01',
    dateEnd: '2025-06-30',
    description:
      'Program upsell lisensi collaboration suite ke seluruh regional branch, termasuk enablement ke user champion.',
    attachment: {
      fileName: 'SP-Upsell-Collab-Nusantara.pdf',
      url: '/dummy/sp-upsell-collab-nusantara.pdf',
      size: '750 KB',
    },
    managerComment: 'Bagus, tolong dokumentasikan lesson learnt di akhir Q2.',
    managerDecisionDate: '2025-02-02T14:10:00.000Z',
  },
  {
    id: 'sp-004',
    title: 'SP-Pilot SD-WAN Multi-site',
    customerId: 'c4',
    customerName: 'PT Mandiri Tech',
    ownerName: 'Budi Santoso',
    status: 'Draft',
    approvalStatus: 'Rejected',
    dateStart: '2025-09-01',
    dateEnd: '2025-11-30',
    description:
      'Pilot SD-WAN untuk 5 site prioritas sebagai proof-of-value sebelum roll-out nasional.',
    attachment: {
      fileName: 'SP-Pilot-SDWAN-MandiriTech.pdf',
      url: '/dummy/sp-pilot-sdwan-mandiri.pdf',
      size: '640 KB',
    },
    managerComment:
      'Tolong revisi target revenue dan perjelas dependency dengan tim operasi sebelum diajukan ulang.',
    managerDecisionDate: '2025-09-10T11:20:00.000Z',
  },
  {
    id: 'sp-005',
    title: 'SP-Samsung Hybrid Cloud Expansion',
    customerId: 'samsung',
    customerName: 'Samsung Electronics Indonesia',
    ownerName: 'Budi Santoso',
    status: 'Active',
    approvalStatus: 'Approved',
    dateStart: '2025-03-01',
    dateEnd: '2025-12-31',
    description:
      'Perluas footprint hybrid cloud untuk divisi mobile & consumer electronics; fokus workload ERP, data lake, dan observability.',
    attachment: {
      fileName: 'SP-Samsung-Hybrid-Cloud.pdf',
      url: '/dummy/sp-samsung-hybrid-cloud.pdf',
      size: '1.1 MB',
    },
    managerComment:
      'Fokuskan quick win pada observability & security; siapkan showcase dashboard untuk CIO Samsung.',
    managerDecisionDate: '2025-03-10T10:00:00.000Z',
  },
]

// ---------- Helpers ----------
const statusBadge = (status) => {
  const s = status || 'Draft'
  if (s === 'Active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Closed') return 'bg-blue-50 text-blue-700 border border-blue-200'
  return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
}

const approvalTone = (status) => {
  const s = status || 'Pending'
  if (s === 'Approved') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Rejected') return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-amber-50 text-amber-700 border border-amber-200'
}

const STATUS_OPTIONS = ['Draft', 'Active', 'Closed']
const ACCOUNT_MANAGER_LABEL = ROLE_LABELS[ROLES.sales] || 'Account Manager'

const createInitialForm = () => ({
  title: '',
  customerName: '',
  dateStart: '',
  dateEnd: '',
  status: 'Draft',
  description: '',
  fileName: '',
  fileData: '',
})

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `customer-${Date.now()}`

export default function SalesMySalesPlans() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState(() => [...MOCK_SALES_PLANS])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState(createInitialForm)
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setForm(createInitialForm())
    setErrors({})
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = true
    if (!form.customerName.trim()) nextErrors.customerName = true
    if (!form.dateStart) nextErrors.dateStart = true
    if (!form.dateEnd) nextErrors.dateEnd = true
    if (form.dateStart && form.dateEnd && form.dateEnd < form.dateStart) nextErrors.dateEnd = true
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setForm((prev) => ({ ...prev, fileName: '', fileData: '' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, fileName: file.name, fileData: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleCreatePlan = () => {
    if (!validate()) return
    const customerName = form.customerName.trim()
    const newPlan = {
      id: `sp-${Date.now()}`,
      title: form.title.trim(),
      customerId: slugify(customerName),
      customerName,
      ownerName: ACCOUNT_MANAGER_LABEL,
      status: form.status,
      approvalStatus: 'Pending',
      dateStart: form.dateStart,
      dateEnd: form.dateEnd,
      description: form.description,
      attachment: form.fileName
        ? {
            fileName: form.fileName,
            url: form.fileData,
          }
        : null,
      managerComment: '',
      managerDecisionDate: null,
    }
    setPlans((prev) => [newPlan, ...prev])
    setIsCreateOpen(false)
    resetForm()
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return plans.filter((plan) => {
      const matchesSearch =
        !q ||
        plan.title?.toLowerCase().includes(q) ||
        plan.customerName?.toLowerCase().includes(q) ||
        plan.ownerName?.toLowerCase().includes(q)

      const s = plan.status || 'Draft'
      const matchesStatus = statusFilter === 'all' || s === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [plans, search, statusFilter])

  const persistPlanForCustomer = (plan) => {
    if (!plan) return
    const customerId = plan.customerId || slugify(plan.customerName)
    const storageKey = `salesPlan_${customerId}`
    const payload = {
      ...plan,
      // Hardcode Modernization plan to always be Approved in detail view
      approvalStatus:
        plan.id === 'sp-002' || (plan.title || '').includes('Modernization DC & Cloud')
          ? 'Approved'
          : plan.approvalStatus || 'Pending',
      customerId,
    }
    try {
      const raw = localStorage.getItem(storageKey)
      const existing = raw ? JSON.parse(raw) : []
      const merged = Array.isArray(existing)
        ? [...existing.filter((p) => p.id !== payload.id), payload]
        : [payload]
      localStorage.setItem(storageKey, JSON.stringify(merged))
    } catch {
      // ignore storage errors
    }
  }

  const openPlanDetail = (plan) => {
    if (!plan) return
    const customerId = plan.customerId || slugify(plan.customerName)
    persistPlanForCustomer(plan)
    navigate(`/customers/${customerId}/sales-plan/${plan.id}`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        variant="hero"
        title="Sales Plan"
        subtitle="Lihat seluruh sales plan yang Anda miliki lintas pelanggan."
      />

      {/* Filter bar */}
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex flex-col gap-3 md:flex-row">
          <div className="w-full max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari plan, pelanggan, atau AM"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-52"
          >
            <option value="all">Semua Status Plan</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Button
            variant="primary"
            className="w-full inline-flex items-center justify-center gap-2"
            onClick={() => {
              resetForm()
              setIsCreateOpen(true)
            }}
          >
            <FiPlus /> Sales Plan Baru
          </Button>
        </div>
      </Card>

      {/* List content */}
      {filtered.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500 border-dashed border-neutral-200">
          Tidak ada sales plan untuk filter ini.
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((plan) => {
            const statusLabel = plan.status || 'Draft'
            const approvalLabel = plan.approvalStatus || 'Pending'
            const decisionDateText = plan.managerDecisionDate
              ? `Diputuskan manager pada ${new Date(
                  plan.managerDecisionDate
                ).toLocaleString('id-ID')}`
              : 'Belum ada keputusan manager'

            return (
              <Card
                key={plan.id}
                className="p-4 space-y-3 border border-neutral-200/80 hover:border-[#1D4ED8]/30 hover:shadow-sm transition-all duration-150 cursor-pointer"
                onClick={() => openPlanDetail(plan)}
              >
                {/* Header: title + badges */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold text-neutral-900">
                      {plan.title || 'Untitled Sales Plan'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {plan.dateStart && plan.dateEnd
                        ? `${plan.dateStart} → ${plan.dateEnd}`
                        : 'Periode belum diisi'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(
                        plan.status
                      )}`}
                    >
                      {statusLabel}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${approvalTone(
                        plan.approvalStatus
                      )}`}
                    >
                      Approval: {approvalLabel}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {plan.description && (
                  <p className="text-sm text-neutral-700 leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>
                )}

                {/* Lampiran + Catatan Manager */}
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  {/* Lampiran */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Lampiran Sales Plan
                    </p>
                    {plan.attachment ? (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#D0D7F2] bg-[#F5F7FF] px-3 py-2 text-sm text-[#1D4ED8]">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/80">
                          <FiPaperclip className="w-4 h-4" />
                        </span>
                        <span className="truncate max-w-[220px]">
                          {plan.attachment.fileName}
                        </span>
                        {plan.attachment.size && (
                          <span className="text-xs text-neutral-400">
                            ({plan.attachment.size})
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">
                        Belum ada lampiran.
                      </p>
                    )}
                  </div>

                  {/* Catatan Manager Business Service */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Catatan {MANAGER_LABEL}
                    </p>
                    {plan.managerComment ? (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                        {plan.managerComment}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">
                        Belum ada catatan. Menunggu feedback dari {MANAGER_LABEL}.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <span className="text-[11px] text-neutral-500">
                    {decisionDateText}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          resetForm()
        }}
        title="Create Sales Plan"
        panelClassName="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="back"
              onClick={() => {
                setIsCreateOpen(false)
                resetForm()
              }}
            >
              Batal
            </Button>
            <Button onClick={handleCreatePlan}>Create</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
              Judul Plan<span className="text-rose-500">*</span>
            </div>
            <FormInput
              value={form.title}
              onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
              error={!!errors.title}
              placeholder="Contoh: Q4 2025 Digitalization Push"
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
              Pelanggan<span className="text-rose-500">*</span>
            </div>
            <FormInput
              value={form.customerName}
              onChange={(value) => setForm((prev) => ({ ...prev, customerName: value }))}
              error={!!errors.customerName}
              placeholder="Nama pelanggan terkait sales plan ini"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Tanggal Mulai<span className="text-rose-500">*</span>
              </div>
              <FormInput
                type="date"
                value={form.dateStart}
                onChange={(value) => setForm((prev) => ({ ...prev, dateStart: value }))}
                error={!!errors.dateStart}
              />
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Tanggal Selesai<span className="text-rose-500">*</span>
              </div>
              <FormInput
                type="date"
                value={form.dateEnd}
                onChange={(value) => setForm((prev) => ({ ...prev, dateEnd: value }))}
                error={!!errors.dateEnd}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
              Status
            </div>
            <FormInput
              type="select"
              value={form.status}
              onChange={(value) => setForm((prev) => ({ ...prev, status: value || 'Draft' }))}
              options={STATUS_OPTIONS}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
              Deskripsi
            </div>
            <FormInput
              type="textarea"
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
              placeholder="Ringkasan plan, objective, scope, dll."
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase text-neutral-600 mb-1">
              Lampiran Sales Plan
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-neutral-600 border border-dashed border-neutral-300 rounded-xl px-3 py-2"
            />
            {form.fileName && (
              <p className="text-xs text-neutral-500 mt-1">File terpilih: {form.fileName}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
