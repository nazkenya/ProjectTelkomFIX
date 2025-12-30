import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft,
  FaBuilding,
  FaEdit,
  FaEnvelope,
  FaFacebook,
  FaHistory,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaRegCalendarAlt,
  FaSave,
  FaShareAlt,
  FaTimes,
  FaTiktok,
  FaTwitter,
  FaUserTie,
  FaBell,
  FaStar,
  FaRegStar,
} from 'react-icons/fa'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import contactsData from '../data/mockContacts'

// ... (Konstanta DEFAULT_PROFILE, CONTACT_ENRICHMENTS, TAB_OPTIONS, etc. tetap sama) ...

const DEFAULT_PROFILE = {
  avatarUrl: null,
  department: 'Account Management',
  status: 'Aktif',
  relationshipStatus: 'Neutral',
  decisionRole: 'User',
  emails: [],
  phones: [],
  socials: {},
  address: '',
  contactPreferences: {
    bestTime: '09:00 - 17:00 WIB',
    channel: 'Email',
  },
  placeOfBirth: '-',
  dateOfBirth: '',
  educationHistory: '-',
  hobbiesInterests: '-',
  notes: [],
  interactions: [],
}

const CONTACT_ENRICHMENTS = {
  'alia-smith': {
    avatarUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Enterprise Sales',
    status: 'Aktif',
    relationshipStatus: 'Promotor',
    decisionRole: 'Influencer',
    emails: ['alia.smith@techcorp.com', 'a.smith@personalmail.com'],
    phones: [
      { label: 'Mobile', type: 'mobile', value: '+62 812 3456 7890' },
      { label: 'Office', type: 'office', value: '+1 (555) 321-8899' },
      { label: 'WhatsApp', type: 'whatsapp', value: '+62 812 3456 7890' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/aliasmith',
      instagram: 'https://www.instagram.com/aliasales',
    },
    address: 'Jl. HR Rasuna Said Kav. 12, Kuningan, Jakarta Selatan',
    contactPreferences: {
      bestTime: '09:00 - 11:30 WIB',
      channel: 'WhatsApp atau LinkedIn',
    },
    placeOfBirth: 'Jakarta',
    dateOfBirth: '1990-11-05',
    educationHistory: 'MBA, Harvard Business School (2015)',
    hobbiesInterests: 'Golf, membaca buku bisnis, museum hopping',
    notes: [
      {
        id: 1,
        user: 'Vino Saputra',
        date: '2025-10-01',
        note: 'Lebih responsif saat diskusi melalui LinkedIn DM.',
      },
      {
        id: 2,
        user: 'Yunisa Putri',
        date: '2025-09-21',
        note: 'Suka overview deck dengan visual kuat. Kirim versi terbaru minggu depan.',
      },
    ],
    interactions: [
      {
        id: 'act-1',
        type: 'Meeting',
        channel: 'Zoom',
        date: '2025-10-04',
        summary: 'Pembahasan bundling solusi konektivitas & managed service untuk Q1 2026.',
      },
      {
        id: 'act-2',
        type: 'Email',
        channel: 'Email',
        date: '2025-09-28',
        summary: 'Kirim follow-up proposal managed security services.',
      },
      {
        id: 'act-3',
        type: 'Call',
        channel: 'Phone',
        date: '2025-09-15',
        summary: 'Diskusi kebutuhan onboarding untuk kantor cabang di Surabaya.',
      },
    ],
  },
  'budi-hartono': {
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Technology & Innovation',
    status: 'Aktif',
    relationshipStatus: 'Neutral',
    decisionRole: 'Decision Maker',
    emails: ['budi.h@innovatehub.id'],
    phones: [
      { label: 'Mobile', type: 'mobile', value: '+62 811 1234 5678' },
      { label: 'Office', type: 'office', value: '+62 21 7788 9900' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/budihartono',
      twitter: 'https://twitter.com/buditech',
    },
    address: 'The Prominence Office Tower Lt 12, BSD, Tangerang Selatan',
    contactPreferences: {
      bestTime: '13:00 - 16:00 WIB',
      channel: 'Email resmi + follow-up via phone',
    },
    placeOfBirth: 'Surabaya',
    dateOfBirth: '1985-11-25',
    educationHistory: 'PhD Computer Science, ITB',
    hobbiesInterests: 'Catur, trail running, teknologi AI',
    notes: [
      {
        id: 3,
        user: 'Rifki Alamsyah',
        date: '2025-09-12',
        note: 'Prioritas utama keamanan data & latency rendah.',
      },
    ],
    interactions: [
      {
        id: 'act-4',
        type: 'Tech Workshop',
        channel: 'Onsite',
        date: '2025-10-02',
        summary: 'Hands-on workshop edge computing untuk tim engineering.',
      },
    ],
  },
  'catherine-lee': {
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Procurement',
    status: 'Aktif',
    relationshipStatus: 'Promotor',
    decisionRole: 'User',
    emails: ['c.lee@globallogistics.com'],
    phones: [{ label: 'Mobile', type: 'mobile', value: '+1 (555) 987-6543' }],
    socials: {
      linkedin: 'https://www.linkedin.com/in/catherinelee',
    },
    address: '88 Shenton Way, #23-01, Singapore',
    contactPreferences: {
      bestTime: '08:30 - 10:00 WIB',
      channel: 'Email',
    },
    placeOfBirth: 'Singapore',
    dateOfBirth: '1991-04-17',
    educationHistory: 'BBA, National University of Singapore',
    hobbiesInterests: 'Travel, baking, HIIT workout',
  },
  'david-kim': {
    avatarUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Information Technology',
    status: 'Aktif',
    relationshipStatus: 'Detractor',
    decisionRole: 'Decision Maker',
    emails: ['david.kim@techcorp.com'],
    phones: [
      { label: 'Mobile', type: 'mobile', value: '+1 (555) 111-2222' },
      { label: 'WhatsApp', type: 'whatsapp', value: '+1 (555) 111-2222' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/davidkim',
      twitter: 'https://twitter.com/dkim_it',
    },
    address: '1 Market St, San Francisco, CA',
    contactPreferences: {
      bestTime: '22:00 - 00:00 WIB (PST working hours)',
      channel: 'Teams atau Email',
    },
    placeOfBirth: 'Seoul',
    dateOfBirth: '1983-02-09',
    educationHistory: 'MSc Cybersecurity, Stanford University',
    hobbiesInterests: 'Barista home brewing, sci-fi novels',
  },
  'eka-putri': {
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Finance',
    status: 'Aktif',
    relationshipStatus: 'Neutral',
    decisionRole: 'Influencer',
    emails: ['eka.p@dataweave.co'],
    phones: [
      { label: 'Mobile', type: 'mobile', value: '+62 811 9876 5432' },
      { label: 'Office', type: 'office', value: '+62 21 6677 1122' },
    ],
    socials: {
      instagram: 'https://www.instagram.com/ekafinance',
      linkedin: 'https://www.linkedin.com/in/ekaputri',
    },
    address: 'Jl. Jend Sudirman Kav 48, Jakarta Selatan',
    contactPreferences: {
      bestTime: '10:00 - 12:00 WIB',
      channel: 'Telepon kantor',
    },
    placeOfBirth: 'Bandung',
    dateOfBirth: '1992-08-14',
    educationHistory: 'S2 Akuntansi, Universitas Indonesia',
    hobbiesInterests: 'Yoga, journaling, kuliner lokal',
  },
  'farhan-yusuf': {
    avatarUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Procurement',
    status: 'Aktif',
    relationshipStatus: 'Promotor',
    decisionRole: 'Decision Maker',
    emails: ['farhan.yusuf@nusaretail.id'],
    phones: [
      { label: 'Mobile', type: 'mobile', value: '+62 813 2233 4455' },
      { label: 'WhatsApp', type: 'whatsapp', value: '+62 813 2233 4455' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/farhanyusuf',
    },
    address: 'Menara BCA Lt 38, Jakarta Pusat',
    contactPreferences: {
      bestTime: '15:00 - 17:00 WIB',
      channel: 'WhatsApp',
    },
    placeOfBirth: 'Padang',
    dateOfBirth: '1987-06-21',
    educationHistory: 'BSc Industrial Engineering, ITB',
    hobbiesInterests: 'Kuliner nusantara, fotografi street',
  },
  'giovanni-rossi': {
    department: 'Operations',
    status: 'Tidak Aktif',
    relationshipStatus: 'Detractor',
    decisionRole: 'User',
    emails: ['giovanni.rossi@logistica.it'],
    phones: [{ label: 'Mobile', type: 'mobile', value: '+39 02 555 0101' }],
    socials: {
      linkedin: 'https://www.linkedin.com/in/giovannirossi',
      facebook: 'https://www.facebook.com/g.rossi',
    },
    address: 'Via Torino 88, Milano, Italy',
    contactPreferences: {
      bestTime: '16:00 - 19:00 WIB',
      channel: 'Email',
    },
    placeOfBirth: 'Milan',
    dateOfBirth: '1978-12-30',
    educationHistory: 'Laurea Magistrale, Politecnico di Milano',
    hobbiesInterests: 'Sepeda, fotografi arsitektur',
  },
  'hana-rahma': {
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    department: 'Marketing',
    status: 'Aktif',
    relationshipStatus: 'Promotor',
    decisionRole: 'Influencer',
    emails: ['hana.rahma@skylinemedia.co.id', 'hana.rahma@gmail.com'],
    phones: [
      { label: 'Mobile', type: 'mobile', value: '+62 812 8899 7766' },
      { label: 'WhatsApp', type: 'whatsapp', value: '+62 812 8899 7766' },
    ],
    socials: {
      instagram: 'https://www.instagram.com/hanarahma',
      tiktok: 'https://www.tiktok.com/@hanarahma',
    },
    address: 'Jl. Kemang Raya No. 78, Jakarta Selatan',
    contactPreferences: {
      bestTime: '11:00 - 14:00 WIB',
      channel: 'Instagram DM atau WhatsApp',
    },
    placeOfBirth: 'Medan',
    dateOfBirth: '1994-03-11',
    educationHistory: 'S1 Komunikasi, Universitas Padjadjaran',
    hobbiesInterests: 'Content creation, lari pagi, kopi susu',
  },
}

const TAB_OPTIONS = [
  { key: 'information', label: 'Informasi Kontak' },
  { key: 'interactions', label: 'Riwayat Interaksi' },
  { key: 'notes', label: 'Catatan' },
]

const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram },
  { key: 'facebook', label: 'Facebook', icon: FaFacebook },
  { key: 'twitter', label: 'Twitter', icon: FaTwitter },
  { key: 'tiktok', label: 'TikTok', icon: FaTiktok },
]

const statusToVariant = {
  Aktif: 'success',
  'Tidak Aktif': 'danger',
}

const relationshipChipStyles = {
  Promotor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Neutral: 'bg-amber-50 text-amber-700 border-amber-200',
  Detractor: 'bg-red-50 text-red-700 border-red-200',
}

const decisionRoleChipStyles = {
  'Decision Maker': 'bg-purple-50 text-purple-700 border-purple-200',
  Influencer: 'bg-blue-50 text-blue-700 border-blue-200',
  User: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

const phoneTypeChipStyles = {
  mobile: 'bg-blue-50 text-blue-700 border-blue-200',
  office: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  whatsapp: 'bg-green-50 text-green-700 border-green-200',
}

const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getAvatarColor = (name = '') => {
  const palette = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-yellow-100 text-yellow-700',
    'bg-red-100 text-red-700',
    'bg-purple-100 text-purple-700',
    'bg-indigo-100 text-indigo-700',
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

const getInitials = (name = '') => {
  const parts = name.trim().split(' ')
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return `${first}${last}`.toUpperCase()
}

// --- Mock interactions generator (fallback when a contact has no interactions) ---
const ACTIVITY_TYPES = ['Meeting', 'Call', 'Email', 'Demo', 'Follow-up', 'Workshop']
const ACTIVITY_CHANNELS = ['Onsite', 'Zoom', 'Teams', 'Phone', 'Email']

const pickFrom = (arr, idx) => arr[Math.abs(idx) % arr.length]

function generateMockInteractions(contact) {
  const basis = (contact?.id || contact?.name || contact?.fullName || contact?.fullname || 'contact').toString()
  const seed = basis.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const now = new Date()
  const count = 3 + (seed % 3) // 3-5 items
  return Array.from({ length: count }).map((_, i) => {
    const daysAgo = ((seed + i * 3) % 20) + 1
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    const type = pickFrom(ACTIVITY_TYPES, seed + i)
    const channel = pickFrom(ACTIVITY_CHANNELS, seed + 2 * i)
    return {
      id: `mock-act-${seed}-${i}`,
      type,
      channel,
      date: d.toISOString().slice(0, 10),
      summary: `${type} terkait ${contact?.company || 'customer'} (${channel})`,
    }
  })
}

const buildContactProfile = (baseContact) => {
  if (!baseContact) return null
  const enrichment = CONTACT_ENRICHMENTS[baseContact.id] || {}
  const profile = {
    ...DEFAULT_PROFILE,
    ...baseContact,
    ...enrichment,
  }

  profile.avatarUrl = enrichment.avatarUrl || baseContact.avatarUrl || null
  
  profile.emails =
    enrichment.emails && enrichment.emails.length > 0
      ? enrichment.emails
      : [baseContact.email].filter(Boolean)

  profile.phones =
    enrichment.phones && enrichment.phones.length > 0
      ? enrichment.phones
      : [baseContact.phone ? { label: 'Mobile', type: 'mobile', value: baseContact.phone } : null].filter(Boolean)

  profile.socials = { ...DEFAULT_PROFILE.socials, ...enrichment.socials }
  profile.companySlug = enrichment.companySlug || slugify(baseContact.company || 'customer')
  profile.notes = enrichment.notes || DEFAULT_PROFILE.notes
  const enrichedInteractions = enrichment.interactions || DEFAULT_PROFILE.interactions
  profile.interactions = (enrichedInteractions && enrichedInteractions.length > 0)
    ? enrichedInteractions
    : generateMockInteractions(profile)
  profile.fullName = profile.fullName || profile.name
  return profile
}

const duplicateProfile = (profile) => {
  if (!profile) return null
  return {
    ...profile,
    emails: [...(profile.emails || [])],
    phones: (profile.phones || []).map((phone) => ({ ...phone })),
    socials: { ...(profile.socials || {}) },
    contactPreferences: { ...(profile.contactPreferences || {}) },
  }
}

const changeFieldLabels = {
  avatarUrl: 'URL Avatar',
  status: 'Status',
  relationshipStatus: 'Relasi',
  decisionRole: 'Peran',
  emails: 'Email',
  phones: 'Nomor telepon',
  socials: 'Media sosial',
  address: 'Alamat',
  contactPreferences: 'Preferensi kontak',
  placeOfBirth: 'Tempat lahir',
  dateOfBirth: 'Tanggal lahir',
  educationHistory: 'Riwayat pendidikan',
  hobbiesInterests: 'Hobi & minat',
}

const getChangedFields = (previousData, updatedData) => {
  if (!previousData || !updatedData) return []
  const changes = []
  Object.entries(changeFieldLabels).forEach(([field, label]) => {
    const prevValue = JSON.stringify(previousData[field] ?? null)
    const nextValue = JSON.stringify(updatedData[field] ?? null)
    if (prevValue !== nextValue) {
      changes.push(label)
    }
  })
  return changes
}

const InfoSection = ({ title, description, children, className = '' }) => (
  <div className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4 ${className}`}>
    <div>
      {/* PERUBAHAN: Judul InfoSection diberi warna biru utama */}
      <p className="text-sm font-semibold text-[#2C5CC5]">{title}</p>
      {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
    </div>
    {children}
  </div>
)

const EmptyState = ({ title, subtitle, action }) => (
  <Card className="text-center space-y-3">
    <p className="text-xl font-semibold text-neutral-800">{title}</p>
    <p className="text-neutral-500">{subtitle}</p>
    {action}
  </Card>
)

export default function ContactDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const baseContact = contactsData.find((contactItem) => contactItem.id === id)
  const [contact, setContact] = useState(() => buildContactProfile(baseContact))
  const [infoDraft, setInfoDraft] = useState(() => duplicateProfile(buildContactProfile(baseContact)))
  const [activeTab, setActiveTab] = useState('information')
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [changeLog, setChangeLog] = useState([])
  const [notes, setNotes] = useState(contact?.notes || [])
  const [newNote, setNewNote] = useState('')
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Important PIC state (persisted in localStorage)
  const loadImportant = (contactId) => {
    try {
      const arr = JSON.parse(localStorage.getItem('importantContactIds') || '[]')
      return Array.isArray(arr) && contactId ? arr.includes(contactId) : false
    } catch {
      return false
    }
  }
  const saveImportant = (contactId, flag) => {
    try {
      const arr = JSON.parse(localStorage.getItem('importantContactIds') || '[]')
      const set = new Set(Array.isArray(arr) ? arr : [])
      if (flag) set.add(contactId)
      else set.delete(contactId)
      localStorage.setItem('importantContactIds', JSON.stringify([...set]))
    } catch (e) {
      // ignore persistence errors
      console.warn('Failed to persist importantContactIds', e)
    }
  }
  const [isImportant, setIsImportant] = useState(() => loadImportant(id))
  useEffect(() => {
    setIsImportant(loadImportant(id))
  }, [id])
  const toggleImportant = () => {
    const next = !isImportant
    setIsImportant(next)
    saveImportant(id, next)
  }

  useEffect(() => {
    const profile = buildContactProfile(baseContact)
    setContact(profile)
    setInfoDraft(duplicateProfile(profile))
    setNotes(profile?.notes || [])
    setNewNote('')
    setIsEditingInfo(false)
    setChangeLog([])
  }, [baseContact])

  useEffect(() => {
    if (contact) {
      setNotes(contact.notes || [])
    }
  }, [contact])

  const handleStartEdit = () => {
    if (!contact) return
    setInfoDraft(duplicateProfile(contact))
    setIsEditingInfo(true)
  }

  const handleCancelEdit = () => {
    setInfoDraft(duplicateProfile(contact))
    setIsEditingInfo(false)
  }

  const handleSaveInfo = () => {
    if (!contact) return
    const normalizedDraft = {
      ...contact,
      ...infoDraft,
      avatarUrl: infoDraft.avatarUrl?.trim() || null,
      status: infoDraft.status || 'Aktif',
      relationshipStatus: infoDraft.relationshipStatus || 'Neutral',
      decisionRole: infoDraft.decisionRole || 'User',
      emails: (infoDraft.emails || []).map((email) => email.trim()).filter(Boolean),
      phones: (infoDraft.phones || [])
        .map((phone) => ({
          label: phone.label?.trim() || 'Kontak',
          type: phone.type || 'mobile',
          value: phone.value?.trim() || '',
        }))
        .filter((phone) => phone.value),
      socials: Object.entries(infoDraft.socials || {}).reduce((acc, [platform, url]) => {
        if (url && url.trim()) {
          acc[platform] = url.trim()
        }
        return acc
      }, {}),
      address: infoDraft.address || '',
      contactPreferences: {
        bestTime: infoDraft.contactPreferences?.bestTime || '',
        channel: infoDraft.contactPreferences?.channel || '',
      },
      placeOfBirth: infoDraft.placeOfBirth || '',
      dateOfBirth: infoDraft.dateOfBirth || '',
      educationHistory: infoDraft.educationHistory || '',
      hobbiesInterests: infoDraft.hobbiesInterests || '',
    }

    const changes = getChangedFields(contact, normalizedDraft)
    setContact(normalizedDraft)
    setInfoDraft(duplicateProfile(normalizedDraft))
    setIsEditingInfo(false)

    if (changes.length > 0) {
      const entry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Anda',
        fields: changes,
      }
      setChangeLog((prev) => [entry, ...prev])
    }
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    const payload = {
      id: `note-${Date.now()}`,
      user: 'Anda',
      date: new Date().toLocaleDateString('id-ID'),
      note: newNote.trim(),
    }
    setNotes((prev) => [payload, ...prev])
    setNewNote('')
  }
  
  const handleAvatarClick = () => {
    if (!isEditingInfo) return 

    const newAvatarUrl = window.prompt(
      'Masukkan URL gambar baru:',
      infoDraft.avatarUrl || '' 
    )

    if (newAvatarUrl !== null) { 
      setInfoDraft((prev) => ({
        ...prev,
        avatarUrl: newAvatarUrl.trim(),
      }))
    }
  }

  if (!contact) {
    return (
      <div className="px-4 py-12 space-y-6">
        <PageHeader
          title="Kontak Tidak Ditemukan"
          subtitle="Kontak yang Anda cari tidak tersedia."
          onBack={() => navigate(-1)}
        />
        <EmptyState
          title="Kontak tidak ditemukan"
          subtitle="Kontak yang Anda cari tidak tersedia atau sudah dihapus."
          action={
            <Button variant="primary" onClick={() => navigate('/contacts')}>
              Kembali ke daftar kontak
            </Button>
          }
        />
      </div>
    )
  }

  const avatarFallback = getInitials(contact.name || contact.fullName || contact.fullname || 'Contact')
  const avatarColor = getAvatarColor(contact.name || contact.fullName || contact.fullname || 'Contact')
  
  const displayAvatarUrl = isEditingInfo ? infoDraft.avatarUrl : contact.avatarUrl

  // Relationship management helpers
  const formatDateId = (d) => (d ? d.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-')
  const interactions = contact.interactions || []
  const lastInteraction = interactions.reduce((latest, curr) => {
    const currDate = curr?.date ? new Date(curr.date) : null
    const latestDate = latest?.date ? new Date(latest.date) : null
    if (!currDate) return latest
    if (!latestDate) return curr
    return currDate > latestDate ? curr : latest
  }, null)
  const lastDateObj = lastInteraction?.date ? new Date(lastInteraction.date) : null
  const today = new Date()
  // normalize to local midnight to avoid partial days
  const midnight = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  const daysSinceLast = lastDateObj ? Math.floor((midnight(today) - midnight(lastDateObj)) / 86400000) : null
  const frequencyDays = (() => {
    switch (contact.relationshipStatus) {
      case 'Detractor':
        return 7
      case 'Promotor':
        return 21
      case 'Neutral':
      default:
        return 14
    }
  })()
  const daysUntilNext = daysSinceLast != null ? frequencyDays - daysSinceLast : null
  const nextDateObj = lastDateObj ? new Date(lastDateObj.getTime() + frequencyDays * 86400000) : null
  let reminderBadge = { variant: 'neutral', text: 'Tidak ada data' }
  if (daysUntilNext != null) {
    if (daysUntilNext < 0) {
      reminderBadge = { variant: 'danger', text: `Terlambat ${Math.abs(daysUntilNext)} hari` }
    } else if (daysUntilNext <= 3) {
      reminderBadge = { variant: 'info', text: `Jatuh tempo ${daysUntilNext} hari lagi` }
    } else {
      reminderBadge = { variant: 'success', text: `${daysUntilNext} hari lagi` }
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'information':
        return (
          <ContactInfoTab
            contact={contact}
            draft={infoDraft || contact}
            isEditing={isEditingInfo}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveInfo}
            setDraft={setInfoDraft}
            changeLog={changeLog}
            onHistoryClick={() => setIsHistoryModalOpen(true)}
          />
        )
      case 'interactions':
        return <InteractionsTab interactions={contact.interactions} onNavigate={() => navigate('/activities')} />
      case 'notes':
        return (
          <NotesTab
            notes={notes}
            newNote={newNote}
            onChangeNote={setNewNote}
            onAddNote={handleAddNote}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="px-4 pb-12 space-y-6 animate-fade-in">
      <PageHeader
        title={contact.fullName || contact.name}
        subtitle={`Detail kontak untuk ${contact.company}`}
        onBack={() => navigate(-1)}
      />

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="flex items-start gap-4 flex-1">
            
            <button
              type="button"
              onClick={handleAvatarClick}
              className={`relative flex-shrink-0 rounded-full ${
                isEditingInfo ? 'cursor-pointer group hover:opacity-90' : 'cursor-default'
              }`}
              disabled={!isEditingInfo}
              aria-label="Ubah avatar"
            >
              {displayAvatarUrl ? (
                <img
                  src={displayAvatarUrl}
                  alt={contact.fullName || contact.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className={`h-20 w-20 rounded-full grid place-items-center text-2xl font-semibold ${avatarColor}`}>
                  {avatarFallback}
                </div>
              )}
              {isEditingInfo && (
                <div className="absolute inset-0 h-20 w-20 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaEdit size={24} />
                </div>
              )}
            </button>
            
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-semibold text-neutral-900 flex items-center gap-2">
                  {contact.fullName || contact.name}
                  <button
                    type="button"
                    onClick={toggleImportant}
                    className="inline-flex items-center transition-opacity hover:opacity-90"
                    title={isImportant ? 'Batalkan penanda penting' : 'Tandai sebagai penting'}
                    aria-label={isImportant ? 'Batalkan penanda penting' : 'Tandai sebagai penting'}
                  >
                    {isImportant ? (
                      <FaStar className="text-[#E60012] text-sm" />
                    ) : (
                      <FaRegStar className="text-neutral-400 text-sm" />
                    )}
                  </button>
                  {isImportant && (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Penting
                    </span>
                  )}
                </p>
                <p className="text-neutral-600 flex items-center gap-2 text-sm">
                  {/* PERUBAHAN: Ikon diberi warna */}
                  <FaUserTie className="text-blue-500" />
                  {contact.title || contact.titlePosition || contact.jobTitle || 'Contact'} ·{' '}
                  {contact.department}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusToVariant[contact.status] || 'neutral'}>{contact.status}</Badge>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    relationshipChipStyles[contact.relationshipStatus] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {contact.relationshipStatus}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    decisionRoleChipStyles[contact.decisionRole] ||
                    'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {contact.decisionRole}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:w-72">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
              <p className="text-xs uppercase text-neutral-500">Perusahaan</p>
              <button
                type="button"
                onClick={() => navigate(`/customers/${contact.companySlug}`)}
                className="inline-flex items-center gap-2 text-left text-sm font-semibold text-[#2C5CC5] hover:underline"
              >
                {/* PERUBAHAN: Ikon diberi warna */}
                <FaBuilding className="text-blue-500" />
                {contact.company}
              </button>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-1 text-sm text-neutral-600">
              <p className="text-xs uppercase text-neutral-500">Preferensi Kontak</p>
              <p>Waktu terbaik: {contact.contactPreferences.bestTime}</p>
              <p>Media: {contact.contactPreferences.channel}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Manajemen Hubungan card */}
<Card className="p-0 overflow-hidden">
  <div className="p-3.5 md:p-4 flex flex-col gap-2.5">
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-0.5">
        <h3 className="text-[15px] font-semibold text-[#2C5CC5] leading-tight">
          Manajemen Hubungan
        </h3>
        <p className="text-[12.5px] text-neutral-500">
          Pantau ritme komunikasi dengan PIC ini.
        </p>
      </div>
      <Badge
        variant={reminderBadge.variant}
        className="px-2 py-0.5 text-[11px] font-medium rounded-full"
      >
        {reminderBadge.text}
      </Badge>
    </div>

    {/* Info Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3 text-sm">
      {/* Last Contact */}
      <div className="rounded-lg border border-neutral-200 bg-white p-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">
          Terakhir Berhubungan
        </p>
        <p className="mt-1 text-[16px] font-semibold text-neutral-900 flex items-center gap-2 leading-snug">
          <FaRegCalendarAlt className="text-neutral-400" />
          {lastDateObj ? formatDateId(lastDateObj) : '-'}
        </p>
        <p className="text-[12px] text-neutral-500 mt-0.5">
          {daysSinceLast != null ? `${daysSinceLast} hari lalu` : '—'}
        </p>
      </div>

      {/* Target Frequency */}
      <div className="rounded-lg border border-neutral-200 bg-white p-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">
          Frekuensi Target
        </p>
        <p className="mt-1 text-[16px] font-semibold text-neutral-900 leading-snug">
          Setiap {frequencyDays} hari
        </p>
        <p className="text-[12px] text-neutral-500 mt-0.5">
          Berdasarkan status relasi: {contact.relationshipStatus}
        </p>
      </div>

      {/* Next Reminder */}
      <div className="rounded-lg border border-neutral-200 bg-white p-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">
          Pengingat Berikutnya
        </p>
        <p className="mt-1 text-[16px] font-semibold text-neutral-900 flex items-center gap-2 leading-snug">
          <FaBell className="text-amber-500" />
          {nextDateObj ? formatDateId(nextDateObj) : '-'}
        </p>
        <p className="text-[12px] text-neutral-500 mt-0.5">
          {daysUntilNext != null
            ? daysUntilNext >= 0
              ? `${daysUntilNext} hari lagi`
              : `Terlambat ${Math.abs(daysUntilNext)} hari`
            : '—'}
        </p>
      </div>
    </div>

    {/* CTA */}
    <div className="flex justify-end mt-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate('/activities')}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px]"
      >
        <FaShareAlt /> Tambah Aktivitas
      </Button>
    </div>
  </div>
</Card>



      <Card className="p-0 overflow-hidden">
        <div className="flex border-b border-neutral-200 px-6 gap-6">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#2C5CC5] text-[#2C5CC5]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 bg-neutral-50">{renderTabContent()}</div>
      </Card>

      <Modal
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Riwayat Perubahan Data"
        footer={
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setIsHistoryModalOpen(false)}>
              Tutup
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          {changeLog.length === 0 ? (
            <p className="text-sm text-neutral-500">Belum ada perubahan yang tercatat.</p>
          ) : (
            changeLog.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-neutral-800 flex items-center gap-2">
                    {/* PERUBAHAN: Ikon diberi warna */}
                    <FaHistory className="text-blue-500" />
                    {entry.user}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(entry.timestamp).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Perubahan pada: {entry.fields.join(', ')}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}

function ContactInfoTab({
  contact,
  draft,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  setDraft,
  changeLog,
  onHistoryClick,
}) {
  if (!contact) return null
  const working = isEditing && draft ? draft : contact
  const formattedDate =
    working.dateOfBirth && !Number.isNaN(Date.parse(working.dateOfBirth))
      ? new Date(working.dateOfBirth).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '-'

  const updateDraftField = (field, value) => {
    if (!isEditing) return
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEmailsChange = (value) => {
    updateDraftField(
      'emails',
      value
        .split('\n')
        .map((email) => email.trim())
        .filter(Boolean)
    )
  }

  const handlePhoneChange = (index, key, value) => {
    if (!isEditing) return
    setDraft((prev) => {
      const nextPhones = (prev.phones || []).map((phone, idx) =>
        idx === index ? { ...phone, [key]: value } : phone
      )
      return { ...prev, phones: nextPhones }
    })
  }

  const addPhone = () => {
    if (!isEditing) return
    setDraft((prev) => ({
      ...prev,
      phones: [...(prev.phones || []), { label: 'Mobile', type: 'mobile', value: '' }],
    }))
  }

  const removePhone = (index) => {
    if (!isEditing) return
    setDraft((prev) => ({
      ...prev,
      phones: (prev.phones || []).filter((_, idx) => idx !== index),
    }))
  }

  const handleSocialChange = (platform, value) => {
    if (!isEditing) return
    setDraft((prev) => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [platform]: value,
      },
    }))
  }

  const latestChange = changeLog[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5 text-sm text-neutral-500">
          <p>
            {latestChange
              ? `Terakhir diperbarui ${new Date(latestChange.timestamp).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })} oleh ${latestChange.user}`
              : 'Belum ada perubahan yang tersimpan'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onHistoryClick} className="inline-flex items-center gap-2">
            <FaHistory />
            Riwayat
          </Button>
          
          {isEditing ? (
            <>
              <Button variant="secondary" size="sm" onClick={onCancelEdit} className="inline-flex items-center gap-2">
                <FaTimes />
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={onSaveEdit} className="inline-flex items-center gap-2">
                <FaSave />
                Simpan Perubahan
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={onStartEdit} className="inline-flex items-center gap-2">
              <FaEdit />
              Edit Informasi
            </Button>
          )}
        </div>
      </div>
      
      <InfoSection title="Profil Utama" description="Informasi dasar dan status kontak.">
        {isEditing ? (
          // --- MODE EDIT ---
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Status Kontak</p>
              <select
                value={draft?.status || 'Aktif'}
                onChange={(e) => updateDraftField('status', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5] bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Relasi</p>
              <select
                value={draft?.relationshipStatus || 'Neutral'}
                onChange={(e) => updateDraftField('relationshipStatus', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5] bg-white"
              >
                <option value="Promotor">Promotor</option>
                <option value="Neutral">Neutral</option>
                <option value="Detractor">Detractor</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Peran</p>
              <select
                value={draft?.decisionRole || 'User'}
                onChange={(e) => updateDraftField('decisionRole', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5] bg-white"
              >
                <option value="Decision Maker">Decision Maker</option>
                <option value="Influencer">Influencer</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
        ) : (
          // --- MODE LIHAT ---
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-neutral-700">
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Status Kontak</p>
              <div className="font-semibold">
                <Badge variant={statusToVariant[contact.status] || 'neutral'}>{contact.status}</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Relasi</p>
              <div className="font-semibold">
                 <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    relationshipChipStyles[contact.relationshipStatus] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {contact.relationshipStatus}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Peran</p>
              <div className="font-semibold">
                 <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    decisionRoleChipStyles[contact.decisionRole] ||
                    'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {contact.decisionRole}
                </span>
              </div>
            </div>
          </div>
        )}
      </InfoSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection title="Email" description="Alamat email yang dapat dihubungi.">
          {isEditing ? (
            <textarea
              value={(draft?.emails || []).join('\n')}
              onChange={(e) => handleEmailsChange(e.target.value)}
              rows={working.emails?.length > 2 ? working.emails.length : 3}
              className="w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5CC5]/30"
              placeholder="Masukkan satu email per baris"
            />
          ) : (
            <div className="space-y-3">
              {(contact.emails || []).map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700"
                >
                  {/* PERUBAHAN: Ikon diberi warna */}
                  <FaEnvelope className="text-blue-500" />
                  <a href={`mailto:${email}`} className="hover:text-[#2C5CC5]">
                    {email}
                  </a>
                </div>
              ))}
              {(contact.emails || []).length === 0 && (
                 <p className="text-sm text-neutral-500">Belum ada data email.</p>
              )}
            </div>
          )}
        </InfoSection>

        <InfoSection title="Nomor Telepon" description="Kategori nomor sesuai preferensi kontak.">
          {isEditing ? (
            <div className="space-y-4">
              {(draft?.phones || []).map((phone, idx) => (
                <div key={`phone-${idx}`} className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={phone.label}
                      onChange={(e) => handlePhoneChange(idx, 'label', e.target.value)}
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                      placeholder="Label"
                    />
                    <select
                      value={phone.type}
                      onChange={(e) => handlePhoneChange(idx, 'type', e.target.value)}
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5] bg-white"
                    >
                      <option value="mobile">Mobile</option>
                      <option value="office">Office</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                    <input
                      type="text"
                      value={phone.value}
                      onChange={(e) => handlePhoneChange(idx, 'value', e.target.value)}
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                      placeholder="+62 ..."
                    />
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => removePhone(idx)}>
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addPhone}>
                Tambah Nomor
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {(contact.phones || []).map((phone) => (
                <div
                  key={`${phone.label}-${phone.value}`}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm"
                >
                  <div className="flex items-center gap-3 text-neutral-700">
                    {/* PERUBAHAN: Ikon diberi warna hijau (sesuai badge whatsapp) */}
                    <FaPhone className="text-green-600" />
                    <div>
                      <p className="font-semibold">{phone.value}</p>
                      <p className="text-xs text-neutral-500">{phone.label}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] font-semibold capitalize ${
                      phoneTypeChipStyles[phone.type] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {phone.type}
                  </span>
                </div>
              ))}
               {(contact.phones || []).length === 0 && (
                 <p className="text-sm text-neutral-500">Belum ada data telepon.</p>
              )}
            </div>
          )}
        </InfoSection>
      </div>

      <InfoSection title="Media Sosial" description="Kanal media sosial yang aktif digunakan.">
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform.key} className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500">{platform.label}</label>
                <input
                  type="text"
                  value={draft?.socials?.[platform.key] || ''}
                  onChange={(e) => handleSocialChange(platform.key, e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                  placeholder={`URL ${platform.label}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {SOCIAL_PLATFORMS.filter((platform) => contact.socials?.[platform.key]).map((platform) => {
              const Icon = platform.icon
              const value = contact.socials[platform.key]
              const url =
                value.startsWith('http://') || value.startsWith('https://')
                  ? value
                  : `https://${value}`
              return (
                <a
                  key={platform.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-[#2C5CC5]"
                >
                  {/* PERUBAHAN: Ikon diberi warna (default) */}
                  <Icon className="text-neutral-500" /> 
                  {platform.label}
                </a>
              )
            })}
            {SOCIAL_PLATFORMS.filter((platform) => contact.socials?.[platform.key]).length === 0 && (
              <p className="text-sm text-neutral-500">Belum ada data media sosial.</p>
            )}
          </div>
        )}
      </InfoSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection title="Alamat" description="Alamat kantor atau domisili utama.">
          {isEditing ? (
            <textarea
              value={draft?.address || ''}
              onChange={(e) => updateDraftField('address', e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5CC5]/30"
              placeholder="Tulis alamat lengkap..."
            />
          ) : (
            <div className="flex items-start gap-3 text-sm text-neutral-700">
              {/* PERUBAHAN: Ikon diberi warna */}
              <FaMapMarkerAlt className="text-red-500 mt-1" />
              <p>{contact.address || '-'}</p>
            </div>
          )}
        </InfoSection>

        <InfoSection title="Preferensi Kontak" description="Cara terbaik untuk menghubungi kontak ini.">
          {isEditing ? (
            <div className="space-y-2 text-sm">
              <input
                type="text"
                value={draft?.contactPreferences?.bestTime || ''}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    contactPreferences: {
                      ...prev.contactPreferences,
                      bestTime: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                placeholder="Waktu terbaik dihubungi"
              />
              <input
                type="text"
                value={draft?.contactPreferences?.channel || ''}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    contactPreferences: {
                      ...prev.contactPreferences,
                      channel: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                placeholder="Media komunikasi"
              />
            </div>
          ) : (
            <div className="text-sm text-neutral-700 space-y-1.5">
              <p>
                <span className="text-neutral-500">Waktu terbaik:</span> {contact.contactPreferences.bestTime}
              </p>
              <p>
                <span className="text-neutral-500">Media komunikasi:</span> {contact.contactPreferences.channel}
              </p>
            </div>
          )}
        </InfoSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection title="Data Pribadi" description="Informasi personal untuk pendekatan yang relevan.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-700">
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Tempat Lahir</p>
              {isEditing ? (
                <input
                  type="text"
                  value={draft?.placeOfBirth || ''}
                  onChange={(e) => updateDraftField('placeOfBirth', e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                  placeholder="Tempat lahir"
                />
              ) : (
                <p className="font-semibold">{contact.placeOfBirth || '-'}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase text-neutral-500">Tanggal Lahir</p>
              {isEditing ? (
                <input
                  type="date"
                  value={draft?.dateOfBirth || ''}
                  onChange={(e) => updateDraftField('dateOfBirth', e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                />
              ) : (
                <p className="font-semibold flex items-center gap-2">
                  {/* PERUBAHAN: Ikon diberi warna */}
                  <FaRegCalendarAlt className="text-purple-500" />
                  {formattedDate}
                </p>
              )}
            </div>
          </div>
        </InfoSection>

        <InfoSection title="Riwayat & Minat" description="Gunakan untuk membangun koneksi yang lebih dalam.">
          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs uppercase text-neutral-500">Riwayat Pendidikan</p>
                <textarea
                  value={draft?.educationHistory || ''}
                  onChange={(e) => updateDraftField('educationHistory', e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                  placeholder="Contoh: S2 Manajemen, Universitas Indonesia"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-neutral-500">Hobi & Ketertarikan</p>
                <textarea
                  value={draft?.hobbiesInterests || ''}
                  onChange={(e) => updateDraftField('hobbiesInterests', e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2C5CC5]"
                  placeholder="Contoh: golf, fotografi, kopi"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-neutral-700">
              <div>
                <p className="text-xs uppercase text-neutral-500">Riwayat Pendidikan</p>
                <p className="font-semibold">{contact.educationHistory || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500">Hobi & Ketertarikan</p>
                <p className="font-semibold">{contact.hobbiesInterests || '-'}</p>
              </div>
            </div>
          )}
        </InfoSection>
      </div>
      
    </div>
  )
}

function InteractionsTab({ interactions, onNavigate }) {
  if (!interactions || interactions.length === 0) {
    return (
      <EmptyState
        title="Belum ada interaksi"
        subtitle="Belum ada aktivitas yang melibatkan kontak ini."
        action={
          <Button variant="primary" onClick={onNavigate}>
            Tambah Aktivitas
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="space-y-1">
              {/* PERUBAHAN: Judul interaksi diberi warna */}
              <p className="text-sm font-semibold text-[#2C5CC5]">{interaction.type}</p>
              <p className="text-xs text-neutral-500 flex items-center gap-2">
                <FaRegCalendarAlt className="text-neutral-400" />
                {interaction.date} · {interaction.channel}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={onNavigate} className="inline-flex items-center gap-2">
              <FaShareAlt />
              Lihat di Aktivitas
            </Button>
          </div>
          <p className="text-sm text-neutral-700">{interaction.summary}</p>
        </div>
      ))}
    </div>
  )
}

function NotesTab({ notes, newNote, onChangeNote, onAddNote }) {
  return (
    <div className="space-y-6">
      {/* PERUBAHAN: Judul di tab catatan juga diberi warna */}
      <InfoSection title="Tambah Catatan" description="Bagi insight terbaru untuk tim.">
        <textarea
          value={newNote}
          onChange={(e) => onChangeNote(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5CC5]/30"
          placeholder="Contoh: kontak suka komunikasi singkat melalui WhatsApp, hindari hari Senin."
        />
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={onAddNote}>
            Simpan Catatan
          </Button>
        </div>
      </InfoSection>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-[#2C5CC5]">Catatan Sebelumnya</p>
        {notes.length === 0 ? (
          <p className="text-sm text-neutral-500">Belum ada catatan tersimpan.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm space-y-1">
              <p className="text-xs text-neutral-500">
                {note.user} • {note.date}
              </p>
              <p className="text-sm text-neutral-800">{note.note}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}