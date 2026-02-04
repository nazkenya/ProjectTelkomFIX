import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaChartPie,
  FaChartLine,
  FaLightbulb,
  FaSyncAlt,
  FaTasks,
  FaUserTie,
  FaChartBar,
  FaSpinner
} from 'react-icons/fa'
import PageHeader from '@components/ui/PageHeader'
import Card from '@components/ui/Card'
import StatsCard from '@components/ui/StatsCard'
import Select from '@components/ui/Select'
import SearchInput from '@components/ui/SearchInput'
import { Badge } from '@components/ui/Badge'
import Button from '@components/ui/Button'
import AMActivityModal from '@components/activities/AMActivityModal'
import { getAMs } from '@/services/amService' // ✅ Ganti dari mockAMs ke service

// Health Status Logic (sesuai frontend asli)
const getHealthStatus = (profile, freshnessDays) => {
  if (profile >= 85 && freshnessDays <= 4) return { status: 'Green', tone: 'success' }
  if (profile >= 70 && freshnessDays <= 7) return { status: 'Yellow', tone: 'warning' }
  return { status: 'Red', tone: 'danger' }
}

// Aggregation helper (sesuai frontend asli)
const aggregateByRegion = (collection) => {
  const map = new Map()
  collection.forEach((item) => {
    // Gunakan WITEL sebagai region (sesuai struktur database)
    const region = item.region || 'Unknown'
    if (!map.has(region)) {
      map.set(region, {
        region,
        count: 0,
        totalProfile: 0,
        totalActivities: 0,
        totalFreshness: 0,
      })
    }
    const bucket = map.get(region)
    bucket.count += 1
    bucket.totalProfile += item.profileCompletion || 0
    bucket.totalActivities += item.monthlyActivities || 0
    bucket.totalFreshness += item.dataFreshnessDays || 0
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

  // ---- Local state
  const [regionFilter, setRegionFilter] = useState('Semua Indonesia')
  const [search, setSearch] = useState('')
  const [insightInput, setInsightInput] = useState('')
  const [insights, setInsights] = useState([
    { id: 'ins-1', author: 'Chief Commercial Officer', text: 'Percepat update data untuk wilayah Sumatera Utara.', date: '2025-01-05' },
  ])

  // Modal state
  const [selectedAM, setSelectedAM] = useState(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const closeActivities = () => setShowActivityModal(false)

  // ---- API data state
  const [ams, setAms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- Fetch AM data dari backend via amService
  const fetchAMData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Ambil field yang dibutuhkan dashboard dari database
      const fields = [
        'ID_SALES', 
        'NAMA_AM', 
        'WITEL', 
        'TR', 
        'PROFILE_COMPLETION', 
        'UPDATED_AT',
        // Field tambahan untuk perhitungan monthlyActivities akan di-handle di backend
      ]
      
      const res = await getAMs(fields)
      const rawData = res.data || []

      // Transformasi data dari API ke format frontend
      const transformedAMs = rawData
        .filter(am => am.AM_AKTIF === 'AKTIF') // Hanya AM aktif
        .map(am => {
          // Hitung dataFreshnessDays di frontend (alternatif: bisa dihitung di backend)
          const updatedAt = new Date(am.UPDATED_AT)
          const now = new Date()
          const freshnessDays = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24)) || 0

          return {
            id: am.ID_SALES,
            nama_am: am.NAMA_AM || 'Nama tidak tersedia',
            witel: am.WITEL || 'WITEL tidak tersedia',
            region: am.WITEL || 'Unknown', // ✅ Mapping: WITEL = region di frontend
            tr: am.TR || '-',
            profileCompletion: parseInt(am.PROFILE_COMPLETION) || 0,
            dataFreshnessDays: freshnessDays,
            monthlyActivities: parseInt(am.MONTHLY_ACTIVITIES) || 0, // Backend harus supply field ini
            email: am.EMAIL,
            notel: am.NOTEL,
          }
        })

      setAms(transformedAMs)
      
    } catch (err) {
      console.error('❌ Gagal fetch data AM untuk dashboard:', err)
      setError('Gagal memuat data Account Manager. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Initial data fetch
  useEffect(() => {
    fetchAMData()
  }, [])

  // ---- Dynamic regions dari data AM (WITEL)
  const REGIONS = useMemo(() => {
    const uniqueRegions = Array.from(new Set(ams.map(am => am.region)))
      .filter(r => r && r !== 'Unknown')
      .sort()
    return ['Semua Indonesia', ...uniqueRegions]
  }, [ams])

  // ---- Filtering (client-side untuk responsivitas)
  const filteredAMs = useMemo(() => {
    let list = ams
    
    // Filter by region
    if (regionFilter !== 'Semua Indonesia') {
      list = list.filter((am) => am.region === regionFilter)
    }
    
    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((am) => 
        am.nama_am.toLowerCase().includes(q) || 
        (am.witel && am.witel.toLowerCase().includes(q))
      )
    }
    
    return list
  }, [ams, regionFilter, search])

  // ---- National summary calculation
  const nationalSummary = useMemo(() => {
    const total = filteredAMs.length || 1
    const totalVisits = filteredAMs.reduce((sum, am) => sum + (am.monthlyActivities || 0), 0)
    const avgProfile = filteredAMs.reduce((sum, am) => sum + (am.profileCompletion || 0), 0) / total
    const avgFreshness = filteredAMs.reduce((sum, am) => sum + (am.dataFreshnessDays || 0), 0) / total
    
    return {
      totalAM: filteredAMs.length,
      totalVisits,
      avgProfile: Math.round(avgProfile),
      avgFreshness: parseFloat(avgFreshness.toFixed(1)),
    }
  }, [filteredAMs])

  // ---- Regional stats aggregation
  const regionalStats = useMemo(() => aggregateByRegion(filteredAMs), [filteredAMs])

  // ---- Find worst performing region
  const worstRegion = useMemo(() => {
    if (!regionalStats.length) return null
    return [...regionalStats].sort((a, b) => a.avgProfile - b.avgProfile)[0]
  }, [regionalStats])

  // ---- Chart max values for normalization
  const chartMaxProfile = Math.max(...regionalStats.map((r) => r.avgProfile), 100)
  const chartMaxActivities = Math.max(...regionalStats.map((r) => r.avgActivities), 30)

  // ---- Handle add insight (tetap lokal untuk sekarang)
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

  // ---- Navigate to manager dashboard
  const goToManagerDashboard = (region) => {
    const qs = region ? `?region=${encodeURIComponent(region)}` : ''
    navigate(`/executive/region${qs}`)
  }

  // ---- Loading state UI
  if (loading && ams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#2C5CC5] mb-4" />
          <p className="text-lg font-medium text-neutral-700">Memuat data Account Manager...</p>
          <p className="text-sm text-neutral-500 mt-1">Mengambil data dari database Oracle</p>
        </div>
      </div>
    )
  }

  // ---- Error state UI
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Executive Performance Overview"
          subtitle="Enterprise Information System (EIS) untuk memantau kinerja Account Manager skala nasional."
          icon={FaChartLine}
        />
        <Card className="bg-red-50 border border-red-200">
          <div className="text-center py-8">
            <p className="text-red-800 font-medium mb-2">{error}</p>
            <Button 
              variant="primary" 
              onClick={fetchAMData}
              className="mt-2"
            >
              Muat Ulang Data
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Executive Performance Overview"
        subtitle="Enterprise Information System (EIS) untuk memantau kinerja Account Manager skala nasional."
        icon={FaChartLine}
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <StatsCard 
          label="Total Account Manager" 
          value={nationalSummary.totalAM.toLocaleString()} 
          icon={FaUserTie} 
        />
        <StatsCard 
          label="Total Visit / Bulan" 
          value={nationalSummary.totalVisits.toLocaleString()} 
          icon={FaTasks} 
        />
        <StatsCard 
          label="Avg Profile Completion" 
          value={`${nationalSummary.avgProfile}%`} 
          icon={FaChartBar} 
        />
        <StatsCard 
          label="Avg Data Freshness" 
          value={`${nationalSummary.avgFreshness} hari`} 
          icon={FaSyncAlt} 
        />
      </div>

      {/* Filters Card */}
      <Card className="bg-white">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">Filter & Drill-down</p>
            <p className="text-xs text-neutral-500">
              {filteredAMs.length} Account Manager ditampilkan ({regionFilter === 'Semua Indonesia' ? 'Nasional' : regionFilter})
            </p>
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4">
            <Select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              disabled={loading}
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder="Cari AM / WITEL" 
              disabled={loading}
            />
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

        {/* Empty state jika tidak ada data */}
        {filteredAMs.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <p className="text-lg">Tidak ada data Account Manager yang sesuai filter</p>
            <p className="mt-2 text-sm">Coba ubah filter region atau pencarian</p>
          </div>
        ) : (
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
        )}
      </Card>

      {/* Comparison Bars */}
      {regionalStats.length > 0 && (
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
      )}

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
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleAddInsight}
              disabled={!insightInput.trim()}
            >
              Simpan Insight
            </Button>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
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

      {/* Activity Modal (placeholder - butuh API tambahan untuk riwayat aktivitas) */}
      <AMActivityModal 
        am={selectedAM} 
        open={showActivityModal} 
        onClose={closeActivities} 
      />
    </div>
  )
}