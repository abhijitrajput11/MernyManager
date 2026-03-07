import React, { useEffect, useState, useCallback } from 'react'
import { Modal, Form, Select, Input, InputNumber, message, DatePicker } from "antd"
import moment from "moment"
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined, PlusOutlined, WalletOutlined } from "@ant-design/icons"
import axios from 'axios'
import { url } from '../url'
import Analytics from '../components/Analytics'
import './HomePage.css'
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModel, setshowModel] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [alltranscrion, setalltransaction] = useState([])
  const [frequency, setfrequency] = useState("7")
  const [selectedDate, setselectedDate] = useState([])
  const [type, settype] = useState("all")
  const [viewdata, setviewdata] = useState("cards")
  const [editable, seteditable] = useState(null)

  // getall transactions
  const getAlltransaction = useCallback(async () => {
    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem("user"))
      const response = await axios.post(`${url}/transaction/getall`, {
        userid: user._id,
        frequency,
        selectedDate,
        type
      })
      setalltransaction(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error("Failed to fetch transactions")
    }
  }, [frequency, selectedDate, type])

  // delete handler
  const handleDelete = useCallback(async (record) => {
    try {
      setLoading(true)
      await axios.delete(`${url}/transaction/delete`, {
        data: { transactionId: record._id },
      })
      setLoading(false)
      message.success("Transaction Deleted Successfully.")
      getAlltransaction()
    } catch (error) {
      setLoading(false)
      message.error("Unable to delete.")
    }
  }, [getAlltransaction])

  // edit handler
  const handleEdit = useCallback((record) => {
    seteditable(record)
    setshowModel(true)
  }, [])

  // submit handler
  const handleSubmit = useCallback(async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      setLoading(true)

      if (editable) {
        await axios.put(`${url}/transaction/edit`, {
          payload: {
            ...values,
            userId: user._id
          },
          transactionId: editable._id
        })
        setLoading(false)
        message.success("Transaction Updated Successfully.")
        getAlltransaction()
      } else {
        await axios.post(`${url}/transaction/add`, { ...values, userid: user._id })
        setLoading(false)
        message.success("Transaction Added Successfully.")
        getAlltransaction()
      }

      setshowModel(false)
      seteditable(null)
    } catch (error) {
      message.error("Fail to add Transaction")
    }
  }, [editable, getAlltransaction])

  useEffect(() => {
    getAlltransaction()
  }, [getAlltransaction, frequency, selectedDate, type])

  // format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      salary: '💰',
      tip: '💵',
      project: '💼',
      food: '🍔',
      movie: '🎬',
      bills: '📄',
      medical: '⚕',
      fee: '📚',
      tax: '🏛️'
    }
    return icons[category] || '💳'
  }

  return (
    <div className="homepage-container container">
      {/* Glow Background */}
      <div className="glow-background">
        <div className="main-glow-sphere"></div>
        <div className="secondary-glow-sphere"></div>
      </div>

      {Loading && (
        <div className="transactions-loading">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      )}

      {!Loading && (
        <>
          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="filter-group">
                <span className="filter-label">Frequency</span>
                <Select value={frequency} onChange={(values) => setfrequency(values)}>
                  <Select.Option value="7">Last Week</Select.Option>
                  <Select.Option value="30">Last Month</Select.Option>
                  <Select.Option value="365">Last Year</Select.Option>
                  <Select.Option value="custom">Custom</Select.Option>
                </Select>
                {frequency === "custom" && <RangePicker value={selectedDate} onChange={(values) => setselectedDate(values)} />}
              </div>

              <div className="filter-group">
                <span className="filter-label">Type</span>
                <Select value={type} onChange={(values) => settype(values)}>
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                </Select>
              </div>

              <div className="filter-group">
                <span className="filter-label">View</span>
                <div className="view-toggle">
                  <div 
                    className={`icon-btn ${viewdata === "cards" ? "active" : ""}`}
                    onClick={() => setviewdata("cards")}
                  >
                    <UnorderedListOutlined />
                  </div>
                  <div 
                    className={`icon-btn ${viewdata === "analytics" ? "active" : ""}`}
                    onClick={() => setviewdata("analytics")}
                  >
                    <AreaChartOutlined />
                  </div>
                </div>
              </div>

              <button className="add-transaction-btn" onClick={() => setshowModel(true)}>
                <PlusOutlined /> Add New
              </button>
            </div>
          </div>

          {/* Content Section */}
          {viewdata === "cards" ? (
            <>
              {alltranscrion.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <WalletOutlined />
                  </div>
                  <div className="empty-text">No transactions yet</div>
                  <button className="empty-btn" onClick={() => setshowModel(true)}>
                    Add Your First Transaction
                  </button>
                </div>
              ) : (
                <div className="transactions-grid">
                  {alltranscrion.map((transaction) => (
                    <div key={transaction._id} className="transaction-card">
                      <div className="glass-shine"></div>
                      <div className="transaction-header">
                        <span className={`transaction-type ${transaction.type === "income" ? "type-income" : "type-expense"}`}>
                          {transaction.type}
                        </span>
                        <div className="transaction-actions">
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEdit(transaction)}
                          >
                            <EditOutlined />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(transaction)}
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>

                      <div className="transaction-amount">
                        {formatCurrency(transaction.amount)}
                      </div>

                      <div className="transaction-details">
                        <div className="detail-item">
                          <span className="detail-label">Category</span>
                          <span className="detail-value">
                            {getCategoryIcon(transaction.category)} {transaction.category}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Date</span>
                          <span className="detail-value">
                            {moment(transaction.date).format("DD MMM YYYY")}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Reference</span>
                          <span className="detail-value">{transaction.refrence}</span>
                        </div>
                        {transaction.description && (
                          <div className="detail-item">
                            <span className="detail-label">Description</span>
                            <span className="detail-value">{transaction.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Analytics alltransaction={alltranscrion} />
          )}
        </>
      )}

      {/* Modal for Add/Edit */}
      <Modal 
        title={editable ? "Edit Transaction" : "Add Transaction"} 
        open={showModel} 
        onCancel={() => {
          setshowModel(false)
          seteditable(null)
        }}
        footer={false}
        width={500}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={1}
              controls={false}
              parser={(value) => (value ? value.replace(/[^0-9]/g, "") : "")}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace", "Delete", "Tab", "Enter", "Escape",
                  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End",
                ];
                if (allowedKeys.includes(e.key)) return;
                if (e.ctrlKey || e.metaKey) return;
                if (!/^[0-9]$/.test(e.key)) e.preventDefault();
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text");
                if (!/^[0-9]*$/.test(text)) e.preventDefault();
              }}
            />
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Select required>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select required>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fees</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input type="date" required />
          </Form.Item>

          <Form.Item label="Reference" name="refrence">
            <Input type="text" required />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <button className="btn-primary" type="submit">
              {editable ? "Update" : "Save"} Transaction
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default HomePage