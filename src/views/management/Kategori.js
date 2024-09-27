import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CToast, CToastBody, CButton,
  CToastHeader, CModal, CModalBody, CModalHeader, CModalFooter,
  CModalTitle, CForm, CFormLabel, CFormInput, CFormSelect,
  CInputGroup, CInputGroupText, CRow, CCol
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
  border: 2px solid #3b398c;
  color: #3b398c;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  width: 150px;
  box-shadow: 0px 8px 20px rgba(59, 57, 140, 0.6);
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;
`;

const API_BASE_URL = 'http://168.168.10.12:2805/api';

const ManageKategori = () => {
  const [data, setData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [subkategoriModalVisible, setSubkategoriModalVisible] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `${token}` : ''
      };

      const response = await fetch(`${API_BASE_URL}/kategori/getdatakategori`, { headers });
      const result = await response.json();

      if (result.status === 200) {
        setData(result.data);
      } else {
        setData([]);
        showToastMessage('Gagal mengambil data kategori', 'Gagal');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToastMessage('Terjadi kesalahan saat mengambil data', 'Gagal');
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

  const columnsKategori = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Kategori', selector: row => row.v_nama_kategori, sortable: true },
    { name: 'Total Sub-Kategori', selector: row => row.v_subkategori.length, sortable: true },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDelete(row.v_id_subkategori)}>
          Hapus
        </TransparentButton>
      ),
      center: true,
      width: '150px',
    },
  ];

  const columnsSubkategori = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Nama Sub-Kategori', selector: row => row.v_nama_subkategori, sortable: true },
    { name: 'Tanggal Dibuat', selector: row => row.v_created_at, sortable: true },
    { name: 'Terakhir Diupdate', selector: row => row.v_updated_at, sortable: true },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDelete(row.v_id_subkategori)}>
          Hapus
        </TransparentButton>
      ),
      center: true,
      width: '150px',
    },
  ];

  const handleRowClick = (row) => {
    setSelectedKategori(row);
    setSubkategoriModalVisible(true);
  };

  const filteredData = data.filter(item =>
    item.v_nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
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

      <CModal
        visible={subkategoriModalVisible}
        onClose={() => setSubkategoriModalVisible(false)}
        size="lg"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle>Sub-Kategori untuk {selectedKategori?.v_nama_kategori}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <DataTable
            columns={columnsSubkategori}
            data={selectedKategori?.v_subkategori || []}
            pagination
            theme='transparent'
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
            onClick={() => setSubkategoriModalVisible(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CCard className="mb-4">
        <CCardHeader>Tabel Data Kategori</CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <GradientButton onClick={() => setVisible(!visible)}>Add Data</GradientButton>
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
            onRowClicked={handleRowClick}
            pointerOnHover
            columns={columnsKategori}
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

export default ManageKategori
