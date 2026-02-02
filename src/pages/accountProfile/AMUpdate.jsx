import React, { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { FaEdit } from "react-icons/fa";

import { getAMs } from "../../services/amService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* ====================== HELPER: DATE FORMATTER ====================== */
// Mengubah format ISO string (dari DB) ke format YYYY-MM-DD (untuk input type="date")
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Pastikan valid date
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

/* ====================== FORM INPUT COMPONENT ====================== */
function FormInput({ label, id, value, onChange, type = "text", options = [], required = false }) {
  const baseClass =
    "w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={baseClass}
        >
          <option value="">-- Pilih --</option>
          {options.map((o) => (
            <option key={o.value || o} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          rows={3}
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

/* ====================== MAIN PAGE COMPONENT ====================== */
export default function AMUpdate() {
  const [ams, setAms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAM, setSelectedAM] = useState(null);

  // Initial State sesuai dengan Skema Database (Semua field dilowercase untuk JSON standar)
  const emptyForm = {
    // Identitas Utama
    id_sales: "",
    nik_am: "",
    perner_ish_amex_only: "",
    nama_am: "",
    gender: "",
    tgl_lahir: "",
    usia: "",
    usia_thn_bln_hr: "",
    kel_usia: "",
    notel: "",
    email: "",
    link_foto_am: "",

    // Lokasi & Posisi
    witel: "",
    tr: "",
    telda: "",
    loc_kerja_am: "",
    level_am: "",
    bp: "",
    kel_am: "",
    bko: "",
    am_aktif: "Aktif", // Default

    // Pendidikan
    pendidikan: "",
    jurusan: "",
    universitas: "",
    tahun_lulus: "",
    sertf_train_ext: "",
    link_evid_train_ext: "",

    // Keahlian & Personal
    skill_bahasa: "",
    pengalaman_kerja: "",
    hobi: "",
    bakat: "",
    nama_bank: "",
    no_rek: "",

    // Status Kerja & Kontrak
    tgl_aktif: "",
    masa_kerja: "",
    masa_kerja_tbh: "",
    kel_masa_kerja: "",
    tgl_aktif_pro_hire: "",
    perpnjng_pro_hire: "",
    tgl_akhr_pro_hire: "",
    lama_jadi_pro_hire: "",
    tgl_nik_telkm_amex: "",

    // Resign / Keluar
    tgl_out_sebagai_am: "",
    ket_out: "",

    // Aset & Fasilitas
    nomor_cc: "",
    ket_cc: "",
    laptop: "",
    fase_laptop: "",
    cek_laptop: "",
    ket_kerusakan_laptop: "",
    tgl_terima_laptop: "",
    link_ba_laptop_am: "",
    baju_telkom: "",
    size_baju: "",
    size_jaket: "",
    ket_lainnya: "",
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
    
    // Mapping data row ke form state (handle null values)
    const newForm = { ...emptyForm };
    Object.keys(newForm).forEach((key) => {
      // Khusus field tanggal, format dulu
      if (key.includes("tgl_") || key.includes("perpnjng_")) {
        newForm[key] = formatDateForInput(am[key]);
      } else {
        newForm[key] = am[key] || "";
      }
    });
    setFormData(newForm);
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
      // Gunakan nik_am sebagai ID unik (asumsi)
      const url = selectedAM
        ? `${API_BASE}/am/${selectedAM.nik_am}` 
        : `${API_BASE}/am`;
      
      const method = selectedAM ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      alert(selectedAM ? "Data berhasil diupdate!" : "Data baru berhasil disimpan!");
      // Optional: Refresh data table here
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  /* ====================== TABLE COLUMNS ====================== */
  const columns = [
    { key: "nik_am", label: "NIK AM" },
    { key: "nama_am", label: "NAMA AM" },
    { key: "witel", label: "WITEL" },
    { key: "am_aktif", label: "STATUS" },
    { key: "level_am", label: "LEVEL" },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Master Data Account Manager"
        subtitle="Manage data AM (Insert / Update Lengkap)"
        icon={FaEdit}
      />

      {/* ================= TABLE LIST ================= */}
      <Card>
        <div className="max-h-64 overflow-y-auto">
            {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
            ) : (
            <Table columns={columns} data={ams} onRowClick={handleRowClick} />
            )}
        </div>
      </Card>

      {/* ================= FORM INPUT ================= */}
      <Card>
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <h3 className="font-bold text-xl text-gray-800">
              {selectedAM ? "Edit Data AM" : "Input AM Baru"}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedAM ? `Sedang mengedit: ${selectedAM.nama_am}` : "Silakan lengkapi form di bawah ini"}
            </p>
          </div>
          <Button variant="primary" onClick={handleInsertNew}>
            + Buat Baru
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: IDENTITAS PRIBADI */}
          <div>
            <h4 className="font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2">1. Identitas & Kontak</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput label="ID Sales" id="id_sales" value={formData.id_sales} onChange={handleChange} />
              <FormInput label="NIK AM" id="nik_am" value={formData.nik_am} onChange={handleChange} required />
              <FormInput label="Perner ISH/Amex" id="perner_ish_amex_only" value={formData.perner_ish_amex_only} onChange={handleChange} />
              
              <FormInput label="Nama Lengkap" id="nama_am" value={formData.nama_am} onChange={handleChange} required />
              <FormInput 
                label="Gender" 
                id="gender" 
                type="select" 
                options={["L", "P"]} 
                value={formData.gender} 
                onChange={handleChange} 
              />
              <FormInput label="Tgl Lahir" id="tgl_lahir" type="date" value={formData.tgl_lahir} onChange={handleChange} />
              
              <FormInput label="Usia (Angka)" id="usia" type="number" value={formData.usia} onChange={handleChange} />
              <FormInput label="No. Telepon/WA" id="notel" value={formData.notel} onChange={handleChange} />
              <FormInput label="Email" id="email" type="email" value={formData.email} onChange={handleChange} />
              <FormInput label="Link Foto" id="link_foto_am" value={formData.link_foto_am} onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 2: POSISI & LOKASI */}
          <div>
            <h4 className="font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2">2. Posisi & Penempatan</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput label="Witel" id="witel" value={formData.witel} onChange={handleChange} />
              <FormInput label="TR (Region)" id="tr" value={formData.tr} onChange={handleChange} />
              <FormInput label="Telda" id="telda" value={formData.telda} onChange={handleChange} />
              <FormInput label="Lokasi Kerja" id="loc_kerja_am" value={formData.loc_kerja_am} onChange={handleChange} />
              
              <FormInput label="Level AM" id="level_am" value={formData.level_am} onChange={handleChange} />
              <FormInput 
                label="Kelompok AM" 
                id="kel_am" 
                type="select" 
                options={["AM Pro Hire", "AM Organik", "AM SME", "AM BKO"]}
                value={formData.kel_am} 
                onChange={handleChange} 
              />
              <FormInput label="BKO" id="bko" value={formData.bko} onChange={handleChange} />
              <FormInput label="BP" id="bp" value={formData.bp} onChange={handleChange} />
              
              <FormInput 
                label="Status AM" 
                id="am_aktif" 
                type="select" 
                options={["Aktif", "Tidak Aktif", "Resign", "Mutasi"]} 
                value={formData.am_aktif} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* SECTION 3: STATUS KEPEGAWAIAN */}
          <div>
            <h4 className="font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2">3. Status Kepegawaian & Kontrak</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput label="Tgl Aktif" id="tgl_aktif" type="date" value={formData.tgl_aktif} onChange={handleChange} />
              <FormInput label="Masa Kerja" id="masa_kerja" value={formData.masa_kerja} onChange={handleChange} />
              <FormInput label="Tgl Aktif Pro Hire" id="tgl_aktif_pro_hire" type="date" value={formData.tgl_aktif_pro_hire} onChange={handleChange} />
              <FormInput label="Perpanjangan Pro Hire" id="perpnjng_pro_hire" type="date" value={formData.perpnjng_pro_hire} onChange={handleChange} />
              <FormInput label="Akhir Kontrak Pro Hire" id="tgl_akhr_pro_hire" type="date" value={formData.tgl_akhr_pro_hire} onChange={handleChange} />
              <FormInput label="Lama Jadi Pro Hire" id="lama_jadi_pro_hire" value={formData.lama_jadi_pro_hire} onChange={handleChange} />
              <FormInput label="Tgl NIK Telkom/Amex" id="tgl_nik_telkm_amex" type="date" value={formData.tgl_nik_telkm_amex} onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 4: PENDIDIKAN & SKILL */}
          <div>
            <h4 className="font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2">4. Pendidikan & Skill</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Pendidikan Terakhir" id="pendidikan" value={formData.pendidikan} onChange={handleChange} />
              <FormInput label="Jurusan" id="jurusan" value={formData.jurusan} onChange={handleChange} />
              <FormInput label="Universitas" id="universitas" value={formData.universitas} onChange={handleChange} />
              <FormInput label="Tahun Lulus" id="tahun_lulus" value={formData.tahun_lulus} onChange={handleChange} />
              
              <FormInput label="Sertifikasi Training" id="sertf_train_ext" type="textarea" value={formData.sertf_train_ext} onChange={handleChange} />
              <FormInput label="Skill Bahasa" id="skill_bahasa" value={formData.skill_bahasa} onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 5: DATA PRIBADI & KEUANGAN */}
          <div>
            <h4 className="font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2">5. Data Pribadi & Rekening</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput label="Nama Bank" id="nama_bank" value={formData.nama_bank} onChange={handleChange} />
              <FormInput label="No Rekening" id="no_rek" value={formData.no_rek} onChange={handleChange} />
              <FormInput label="Hobi" id="hobi" value={formData.hobi} onChange={handleChange} />
              <FormInput label="Bakat" id="bakat" value={formData.bakat} onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 6: ASET & FASILITAS */}
          <div>
            <h4 className="font-bold text-blue-600 mb-3 border-l-4 border-blue-600 pl-2">6. Aset & Fasilitas (Laptop/Seragam)</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput label="Nomor CC" id="nomor_cc" value={formData.nomor_cc} onChange={handleChange} />
              <FormInput label="Jenis Laptop" id="laptop" value={formData.laptop} onChange={handleChange} />
              <FormInput label="Tgl Terima Laptop" id="tgl_terima_laptop" type="date" value={formData.tgl_terima_laptop} onChange={handleChange} />
              <FormInput label="Kondisi Laptop" id="fase_laptop" value={formData.fase_laptop} onChange={handleChange} />
              <FormInput label="Cek Laptop" id="cek_laptop" value={formData.cek_laptop} onChange={handleChange} />
              <FormInput label="Link BA Laptop" id="link_ba_laptop_am" value={formData.link_ba_laptop_am} onChange={handleChange} />
              
              <FormInput label="Ukuran Baju" id="size_baju" value={formData.size_baju} onChange={handleChange} />
              <FormInput label="Ukuran Jaket" id="size_jaket" value={formData.size_jaket} onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 7: RESIGN / OUT */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-bold text-red-600 mb-3">7. Data Resign / Keluar (Jika Ada)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Tgl Keluar (Out)" id="tgl_out_sebagai_am" type="date" value={formData.tgl_out_sebagai_am} onChange={handleChange} />
              <FormInput label="Keterangan Out" id="ket_out" type="textarea" value={formData.ket_out} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t mt-6">
            <Button type="button" variant="ghost" onClick={() => setFormData(emptyForm)}>
              Reset Form
            </Button>
            <Button type="submit" variant="primary">
              {selectedAM ? "Update Data" : "Simpan Data Baru"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}