// src/data/mockAccountProfiles.js
// Hardcoded sample data to prefill Account Profile fields per customer id.

const html = (text) => `
  <p>${text}</p>
`

const mockAccountProfiles = {
  // Example: Samsung profile with realistic sample values
  samsung: {
    // Company Demographics
    companyName: 'Samsung Electronics Indonesia',
    nipnas: '123456',
    segment: 'Teknologi & Telekomunikasi',
    subsegment: 'Elektronik Konsumen',
    witel: 'JAKARTA',
    telephone: '+62 21 555 1234',
    website: 'https://www.samsung.com/id',
    email: 'info.id@samsung.com',
    branchCount: '12',
    address: 'Gedung Samsung Indonesia, Jl. Jend. Sudirman No. 52, Jakarta 10210',

    // Narrative
    companyOverview: html('Samsung Electronics Indonesia adalah perusahaan teknologi terkemuka yang fokus pada perangkat elektronik konsumen, mobile, dan solusi enterprise.'),
    visionMission: html('Visi: Menginspirasi dunia melalui teknologi inovatif. Misi: Menciptakan masa depan yang lebih baik melalui produk dan layanan terdepan.'),
    strategicHighlights: html('Fokus pada 5G enterprise, IoT, dan ekosistem perangkat; kemitraan strategis dengan operator dan pelaku ritel.'),
    subsidiaries: html('PT SEIN Logistics, SEIN Services, dan unit bisnis regional lainnya.'),

    // Meta
    priorityLevel: 'Top 20',
    assetValue: '500000000000',
    employeesRange: '>1000',

    // Key Personnel (PIC Cards)
    pics: [
      {
        id: 'pic-1',
        name: 'Rina Prameswari',
        title: 'Direktur Utama',
        phone: '(021) 111-1111',
        email: 'rina.prameswari@samsung.com',
        birthPlace: 'Bandung',
        birthDate: '1978-07-12',
        education: 'S2 Manajemen, ITB',
        hobbies: 'Membaca, golf',
        relationshipStatus: 'Promotor',
        decisionRole: 'Economic Buyer',
        avatar: null,
      },
      {
        id: 'pic-2',
        name: 'Dimas Ardianto',
        title: 'Manajer Administrasi',
        phone: '(021) 222-2222',
        email: 'dimas.ardianto@samsung.com',
        birthPlace: 'Jakarta',
        birthDate: '1985-03-22',
        education: 'S1 Akuntansi, UI',
        hobbies: 'Bersepeda',
        relationshipStatus: 'Neutral',
        decisionRole: 'Technical Influencer',
        avatar: null,
      },
    ],

    // Our Products & Services — Contracts
    contracts: [
      { id: 'ctr-1', title: 'Dedicated Internet (DIA) 1 Gbps HQ', contractDate: '2023-01-15', endDate: '2026-01-15' },
      { id: 'ctr-2', title: 'MPLS L3 VPN 50 Site', contractDate: '2022-09-01', endDate: '2025-09-01' },
    ],
    // Financial & Churn
    financials: [
      { id: 'fin-1', revenueYTD: '3600', churnedProduct: '', churnDate: '' },
      { id: 'fin-2', revenueYTD: '1200', churnedProduct: 'Legacy IP Transit', churnDate: '2024-04-30' },
    ],
    // Notes (related to churn / config)
    notesRows: [
      { id: 'note-1', churnReason: 'Konsolidasi layanan ke satu vendor; biaya lebih kompetitif.', connectivityConfig: 'Dual-homed via router Juniper; HSRP, /29 WAN, /24 LAN.' },
    ],

    // Our Service Performance (incidents / VoC)
    services: [
      { id: 'srv-1', reportDate: '2024-11-03', serviceName: 'DIA Jakarta HQ', hardComplaint: 'Packet loss intermiten', urgency: 'High', slgAchievement: '98.5', problemDescription: 'Flapping di uplink core; dilakukan reroute dan penyesuaian BFD timers.' },
      { id: 'srv-2', reportDate: '2024-10-14', serviceName: 'MPLS Branch Bandung', hardComplaint: 'Latency naik', urgency: 'Medium', slgAchievement: '99.2', problemDescription: 'Congestion jam sibuk; diterapkan QoS dan optimasi traffic.' },
    ],

    // Competitor Landscape
    competitorsProducts: [
      { id: 'cp-1', competitorName: 'XL Business', productService: 'Internet Dedicated 500 Mbps', endOfContract: '2025-12-31', totalRevYtd: '800' },
      { id: 'cp-2', competitorName: 'Indosat Business', productService: 'MPLS 10 Site', endOfContract: '2024-08-01', totalRevYtd: '450' },
    ],
    competitorsPerformance: [
      { id: 'cperf-1', competitorName: 'XL Business', productName: 'DIA 500 Mbps', voc: 'Neutral', performanceDesc: 'Availability stabil; support respons 4 jam.' },
      { id: 'cperf-2', competitorName: 'Indosat Business', productName: 'MPLS 10 Site', voc: 'Negative', performanceDesc: 'Sering downtime saat maintenance; proses eskalasi lambat.' },
    ],
    competitorsStrategy: [
      { id: 'cstr-1', competitorName: 'XL Business', businessStrategy: 'Penetrasi harga + bundling cloud PBX.' },
      { id: 'cstr-2', competitorName: 'Indosat Business', businessStrategy: 'Diskon kontrak multi-tahun + managed service firewall.' },
    ],

    // Strategy — Five Forces & SWOT
    fiveForcesEntrants: { rating: 'Medium', notes: 'Hambatan awal tinggi (capex infrastruktur), namun ISP lokal meningkat.' },
    fiveForcesSubstitute: { rating: 'Medium', notes: 'Alternatif via internet broadband + VPN over internet.' },
    fiveForcesBuyer: { rating: 'High', notes: 'Buyer enterprise kuat; sensitif harga dan SLA.' },
    fiveForcesSupplier: { rating: 'Medium', notes: 'Ketergantungan pada upstream dan perangkat (Cisco/Juniper).' },
    fiveForcesRivalry: { rating: 'High', notes: 'Persaingan ketat antarpemain besar; diferensiasi via SLA dan managed service.' },

    strengths: 'Brand kuat, cakupan jaringan luas, dukungan enterprise berpengalaman.',
    weaknesses: 'Waktu provisioning cabang baru bisa lama.',
    opportunities: 'Ekspansi SD-WAN, SASE, dan layanan cloud security.',
    threats: 'Tekanan harga dari pemain baru dan alternatif over-the-top.',

    // End-Customer Profile
    endCustomerSegment: 'Retail B2C (70%), SME reseller (20%), enterprise display/IoT (10%).',
    endCustomerLocationCoverage: 'Jabodetabek, Bandung, Surabaya, Medan (DC), Bali dan kota tier-2 untuk ritel.',
    endCustomerNeeds: 'Konektivitas stabil untuk kasir/omnichannel, integrasi ERP/CRM, keamanan WiFi tamu vs internal, visibilitas logistik.',
    endCustomerPainPoints: 'Downtime saat peak sale, latency replikasi data toko ke DC, keterbatasan insight jaringan cabang.',
    endCustomerJourney: 'Aplikasi & website -> marketplace -> pembayaran & fulfillment -> service center & chat/WhatsApp.',
    endCustomerSatisfaction: 'CSAT 4.3/5; churn retail <5% YoY; gap muncul saat seasonal campaign dan outage lokal.',

    // Business Model Canvas
    bmcCustomerSegments: 'Konsumen premium & mid-tier, retailer/SME untuk display/IoT, operator & integrator untuk bundling B2B.',
    bmcValuePropositions: 'Perangkat premium + ekosistem SmartThings, ketersediaan stok nasional, layanan purna jual kuat, opsi bundling konektivitas/financing.',
    bmcCustomerRelationships: 'Dedicated AM untuk enterprise/ritel besar, portal & live chat untuk warranty, komunitas/influencer untuk produk flagship.',
    bmcChannels: 'Samsung.com & aplikasi, Samsung Experience Store, ritel modern, marketplace, bundling operator, direct enterprise sales.',
    bmcKeyActivities: 'Perencanaan suplai, kampanye pemasaran, pengelolaan channel, R&D lokal untuk aplikasi, after-sales & field service.',
    bmcKeyResources: 'Brand global, data perangkat terkoneksi, DC & hub logistik, jaringan service center, tim engineer & AM.',
    bmcKeyPartners: 'Telkom/Telkomsel untuk konektivitas & bundling, 3PL nasional, chain ritel, cloud provider, partner konten/finansial.',
    bmcRevenueStreams: 'Penjualan perangkat & aksesoris, extended warranty, recurring managed service/IoT connectivity, iklan/partnership konten.',
    bmcCostStructure: 'BOM & bea impor, insentif channel/marketing, logistik & warehousing, biaya warranty/repair, lisensi & cloud ops.',

    // Industry Value Chain
    firmInfrastructure: 'Governance pusat/regional, ERP SAP terintegrasi, kontrol internal untuk inventory & SLA toko.',
    humanResources: 'Samsung Academy untuk frontline & engineer; sertifikasi rutin; fokus retensi talenta digital.',
    technologyDevelopment: 'Kolaborasi R&D dengan HQ; lokalisasi SmartThings; PoC 5G MEC untuk showroom interaktif.',
    procurement: 'Pengadaan terpusat; dual-vendor untuk perangkat jaringan; SLA ketat untuk lead time impor.',
    inboundLogistics: 'Import via pelabuhan ke DC Jakarta/Surabaya; bonded warehouse; tracking inbound masih campuran.',
    operations: 'Perakitan ringan & QC; otomasi gudang; ketergantungan pada jaringan stabil untuk WMS/IoT.',
    outboundLogistics: 'Distribusi nasional via 3PL; routing ke ratusan toko & partner; butuh visibilitas real-time.',
    marketingSales: 'Campaign digital & offline, co-marketing dengan operator, push bundling 5G dan IoT.',
    service: 'Jaringan >120 service center, 24/7 contact center, remote diagnostic untuk perangkat IoT.',
    margin: 'Margin dijaga lewat premium SKU, bundling layanan, efisiensi logistik; tekanan di segmen entry-level.',

    // Gap Analysis (Value Chain)
    firmInfrastructureGap: 'Monitoring SLA jaringan toko terpisah per vendor; belum ada single dashboard dan early warning.',
    firmInfrastructureImprovement: 'Implement observability terpusat + integrasi ticketing; tawarkan managed service Telkom dengan portal SLA.',
    humanResourcesGap: 'Tim IT toko terbatas, troubleshooting sering eskalasi ke pusat sehingga recovery lambat.',
    humanResourcesImprovement: 'Managed service + L1 remote support; playbook & KB bilingual; sesi training rutin untuk PIC toko.',
    technologyDevelopmentGap: 'Pilot IoT/AI belum standar; edge compute berbeda-beda; data tidak terkurasi.',
    technologyDevelopmentImprovement: 'Standarisasi edge gateway + SD-WAN; co-innovation 5G MEC dengan Telkomsel untuk showroom/AR.',
    procurementGap: 'Pengadaan konektivitas/backup per toko; kontrak multi-vendor menambah lead time dan biaya.',
    procurementImprovement: 'Bundling DIA/MPLS/SD-WAN nasional dengan kontrak tunggal; billing terpusat dan opsi burstable.',
    inboundLogisticsGap: 'Visibility shipment impor ke DC belum real-time; masih mengandalkan update manual forwarder.',
    inboundLogisticsImprovement: 'IoT tracking container + geofencing; API ke ERP; konektivitas resilient di pelabuhan & DC.',
    operationsGap: 'Maintenance jaringan menyebabkan downtime WMS/QC; prioritas traffic belum konsisten.',
    operationsImprovement: 'Dual path + QoS untuk traffic produksi; maintenance window terjadwal; SD-WAN dengan aplikasi-aware routing.',
    outboundLogisticsGap: 'Bandwidth toko/warehouse tidak seragam; tracking 3PL kadang delay saat peak.',
    outboundLogisticsImprovement: 'Rollout DIA/MPLS tiered per toko + LTE backup; webhook/API ke 3PL untuk status real-time.',
    marketingSalesGap: 'Campaign besar sering bottleneck di WiFi/last mile; WiFi guest bercampur dengan POS.',
    marketingSalesImprovement: 'Segmentasi WiFi (POS vs guest) dengan captive portal analytics; bandwidth burst saat kampanye; CDN untuk microsite.',
    serviceGap: 'Contact center multichannel belum terintegrasi penuh; SLA service center bervariasi per kota.',
    serviceImprovement: 'Omnichannel CCaaS + WhatsApp; ticketing terpusat dengan KPI; recording/QA berbasis cloud.',
    marginGap: 'Biaya jaringan cabang tinggi karena multi-provider; downtime berdampak ke margin promo.',
    marginImprovement: 'Konsolidasi ke bundling Telkom + managed service; analytics pemakaian untuk optimasi paket; preventive maintenance untuk kurangi outage.',

    // Org structure & artifacts
    orgStructureFile: null,
    orgStructureNotes: html('Struktur organisasi terbagi ke divisi Enterprise, Retail, dan Support.'),
    valueChainFile: null,
    itRoadmapFile: null,
  },

  // Default fallback when a specific id is not found
  default: {
    companyName: 'Contoh Perusahaan Tbk',
    nipnas: '000000',
    segment: 'Teknologi & Telekomunikasi',
    subsegment: 'Layanan Digital',
    witel: 'JAKARTA',
    telephone: '(021) 123-4567',
    website: 'https://www.contoh.co.id',
    email: 'halo@contoh.co.id',
    branchCount: '5',
    address: 'Jl. Gatot Subroto No. 123, Jakarta',

    companyOverview: html('Perusahaan contoh untuk pengisian awal Account Profile.'),
    visionMission: html('Visi dan misi singkat perusahaan.'),
    strategicHighlights: html('Highlight strategi tahun berjalan.'),
    subsidiaries: html('PT Contoh Logistik, PT Contoh Teknologi'),

    priorityLevel: 'Top 50',
    assetValue: '100000000000',
    employeesRange: '100-1000',

    pics: [
      { id: 'pic-a', name: 'Surya Wiraputra', title: 'Account Manager', phone: '0812-3456-7890', email: 'surya@contoh.co.id', birthPlace: 'Jakarta', birthDate: '1990-05-01', education: 'S1 Teknik', hobbies: 'Lari', relationshipStatus: 'Promotor', decisionRole: 'Champion', avatar: null },
      { id: 'pic-b', name: 'Nadira Fadhila', title: 'Co-Account Manager', phone: '0813-2345-6789', email: 'nadira@contoh.co.id', birthPlace: 'Depok', birthDate: '1992-02-10', education: 'S1 Manajemen', hobbies: 'Mendaki', relationshipStatus: 'Neutral', decisionRole: 'Influencer', avatar: null },
    ],

    contracts: [ { id: 'ctr-a', title: 'DIA 300 Mbps HQ', contractDate: '2023-06-01', endDate: '2025-06-01' } ],
    financials: [ { id: 'fin-a', revenueYTD: '900', churnedProduct: '', churnDate: '' } ],
    notesRows: [ { id: 'note-a', churnReason: '', connectivityConfig: 'Dual path fiber; /29 WAN, /24 LAN.' } ],
    services: [ { id: 'srv-a', reportDate: '2024-09-09', serviceName: 'DIA HQ', hardComplaint: '—', urgency: 'Low', slgAchievement: '99.8', problemDescription: 'Tidak ada isu kritis' } ],

    competitorsProducts: [ { id: 'cp-a', competitorName: 'Competitor A', productService: 'Broadband Biz', endOfContract: '2025-01-01', totalRevYtd: '150' } ],
    competitorsPerformance: [ { id: 'cperf-a', competitorName: 'Competitor A', productName: 'Broadband Biz', voc: 'Positive', performanceDesc: 'Stabil, SLA sesuai.' } ],
    competitorsStrategy: [ { id: 'cstr-a', competitorName: 'Competitor A', businessStrategy: 'Harga agresif + kontrak tahunan' } ],

    fiveForcesEntrants: { rating: 'Medium', notes: '' },
    fiveForcesSubstitute: { rating: 'Low', notes: '' },
    fiveForcesBuyer: { rating: 'Medium', notes: '' },
    fiveForcesSupplier: { rating: 'Low', notes: '' },
    fiveForcesRivalry: { rating: 'High', notes: '' },

    strengths: 'Hubungan baik dengan vendor',
    weaknesses: 'Kapasitas tim terbatas',
    opportunities: 'Ekspansi cabang baru',
    threats: 'Kompetitor turunkan harga',

    orgStructureFile: null,
    orgStructureNotes: html('Struktur organisasi ringkas tersedia di dokumen internal.'),
    valueChainFile: null,
    itRoadmapFile: null,
  },
}

export default mockAccountProfiles
