import React from 'react'
import Card from '../ui/Card'
import Tag from '../ui/Tag'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { useNavigate, useParams } from 'react-router-dom'
import { FaBookOpen } from 'react-icons/fa'
import { FiArrowLeft, FiClock, FiUser, FiEdit3 } from 'react-icons/fi'

export default function ProfileHeader({ name, code, tag, nipnas, onBack }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [historyOpen, setHistoryOpen] = React.useState(false)

  // Ambil riwayat dari localStorage (kalau ada), kalau tidak pakai dummy
  const history = React.useMemo(() => {
    const key = `accountProfile_${id}_history`
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore parse error, fallback ke dummy
    }

    // Fallback dummy history (hardcode)
    return [
      {
        id: 'h1',
        timestamp: '2025-11-15T09:32:00.000Z',
        userName: 'Top-Level Manager Satu',
        userRole: 'Account Manager',
        changes: [
          {
            field: 'Alamat kantor pusat',
            from: 'Jl. Gatot Subroto No. 1, Jakarta',
            to: 'Jl. Gatot Subroto No. 123, Jakarta',
          },
          {
            field: 'Nomor telepon utama',
            from: '(021) 000-0000',
            to: '(021) 123-4567',
          },
        ],
      },
      {
        id: 'h2',
        timestamp: '2025-11-12T14:10:00.000Z',
        userName: 'Top-Level Manager Dua',
        userRole: 'Data Steward',
        changes: [
          {
            field: 'Industri',
            from: 'Lainnya',
            to: 'Teknologi & Telekomunikasi',
          },
          {
            field: 'Sub industri',
            from: '-',
            to: 'Elektronik Konsumen',
          },
        ],
      },
    ]
  }, [id])

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Nama customer */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-semibold">
              {name?.[0] || 'C'}
            </div>
            <div>
              <div className="text-xl md:text-2xl font-semibold text-neutral-900">
                {name}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {tag && <Tag variant={tag.variant}>{tag.text}</Tag>}


                {nipnas && (
                  <span className="text-xs text-neutral-400">
                    • No. Pelanggan: {nipnas}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <Button variant="back" onClick={() => setHistoryOpen(true)}>
              <FiClock className="w-4 h-4" />
              Lihat Riwayat
            </Button>
            {onBack && (
              <Button variant="back" onClick={onBack}>
                <FiArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Modal Riwayat Perubahan */}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Riwayat Perubahan Account Profile"
        panelClassName="max-w-xl"
        footer={
          <div className="flex justify-end">
            <Button variant="back" onClick={() => setHistoryOpen(false)}>
              Tutup
            </Button>
          </div>
        }
      >
        {history.length === 0 ? (
          <div className="text-sm text-neutral-500">
            Belum ada riwayat perubahan untuk halaman ini.
          </div>
        ) : (
          <ul className="space-y-3">
            {history
              .slice() // kalau nanti mau sort
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              )
              .map((item) => {
                const ts = item.timestamp
                  ? new Date(item.timestamp).toLocaleString('id-ID')
                  : '-'
                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5"
                  >
                    {/* Header: siapa & kapan */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <FiUser className="w-3.5 h-3.5" />
                        <span className="font-medium text-neutral-800">
                          {item.userName || 'Pengguna'}
                        </span>
                        {item.userRole && (
                          <span className="text-neutral-400">
                            • {item.userRole}
                          </span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>{ts}</span>
                      </div>
                    </div>

                    {/* Detail perubahan */}
                    <div className="mt-2 space-y-1.5">
                      {(item.changes || []).map((chg, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="text-xs text-neutral-700 flex items-start gap-1.5"
                        >
                          <FiEdit3 className="w-3 h-3 mt-0.5 text-neutral-400" />
                          <div>
                            <span className="font-semibold">
                              {chg.field || 'Field'}
                            </span>
                            <span className="mx-1 text-neutral-400">:</span>
                            <span className="line-through text-neutral-400">
                              {chg.from ?? '-'}
                            </span>
                            <span className="mx-1 text-neutral-400">→</span>
                            <span className="text-neutral-900">
                              {chg.to ?? '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
          </ul>
        )}
      </Modal>
    </>
  )
}
