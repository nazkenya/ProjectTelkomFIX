import React, { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { FaEdit } from "react-icons/fa";

import { getAMs } from "../../services/amService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* ====================== FORM INPUT ====================== */
function FormInput({ label, id, value, onChange, type = "text", options = [] }) {
  const baseClass =
    "w-full px-4 py-2.5 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {type === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={baseClass}
        >
          <option value="">-- Pilih {label} --</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          rows={4}
          className={baseClass}
        />
      ) : (
        <input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          type={type}
          className={baseClass}
        />
      )}
    </div>
  );
}

/* ====================== PAGE ====================== */
export default function AMUpdate() {
  const [ams, setAms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAM, setSelectedAM] = useState(null);

  const emptyForm = {
    notel: "",
    email: "",
    level_am: "",
    kel_am: "",
    tgl_aktif: "",
    update_perpanjangan_kontrak: "",
    lama_menjadi_pro_hire: "",
    ket_out: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  /* ====================== LOAD DATA ====================== */
  useEffect(() => {
    getAMs()
      .then((res) => {
        setAms(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => setAms([]))
      .finally(() => setLoading(false));
  }, []);

  /* ====================== HANDLERS ====================== */
  const handleRowClick = (am) => {
    setSelectedAM(am);

    setFormData({
      notel: am.notel || "",
      email: am.email || "",
      level_am: am.level_am || "",
      kel_am: am.kel_am || "",
      tgl_aktif: am.tgl_aktif || "",
      update_perpanjangan_kontrak: am.update_perpanjangan_kontrak || "",
      lama_menjadi_pro_hire: am.lama_menjadi_pro_hire || "",
      ket_out: am.ket_out || "",
    });
  };

  const handleInsertNew = () => {
    setSelectedAM(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = selectedAM
        ? `${API_BASE}/am/${selectedAM.nik_am}`   // UPDATE
        : `${API_BASE}/am`;                      // INSERT

      const method = selectedAM ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal simpan");

      alert(
        selectedAM
          ? "Data AM berhasil di-update dan dikirim untuk validasi."
          : "Data AM baru berhasil di-insert dan menunggu approval."
      );
    } catch (err) {
      alert("Proses gagal. Cek server / jaringan.");
    }
  };

  const handleReset = () => {
    setFormData(emptyForm);
  };

  /* ====================== TABLE ====================== */
  const columns = [
    { key: "id_sales", label: "ID SALES" },
    { key: "nik_am", label: "NIK AM" },
    { key: "nama_am", label: "NAMA AM" },
    { key: "tr", label: "REGION" },
    { key: "am_aktif", label: "STATUS AM" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update / Insert Account Manager"
        subtitle="Klik data AM untuk update atau gunakan tombol Insert New AM"
        icon={FaEdit}
      />

      {/* ================= TABLE AM ================= */}
      <Card>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Memuat data...</p>
        ) : (
          <Table columns={columns} data={ams} onRowClick={handleRowClick} />
        )}
      </Card>

      {/* ================= FORM ================= */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">
              {selectedAM ? "Update Data AM" : "Insert New AM"}
            </h3>
            {selectedAM && (
              <p className="text-sm text-neutral-500">
                Editing: <b>{selectedAM.nama_am}</b> ({selectedAM.nik_am})
              </p>
            )}
          </div>

          <Button variant="outline" onClick={handleInsertNew}>
            + Insert New AM
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="No. Telp" id="notel" value={formData.notel} onChange={handleChange} />
            <FormInput label="Email" id="email" value={formData.email} onChange={handleChange} />

            <FormInput label="Level AM" id="level_am" value={formData.level_am} onChange={handleChange} />

            <FormInput
              label="Kel AM"
              id="kel_am"
              value={formData.kel_am}
              onChange={handleChange}
              type="select"
              options={[
                "AM Pro Hire",
                "AM Pro Hire MD",
                "AM SME",
                "AM Organik",
                "AM Organik MD",
              ]}
            />

            <FormInput
              label="Tanggal Aktif"
              id="tgl_aktif"
              type="date"
              value={formData.tgl_aktif}
              onChange={handleChange}
            />

            <FormInput
              label="Update Perpanjangan Kontrak"
              id="update_perpanjangan_kontrak"
              value={formData.update_perpanjangan_kontrak}
              onChange={handleChange}
            />

            <FormInput
              label="Lama Menjadi Pro Hire"
              id="lama_menjadi_pro_hire"
              value={formData.lama_menjadi_pro_hire}
              onChange={handleChange}
            />

            <FormInput
              label="Keterangan Out"
              id="ket_out"
              type="textarea"
              value={formData.ket_out}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>

            <Button type="submit">
              {selectedAM ? "Update & Kirim Validasi" : "Insert & Kirim Validasi"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
