// src/components/accountProfile/EndCustomerProfile.jsx
import React from 'react'
import { ViewOrEdit, DebouncedTextArea } from '../../pages/accountProfile/components/Inputs'

/* -------------------------------------------------------
 * Konfigurasi baris: mapping label ↔ field di formData
 * ----------------------------------------------------- */
const END_CUSTOMER_ROWS = [
  {
    field: 'endCustomerSegment',
    label: 'Segmen Pelanggan Utama',
    placeholder: 'Contoh: Retail B2C (70%), SME (20%), Enterprise (10%)',
  },
  {
    field: 'endCustomerLocationCoverage',
    label: 'Lokasi & Cakupan',
    placeholder: 'Contoh: Jabodetabek, Jatim, Bali',
  },
  {
    field: 'endCustomerNeeds',
    label: 'Kebutuhan Pelanggan Akhir',
    placeholder: 'Contoh: Koneksi stabil, security, aplikasi omnichannel',
  },
  {
    field: 'endCustomerPainPoints',
    label: 'Pain Points',
    placeholder: 'Contoh: Sistem sering down, tidak realtime, support lama',
  },
  {
    field: 'endCustomerJourney',
    label: 'Customer Journey',
    placeholder: 'Contoh: Aplikasi mobile → Website → CS',
  },
  {
    field: 'endCustomerSatisfaction',
    label: 'Kepuasan Pelanggan',
    placeholder: 'Contoh: Medium, churn 8% YoY',
  },
]

/* -------------------------------------------------------
 * Reusable Editable Cell (mirip SWOT)
 * ----------------------------------------------------- */
function EditableTableCell({ value, onChange, isEditing, placeholder }) {
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

/* -------------------------------------------------------
 * Main Layout: End-Customer Profile
 * ----------------------------------------------------- */
export default function EndCustomerProfile({ formData, setField, isEditing }) {
  const handleChange = (field, v) => setField(field, v)

  return (
    <div className="w-full space-y-4 p-2 max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-base font-medium text-[#4169E1] tracking-wider mb-3 px-1">
        End-Customer Profile
      </h2>

      {/* Table wrapper – sama gaya dengan komponen lain */}
      <div className="overflow-auto max-h-[70vh] bg-white rounded-xl border border-neutral-200">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 bg-white border-b border-[#4169E1]">
            <tr>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-1/3">
                Item
              </th>
              <th className="px-5 py-3.5 text-xs font-medium text-[#4169E1] tracking-wider w-2/3">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {END_CUSTOMER_ROWS.map((row, idx) => (
              <tr
                key={row.field}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}
              >
                {/* Kolom Item */}
                <td className="px-5 py-3 text-[13px] text-neutral-700 align-top w-1/3">
                  <span className="font-medium text-slate-900">
                    {row.label}
                  </span>
                </td>

                {/* Kolom Detail (editable) */}
                <td className="px-5 py-3 text-[13px] text-neutral-700 align-top w-2/3">
                  <EditableTableCell
                    value={formData[row.field]}
                    onChange={(v) => handleChange(row.field, v)}
                    isEditing={isEditing}
                    placeholder={row.placeholder}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
