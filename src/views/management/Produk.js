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

const ManageProduk = () => {
  const [data, setData] = useState([]) // State for table data
  const [showToast, setShowToast] = useState(false) // State to control toast visibility
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      const result = await response.json();
      console.log(result);
      if (result.status === 200) {
        setData(result.data);
        toast.success(result.notification_response);
      } else {
        setData([]);
        toast.error(result.notification_response);
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
      <ToastContainer draggable closeOnClick  />

      {/* Table to display product data */}
      <CCard className="mb-4">
        <CCardHeader>
          Tabel Data Produk
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

export default ManageProduk


