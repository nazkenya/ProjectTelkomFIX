import React, { useEffect, useState } from "react";
import { FaUserCheck, FaUsers, FaClock } from "react-icons/fa";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import StatsCard from "../components/ui/StatsCard";
import { useAuth } from "../auth/AuthContext";
import API_BASE from "../services/api";

export default function AdminApproval() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ⭐️ state pesan sukses / error
  const [message, setMessage] = useState(null);

  const { user } = useAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/approval`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/approval/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved_by: user?.nama_lengkap || user?.name,
        }),
      });

      const json = await res.json();

      setMessage({
        type: "success",
        text: json.message || "User berhasil di-approve",
      });

      loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat approve",
      });

      setTimeout(() => setMessage(null), 3000);
    }
  };

  const reject = async (id) => {
    try {
      await fetch(`${API_BASE}/admin/approval/${id}/reject`, {
        method: "POST",
      });

      setMessage({
        type: "error",
        text: "User ditolak",
      });

      loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat reject",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Pagination
  const total = data.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, total);
  const pageRows = data.slice(startIndex, endIndex);

  const stats = [
    { label: "Total Pending Approval", value: total.toString(), icon: FaClock },
    {
      label: "Role Manager",
      value: data.filter((d) => d.role === "manager").length.toString(),
      icon: FaUsers,
    },
    {
      label: "Role Sales",
      value: data.filter((d) => d.role === "sales").length.toString(),
      icon: FaUsers,
    },
  ];

  const columns = [
    { key: "nik", label: "NIK", render: (row) => row.nik },
    {
      key: "nama_lengkap",
      label: "Nama Lengkap",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
            {String(row.nama_lengkap || "").charAt(0)}
          </div>
          <span className="font-medium">{row.nama_lengkap}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => row.email },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-700">
          {row.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
          PENDING
        </span>
      ),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="success" onClick={() => approve(row.id)}>
            Approve
          </Button>
          <Button size="sm" variant="danger" onClick={() => reject(row.id)}>
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
        title="Admin Dashboard Request User Approval"
        subtitle="Persetujuan pembuatan akun baru"
        icon={FaUserCheck}
      />

      {/* ⭐️ Alert */}
      {message && (
        <div
          className={`p-3 rounded border text-sm ${
            message.type === "success"
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>

      <Card className="bg-white">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading data...</p>
        ) : (
          <Table columns={columns} data={pageRows} rowKey={(r) => r.id} />
        )}
      </Card>

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
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setPage((p) => (endIndex < total ? p + 1 : p))
            }
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
