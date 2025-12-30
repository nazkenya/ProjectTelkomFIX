// src/data/mockCustomerDetails.js

const detailsById = {
  // Contoh satu customer (nanti bisa ditambah samsung, tokopedia, dsb)
  'stain-kerinci': {
    customerNumber: '1234567',
    industry: 'Teknologi & Telekomunikasi',
    subIndustry: 'Penyedia Layanan Digital',
    region: 'Jakarta Pusat',
    headOfficeAddress:
      'Gedung XII Lantai 3, Jl. Jend. Sudirman No. Kav 52-53, Jakarta Pusat',
    mainPhone: '(021) 555-0101',
    website: 'https://www.contoh-perusahaan.co.id',

    contacts: {
      picUtama: [
        {
          name: 'Bg Ade Putra',
          title: 'Direktur',
          email: 'ade.putra@example.com',
          phone: '(021) 555-0101',
        },
        {
          name: 'Dini Safitri',
          title: 'Sekretaris',
          email: 'dini.safitri@example.com',
          phone: '(021) 555-8123',
        },
      ],

      accountManager: [
        {
          name: 'Vino Harasaditya Saputra',
          title: 'Account Manager',
          email: 'vino.saputra@company.co.id',
          phone: '0812-3456-7890',
        },
        {
          name: 'Yunisa Putri',
          title: 'Co-Account Manager',
          email: 'yunisa.putri@company.co.id',
          phone: '0813-2345-6789',
        },
      ],

      engineerOnSite: [
        {
          name: 'Rama Putra',
          title: 'Onsite Engineer',
          email: 'rama.putra@example.com',
          phone: '(021) 555-0199',
        },
        {
          name: 'Sari Wulandari',
          title: 'Support Engineer',
          email: 'sari.wulandari@example.com',
          phone: '(021) 555-0220',
        },
      ],
    },
  },

  // DEFAULT — tetap ada PIC & AM
  default: {
    customerNumber: '123456',
    industry: 'Teknologi & Telekomunikasi',
    subIndustry: 'Elektronik Konsumen',
    region: 'Jakarta',
    headOfficeAddress: 'Jl. Gatot Subroto No. 123, Jakarta',
    mainPhone: '(021) 123-4567',
    website: 'https://www.samsung.com',

    contacts: {
      picUtama: [
        {
          name: 'Rina Prameswari',
          title: 'Direktur Utama',
          email: 'rina.prameswari@example.com',
          phone: '(021) 111-1111',
        },
        {
          name: 'Dimas Ardianto',
          title: 'Manajer Administrasi',
          email: 'dimas.ardianto@example.com',
          phone: '(021) 222-2222',
        },
      ],

      accountManager: [
        {
          name: 'Surya Wiraputra',
          title: 'Account Manager',
          email: 'surya.wiraputra@company.co.id',
          phone: '0812-3456-7890',
        },
        {
          name: 'Nadira Fadhila',
          title: 'Co-Account Manager',
          email: 'nadira.fadhila@company.co.id',
          phone: '0813-2345-6789',
        },
      ],

      engineerOnSite: [
        {
          name: 'Arya Putranto',
          title: 'Onsite Engineer',
          email: 'arya.putranto@example.com',
          phone: '(021) 333-3333',
        },
        {
          name: 'Salsa Ayuningtyas',
          title: 'Support Engineer',
          email: 'salsa.ayuningtyas@example.com',
          phone: '(021) 444-4444',
        },
      ],
    },
  },

}

export default detailsById
