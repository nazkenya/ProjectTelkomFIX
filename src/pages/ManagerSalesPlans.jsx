import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageHeader from '@components/ui/PageHeader'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import SearchInput from '@components/ui/SearchInput'
import Select from '@components/ui/Select'
import { FiPaperclip } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { ROLES, ROLE_LABELS } from '@auth/roles'

import customers from '@/data/mockCustomers'

const approvalTone = (status) => {
  const s = status || 'Pending'
  if (s === 'Approved') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Rejected') return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-amber-50 text-amber-700 border border-amber-200'
}

const statusBadge = (status) => {
  const s = status || 'Draft'
  if (s === 'Active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Closed') return 'bg-blue-50 text-blue-700 border border-blue-200'
  return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
}

const MANAGER_LABEL = ROLE_LABELS[ROLES.manager] || 'Manager Business Service'
const ACCOUNT_MANAGER_LABEL = ROLE_LABELS[ROLES.sales] || 'Account Manager'

export default function ManagerSalesPlans() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [search, setSearch] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [decisionModal, setDecisionModal] = useState({
    open: false,
    plan: null,
    status: 'Approved',
    comment: '',
  })

  // ------- Load aggregated plans from localStorage -------
  const loadPlans = () => {
    const aggregated = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key.startsWith('salesPlan_') || key.includes('_initiatives')) continue

      try {
        const raw = JSON.parse(localStorage.getItem(key) || '[]')
        const customerId = key.replace('salesPlan_', '')
        const customer = customers.find((c) => c.id === customerId)

        raw.forEach((plan) => {
          aggregated.push({
            ...plan,
            customerId: plan.customerId || customerId,
            customerName: plan.customerName || customer?.name || customerId,

            // HARD CODE ATTACHMENT (demo)
            attachment: {
              fileName: 'Sales-Plan-Telkom-Q4.pdf',
              url: '/dummy/sales-plan-q4.pdf', // taruh file di public/
              size: '1.2 MB',
            },
          })
        })
      } catch {
        // ignore invalid JSON
      }
    }

    setPlans(aggregated)
  }

  useEffect(() => {
    loadPlans()
  }, [])

  // ------- Filtered data -------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return plans.filter((plan) => {
      const matchesSearch =
        !q ||
        plan.title?.toLowerCase().includes(q) ||
        plan.customerName?.toLowerCase().includes(q) ||
        plan.ownerName?.toLowerCase().includes(q)

      const planApproval = plan.approvalStatus || 'Pending'
      const matchesApproval =
        approvalFilter === 'all' || planApproval === approvalFilter

      return matchesSearch && matchesApproval
    })
  }, [plans, search, approvalFilter])

  // ------- Modal helpers -------
  const openDecisionModal = (plan, status) => {
    setDecisionModal({
      open: true,
      plan,
      status,
      comment: plan.managerComment || '',
    })
  }

  const closeDecisionModal = () => {
    setDecisionModal({
      open: false,
      plan: null,
      status: 'Approved',
      comment: '',
    })
  }

  const saveDecision = () => {
    const plan = decisionModal.plan
    if (!plan) return

    const storageKey = `salesPlan_${plan.customerId}`
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')

    const isApproved = decisionModal.status === 'Approved'

    const updated = stored.map((item) =>
      item.id === plan.id
        ? {
            ...item,
            // kalau di-approve, status plan berubah jadi Active
            status: isApproved ? 'Active' : (item.status || 'Draft'),
            // status persetujuan sesuai pilihan modal
            approvalStatus: decisionModal.status,
            managerComment: decisionModal.comment,
            managerDecisionDate: new Date().toISOString(),
          }
        : item
    )

    localStorage.setItem(storageKey, JSON.stringify(updated))
    closeDecisionModal()
    loadPlans()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        variant="hero"
        title="Persetujuan Sales Plan"
        subtitle="Tinjau, beri catatan, dan lakukan persetujuan terhadap sales plan yang diajukan tim Anda."
      />

      {/* Filter bar */}
      <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#E0EDFF] text-[#1D4ED8]">
            <FaFilter className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Filter Sales Plan
            </p>
            <p className="text-xs text-neutral-500">
              Cari berdasarkan judul, pelanggan, atau nama Account Manager.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari plan / customer / AM"
            className="w-full md:w-64"
          />
          <Select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="w-full md:w-52"
          >
            <option value="all">Semua Status Persetujuan</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Select>
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
            const approvalLabel = plan.approvalStatus || 'Pending'
            const decisionDateText = plan.managerDecisionDate
              ? `Diperbarui ${new Date(plan.managerDecisionDate).toLocaleString('id-ID')}`
              : 'Menunggu keputusan'

            return (
              <Card
                key={plan.id}
                className="p-4 space-y-3 border border-neutral-200/80 hover:border-[#1D4ED8]/30 hover:shadow-sm transition-all duration-150"
              >
                {/* Header: title + badges */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold text-neutral-900">
                      {plan.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {plan.customerName}{' '}
                      <span className="text-neutral-400">•</span>{' '}
                      oleh{' '}
                      <span className="font-medium text-neutral-700">
                        {plan.ownerName || 'Account Manager'}
                      </span>
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
                      {plan.status || 'Draft'}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${approvalTone(
                        plan.approvalStatus
                      )}`}
                    >
                      Status: {approvalLabel}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {plan.description && (
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {plan.description}
                  </p>
                )}

                {/* Lampiran + Catatan Manager Business Service */}
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  {/* Lampiran Sales Plan */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Lampiran Sales Plan
                    </p>
                    {plan.attachment ? (
                      <a
                        href={plan.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#D0D7F2] bg-[#F5F7FF] px-3 py-2 text-sm text-[#1D4ED8] hover:bg-[#E8EEFF] hover:border-[#1D4ED8] transition-colors"
                      >
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
                      </a>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">
                        Belum ada lampiran yang diunggah oleh Account Manager.
                      </p>
                    )}
                  </div>

                  {/* Catatan Manager (kalau sudah pernah diisi) */}
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
                        Belum ada catatan. Tambahkan catatan saat approve atau reject.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer: waktu update + actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                  <div className="text-xs text-neutral-500">
                    {decisionDateText}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openDecisionModal(plan, 'Approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDecisionModal(plan, 'Rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/customers/${plan.customerId}/sales-plan/${plan.id}`)
                      }
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal keputusan */}
      <Modal
        open={decisionModal.open}
        onClose={closeDecisionModal}
        title={
          decisionModal.plan
            ? `Keputusan Sales Plan - ${decisionModal.plan.title}`
            : 'Keputusan Sales Plan'
        }
        panelClassName="max-w-lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="back" onClick={closeDecisionModal}>
              Batal
            </Button>
            <Button onClick={saveDecision}>
              Simpan ({decisionModal.status === 'Approved' ? 'Approve' : 'Reject'})
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Preview lampiran di modal (kalau ada) */}
          {decisionModal.plan?.attachment && (
            <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50">
              <p className="text-sm text-neutral-700 font-medium mb-1">
                Lampiran Sales Plan
              </p>
              <a
                href={decisionModal.plan.attachment.url}
                className="inline-flex items-center gap-2 text-sm text-[#2C5CC5] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiPaperclip className="w-4 h-4" />
                {decisionModal.plan.attachment.fileName}
              </a>
              {decisionModal.plan.attachment.size && (
                <p className="text-xs text-neutral-400 mt-1">
                  {decisionModal.plan.attachment.size}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1 block">
              Status
            </label>
            <Select
              value={decisionModal.status}
              onChange={(e) =>
                setDecisionModal((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full"
            >
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1 block">
              Catatan untuk {ACCOUNT_MANAGER_LABEL}
            </label>
            <textarea
              value={decisionModal.comment}
              onChange={(e) =>
                setDecisionModal((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              rows={4}
              className="w-full rounded-xl border border-neutral-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5CC5]/30"
              placeholder={`Tuliskan alasan dan masukan yang bisa dilihat oleh ${ACCOUNT_MANAGER_LABEL}…`}
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              Catatan ini akan tersimpan di sales plan dan dapat dilihat oleh peran {ACCOUNT_MANAGER_LABEL}.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
