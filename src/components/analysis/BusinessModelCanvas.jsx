import React from 'react'
import {
  ViewOrEdit,
  DebouncedTextArea,
} from '../../pages/accountProfile/components/Inputs'

/**
 * Editable cell, mirip seperti di SwotAnalysis
 */
function EditableCell({ value, onChange, isEditing, placeholder }) {
  return (
    <div className="py-2">
      <ViewOrEdit
        editing={isEditing}
        view={
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700">
            {value || <span className="text-slate-400">Not set</span>}
          </div>
        }
      >
        <DebouncedTextArea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="w-full min-h-[90px]"
        />
      </ViewOrEdit>
    </div>
  )
}

/**
 * Definisi 9 blok Business Model Canvas
 * Key bisa kamu simpan di formData (misal di accountProfile reducer)
 */
const BMC_GROUPS = [
  {
    groupTitle: 'Pelanggan & Value',
    rows: [
      {
        key: 'bmcCustomerSegments',
        title: 'Customer Segments',
        hint: 'Segmen pelanggan utama, persona, prioritas, dan kebutuhan utama.',
      },
      {
        key: 'bmcValuePropositions',
        title: 'Value Propositions',
        hint: 'Value utama yang ditawarkan ke pelanggan (differentiator, pain relievers, gain creators).',
      },
      {
        key: 'bmcCustomerRelationships',
        title: 'Customer Relationships',
        hint: 'Jenis hubungan (dedicated AM, self-service, automated, komunitas, dsb.).',
      },
      {
        key: 'bmcChannels',
        title: 'Channels',
        hint: 'Channel utama untuk akuisisi, delivery, dan after-sales (online/offline).',
      },
    ],
  },
  {
    groupTitle: 'Operasi & Resource',
    rows: [
      {
        key: 'bmcKeyActivities',
        title: 'Key Activities',
        hint: 'Aktivitas inti untuk deliver value (implementasi, support, onboarding, dsb.).',
      },
      {
        key: 'bmcKeyResources',
        title: 'Key Resources',
        hint: 'Resource utama (tim, aset, platform, IP, data, mitra kunci).',
      },
      {
        key: 'bmcKeyPartners',
        title: 'Key Partners',
        hint: 'Partner kunci (vendor, integrator, distributor, regulator, dsb.).',
      },
    ],
  },
  {
    groupTitle: 'Finansial',
    rows: [
      {
        key: 'bmcRevenueStreams',
        title: 'Revenue Streams',
        hint: 'Cara menghasilkan pendapatan (recurring, one-off, usage-based, dll.).',
      },
      {
        key: 'bmcCostStructure',
        title: 'Cost Structure',
        hint: 'Komponen biaya utama (opex, capex, lisensi, komisi, dsb.).',
      },
    ],
  },
]

export default function BusinessModelCanvas({ formData, setField, isEditing }) {
  const handleChange = (key, v) => {
    setField(key, v)
  }

  return (
    <div className="w-full space-y-4 p-2 max-w-7xl mx-auto">
      {/* Judul */}
      <h2 className="text-base font-medium text-[#4169E1] tracking-wider mb-3 px-1">
        Business Model Canvas
      </h2>

      {/* Table-style wrapper biar konsisten dengan SwotAnalysis/Table */}
      <div className="overflow-auto max-h-[70vh] bg-white rounded-xl border border-neutral-200">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 bg-white border-b border-[#4169E1]">
            <tr>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-1/3">
                Block
              </th>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-2/3">
                Deskripsi & Catatan
              </th>
            </tr>
          </thead>
          <tbody>
            {BMC_GROUPS.map((group, groupIdx) => (
              <React.Fragment key={group.groupTitle}>
                {/* Group row */}
                <tr className="bg-slate-50">
                  <td
                    colSpan={2}
                    className="px-5 py-3 text-sm font-semibold text-slate-800"
                  >
                    {group.groupTitle}
                  </td>
                </tr>

                {/* Rows per block */}
                {group.rows.map((row, idx) => {
                  const bgClass =
                    (groupIdx + idx) % 2 === 0
                      ? 'bg-white'
                      : 'bg-neutral-50/60'

                  return (
                    <tr key={row.key} className={bgClass}>
                      {/* Block title */}
                      <td className="px-5 py-3 text-[13px] text-neutral-700 align-top w-1/3">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900">
                            {row.title}
                          </div>
                          {row.hint && (
                            <p className="text-[11px] text-neutral-500 leading-snug">
                              {row.hint}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Editable description */}
                      <td className="px-5 py-3 text-[13px] text-neutral-700 align-top w-2/3">
                        <EditableCell
                          value={formData[row.key]}
                          onChange={(v) => handleChange(row.key, v)}
                          isEditing={isEditing}
                          placeholder={`Tuliskan detail untuk "${row.title}" di sini…`}
                        />
                      </td>
                    </tr>
                  )
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
