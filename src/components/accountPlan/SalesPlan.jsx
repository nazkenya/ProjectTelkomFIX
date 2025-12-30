import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import FormInput from '@components/ui/FormInput'
import SearchInput from '@components/ui/SearchInput'
import { FiTrash2, FiPlus, FiPaperclip } from 'react-icons/fi'
import { useAuth } from '@auth/AuthContext'
import { ROLES, ROLE_LABELS } from '@auth/roles'

const STATUSES = ['Draft', 'Active', 'Closed']
const ACCOUNT_MANAGER_LABEL = ROLE_LABELS[ROLES.sales] || 'Account Manager'

const statusClass = (s) =>
  s === 'Active'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : s === 'Closed'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-neutral-100 text-neutral-700 border-neutral-200'

// Hardcoded demo sales plans per customer
const PRESEEDED_PLANS = {
  samsung: [
    {
      id: 'sp-001',
      title: 'SP-Q4 Retention Enterprise',
      dateStart: '2025-10-01',
      dateEnd: '2025-12-31',
      status: 'Draft',
      approvalStatus: 'Pending',
      description:
        'Fokus retaining top 10 key accounts dengan peningkatan cross-sell layanan managed service dan SD-WAN.',
      fileName: 'SP-Q4-Retention-Samsung.pdf',
      fileData: '',
      customerId: 'samsung',
      customerName: 'Samsung Electronics Indonesia',
      ownerName: 'Budi Santoso',
      managerComment: '',
      managerDecisionDate: null,
    },
    {
      id: 'sp-005',
      title: 'SP-Samsung Hybrid Cloud Expansion',
      dateStart: '2025-03-01',
      dateEnd: '2025-12-31',
      status: 'Active',
      approvalStatus: 'Approved',
      description:
        'Perluas footprint hybrid cloud; fokus workload ERP, data lake, observability, dan keamanan.',
      fileName: 'SP-Samsung-Hybrid-Cloud.pdf',
      fileData: '',
      customerId: 'samsung',
      customerName: 'Samsung Electronics Indonesia',
      ownerName: 'Budi Santoso',
      managerComment:
        'Fokuskan quick win pada observability & security; siapkan showcase dashboard untuk CIO Samsung.',
      managerDecisionDate: '2025-03-10T10:00:00.000Z',
    },
  ],
}

export default function SalesPlan({ customerId = 'demo', customerName = '' }) {
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const storageKey = React.useMemo(() => `salesPlan_${customerId}`, [customerId])

  const [plans, setPlans] = React.useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return []
  })

  // create modal
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    title: '',
    dateStart: '',
    dateEnd: '',
    status: 'Draft',
    description: '',
    fileName: '',
    fileData: '',
  })
  const [errors, setErrors] = React.useState({})

  // delete confirm modal
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState(null)

  // search & filter
  const [q, setQ] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('ALL')

  const resetForm = React.useCallback(() => {
    setForm({
      title: '',
      dateStart: '',
      dateEnd: '',
      status: 'Draft',
      description: '',
      fileName: '',
      fileData: '',
    })
    setErrors({})
  }, [])

  const validate = React.useCallback(() => {
    const e = {}
    if (!form.title.trim()) e.title = true
    if (!form.dateStart) e.dateStart = true
    if (!form.dateEnd) e.dateEnd = true
    if (form.dateStart && form.dateEnd && form.dateEnd < form.dateStart) e.dateEnd = true
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const savePlans = React.useCallback((next) => {
    setPlans(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
  }, [storageKey])

  // Seed mock plans for known customers if none exist
  React.useEffect(() => {
    if (plans.length > 0) return
    const preset = PRESEEDED_PLANS[customerId]
    if (!preset) return
    savePlans(preset)
  }, [plans.length, customerId, savePlans])

  const handleFileChange = React.useCallback((event) => {
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
  }, [])

  const onCreate = React.useCallback(() => {
    if (!validate()) return
    const newPlan = {
      id: `sp_${Date.now()}`,
      ...form,
      customerId,
      customerName,
      ownerName: user?.name || ACCOUNT_MANAGER_LABEL,
      ownerId: user?.id,
      ownerRole: role,
      approvalStatus: 'Pending',
      managerComment: '',
      managerDecisionDate: null,
    }
    const next = [newPlan, ...plans]
    savePlans(next)
    setOpen(false)
    resetForm()
  }, [form, plans, savePlans, validate, resetForm, customerId, customerName, user?.name, user?.id, role])

  const askDelete = React.useCallback((plan) => {
    setDeleteTarget(plan)
    setConfirmOpen(true)
  }, [])

  const confirmDelete = React.useCallback(() => {
    if (!deleteTarget) return
    const next = plans.filter((p) => p.id !== deleteTarget.id)
    savePlans(next)
    setConfirmOpen(false)
    setDeleteTarget(null)
  }, [deleteTarget, plans, savePlans])

  const markClosed = React.useCallback((planId) => {
    savePlans(plans.map(p => p.id === planId ? { ...p, status: 'Closed' } : p))
  }, [plans, savePlans])

  const filteredPlans = React.useMemo(() => {
    const query = q.trim().toLowerCase()
    return plans.filter(p =>
      (!query || (p.title || '').toLowerCase().includes(query)) &&
      (statusFilter === 'ALL' || p.status === statusFilter)
    )
  }, [plans, q, statusFilter])

  return (
    <div className="space-y-5">
      {/* Header — same soft style as Relationship Plan */}
      <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50/60 px-4 py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-[18px] font-semibold text-slate-900">Sales Plan</h3>
            <p className="text-[13.5px] text-neutral-600 mt-1">
              Daftar plan dan inisiatif untuk akun ini.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="inline-flex items-center gap-2">
            <FiPlus /> Create New Plan
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Cari Sales Plan…"
          variant="subtle"
        />
        <div className="w-full sm:w-56">
          <FormInput
            type="select"
            value={statusFilter}
            onChange={setStatusFilter}
            options={['ALL', ...STATUSES]}
          />
        </div>
      </div>

      {/* List */}
      {filteredPlans.length === 0 ? (
        <Card className="p-5 border border-neutral-200">
          <div className="text-sm text-neutral-600">
            Tidak ada hasil. Ubah pencarian atau filter Anda.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map((p) => (
            <article
              key={p.id}
              className="group border border-neutral-200 rounded-xl bg-white p-4 hover:shadow-md transition focus-within:ring-2 focus-within:ring-blue-300"
              onClick={() => navigate(`/customers/${customerId}/sales-plan/${p.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/customers/${customerId}/sales-plan/${p.id}`)
                }
              }}
            >
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[15px] font-semibold text-neutral-900 truncate">
                    {p.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {p.dateStart || '-'} <span className="mx-1">→</span> {p.dateEnd || '-'}
                  </p>
                  {p.ownerName && (
                    <p className="text-[11px] text-neutral-500 mt-0.5">Oleh {p.ownerName}</p>
                  )}
                </div>
                <span
                  className={
                    'px-2 py-1 text-[10px] font-semibold rounded-full border flex-shrink-0 ' +
                    statusClass(p.status)
                  }
                >
                  {p.status}
                </span>
              </header>

              <div className="flex items-center gap-3 mt-3 text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-full border ${
                    p.approvalStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : p.approvalStatus === 'Rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {p.approvalStatus || 'Pending'}
                </span>
                {p.fileName && (
                  <a
                    href={p.fileData}
                    download={p.fileName}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[#2C5CC5] hover:underline"
                  >
                    <FiPaperclip /> {p.fileName}
                  </a>
                )}
              </div>

              {p.description && (
                <p className="mt-2 text-sm text-neutral-700 line-clamp-2">
                  {p.description}
                </p>
              )}

              {/* actions */}
              <footer
                className="mt-3 flex items-center justify-end gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {p.status !== 'Closed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => markClosed(p.id)}
                    className="px-2.5 py-1 text-[12px]"
                    title="Tandai Closed"
                  >
                    Mark Closed
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => askDelete(p)}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  aria-label={`Hapus ${p.title}`}
                  title="Hapus"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={open}
        onClose={() => { setOpen(false); resetForm() }}
        title="Create Sales Plan"
        panelClassName="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="back" onClick={() => { setOpen(false); resetForm() }}>Batal</Button>
            <Button onClick={onCreate}>Create</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
              Judul Plan<span className="text-rose-500">*</span>
            </div>
            <FormInput
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              error={!!errors.title}
              placeholder="Contoh: Q4 2025 Digitalization Push"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                Tanggal Mulai<span className="text-rose-500">*</span>
              </div>
              <FormInput
                type="date"
                value={form.dateStart}
                onChange={(v) => setForm((f) => ({ ...f, dateStart: v }))}
                error={!!errors.dateStart}
              />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                Tanggal Selesai<span className="text-rose-500">*</span>
              </div>
              <FormInput
                type="date"
                value={form.dateEnd}
                onChange={(v) => setForm((f) => ({ ...f, dateEnd: v }))}
                error={!!errors.dateEnd}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">Status</div>
            <FormInput
              type="select"
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              options={STATUSES}
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">Deskripsi</div>
            <FormInput
              type="textarea"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Ringkasan plan, objective, scope, dll."
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">Lampiran Sales Plan</div>
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

      {/* Confirm Delete Modal */}
      <Modal
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTarget(null) }}
        title="Hapus Sales Plan"
        panelClassName="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="back" onClick={() => { setConfirmOpen(false); setDeleteTarget(null) }}>
              Batal
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Hapus
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-neutral-700">
            Anda yakin ingin menghapus sales plan ini?
          </p>
          {deleteTarget && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-[13px] font-semibold text-neutral-900">{deleteTarget.title}</div>
              <div className="text-[12px] text-neutral-600">
                {deleteTarget.dateStart || '-'} <span className="mx-1">→</span> {deleteTarget.dateEnd || '-'}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
