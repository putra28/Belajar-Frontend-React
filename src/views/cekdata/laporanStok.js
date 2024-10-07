import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CToast, CToastBody, CButton,
  CToastHeader, CModal, CModalBody, CModalHeader, CModalFooter,
  CModalTitle, CForm, CFormLabel, CFormInput, CFormSelect,
  CInputGroup, CInputGroupText, CRow, CCol, CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem
} from '@coreui/react'
import DataTable, { createTheme } from 'react-data-table-component'
import styled from 'styled-components'

const GradientButton = styled(CButton)`
  background: linear-gradient(135deg, #1c1b38, #3b398c, #6261cc);
  border: 0;
  color: white;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  width: 150px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.6);
`;

const TransparentButton = styled(CButton)`
  background: transparent;
  border: 2px solid linear-gradient(135deg, #1c1b38, #3b398c, #6261cc);
  color: white;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  width: 150px;
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;
`;

const API_BASE_URL = 'http://168.168.10.12:2805/api';

const CekdataStok = () => {
  const [data, setData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subkategoriModalVisible, setSubkategoriModalVisible] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [formData, setFormData] = useState({
    idTransaksi: '',
    idDetailTransaksi: '',
    idPetugas: '',
    DetailTransaksi: '',
    namaPetugas: '',
    namaPelanggan: '',
    kuantitasTransaksi: '',
    totalBayar: '',
    totalHarga: '',
    totalKembalian: '',
    tanggalTransaksi: '',
    namaKategori: '',
    namaSubKategori: '',
    namaProduk: '',
    hargaProduk: '',
    kuantitasProduk: ''
  })

  const sendRequest = async (endpoint, method, body) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `${token}` : '',
      },
      body: JSON.stringify(body),
    })
    return response.json()
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `${token}` : ''
      };

      const response = await fetch(`${API_BASE_URL}/laporanstok/getlaporanstok`, { headers });
      const result = await response.json();

      if (result.status === 200) {
        setData(result.data);
        showToastMessage('Berhasil Mengambil Data Laporan Stok', 'Berhasil')
      } else {
        setData([]);
        showToastMessage('Gagal Mengambil Data Laporan Stok', 'Gagal');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToastMessage('Terjadi Kesalahan Saat Mengambil Data', 'Gagal');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const columnsLaporanstok = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Nama Produk', selector: row => row.nama_produk, sortable: true },
    { name: 'Stok Semula', selector: row => row.stok_semula, sortable: true },
    { name: 'Perubahan Stok', selector: row => row.perubahan_stok, sortable: true },
    { name: 'Alasan Perubahan', selector: row => row.aksi_stok, sortable: true },
    { name: 'Date laporan', selector: row => row.tanggal_laporan, sortable: true },
  ];

  const filteredData = data.filter(item =>
    Object.keys(item).some(key => item[key].toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  createTheme('transparent', {
    text: { primary: 'white' },
    background: { default: 'transparent' }
  }, 'dark');

  return (
    <>
      {showToast && (
        <CToast
          autohide={false}
          visible={true}
          className="position-fixed top-0 end-0 m-4"
          style={{ zIndex: 1060 }}
          onClick={() => setShowToast(false)}
        >
          <CToastHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
            <strong className="me-auto">{toastType}</strong>
          </CToastHeader>
          <CToastBody>{toastMessage}</CToastBody>
        </CToast>
      )}

      <CCard className="mb-4">
        <CCardHeader>Tabel Histori Aktifitas</CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '20%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid transparent',
                backgroundColor: '#1d222b'
              }}
            />
          </div>
          <DataTable
            columns={columnsLaporanstok}
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
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default CekdataStok
