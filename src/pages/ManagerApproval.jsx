import React, { useEffect, useMemo, useState } from "react";
import {
  FaUserTie,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";

import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import StatsCard from "../components/ui/StatsCard";
import {
  getManagerApprovals,
  approveManager,
  rejectManager,
} from "../services/managerApprovalService";

export default function ManagerApproval() {
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await getManagerApprovals(user.id);
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await approveManager(id);
    loadData();
  };

  const reject = async (id) => {
    await rejectManager(id);
    loadData();
  };

  // ================= Pagination =================
  const total = data.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);
  const pageRows = data.slice(startIndex, endIndex);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => (endIndex < total ? p + 1 : p));

  // ================= Stats =================
  const stats = useMemo(() => {
    const salesCount = data.filter((d) => d.ROLE === "sales").length;
    const amCount = data.filter((d) => d.ROLE === "am").length;

    return [
      {
        label: "Total Pending Approval",
        value: total.toString(),
        icon: FaClock,
      },
      {
        label: "Sales Pending",
        value: salesCount.toString(),
        icon: FaUsers,
      },
      {
        label: "AM Pending",
        value: amCount.toString(),
        icon: FaUserTie,
      },
    ];
  }, [data, total]);

  // ================= Table Columns =================
  const columns = [
    {
      key: "nik",
      label: "NIK",
      render: (row) => row.nik,
    },
    {
      key: "nama_lengkap",
      label: "Nama Lengkap",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
            {String(row.nama_lengkap || "").charAt(0)}
          </div>
          <span className="font-medium">{row.nama_lengkap}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-700 uppercase">
          {row.email}
        </span>
      ),
    },
    {
      key: "nomor_telepon",
      label: "Nomor Telepon",
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-700 uppercase">
          {row.nomor_telepon}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-700 uppercase">
          {row.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-700 uppercase">
          {row.status}
        </span>
      ),
    },
    {
      key: "AKSI",
      label: "Aksi",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="success"
            onClick={() => approve(row.id)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => reject(row.id)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        variant="hero"
        title="Manager Dashboard Request User Approval"
        subtitle="Persetujuan pembuatan akun baru"
        icon={FaUserTie}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>

      {/* Table */}
      <Card className="bg-white">
        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Loading data...
          </p>
        ) : (
          <Table
            columns={columns}
            data={pageRows}
            rowKey={(r) => r.ID}
          />
        )}
      </Card>

      {/* Pagination */}
      <Card className="bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-neutral-600">
            <span className="font-semibold text-neutral-800">
              {total === 0 ? 0 : startIndex + 1}-{endIndex}
            </span>{" "}
            dari {total} user pending
          </div>

          <Pagination
            page={page}
            onPrev={onPrev}
            onNext={onNext}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n);
              setPage(1);
            }}
          />
        </div>
      </Card>
    </div>
  );
}
