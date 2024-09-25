import React, { useEffect, useState, createRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton
} from '@coreui/react'
import DataTable, { createTheme } from 'react-data-table-component'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'

const CekdataTransaksi = () => {
  const [data, setData] = useState([]) // State for table data
  const [showToast, setShowToast] = useState(false) // State to control toast visibility
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Store selected transaction


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://168.168.10.12:2805/retielAPI/getAllTransaksi');
      const result = await response.json();
      if (result.Status === 'success') {
        setData(result.Data);
        toast.success(result.Message);
      } else {
        setData([]);
        toast.error(result.Message);
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

  const formatDateTime = (datetime) => {
    return datetime.replace('T', ' ').split('.')[0];
  };

  const columnsProduk = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Nama Pengguna',
      selector: row => row.M_namePengguna,
      sortable: true,
    },
    {
      name: 'Nama Pelanggan',
      selector: row => row.M_namaPelanggan,
      sortable: true,
    },
    {
      name: 'Quantity Transaksi',
      selector: row => row.M_quantityTransaksi,
      sortable: true,
    },
    {
      name: 'Total Pembayaran',
      selector: row => formatRupiah(row.M_totalPayment), // Format as Rupiah
      sortable: true,
    },
    {
      name: 'Total Harga',
      selector: row => formatRupiah(row.M_totalPrice), // Format as Rupiah
      sortable: true,
    },
    {
      name: 'Total Kembalian',
      selector: row => formatRupiah(row.M_totalChange), // Format as Rupiah
      sortable: true,
    },
    {
      name: 'Tanggal Transaksi',
      selector: row => formatDateTime(row.M_dateTransaksi),
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

  // Handler for row click
  const handleRowClick = (row) => {
    console.log(row.M_detailTransaksi); // Log the M_detailTransaksi of the clicked row
    setSelectedTransaction(row); // Save the clicked row data
    setVisible(true); // Show modal
  };

  return (
    <>
      {/* Toast notification */}
      <ToastContainer draggable closeOnClick  />

      {/* Table to display product data */}
      <CCard className="mb-4">
        <CCardHeader>
          Tabel Histori Transaksi
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
            }}
            highlightOnHover
            pointerOnHover
            theme='transparent'
            onRowClicked={handleRowClick}
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
      {/* Modal Detail Transaksi */}
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Detail Transaksi</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTransaction && (
            <>
              <p><strong>Nama Pengguna:</strong> {selectedTransaction.M_namePengguna}</p>
              <p><strong>Nama Pelanggan:</strong> {selectedTransaction.M_namaPelanggan}</p>
              <p><strong>Total Pembelian:</strong> {selectedTransaction.M_quantityTransaksi}</p>
              <p><strong>Total Pembayaran:</strong> {formatRupiah(selectedTransaction.M_totalPayment)}</p>
              <p><strong>Total Harga:</strong> {formatRupiah(selectedTransaction.M_totalPrice)}</p>
              <p><strong>Tanggal Transaksi:</strong> {formatDateTime(selectedTransaction.M_dateTransaksi)}</p>

              <h5>Detail Produk</h5>
              {selectedTransaction.M_detailTransaksi.map((detail, index) => (
                <ul>
                  <li key={index}>{detail.M_nameProduk} - {formatRupiah(detail.M_priceProduk)} x {detail.M_quantityProduk}</li>
                </ul>
              ))}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

    </>
  )
}

export default CekdataTransaksi


