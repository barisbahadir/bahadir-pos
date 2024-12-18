import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CCollapse,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CContainer,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
} from '@coreui/react'
import apiService from 'src/ApiService'
import { toast } from 'react-toastify'
import LoadingBar from 'src/components/LoadingBar'
import { getErrorMessage } from 'src/utils/Utils'
import PaymentTypes from '../../../utils/PaymentTypes'

const SaleReports = () => {
  const filterStartDate = new Date().toISOString().split('T')[0]
  const filterEndDate = new Date().toISOString().split('T')[0]
  // new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]

  const [isLoading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState(filterStartDate)
  const [endDate, setEndDate] = useState(filterEndDate)
  const [expandedRow, setExpandedRow] = useState(null)

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const parameters = {
        searchText: searchText,
        startDate: `${startDate}T00:00:00`,
        endDate: `${endDate}T23:59:59`,
      }
      const response = await apiService.post('/api/transaction/filter', parameters)
      if (response) {
        setTransactions(response)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [startDate, endDate])

  return isLoading ? (
    <LoadingBar />
  ) : (
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader className="mb-4">Satış Raporları</CCardHeader>
        <CCardBody>
          <div>
            <CRow className="align-items-center">
              {/* Tarih Aralığı Seçimi */}
              <CCol md={6} className="me-auto mb-4">
                <CInputGroup>
                  <CInputGroupText>Tarih Aralığı</CInputGroupText>
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(!e.target.value ? filterStartDate : e.target.value)
                    }
                  />
                  <CFormInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(!e.target.value ? filterEndDate : e.target.value)}
                  />
                </CInputGroup>
              </CCol>

              {/* Arama ve Filtre Butonu */}
              <CCol md={4} className="ms-auto mb-4">
                <CInputGroup>
                  <CFormInput
                    placeholder="Ara..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <CButton
                    color="warning"
                    onClick={fetchTransactions}
                    className="d-flex align-items-center justify-content-center"
                  >
                    Filtrele
                  </CButton>
                </CInputGroup>
              </CCol>
            </CRow>

            {/* Tablo */}
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Satış Tarihi</CTableHeaderCell>
                  <CTableHeaderCell>Odeme Tipi</CTableHeaderCell>
                  <CTableHeaderCell>Satış Tutarı</CTableHeaderCell>
                  <CTableHeaderCell>Detay</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <CTableRow>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{transaction.transactionDate}</CTableDataCell>
                      <CTableDataCell>
                        {transaction.paymentType === PaymentTypes.CARD ? 'Kredi Karti' : 'Nakit'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <b>{`${transaction.totalAmount} TL`}</b>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() =>
                            setExpandedRow(expandedRow === transaction.id ? null : transaction.id)
                          }
                        >
                          Detay
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                    {/* Expandable Satır */}
                    {expandedRow === transaction.id && (
                      <CTableRow>
                        <CTableDataCell colSpan={4}>
                          <CTable bordered>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Ürün Adı</CTableHeaderCell>
                                <CTableHeaderCell>Barkod</CTableHeaderCell>
                                <CTableHeaderCell>Fiyat</CTableHeaderCell>
                                <CTableHeaderCell>Adet</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {transaction.transactionItems.map((item, index) => (
                                <CTableRow key={index}>
                                  <CTableDataCell>{item.productName}</CTableDataCell>
                                  <CTableDataCell>{item.barcode}</CTableDataCell>
                                  <CTableDataCell>
                                    <b>{`${item.price} TL`}</b>
                                  </CTableDataCell>
                                  <CTableDataCell>{item.quantity}</CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default SaleReports
