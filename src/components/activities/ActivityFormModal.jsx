import React, { useEffect, useMemo, useState } from 'react'
import Modal from '../ui/Modal'
import FormInput from '../ui/FormInput'
import Button from '../ui/Button'
import Select from '../ui/Select'
import YesNoToggle from '../ui/YesNoToggle'
import SearchInput from '../ui/SearchInput'
// ❌ HAPUS IMPORT MOCK DATA - GUNAKAN API ATAU FALLBACK KOSONG
// import customersData from '../../data/mockCustomers'
// import contactsData from '../../data/mockContacts'
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaSync, FaSave } from 'react-icons/fa'

const ACTIVITY_TYPES = [
  'Meeting',
  'Call',
  'Email',
  'Visit',
  'Presentation',
  'Workshop',
  'Internal Meeting',
  'Training',
  'Other',
]

const ACTIVITY_OUTCOMES = [
  'Follow-up Required',
  'Proposal Sent',
  'Contract Signed',
  'Rejected',
  'Postponed',
  'Needs More Info',
  'Successful',
  'Cancelled',
]

// ✅ FALLBACK DATA KOSONG (aman untuk production)
const EMPTY_CUSTOMERS = []
const EMPTY_CONTACTS = []

// ✅ HAPUS SEMUA FUNGSI YANG DEPEND ON MOCK DATA
// (findCustomerById, findContactByName, dll) - GUNAKAN API LATER

const slugify = (value) =>
  value?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || ''

// ✅ PERBAIKAN: HAPUS SPASI BERLEBIH DI URL
const buildOutlookDeeplink = (activity) => {
  if (!activity?.date || !activity?.time) return '#'

  try {
    const [hours, minutes] = (activity.time || '09:00').split(':').map(Number)
    const start = new Date(`${activity.date}T${String(hours || 9).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`)
    const end = new Date(start.getTime() + (activity.duration || 60) * 60 * 1000)

    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: activity.title || 'Aktivitas AM',
      body: `
Topik: ${activity.topic || '-'}
Customer: ${activity.customer?.name || activity.customer || '-'}
Lokasi: ${activity.location || '-'}
Hasil: ${activity.outcome || '-'}

${activity.description || 'Tidak ada deskripsi'}
      `.trim(),
      location: activity.location || '',
      startdt: start.toISOString(),
      enddt: end.toISOString(),
    })

    if (activity.invitees?.length) {
      params.append('attendees', activity.invitees.map(i => i.email || i.name).join(';'))
    }

    // ✅ FIX: HAPUS SPASI BERLEBIH SETELAH ?
    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
  } catch (e) {
    console.error('Error building Outlook link:', e)
    return '#'
  }
}

const EMPTY_FORM = {
  title: '',
  type: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  duration: 60,
  location: '',
  topic: '',
  description: '',
  outcome: '',
  followUpDate: '',
  withCustomer: false,
  customer: null,
  invitees: [],
}

const buildFormState = (data) => {
  if (!data) return { ...EMPTY_FORM }
  return {
    ...EMPTY_FORM,
    ...data,
    date: data.date || EMPTY_FORM.date,
    time: data.time || EMPTY_FORM.time,
    duration: data.duration || EMPTY_FORM.duration,
    withCustomer: Boolean(data.withCustomer || data.customer),
    customer: data.customer || null,
    invitees: Array.isArray(data.invitees) ? data.invitees : [],
  }
}

export default function ActivityFormModal({ 
  open, 
  onClose, 
  onSubmit, 
  initialData = null, 
  lockedCustomer = null,
  amId = null,
  amName = null,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [customerSearch, setCustomerSearch] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOutlookPreview, setShowOutlookPreview] = useState(false)

  // ✅ FIX: HAPUS 'open' DARI DEPENDENCY ARRAY UNTUK HINDARI INFINITE LOOP
  useEffect(() => {
    // Hanya reset form saat modal DIBUKA (bukan saat ditutup)
    if (open) {
      setFormData(buildFormState(initialData || (lockedCustomer ? { withCustomer: true, customer: lockedCustomer } : null)))
      setErrors({})
      setCustomerSearch('')
      setContactSearch('')
    }
  }, [initialData, lockedCustomer, open]) // ✅ AMAN: 'open' hanya trigger saat berubah dari false→true

  // ✅ GUNAKAN FALLBACK KOSONG (aman untuk production)
  const availableCustomers = useMemo(() => EMPTY_CUSTOMERS, [])
  const availableContacts = useMemo(() => EMPTY_CONTACTS, [])

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return availableCustomers.slice(0, 5)
    return availableCustomers.filter(c => 
      c.name?.toLowerCase().includes(customerSearch.toLowerCase())
    ).slice(0, 10)
  }, [availableCustomers, customerSearch])

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return availableContacts.slice(0, 5)
    return availableContacts.filter(c => 
      c.name?.toLowerCase().includes(contactSearch.toLowerCase())
    ).slice(0, 10)
  }, [availableContacts, contactSearch])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title?.trim()) newErrors.title = 'Judul aktivitas wajib diisi'
    if (!formData.type) newErrors.type = 'Tipe aktivitas wajib dipilih'
    if (!formData.date) newErrors.date = 'Tanggal wajib diisi'
    if (!formData.time) {
      newErrors.time = 'Waktu wajib diisi'
    } else {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(formData.time)) newErrors.time = 'Format waktu tidak valid (HH:mm)'
    }
    if (!formData.location?.trim()) newErrors.location = 'Lokasi wajib diisi'
    if (!formData.topic?.trim()) newErrors.topic = 'Topik wajib diisi'
    
    if (formData.withCustomer && !formData.customer) newErrors.customer = 'Customer wajib dipilih'
    
    if (formData.outcome && !formData.followUpDate && 
        ['Follow-up Required', 'Proposal Sent', 'Needs More Info'].includes(formData.outcome)) {
      newErrors.followUpDate = 'Tanggal follow-up wajib diisi untuk outcome ini'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const activityData = {
        ...formData,
        amId: amId || 'CURRENT_AM_ID',
        amName: amName || 'CURRENT_AM_NAME',
        customer: lockedCustomer 
          ? (typeof lockedCustomer === 'string' ? lockedCustomer : lockedCustomer.name)
          : (formData.withCustomer ? (formData.customer?.name || '') : ''),
        withCustomer: lockedCustomer ? true : formData.withCustomer,
        invitees: formData.invitees.map(p => ({ name: p.name, email: p.email || '', phone: p.phone || '' })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await onSubmit(activityData)
      onClose()
    } catch (error) {
      console.error('Error submitting activity:', error)
      alert('Gagal menyimpan aktivitas. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(buildFormState(lockedCustomer ? { withCustomer: true, customer: lockedCustomer } : null))
    setErrors({})
    setCustomerSearch('')
    setContactSearch('')
  }

  // ✅ DISABLE CUSTOMER/CONTACT SEARCH KARENA TIDAK ADA DATA (UNTUK SEKARANG)
  // Nanti integrasikan dengan API customerService & contactService

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Aktivitas' : 'Tambah Aktivitas Baru'}
      panelClassName="max-w-3xl"
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
            <Button 
              variant="ghost" 
              onClick={handleReset}
              disabled={isSubmitting}
              className="text-gray-600 hover:bg-gray-100"
            >
              <FaSync className="mr-2" /> Reset
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                if (validateForm()) {
                  setShowOutlookPreview(true)
                  const url = buildOutlookDeeplink(formData)
                  if (url !== '#') window.open(url, '_blank')
                } else {
                  alert('Lengkapi field wajib terlebih dahulu')
                }
              }}
              disabled={isSubmitting || !formData.date || !formData.time}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <FaCalendarAlt className="mr-2" /> Buka di Outlook
            </Button>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Batal
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : initialData ? (
                <><FaCheckCircle className="mr-2" /> Simpan Perubahan</>
              ) : (
                <><FaSave className="mr-2" /> Simpan Aktivitas</>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-sm text-neutral-700">
        {/* AM INFO BADGE */}
        {amId && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-800 text-sm">
                {amName?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-medium text-blue-900">{amName || 'Account Manager'}</p>
                <p className="text-xs text-blue-700">ID: {amId}</p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY INFO */}
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 md:p-5 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
              Informasi Aktivitas
            </p>
            <p className="text-sm text-neutral-500 mt-1">Lengkapi detail umum aktivitas.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Judul Aktivitas <span className="text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                value={formData.title}
                onChange={(val) => handleChange('title', val)}
                placeholder="Contoh: Business Review Q4 dengan PT Telkom"
                required
                error={errors.title}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Tipe Aktivitas <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                  error={errors.type}
                >
                  <option value="">Pilih tipe...</option>
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Topik <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="text"
                  value={formData.topic}
                  onChange={(val) => handleChange('topic', val)}
                  placeholder="Contoh: Pembahasan Renewal Kontrak"
                  required
                  error={errors.topic}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Durasi (menit) <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', Number(e.target.value))}
                >
                  {[30, 45, 60, 90, 120].map((min) => (
                    <option key={min} value={min}>{min} menit</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* SCHEDULE & LOCATION */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
              Jadwal & Lokasi
            </p>
            <p className="text-sm text-neutral-500 mt-1">Pastikan tanggal, waktu, dan lokasi akurat.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <FormInput
                type="date"
                value={formData.date}
                onChange={(val) => handleChange('date', val)}
                required
                error={errors.date}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Waktu <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-neutral-500">(HH:mm)</span>
              </label>
              <FormInput
                type="text"
                value={formData.time}
                onChange={(val) => {
                  let formatted = val.replace(/[^\d:]/g, '')
                  if (formatted.length === 2 && !formatted.includes(':')) formatted += ':'
                  handleChange('time', formatted)
                }}
                placeholder="10:00"
                required
                error={errors.time}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                value={formData.location}
                onChange={(val) => handleChange('location', val)}
                placeholder="Kantor Customer / Zoom / Teams"
                required
                error={errors.location}
              />
            </div>
          </div>
        </section>

        {/* CUSTOMER & PARTICIPANTS - DISABLED SEMENTARA (NO API YET) */}
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:p-5 shadow-sm space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                Customer & Peserta
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Fitur pencarian customer & kontak akan tersedia setelah integrasi API selesai.
              </p>
            </div>
            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Coming Soon
            </div>
          </div>
          
          <div className="bg-neutral-100 border border-dashed border-neutral-300 rounded-xl p-6 text-center">
            <p className="text-neutral-500">
              🔒 Fitur customer & peserta belum aktif. Untuk sementara, isi manual di field "Catatan".
            </p>
          </div>
        </section>

        {/* OUTCOME & FOLLOW-UP */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
              Hasil & Tindak Lanjut
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              Catat hasil aktivitas dan jadwalkan tindak lanjut jika diperlukan
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Hasil Aktivitas
              </label>
              <Select
                value={formData.outcome}
                onChange={(e) => handleChange('outcome', e.target.value)}
                error={errors.outcome}
              >
                <option value="">Pilih hasil aktivitas...</option>
                {ACTIVITY_OUTCOMES.map((outcome) => (
                  <option key={outcome} value={outcome}>{outcome}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tanggal Follow-up
                {formData.outcome && ['Follow-up Required', 'Proposal Sent', 'Needs More Info'].includes(formData.outcome) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <FormInput
                type="date"
                value={formData.followUpDate}
                onChange={(val) => handleChange('followUpDate', val)}
                placeholder="Pilih tanggal follow-up"
                error={errors.followUpDate}
                disabled={!formData.outcome}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Catatan Detail / Agenda <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="textarea"
              value={formData.description}
              onChange={(val) => handleChange('description', val)}
              placeholder="Contoh: 
- Pembahasan renewal kontrak
- Customer meminta penyesuaian SLA
- Janji kirim proposal maksimal 3 hari kerja"
              rows={5}
              required
              error={errors.description}
            />
          </div>
        </section>

        {showOutlookPreview && (
          <div className="rounded-xl bg-blue-50 border border-blue-300 p-4 text-sm text-blue-800">
            <p className="font-medium flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" /> Outlook Calendar Event
            </p>
            <p className="mt-1">
              Event telah dibuka di tab baru. Login ke Outlook Telkom untuk menyimpan.
            </p>
            <p className="mt-2 text-xs italic text-blue-700">
              Note: Simpan juga data aktivitas melalui tombol "Simpan Aktivitas" di bawah.
            </p>
          </div>
        )}
      </form>
    </Modal>
  )
}