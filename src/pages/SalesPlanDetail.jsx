import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Modal from '@components/ui/Modal'
import FormInput from '@components/ui/FormInput'
import Tag from '@components/ui/Tag'
import { Badge } from '@components/ui/Badge'
import YesNoToggle from '@components/ui/YesNoToggle'
import { FiTrash2 } from 'react-icons/fi'
import { useAuth } from '@auth/AuthContext'
import { ROLES, ROLE_LABELS } from '@auth/roles'

const INIT_STATUS = ['DIRENCANAKAN', 'SEDANG BERJALAN', 'BELUM MULAI', 'SELESAI']
const MANAGER_LABEL = ROLE_LABELS[ROLES.manager] || 'Manager'
const ACCOUNT_MANAGER_LABEL = ROLE_LABELS[ROLES.sales] || 'Account Manager'

export default function SalesPlanDetail() {
  const { id: customerId, planId } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const isSales = role === ROLES.sales
  const isManager = role === ROLES.manager

  // --- Plan info (read-only from storage) ---
  const planStorageKey = React.useMemo(() => `salesPlan_${customerId}`, [customerId])
  const [plans] = React.useState(() => {
    try {
      const raw = localStorage.getItem(planStorageKey)
      if (raw) return JSON.parse(raw)
    } catch {}
    return []
  })

  const plan = React.useMemo(
    () => plans.find((p) => p.id === planId) || { title: '-', dateStart: '', dateEnd: '' },
    [plans, planId]
  )

  const isPlanApproved = plan.approvalStatus === 'Approved'
  // ✅ hanya SALES + plan Approved yang boleh manage inisiatif & task
  const canManageInitiatives = isSales && isPlanApproved

  // --- Initiatives persisted per-plan ---
  const initKey = React.useMemo(
    () => `salesPlan_${customerId}_${planId}_initiatives`,
    [customerId, planId]
  )

  const [inits, setInits] = React.useState(() => {
    try {
      const raw = localStorage.getItem(initKey)
      if (raw) return JSON.parse(raw)
    } catch {}
    return []
  })

  const persistInits = React.useCallback(
    (next) => {
      setInits(next)
      try {
        localStorage.setItem(initKey, JSON.stringify(next))
      } catch {}
    },
    [initKey]
  )

  // --- Create initiative modal ---
  const [openInit, setOpenInit] = React.useState(false)
  const [initForm, setInitForm] = React.useState({
    action: '',
    products: '',
    pics: '',
    status: INIT_STATUS[0],
  })
  const [errors, setErrors] = React.useState({})

  const validateInit = React.useCallback(() => {
    const e = {}
    if (!initForm.action.trim()) e.action = true
    setErrors(e)
    return Object.keys(e).length === 0
  }, [initForm])

  const addInitiative = React.useCallback(() => {
    if (!validateInit()) return

    const newInit = {
      id: `init_${Date.now()}`,
      action: initForm.action,
      products: (initForm.products || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      pics: (initForm.pics || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: initForm.status,
      tasks: [],
    }

    persistInits([...inits, newInit])
    setOpenInit(false)
    setInitForm({ action: '', products: '', pics: '', status: INIT_STATUS[0] })
    setErrors({})
  }, [initForm, inits, persistInits, validateInit])

  // --- Task toggle ---
  const toggleTask = React.useCallback(
    (initId, taskId, done) => {
      if (!canManageInitiatives) return
      const next = inits.map((it) =>
        it.id === initId
          ? {
              ...it,
              tasks: (it.tasks || []).map((t) =>
                t.id === taskId ? { ...t, done } : t
              ),
            }
          : it
      )
      persistInits(next)
    },
    [inits, persistInits, canManageInitiatives]
  )

  // --- Delete initiative ---
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [deleteTargetId, setDeleteTargetId] = React.useState(null)

  const askDeleteInit = React.useCallback(
    (initId) => {
      if (!canManageInitiatives) return
      setDeleteTargetId(initId)
      setConfirmOpen(true)
    },
    [canManageInitiatives]
  )

  const confirmDeleteInit = React.useCallback(() => {
    if (!deleteTargetId) return
    persistInits(inits.filter((it) => it.id !== deleteTargetId))
    setConfirmOpen(false)
    setDeleteTargetId(null)
  }, [deleteTargetId, inits, persistInits])

  // --- Add Task modal per-initiative ---
  const [taskModalOpen, setTaskModalOpen] = React.useState(false)
  const [activeInitId, setActiveInitId] = React.useState(null)
  const [taskForm, setTaskForm] = React.useState({ title: '', requiresCustomer: false })

  const openTaskModal = React.useCallback(
    (initId) => {
      if (!canManageInitiatives) return
      setActiveInitId(initId)
      setTaskForm({ title: '', requiresCustomer: false })
      setTaskModalOpen(true)
    },
    [canManageInitiatives]
  )

  const addTaskToActive = React.useCallback(() => {
    const title = (taskForm.title || '').trim()
    if (!title || !activeInitId) return

    const next = inits.map((it) =>
      it.id === activeInitId
        ? {
            ...it,
            tasks: [
              ...(it.tasks || []),
              {
                id: `t_${Date.now()}`,
                title,
                done: false,
                requiresCustomer: !!taskForm.requiresCustomer,
              },
            ],
          }
        : it
    )

    persistInits(next)
    setTaskModalOpen(false)
    setActiveInitId(null)
    setTaskForm({ title: '', requiresCustomer: false })
  }, [taskForm, activeInitId, inits, persistInits])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">{plan.title}</h2>
          <div className="text-sm text-neutral-600">
            Periode: {plan.dateStart || '-'} s.d. {plan.dateEnd || '-'}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {/* Approval badge */}
            <span
              className={`px-2 py-0.5 rounded-full border ${
                plan.approvalStatus === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : plan.approvalStatus === 'Rejected'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {plan.approvalStatus || 'Pending'}
            </span>

            {/* Lampiran, kalau ada */}
            {plan.fileName && (
              <a
                href={plan.fileData}
                download={plan.fileName}
                className="text-[#2C5CC5] hover:underline inline-flex items-center gap-1"
              >
                Unduh Lampiran ({plan.fileName})
              </a>
            )}
          </div>

          {/* Catatan Manager Business Service */}
          {plan.managerComment && (
            <p className="text-xs text-neutral-500 mt-1">
              <span className="font-semibold">Catatan {MANAGER_LABEL}:</span> {plan.managerComment}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="back"
            onClick={() => navigate(`/customers/${customerId}#sales`)}
          >
            Kembali ke Sales Plan
          </Button>

          {/* Tombol Tambah Inisiatif HANYA untuk SALES */}
          {isSales && (
            <Button
              onClick={() => {
                if (canManageInitiatives) setOpenInit(true)
              }}
              disabled={!canManageInitiatives}
            >
              Tambah Inisiatif
            </Button>
          )}
        </div>
      </div>

      {/* Info peran */}
      {!canManageInitiatives && (
        <Card className="border border-neutral-200 bg-neutral-50 text-sm text-neutral-700">
          {isManager && (
            <p>
              Anda masuk sebagai <span className="font-semibold">{MANAGER_LABEL}</span>.
              Halaman ini hanya dapat dilihat (read-only). Penambahan dan perubahan
              inisiatif dilakukan oleh <span className="font-semibold">{ACCOUNT_MANAGER_LABEL}</span>
              setelah sales plan disetujui.
            </p>
          )}
          {isSales && !isPlanApproved && (
            <p>
              Sales plan ini masih berstatus{' '}
              <span className="font-semibold">
                {plan.approvalStatus || 'Pending'}
              </span>
              . Inisiatif baru dapat dibuat setelah sales plan{' '}
              <span className="font-semibold">Approved</span> oleh {MANAGER_LABEL}.
            </p>
          )}
          {!isSales && !isManager && (
            <p>Role Anda tidak memiliki akses untuk mengubah inisiatif pada sales plan ini.</p>
          )}
        </Card>
      )}

      {/* Initiatives table */}
      <Card className="p-0 overflow-hidden ring-1 ring-neutral-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-neutral-50 text-left text-[12px] text-neutral-600">
                <th className="px-4 py-3 font-semibold">Inisiatif / Action Item</th>
                <th className="px-4 py-3 font-semibold">Produk Target</th>
                <th className="px-4 py-3 font-semibold">PIC Target</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold w-[420px]">Task List</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {inits.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-neutral-500">
                    Belum ada inisiatif untuk sales plan ini.
                    {canManageInitiatives && (
                      <>
                        {' '}
                        Klik <span className="font-medium">Tambah Inisiatif</span> untuk mulai
                        menyusun action plan.
                      </>
                    )}
                  </td>
                </tr>
              )}

              {inits.map((it) => {
                const total = (it.tasks || []).length
                const done = (it.tasks || []).filter((t) => t.done).length

                return (
                  <tr key={it.id} className="align-top">
                    {/* Action */}
                    <td className="px-4 py-4 text-sm text-neutral-900">
                      {it.action}
                    </td>

                    {/* Produk */}
                    <td className="px-4 py-4 space-y-1">
                      {(it.products || []).map((p, i) => (
                        <Tag key={`${p}-${i}`}>{p}</Tag>
                      ))}
                    </td>

                    {/* PIC */}
                    <td className="px-4 py-4 space-y-1">
                      {(it.pics || []).map((p, i) => (
                        <span
                          key={`${p}-${i}`}
                          className="inline-block text-[11px] font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mr-2"
                        >
                          {p}
                        </span>
                      ))}
                    </td>

                    {/* Status Inisiatif */}
                    <td className="px-4 py-4">
                      <span
                        className={
                          'inline-block text-[11px] font-bold px-3 py-1 rounded-full border ' +
                          (it.status === 'DIRENCANAKAN'
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                            : it.status === 'SEDANG BERJALAN'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : it.status === 'BELUM MULAI'
                            ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                        }
                      >
                        {it.status}
                      </span>
                    </td>

                    {/* Task List */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        {(it.tasks || []).map((t) => (
                          <label key={t.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-blue-600"
                              checked={!!t.done}
                              disabled={!canManageInitiatives}
                              onChange={(e) =>
                                canManageInitiatives &&
                                toggleTask(it.id, t.id, e.target.checked)
                              }
                            />
                            <span
                              className={`text-[13px] ${
                                t.done
                                  ? 'line-through text-neutral-400'
                                  : 'text-neutral-800'
                              }`}
                            >
                              {t.title}
                            </span>
                            {t.requiresCustomer && (
                              <Badge variant="info" className="ml-1">
                                Butuh customer
                              </Badge>
                            )}
                          </label>
                        ))}

                        <div className="flex items-center justify-between">
                          <div className="text-[12px] font-medium text-neutral-500">
                            {done}/{total} completed
                          </div>

                          {canManageInitiatives && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => openTaskModal(it.id)}
                              className="px-2.5 py-1 text-[12px]"
                            >
                              Tambah Task
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {canManageInitiatives && (
                          <button
                            type="button"
                            onClick={() => askDeleteInit(it.id)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
                            title="Hapus inisiatif"
                            aria-label="Hapus inisiatif"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Tambah Inisiatif */}
      <Modal
        open={openInit}
        onClose={() => {
          setOpenInit(false)
          setErrors({})
        }}
        title="Tambah Inisiatif"
        panelClassName="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="back"
              onClick={() => {
                setOpenInit(false)
                setErrors({})
              }}
            >
              Batal
            </Button>
            <Button onClick={addInitiative}>Tambah</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
              Inisiatif / Action Item<span className="text-rose-500">*</span>
            </div>
            <FormInput
              type="textarea"
              value={initForm.action}
              onChange={(v) => setInitForm((f) => ({ ...f, action: v }))}
              error={!!errors.action}
              placeholder="Contoh: Lakukan QBR dengan CIO, siapkan deck modernisasi jaringan…"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                Produk Target
              </div>
              <FormInput
                type="text"
                placeholder="Pisahkan dengan koma"
                value={initForm.products}
                onChange={(v) => setInitForm((f) => ({ ...f, products: v }))}
              />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                PIC Target
              </div>
              <FormInput
                type="text"
                placeholder="Pisahkan dengan koma"
                value={initForm.pics}
                onChange={(v) => setInitForm((f) => ({ ...f, pics: v }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                Status
              </div>
              <FormInput
                type="select"
                value={initForm.status}
                onChange={(v) => setInitForm((f) => ({ ...f, status: v }))}
                options={INIT_STATUS}
              />
            </div>
            <div />
          </div>
        </div>
      </Modal>

      {/* Modal: Tambah Task */}
      <Modal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false)
          setActiveInitId(null)
        }}
        title="Tambah Task"
        panelClassName="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="back"
              onClick={() => {
                setTaskModalOpen(false)
                setActiveInitId(null)
              }}
            >
              Batal
            </Button>
            <Button onClick={addTaskToActive}>Tambah</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold text-neutral-600 uppercase mb-1">
              Judul Task<span className="text-rose-500">*</span>
            </div>
            <FormInput
              type="text"
              value={taskForm.title}
              onChange={(v) => setTaskForm((f) => ({ ...f, title: v }))}
              placeholder="Contoh: Kirim deck QBR ke CIO"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-neutral-600">Butuh customer?</span>
            <YesNoToggle
              value={!!taskForm.requiresCustomer}
              onChange={(v) =>
                setTaskForm((f) => ({ ...f, requiresCustomer: !!v }))
              }
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Confirm Delete Initiative */}
      <Modal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setDeleteTargetId(null)
        }}
        title="Hapus Inisiatif"
        panelClassName="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="back"
              onClick={() => {
                setConfirmOpen(false)
                setDeleteTargetId(null)
              }}
            >
              Batal
            </Button>
            <Button variant="danger" onClick={confirmDeleteInit}>
              Hapus
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-neutral-700">
            Anda yakin ingin menghapus inisiatif ini? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          {deleteTargetId &&
            (() => {
              const target = inits.find((x) => x.id === deleteTargetId)
              return target ? (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                  <div className="text-[13px] font-semibold text-neutral-900">
                    {target.action}
                  </div>
                  <div className="text-[12px] text-neutral-600">
                    {(target.tasks?.length || 0)} task terkait
                  </div>
                </div>
              ) : null
            })()}
        </div>
      </Modal>
    </div>
  )
}
