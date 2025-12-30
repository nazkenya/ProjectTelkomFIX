// src/pages/AmProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserTie,
  FaMapMarkerAlt,
  FaUsers,
  FaDownload,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { getAMs } from "../../services/amService";
import SearchInput from "../../components/ui/SearchInput";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Card from "../../components/ui/Card";
import StatsCard from "../../components/ui/StatsCard";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { ROLES } from "../../auth/roles";

/* ====================== DUMMY FALLBACK ====================== */
const DUMMY_AMS = [
  { ID_SALES: "DUM-001", NIK_AM: "111001", NAMA_AM: "Andi Pratama", TR: "JAKARTA SELATAN", LEVEL_AM: "AM PRO HIRE" },
  { ID_SALES: "DUM-002", NIK_AM: "111002", NAMA_AM: "Bunga Maharani", TR: "BANDUNG", LEVEL_AM: "AM SME" },
  { ID_SALES: "DUM-003", NIK_AM: "111003", NAMA_AM: "Cahyo Nugroho", TR: "SURABAYA", LEVEL_AM: "AM ORGANIK" },
];

const AM_STATUS_OPTIONS = [
  "AM PRO HIRE",
  "AM PRO HIRE MD",
  "AM SME",
  "AM ORGANIK",
  "AM ORGANIK MD",
];

export default function AmProfile() {
  /* ====================== STATE ====================== */
  const [ams, setAms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    q: "",
    region: "",
    levelAm: "",
    status: "",
  });

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { role } = useAuth();

  /* ====================== APPROVAL DUMMY ====================== */
  const [pendingAMs, setPendingAMs] = useState([
    { id_sales: "PND-001", nama_am: "Budi Santoso (Pending)", nik_am: "123456", tr: "REG-1", level_am: "AM PRO HIRE" },
    { id_sales: "PND-002", nama_am: "Citra Lestari (Pending)", nik_am: "789012", tr: "REG-2", level_am: "AM SME" },
  ]);

  /* ====================== UTIL ====================== */
  const getFieldValue = (row, key) =>
    row?.[key] ?? row?.[key.toUpperCase()] ?? row?.[key.toLowerCase()] ?? "";

  /* ====================== FETCH (600+ ROW AMAN) ====================== */
  useEffect(() => {
    setLoading(true);
    getAMs(["id_sales", "nik_am", "nama_am", "tr", "level_am", "am_aktif"])
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setAms(res.data); // 🔥 TIDAK DIPOTONG
        } else {
          setAms(DUMMY_AMS);
        }
      })
      .catch(() => setAms(DUMMY_AMS))
      .finally(() => setLoading(false));
  }, []);

  /* ====================== FILTER ====================== */
  const filtered = useMemo(() => {
    return ams.filter((m) => {
      const nama = getFieldValue(m, "NAMA_AM").toLowerCase();
      const nik = getFieldValue(m, "NIK_AM").toLowerCase();
      const id = getFieldValue(m, "ID_SALES").toLowerCase();
      const region = getFieldValue(m, "TR");
      const levelAm = getFieldValue(m, "LEVEL_AM");

      if (filter.region && region !== filter.region) return false;
      if (filter.levelAm && levelAm !== filter.levelAm) return false;

      if (filter.q) {
        const q = filter.q.toLowerCase();
        return nama.includes(q) || nik.includes(q) || id.includes(q);
      }
      return true;
    });
  }, [ams, filter]);

  /* ====================== PAGINATION ====================== */
  const total = filtered.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);
  const pageRows = filtered.slice(startIndex, endIndex);

  /* ====================== STATS ====================== */
  const regions = [...new Set(ams.map((m) => getFieldValue(m, "TR")).filter(Boolean))];

  const stats = [
    { label: "Jumlah AM (Hasil Filter)", value: filtered.length.toLocaleString(), icon: FaUsers },
    { label: "Total Active AM", value: filtered.length.toLocaleString(), icon: FaUserTie },
    { label: "Regions", value: regions.length.toString(), icon: FaMapMarkerAlt },
  ];

  /* ====================== TABLE ====================== */
  const columns = [
    { key: "ID_SALES", label: "ID SALES", render: (r) => getFieldValue(r, "ID_SALES") },
    { key: "NIK_AM", label: "NIK AM", render: (r) => getFieldValue(r, "NIK_AM") },
    {
      key: "NAMA_AM",
      label: "NAMA AM",
      render: (row) => {
        const nama = getFieldValue(row, "NAMA_AM");
        const nik = getFieldValue(row, "NIK_AM");
        return (
          <Link to={`/profile/am/detail?nik=${nik}`} className="flex items-center gap-2 hover:text-[#7C3AED]">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-xs">
              {nama?.charAt(0)}
            </div>
            <span className="font-medium hover:underline">{nama}</span>
          </Link>
        );
      },
    },
    { key: "TR", label: "REGION", render: (r) => getFieldValue(r, "TR") },
    { key: "LEVEL_AM", label: "STATUS AM", render: (r) => getFieldValue(r, "LEVEL_AM") },
  ];

  /* ====================== RENDER ====================== */
  return (
    <div className="space-y-6">
      <PageHeader title="Account Manager Profile" subtitle="Klik nama AM untuk melihat detail" icon={FaUserTie} />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => <StatsCard key={i} {...s} />)}
      </div>

      {/* ================= APPROVAL CARD (PERSIS GAMBAR) ================= */}
      {(role === ROLES.manager || role === ROLES.admin) && pendingAMs.length > 0 && (
        <Card className="bg-white">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="mt-1 text-blue-500">
              <FaCheckCircle />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-neutral-900">
                Data AM Menunggu Persetujuan
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Data berikut telah di-insert melalui ECRM Workspace dan menunggu persetujuan Anda.
              </p>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-neutral-200">
            {pendingAMs.map((am) => {
              const initial = am.nama_am?.charAt(0)?.toUpperCase();

              return (
                <div
                  key={am.id_sales}
                  className="flex items-center justify-between py-4"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                      {initial}
                    </div>

                    {/* Text */}
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {am.nama_am}
                      </p>
                      <p className="text-sm text-neutral-500">
                        NIK: {am.nik_am} | Region: {am.tr} | Status: {am.level_am}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT ACTION */}
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                      onClick={() =>
                        setPendingAMs((prev) =>
                          prev.filter((x) => x.id_sales !== am.id_sales)
                        )
                      }
                    >
                      <FaCheckCircle className="mr-2" />
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 px-4"
                    >
                      <FaTimesCircle className="mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      {/* FILTER (LENGKAP, TIDAK HILANG) */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-red-600" />
          <h2 className="font-semibold">Filter Data AM (Semua)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <SearchInput
            value={filter.q}
            onChange={(v) => setFilter((s) => ({ ...s, q: v }))}
            placeholder="Search ID, NIK or Name..."
          />

          <Select value={filter.region} onChange={(e) => setFilter((s) => ({ ...s, region: e.target.value }))}>
            <option value="">All Regions</option>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </Select>

          <Select value={filter.levelAm} onChange={(e) => setFilter((s) => ({ ...s, levelAm: e.target.value }))}>
            <option value="">All Status AM</option>
            {AM_STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </div>

        <div className="flex justify-between items-center mt-4 pt-2 border-t">
          <p className="text-sm text-neutral-500">
            Showing <b>{filtered.length}</b> of <b>{ams.length}</b> account managers
          </p>
          <Button variant="ghost" onClick={() => {}}>
            <FaDownload className="mr-2" /> Export Data
          </Button>
        </div>
      </Card>

      {/* TABLE */}
      <Card>
        {loading ? <p className="text-center py-10">Loading...</p> : <Table columns={columns} data={pageRows} />}
      </Card>

      {/* PAGINATION */}
      <Pagination
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => (endIndex < total ? p + 1 : p))}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setPage(1);
        }}
      />
    </div>
  );
}
