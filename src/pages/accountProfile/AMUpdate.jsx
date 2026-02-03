import React, { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { FaEdit } from "react-icons/fa";
import { useMessage } from "../../components/ui/GlobalMessage";
import { getAMs, updateAM } from "../../services/amService";
import { formatDate } from "../../utils/date";

/* ====================== FORM INPUT ====================== */
function FormInput({ label, id, value, onChange, type = "text", options = [] }) {
  const baseClass =
    "w-full px-4 py-2.5 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
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
  const { showMessage } = useMessage();
  const confirmAction = (title, message, onConfirm) => {
    showMessage({ type: "confirm", title, message, onConfirm });
  };

  const [ams, setAms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAM, setSelectedAM] = useState(null);

  // HILANGKAN SPASI DI SEMUA VALUES!
  const emptyForm = {
    perner_ish_amex_only: "",
    tgl_nik_telkm_amex: "",
    id_sales: "",
    nik_am: "",
    nama_am: "",
    notel: "",
    email: "",
    level_am: "",
    kel_am: "",
    tr: "",
    witel: "",
    bp: "",
    bko: "",
    tgl_aktif: "",
    am_aktif: "",
    telda: "",
    loc_kerja_am: "",
    gender: "",
    tgl_lahir: "",
    usia: "",
    masa_kerja: "",
    tgl_aktif_pro_hire: "",
    tgl_akhr_pro_hire: "",
    perpnjng_pro_hire: "",
    tgl_out_sebagai_am: "",
    ket_out: "",
    pendidikan: "",
    jurusan: "",
    universitas: "",
    tahun_lulus: "",
    laptop: "",
    cek_laptop: "",
    fase_laptop: "",
    ket_kerusakan_laptop: "",
    tgl_terima_laptop: "",
    link_ba_laptop: "",
    nomor_cc: "",
    ket_cc: "",
    baju_telkom: "",
    size_baju: "",
    size_jaket: "",
    sertf_train_ext: "",
    link_evid_train_ext: "",
    hobi: "",
    bakat: "",
    pengalaman_kerja: "",
    skill_bahasa: "",
    nama_bank: "",
    no_rek: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  /* ====================== LOAD DATA ====================== */
  useEffect(() => {
    getAMs()
      .then((res) => setAms(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setAms([]))
      .finally(() => setLoading(false));
  }, []);

  /* ====================== HANDLERS ====================== */
  const handleRowClick = (am) => {
    setSelectedAM(am);

    const formatted = {};
    Object.keys(emptyForm).forEach((key) => {
      if (am[key] && typeof am[key] === "string" && am[key].includes("-")) {
        formatted[key] = formatDate(am[key]);
      } else {
        formatted[key] = am[key] || "";
      }
    });

    setFormData({ ...emptyForm, ...formatted });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleReset = () => {
    confirmAction("Reset Form", "Yakin ingin mengosongkan form update?", () =>
      setFormData(emptyForm)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAM) {
      showMessage({
        type: "error",
        title: "Pilih Data Dulu",
        message: "Klik salah satu AM dari tabel sebelum update",
      });
      return;
    }

    // Validasi minimal field
    if (!formData.nama_am || !formData.id_sales) {
      showMessage({
        type: "error",
        title: "Data Tidak Lengkap",
        message: "Nama AM dan ID Sales harus diisi",
      });
      return;
    }

    const id = selectedAM.id_sales || selectedAM.nik_am;

    confirmAction(
      "Konfirmasi Update",
      `Yakin ingin update data AM ${selectedAM.nama_am}?`,
      async () => {
        try {
          console.log("🚀 Data yang akan diupdate:", formData);

          const response = await updateAM(id, formData);

          console.log("✅ Response update:", response);

          showMessage({
            type: "success",
            title: "Update Berhasil",
            message: "Data AM berhasil di-update ✅",
          });

          // Reset form setelah berhasil
          setFormData(emptyForm);
          setSelectedAM(null);
        } catch (err) {
          console.error("❌ Error update:", err);

          const errorMessage =
            err.response?.data?.message || err.message || "Gagal update data";

          showMessage({
            type: "error",
            title: "Gagal Update",
            message: errorMessage,
          });
        }
      }
    );
  };

  // HILANGKAN SPASI DI COLUMN KEYS!
  const columns = [
    { key: "id_sales", label: "ID SALES" },
    { key: "nik_am", label: "NIK AM" },
    { key: "nama_am", label: "NAMA AM" },
    { key: "tr", label: "REGION" },
    { key: "am_aktif", label: "STATUS AM" },
  ];

  return (
    <div>
      <PageHeader
        title="Update Account Manager"
        subtitle="Klik dan cari data AM untuk update"
        icon={FaEdit}
      />

      <Card>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Memuat data...</p>
        ) : (
          <Table columns={columns} data={ams} onRowClick={handleRowClick} />
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Update Data AM</h3>
            {selectedAM && (
              <p className="text-sm text-neutral-500">
                Editing: <b>{selectedAM.nama_am}</b> (NIK: {selectedAM.nik_am}) (ID SALES: {selectedAM.id_sales})
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IDENTITAS & STATUS KERJA */}
            <FormInput
              label="No Perner ISH AMEX"
              id="perner_ish_amex_only"
              value={formData.perner_ish_amex_only}
              onChange={handleChange}
            />
            <FormInput
              label="Tanggal NIK Telkom AMEX"
              id="tgl_nik_telkm_amex"
              type="date"
              value={formData.tgl_nik_telkm_amex}
              onChange={handleChange}
            />
            <FormInput
              label="ID Sales"
              id="id_sales"
              value={formData.id_sales}
              onChange={handleChange}
            />
            <FormInput
              label="NIK AM"
              id="nik_am"
              value={formData.nik_am}
              onChange={handleChange}
            />
            <FormInput
              label="Nama AM"
              id="nama_am"
              value={formData.nama_am}
              onChange={handleChange}
            />
            <FormInput
              label="No. Telp"
              id="notel"
              type="text"
              value={formData.notel}
              onChange={handleChange}
            />
            <FormInput
              label="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormInput
              label="Level AM"
              id="level_am"
              value={formData.level_am}
              onChange={handleChange}
            />
            <FormInput
              label="Kel AM"
              id="kel_am"
              value={formData.kel_am}
              onChange={handleChange}
              type="select"
              options={["", "AM Pro Hire", "AM SME", "AM Organik", "AM Organik MD"]}
            />
            <FormInput
              label="BP"
              id="bp"
              type="number"
              value={formData.bp}
              onChange={handleChange}
            />
            <FormInput
              label="BKO"
              id="bko"
              value={formData.bko}
              onChange={handleChange}
              type="select"
              options={["", "BKO AM", "BKO NON AM", "BKO"]}
            />
            <FormInput
              label="Witel"
              id="witel"
              value={formData.witel}
              onChange={handleChange}
            />
            <FormInput
              label="Regional"
              id="tr"
              value={formData.tr}
              onChange={handleChange}
              type="select"
              options={["", "TR1", "TR2", "TR3", "TR4", "TR5"]}
            />
            <FormInput
              label="Telda"
              id="telda"
              value={formData.telda}
              onChange={handleChange}
            />
            <FormInput
              label="Lokasi Kerja AM"
              id="loc_kerja_am"
              value={formData.loc_kerja_am}
              onChange={handleChange}
            />
            <FormInput
              label="Gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
            />
            <FormInput
              label="Tanggal Lahir"
              id="tgl_lahir"
              type="date"
              value={formData.tgl_lahir}
              onChange={handleChange}
            />
            <FormInput
              label="Usia"
              id="usia"
              type="number"
              value={formData.usia}
              onChange={handleChange}
            />
            <FormInput
              label="Tanggal AM Aktif"
              id="tgl_aktif"
              type="date"
              value={formData.tgl_aktif}
              onChange={handleChange}
            />
            <FormInput
              label="Status AM"
              id="am_aktif"
              value={formData.am_aktif}
              onChange={handleChange}
              type="select"
              options={["", "AKTIF", "NON AKTIF"]}
            />
            <FormInput
              label="Tanggal Out AM"
              id="tgl_out_sebagai_am"
              type="date"
              value={formData.tgl_out_sebagai_am}
              onChange={handleChange}
            />
            <FormInput
              label="Keterangan AM OUT"
              id="ket_out"
              value={formData.ket_out}
              onChange={handleChange}
            />
            <FormInput
              label="Tanggal Aktif Pro Hire"
              id="tgl_aktif_pro_hire"
              type="date"
              value={formData.tgl_aktif_pro_hire}
              onChange={handleChange}
            />
            <FormInput
              label="Update Perpanjangan Kontrak"
              id="perpnjng_pro_hire"
              type="date"
              value={formData.perpnjng_pro_hire}
              onChange={handleChange}
            />
            <FormInput
              label="Tanggal Akhir Pro Hire"
              id="tgl_akhr_pro_hire"
              type="date"
              value={formData.tgl_akhr_pro_hire}
              onChange={handleChange}
            />

            {/* PENDIDIKAN */}
            <FormInput
              label="Pendidikan Terakhir"
              id="pendidikan"
              value={formData.pendidikan}
              onChange={handleChange}
            />
            <FormInput
              label="Jurusan"
              id="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
            />
            <FormInput
              label="Nama Universitas"
              id="universitas"
              value={formData.universitas}
              onChange={handleChange}
            />
            <FormInput
              label="Tahun Lulus"
              id="tahun_lulus"
              type="number"
              value={formData.tahun_lulus}
              onChange={handleChange}
            />

            {/* ATRIBUT & ASET */}
            <FormInput
              label="Laptop"
              id="laptop"
              value={formData.laptop}
              onChange={handleChange}
            />
            <FormInput
              label="CEK Laptop"
              id="cek_laptop"
              value={formData.cek_laptop}
              onChange={handleChange}
              type="select"
              options={["", "DONE"]}
            />
            <FormInput
              label="Fase Laptop"
              id="fase_laptop"
              value={formData.fase_laptop}
              onChange={handleChange}
            />
            <FormInput
              label="Keterangan Kerusakan Laptop"
              id="ket_kerusakan_laptop"
              value={formData.ket_kerusakan_laptop}
              onChange={handleChange}
            />
            <FormInput
              label="Tanggal Terima Laptop"
              id="tgl_terima_laptop"
              type="date"
              value={formData.tgl_terima_laptop}
              onChange={handleChange}
            />
            <FormInput
              label="Link BA Laptop"
              id="link_ba_laptop"
              value={formData.link_ba_laptop}
              onChange={handleChange}
            />
            <FormInput
              label="Nomor CC"
              id="nomor_cc"
              value={formData.nomor_cc}
              onChange={handleChange}
            />
            <FormInput
              label="Keterangan CC"
              id="ket_cc"
              value={formData.ket_cc}
              onChange={handleChange}
            />
            <FormInput
              label="Baju Telkom"
              id="baju_telkom"
              value={formData.baju_telkom}
              onChange={handleChange}
            />
            <FormInput
              label="Size Baju"
              id="size_baju"
              value={formData.size_baju}
              onChange={handleChange}
              type="select"
              options={["", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]}
            />
            <FormInput
              label="Size Jaket"
              id="size_jaket"
              value={formData.size_jaket}
              onChange={handleChange}
              type="select"
              options={["", "S", "M", "L", "XL", "XXL", "XXXL"]}
            />

            {/* LINK & EXPERIENCE/INFORMASI LAINNYA */}
            <FormInput
              label="Sertifikat Training Eksternal"
              id="sertf_train_ext"
              value={formData.sertf_train_ext}
              onChange={handleChange}
            />
            <FormInput
              label="Link Evidensi Training Eksternal"
              id="link_evid_train_ext"
              value={formData.link_evid_train_ext}
              onChange={handleChange}
            />
            <FormInput
              label="Hobi"
              id="hobi"
              value={formData.hobi}
              onChange={handleChange}
            />
            <FormInput
              label="Bakat"
              id="bakat"
              value={formData.bakat}
              onChange={handleChange}
            />
            <FormInput
              label="Pengalaman Kerja"
              id="pengalaman_kerja"
              type="textarea"
              value={formData.pengalaman_kerja}
              onChange={handleChange}
            />
            <FormInput
              label="Skill Bahasa"
              id="skill_bahasa"
              value={formData.skill_bahasa}
              onChange={handleChange}
            />
            <FormInput
              label="Nama Bank"
              id="nama_bank"
              value={formData.nama_bank}
              onChange={handleChange}
            />
            <FormInput
              label="No. Rekening"
              id="no_rek"
              type="text"
              value={formData.no_rek}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Update Data AM</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}