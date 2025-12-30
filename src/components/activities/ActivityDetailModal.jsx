import React, { useState, useRef } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Badge } from '../ui/Badge'
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaTag,
  FaFileAlt,
  FaImage,
  FaCheckCircle,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa'

export default function ActivityDetailModal({ open, onClose, activity, onUpdate, onDelete }) {
  const [proof, setProof] = useState(activity.proof)
  const [mom, setMom] = useState(activity.mom)
  const proofInputRef = useRef(null)
  const momInputRef = useRef(null)

  const activityDateTime = new Date(`${activity.date}T${activity.time}`)
  const now = new Date()
  
  // Cek apakah aktivitas sudah lewat
  const isPast = activityDateTime < now
  
  // Cek apakah status completed
  const isCompleted = activity.status === 'completed'

  // Hitung selisih hari untuk batasan edit 7 hari
  const diffTime = Math.abs(now - activityDateTime)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const isWithin7Days = diffDays <= 7

  // User bisa edit jika: Aktivitas sudah lewat, memerlukan bukti (withCustomer), dan masih dalam periode 7 hari
  const canEditDocs = isPast && activity.withCustomer && isWithin7Days

  // Section dokumentasi muncul jika: Aktivitas sudah lewat & withCustomer
  const showDocSection = isPast && activity.withCustomer

  const handleFileRead = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleProofChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileData = await handleFileRead(file)
      setProof(fileData)
    }
    e.target.value = ''
  }

  const handleMomChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileData = await handleFileRead(file)
      setMom(fileData)
    }
    e.target.value = ''
  }

  const handleSaveProofAndMom = () => {
    onUpdate({
      ...activity,
      proof,
      mom,
      status: 'completed',
    })
  }

  const handleMarkComplete = () => {
    onUpdate({
      ...activity,
      status: 'completed',
    })
  }

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
      onDelete(activity.id)
    }
  }

  // Helper untuk merender kotak file (agar kodenya rapi)
  const renderFileBox = (title, fileData, inputRef, onFileChange, acceptType, icon) => {
    const Icon = icon
    return (
      <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <Icon className="text-neutral-400" />
          {title}
        </div>
        
        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptType}
          className="hidden"
          onChange={onFileChange}
          disabled={!canEditDocs}
        />

        {!fileData ? (
          // KONDISI 1: Belum ada file
          canEditDocs ? (
            <Button
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 w-full justify-center border-dashed"
            >
              <Icon />
              Upload {title}
            </Button>
          ) : (
            <div className="text-xs text-neutral-400 italic p-2 text-center border border-neutral-200 rounded bg-neutral-100">
              Tidak ada file (Batas waktu upload habis)
            </div>
          )
        ) : (
          // KONDISI 2: Sudah ada file (Tampilkan Preview)
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
            {fileData.type?.startsWith('image/') ? (
              <img src={fileData.dataUrl} alt="Proof" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <FaFileAlt className="h-10 w-10 text-neutral-400" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">{fileData.name}</p>
              <p className="text-xs text-neutral-500">{(fileData.size / 1024).toFixed(2)} KB</p>
            </div>

            {/* Tombol Edit hanya muncul jika masih dalam 7 hari */}
            {canEditDocs && (
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
                  Ganti
                </Button>
                <Button variant="danger" size="sm" onClick={() => title.includes('Bukti') ? setProof(null) : setMom(null)}>
                  Hapus
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detail Aktivitas"
      panelClassName="max-w-3xl"
      footer={
        <div className="flex gap-3 justify-between">
          <Button variant="danger" onClick={handleDelete} className="inline-flex items-center gap-2">
            <FaTrash />
            Hapus
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Tutup
            </Button>
            
            {/* Tombol Simpan: Muncul jika bisa edit dokumen DAN (belum complete ATAU ada perubahan data) */}
            {canEditDocs && (
              <Button
                variant="primary"
                onClick={handleSaveProofAndMom}
                disabled={!proof && !mom} // Minimal salah satu harus ada untuk save pertama kali
              >
                {isCompleted ? 'Simpan Perubahan' : 'Simpan & Tandai Selesai'}
              </Button>
            )}

            {/* Tombol Tandai Selesai Manual (jika tidak butuh dokumen) */}
            {!isCompleted && !activity.withCustomer && (
              <Button variant="primary" onClick={handleMarkComplete}>
                <FaCheckCircle className="inline mr-2" />
                Tandai Selesai
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-sm text-neutral-700">
        {/* Header Info */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{activity.title}</h2>
              <p className="text-neutral-500 mt-1">{activity.topic}</p>
            </div>
            {isCompleted ? (
              <Badge variant="success" className="inline-flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                Selesai
              </Badge>
            ) : isPast ? (
              <Badge variant="warning">Perlu Update</Badge>
            ) : (
              <Badge variant="info">Akan Datang</Badge>
            )}
          </div>
        </section>

        {/* Rangkuman Jadwal */}
        <section className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-5 shadow-inner space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Rangkuman Jadwal</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3">
              <FaCalendar className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Tanggal</p>
                <p className="font-medium text-neutral-900">
                  {new Date(activity.date).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3">
              <FaClock className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Waktu</p>
                <p className="font-medium text-neutral-900">{activity.time}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3 sm:col-span-2">
              <FaMapMarkerAlt className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Lokasi</p>
                <p className="font-medium text-neutral-900">{activity.location}</p>
              </div>
            </div>
            {activity.withCustomer && activity.customer && (
              <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3 sm:col-span-2">
                <FaBuilding className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-xs uppercase text-neutral-500">Customer</p>
                  <p className="font-medium text-[#E60012]">{activity.customer}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {activity.description && (
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Deskripsi</p>
            <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{activity.description}</p>
          </section>
        )}

        {/* SECTION DOKUMENTASI (Menyatukan Upload & View) */}
        {showDocSection && (
          <section className="rounded-2xl border border-dashed border-neutral-300 bg-white p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {!proof && !mom ? "Lengkapi Dokumentasi" : "Dokumentasi Aktivitas"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {canEditDocs 
                    ? "Anda dapat mengunggah atau mengubah bukti & MoM hingga 7 hari setelah aktivitas."
                    : "Batas waktu pengunggahan (7 hari) telah berakhir. File bersifat read-only."}
                </p>
              </div>
              {/* Badge info sisa hari */}
              {canEditDocs && (
                <Badge variant="warning" className="text-[10px]">
                  Sisa waktu edit: {7 - diffDays} hari
                </Badge>
              )}
              {!canEditDocs && (
                <Badge variant="danger" className="text-[10px] flex items-center gap-1">
                  <FaExclamationTriangle /> Terkunci
                </Badge>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {renderFileBox("Foto Bukti", proof, proofInputRef, handleProofChange, "image/*", FaImage)}
              {renderFileBox("MoM File", mom, momInputRef, handleMomChange, ".pdf,.doc,.docx", FaFileAlt)}
            </div>
          </section>
        )}
      </div>
    </Modal>
  )
}