// src/components/customers/CustomerInfoCard.jsx
import React from 'react'
import Card from '../ui/Card'

function Row({ label, value }) {
  return (
    <div className="py-3">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-sm md:text-base font-semibold text-neutral-900 mt-0.5 whitespace-pre-wrap break-words">
        {value || '-'}
      </div>
    </div>
  )
}

export default function CustomerInfoCard({ details }) {
  const d = details || {}

  return (
    <Card className="p-5 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {/* Kolom 1 */}
        <div>
          <Row label="Nomor Pelanggan" value={d.customerNumber} />
          <Row label="Industri" value={d.industry} />
          <Row label="Sub-industri" value={d.subIndustry} />
        </div>

        {/* Kolom 2 */}
        <div>
          <Row label="Wilayah" value={d.region} />
          <Row label="Alamat Kantor Pusat" value={d.headOfficeAddress} />
        </div>

        {/* Kolom 3 */}
        <div>
          <Row label="Nomor Telepon Utama" value={d.mainPhone} />
          <Row label="Website" value={d.website} />
        </div>
      </div>
    </Card>
  )
}
