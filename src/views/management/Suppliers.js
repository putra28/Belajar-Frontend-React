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
  CFormTextarea,
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

const ManageSupplier = () => {
  const [data, setData] = useState([]) // State for table data
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addmodalvisible, setAddModalVisible] = useState(false);
  const [editmodalvisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    add_nama_pemasok: '',
    add_kontak_pemasok: '',
    add_alamat_pemasok: '',
    edit_id_pemasok: '',
    edit_nama_pemasok: '',
    edit_kontak_pemasok: '',
    edit_alamat_pemasok: '',
  })

  const showToastMessage = (message, type) => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/pemasok/getdatapemasok`, {
          method: 'GET', // Pastikan menggunakan method GET
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `${token}` : '' // Menambahkan header Authorization
          }
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 200) {
        setData(result.data);
        showToastMessage('Berhasil Mengambil Data Supplier', 'Berhasil')
      } else {
        setData([]);
        showToastMessage('Gagal Mengambil Data Supplier', 'Gagal')
      }
    } catch (error) {
      setData([]);
      showToastMessage('Terjadi Kesalahan Saat Mengambil Data', 'Gagal')
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    const submitData = {
      p_nama_pemasok: formData.add_nama_pemasok,
      p_kontak_pemasok: formData.add_kontak_pemasok,
      p_alamat_pemasok: formData.add_alamat_pemasok,
    }

    try {
      const response = await sendRequest('pemasok/adddatapemasok', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menambahkan Supplier', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Menambahkan Supplier', 'Gagal')
      }
      setAddModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
      console.log('gagal menambahkan data: ', error)
    }
  }

  const handleEditModal = (row) => {
    setFormData({
      edit_id_pemasok: row.v_id_pemasok,
      edit_nama_pemasok: row.v_nama_pemasok,
      edit_kontak_pemasok: row.v_kontak_pemasok,
      edit_alamat_pemasok: row.v_alamat_pemasok
    })
    setEditModalVisible(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_pemasok: formData.edit_id_pemasok,
      p_nama_pemasok: formData.edit_nama_pemasok,
      p_kontak_pemasok: formData.edit_kontak_pemasok,
      p_alamat_pemasok: formData.edit_alamat_pemasok
    }

    try {
      const response = await sendRequest('pemasok/updatedatapemasok', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Mengubah Supplier', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Mengubah Supplier', 'Gagal')
      }
      setEditModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
      console.log('gagal menambahkan user: ', error)
    }
  }

  const handleDelete = async (pemasokId) => {
    try {
      const response = await sendRequest('pemasok/deletedatapemasok', 'POST', {
        p_id_pemasok: pemasokId,
      })
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menghapus Supplier', 'Berhasil')
      } else {
        showToastMessage('Gagal Menghapus Supplier', 'Gagal')
      }
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  const columnsPemasok = [
    {
      name: 'No.', selector: (row, index) => index + 1, sortable: true,
    },
    {
      name: 'Nama Supplier', selector: row => row.v_nama_pemasok, sortable: true,
    },
    {
      name: 'Kontak Supplier', selector: row => row.v_kontak_pemasok, sortable: true,
    },
    {
      name: 'Alamat Supplier', selector: row => row.v_alamat_pemasok, sortable: true,
    },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDelete(row.v_id_pemasok)}>
          Hapus
        </TransparentButton>
      ),
      center: true,
      width: '150px',
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

      {/* Add Modal */}
      <CModal visible={addmodalvisible} onClose={() => setAddModalVisible(false)} aria-labelledby="ModalAddProduk">
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="ModalAddProduk">Tambah Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitAdd}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Nama Supplier</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="add_nama_pemasok"
                  name="add_nama_pemasok"
                  value={formData.add_nama_pemasok}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Kontak</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="add_kontak_pemasok"
                  name="add_kontak_pemasok"
                  value={formData.add_kontak_pemasok}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Alamat</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormTextarea
                  type="text"
                  id="add_alamat_pemasok"
                  name="add_alamat_pemasok"
                  value={formData.add_alamat_pemasok}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => setAddModalVisible(false)}
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

      {/* Edit Modal */}
      <CModal visible={editmodalvisible} onClose={() => setEditModalVisible(false)} aria-labelledby="ModalEdit">
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="ModalEdit">Tambah Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitEdit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Nama Supplier</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="edit_nama_pemasok"
                  name="edit_nama_pemasok"
                  value={formData.edit_nama_pemasok}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Kontak</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="edit_kontak_pemasok"
                  name="edit_kontak_pemasok"
                  value={formData.edit_kontak_pemasok}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Alamat</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormTextarea
                  type="text"
                  id="edit_alamat_pemasok"
                  name="edit_alamat_pemasok"
                  value={formData.edit_alamat_pemasok}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => setEditModalVisible(false)}
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

      {/* Table to display product data */}
      <CCard className="mb-4">
        <CCardHeader>
          Tabel Data Supplier
        </CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <GradientButton onClick={() => setAddModalVisible(!addmodalvisible)}>Add Data</GradientButton>
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
            onRowClicked={(row) => handleEditModal(row)}
            pointerOnHover
            columns={columnsPemasok}
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

export default ManageSupplier


