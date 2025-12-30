import React, { useMemo, useState } from 'react'
import {
  FaChartBar,
  FaChartLine,
  FaClock,
  FaExclamationTriangle,
  FaTasks,
  FaSyncAlt,
  FaUserTie,
} from 'react-icons/fa'
import PageHeader from '@components/ui/PageHeader'
import Card from '@components/ui/Card'
import StatsCard from '@components/ui/StatsCard'
import Select from '@components/ui/Select'
import SearchInput from '@components/ui/SearchInput'
import { Badge } from '@components/ui/Badge'
import { ProgressBar } from '@components/ui/Progress'
import Button from '@components/ui/Button'
import AMActivityModal from '@components/activities/AMActivityModal'
import mockAMs from '@/data/mockAMs'

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

const performanceDataset = buildPerformanceDataset()
const uniqueRegions = ['Semua Region', ...Array.from(new Set(mockAMs.map((am) => am.region)))]

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

export default function ManagerPerformanceDashboard() {
  const [regionFilter, setRegionFilter] = useState('Semua Region')
  const [search, setSearch] = useState('')
  const [selectedAM, setSelectedAM] = useState(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')

  const filteredData = useMemo(() => {
    let data = performanceDataset
    if (regionFilter !== 'Semua Region') data = data.filter((am) => am.region === regionFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter((am) => am.nama_am.toLowerCase().includes(q) || am.witel.toLowerCase().includes(q))
    }
    return data
  }, [regionFilter, search])

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
  const topPerformers = profileRanked.slice(0, 3)

  const handleOpenActivities = (am) => {
    setSelectedAM(am)
    setShowActivityModal(true)
  }
  const closeActivities = () => {
    setSelectedAM(null)
    setShowActivityModal(false)
  }

  const renderSummaryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatsCard label="Rata-rata Kelengkapan Profil" value={`${summary.avgCompletion}%`} icon={FaUserTie} />
        <StatsCard label="Aktivitas/Bulan per AM" value={`${summary.avgActivities}`} icon={FaTasks} />
        <StatsCard label="Rata-rata Kesegaran Data" value={`${summary.avgFreshness} hari`} icon={FaSyncAlt} />
        <StatsCard label="Akumulasi Coverage" value={`${summary.totalCoverage} akun`} icon={FaChartBar} />
      </div>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-neutral-900">Ringkasan kesehatan tim</p>
            <p className="text-sm text-neutral-500">Indikator agregat kelengkapan profil, aktivitas dan kesegaran data.</p>
          </div>
          <Badge variant={freshnessAlerts.length ? 'danger' : 'success'}>
            {freshnessAlerts.length ? `${freshnessAlerts.length} AM perlu pembaruan data` : 'Semua data relatif segar'}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">AM dengan profil ≥ 85%</p>
            <p className="text-xl font-semibold text-neutral-900">
              {highCompletionCount} / {filteredData.length}
            </p>
            <ProgressBar value={(highCompletionCount / totalVisibleAM) * 100} size="sm" />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">AM aktif ≥ 20 aktivitas</p>
            <p className="text-xl font-semibold text-neutral-900">{highActivityCount} AM</p>
            <ProgressBar value={(highActivityCount / totalVisibleAM) * 100} size="sm" />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Data stagnan &gt; 7 hari</p>
            <p className="text-xl font-semibold text-neutral-900">{freshnessAlerts.length} AM</p>
            <ProgressBar value={(freshnessAlerts.length / totalVisibleAM) * 100} size="sm" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="space-y-4 lg:col-span-2">
          <p className="text-lg font-semibold text-neutral-900">Top performer minggu ini</p>
          <div className="space-y-3">
            {topPerformers.map((am, idx) => (
              <div
                key={am.id}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-neutral-900">
                    #{idx + 1} {am.nama_am}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {am.region} · {am.witel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-neutral-500">Profil lengkap</p>
                  <p className="text-lg font-semibold text-neutral-900">{am.profileCompletion}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-500" />
            <p className="text-lg font-semibold text-neutral-900">Alert kesegaran data</p>
          </div>
          {freshnessAlerts.length === 0 ? (
            <p className="text-sm text-neutral-500">Tidak ada AM dengan data yang kedaluwarsa.</p>
          ) : (
            <div className="space-y-3 text-sm">
              {freshnessAlerts.map((am) => (
                <div key={am.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="font-semibold text-amber-800">{am.nama_am}</p>
                  <p className="text-xs text-amber-700">Data terakhir diperbarui {am.dataFreshnessDays} hari lalu</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <FaClock className="text-neutral-500" />
          <p className="text-lg font-semibold text-neutral-900">Insight Manajemen</p>
        </div>
        <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
          <li>Coaching prioritas: {freshnessAlerts.length} AM dengan data stagnan &gt; 7 hari.</li>
          <li>
            Fokus region:{' '}
            {filteredData.length
              ? filteredData.reduce((acc, am) => acc + am.profileCompletion, 0) / filteredData.length < 85
                ? regionFilter
                : 'Cari region lain dengan completion rendah'
              : 'Tidak ada data'}
          </li>
          <li>Target aktivitas mingguan: ≥ 5 aktivitas untuk menjaga pipeline.</li>
        </ul>
      </Card>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Rata-rata completion</p>
          <p className="text-2xl font-semibold text-neutral-900">{summary.avgCompletion}%</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Profil ≥ 90%</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {filteredData.filter((am) => am.profileCompletion >= 90).length} AM
          </p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Profil &lt; 70%</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {filteredData.filter((am) => am.profileCompletion < 70).length} AM
          </p>
        </Card>
      </div>

      {profileRanked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
          Tidak ada data untuk tab ini.
        </div>
      ) : (
        <div className="space-y-3">
          {profileRanked.map((am) => (
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
                <Button size="sm" variant="secondary" onClick={() => handleOpenActivities(am)}>
                  Aktivitas
                </Button>
                <Button size="sm" variant="ghost">
                  Profil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Rata-rata aktivitas</p>
          <p className="text-2xl font-semibold text-neutral-900">{summary.avgActivities} / bulan</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Aktif ≥ 20</p>
          <p className="text-2xl font-semibold text-neutral-900">{highActivityCount} AM</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Perkiraan mingguan</p>
          <p className="text-2xl font-semibold text-neutral-900">{Math.round(summary.avgActivities / 4)} / minggu</p>
        </Card>
      </div>

      {activityRanked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
          Tidak ada data untuk tab ini.
        </div>
      ) : (
        <div className="space-y-3">
          {activityRanked.map((am) => (
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
                <Button size="sm" variant="secondary" onClick={() => handleOpenActivities(am)}>
                  Detail Aktivitas
                </Button>
                <Button size="sm" variant="ghost">
                  Profil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderFreshnessTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Rata-rata kesegaran</p>
          <p className="text-2xl font-semibold text-neutral-900">{summary.avgFreshness} hari</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Data &gt; 7 hari</p>
          <p className="text-2xl font-semibold text-neutral-900">{freshnessAlerts.length} AM</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Frekuensi update</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {filteredData.length
              ? Math.round(filteredData.reduce((sum, am) => sum + am.freshnessFrequency, 0) / filteredData.length)
              : 0}{' '}
            x/bln
          </p>
        </Card>
      </div>

      {freshnessRanked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
          Tidak ada data untuk tab ini.
        </div>
      ) : (
        <div className="space-y-3">
          {freshnessRanked.map((am) => (
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
                <Button size="sm" variant="secondary" onClick={() => handleOpenActivities(am)}>
                  Update melalui Aktivitas
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // === FULL-WIDTH LAYOUT + unified header & spacing (like ContactManagement) ===
  return (
    <div className="space-y-6 pb-14 animate-fade-in">
      <PageHeader
        title="Dashboard Kinerja Account Manager"
        subtitle="Management Information System (MIS) untuk memantau performa tim di wilayah Anda."
        icon={FaChartLine}
      />

      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-neutral-900">Filter & Pencarian</p>
          <p className="text-xs text-neutral-500">
            Menampilkan {filteredData.length} AM dari {performanceDataset.length} total data.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari nama atau witel" variant="subtle" />
        </div>
      </Card>

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
          {activeTab === 'summary' && renderSummaryTab()}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'activity' && renderActivityTab()}
          {activeTab === 'freshness' && renderFreshnessTab()}
        </div>
      </Card>

      <AMActivityModal am={selectedAM} open={showActivityModal} onClose={closeActivities} />
    </div>
  )
}
