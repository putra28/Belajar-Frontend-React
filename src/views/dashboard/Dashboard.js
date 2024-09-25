import React from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcMastercard,
  cibCcVisa,
  cilPeople,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        registered: '2024-09-09 08:14:27',
      },
      member: {
        name: 'Member 1',
      },
      kuantitas: { value: '2'},
      total: 'Rp. 999.999',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        registered: '2024-09-09 08:14:27',
      },
      member: {
        name: 'Member 1',
      },
      kuantitas: {
        value: '2'
      },
      total: 'Rp. 999.999',
    },
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Transaksi Terakhir</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Nama Petugas</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Nama Pelanggan</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Kuantitas
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Total Transaksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.member.name}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{item.kuantitas.value}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Format Rupiah</div>
                        <div className="fw-semibold text-nowrap">{item.total}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
