import React from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { FaRobot, FaLightbulb, FaSync, FaShieldAlt } from 'react-icons/fa'
import { RadialProgress } from '../../pages/accountProfile/components/RadialProgress'

export default function AISummaryCard({
  customerName,
  profileCurrent = 9,
  profileTotal = 12,
  summaryText,
  recommendationText,
  lastUpdated = '28 Nov 2025, 14:30 WIB',
  onRefresh,
  isLoading = false,
}) {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleRefresh = () => {
    if (onRefresh && !isLoading) onRefresh()
  }

  return (
    <Card className="p-4 sm:p-5 border border-neutral-100 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
        {/* KIRI: Insight AI */}
        <div className="min-w-0 flex-1 flex flex-col gap-3.5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <FaRobot className="w-3.5 h-3.5" />
              <span>Ringkasan Profil AI</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="font-medium text-neutral-600">Diperbarui: {lastUpdated}</span>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-1.5 rounded-full border transition-all ${
                  isLoading
                    ? 'cursor-not-allowed opacity-60 text-neutral-300 border-transparent'
                    : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 border-neutral-200'
                }`}
                title="Refresh Analisis AI"
              >
                <FaSync className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Ringkasan */}
          <div
            className={`rounded-xl border border-neutral-100 bg-neutral-50 px-3.5 py-3 text-[13px] text-neutral-700 leading-relaxed transition-opacity duration-200 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {summaryText ? (
              <p className="leading-relaxed text-neutral-800">{summaryText}</p>
            ) : customerName ? (
              <p className="leading-relaxed text-neutral-800">
                <span className="font-semibold text-neutral-900">
                  Berdasarkan profil akun {customerName},
                </span>{' '}
                data menunjukkan tingkat interaksi yang stabil. Profil perusahaan mengindikasikan
                fase ekspansi dengan kebutuhan infrastruktur yang meningkat. Lengkapi beberapa
                atribut tambahan agar rekomendasi lebih presisi.
              </p>
            ) : (
              <p className="leading-relaxed text-neutral-700">
                Ringkasan AI dihasilkan dari data Profil Akun yang tersedia. Lengkapi profil untuk
                meningkatkan akurasi analisis dan rekomendasi.
              </p>
            )}
          </div>

          {/* Rekomendasi */}
          <div
            className={`rounded-xl border border-amber-100 bg-white px-3.5 py-3 transition-opacity duration-200 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 text-[13px] font-semibold text-amber-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 border border-amber-100">
                <FaLightbulb className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <span>Rekomendasi &amp; Tindakan Selanjutnya</span>
            </div>
            <div className="text-[12.5px] text-neutral-800 leading-relaxed space-y-1">
              {recommendationText ? (
                recommendationText
              ) : (
                <div className="space-y-2">
                  <p className="text-[12.5px] font-semibold text-neutral-800">
                    Rekomendasi Produk:{' '}
                    <span className="text-blue-700 hover:underline underline-offset-2 decoration-1 cursor-pointer transition-colors">
                      Managed Security
                    </span>{' '}
                    +
                    <span className="text-blue-700 hover:underline underline-offset-2 decoration-1 cursor-pointer transition-colors">
                      {' '}
                      Network Monitor
                    </span>
                  </p>
                  <p className="text-[12px] text-neutral-600 leading-snug">
                    Tech stack belum memiliki proteksi siber khusus; quick win: monitoring terpadu,
                    patching rutin, dan edukasi PIC.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div className="shrink-0 w-full sm:w-52 lg:w-60">
          <div className="h-full rounded-2xl border border-neutral-100 bg-white px-4 py-3.5 flex flex-col items-center gap-3">
            <div className="text-[12px] font-semibold text-neutral-700 tracking-wide uppercase">
              Kelengkapan Profil
            </div>

            <div className="py-0.5">
              <RadialProgress current={profileCurrent} total={profileTotal} />
            </div>

            <div className="w-full text-center">
              <p className="mb-2 text-xs text-neutral-500 leading-snug">
                Profil yang lengkap membantu AI memberikan analisis yang lebih relevan.
              </p>

              <Button
                onClick={() => navigate(`/customers/${id}/account-profile`)}
                size="sm"
                className="inline-flex w-full items-center justify-center gap-2 text-[12px] font-medium"
              >
                Update Account Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
