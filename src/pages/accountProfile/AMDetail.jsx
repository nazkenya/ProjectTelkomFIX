// src/pages/AMDetail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaUserTie, FaArrowLeft } from "react-icons/fa";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getAMs } from "../../services/amService";

export default function AMDetail() {
  const navigate = useNavigate(); 
  const [searchParams] = useSearchParams();
  const nikAm = searchParams.get("nik");

  const [am, setAm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // helper aman — API lowercase
  const getVal = (key) => am?.[key] ?? "-";

  useEffect(() => {
    if (!nikAm) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const FIELDS = [
      "id_sales",
      "nik_am",
      "nama_am",
      "witel",
      "tr",
      "level_am",
      "bp",
      "kel_am",
      "email",
      "notel",
      "gender",
      "tgl_lahir",
      "usia_tahun",
      "usia_tahun_bulan",
      "kel_usia",
      "link_foto_am",
      "am_aktif",
      "tgl_aktif",
      "tgl_aktif_pro_hire",
      "tgl_akhir_kontrak_pro_hire",
      "lama_menjadi_pro_hire",
      "laptop",
      "cek_laptop",
      "nomor_cc",
      "status_cc",
      "baju_telkom",
      "size_baju",
      "size_jaket",
    ];

    setLoading(true);

    getAMs(FIELDS)
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        const found = data.find(
          (r) => String(r.nik_am) === String(nikAm)
        );

        if (!found) setNotFound(true);
        setAm(found || null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [nikAm]);

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
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <FaArrowLeft className="mr-2" /> Kembali
            </Button>
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
          <Field label="BP" value={getVal("bp")} />
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
              "usia_tahun_bulan"
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
            label="Akhir Kontrak"
            value={getVal("tgl_akhir_kontrak_pro_hire")}
          />
          <Field
            label="Lama Pro Hire"
            value={getVal("lama_menjadi_pro_hire")}
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
          <Field label="Status CC" value={getVal("status_cc")} />
          <Field label="Baju Telkom" value={getVal("baju_telkom")} />
          <Field label="Size Baju" value={getVal("size_baju")} />
          <Field label="Size Jaket" value={getVal("size_jaket")} />
        </div>
      </Card>
    </div>
  );
}
