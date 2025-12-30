import React, { useState, useMemo, useCallback, memo } from 'react'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import FormInput from '@components/ui/FormInput'
import PickerModal from '@components/ui/PickerModal'
import { Badge } from '@components/ui/Badge'
import {
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiMessageSquare,
  FiCalendar,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'
import Table from '@components/ui/Table'

/* =========================
   Constants (unchanged)
========================= */
const ROLES = ['Decision Maker', 'Influencer', 'User', 'Gatekeeper', 'Sponsor', 'Technical Buyer', 'Economic Buyer', 'Champion']
const REL_STATUSES = ['Promotor', 'Netral', 'Detractor']
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Biannually', 'Yearly', 'Ad hoc']
const MECHANISMS = ['WhatsApp', 'Email', 'Telepon', 'Meeting onsite', 'Meeting online', 'Presentasi', 'QBR', 'Ticket system']
const EFFORTS = ['Pembuatan grup WA dedicated', 'Regular check-in', 'Undangan workshop', 'Executive briefing', 'Kirim case study relevan', 'Sesi QBR', 'Follow up issue terbuka']

const MODULES = [
  { id: 'rp1', icon: FiUsers,         title: '1. The Health of the Relationship',  description: 'Status hubungan dengan Pelanggan',
    columns: [
      { key: 'pic', label: 'Nama PIC', type: 'text', required: true },
      { key: 'position', label: 'Jabatan', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'select', options: ROLES, required: true },
      { key: 'relStatus', label: 'Relationship Status', type: 'select', options: REL_STATUSES, required: true },
      { key: 'notes', label: 'Keterangan', type: 'text', required: false },
    ],
  },
  { id: 'rp2', icon: FiTrendingUp,    title: '2. Action to Grow the Relationship', description: 'Tindakan untuk menjaga dan meningkatkan hubungan baik',
    columns: [
      { key: 'done', label: 'Selesai?', type: 'checkbox', required: false, className: 'w-[100px]' },
      { key: 'effort', label: 'Relationship Effort', type: 'textarea', required: true, suggestions: EFFORTS },
      { key: 'notes', label: 'Keterangan', type: 'text', required: false, className: 'min-w-[200px]' },
    ],
  },
  { id: 'rp3', icon: FiAlertTriangle, title: '3. Conflict Description',            description: 'Deskripsi konflik yang pernah terjadi',
    columns: [
      { key: 'conflict', label: 'Konflik', type: 'text', required: true },
      { key: 'desc', label: 'Deskripsi', type: 'textarea', required: true },
      { key: 'date', label: 'Tanggal', type: 'date', required: true },
      { key: 'solution', label: 'Solusi', type: 'textarea', required: true },
    ],
  },
  { id: 'rp4', icon: FiMessageSquare, title: '4. Communication Method',            description: 'Metode komunikasi dengan PIC Pelanggan',
    columns: [
      { key: 'pic', label: 'Nama PIC', type: 'text', required: true },
      { key: 'position', label: 'Jabatan', type: 'text', required: true },
      { key: 'mechanism', label: 'Mekanisme Komunikasi', type: 'textarea', required: true, suggestions: MECHANISMS },
      { key: 'notes', label: 'Keterangan (opsional)', type: 'text', required: false },
    ],
  },
  { id: 'rp5', icon: FiCalendar,      title: '5. Communication Frequency',         description: 'Seberapa sering berkomunikasi dengan pelanggan',
    columns: [
      { key: 'pic', label: 'Nama PIC', type: 'text', required: true },
      { key: 'position', label: 'Jabatan', type: 'text', required: true },
      { key: 'frequency', label: 'Frekuensi Komunikasi', type: 'select', options: FREQUENCIES, required: true },
      { key: 'notes', label: 'Keterangan (opsional)', type: 'text', required: false },
    ],
  },
]

/* Accent colors per module for softer, friendlier visuals */
const ICON_STYLES = {
  rp1: { bg: 'bg-indigo-50', ring: 'ring-indigo-100', text: 'text-indigo-600' },
  rp2: { bg: 'bg-emerald-50', ring: 'ring-emerald-100', text: 'text-emerald-600' },
  rp3: { bg: 'bg-amber-50', ring: 'ring-amber-100', text: 'text-amber-600' },
  rp4: { bg: 'bg-violet-50', ring: 'ring-violet-100', text: 'text-violet-600' },
  rp5: { bg: 'bg-cyan-50', ring: 'ring-cyan-100', text: 'text-cyan-600' },
}

/* =========================
   Utils (unchanged logic)
========================= */
function computeModuleStatus(rows, columns) {
  let total = 0, filled = 0
  ;(rows || []).forEach((row) => {
    columns.forEach((c) => {
      if (c.required !== false) {
        total++
        const v = row?.[c.key]
        if (v !== undefined && v !== null && String(v).trim() !== '') filled++
      }
    })
  })
  let status = 'pending'
  if (!rows?.length || total === 0 || filled === 0) status = 'pending'
  else if (filled === total) status = 'completed'
  else status = 'partial'
  return { status, filled, total }
}

function StatusBadge({ status }) {
  const variant = status === 'completed' ? 'success' : status === 'partial' ? 'info' : 'neutral'
  const label = status === 'completed' ? 'SUDAH DIISI' : status === 'partial' ? 'SEBAGIAN' : 'BELUM DIISI'
  return <Badge variant={variant} className="font-semibold text-[11px] tracking-wide">{label}</Badge>
}

function validateModule(rows, columns) {
  const missing = []
  ;(rows || []).forEach((row) => {
    columns.forEach((c) => {
      if (c.required !== false) {
        const v = row?.[c.key]
        if (v === undefined || v === null || String(v).trim() === '') missing.push(c.key)
      }
    })
  })
  return missing
}

/* =========================
   Reusable Input
   (PIC tidak lagi menampilkan modal di sini.
    Hanya memicu modal global via openPicPicker)
========================= */
const Input = memo(function Input({
  col, value, disabled, onChange, error, size = 'md', openPicPicker
}) {
  const isPIC = col.key === 'pic'

  if (isPIC) {
    return (
      <button
        type="button"
        className={`w-full text-left rounded-lg ${size === 'sm' ? 'px-3 py-2 text-[13px] border' : 'px-4 py-2.5 text-sm border-2'} bg-white ${error ? 'border-rose-300' : 'border-neutral-200'} hover:border-neutral-300 transition`}
        onClick={() => !disabled && openPicPicker?.()}
        disabled={disabled}
        title="Pilih PIC"
      >
        <span className={`${value ? 'text-neutral-900' : 'text-neutral-400'}`}>
          {value || col.placeholder || 'Pilih PIC'}
        </span>
      </button>
    )
  }

  return (
    <FormInput
      type={col.type || 'text'}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={col.placeholder || ''}
      options={col.options || []}
      suggestions={col.suggestions || []}
      error={error}
      size={size}
    />
  )
})

/* =========================
   ModuleTable (polished)
========================= */
const ModuleTable = memo(function ModuleTable({
  module,
  isEditing,
  rows,
  onEdit,
  onSave,
  onCancel,
  onAddRow,
  onDeleteRow,
  onUpdateCell,
  onOpenPicPicker, // <- new
}) {
  const { status } = computeModuleStatus(rows, module.columns)
  const tone = ICON_STYLES[module.id] || ICON_STYLES.rp1

  const tableColumns = useMemo(() => {
    const base = module.columns.map((c) => ({
      key: c.key,
      label: c.label,
      className: c.className || '',
    }))
    if (isEditing) base.push({ key: '_actions', label: 'Aksi', className: 'w-[80px] text-right' })
    return base
  }, [module.columns, isEditing])

  return (
    <Card className="p-0 overflow-hidden bg-white shadow-sm ring-1 ring-neutral-200/70 rounded-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}>
              <module.icon className="w-4.5 h-4.5" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{module.title}</h3>
              <p className="text-[12.5px] text-neutral-500">{module.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {!isEditing ? (
              <Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button>
            ) : (
              <>
                <Button size="sm" onClick={onSave}>Save</Button>
                <Button size="sm" variant="back" onClick={onCancel}>Batal</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        className="bg-white rounded-none shadow-none ring-0 text-[13px]"
        dense
        columns={tableColumns}
        data={rows}
        rowKey="id"
        renderCell={(row, key) => {
          if (key === '_actions') {
            const idx = rows.findIndex((r) => r.id === row.id)
            return (
              <div className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="!p-1 text-rose-600 hover:bg-rose-50"
                  onClick={() => onDeleteRow(idx)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            )
          }

          const col = module.columns.find((c) => c.key === key)
          if (!col) return null

          const idx = rows.findIndex((r) => r.id === row.id)
          const value = row[key]
          const error = isEditing && col.required !== false && (!value || String(value).trim() === '')

          // View mode — checkbox tetap interaktif
          if (!isEditing) {
            if (col.type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                  checked={!!value}
                  onChange={(e) => onUpdateCell(idx, key, e.target.checked)}
                />
              )
            }
            return <span className="text-neutral-800 leading-relaxed">{String(value ?? '-')}</span>
          }

          // Edit mode
          if (col.type === 'checkbox') {
            return (
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
                checked={!!value}
                onChange={(e) => onUpdateCell(idx, key, e.target.checked)}
              />
            )
          }

          // For PIC, open centralized modal with moduleId + rowIndex
          const openPicPicker = col.key === 'pic'
            ? () => onOpenPicPicker(module.id, idx, value)
            : undefined

          return (
            <Input
              col={col}
              disabled={false}
              value={value}
              onChange={(val) => onUpdateCell(idx, key, val)}
              size="sm"
              error={error}
              openPicPicker={openPicPicker}
            />
          )
        }}
        emptyMessage="Belum ada data. Klik 'Tambah Baris' untuk memulai."
      />

      {/* Footer — only when editing */}
      {isEditing && (
        <div className="px-4 py-3 border-t border-neutral-200 bg-white">
          <Button variant="ghost" size="sm" className="inline-flex items-center gap-2" onClick={onAddRow}>
            <FiPlus /> Tambah Baris
          </Button>
        </div>
      )}
    </Card>
  )
})

/* =========================
   Main Page (with centralized PIC Picker Modal)
========================= */
export default function RelationshipPlan({ customerId = 'demo', contacts = [] }) {
  const storageKey = useMemo(() => `relationshipPlan_${customerId}`, [customerId])
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) return JSON.parse(raw)
    } catch {}
    return {
      rp1: [],
      rp2: [{ id: 'rp2_1', done: true, effort: 'Pembuatan grup WA dedicated', notes: '' }],
      rp3: [{ id: 'rp3_1', conflict: 'Layanan internet down', desc: 'Internet mati pada working hour', date: '2025-08-20', solution: 'Pembenahan jaringan' }],
      rp4: [{ id: 'rp4_1', pic: 'Bapak Budi', position: 'Direktur IT', mechanism: 'Visit langsung, email', notes: 'Secara formal' }],
      rp5: [{ id: 'rp5_1', pic: 'Bapak Budi', position: 'Direktur IT', frequency: 'Quarterly', notes: 'Formal QBR' }],
    }
  })

  const [editing, setEditing] = useState({})
  const [drafts, setDrafts] = useState({})

  const saveData = useCallback((next) => {
    setData(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
  }, [storageKey])

  /* Contacts */
  const contactsList = useMemo(() => {
    let list = []
    if (Array.isArray(contacts)) list = contacts.filter((c) => c && c.name)
    else if (contacts && typeof contacts === 'object') {
      Object.values(contacts).forEach((arr) => { if (Array.isArray(arr)) list.push(...arr.filter((c) => c && c.name)) })
    }
    const seen = new Set(), unique = []
    for (const c of list) if (!seen.has(c.name)) { seen.add(c.name); unique.push(c) }
    return unique
  }, [contacts])

  const contactsNames = useMemo(() => contactsList.map((c) => c.name), [contactsList])
  const contactsMap = useMemo(() => Object.fromEntries(contactsList.map((c) => [c.name, c])), [contactsList])

  /* Centralized PIC picker modal state */
  const [picPickerOpen, setPicPickerOpen] = useState(false)
  const [picContext, setPicContext] = useState(null) // { moduleId, rowIndex, current }

  const openPicPicker = useCallback((moduleId, rowIndex, currentValue) => {
    setPicContext({ moduleId, rowIndex, current: currentValue || '' })
    setPicPickerOpen(true)
  }, [])

  const closePicPicker = useCallback(() => {
    setPicPickerOpen(false)
    setPicContext(null)
  }, [])

  /* Data handlers */
  const updateCell = useCallback((moduleId, rowIndex, key, value) => {
    const targetIsDraft = !!editing[moduleId]
    const applyUpdate = (arr) => {
      const rows = [...(arr || [])]
      const row = { ...(rows[rowIndex] || {}) }
      row[key] = value
      if (key === 'pic') {
        const module = MODULES.find((m) => m.id === moduleId)
        const hasPosition = module?.columns?.some((c) => c.key === 'position')
        if (hasPosition) {
          const c = contactsMap[value]
          if (c?.title) row['position'] = c.title
        }
      }
      rows[rowIndex] = row
      return rows
    }
    if (targetIsDraft) {
      setDrafts((prev) => ({ ...prev, [moduleId]: applyUpdate(prev[moduleId]) }))
    } else {
      setData((prev) => {
        const next = { ...prev, [moduleId]: applyUpdate(prev[moduleId]) }
        saveData(next)
        return next
      })
    }
  }, [editing, contactsMap, saveData])

  const addRow = useCallback((moduleId, columns) => {
    const empty = { id: `temp_${Date.now()}` }
    columns.forEach((c) => (empty[c.key] = c.type === 'checkbox' ? false : ''))
    if (editing[moduleId]) {
      setDrafts((prev) => ({ ...prev, [moduleId]: [...(prev[moduleId] || []), empty] }))
    } else {
      setData((prev) => {
        const next = { ...prev, [moduleId]: [...(prev[moduleId] || []), empty] }
        saveData(next)
        return next
      })
    }
  }, [editing, saveData])

  const deleteRow = useCallback((moduleId, index) => {
    if (editing[moduleId]) {
      setDrafts((prev) => {
        const rows = [...(prev[moduleId] || [])]
        rows.splice(index, 1)
        return { ...prev, [moduleId]: rows }
      })
    } else {
      setData((prev) => {
        const rows = [...(prev[moduleId] || [])]
        rows.splice(index, 1)
        const next = { ...prev, [moduleId]: rows }
        saveData(next)
        return next
      })
    }
  }, [editing, saveData])

  const handleEdit = useCallback((moduleId) => {
    setDrafts((prev) => ({ ...prev, [moduleId]: JSON.parse(JSON.stringify(data[moduleId] || [])) }))
    setEditing((e) => ({ ...e, [moduleId]: true }))
  }, [data])

  const handleSave = useCallback((moduleId) => {
    const rows = drafts[moduleId]
    const module = MODULES.find((m) => m.id === moduleId)
    const missing = validateModule(rows, module.columns)
    if (missing.length) return alert('Periksa kembali field yang wajib diisi')

    setData((prev) => {
      const next = { ...prev, [moduleId]: rows || [] }
      saveData(next)
      return next
    })
    setEditing((e) => ({ ...e, [moduleId]: false }))
    setDrafts((prev) => { const n = { ...prev }; delete n[moduleId]; return n })
  }, [drafts, saveData])

  const handleCancel = useCallback((moduleId) => {
    setDrafts((prev) => { const n = { ...prev }; delete n[moduleId]; return n })
    setEditing((e) => ({ ...e, [moduleId]: false }))
  }, [])

  /* Render */
  return (
    <div className="space-y-5">
      {/* Softer page header */}
      <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50/60 px-4 py-4">
        <h3 className="text-[18px] font-semibold text-slate-900">Manajemen Komunikasi & Hubungan</h3>
        <p className="text-[13.5px] text-neutral-600 mt-1">
          Rencana interaksi, frekuensi, dan health status hubungan dengan PIC pelanggan.
        </p>
      </div>

      <div className="space-y-4">
        {MODULES.map((m) => {
          const isEditing = !!editing[m.id]
          const rows = isEditing ? (drafts[m.id] ?? []) : (data[m.id] || [])
          return (
            <ModuleTable
              key={m.id}
              module={m}
              isEditing={isEditing}
              rows={rows}
              onEdit={() => handleEdit(m.id)}
              onSave={() => handleSave(m.id)}
              onCancel={() => handleCancel(m.id)}
              onAddRow={() => addRow(m.id, m.columns)}
              onDeleteRow={(index) => deleteRow(m.id, index)}
              onUpdateCell={(index, key, value) => updateCell(m.id, index, key, value)}
              onOpenPicPicker={(moduleId, rowIndex, current) => openPicPicker(moduleId, rowIndex, current)}
            />
          )
        })}
      </div>

      {/* ===== Centralized PIC Picker Modal (outside all cards) ===== */}
      <PickerModal
        open={picPickerOpen}
        onClose={closePicPicker}
        title="Pilih PIC"
        items={contactsNames.map((n) => ({ key: n, title: n, subtitle: contactsMap[n]?.title }))}
        emptyText="Tidak ada hasil"
        // Disable duplicate PIC for rows within the same module if needed (optional)
        onSelect={(key) => {
          if (picContext) {
            updateCell(picContext.moduleId, picContext.rowIndex, 'pic', key)
          }
          closePicPicker()
        }}
      />
    </div>
  )
}
