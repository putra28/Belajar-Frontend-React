import React, { useEffect, useState, createRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import DataTable, { createTheme } from 'react-data-table-component'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

const CekdataAktifitas = () => {
  const [data, setData] = useState([]) // State for table data
  const [showToast, setShowToast] = useState(false) // State to control toast visibility
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://168.168.10.12:2805/retielAPI/getLogActivity');
      const result = await response.json();
      if (result.Status === 'success') {
        setData(result.Data);
        toast.success(result.Message);
      } else {
        setData([]);
        toast.error(result.Message);
      }
    } catch (error) {
      setData([]);
      toast.error('Gagal mengambil data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (datetime) => {
    return datetime.replace('T', ' ').split('.')[0];
  };

  const columnsProduk = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Nama Pengguna',
      selector: row => row.M_namePengguna,
      sortable: true,
    },
    {
      name: 'Detail Aktifitas',
      selector: row => row.M_activityLog,
      sortable: true,
    },
    {
      name: 'Tanggal Aktifitas',
      selector: row => formatDateTime(row.M_DateActivity),
      sortable: true,
    },
  ];

  const filteredData = data.filter(item =>
    Object.values(item).some(
      val => val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // createTheme creates a new theme named solarized that overrides the build in dark theme
  createTheme('transparent', {
    text: {
      primary: 'white',
    },
    background: {
      default: 'transparent',
    }
  }, 'dark');

  return (
    <>
      {/* Toast notification */}
      <ToastContainer draggable closeOnClick  />

      {/* Table to display product data */}
      <CCard className="mb-4">
        <CCardHeader>
          Tabel Histori Aktifitas
        </CCardHeader>
        <CCardBody>
          <DataTable
            columns={columnsProduk}
            data={filteredData}
            progressPending={loading}
            pagination
            paginationComponentOptions={{
              rowsPerPageText: 'Baris per halaman:',
              rangeSeparatorText: 'dari',
              selectAllRowsItem: true,
              selectAllRowsItemText: 'Semua',
              className: 'CustomDropdownMenu'
            }}
            highlightOnHover
            theme='transparent'
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '20%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid transparent',
                  backgroundColor: '#1d222b'
                }}
              />
            }
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default CekdataAktifitas


