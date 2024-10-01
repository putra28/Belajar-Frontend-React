import React, { useEffect, useState } from 'react'
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
  CCol,
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
`
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
`

const API_BASE_URL = 'http://168.168.10.12:2805/api'

const ManageProduk = () => {
  const [data, setData] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [visibleupdate, setVisibleUpdate] = useState(false)
  const [kategori, setKategori] = useState([])
  const [subkategori, setSubkategori] = useState([])
  const [subkategoriedit, setSubkategoriedit] = useState([])
  const [displayValue, setDisplayValue] = useState('');
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
    selectedSubkategoriedit: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `${token}` : '',
      }

      // Fetch kategori data
      const kategoriRes = await fetch(`${API_BASE_URL}/kategori/getdatakategori`, { headers })
      const kategoriData = await kategoriRes.json()
      setKategori(kategoriData.data)

      const produkRes = await fetch(`${API_BASE_URL}/produk/getdataproduk`, { headers })
      const produkData = await produkRes.json()
      if (produkData.status === 200) {
        setData(produkData.data)
      } else {
        setData([])
        showToastMessage('Gagal mengambil data produk', 'Gagal')
        return
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showToastMessage('Terjadi kesalahan saat mengambil data', 'Gagal')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleKategoriChange = (e) => {
    const kategoriId = e.target.value
    const selectedKategori = kategori.find((kat) => kat.v_id_kategori === parseInt(kategoriId))
    const subkategori = selectedKategori.v_subkategori
    setSubkategori(subkategori)

    setFormData((prev) => ({
      ...prev,
      selectedKategori: kategoriId,
      selectedSubkategori: subkategori.length > 0 ? subkategori[0].v_id_subkategori : '',
    }))
  }

  const handleKategorieditChange = (e) => {
    const kategoriId = e.target.value
    const selectedKategori = kategori.find((kat) => kat.v_id_kategori === parseInt(kategoriId))
    const subkategoriedit = selectedKategori.v_subkategori
    setSubkategoriedit(subkategoriedit)

    setFormData((prev) => ({
      ...prev,
      selectedKategoriedit: kategoriId,
      selectedSubkategoriedit:
        subkategoriedit.length > 0 ? subkategoriedit[0].v_id_subkategori : '',
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Jika nama input adalah hargaProdukedit
    if (name === "hargaProdukedit") {
      // Hapus koma dan simpan nilai asli di formData
      const rawValue = value.replace(/,/g, '');

      // Update formData dengan nilai asli
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: rawValue,
      }));

      // Format nilai untuk ditampilkan di input
      e.target.value = new Intl.NumberFormat().format(rawValue);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e) => {
    // Ambil nilai asli dari input tanpa koma
    let value = e.target.value.replace(/,/g, ''); // Menghilangkan koma dari tampilan

    // Cek apakah nilai input berupa angka
    if (!isNaN(value)) {
      // Simpan nilai asli ke state
      setFormData({ ...formData, hargaProduk: value });

      // Format nilai untuk tampilan dengan koma
      const formattedValue = new Intl.NumberFormat('id-ID').format(value);

      // Simpan nilai terformat untuk ditampilkan
      setDisplayValue(formattedValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_kategori: parseInt(formData.selectedKategori, 10),
      p_id_subkategori: parseInt(formData.selectedSubkategori, 10),
      p_nama_produk: formData.namaProduk,
      p_harga_produk: parseInt(formData.hargaProduk, 10),
    }

    try {
      const response = await sendRequest('produk/adddataproduk', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil menambahkan produk', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal menambahkan produk', 'Gagal')
      }
      setVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  const handleSubmitedit = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_produk: formData.idProdukedit,
      p_id_subkategori: formData.idSubKategoriedit,
      p_nama_produk: formData.namaProdukedit,
      p_harga_produk: parseInt(formData.hargaProdukedit, 10),
      p_stok_produk: parseInt(formData.stokProdukedit, 10),
    }

    // console.log(submitData);
    try {
      const response = await sendRequest('produk/updatedataproduk', 'POST', submitData)
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil mengubah produk', 'Berhasil')
      } else {
        showToastMessage('Gagal mengubah produk', 'Gagal')
      }
      setVisibleUpdate(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  const handleEdit = (row) => {
    // Cari kategori yang dipilih berdasarkan ID kategori dari produk
  const selectedKategori = kategori.find((kat) => kat.v_id_kategori === row.v_id_kategori);

  // Set subkategori yang sesuai
  const subkategoriTerkait = selectedKategori ? selectedKategori.v_subkategori : [];

  setSubkategoriedit(subkategoriTerkait);
    setFormData({
      idProdukedit: row.v_id_produk,
      idKategoriedit: row.v_id_kategori,
      idSubKategoriedit: row.v_id_subkategori,
      namaProdukedit: row.v_nama_produk,
      hargaProdukedit: row.v_harga_produk,
      stokProdukedit: row.v_stok_produk,
      selectedKategoriedit: row.v_id_kategori,
      selectedSubkategoriedit: row.v_id_subkategori,
    })
    setVisibleUpdate(true)
  }

  const handleDelete = async (productId) => {
    try {
      const response = await sendRequest('produk/deletedataproduk', 'POST', {
        p_id_produk: productId,
      })
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil menghapus produk', 'Berhasil')
      } else {
        showToastMessage('Gagal menghapus produk', 'Gagal')
      }
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

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

  const showToastMessage = (message, type) => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number)
  }

  const columnsProduk = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Kategori', selector: (row) => row.v_kategori_produk, sortable: true },
    { name: 'Sub-Kategori', selector: (row) => row.v_subkategori_produk, sortable: true },
    { name: 'Nama Produk', selector: (row) => row.v_nama_produk, sortable: true },
    { name: 'Harga Produk', selector: (row) => formatRupiah(row.v_harga_produk), sortable: true },
    { name: 'Stok Produk', selector: (row) => row.v_stok_produk, sortable: true },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDelete(row.v_id_produk)}>
          Hapus
        </TransparentButton>
      ),
      center: true,
      width: '150px',
    },
  ]

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  createTheme(
    'transparent',
    {
      text: { primary: 'white' },
      background: { default: 'transparent' },
    },
    'dark',
  )

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
          <CToastHeader
            style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}
          >
            <strong className="me-auto">{toastType}</strong>
          </CToastHeader>
          <CToastBody>{toastMessage}</CToastBody>
        </CToast>
      )}

      <CModal visible={visible} onClose={() => setVisible(false)} aria-labelledby="ModalAddProduk">
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="ModalAddProduk">Tambah Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedKategori" className="col-form-label">
                  Kategori
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="selectedKategori"
                  name="selectedKategori"
                  onChange={(e) => {
                    handleInputChange(e)
                    handleKategoriChange(e)
                  }}
                  value={formData.selectedKategori} // Change this line
                >
                  <option value="">Pilih Kategori</option>
                  {kategori.map((kat) => (
                    <option key={kat.v_id_kategori} value={kat.v_id_kategori}>
                      {kat.v_nama_kategori}
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
                  {subkategori.map((sub) => (
                    <option key={sub.v_id_subkategori} value={sub.v_id_subkategori}>
                      {sub.v_nama_subkategori}
                    </option>
                  ))}
                  {/* {subkategori
                    .filter(sub => sub.v_name_kategori === formData.selectedKategori)
                    .map((sub) => (
                      <option key={sub.v_name_subkategori} value={sub.v_name_subkategori}>
                        {sub.v_name_subkategori}
                      </option>
                    ))} */}
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
                    type="text"
                    id="hargaProduk"
                    name="hargaProduk"
                    value={displayValue}
                    onChange={handleNumberChange}
                    placeholder="Masukkan harga"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => setVisible(false)}
            >
              Close
            </CButton>
            <CButton
              style={{
                background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)',
                border: '0px',
              }}
              type="submit"
            >
              Save changes
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal
        visible={visibleupdate}
        onClose={() => setVisibleUpdate(false)}
        aria-labelledby="ModalUpdateProduk"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="ModalUpdateProduk">Update Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitedit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedKategoriedit" className="col-form-label">
                  Kategori
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  name="selectedKategoriedit"
                  value={formData.selectedKategoriedit}
                  onChange={handleKategorieditChange}
                  disabled
                >
                  <option value="">Pilih Kategori</option>
                  {kategori.map((kat) => (
                    <option key={kat.v_id_kategori} value={kat.v_id_kategori}>
                      {kat.v_nama_kategori}
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
                  name="selectedSubkategoriedit"
                  value={formData.selectedSubkategoriedit}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Sub - kategori</option>
                  {subkategoriedit.map((sub) => (
                    <option key={sub.v_id_subkategori} value={sub.v_id_subkategori}>
                      {sub.v_nama_subkategori}
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
                    type="text"
                    id="hargaProdukedit"
                    name="hargaProdukedit"
                    value={formData.hargaProdukedit ? new Intl.NumberFormat().format(formData.hargaProdukedit) : ''}
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
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => setVisibleUpdate(false)}
            >
              Close
            </CButton>
            <CButton
              style={{
                background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)',
                border: '0px',
              }}
              type="submit"
            >
              Save changes
            </CButton>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '20%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid transparent',
                backgroundColor: '#1d222b',
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
              className: 'CustomDropdownMenu',
            }}
            highlightOnHover
            theme="transparent"
            subHeader
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default ManageProduk
