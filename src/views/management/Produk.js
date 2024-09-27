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
  border: 2px solid #3b398c; /* Border berwarna primary */
  color: #3b398c; /* Sesuaikan warna teks jika diperlukan */
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  width: 150px;
  box-shadow: 0px 8px 20px rgba(59, 57, 140, 0.6); /* Shadow berwarna primary */
  transition: all 0.3s ease;

`;



const API_BASE_URL = 'http://168.168.10.12:2805/api';

const ManageProduk = () => {
  const [data, setData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleupdate, setVisibleUpdate] = useState(false);
  const [kategori, setKategori] = useState([]);
  const [subkategori, setSubkategori] = useState([]);
  const [formData, setFormData] = useState({
    selectedKategori: '',
    selectedSubkategori: '',
    namaProduk: '',
    hargaProduk: '',
    idProdukedit: '',
    idKategoriedit: '',
    idSubKategoriedit: '',
    namaProdukedit: '',
    hargaProdukedit: '',
    stokProdukedit: '',
    selectedKategoriedit: '',
    selectedSubkategoriedit: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `${token}` : ''
      };

    // Fetch subkategori data
    const subkategoriRes = await fetch(`${API_BASE_URL}/kategori/getdatasubkategori`, { headers });
    const subkategoriData = await subkategoriRes.json();
    setSubkategori(subkategoriData.data);
    // Fetch kategori data
    const kategoriRes = await fetch(`${API_BASE_URL}/kategori/getdatamainkategori`, { headers });
    const kategoriData = await kategoriRes.json();
    setKategori(kategoriData.data);

    const produkRes = await fetch(`${API_BASE_URL}/produk/getdataproduk`, { headers });
    const produkData = await produkRes.json();
    if (produkData.status === 200) {
      setData(produkData.data);
    } else {
      setData([]);
      showToastMessage('Gagal mengambil data produk', 'Gagal');
      return;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      p_id_kategori: formData.selectedKategori,
      p_id_subkategori: formData.selectedSubkategori,
      p_nama_produk: formData.namaProduk,
      p_harga_produk: parseInt(formData.hargaProduk, 10),
    };

    try {
      const response = await sendRequest('produk/adddataproduk', 'POST', submitData);
      if (response.status === 200) {
        await fetchData();
        showToastMessage('Berhasil menambahkan produk', 'Berhasil');
      } else {
        showToastMessage('Gagal menambahkan produk', 'Gagal');
      }
      setVisible(false);
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal');
    }
  };

  const handleSubmitedit = async (e) => {
    e.preventDefault();
    const submitData = {
      p_id_produk: formData.idProdukedit,
      p_id_subkategori: formData.idSubKategoriedit,
      p_nama_produk: formData.namaProdukedit,
      p_harga_produk: parseInt(formData.hargaProdukedit, 10),
      p_stok_produk: parseInt(formData.stokProdukedit, 10),
    };

    try {
      const response = await sendRequest('produk/updatedataproduk', 'POST', submitData);
      if (response.status === 200) {
        await fetchData();
        showToastMessage('Berhasil mengubah produk', 'Berhasil');
      } else {
        showToastMessage('Gagal mengubah produk', 'Gagal');
      }
      setVisibleUpdate(false);
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal');
    }
  };

  const handleEdit = (row) => {
    setFormData({
      idProdukedit: row.v_id_produk,
      idKategoriedit: row.v_id_kategori,
      idSubKategoriedit: row.v_id_subkategori,
      namaProdukedit: row.v_nama_produk,
      hargaProdukedit: row.v_harga_produk,
      stokProdukedit: row.v_stok_produk,
      selectedKategoriedit: row.v_kategori_produk,
      selectedSubkategoriedit: row.v_subkategori_produk
    });
    setVisibleUpdate(true);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await sendRequest('produk/deletedataproduk', 'POST', { p_id_produk: productId });
      if (response.status === 200) {
        await fetchData();
        showToastMessage('Berhasil menghapus produk', 'Berhasil');
      } else {
        showToastMessage('Gagal menghapus produk', 'Gagal');
      }
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal');
    }
  };

  const sendRequest = async (endpoint, method, body) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `${token}` : ''
      },
      body: JSON.stringify(body)
    });
    return response.json();
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const columnsProduk = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Kategori', selector: row => row.v_kategori_produk, sortable: true },
    { name: 'Sub-Kategori', selector: row => row.v_subkategori_produk, sortable: true },
    { name: 'Nama Produk', selector: row => row.v_nama_produk, sortable: true },
    { name: 'Harga Produk', selector: row => formatRupiah(row.v_harga_produk), sortable: true },
    { name: 'Stok Produk', selector: row => row.v_stok_produk, sortable: true },
    {
      name: 'Aksi',
      cell: (row) => (
        <>
          <TransparentButton onClick={() => handleDelete(row.v_id_produk)}>Hapus</TransparentButton>
        </>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
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

      <CModal visible={visible} onClose={() => setVisible(false)} aria-labelledby="ModalAddProduk">
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)'}}>
          <CModalTitle id="ModalAddProduk">Tambah Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedKategori" className="col-form-label">Kategori</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="selectedKategori"
                  name="selectedKategori"
                  onChange={handleInputChange}
                  value={formData.selectedKategori}
                >
                  <option value="">Pilih Kategori</option>
                  {kategori.map((kat) => (
                    <option key={kat.v_id_kategori} value={kat.v_name_kategori}>
                      {kat.v_name_kategori}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedSubkategori">Sub-Kategori</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="selectedSubkategori"
                  name="selectedSubkategori"
                  disabled={!formData.selectedKategori}
                  onChange={handleInputChange}
                  value={formData.selectedSubkategori}
                >
                  <option value="">Pilih Sub-Kategori</option>
                  {subkategori
                    .filter(sub => sub.v_name_kategori === formData.selectedKategori)
                    .map((sub) => (
                      <option key={sub.v_name_subkategori} value={sub.v_name_subkategori}>
                        {sub.v_name_subkategori}
                      </option>
                    ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Nama Produk</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaProduk"
                  name="namaProduk"
                  value={formData.namaProduk}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="hargaProduk">Harga Produk</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CInputGroup>
                  <CInputGroupText id="basic-addon1">Rp.</CInputGroupText>
                  <CFormInput
                    type="number"
                    id="hargaProduk"
                    name="hargaProduk"
                    value={formData.hargaProduk}
                    onChange={handleInputChange}
                  />
                </CInputGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }} onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)', border: '0px' }} type="submit">Save changes</CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal visible={visibleupdate} onClose={() => setVisibleUpdate(false)} aria-labelledby="ModalUpdateProduk">
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)'}}>
          <CModalTitle id="ModalUpdateProduk">Update Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitedit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedKategoriedit" className="col-form-label">Kategori</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="selectedKategoriedit"
                  name="selectedKategoriedit"
                  onChange={handleInputChange}
                  value={formData.selectedKategoriedit}
                  disabled
                >
                  <option value="">Pilih Kategori</option>
                  {kategori.map((kat) => (
                    <option key={kat.v_id_kategori} value={kat.v_name_kategori}>
                      {kat.v_name_kategori}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedSubkategoriedit">Sub-Kategori</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="selectedSubkategoriedit"
                  name="selectedSubkategoriedit"
                  onChange={handleInputChange}
                  value={formData.selectedSubkategoriedit}
                >
                  <option value="">Pilih Sub-Kategori</option>
                  {subkategori
                    .filter(sub => sub.v_name_kategori === formData.selectedKategoriedit)
                    .map((sub) => (
                      <option key={sub.v_name_subkategori} value={sub.v_name_subkategori}>
                        {sub.v_name_subkategori}
                      </option>
                    ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProdukedit">Nama Produk</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaProdukedit"
                  name="namaProdukedit"
                  value={formData.namaProdukedit}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="hargaProdukedit">Harga Produk</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CInputGroup>
                  <CInputGroupText id="basic-addon1">Rp.</CInputGroupText>
                  <CFormInput
                    type="number"
                    id="hargaProdukedit"
                    name="hargaProdukedit"
                    value={formData.hargaProdukedit}
                    onChange={handleInputChange}
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="stokProdukedit">Stok Produk</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    id="stokProdukedit"
                    name="stokProdukedit"
                    value={formData.stokProdukedit}
                    onChange={handleInputChange}
                  />
                  <CInputGroupText id="basic-addon2">Qty.</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }} onClick={() => setVisibleUpdate(false)}>
              Close
            </CButton>
            <CButton style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)', border: '0px' }} type="submit">Save changes</CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CCard className="mb-4">
        <CCardHeader>Tabel Data Produk</CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            onRowClicked={(row) => handleEdit(row)}
            pointerOnHover
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
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default ManageProduk
