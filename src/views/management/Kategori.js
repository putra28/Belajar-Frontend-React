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

const ManageKategori = () => {
  const [data, setData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false)
  const [addkategorimodalVisible, setAddKategoriModalVisible] = useState(false);
  const [subkategoriModalVisible, setSubkategoriModalVisible] = useState(false);
  const [subkategoriupdateModalVisible, setSubkategoriUpdateModalVisible] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [selectedsubKategori, setSelectedSubKategori] = useState(null);
  const [formData, setFormData] = useState({
    namaKategori: '',
    namaKategoriedit: '',
    namaSubKategoriedit: '',
    namaSubKategoriadd: '',
    idKategoriedit: '',
    idSubKategoriedit: '',
    selectedKategoriedit: '',
    selectedSubkategoriedit: '',
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

      const response = await fetch(`${API_BASE_URL}/kategori/getdatakategori`, { headers });
      const result = await response.json();

      if (result.status === 200) {
        setData(result.data);
        showToastMessage('Berhasil Mengambil Data Kategori', 'Berhasil')
      } else {
        setData([]);
        showToastMessage('Gagal Mengambil Data Kategori', 'Gagal');
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

  const handleSubmitadd = async (e) => {
    e.preventDefault()
    const submitData = {
      p_nama_kategori: formData.namaKategori
    }

    try {
      const response = await sendRequest('kategori/adddatakategori', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menambahkan Kategori', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Menambahkan Kategori', 'Gagal')
      }
      setAddKategoriModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  const handleSubmitedit = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_kategori: formData.idKategoriedit,
      p_nama_kategori: formData.namaKategoriedit
    }

    try {
      const response = await sendRequest('kategori/updatedatakategori', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Mengubah Kategori', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Mengubah Kategori', 'Gagal')
      }
      setSubkategoriModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

  const handleSubmiteditsub = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_subkategori: formData.idSubKategoriedit,
      p_nama_subkategori: formData.namaSubKategoriedit
    }

    // console.log(submitData);
    try {
      const response = await sendRequest('kategori/updatedatasubkategori', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Mengubah Sub-Kategori', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Mengubah Sub-Kategori', 'Gagal')
      }
      setSubkategoriUpdateModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }

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

  const handleDeletesub = async (id_subkategori) => {
    try {
      const response = await sendRequest('kategori/deletedatasubkategori', 'POST', {
        p_id_subkategori: id_subkategori,
      })
      console.log(response);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menghapus Sub-Kategori', 'Berhasil')
      } else {
        showToastMessage('Gagal Menghapus Sub-Kategori', 'Gagal')
      }
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
    setSubkategoriModalVisible(false)
  }

  const columnsKategori = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true },
    { name: 'Kategori', selector: row => row.v_nama_kategori, sortable: true },
    { name: 'Total Sub-Kategori', selector: row => row.v_subkategori.length, sortable: true },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDelete(row.v_id_kategori)}>
          Hapus
        </TransparentButton>
      ),
      center: true,
      width: '150px',
    },
  ];

  const columnsSubkategori = [
    { name: 'No.', selector: (row, index) => index + 1, sortable: true, width: '50px' },
    { name: 'Nama Sub-Kategori', selector: row => row.v_nama_subkategori, sortable: true },
    { name: 'Tanggal Dibuat', selector: row => row.v_created_at, sortable: true },
    { name: 'Terakhir Diupdate', selector: row => row.v_updated_at, sortable: true },
    {
      name: 'Aksi',
      cell: (row) => (
        <TransparentButton onClick={() => handleDeletesub(row.v_id_subkategori)}>
          Hapus
        </TransparentButton>
      ),
      center: true,
      width: '150px',
    },
  ];

  const handleAddSubKategori = async (e) => {
    e.preventDefault()
    const submitData = {
      p_id_kategori: formData.idKategoriedit,
      p_nama_subkategori: formData.namaSubKategoriadd
    }

    // console.log(submitData);
    try {
      const response = await sendRequest('kategori/adddatasubkategori', 'POST', submitData);
      if (response.status === 200) {
        await fetchData()
        showToastMessage('Berhasil Menambahkan Sub-Kategori', 'Berhasil')
      } else {
        console.log(response)
        showToastMessage('Gagal Menambahkan Sub-Kategori', 'Gagal')
      }
      setSubkategoriModalVisible(false)
    } catch (error) {
      showToastMessage('Terjadi Kesalahan', 'Gagal')
    }
  }
  // UseEffect to keep the formData when subkategoriModalVisible changes
  useEffect(() => {
    if (subkategoriModalVisible && selectedKategori) {
      setFormData({
        idKategoriedit: selectedKategori.v_id_kategori,
        namaKategoriedit: selectedKategori.v_nama_kategori,
        idSubKategoriedit: '',
        namaSubKategoriedit: ''
      });
    }
  }, [subkategoriModalVisible, selectedKategori]);

  const handleRowClick = (row) => {
    setSelectedKategori(row);
    setFormData({
      idKategoriedit: row.v_id_kategori,
      namaKategoriedit: row.v_nama_kategori
    })
    setSubkategoriModalVisible(true);
  };

  const handleRowClickSub = (row) => {
    setSelectedSubKategori(row);
      setFormData({
        idSubKategoriedit: row.v_id_subkategori,
        namaSubKategoriedit: row.v_nama_subkategori
      })
    setSubkategoriUpdateModalVisible(true);
    setSubkategoriModalVisible(false);
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
        visible={addkategorimodalVisible}
        onClose={() => setAddKategoriModalVisible(false)}
        aria-labelledby="ModalAddKategori"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="ModalAddKategori">Add Data Kategori</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitadd}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedKategori" className="col-form-label">
                Nama Kategori
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaKategori"
                  name="namaKategori"
                  value={formData.namaKategori}
                  onChange={handleInputChange}
                  placeholder='Nama Kategori'
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => setAddKategoriModalVisible(false)}
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
        visible={subkategoriModalVisible}
        onClose={() => setSubkategoriModalVisible(false)}
        size="lg"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle>Sub-Kategori untuk {selectedKategori?.v_nama_kategori}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmitedit}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="selectedKategori" className="col-form-label">
                  Nama Kategori
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaKategoriedit"
                  name="namaKategoriedit"
                  value={formData.namaKategoriedit}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol sm={12}>
                <CAccordion>
                  <CAccordionItem itemKey={1}>
                    <CAccordionHeader>Add Data Sub-Kategori</CAccordionHeader>
                    <CAccordionBody>
                      <CForm>
                        <CRow className="mb-3">
                          <CCol sm={8}>
                            <CFormInput
                              type="text"
                              className="mb-3"
                              id="namaSubKategoriadd"
                              name="namaSubKategoriadd"
                              onChange={handleInputChange}
                              value={formData.namaSubKategoriadd}
                              placeholder='Nama Sub-Kategori'
                              style={{width: '100%'}}
                            />
                          </CCol>
                          <CCol sm={4}>
                            <GradientButton
                              onClick={handleAddSubKategori}
                              style={{width: '100%'}}>
                              Add
                            </GradientButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CAccordionBody>
                  </CAccordionItem>
                </CAccordion>
                <DataTable
                  onRowClicked={handleRowClickSub}
                  pointerOnHover
                  columns={columnsSubkategori}
                  data={selectedKategori?.v_subkategori || []}
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
        visible={subkategoriupdateModalVisible}
        onClose={() => setSubkategoriUpdateModalVisible(false)}
        aria-labelledby="Modalsubkategoriedit"
      >
        <CModalHeader style={{ background: 'linear-gradient(135deg, #1c1b38, #3b398c, #6261cc)' }}>
          <CModalTitle id="Modalsubkategoriedit">Update Data Sub-Kategori</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmiteditsub}>
          <CModalBody>
            <CRow className="mb-3">
              <CCol sm={4}>
                <CFormLabel htmlFor="namaSubKategoriedit" className="col-form-label">
                Nama Sub-Kategori
                </CFormLabel>
              </CCol>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  id="namaSubKategoriedit"
                  name="namaSubKategoriedit"
                  value={formData.namaSubKategoriedit}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              style={{ background: 'linear-gradient(135deg, #450707, #a10808)', border: '0px' }}
              onClick={() => {
                setSubkategoriUpdateModalVisible(false);
                setSubkategoriModalVisible(true);
              }}
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
        <CCardHeader>Tabel Data Kategori</CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <GradientButton onClick={() => setAddKategoriModalVisible(!visible)}>Add Data</GradientButton>
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
