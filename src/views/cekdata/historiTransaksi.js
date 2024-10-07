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

const CekdataTransaksi = () => {
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

      const response = await fetch(`${API_BASE_URL}/transaksi/getalldatatransaksi`, { headers });
      const result = await response.json();

      if (result.status === 200) {
        setData(result.data);
        showToastMessage('Berhasil Mengambil Data Histori Transaksi', 'Berhasil')
      } else {
        setData([]);
        showToastMessage('Gagal Mengambil Data Histori Transaksi', 'Gagal');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDelete = async (id_kategori) => {
    try {
      const response = await sendRequest('kategori/deletedatakategori', 'POST', {
        p_id_kategori: id_kategori,
      })
      console.log(response);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menghapus Kategori', 'Berhasil')
      } else {
        showToastMessage('Gagal Menghapus Kategori', 'Gagal')
      }
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  const columnsTransaksi = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Nama Petugas', selector: row => row.v_nama_pengguna, sortable: true },
    { name: 'Nama Member', selector: row => row.v_nama_pelanggan, sortable: true },
    { name: 'Kuantitas', selector: row => row.v_quantity_transaksi, sortable: true },
    { name: 'Total Harga', selector: row => row.v_total_price, sortable: true },
    { name: 'Tanggal Trx.', selector: row => row.v_date_transaksi, sortable: true },
    // {
    //   name: 'Aksi',
    //   cell: (row) => (
    //     <TransparentButton onClick={() => handleDelete(row.v_id_transaksi)}>
    //       Hapus
    //     </TransparentButton>
    //   ),
    //   center: true,
    //   width: '150px',
    // },
  ];

  const columnsDetail = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true, width: '50px' },
    { name: 'Nama Kategori', selector: row => row.v_name_kategori, sortable: true },
    { name: 'Nama Sub-Kategori', selector: row => row.v_name_subkategori, sortable: true },
    { name: 'Nama Produk', selector: row => row.v_name_produk, sortable: true },
    { name: 'Harga Produk', selector: row => row.v_price_produk, sortable: true },
    { name: 'Kuantitas', selector: row => row.v_quantity_produk, sortable: true },
  ];

  const handleRowClick = (row) => {
    setSelectedTransaksi(row);
    setFormData({
      idTransaksi: row.v_id_transaksi, DetailTransaksi: row.v_detail_transaksi, idPetugas: row.v_id_pengguna,
      namaPetugas: row.v_nama_pengguna, namaPelanggan: row.v_nama_pelanggan, kuantitasTransaksi: row.v_quantity_transaksi,
      totalBayar: row.v_total_payment, totalHarga: row.v_total_price, totalKembalian: row.v_total_change,
      tanggalTransaksi: row.v_date_transaksi,
    })
    setSubkategoriModalVisible(true);
  };

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

      <CModal
        visible={subkategoriModalVisible}
        onClose={() => setSubkategoriModalVisible(false)}
        size="lg"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle>Detail Transaksi</CModalTitle>
        </CModalHeader>
        <CForm>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="tanggalTransaksi" className="col-form-label">
                  Tanggal Transaksi
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="tanggalTransaksi"
                  name="tanggalTransaksi"
                  value={formData.tanggalTransaksi}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaPetugas" className="col-form-label">
                  Nama Petugas
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaPetugas"
                  name="namaPetugas"
                  value={formData.namaPetugas}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaPelanggan" className="col-form-label">
                  Nama Pelanggan
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaPelanggan"
                  name="namaPelanggan"
                  value={formData.namaPelanggan}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="kuantitasTransaksi" className="col-form-label">
                  Kuantitas Transaksi
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="kuantitasTransaksi"
                  name="kuantitasTransaksi"
                  value={formData.kuantitasTransaksi}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="totalBayar" className="col-form-label">
                  Total Bayar
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="totalBayar"
                  name="totalBayar"
                  value={formData.totalBayar}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="totalHarga" className="col-form-label">
                  Total Harga
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="totalHarga"
                  name="totalHarga"
                  value={formData.totalHarga}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="totalKembalian" className="col-form-label">
                  Total Kembalian
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="totalKembalian"
                  name="totalKembalian"
                  value={formData.totalKembalian}
                  onChange={handleInputChange}
                  readOnly
                  plainText
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol sm={12}>
                <DataTable
                  columns={columnsDetail}
                  data={selectedTransaksi?.v_detail_transaksi || []}
                  pagination
                  theme='transparent'
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => setSubkategoriModalVisible(false)}
            >
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CCard className="mb-4">
        <CCardHeader>Tabel Histori Transaksi</CCardHeader>
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
            onRowClicked={handleRowClick}
            pointerOnHover
            columns={columnsTransaksi}
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

export default CekdataTransaksi
