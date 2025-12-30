import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FaChartLine,
  FaUserTie,
  FaTasks,
  FaSyncAlt,
  FaChartBar,
  FaArrowLeft
} from 'react-icons/fa'

import PageHeader from '@components/ui/PageHeader'
import Card from '@components/ui/Card'
import StatsCard from '@components/ui/StatsCard'
import Select from '@components/ui/Select'
import SearchInput from '@components/ui/SearchInput'
import { Badge } from '@components/ui/Badge'
import Button from '@components/ui/Button'
import AMActivityModal from '@components/activities/AMActivityModal'
import mockAMs from '@/data/mockAMs'

/** ----------------------------------------------
 * Helper data:
 * Map regional manager names here.
 * Fallback -> "Manager wilayah belum ditetapkan"
 * ---------------------------------------------- */
const REGIONAL_MANAGERS = {
  // Example mappings — adjust to match your regions
  'Jabodetabek': 'Raka Pratama',
  'Jawa Barat': 'Budi Santoso',
  'Jawa Tengah': 'Siti Rahmawati',
  'Jawa Timur': 'Dewi Anggraini',
  'Sumatera Utara': 'Andi Saputra',
  'Bali & Nusa Tenggara': 'Kadek Wijaya',
}

/** Build a dataset similar to ManagerPerformanceDashboard,
 * but focused on the selected region. */
const buildPerformanceDataset = () =>
  mockAMs.map((am, idx) => {
    const profileCompletion = 55 + ((idx * 11) % 46)
    const monthlyActivities = 12 + ((idx * 3) % 18)
    const dataFreshnessDays = 1 + ((idx * 2) % 14)
    const freshnessFrequency = Math.max(1, Math.round(30 / Math.max(1, dataFreshnessDays)))
    const accountCoverage = 6 + ((idx * 5) % 20)
    const weeklyActivities = Math.round(monthlyActivities / 4)
    const lastUpdated = dataFreshnessDays <= 2 ? '≤ 48 jam' : `${dataFreshnessDays} hari lalu`
    return {
      id: am.id_sales,
      nama_am: am.nama_am,
      region: am.region,
      witel: am.witel,
      profileCompletion,
      monthlyActivities,
      weeklyActivities,
      dataFreshnessDays,
      freshnessFrequency,
      accountCoverage,
      lastUpdated,
    }
  })

const DATASET = buildPerformanceDataset()

const getCompletionVariant = (value) => {
  if (value >= 90) return 'success'
  if (value >= 80) return 'info'
  if (value >= 70) return 'warning'
  return 'danger'
}

const getFreshnessVariant = (days) => {
  if (days <= 2) return 'success'
  if (days <= 5) return 'info'
  if (days <= 8) return 'warning'
  return 'danger'
}

const TABS = [
  { key: 'summary', label: 'Ringkasan' },
  { key: 'profile', label: 'Account Profile' },
  { key: 'activity', label: 'Aktivitas' },
  { key: 'freshness', label: 'Kesegaran Data' },
]

export default function ExecutiveRegionPerformance() {
  const navigate = useNavigate()
  const location = useLocation()

  // read ?region=... from URL
  const [region, setRegion] = useState('Semua Region')
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const r = params.get('region') || 'Semua Region'
    setRegion(r)
  }, [location.search])

  // local states
  const [search, setSearch] = useState('')
  const [selectedAM, setSelectedAM] = useState(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')

  // region manager
  const regionalManager = REGIONAL_MANAGERS[region] || 'Manager wilayah belum ditetapkan'

  // filter to selected region
  const filteredData = useMemo(() => {
    let list = DATASET
    if (region && region !== 'Semua Region') list = list.filter((am) => am.region === region)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((am) => am.nama_am.toLowerCase().includes(q) || am.witel.toLowerCase().includes(q))
    }
    return list
  }, [region, search])

  // regional summary
  const summary = useMemo(() => {
    const total = filteredData.length || 1
    const avgCompletion = filteredData.reduce((sum, am) => sum + am.profileCompletion, 0) / total
    const avgActivities = filteredData.reduce((sum, am) => sum + am.monthlyActivities, 0) / total
    const avgFreshness = filteredData.reduce((sum, am) => sum + am.dataFreshnessDays, 0) / total
    const totalCoverage = filteredData.reduce((sum, am) => sum + am.accountCoverage, 0)
    return {
      avgCompletion: Math.round(avgCompletion),
      avgActivities: Math.round(avgActivities),
      avgFreshness: parseFloat(avgFreshness.toFixed(1)),
      totalCoverage,
      totalAM: filteredData.length,
    }
  }, [filteredData])

  const freshnessAlerts = filteredData.filter((am) => am.dataFreshnessDays > 7)
  const highCompletionCount = filteredData.filter((am) => am.profileCompletion >= 85).length
  const highActivityCount = filteredData.filter((am) => am.monthlyActivities >= 20).length
  const totalVisibleAM = Math.max(filteredData.length, 1)

  const profileRanked = useMemo(
    () => [...filteredData].sort((a, b) => b.profileCompletion - a.profileCompletion),
    [filteredData]
  )
  const activityRanked = useMemo(
    () => [...filteredData].sort((a, b) => b.monthlyActivities - a.monthlyActivities),
    [filteredData]
  )
  const freshnessRanked = useMemo(
    () => [...filteredData].sort((a, b) => a.dataFreshnessDays - b.dataFreshnessDays),
    [filteredData]
  )

  const openActivities = (am) => {
    setSelectedAM(am)
    setShowActivityModal(true)
  }
  const closeActivities = () => {
    setSelectedAM(null)
    setShowActivityModal(false)
  }

  const goBack = () => navigate('/executive') // adjust if your ExecutivePerformanceDashboard route differs

  // === Layout (keeps the Manager feel, with executive tweaks) ===
  return (
    <div className="space-y-6 pb-14 animate-fade-in">
      <PageHeader
        title={`Executive Regional View — ${region}`}
        subtitle="Ikhtisar performa AM pada tingkat regional, dilengkapi penanggung jawab wilayah."
        icon={FaChartLine}
      />

      {/* Executive tweak: show regional manager prominently */}
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-neutral-900">Penanggung Jawab Wilayah</p>
          <div className="flex items-center gap-2">
            <FaUserTie className="text-neutral-500" />
            <p className="text-neutral-800">{regionalManager}</p>
          </div>
          <p className="text-xs text-neutral-500">
            Menampilkan {summary.totalAM} AM di region {region}.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari nama AM / witel" variant="subtle" />
          <Button variant="ghost" onClick={goBack} className="flex items-center gap-2">
            <FaArrowLeft /> Kembali ke Executive Overview
          </Button>
        </div>
      </Card>

      {/* Regional KPIs (relabels to make sense for an executive view) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatsCard label="AM di Region" value={`${summary.totalAM}`} icon={FaUserTie} />
        <StatsCard label="Aktivitas/Bulan (Rata-rata)" value={`${summary.avgActivities}`} icon={FaTasks} />
        <StatsCard label="Avg Profile Completion" value={`${summary.avgCompletion}%`} icon={FaChartBar} />
        <StatsCard label="Avg Data Freshness" value={`${summary.avgFreshness} hari`} icon={FaSyncAlt} />
      </div>

      {/* Tabs & tables (kept familiar to Manager view) */}
      <Card className="p-0 overflow-hidden">
        <div className="flex border-b border-neutral-200 px-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#2C5CC5] text-[#2C5CC5]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-neutral-50">
          {/* Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <Card className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-neutral-900">Ringkasan kesehatan region</p>
                    <p className="text-sm text-neutral-500">Agregat kelengkapan profil, aktivitas, dan kesegaran data.</p>
                  </div>
                  <Badge variant={freshnessAlerts.length ? 'danger' : 'success'}>
                    {freshnessAlerts.length ? `${freshnessAlerts.length} AM perlu pembaruan data` : 'Semua data relatif segar'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">AM dengan profil ≥ 85%</p>
                    <p className="text-xl font-semibold text-neutral-900">
                      {highCompletionCount} / {summary.totalAM}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">AM aktif ≥ 20 aktivitas/bulan</p>
                    <p className="text-xl font-semibold text-neutral-900">{highActivityCount} AM</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Data stagnan &gt; 7 hari</p>
                    <p className="text-xl font-semibold text-neutral-900">{freshnessAlerts.length} AM</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              {profileRanked.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                  Tidak ada data untuk tab ini.
                </div>
              ) : (
                profileRanked.map((am) => (
                  <div
                    key={am.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{am.nama_am}</p>
                      <p className="text-xs text-neutral-500">
                        {am.region} · {am.witel}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-500 mb-1">Kelengkapan profil</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-[#2C5CC5] to-[#6D28D9]"
                            style={{ width: `${am.profileCompletion}%` }}
                          />
                        </div>
                        <Badge variant={getCompletionVariant(am.profileCompletion)}>{am.profileCompletion}%</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end md:w-52">
                      <Button size="sm" variant="secondary" onClick={() => openActivities(am)}>
                        Aktivitas
                      </Button>
                      <Button size="sm" variant="ghost">
                        Profil
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activityRanked.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                  Tidak ada data untuk tab ini.
                </div>
              ) : (
                activityRanked.map((am) => (
                  <div
                    key={am.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{am.nama_am}</p>
                      <p className="text-xs text-neutral-500">
                        {am.region} · {am.witel}
                      </p>
                    </div>
                    <div className="flex flex-col text-sm text-neutral-700">
                      <p className="font-semibold">{am.monthlyActivities} aktivitas / bulan</p>
                      <p className="text-xs text-neutral-500">~ {am.weeklyActivities} per minggu</p>
                    </div>
                    <div className="flex gap-2 justify-end md:w-52">
                      <Button size="sm" variant="secondary" onClick={() => openActivities(am)}>
                        Detail Aktivitas
                      </Button>
                      <Button size="sm" variant="ghost">
                        Profil
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Freshness */}
          {activeTab === 'freshness' && (
            <div className="space-y-3">
              {freshnessRanked.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                  Tidak ada data untuk tab ini.
                </div>
              ) : (
                freshnessRanked.map((am) => (
                  <div
                    key={am.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{am.nama_am}</p>
                      <p className="text-xs text-neutral-500">
                        {am.region} · {am.witel}
                      </p>
                    </div>
                    <div className="flex flex-col text-sm">
                      <p className="text-xs text-neutral-500">Kesegaran data</p>
                      <Badge variant={getFreshnessVariant(am.dataFreshnessDays)}>{am.lastUpdated}</Badge>
                      <p className="text-[11px] text-neutral-500 mt-1">freq {am.freshnessFrequency}x/bln</p>
                    </div>
                    {am.dataFreshnessDays > 7 && (
                      <Badge variant="danger" className="w-fit">
                        Perlu update
                      </Badge>
                    )}
                    <div className="flex gap-2 justify-end md:w-52">
                      <Button size="sm" variant="secondary" onClick={() => openActivities(am)}>
                        Update melalui Aktivitas
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Modal activity */}
      <AMActivityModal am={selectedAM} open={showActivityModal} onClose={closeActivities} />
    </div>
  )
}
