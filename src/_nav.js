import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCart,
  cilUser,
  cilFastfood,
  cilAlignLeft,
  cilAddressBook,
  cilTruck,
  cilMoney,
  cilChartLine,
  cilInfo,
  cilSpeedometer,
  cilInput
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'dark',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Transaksi',
  },
  {
    component: CNavItem,
    name: 'Halaman Transaksi',
    to: '/transaksi',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavItem,
    name: 'Data Produk',
    to: '/manage/produk',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Kategori',
    to: '/manage/kategori',
    icon: <CIcon icon={cilAlignLeft} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Users',
    to: '/manage/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Supplier',
    to: '/manage/supplier',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Members',
    to: '/manage/members',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Cek Data',
  },
  {
    component: CNavItem,
    name: 'Histori Transaksi',
    to: '/cekdata/transaksi',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Laporan Keuangan',
    to: '/cekdata/laporankeuangan',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Histori Aktifitas',
    to: '/cekdata/logaktifitas',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Laporan Stok',
    to: '/cekdata/laporanstok',
    icon: <CIcon icon={cilInput} customClassName="nav-icon" />,
  }
]

export default _nav
