import React from 'react';
import Modal from '@components/ui/Modal';
import Table from '@components/ui/Table';
import { Badge } from '@components/ui/Badge';
import { format } from 'date-fns';

// Static mock activities (optional, may be overridden by fallback generator)
const mockActivities = [
  { id: 1, am_id: 1, customer: 'PT. Jaya Abadi', type: 'Visit', date: '2025-10-28', status: 'Completed' },
  { id: 2, am_id: 1, customer: 'CV. Maju Mundur', type: 'Call', date: '2025-10-25', status: 'Completed' },
  { id: 3, am_id: 2, customer: 'Stark Industries', type: 'Visit', date: '2025-10-22', status: 'Completed' },
  { id: 4, am_id: 1, customer: 'Wayne Enterprises', type: 'Meeting', date: '2025-11-05', status: 'Planned' },
  { id: 5, am_id: 3, customer: 'Cyberdyne Systems', type: 'Visit', date: '2025-11-02', status: 'Completed' },
  { id: 6, am_id: 4, customer: 'Ollivanders Wand Shop', type: 'Call', date: '2025-11-10', status: 'Planned' },
];

const statusVariant = {
  Completed: 'success',
  Planned: 'info',
  Cancelled: 'danger',
};

function generateFallbackActivities(am) {
  // Create deterministic pseudo-random set based on string hash
  const seed = (am?.id || am?.id_sales || 1).toString().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseDate = new Date();
  const items = [
    { type: 'Visit', daysAgo: (seed % 6) + 1, status: 'Completed' },
    { type: 'Call', daysAgo: (seed % 10) + 2, status: (seed % 3 === 0 ? 'Planned' : 'Completed') },
    { type: 'Meeting', daysAgo: (seed % 14) + 3, status: (seed % 5 === 0 ? 'Planned' : 'Completed') },
  ];
  return items.map((it, idx) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - it.daysAgo);
    return {
      id: 1000 + idx,
      am_id: am?.id ?? 0,
      customer: `Customer ${idx + 1}`,
      type: it.type,
      date: d.toISOString().slice(0, 10),
      status: it.status,
    };
  });
}

export default function AMActivityModal({ am, open, onClose }) {
  if (!open) return null;
  const columns = [
    { key: 'customer', label: 'Pelanggan' },
    { key: 'type', label: 'Tipe' },
    { key: 'date', label: 'Tanggal' },
    { key: 'status', label: 'Status' },
  ];

  const activitiesByStatic = am?.id != null ? mockActivities.filter(act => act.am_id === am.id) : [];
  const data = activitiesByStatic.length > 0 ? activitiesByStatic : generateFallbackActivities(am || {});

  return (
    <Modal open={open} onClose={onClose} title={`Aktivitas untuk ${am?.nama_am || am?.name || 'AM'}`}>
      {data && data.length > 0 ? (
        <Table
          columns={columns}
          data={data}
          dense
          renderCell={(row, key) => {
            if (key === 'date') {
              return format(new Date(row.date), 'dd MMM yyyy');
            }
            if (key === 'status') {
              return <Badge variant={statusVariant[row.status] || 'neutral'}>{row.status}</Badge>;
            }
            return row[key];
          }}
        />
      ) : (
        <p className="text-neutral-500 text-center py-8">Tidak ada aktivitas yang tercatat untuk AM ini.</p>
      )}
    </Modal>
  );
}
