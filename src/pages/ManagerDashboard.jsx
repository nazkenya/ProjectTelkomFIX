import React, { useState, useMemo } from 'react';
import Card from '@components/ui/Card';
import Table from '@components/ui/Table';
import { ProgressBar } from '@components/ui/Progress';
import mockAMs from '@/data/mockAMs';
import Button from '@components/ui/Button';
import Select from '@components/ui/Select';
import StatsCard from '@components/ui/StatsCard';
import { Users, CheckCircle, Activity } from 'lucide-react';
import AMActivityModal from '@components/activities/AMActivityModal';

// Mock data generation for metrics
const generateMetrics = (am) => {
  const profileCompletion = Math.floor(Math.random() * 71) + 30; // 30% to 100%
  const visitsThisMonth = Math.floor(Math.random() * 15);
  const lastUpdateDays = Math.floor(Math.random() * 30); // 0 to 29 days ago
  
  let lastUpdateLabel = 'Today';
  if (lastUpdateDays > 0) {
    lastUpdateLabel = `${lastUpdateDays} day${lastUpdateDays > 1 ? 's' : ''} ago`;
  }

  return {
    ...am,
    profileCompletion,
    visitsThisMonth,
    lastUpdate: lastUpdateLabel,
  };
};

export default function ManagerDashboard() {
  const regions = useMemo(() => Array.from(new Set(mockAMs.map(am => am.region))), []);
  const defaultRegion = regions[0] || '';

  const [region, setRegion] = useState(defaultRegion);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAm, setSelectedAm] = useState(null);

  const handleOpenModal = (am) => {
    setSelectedAm(am);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAm(null);
  };

  const amStats = useMemo(() => {
    const filteredAMs = region ? mockAMs.filter(am => am.region === region) : mockAMs;
    return filteredAMs.map(generateMetrics);
  }, [region]);

  const teamSummary = useMemo(() => {
    if (amStats.length === 0) {
      return {
        totalAMs: 0,
        avgProfileCompletion: 0,
        totalVisits: 0,
      };
    }
    const totalAMs = amStats.length;
    const totalProfileCompletion = amStats.reduce((sum, am) => sum + am.profileCompletion, 0);
    const avgProfileCompletion = Math.round(totalProfileCompletion / totalAMs);
    const totalVisits = amStats.reduce((sum, am) => sum + am.visitsThisMonth, 0);
    
    return {
      totalAMs,
      avgProfileCompletion,
      totalVisits,
    };
  }, [amStats]);

  const columns = [
    { key: 'nama_am', label: 'Account Manager', sortable: true },
    { key: 'witel', label: 'Witel', sortable: true },
    { key: 'profileCompletion', label: 'Kelengkapan Profil' },
    { key: 'visitsThisMonth', label: 'Kunjungan (Bulan Ini)' },
    { key: 'lastUpdate', label: 'Pembaruan Terakhir' },
    { key: 'actions', label: 'Aksi' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard Kinerja AM</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-700">Region:</label>
            <Select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Semua Region</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Users}
            label="Total AM Ditangani"
            value={teamSummary.totalAMs}
          />
          <StatsCard
            icon={CheckCircle}
            label="Rata-rata Kelengkapan Profil"
            value={`${teamSummary.avgProfileCompletion}%`}
          />
          <StatsCard
            icon={Activity}
            label="Total Kunjungan Bulan Ini"
            value={teamSummary.totalVisits}
          />
        </div>

        <Card className="p-0 overflow-hidden ring-1 ring-neutral-200">
          <Table
            columns={columns}
            data={amStats}
            dense
            renderCell={(row, key) => {
              if (key === 'profileCompletion') {
                return (
                  <div className="min-w-[160px]">
                    <div className="text-xs text-neutral-600 mb-1">{row.profileCompletion}%</div>
                    <ProgressBar value={row.profileCompletion} size="sm" />
                  </div>
                );
              }
              if (key === 'actions') {
                return (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary">Lihat Profil</Button>
                    <Button size="sm" onClick={() => handleOpenModal(row)}>Detail Aktivitas</Button>
                  </div>
                );
              }
              return row[key];
            }}
            emptyMessage="Tidak ada data AM untuk region yang dipilih."
          />
        </Card>
      </div>
      <AMActivityModal am={selectedAm} open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}