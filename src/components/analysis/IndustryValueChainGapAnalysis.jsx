import React from 'react'
import {
  ViewOrEdit,
  DebouncedTextArea,
} from '../../pages/accountProfile/components/Inputs'

// Aktivitas sama seperti IndustryValueChainAnalysis
const VALUE_CHAIN_ACTIVITIES = [
  {
    category: 'Support Activities',
    key: 'firmInfrastructure',
    label: 'Firm Infrastructure',
  },
  {
    category: 'Support Activities',
    key: 'humanResources',
    label: 'Human Resources Management',
  },
  {
    category: 'Support Activities',
    key: 'technologyDevelopment',
    label: 'Technology Development',
  },
  {
    category: 'Support Activities',
    key: 'procurement',
    label: 'Procurement',
  },
  {
    category: 'Primary Activities',
    key: 'inboundLogistics',
    label: 'Inbound Logistics',
  },
  {
    category: 'Primary Activities',
    key: 'operations',
    label: 'Operations',
  },
  {
    category: 'Primary Activities',
    key: 'outboundLogistics',
    label: 'Outbound Logistics',
  },
  {
    category: 'Primary Activities',
    key: 'marketingSales',
    label: 'Marketing & Sales',
  },
  {
    category: 'Primary Activities',
    key: 'service',
    label: 'Service',
  },
  {
    category: 'Primary Activities',
    key: 'margin',
    label: 'Margin',
  },
]

// Turunan field untuk gap & rencana per activity
const VALUE_CHAIN_GAP_ITEMS = VALUE_CHAIN_ACTIVITIES.map((a) => ({
  ...a,
  gapKey: `${a.key}Gap`,           // contoh: firmInfrastructureGap
  actionKey: `${a.key}Improvement` // contoh: firmInfrastructureImprovement
}))

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
          className="w-full min-h-[80px]"
        />
      </ViewOrEdit>
    </div>
  )
}

export default function IndustryValueChainGapAnalysis({
  formData,
  setField,
  isEditing,
}) {
  const handleChange = (key, v) => setField(key, v)

  const supportItems = VALUE_CHAIN_GAP_ITEMS.filter(
    (a) => a.category === 'Support Activities'
  )
  const primaryItems = VALUE_CHAIN_GAP_ITEMS.filter(
    (a) => a.category === 'Primary Activities'
  )

  return (
    <div className="w-full space-y-6 p-2 max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-base font-medium text-[#4169E1] tracking-wider mb-3 px-1">
        Gap Analysis – Industry Value Chain
      </h2>

      {/* Info card singkat */}
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-700">
        <p className="font-medium text-neutral-800 mb-1">
          Tujuan:
        </p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>
            Mengidentifikasi area <span className="font-semibold">yang belum dimiliki</span> atau masih lemah
            pada tiap aktivitas value chain.
          </li>
          <li>
            Menyusun <span className="font-semibold">rencana perbaikan & prioritas</span> untuk menutup gap tersebut.
          </li>
        </ul>
      </div>

      {/* Tabel Gap Analysis */}
      <div className="overflow-auto max-h-[70vh] bg-white rounded-xl border border-neutral-200">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 bg-white border-b border-[#4169E1]">
            <tr>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-[24%]">
                Activity
              </th>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-[38%]">
                Gap / Kelemahan
              </th>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-[38%]">
                Rencana Perbaikan & Prioritas
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Support Activities */}
            <tr className="bg-slate-50">
              <td
                colSpan={3}
                className="px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Support Activities
              </td>
            </tr>
            {supportItems.map((activity, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
              return (
                <tr key={activity.key} className={rowBg}>
                  <td className="px-5 py-3 text-[13px] text-neutral-700 align-top font-medium">
                    {activity.label}
                  </td>
                  <td className="px-5 py-3 align-top text-[13px] text-neutral-700">
                    <EditableCell
                      value={formData[activity.gapKey]}
                      onChange={(v) => handleChange(activity.gapKey, v)}
                      isEditing={isEditing}
                      placeholder={`Apa yang belum dimiliki / masih lemah pada ${activity.label.toLowerCase()}?`}
                    />
                  </td>
                  <td className="px-5 py-3 align-top text-[13px] text-neutral-700">
                    <EditableCell
                      value={formData[activity.actionKey]}
                      onChange={(v) => handleChange(activity.actionKey, v)}
                      isEditing={isEditing}
                      placeholder={`Rencana perbaikan, owner, dan prioritas untuk ${activity.label.toLowerCase()}…`}
                    />
                  </td>
                </tr>
              )
            })}

            {/* Primary Activities */}
            <tr className="bg-slate-50">
              <td
                colSpan={3}
                className="px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Primary Activities
              </td>
            </tr>
            {primaryItems.map((activity, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
              return (
                <tr key={activity.key} className={rowBg}>
                  <td className="px-5 py-3 text-[13px] text-neutral-700 align-top font-medium">
                    {activity.label}
                  </td>
                  <td className="px-5 py-3 align-top text-[13px] text-neutral-700">
                    <EditableCell
                      value={formData[activity.gapKey]}
                      onChange={(v) => handleChange(activity.gapKey, v)}
                      isEditing={isEditing}
                      placeholder={`Apa yang belum dimiliki / masih lemah pada ${activity.label.toLowerCase()}?`}
                    />
                  </td>
                  <td className="px-5 py-3 align-top text-[13px] text-neutral-700">
                    <EditableCell
                      value={formData[activity.actionKey]}
                      onChange={(v) => handleChange(activity.actionKey, v)}
                      isEditing={isEditing}
                      placeholder={`Rencana perbaikan, quick wins, dan langkah next untuk ${activity.label.toLowerCase()}…`}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
