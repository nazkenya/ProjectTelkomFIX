import { ROLES } from '@/auth/roles'

const mockNotifications = [
  {
    id: 'notif-1',
    roles: [ROLES.manager],
    title: 'Profil Customer Perlu Update',
    message: '3 account di wilayah Anda belum mencapai kelengkapan profil 80%.',
    timestamp: '2025-01-10T09:15:00+07:00',
    isRead: false,
  },
  {
    id: 'notif-2',
    roles: [ROLES.manager],
    title: 'Aktivitas Mingguan Rendah',
    message: 'Hanya 14 aktivitas tercatat minggu ini. Dorong tim untuk melakukan kunjungan.',
    timestamp: '2025-01-09T17:05:00+07:00',
    isRead: true,
  },
  {
    id: 'notif-3',
    roles: [ROLES.manager],
    title: 'Data Freshness Melebihi 7 Hari',
    message: 'Wilayah Bandung belum memperbarui data sejak 9 hari lalu.',
    timestamp: '2025-01-08T08:30:00+07:00',
    isRead: false,
  },
  {
    id: 'notif-4',
    roles: [ROLES.admin],
    title: 'Trend Nasional',
    message: 'Rata-rata kelengkapan profil nasional turun 3% dibanding bulan lalu.',
    timestamp: '2025-01-11T11:40:00+07:00',
    isRead: false,
  },
  {
    id: 'notif-5',
    roles: [ROLES.admin],
    title: 'Wilayah Prioritas',
    message: 'Sumatera Utara membutuhkan follow-up tambahan untuk onboarding pelanggan baru.',
    timestamp: '2025-01-10T15:22:00+07:00',
    isRead: true,
  },
  {
    id: 'notif-6',
    roles: [ROLES.admin, ROLES.manager],
    title: 'Pembaruan Sistem',
    message: 'Fitur dashboard baru telah dirilis. Silakan review performa tim Anda.',
    timestamp: '2025-01-07T13:00:00+07:00',
    isRead: true,
  },
  // --- Account Manager specific notifications ---
  {
    id: 'notif-s1',
    roles: [ROLES.sales],
    title: 'Tugas Baru: Kunjungan Pelanggan',
    message: 'Kunjungi PT. Jaya Abadi sebelum Jumat untuk follow-up proposal.',
    timestamp: '2025-01-12T10:05:00+07:00',
    isRead: false,
  },
  {
    id: 'notif-s2',
    roles: [ROLES.sales],
    title: 'Reminder Aktivitas Mingguan',
    message: 'Anda mencatat 3 aktivitas minggu ini. Target minimal 5 aktivitas.',
    timestamp: '2025-01-11T18:30:00+07:00',
    isRead: false,
  },
  {
    id: 'notif-s3',
    roles: [ROLES.sales],
    title: 'Profil Akun Belum Lengkap',
    message: 'Akun CV. Maju Mundur belum mencapai 80% — lengkapi data kontak dan PIC.',
    timestamp: '2025-01-10T08:45:00+07:00',
    isRead: true,
  },
  {
    id: 'notif-s4',
    roles: [ROLES.sales],
    title: 'Meeting Terjadwal',
    message: 'Meeting dengan Stark Industries besok pukul 14:00 WIB.',
    timestamp: '2025-01-12T09:10:00+07:00',
    isRead: false,
  },
]

export default mockNotifications
