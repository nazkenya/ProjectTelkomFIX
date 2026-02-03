import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useMessage } from "../../components/ui/GlobalMessage";

import { getAMs, createAM } from "../../services/amService";

/* ================= FORM INPUT ================= */
function FormInput({ label, id, value, onChange, type = "text", options = [], disabled }) {
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
          disabled={disabled}
        >
          <option value="">-- Pilih {label} --</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          type={type}
          className={baseClass}
          disabled={disabled}
        />
      )}
    </div>
  );
}

/* ================= AUTO ID SALES SME ================= */
function generateNextIdSalesSME(ams) {
  const smeIds = ams
    .filter(
      (a) =>
        a.kel_am === "AM SME" &&
        typeof a.id_sales === "string" &&
        /^A\d{5}$/.test(a.id_sales)
    )
    .map((a) => parseInt(a.id_sales.substring(1), 10));

  const max = smeIds.length ? Math.max(...smeIds) : 0;
  return `A${String(max + 1).padStart(5, "0")}`;
}

export default function AMInsert() {
  const navigate = useNavigate();
  const [ams, setAms] = useState([]);
    const initialForm = {
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
    bp : "",
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
    link_ba_laptop_am: "",
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

const [formData, setFormData] = useState(initialForm);
const { showMessage } = useMessage();

const confirmAction = (title, message, onConfirm) => {
  showMessage({
    type: "confirm",
    title,
    message,
    onConfirm,
  });
};


  /* ===== LOAD DATA AM UNTUK GENERATE ID SME ===== */
  useEffect(() => {
    getAMs().then((res) => setAms(res.data));
  }, []);

  /* ===== AUTO ID SALES ===== */
  useEffect(() => {
    if (formData.kel_am === "AM SME") {
      setFormData((p) => ({
        ...p,
        id_sales: generateNextIdSalesSME(ams),
      }));
      return;
    }

    if (
      ["AM Pro Hire", "AM Organik", "AM Organik MD"].includes(formData.kel_am)
    ) {
      setFormData((p) => ({
        ...p,
        id_sales: p.nik_am || "",
      }));
    }
  }, [formData.kel_am, formData.nik_am, ams]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

const fieldLabels = {
  // IDENTITAS & STATUS KERJA
  perner_ish_amex_only: "No Perner ISH AMEX",
  tgl_nik_telkm_amex: "Tanggal NIK Telkom AMEX",
  id_sales: "ID Sales",
  nik_am: "NIK AM",
  nama_am: "Nama AM",
  notel: "No. Telp",
  email: "Email",
  kel_am: "Kel AM",
  bp: "BP",
  bko: "BKO",
  witel: "Witel",
  tr: "Regional",
  telda: "Telda",
  loc_kerja_am: "Lokasi Kerja AM",
  gender: "Gender",
  tgl_lahir: "Tanggal Lahir",
  usia: "Usia",
  tgl_aktif: "Tanggal Aktif",
  am_aktif: "Status AM",
  tgl_out_sebagai_am: "Tanggal Out AM",
  ket_out: "Keterangan AM OUT",
  tgl_aktif_pro_hire: "Tanggal Aktif Pro Hire",
  perpanjng_pro_hire: "Update Perpanjangan Kontrak",
  tgl_akhr_pro_hire: "Tanggal Akhir Pro Hire",

  // PENDIDIKAN
  pendidikan: "Pendidikan Terakhir",
  jurusan: "Jurusan",
  universitas: "Nama Universitas",
  tahun_lulus: "Tahun Lulus",

  // INVENTARIS & FASILITAS
  laptop: "Laptop",
  cek_laptop: "Cek Laptop",
  fase_laptop: "Fase Laptop",
  ket_kerusakan_laptop: "Keterangan Kerusakan Laptop",
  tgl_terima_laptop: "Tanggal Terima Laptop",
  link_ba_laptop_am: "Link BA Laptop",
  nomor_cc: "Nomor CC",
  ket_cc: "Keterangan CC",
  baju_telkom: "Baju Telkom",
  size_baju: "Size Baju",
  size_jaket: "Size Jaket",

  // LINK & EXPERIENCE
  sertf_train_ext: "Sertifikat Training Eksternal",
  link_evid_train_ext: "Link Evidensi Training Eksternal",
  hobi: "Hobi",
  bakat: "Bakat",
  pengalaman_kerja: "Pengalaman Kerja",
  skill_bahasa: "Skill Bahasa",
  nama_bank: "Nama Bank",
  no_rek: "No. Rekening",
};

const handleReset = () => {
  const filledFields = Object.entries(formData)
    .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => {
      const label = fieldLabels[key] || key;
      return `• ${label} : ${value}`;
    });

  if (filledFields.length === 0) {
    showMessage({
      type: "info",
      title: "Form Masih Kosong",
      message: "Belum ada data yang diisi untuk di-reset.",
    });
    return;
  }

  confirmAction(
    "Reset Form",
    `Data berikut akan dihapus:\n\n${filledFields.join("\n")}`,
    () => {
      setFormData(initialForm);
      showMessage({
        type: "success",
        title: "Berhasil",
        message: "Form berhasil dikosongkan.",
      });
    }
  );
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.id_sales) {
    showMessage({
      type: "error",
      title: "Gagal",
      message: "ID Sales belum terbentuk.",
    });
    return;
  }

  confirmAction(
    "Konfirmasi Tambah AM",
    `
        NIK AM   : ${formData.nik_am}
        ID Sales : ${formData.id_sales}
        Nama AM  : ${formData.nama_am}
        Tanggal Lahir : ${formData.tgl_lahir}
        Usia     : ${formData.usia}
        Regional : ${formData.tr}
        Witel    : ${formData.witel}
        Telda    : ${formData.telda}
        lokasi Kerja AM : ${formData.loc_kerja_am}
        Kel AM   : ${formData.kel_am}
        Status AM  : ${formData.am_aktif}

    `,
    async () => {
      try {
        await createAM(formData);
        showMessage({
          type: "success",
          title: "Berhasil",
          message: "Data AM berhasil ditambahkan.",
        });
        navigate("/profile/am");
      } catch {
        showMessage({
          type: "error",
          title: "Gagal",
          message: "Terjadi kesalahan saat menyimpan data.",
        });
      }
    }
  );
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <PageHeader
        title="Add New Account Manager"
        subtitle={formData.nama_am || "-"}
        right={
            <Button type="button" variant="green" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mr-2" /> Kembali
            </Button>
        }
        />

        <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* IDENTITAS & STATUS KERJA*/}
            <FormInput label="No Perner ISH AMEX" id="perner_ish_amex_only" value={formData.perner_ish_amex_only} onChange={handleChange}/>
            <FormInput label="Tanggal NIK Telkom AMEX" id="tgl_nik_telkm_amex" type="date" value={formData.tgl_nik_telkm_amex} onChange={handleChange}/>
            <FormInput label="ID Sales" id="id_sales" value={formData.id_sales} disabled/>
            <FormInput label="NIK AM" id="nik_am" value={formData.nik_am} onChange={handleChange}/>
            <FormInput label="Nama AM" id="nama_am" value={formData.nama_am} onChange={handleChange}/>
            <FormInput label="No Telp" id="notel" type="text" value={formData.notel} onChange={handleChange}/>
            <FormInput label="Email" id="email" value={formData.email} onChange={handleChange}/>
            <FormInput label="Level AM" id="level_am" value={formData.level_am} onChange={handleChange}/>

            <FormInput
            label="Kel AM"
            id="kel_am"
            value={formData.kel_am}
            onChange={handleChange}
            type="select"
            options={["AM SME","AM Pro Hire","AM Organik","AM Organik MD"]}
            />

            <FormInput
            label="BP"
            id="bp"
            value={formData.bp}
            onChange={handleChange}
            type="select"
            options={["null","1","2","3","4","5","6","7"]}
            />

            <FormInput
              label="BKO"
              id="bko"
              value={formData.bko}
              onChange={handleChange}
              type="select"
              options={[
                "null",
                "BKO AM",
                "BKO NON AM",
                "BKO",
              ]}
            />
            <FormInput label="Witel" id="witel" value={formData.witel} onChange={handleChange}/>
            <FormInput
              label="Regional"
              id="tr"
              value={formData.tr}
              onChange={handleChange}
              type="select"
              options={[
                "null",
                "TR1",
                "TR2",
                "TR3",
                "TR4",
                "TR5",
              ]}
            />
            <FormInput label="Telda" id="telda" value={formData.telda} onChange={handleChange}/>
            <FormInput label="Lokasi Kerja" id="loc_kerja_am" value={formData.loc_kerja_am} onChange={handleChange}/>
            <FormInput
              label="Gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              type="select"
              options={[
                "L",
                "P",
              ]}
            />

            <FormInput
              label="Tanggal Lahir"
              id="tgl_lahir"
              type="date"
              value={formData.tgl_lahir}
              onChange={handleChange}
            />

            <FormInput label="Usia" id="usia" type="number" value={formData.usia} onChange={handleChange}/>
            
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
              options={[
                "AKTIF",
                "NON AKTIF",
              ]}
            />

            <FormInput
              label="Tanggal Out AM"
              id="tgl_out_sebagai_am"
              type="date"
              value={formData.tgl_out_sebagai_am}
              onChange={handleChange}
            />

            <FormInput label="Keterangan Out" id="ket_out" value={formData.ket_out} onChange={handleChange}/>
            <FormInput
              label="Tanggal Aktif Pro Hire"
              id="tgl_aktif_pro_hire"
              type="date"
              value={formData.tgl_aktif_pro_hire}
              onChange={handleChange}
            />

            <FormInput
              label="Update Perpanjangan Kontrak"
              id="perpanjng_pro_hire"
              type="date"
              value={formData.perpanjng_pro_hire}
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
            <FormInput label="Pendidikan" id="pendidikan" value={formData.pendidikan} onChange={handleChange}/>
            <FormInput label="Jurusan" id="jurusan" value={formData.jurusan} onChange={handleChange}/>
            <FormInput label="Universitas" id="universitas" value={formData.universitas} onChange={handleChange}/>
            <FormInput label="Tahun Lulus" id="tahun_lulus" type="number" value={formData.tahun_lulus} onChange={handleChange}/>

            {/* ASET */}
            <FormInput label="Laptop" id="laptop" value={formData.laptop} onChange={handleChange}/>
            <FormInput
              label="CEK Laptop"
              id="cek_laptop"
              value={formData.cek_laptop}
              onChange={handleChange}
              type="select"
              options={[
                 "null",
                "DONE",
               
              ]}
            />  

            <FormInput label="Fase Laptop" id="fase_laptop" value={formData.fase_laptop} onChange={handleChange}/>
            <FormInput label="Ket Kerusakan Laptop" id="ket_kerusakan_laptop" value={formData.ket_kerusakan_laptop} onChange={handleChange}/>
            
            <FormInput
              label="Tanggal Terima Laptop"
              id="tgl_terima_laptop"
              type="date"
              value={formData.tgl_terima_laptop}
              onChange={handleChange}
            />

            <FormInput label="Link BA Laptop" id="link_ba_laptop_am" value={formData.link_ba_laptop_am} onChange={handleChange}/>
            <FormInput label="Nomor CC" id="nomor_cc" value={formData.nomor_cc} onChange={handleChange}/>
            <FormInput 
            label="Ket CC" 
            id="ket_cc" 
            value={formData.ket_cc} 
            onChange={handleChange}
            type="select"
            options={[
              "null",
              "AKTIF",
              "NONAKTIF",
               ]}
            />
            <FormInput 
            label="Baju Telkom" 
            id="baju_telkom" 
            value={formData.baju_telkom} 
            onChange={handleChange}
            type="select"
            options={[
              "null",
              "SUDAH DAPAT",
              "BELUM DAPAT",
              "AM ORGANIK",
              "AM PRO HIRE",
              "RESIHGN",
            ]}
            />
            
            <FormInput label="Size Baju" 
            id="size_baju" 
            value={formData.size_baju} 
            onChange={handleChange}
            type="select"
            options={[
              "null",
              "XS",
              "S",
              "M",
              "L",
              "XL",
              "XXL",
              "XXXL",
            ]}
            />

            <FormInput label="Size Jaket" 
            id="size_jaket" 
            value={formData.size_jaket} 
            onChange={handleChange}
            type="select"
            options={[
              "null",
              "S",
              "M",
              "L",
              "XL",
              "XXL",
              "XXXL",
            ]}
            />

            {/* LAINNYA */}
            <FormInput label="Sertifikat Training" id="sertf_train_ext" value={formData.sertf_train_ext} onChange={handleChange}/>
            <FormInput label="Link Evidensi" id="link_evid_train_ext" value={formData.link_evid_train_ext} onChange={handleChange}/>
            <FormInput label="Hobi" id="hobi" value={formData.hobi} onChange={handleChange}/>
            <FormInput label="Bakat" id="bakat" value={formData.bakat} onChange={handleChange}/>
            <FormInput label="Pengalaman Kerja" id="pengalaman_kerja" type="textarea" value={formData.pengalaman_kerja} onChange={handleChange}/>
            <FormInput label="Skill Bahasa" id="skill_bahasa" value={formData.skill_bahasa} onChange={handleChange}/>
            <FormInput label="Nama Bank" id="nama_bank" value={formData.nama_bank} onChange={handleChange}/>
            <FormInput label="No Rekening" id="no_rek" type= "number" value={formData.no_rek} onChange={handleChange}/>

        </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>

            <Button type="submit">
              Tambah data AM
            </Button>
        </div>
        </Card>
    </form>
    );
}
