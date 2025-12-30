import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFilter, FaUsers, FaChartLine, FaDollarSign, FaDownload } from 'react-icons/fa'
import SearchInput from '../components/ui/SearchInput'
import Tag from '../components/ui/Tag'
import Pagination from '../components/ui/Pagination'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StatsCard from '../components/ui/StatsCard'
import PageHeader from '../components/ui/PageHeader'
import customersData from '../data/mockCustomers'

export default function CustomersPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // ---------------------------------------------------------
  // FILTER
  // ---------------------------------------------------------
  const filtered = useMemo(() => {
    if (!query) return customersData
    const q = query.toLowerCase()
    return customersData.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.budSegmen.toLowerCase().includes(q) ||  // → INDUSTRI
        c.witel.toLowerCase().includes(q)          // → WILAYAH
    )
  }, [query])

  const total = filtered.length
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, total)
  const pageRows = filtered.slice(startIndex, endIndex)

  const onPrev = () => setPage((p) => Math.max(1, p - 1))
  const onNext = () => setPage((p) => (endIndex < total ? p + 1 : p))

  // ---------------------------------------------------------
  // TABLE COLUMNS (UPDATED)
  // ---------------------------------------------------------
  const columns = [
    {
      key: 'name',
      label: 'Pelanggan',
      render: (c) => (
        <>
          <strong className="block font-semibold text-neutral-800">{c.name}</strong>
          <span className="text-neutral-500 text-[13px]">
            {c.code}
            {c.tag && (
              <Tag variant={c.tag.variant} className="ml-2">
                {c.tag.text}
              </Tag>
            )}
          </span>
        </>
      ),
    },

    // 🔥 BUD/Segmen → INDUSTRI
    {
      key: 'budSegmen',
      label: 'Industri',
      render: (c) => <span className="text-neutral-700">{c.budSegmen}</span>,
    },

    // 🔥 Witel → WILAYAH
    {
      key: 'witel',
      label: 'Wilayah',
      render: (c) => <span className="text-neutral-700">{c.witel}</span>,
    },

    // { key: 'revenue', label: 'Revenue' },
    // { key: 'collection', label: 'Collection' },
    // { key: 'profitability', label: 'Profitability' },
  ]

  // Stats
  const stats = [
    { label: 'Total Pelanggan', value: customersData.length.toLocaleString(), icon: FaUsers },
    { label: 'Pelanggan Aktif', value: '5', icon: FaChartLine },
    { label: 'Total Revenue', value: 'Rp 12.2B', icon: FaDollarSign },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        variant="hero"
        title="Daftar Pelanggan"
        subtitle="Kelola dan pantau semua data pelanggan Anda"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="bg-white">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-between">
          <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari pelanggan, kode, industri, atau wilayah..."
            />
            <Button variant="secondary" className="inline-flex items-center gap-2 hover:scale-105">
              <FaFilter /> Filter
            </Button>
          </div>

          <Button variant="secondary" className="inline-flex items-center gap-2">
            <FaDownload /> Export
          </Button>
        </div>
      </Card>

      {/* Table */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <Table
          columns={columns}
          data={pageRows}
          rowKey="id"
          onRowClick={(c) => navigate(`/customers/${c.id}`)}
        />
      </div>

      {/* Pagination */}
      <Card className="bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            <span className="text-neutral-800 font-semibold">
              {total === 0 ? 0 : startIndex + 1}-{endIndex}
            </span>
            <span className="text-neutral-500"> dari {total} Pelanggan</span>

            <div className="text-xs text-neutral-400 mt-2 space-y-0.5">
              <p>Terakhir diperbarui 25 Agu 2025, 09:24 WIB</p>
            </div>
          </div>

          <Pagination
            page={page}
            onPrev={onPrev}
            onNext={onNext}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n)
              setPage(1)
            }}
          />
        </div>
      </Card>
    </div>
  )
}
