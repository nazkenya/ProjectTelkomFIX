import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaUserTie, FaArrowLeft } from "react-icons/fa";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getAMs } from "../../services/amService";

/* ====================== DUMMY FALLBACK ====================== */
const DUMMY_AMS = [
  {
    ID_SALES: "DUM-001",
    NIK_AM: "111001",
    NAMA_AM: "Andi Pratama",
    WITEL: "WITEL JAKARTA SELATAN",
    TR: "JAKARTA",
    TELKOM_DAERAH: "TELKOM JAKARTA",
    LEVEL_AM: "AM PRO HIRE",
    BP: "B2B",
    KEL_AM: "ENTERPRISE",
    BKO: "YA",
    PSA_LOKASI_KERJA_AM: "Jakarta Selatan",
    AM_AKTIF_POSISI_OKTOBER_2025: "AKTIF",
    NOTEL: "081234567890",
    EMAIL: "andi.pratama@telkom.co.id",
    GENDER: "Laki-laki",
    TGL_LAHIR: "1992-05-12",
    USIA_TAHUN: 32,
    USIA_TAHUN_BULAN: 3,
    KEL_USIA: "30-35",
    LINK_FOTO_AM: "https://i.pravatar.cc/150?img=12",
    PENDIDIKAN: "S1",
    JURUSAN: "Teknik Informatika",
    UNIVERSITAS: "Universitas Indonesia",
    TAHUN_LULUS: "2014",
    SERTIFIKASI_EKSTERNAL: "TOEIC, PMP",
    LINK_EVIDENCE_TRAINING: "-",
    PENGALAMAN_KERJA_NON_TELKOM: "Sales B2B",
    SKILL_BAHASA: "Indonesia, English",
    HOBI: "Bersepeda",
    BAKAT: "Public Speaking",
    NAMA_BANK: "Mandiri",
    NO_REKENING: "1234567890",
    TGL_AKTIF: "2018-01-01",
    MASA_KERJA_TAHUN: 7,
    MASA_KERJA_TAHUN_BULAN: 2,
    KEL_MASA_KERJA: ">5 Tahun",
    TGL_AKTIF_PRO_HIRE: "2021-01-01",
    UPDATE_PERPANJANGAN_KONTRAK: "2024",
    TGL_AKHIR_KONTRAK_PRO_HIRE: "2026-01-01",
    LAMA_MENJADI_PRO_HIRE: "4 Tahun",
    TGL_OUT_SEBAGAI_AM: "-",
    KET_OUT: "-",
    NOMOR_CC: "CC-12345",
    STATUS_CC: "AKTIF",
    KETERANGAN_KERUSAKAN_LAPTOP: "-",
    FASE_LAPTOP: "FASE 2",
    CEK_LAPTOP: "OK",
    LAPTOP: "DELL",
    TGL_TERIMA_LAPTOP: "2022-01-01",
    LINK_BA_LAPTOP_AM: "-",
    BAJU_TELKOM: "ADA",
    SIZE_BAJU: "L",
    SIZE_JAKET: "L",
    KETERANGAN: "-"
  },
];

export default function AMDetail() {
  const [searchParams] = useSearchParams();
  const nikAm = searchParams.get("nik");

  const [am, setAm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const getVal = (key) =>
    am?.[key] ?? am?.[key.toLowerCase()] ?? "-";

  useEffect(() => {
    if (!nikAm) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const FIELDS = Object.keys(DUMMY_AMS[0]);

    getAMs(FIELDS)
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        const found = data.find(
          (r) => String(r.NIK_AM || r.nik_am) === String(nikAm)
        );
        setAm(found || DUMMY_AMS.find((d) => d.NIK_AM === nikAm));
        if (!found) console.warn("Fallback dummy digunakan");
      })
      .catch(() => {
        setAm(DUMMY_AMS.find((d) => d.NIK_AM === nikAm));
      })
      .finally(() => setLoading(false));
  }, [nikAm]);

  if (loading)
    return <p className="text-center py-10">Loading...</p>;

  if (notFound || !am)
    return (
      <div className="text-center py-10">
        <p>Data AM tidak ditemukan</p>
        <Link to="/profile/am">
          <Button variant="outline" className="mt-4">
            <FaArrowLeft className="mr-2" /> Kembali
          </Button>
        </Link>
      </div>
    );

  const Field = ({ label, value }) => (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-800 break-words">{value || "-"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Account Manager"
        subtitle={getVal("NAMA_AM")}
        icon={FaUserTie}
        actions={
          <Link to="/profile/am">
            <Button variant="ghost">
              <FaArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
        }
      />

      {/* PROFILE */}
      <Card className="flex gap-6 items-center">
        <img
          src={getVal("LINK_FOTO_AM")}
          alt={getVal("NAMA_AM")}
          className="w-28 h-28 rounded-full border"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <Field label="ID Sales" value={getVal("ID_SALES")} />
          <Field label="NIK" value={getVal("NIK_AM")} />
          <Field label="Nama AM" value={getVal("NAMA_AM")} />
          <Field label="Level AM" value={getVal("LEVEL_AM")} />
          <Field label="Witel" value={getVal("WITEL")} />
          <Field label="Region" value={getVal("TR")} />
          <Field label="BP" value={getVal("BP")} />
          <Field label="Kelompok AM" value={getVal("KEL_AM")} />
        </div>
      </Card>

      {/* KONTAK */}
      <Card>
        <h3 className="font-semibold mb-4">Kontak & Personal</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Email" value={getVal("EMAIL")} />
          <Field label="No Telp" value={getVal("NOTEL")} />
          <Field label="Gender" value={getVal("GENDER")} />
          <Field label="Tanggal Lahir" value={getVal("TGL_LAHIR")} />
          <Field label="Usia" value={`${getVal("USIA_TAHUN")} th ${getVal("USIA_TAHUN_BULAN")} bln`} />
          <Field label="Kelompok Usia" value={getVal("KEL_USIA")} />
        </div>
      </Card>

      {/* PEKERJAAN */}
      <Card>
        <h3 className="font-semibold mb-4">Status Pekerjaan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="AM Aktif" value={getVal("AM_AKTIF_POSISI_OKTOBER_2025")} />
          <Field label="Tanggal Aktif" value={getVal("TGL_AKTIF")} />
          <Field label="Masa Kerja" value={`${getVal("MASA_KERJA_TAHUN")} th`} />
          <Field label="Pro Hire Aktif" value={getVal("TGL_AKTIF_PRO_HIRE")} />
          <Field label="Akhir Kontrak" value={getVal("TGL_AKHIR_KONTRAK_PRO_HIRE")} />
          <Field label="Lama Pro Hire" value={getVal("LAMA_MENJADI_PRO_HIRE")} />
        </div>
      </Card>

      {/* ASET */}
      <Card>
        <h3 className="font-semibold mb-4">Aset & Fasilitas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Laptop" value={getVal("LAPTOP")} />
          <Field label="Cek Laptop" value={getVal("CEK_LAPTOP")} />
          <Field label="Nomor CC" value={getVal("NOMOR_CC")} />
          <Field label="Status CC" value={getVal("STATUS_CC")} />
          <Field label="Baju Telkom" value={getVal("BAJU_TELKOM")} />
          <Field label="Size Baju" value={getVal("SIZE_BAJU")} />
          <Field label="Size Jaket" value={getVal("SIZE_JAKET")} />
        </div>
      </Card>
    </div>
  );
}
