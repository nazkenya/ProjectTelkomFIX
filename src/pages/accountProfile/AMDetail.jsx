// src/pages/AMDetail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaUserTie, FaArrowLeft,FaEdit } from "react-icons/fa";


import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getAMs } from "../../services/amService";

export default function AMDetail() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const nikAm = searchParams.get("nik");
  const idSales = searchParams.get("idsales");

  const [am, setAm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // helper aman — API lowercase
  const getVal = (key) => am?.[key] ?? "-";

  useEffect(() => {
  if (!nikAm && !idSales) {
    setNotFound(true);
    setLoading(false);
    return;
  }

  const FIELDS = [
    /* PROFILE */
    "link_foto_am",
    "id_sales",
    "nik_am",
    "nama_am",
    "witel",
    "tr",
    "level_am",
    "loc_kerja_am",
    "telda",
    "kel_am",

    /* KONTAK & PERSONAL */
    "email",
    "notel",
    "gender",
    "tgl_lahir",
    "usia_thn_bln_hr",
    "kel_usia",

    /* STATUS PEKERJAAN */
    "am_aktif",
    "tgl_aktif",
    "tgl_akhr_pro_hire",
    "tgl_aktif_pro_hire",
    "lama_jadi_pro_hire",
    "tgl_out_sebagai_am",
    "ket_out",

    /* ASET & FASILITAS */
    "laptop",
    "cek_laptop",
    "nomor_cc",
    "ket_cc",
    "baju_telkom",
    "size_baju",
    "size_jaket",

    /* INFORMASI PENDIDIKAN */
    "pendidikan",
    "jurusan",
    "universitas",
    "tahun_lulus",

    /* INFORMASI TAMBAHAN */
    "sertf_train_ext",
    "link_evid_train_ext",
    "hobi",
    "bakat",
    "perner_ish_amex_only",
    "tgl_nik_telkom_amex",
    "last_update"
  ];

  setLoading(true);
  setNotFound(false);

  getAMs(FIELDS)
    .then((res) => {
      const data = Array.isArray(res?.data) ? res.data : [];

      const found = data.find((r) => {
        if (nikAm) {
          return String(r.nik_am) === String(nikAm);
        }
        if (idSales) {
          return String(r.id_sales) === String(idSales);
        }
        return false;
      });

      if (!found) {
        setNotFound(true);
        setAm(null);
      } else {
        setAm(found);
      }
    })
    .catch(() => {
      setNotFound(true);
      setAm(null);
    })
    .finally(() => setLoading(false));
}, [nikAm, idSales]);


  if (loading)
    return <p className="text-center py-10">Loading...</p>;

  if (notFound || !am)
    return (
      <div className="text-center py-10">
        <p>Data AM tidak ditemukan</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Kembali
        </Button>
      </div>
    );

  const Field = ({ label, value }) => (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-800 break-words">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
          title="Detail Account Manager"
          subtitle={getVal("nama_am")}
          icon={FaUserTie}
        right={
          <div className="flex gap-2">
            {/* BUTTON UPDATE*/}
            <Button 
              variant="outline" 
              onClick={() => navigate(`/profile/am/update?idsales=${idSales}`)}
            >
              <FaEdit className="mr-2" /> Update
            </Button>
            
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <FaArrowLeft className="mr-2" /> Kembali
            </Button>
          </div>
        }
      />

      {/* PROFILE */}
      <Card className="flex gap-6 items-center">
        <img
          src={getVal("link_foto_am")}
          alt={getVal("nama_am")}
          className="w-28 h-28 rounded-full border object-cover"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <Field label="ID Sales" value={getVal("id_sales")} />
          <Field label="NIK" value={getVal("nik_am")} />
          <Field label="Nama AM" value={getVal("nama_am")} />
          <Field label="Level AM" value={getVal("level_am")} />
          <Field label="Witel" value={getVal("witel")} />
          <Field label="Region" value={getVal("tr")} />
          <Field label="Lokasi Kerja AM" value={getVal("loc_kerja_am")} />
          <Field label="Telda" value={getVal("telda")} />
          <Field label="Kelompok AM" value={getVal("kel_am")} />
        </div>
      </Card>

      {/* KONTAK */}
      <Card>
        <h3 className="font-semibold mb-4">Kontak & Personal</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Email" value={getVal("email")} />
          <Field label="No Telp" value={getVal("notel")} />
          <Field label="Gender" value={getVal("gender")} />
          <Field label="Tanggal Lahir" value={getVal("tgl_lahir")} />
          <Field
            label="Usia"
            value={`${getVal("NULL")} ${getVal(
              "usia_thn_bln_hr"
            )} `}
          />
          <Field label="Kelompok Usia" value={getVal("kel_usia")} />
        </div>
      </Card>

      {/* STATUS */}
      <Card>
        <h3 className="font-semibold mb-4">Status Pekerjaan</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="AM Aktif" value={getVal("am_aktif")} />
          <Field label="Tanggal Aktif" value={getVal("tgl_aktif")} />
          <Field
            label="Pro Hire Aktif"
            value={getVal("tgl_aktif_pro_hire")}
          />
          <Field
            label="Akhir Kontrak Pro Hire"
            value={getVal("tgl_akhr_pro_hire")}
          />
          <Field
            label="Lama Pro Hire"
            value={getVal("lama_jadi_pro_hire")}
          />
          <Field
            label="Perpanjangan Pro Hire"
            value={getVal("perpnjng_pro_hire")}
          />
          <Field
            label="Tanggal Keluar AM"
            value={getVal("tgl_out_sebagai_am")}
          />
          <Field
            label="Keterangan Keluar AM"
            value={getVal("ket_out")}
          />
        </div>
      </Card>

      {/* ASET */}
      <Card>
        <h3 className="font-semibold mb-4">Aset & Fasilitas</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Laptop" value={getVal("laptop")} />
          <Field label="Cek Laptop" value={getVal("cek_laptop")} />
          <Field label="Nomor CC" value={getVal("nomor_cc")} />
          <Field label="Status CC" value={getVal("ket_cc")} />
          <Field label="Baju Telkom" value={getVal("baju_telkom")} />
          <Field label="Size Baju" value={getVal("size_baju")} />
          <Field label="Size Jaket" value={getVal("size_jaket")} />
        </div>
      </Card>

      {/* INFORMASI PENDIDIKAN */}
      <Card>
        <h3 className="font-semibold mb-4">Informasi Pendidikan</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Pendidikan Terakhir" value={getVal("pendidikan")} />
          <Field label="Jurusan" value={getVal("jurusan")} />
          <Field label="Nama Universitas" value={getVal("universitas")} />
          <Field label="Tahun Lulus" value={getVal("tahun_lulus")} />
        </div>
      </Card>

            {/* INFORMASI TAMBAHAN */}
      <Card>
        <h3 className="font-semibold mb-4">Informasi Tambahan</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Sertifikat Training Eksternal" value={getVal("sertf_train_ext")} />
          <Field label="Link Evidensi Training Eksternal" value={getVal("link_evid_train_ext")} />
          <Field label="Hobi" value={getVal("hobi")} />
          <Field label="Bakat" value={getVal("bakat")} />
          <Field label="No perner ISH AMEX Only" value={getVal("perner_ish_amex_only")} />
          <Field label="Tanggal NIK Telkom AMEX" value={getVal("tgl_nik_telkom_amex")} />
          <Field label="Last Update" value={getVal("last_update")} />
        </div>
      </Card>
    </div>
  );
}