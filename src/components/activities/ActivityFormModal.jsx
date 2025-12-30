import React, { useEffect, useMemo, useState } from 'react'
import Modal from '../ui/Modal'
import FormInput from '../ui/FormInput'
import Button from '../ui/Button'
import Select from '../ui/Select'
import YesNoToggle from '../ui/YesNoToggle'
import SearchInput from '../ui/SearchInput'
import customersData from '../../data/mockCustomers'
import contactsData from '../../data/mockContacts'

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

const simplifyCustomer = (customer) => ({
  id: String(customer.id),
  name: customer.name,
  code: customer.code,
  witel: customer.witel,
  budSegmen: customer.budSegmen,
})

const simplifyContact = (contact) => ({
  id: String(contact.id),
  name: contact.name,
  title: contact.title,
  company: contact.company,
})

const slugify = (value) =>
  value?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || ''

const findCustomerById = (id) => {
  if (!id) return null
  const match = customersData.find((customer) => customer.id === id)
  return match ? simplifyCustomer(match) : null
}

const findCustomerByName = (name) => {
  if (!name) return null
  const match = customersData.find((customer) => customer.name === name)
  return match ? simplifyCustomer(match) : null
}

const findContactById = (id) => {
  if (!id) return null
  const match = contactsData.find((contact) => contact.id === id)
  return match ? simplifyContact(match) : null
}

const findContactByName = (name) => {
  if (!name) return null
  const match = contactsData.find((contact) => contact.name === name)
  return match ? simplifyContact(match) : null
}

// Build a best-effort Outlook compose URL so the activity can be saved as a calendar event.
const buildOutlookDeeplink = (activity) => {
  if (!activity) return ''
  const date = activity.date || ''
  const time = activity.time || '09:00'
  const [hh, mm] = time.split(':').map((t) => parseInt(t, 10))
  const start = new Date(`${date || ''}T${Number.isInteger(hh) ? String(hh).padStart(2, '0') : '09'}:${Number.isInteger(mm) ? String(mm).padStart(2, '0') : '00'}:00`)
  // Default 1 hour duration
  const end = new Date(start.getTime() + 60 * 60 * 1000)

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: activity.title || 'Aktivitas Baru',
    body: `${activity.topic ? `Topik: ${activity.topic}\n` : ''}${activity.description || 'Detail aktivitas'}\n\n(Simulated Outlook entry)`,
    location: activity.location || '',
    startdt: isNaN(start.getTime()) ? '' : start.toISOString(),
    enddt: isNaN(end.getTime()) ? '' : end.toISOString(),
  })

  if (activity.invitees && activity.invitees.length > 0) {
    params.append('attendees', activity.invitees.join(';'))
  }

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
}

const normalizeCustomerValue = (value) => {
  if (!value) return null
  if (typeof value === 'object' && value.name) {
    const fromId = findCustomerById(value.id)
    if (fromId) return fromId
    return {
      id: value.id || `custom-${slugify(value.name)}`,
      name: value.name,
      code: value.code,
      witel: value.witel || value.company,
      budSegmen: value.budSegmen,
    }
  }
  return findCustomerById(value) || findCustomerByName(value) || { id: `custom-${slugify(value)}`, name: value }
}

const normalizeInviteesValue = (value) => {
  if (!value) return []
  const sources = Array.isArray(value)
    ? value
    : value
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({ name }))
  return sources
    .map((entry, idx) => {
      if (!entry) return null
      if (typeof entry === 'string') {
        const contact = findContactByName(entry.trim())
        if (contact) return contact
        return { id: `manual-${idx}-${slugify(entry)}`, name: entry.trim() }
      }
      if (entry.name) {
        const fromId = findContactById(entry.id)
        if (fromId) return fromId
        const fromName = findContactByName(entry.name)
        if (fromName) return fromName
        return {
          id: entry.id || `manual-${idx}-${slugify(entry.name)}`,
          name: entry.name,
          title: entry.title,
          company: entry.company,
        }
      }
      return null
    })
    .filter(Boolean)
}

const EMPTY_FORM = {
  title: '',
  type: '',
  date: '',
  time: '',
  location: '',
  topic: '',
  description: '',
  withCustomer: false,
  customer: null,
  invitees: [],
}

const buildFormState = (data) => {
  if (!data) {
    return { ...EMPTY_FORM }
  }

  return {
    ...EMPTY_FORM,
    ...data,
    withCustomer: Boolean(data.withCustomer),
    customer: normalizeCustomerValue(data.customer),
    invitees: normalizeInviteesValue(data.invitees),
  }
}

export default function ActivityFormModal({ open, onClose, onSubmit, initialData = null, lockedCustomer = null }) {
  const [formData, setFormData] = useState(
    buildFormState(initialData || (lockedCustomer ? { withCustomer: true, customer: lockedCustomer } : null))
  )
  const [customerSearch, setCustomerSearch] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const lockedCustomerName = lockedCustomer
    ? (typeof lockedCustomer === 'string' ? lockedCustomer : lockedCustomer?.name)
    : null

  useEffect(() => {
    setFormData(buildFormState(initialData || (lockedCustomer ? { withCustomer: true, customer: lockedCustomer } : null)))
  }, [initialData, lockedCustomer])

  const availableCustomers = useMemo(
    () => customersData.map((customer) => simplifyCustomer(customer)),
    []
  )
  const availableContacts = useMemo(
    () => contactsData.map((contact) => simplifyContact(contact)),
    []
  )

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase()
    if (!q) return availableCustomers
    return availableCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(q) ||
        customer.code?.toLowerCase().includes(q) ||
        (customer.witel && customer.witel.toLowerCase().includes(q)) ||
        (customer.budSegmen && customer.budSegmen.toLowerCase().includes(q))
    )
  }, [availableCustomers, customerSearch])

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase()
    if (!q) return availableContacts
    return availableContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(q) ||
        (contact.title && contact.title.toLowerCase().includes(q)) ||
        (contact.company && contact.company.toLowerCase().includes(q))
    )
  }, [availableContacts, contactSearch])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const activityData = {
      ...formData,
      customer: lockedCustomer
        ? typeof lockedCustomer === 'string'
          ? lockedCustomer
          : lockedCustomer.name
        : formData.withCustomer
        ? formData.customer?.name || ''
        : '',
      withCustomer: lockedCustomer ? true : formData.withCustomer,
      invitees: formData.invitees.map((participant) => participant.name),
    }
    onSubmit(activityData)
    handleReset()
  }

  const handleReset = () => {
    setFormData(buildFormState(null))
  }

  const handleSelectCustomer = (customerId) => {
    const selected = findCustomerById(customerId)
    if (!selected) return
    setFormData((prev) => ({
      ...prev,
      withCustomer: true,
      customer: selected,
    }))
  }

  const handleSelectInvitee = (contactId) => {
    const contact = findContactById(contactId)
    if (!contact) return
    setFormData((prev) => {
      if (prev.invitees.some((participant) => participant.id === contact.id)) {
        return prev
      }
      return {
        ...prev,
        invitees: [...prev.invitees, contact],
      }
    })
  }

  const handleRemoveInvitee = (contactId) => {
    setFormData((prev) => ({
      ...prev,
      invitees: prev.invitees.filter((participant) => participant.id !== contactId),
    }))
  }

  const selectedInviteeIds = useMemo(
    () => new Set(formData.invitees.map((participant) => participant.id)),
    [formData.invitees]
  )

  const handleToggleCustomer = (val) => {
    if (lockedCustomer) return
    setFormData((prev) => {
      return {
        ...prev,
        withCustomer: val,
        customer: val ? prev.customer : null,
      }
    })
    if (!val) {
      setCustomerSearch('')
    }
  }

  const handleToggleInvitee = (contactId) => {
    if (selectedInviteeIds.has(contactId)) {
      handleRemoveInvitee(contactId)
    } else {
      handleSelectInvitee(contactId)
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={initialData ? 'Edit Aktivitas' : 'Tambah Aktivitas Baru'}
        panelClassName="max-w-2xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {initialData ? 'Simpan' : 'Tambah Aktivitas'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-sm text-neutral-700">
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
                  placeholder="Contoh: Meeting dengan PT Telkom Regional"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Tipe Aktivitas <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  >
                    <option value="">Pilih tipe...</option>
                    {ACTIVITY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
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
                    placeholder="Contoh: Q4 Business Review"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                Jadwal & Lokasi
              </p>
              <p className="text-sm text-neutral-500 mt-1">Pastikan tanggal, waktu, dan lokasi akurat.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="date"
                  value={formData.date}
                  onChange={(val) => handleChange('date', val)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Waktu <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="text"
                  value={formData.time}
                  onChange={(val) => handleChange('time', val)}
                  placeholder="Contoh: 10:00"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="text"
                  value={formData.location}
                  onChange={(val) => handleChange('location', val)}
                  placeholder="Contoh: Telkom Office Jakarta"
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:p-5 shadow-sm space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
                  Customer & Peserta
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Kelola customer yang terlibat dan peserta yang diundang.
                </p>
              </div>
              <YesNoToggle value={formData.withCustomer} onChange={handleToggleCustomer} />
            </div>

            {formData.withCustomer && (
              <div className="space-y-4 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-inner">
                {formData.customer && (
                  <div className="rounded-xl border border-[#2C5CC5]/20 bg-[#F5F7FF] p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-neutral-900">{formData.customer.name}</p>
                      <p className="text-xs text-neutral-600">
                        {[formData.customer.code, formData.customer.witel || formData.customer.budSegmen]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    </div>
                    {!lockedCustomer && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => {
                          handleChange('customer', null)
                          setCustomerSearch('')
                        }}
                      >
                        Hapus Pilihan
                      </Button>
                    )}
                  </div>
                )}

                {!lockedCustomer && (
                  <div className="space-y-2">
                    <SearchInput
                      value={customerSearch}
                      onChange={setCustomerSearch}
                      placeholder="Cari nama, kode, atau lokasi customer..."
                      variant="subtle"
                    />
                    <div className="rounded-xl border border-neutral-200 bg-white divide-y max-h-56 overflow-hidden overflow-y-auto">
                      {filteredCustomers.length === 0 ? (
                        <div className="p-4 text-center text-sm text-neutral-500">Customer tidak ditemukan</div>
                      ) : (
                        filteredCustomers.map((customer) => {
                          const isSelected = formData.customer?.id === customer.id
                          return (
                            <button
                              key={customer.id}
                              type="button"
                              className={`w-full px-4 py-3 text-left transition ${
                                isSelected ? 'bg-[#EEF2FF]' : 'hover:bg-neutral-50'
                              }`}
                              onClick={() => handleSelectCustomer(customer.id)}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-neutral-900">{customer.name}</p>
                                  <p className="text-xs text-neutral-600">
                                    {[customer.code, customer.witel || customer.budSegmen].filter(Boolean).join(' • ')}
                                  </p>
                                </div>
                                {isSelected && (
                                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#2C5CC5] text-white">
                                    Dipilih
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
                <p className="text-xs text-neutral-500">
                  {lockedCustomerName
                    ? `Aktivitas ini otomatis dikaitkan dengan ${lockedCustomerName}.`
                    : 'Customer diambil langsung dari portofolio akun yang kamu kelola.'}
                </p>
              </div>
            )}

            <div className="space-y-4 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-inner">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Undang Peserta</p>
                  <p className="text-xs text-neutral-500">Pilih peserta dari daftar kontak internal.</p>
                </div>
                {formData.invitees.length > 0 && (
                  <Button variant="ghost" size="sm" type="button" onClick={() => handleChange('invitees', [])}>
                    Bersihkan Peserta
                  </Button>
                )}
              </div>

              <div className="min-h-[56px] rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
                {formData.invitees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.invitees.map((participant) => (
                      <span
                        key={participant.id}
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm"
                      >
                        {participant.name}
                        <button
                          type="button"
                          className="text-neutral-400 hover:text-red-500 focus:outline-none"
                          onClick={() => handleRemoveInvitee(participant.id)}
                          aria-label={`Hapus ${participant.name}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">Belum ada peserta yang diundang</p>
                )}
              </div>

              <div className="space-y-2">
                <SearchInput
                  value={contactSearch}
                  onChange={setContactSearch}
                  placeholder="Cari nama, jabatan, atau perusahaan..."
                  variant="subtle"
                />
                <div className="rounded-xl border border-neutral-200 bg-white divide-y max-h-56 overflow-hidden overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="p-4 text-center text-sm text-neutral-500">Kontak tidak ditemukan</div>
                  ) : (
                    filteredContacts.map((contact) => {
                      const isSelected = selectedInviteeIds.has(contact.id)
                      return (
                        <button
                          key={contact.id}
                          type="button"
                          className={`w-full px-4 py-3 text-left transition flex items-center justify-between ${
                            isSelected ? 'bg-[#EEF2FF]' : 'hover:bg-neutral-50'
                          }`}
                          onClick={() => handleToggleInvitee(contact.id)}
                        >
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{contact.name}</p>
                            <p className="text-xs text-neutral-600">
                              {[contact.title, contact.company].filter(Boolean).join(' • ')}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-[#2C5CC5] text-white' : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {isSelected ? 'Terpilih' : 'Undang'}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-500">Peserta diambil dari daftar kontak yang telah tersimpan.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm space-y-3">
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-neutral-500">Catatan</p>
              <p className="text-sm text-neutral-500 mt-1">
                Tambahkan deskripsi atau agenda singkat agar tim memiliki konteks.
              </p>
            </div>
            <FormInput
              type="textarea"
              value={formData.description}
              onChange={(val) => handleChange('description', val)}
              placeholder="Deskripsi detail tentang aktivitas ini..."
              rows={4}
            />
          </section>
        </form>
      </Modal>
    </>
  )
}
