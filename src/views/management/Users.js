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
  CCol,
} from '@coreui/react'
import DataTable, { createTheme } from 'react-data-table-component'
import 'react-toastify/dist/ReactToastify.css'
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

const ManageUsers = () => {
  const [data, setData] = useState([]) // State for table data
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [loading, setLoading] = useState(false);
  const [addmodalvisible, setAddModalVisible] = useState(false);
  const [editmodalvisible, setEditModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    add_nama_pengguna: '',
    add_username_pengguna: '',
    add_password_pengguna: '',
    add_role_pengguna: '',
    edit_id_pengguna: '',
    edit_nama_pengguna: '',
    edit_username_pengguna: '',
    edit_password_pengguna: '',
    edit_role_pengguna: '',
    hapus_id_pengguna: '',
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
      const response = await fetch(`${API_BASE_URL}/pengguna/getdatapengguna`, {
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
        showToastMessage('Berhasil Mengambil Data Users', 'Berhasil')
      } else {
        setData([]);
        showToastMessage('Gagal Mengambil Data Users', 'Gagal')
      }
    } catch (error) {
      setData([]);
      showToastMessage('Terjadi Kesalahan Saat Mengambil Data', 'Gagal')
    }
    setLoading(false);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    const submitData = {
      p_nama_pengguna: formData.add_nama_pengguna,
      p_username_pengguna: formData.add_username_pengguna,
      p_password_pengguna: formData.add_password_pengguna,
      p_role_pengguna: formData.add_role_pengguna,
    }

    try {
      const response = await sendRequest('pengguna/adddatapengguna', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menambahkan User', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Menambahkan User', 'Gagal')
      }
      setAddModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
      console.log('gagal menambahkan user: ', error)
    }
  }

  const handleEditModal = (row) => {
    setFormData({
      edit_id_pengguna: row.v_id_pengguna,
      edit_nama_pengguna: row.v_nama_pengguna,
      edit_username_pengguna: row.v_username_pengguna,
      edit_password_pengguna: row.v_password_pengguna,
      edit_role_pengguna: row.v_role_pengguna,
    })
    setEditModalVisible(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_pengguna: formData.edit_id_pengguna,
      p_nama_pengguna: formData.edit_nama_pengguna,
      p_username_pengguna: formData.edit_username_pengguna,
      p_password_pengguna: formData.edit_password_pengguna,
      p_role_pengguna: formData.edit_role_pengguna,
    }

    try {
      const response = await sendRequest('pengguna/updatedatapengguna', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Mengubah User', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Mengubah User', 'Gagal')
      }
      setEditModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
      console.log('gagal menambahkan user: ', error)
    }
  }

  const handleDelete = async (usersId) => {
    try {
      const response = await sendRequest('pengguna/deletedatapengguna', 'POST', {
        p_id_pengguna: usersId,
      })
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menghapus User', 'Berhasil')
      } else {
        showToastMessage('Gagal Menghapus User', 'Gagal')
      }
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columnsUsers = [
    {
      name: 'No.', selector: (row, index) => index + 1, sortable: true,
    },
    {
      name: 'Nama', selector: row => row.v_nama_pengguna, sortable: true,
    },
    {
      name: 'Username', selector: row => row.v_username_pengguna, sortable: true,
    },
    {
      name: 'Role User', selector: row => row.v_role_pengguna, sortable: true,
    },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDelete(row.v_id_pengguna)}>
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
                <CFormLabel htmlFor="namaProduk">Nama Pengguna</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="add_nama_pengguna"
                  name="add_nama_pengguna"
                  value={formData.add_nama_pengguna}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Username</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="add_username_pengguna"
                  name="add_username_pengguna"
                  value={formData.add_username_pengguna}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Password</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="password"
                  id="add_password_pengguna"
                  name="add_password_pengguna"
                  value={formData.add_password_pengguna}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="add_role_pengguna" className="col-form-label">
                  Role Pengguna
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="add_role_pengguna"
                  name="add_role_pengguna"
                  onChange={(e) => {
                    handleInputChange(e)
                  }}
                  value={formData.add_role_pengguna} // Change this line
                >
                  <option value="">Pilih Role Pengguna</option>
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                  <option value="manajer">Manajer</option>
                </CFormSelect>
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
      <CModal visible={editmodalvisible} onClose={() => setEditModalVisible(false)} aria-labelledby="ModalAddProduk">
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="ModalAddProduk">Tambah Data Produk</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitEdit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Nama Pengguna</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="edit_nama_pengguna"
                  name="edit_nama_pengguna"
                  value={formData.edit_nama_pengguna}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Username</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="edit_username_pengguna"
                  name="edit_username_pengguna"
                  value={formData.edit_username_pengguna}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaProduk">Password</CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="password"
                  id="edit_password_pengguna"
                  name="edit_password_pengguna"
                  value={formData.edit_password_pengguna}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="edit_role_pengguna" className="col-form-label">
                  Role Pengguna
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormSelect
                  id="edit_role_pengguna"
                  name="edit_role_pengguna"
                  onChange={(e) => {
                    handleInputChange(e)
                  }}
                  value={formData.edit_role_pengguna} // Change this line
                >
                  <option value="">Pilih Role Pengguna</option>
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                  <option value="manajer">Manajer</option>
                </CFormSelect>
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

      {/* Table to display data */}
      <CCard className="mb-4">
        <CCardHeader>
          Tabel Data Users
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
            columns={columnsUsers}
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

export default ManageUsers


