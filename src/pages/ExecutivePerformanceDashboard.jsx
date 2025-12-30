import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaChartPie,
  FaChartLine,
  FaLightbulb,
  FaSyncAlt,
  FaTasks,
  FaUserTie,
  FaChartBar
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

// ---- helpers & dataset
const buildPerformanceDataset = () =>
  mockAMs.map((am, idx) => {
    const profileCompletion = 60 + ((idx * 13) % 35)
    const monthlyActivities = 14 + ((idx * 4) % 18)
    const dataFreshnessDays = 1 + ((idx * 3) % 12)
    const freshnessFrequency = Math.max(1, Math.round(30 / Math.max(1, dataFreshnessDays)))
    return {
      ...am,
      profileCompletion,
      monthlyActivities,
      dataFreshnessDays,
      freshnessFrequency,
    }
  })

const DATASET = buildPerformanceDataset()
const REGIONS = ['Semua Indonesia', ...Array.from(new Set(DATASET.map((am) => am.region)))]

const getHealthStatus = (profile, freshnessDays) => {
  if (profile >= 85 && freshnessDays <= 4) return { status: 'Green', tone: 'success' }
  if (profile >= 70 && freshnessDays <= 7) return { status: 'Yellow', tone: 'warning' }
  return { status: 'Red', tone: 'danger' }
}

const aggregateByRegion = (collection) => {
  const map = new Map()
  collection.forEach((item) => {
    if (!map.has(item.region)) {
      map.set(item.region, {
        region: item.region,
        count: 0,
        totalProfile: 0,
        totalActivities: 0,
        totalFreshness: 0,
      })
    }
    const bucket = map.get(item.region)
    bucket.count += 1
    bucket.totalProfile += item.profileCompletion
    bucket.totalActivities += item.monthlyActivities
    bucket.totalFreshness += item.dataFreshnessDays
  })
  return Array.from(map.values()).map((bucket) => ({
    ...bucket,
    avgProfile: Math.round(bucket.totalProfile / bucket.count),
    avgActivities: Math.round(bucket.totalActivities / bucket.count),
    avgFreshness: parseFloat((bucket.totalFreshness / bucket.count).toFixed(1)),
  }))
}

export default function ExecutivePerformanceDashboard() {
  const navigate = useNavigate()

  // ---- local state
  const [regionFilter, setRegionFilter] = useState('Semua Indonesia')
  const [search, setSearch] = useState('')
  const [insightInput, setInsightInput] = useState('')
  const [insights, setInsights] = useState([
    { id: 'ins-1', author: 'Chief Commercial Officer', text: 'Percepat update data untuk wilayah Sumatera Utara.', date: '2025-01-05' },
  ])

  // modal state (to avoid ReferenceError)
  const [selectedAM, setSelectedAM] = useState(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const closeActivities = () => setShowActivityModal(false)

  // ---- filtering
  const filteredAMs = useMemo(() => {
    let list = DATASET
    if (regionFilter !== 'Semua Indonesia') {
      list = list.filter((am) => am.region === regionFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((am) => am.nama_am.toLowerCase().includes(q) || am.witel.toLowerCase().includes(q))
    }
    return list
  }, [regionFilter, search])

  // ---- aggregates
  const nationalSummary = useMemo(() => {
    const total = filteredAMs.length || 1
    const totalVisits = filteredAMs.reduce((sum, am) => sum + am.monthlyActivities, 0)
    const avgProfile = filteredAMs.reduce((sum, am) => sum + am.profileCompletion, 0) / total
    const avgFreshness = filteredAMs.reduce((sum, am) => sum + am.dataFreshnessDays, 0) / total
    return {
      totalAM: filteredAMs.length,
      totalVisits,
      avgProfile: Math.round(avgProfile),
      avgFreshness: parseFloat(avgFreshness.toFixed(1)),
    }
  }, [filteredAMs])

  const regionalStats = useMemo(() => aggregateByRegion(filteredAMs), [filteredAMs])

  // non-mutating sort to find worst region
  const worstRegion = useMemo(() => {
    if (!regionalStats.length) return null
    return [...regionalStats].sort((a, b) => a.avgProfile - b.avgProfile)[0]
  }, [regionalStats])

  const chartMaxProfile = Math.max(...regionalStats.map((r) => r.avgProfile), 100)
  const chartMaxActivities = Math.max(...regionalStats.map((r) => r.avgActivities), 30)

  // ---- insights
  const handleAddInsight = () => {
    if (!insightInput.trim()) return
    const entry = {
      id: `ins-${Date.now()}`,
      author: 'Top-Level Manager',
      text: insightInput.trim(),
      date: new Date().toLocaleDateString('id-ID'),
    }
    setInsights((prev) => [entry, ...prev])
    setInsightInput('')
  }

  // accept region to drill down
  const goToManagerDashboard = (region) => {
    const qs = region ? `?region=${encodeURIComponent(region)}` : ''
    navigate(`/executive/region${qs}`)
  }


  /* -----------------------------------------------
   * LAYOUT: full-width, full-height feel
   * mirrors ContactManagement structure
   * --------------------------------------------- */
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        // Use the same simple header style like ContactManagement
        title="Executive Performance Overview"
        subtitle="Enterprise Information System (EIS) untuk memantau kinerja Account Manager skala nasional."
        icon={FaChartLine}
      />

      {/* Top Stats — same rhythm as ContactManagement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <StatsCard label="Total Account Manager" value={nationalSummary.totalAM.toLocaleString()} icon={FaUserTie} />
        <StatsCard label="Total Visit / Bulan" value={nationalSummary.totalVisits.toLocaleString()} icon={FaTasks} />
        <StatsCard label="Avg Profile Completion" value={`${nationalSummary.avgProfile}%`} icon={FaChartBar} />
        <StatsCard label="Avg Data Freshness" value={`${nationalSummary.avgFreshness} hari`} icon={FaSyncAlt} />
      </div>

      {/* Filters Card — aligned with ContactManagement filter card layout */}
      <Card className="bg-white">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">Filter & Drill-down</p>
            <p className="text-xs text-neutral-500">
              {filteredAMs.length} Account Manager ditampilkan ({regionFilter === 'Semua Indonesia' ? 'Nasional' : regionFilter})
            </p>
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4">
            <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
            <SearchInput value={search} onChange={setSearch} placeholder="Cari AM / Witel" />
          </div>
        </div>
      </Card>

      {/* Health Status + Region Cards */}
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-neutral-900">Health Status Nasional</p>
            <p className="text-sm text-neutral-500">Status kesehatan berdasarkan rata-rata profil & kesegaran data.</p>
          </div>
          {worstRegion && (
            <Badge variant="warning">
              Fokus perbaikan: {worstRegion.region} (profil {worstRegion.avgProfile}%)
            </Badge>
          )}
        </div>

        {/* Region cards — clickable to ManagerPerformanceDashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {regionalStats.map((region) => {
            const { status, tone } = getHealthStatus(region.avgProfile, region.avgFreshness)
            return (
              <div
                key={region.region}
                role="button"
                tabIndex={0}
                onClick={() => goToManagerDashboard(region.region)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToManagerDashboard(region.region)}
                aria-label={`Buka ManagerPerformanceDashboard untuk region ${region.region}`}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2 cursor-pointer transition hover:bg-neutral-100/70 focus:outline-none focus:ring-2 focus:ring-[#2C5CC5]/30"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-900">{region.region}</p>
                  <Badge variant={tone}>{status}</Badge>
                </div>
                <div className="space-y-1 text-xs text-neutral-600">
                  <p>Avg profile: {region.avgProfile}%</p>
                  <p>Avg fresh: {region.avgFreshness} hari</p>
                  <p>AM aktif: {region.count}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Comparison Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold text-neutral-900">Perbandingan Regional - Profil</p>
            <span className="text-xs text-neutral-500">Skala normalisasi: {chartMaxProfile}%</span>
          </div>
          <div className="space-y-3">
            {regionalStats.map((region) => (
              <div key={region.region} className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{region.region}</span>
                  <span>{region.avgProfile}%</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2C5CC5] to-[#6D28D9]"
                    style={{ width: `${(region.avgProfile / chartMaxProfile) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold text-neutral-900">Perbandingan Regional - Visit Frequency</p>
            <span className="text-xs text-neutral-500">Skala normalisasi: {chartMaxActivities} aktivitas</span>
          </div>
          <div className="space-y-3">
            {regionalStats.map((region) => (
              <div key={region.region} className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{region.region}</span>
                  <span>{region.avgActivities} / bulan</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C]"
                    style={{ width: `${(region.avgActivities / chartMaxActivities) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom: Health Distribution + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <FaChartPie className="text-neutral-500" />
            <p className="text-lg font-semibold text-neutral-900">Distribusi Health Status</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {['Green', 'Yellow', 'Red'].map((bucket) => {
              const bucketCount = filteredAMs.filter(
                (am) => getHealthStatus(am.profileCompletion, am.dataFreshnessDays).status === bucket
              ).length
              const percentage = ((bucketCount / Math.max(filteredAMs.length, 1)) * 100).toFixed(1)
              return (
                <div key={bucket} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <span>{bucket}</span>
                  <span>
                    {bucketCount} AM · {percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <FaLightbulb className="text-amber-500" />
            <p className="text-lg font-semibold text-neutral-900">Insight Manajemen</p>
          </div>
          <textarea
            value={insightInput}
            onChange={(e) => setInsightInput(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5CC5]/30"
            placeholder="Catat insight atau arahan eksekutif..."
          />
          <div className="text-right">
            <Button variant="primary" size="sm" onClick={handleAddInsight}>
              Simpan Insight
            </Button>
          </div>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className="rounded-xl border border-neutral-200 bg-white p-3 text-sm space-y-1">
                <p className="text-xs text-neutral-500">
                  {insight.author} • {insight.date}
                </p>
                <p className="text-neutral-800">{insight.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Keep modal available if you open it elsewhere */}
      <AMActivityModal am={selectedAM} open={showActivityModal} onClose={closeActivities} />
    </div>
  )
}
