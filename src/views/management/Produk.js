import React, { useEffect, useState, createRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CToast,
  CToastBody,
  CButton,
  CToastHeader,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol
} from '@coreui/react'
import DataTable, { createTheme } from 'react-data-table-component'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

const GradientButton = styled(CButton)`
  background: linear-gradient(135deg, #1c1b38, #3b398c, #6261cc);
  border: 0px;
  color: white;
  border-radius: 4px;
  padding: 8px;
  margin-right: 10px;
  width: 150px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.6);
`;

const ManageProduk = () => {
  const [data, setData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [kategori, setKategori] = useState([]);
  const [subkategori, setSubkategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedSubkategori, setSelectedSubkategori] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaProduk, setHargaProduk] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://168.168.10.12:2805/api/produk/getdataproduk', {
          method: 'GET', // Pastikan menggunakan method GET
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `${token}` : '' // Menambahkan header Authorization
          }
      });
      const response_subkategori = await fetch('http://168.168.10.12:2805/api/kategori/getdatasubkategori', {
          method: 'GET', // Pastikan menggunakan method GET
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `${token}` : '' // Menambahkan header Authorization
          }
      });
      const response_kategori = await fetch('http://168.168.10.12:2805/api/kategori/getdatamainkategori', {
          method: 'GET', // Pastikan menggunakan method GET
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `${token}` : '' // Menambahkan header Authorization
          }
      });
      const result = await response.json();
      const result_subkategori = await response_subkategori.json();
      const result_kategori = await response_kategori.json();
      console.log(result);
      if (result.status === 200) {
        setData(result.data);
        setToastMessage(result.notification_response);
        setToastType('Berhasil');
        setSubkategori(result_subkategori.data);
        setKategori(result_kategori.data);
      } else {
        setData([]);
        setToastMessage(result.notification_response);
        setToastType('Gagal');
      }
    } catch (error) {
      setData([]);
      setToastMessage('Gagal mengambil data');
      setToastType('Gagal');
    }
    setShowToast(true);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleKategoriChange = (e) => {
    const selected = e.target.value;
    setSelectedKategori(selected);
  };

  const handleSubkategoriChange = (e) => {
    setSelectedSubkategori(e.target.value);
  };

  // Handle perubahan nama produk
  const handleNamaProdukChange = (e) => {
    setNamaProduk(e.target.value);
  };

  // Handle perubahan harga produk
  const handleHargaProdukChange = (e) => {
    setHargaProduk(e.target.value);
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      p_id_kategori: selectedKategori,
      p_id_subkategori: selectedSubkategori,
      p_nama_produk: namaProduk,
      p_harga_produk: hargaProduk
    };

    // Cetak JSON ke console
    console.log('Data Produk:', JSON.stringify(formData));

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://168.168.10.12:2805/api/produk/adddataproduk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `${token}` : ''
            },
            body: JSON.stringify(formData)
        });
        const response_get = await fetch('http://168.168.10.12:2805/api/produk/getdataproduk', {
            method: 'GET', // Pastikan menggunakan method GET
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `${token}` : '' // Menambahkan header Authorization
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const result = await response_get.json();
        console.log('Response dari server:', data);
        if (data.status === 200) {
          // fetchData();
          setData(result.data);
          setToastMessage('Berhasil menambahkan produk');
          setToastType('Berhasil');
        } else {
          setToastMessage('Gagal menambahkan produk');
          setToastType('Gagal');
        }
        setVisible(false);
    } catch (error) {
      setToastMessage('Terjadi Kesalahan');
      setToastType('Gagal');
      console.error('Terjadi kesalahan:', error);
    }
    setShowToast(true);
  };

  const filteredSubkategori = subkategori.filter(
    (sub) => sub.v_name_kategori === selectedKategori
  );

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const columnsProduk = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Kategori',
      selector: row => row.v_kategori_produk,
      sortable: true,
    },
    {
      name: 'Sub-Kategori',
      selector: row => row.v_subkategori_produk,
      sortable: true,
    },
    {
      name: 'Nama Produk',
      selector: row => row.v_nama_produk,
      sortable: true,
    },
    {
      name: 'Harga Produk',
      selector: row => formatRupiah(row.v_harga_produk),
      sortable: true,
    },
    {
      name: 'Stok Produk',
      selector: row => row.v_stok_produk,
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
      {showToast && (
        <CToast
          autohide={false}
          visible={true}
          className="position-fixed top-0 end-0 m-4"
          style={{ zIndex: 1060 }}
          onClick={() => setShowToast(false)}
        >
          <CToastHeader
            style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}
          >
            <strong className="me-auto">{toastType}</strong>
          </CToastHeader>
          <CToastBody>
            {toastMessage}
          </CToastBody>
        </CToast>
      )}

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)'}}>
          <CModalTitle id="LiveDemoExampleLabel">Tambah Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
              <CRow className="mb-3">
                <CCol sm={4} >
                  <CFormLabel htmlFor="txt_kategori" className="col-sm-2 col-form-label">Kategori</CFormLabel>
                </CCol>
                <CCol sm={8} >
                <CFormSelect
                  id="txt_kategori"
                  name="txt_kategori"
                  onChange={handleKategoriChange}
                  value={selectedKategori}
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
                <CCol sm={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <CFormLabel htmlFor="txt_subkategori">Sub-Kategori</CFormLabel>
                </CCol>
                <CCol sm={8} >
                <CFormSelect
                  id="txt_subkategori"
                  name="txt_subkategori"
                  disabled={!selectedKategori || filteredSubkategori.length === 0}
                  onChange={handleSubkategoriChange}
                  value={selectedSubkategori}
                >
                  <option value="">Pilih Sub-Kategori</option>
                    {filteredSubkategori.map((sub) => (
                      <option key={sub.v_name_subkategori} value={sub.v_name_subkategori}>
                        {sub.v_name_subkategori}
                      </option>
                    ))}
                </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <CFormLabel htmlFor="txt_nama_produk">Nama Produk</CFormLabel>
                </CCol>
                <CCol sm={8} >
                  <CFormInput
                    type="text"
                    id="txt_nama_produk"
                    name="txt_nama_produk"
                    value={namaProduk}
                    onChange={handleNamaProdukChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <CFormLabel htmlFor="txt_harga_produk">Harga Produk</CFormLabel>
                </CCol>
                <CCol sm={8} >
                  <CInputGroup className="mb-3">
                    <CInputGroupText id="basic-addon1">Rp.</CInputGroupText>
                    <CFormInput
                      type="number"
                      id="txt_harga_produk"
                      name="txt_harga_produk"
                      value={hargaProduk}
                      onChange={handleHargaProdukChange}
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

      {/* Table to display product data */}
      <CCard className="mb-4">
        <CCardHeader>
          Tabel Data Produk
        </CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <GradientButton
              onClick={() => setVisible(!visible)}
            >
              Add Data
            </GradientButton>
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

