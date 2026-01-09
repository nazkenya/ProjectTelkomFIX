
import React, { useMemo, useState } from 'react'
import { FiChevronDown, FiChevronRight, FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { RadialProgress } from '../../pages/accountProfile/components/RadialProgress'
import Button from '../ui/Button'

// 9 kelompok activity (seperti value chain) dengan baris yang bisa diisi bebas
const defaultGroups = [
  {
    category: 'Inbound Logistics',
    rows: [
      {
        id: 'in-1',
        activity: 'Penerimaan material / koordinasi supplier',
        gap: 'Lead time tidak konsisten; belum ada SLA dengan vendor.',
        action: 'Buat SLA pengiriman, tambahkan checklist penerimaan, dan dashboard kedatangan.',
        children: [
          {
            id: 'in-1-1',
            activity: 'Koordinasi jadwal kedatangan dengan warehouse',
            gap: 'Notifikasi kedatangan belum terstandardisasi.',
            action: 'Gunakan reminder + template broadcast ke tim warehouse.',
          },
        ],
      },
    ],
  },
  {
    category: 'Operations',
    rows: [
      {
        id: 'op-1',
        activity: 'Proses provisioning / delivery service',
        gap: 'Handover antar tim masih manual; banyak rework.',
        action: 'Standarisasi SOP handover, gunakan template MoM, dan audit mingguan.',
        children: [
          {
            id: 'op-1-1',
            activity: 'Checklist kesiapan perangkat',
            gap: 'Belum ada checklist yang dipakai konsisten.',
            action: 'Buat checklist standar dan wajib diisi sebelum handover.',
          },
        ],
      },
    ],
  },
  {
    category: 'Outbound Logistics',
    rows: [
      {
        id: 'out-1',
        activity: 'Distribusi layanan ke site pelanggan',
        gap: 'Tracking progress ke pelanggan tidak real-time.',
        action: 'Share tracker status ke pelanggan, otomatisasi notifikasi milestone.',
      },
    ],
  },
  {
    category: 'Marketing & Sales',
    rows: [
      {
        id: 'ms-1',
        activity: 'Campaign / penawaran solusi',
        gap: 'Belum ada segmentasi prioritas; follow-up tidak terjadwal.',
        action: 'Segmentasi top account, set cadency contact, dan matangkan pitch deck.',
      },
    ],
  },
  {
    category: 'Service',
    rows: [
      {
        id: 'svc-1',
        activity: 'Incident & request handling',
        gap: 'Root cause tidak terdokumentasi; preventive plan belum jalan.',
        action: 'Catat RCA per incident, mapping quick wins preventif, monitor aging.',
      },
    ],
  },
  {
    category: 'Firm Infrastructure',
    rows: [
      {
        id: 'fi-1',
        activity: 'Governance & reporting',
        gap: 'Tidak ada dashboard terpadu untuk CSG.',
        action: 'Buat dashboard mingguan, tetapkan owner data, dan cadence review.',
      },
    ],
  },
  {
    category: 'Human Resources Management',
    rows: [
      {
        id: 'hr-1',
        activity: 'Capability & capacity CSG',
        gap: 'Belum ada kurikulum pelatihan spesifik segmen.',
        action: 'Susun kurikulum role-based, jadwalkan coaching bulanan.',
      },
    ],
  },
  {
    category: 'Technology Development',
    rows: [
      {
        id: 'tech-1',
        activity: 'Tools / integrasi sistem',
        gap: 'Data aktivitas tersebar; belum ada integrasi kalender dan CRM.',
        action: 'Integrasikan kalender, CRM, dan tiket; siapkan template ekspor.',
      },
    ],
  },
  {
    category: 'Procurement',
    rows: [
      {
        id: 'proc-1',
        activity: 'Pengadaan pendukung layanan',
        gap: 'Vendor list terbatas; waktu pengadaan panjang.',
        action: 'Perluas vendor list, set kontrak payung, definisikan SLA pengadaan.',
      },
    ],
  },
]

const VALUE_CHAIN_IMG = 'https://www.businessmodelanalyst.com/wp-content/uploads/2023/06/Porters-Value-Chain-in-the-Context-of-the-Industry-Value-Chain.jpg'

function Cell({ children }) {
  return (
    <td className="px-5 py-3 align-top text-[13px] text-neutral-700 whitespace-pre-wrap">
      {children || <span className="text-neutral-400">—</span>}
    </td>
  )
}

function EditableCell({ value, onChange, placeholder, isEditing }) {
  if (!isEditing) return <Cell>{value}</Cell>
  return (
    <td className="px-5 py-3 align-top text-[13px] text-neutral-700 whitespace-pre-wrap">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 transition"
        rows={3}
      />
    </td>
  )
}

export default function GuidancePrinciple({
  items = defaultGroups,
  title = 'Gap Analysis per Activity',
  showEdit = true,
  onEdit,
  variant = 'summary', // 'summary' (tab) | 'full' (old full) | 'table' (table only)
  progressCurrent = 9,
  progressTotal = 12,
  onUpdateClick,
  headingLabel = 'ICT Landscape',
}) {
  const [data, setData] = useState(items)
  const [isEditing, setIsEditing] = useState(false)
  const [openIds, setOpenIds] = useState(() => new Set())

  const stats = useMemo(() => {
    const categories = data.length
    let activities = 0
    let subActivities = 0
    data.forEach((g) => {
      const rows = g.rows || []
      activities += rows.length
      rows.forEach((r) => {
        subActivities += (r.children || []).length
      })
    })
    return { categories, activities, subActivities }
  }, [data])

  const handleEditToggle = () => {
    if (onEdit) return onEdit()
    setIsEditing((prev) => !prev)
  }

  const toggleRow = (rowId) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      next.has(rowId) ? next.delete(rowId) : next.add(rowId)
      return next
    })
  }

	const updateCell = (category, rowId, field, value) => {
		setData((prev) =>
			prev.map((group) =>
				group.category === category
					? {
						...group,
						rows: (group.rows || []).map((row) =>
							row.id === rowId
								? { ...row, [field]: value }
								: row
						),
					}
					: group
			)
		)
	}

	const addChild = (category, parentId) => {
		const newId = `${parentId}-child-${Date.now()}`
		setData((prev) =>
			prev.map((group) =>
				group.category === category
					? {
						...group,
						rows: (group.rows || []).map((row) =>
							row.id === parentId
								? {
									...row,
									children: [...(row.children || []), { id: newId, activity: '', gap: '', action: '' }],
								}
								: row
						),
					}
					: group
			)
		)
		setOpenIds((prev) => new Set(prev).add(parentId))
	}

  const addActivity = (category) => {
    const newId = `${category}-act-${Date.now()}`
    setData((prev) =>
      prev.map((group) =>
        group.category === category
          ? {
            ...group,
            rows: [...(group.rows || []), { id: newId, activity: '', gap: '', action: '', children: [] }],
          }
          : group
      )
    )
    setOpenIds((prev) => new Set(prev).add(newId))
  }

  const deleteRow = (category, rowId, parentId) => {
    setData((prev) =>
      prev.map((group) => {
        if (group.category !== category) return group
        if (parentId) {
          return {
            ...group,
            rows: (group.rows || []).map((row) =>
              row.id === parentId
                ? { ...row, children: (row.children || []).filter((child) => child.id !== rowId) }
                : row
            ),
          }
        }
        return {
          ...group,
          rows: (group.rows || []).filter((row) => row.id !== rowId),
        }
      })
    )
    setOpenIds((prev) => {
      const next = new Set(prev)
      next.delete(rowId)
      return next
    })
  }

  const renderRow = (group, row, idx, level = 0, parentId = null) => {
    const rowBg = idx % 2 === 0 && level === 0 ? 'bg-white' : 'bg-neutral-50/50'
    const hasChildren = (row.children || []).length > 0
    const isOpen = openIds.has(row.id)
    const isChild = level > 0

    return (
      <React.Fragment key={`${row.id}-${level}`}>
        <tr className={rowBg}>
          <td className={`px-5 py-3 text-[13px] text-neutral-800 align-top font-medium ${level ? 'pl-10' : ''}`}>
            <div className="flex items-start gap-2">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleRow(row.id)}
                  className="mt-0.5 text-neutral-500 hover:text-[#2C5CC5]"
                >
                  {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                </button>
              ) : (
                <span className="w-4" />
              )}
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    value={row.activity || ''}
                    onChange={(e) => updateCell(group.category, row.id, 'activity', e.target.value)}
                    placeholder="Isi activity di sini"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 transition"
                    rows={level ? 2 : 2}
                  />
                ) : (
                  row.activity || <span className="text-neutral-400">Isi activity di sini</span>
                )}
                {isEditing && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
                    {level === 0 && (
                      <button
                        type="button"
                        onClick={() => addChild(group.category, row.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1 hover:border-neutral-300 hover:text-[#2C5CC5]"
                      >
                        <FiPlus className="w-3 h-3" /> Sub-aktivitas
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteRow(group.category, row.id, parentId)}
                      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1 text-red-500 hover:border-red-200 hover:bg-red-50"
                    >
                      <FiTrash className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </td>
          <EditableCell
            value={row.gap}
            onChange={(val) => updateCell(group.category, row.id, 'gap', val)}
            placeholder="Issue atau peluang yang ditemukan"
            isEditing={isEditing}
          />
          <EditableCell
            value={row.action}
            onChange={(val) => updateCell(group.category, row.id, 'action', val)}
            placeholder="Kapabilitas bisnis/teknis atau rencana perbaikan"
            isEditing={isEditing}
          />
        </tr>
        {hasChildren && isOpen &&
          row.children.map((child, cIdx) => renderRow(group, child, cIdx, level + 1, row.id))}
      </React.Fragment>
    )
  }

	const isSummary = variant === 'summary'
  const isTableOnly = variant === 'table'
	return (
		<div className="space-y-6">
      {!isTableOnly && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] gap-4">
          <div className="space-y-3">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Porter's Value Chain Framework</p>
                  <p className="text-xs text-neutral-600">Referensi visual untuk 9 kategori aktivitas</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-3">
                <img
                  src={VALUE_CHAIN_IMG}
                  alt="Porter's Value Chain"
                  className="w-full h-auto rounded-lg object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 space-y-3 text-center">
              <div className="flex items-center justify-center">
                <RadialProgress current={progressCurrent} total={progressTotal} />
              </div>
              <div className="text-sm text-neutral-700">
                Profil/Guidance yang lengkap membantu AI memberi analisis yang lebih relevan.
              </div>
              {onUpdateClick && (
                <Button
                  onClick={onUpdateClick}
                  className="w-full sm:w-auto justify-center"
                  variant="primary"
                >
                  Update 7 Guidance
                </Button>
              )}
              {!isSummary && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                    <div className="text-[11px] text-neutral-500">Kategori</div>
                    <div className="text-xl font-semibold text-slate-900">{stats.categories}</div>
                  </div>
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                    <div className="text-[11px] text-neutral-500">Aktivitas</div>
                    <div className="text-xl font-semibold text-slate-900">{stats.activities}</div>
                  </div>
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                    <div className="text-[11px] text-neutral-500">Sub-aktivitas</div>
                    <div className="text-xl font-semibold text-slate-900">{stats.subActivities}</div>
                  </div>
                </div>
              )}
            </div>

            {!isSummary && (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-neutral-700">
                <p className="font-medium text-neutral-800 mb-1">Cara pakai singkat</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Isi kolom aktivitas (bebas) di masing-masing kategori.</li>
                  <li>Tambahkan sub-aktivitas untuk detail langkah atau owner spesifik.</li>
                  <li>Catat issue/opportunity dan kapabilitas atau rencana perbaikan.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!isSummary && (
			<div className="overflow-auto bg-white rounded-xl border border-neutral-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-slate-900">{headingLabel}</h3>
          {showEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 text-[#2C5CC5]"
            >
              <FiEdit2 className="w-4 h-4" /> {isEditing ? 'Selesai' : 'Edit'}
            </Button>
          )}
        </div>
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 bg-white border-b border-[#4169E1]">
            <tr>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-[24%]">Proses Bisnis & Aktivitas</th>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-[38%]">Issue / Opportunity</th>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-[38%]">Kapabilitas Bisnis/Teknis</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group) => (
              <React.Fragment key={group.category}>
                <tr className="bg-slate-50">
                  <td colSpan={3} className="px-5 py-3 text-sm font-semibold text-slate-800">
                {group.category}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => addActivity(group.category)}
                    className="ml-3 inline-flex items-center gap-1 text-xs text-[#2C5CC5] hover:underline"
                  >
                    <FiPlus className="w-3 h-3" /> Tambah aktivitas
                  </button>
                )}
                  </td>
                </tr>
                {(group.rows || []).map((row, idx) => renderRow(group, row, idx, 0))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      )}
		</div>
	)
}
