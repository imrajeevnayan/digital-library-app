import { useEffect, useState } from 'react'
import { adminLoanApi } from '../api/axios'

function AdminLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadLoans()
  }, [activeTab])

  const loadLoans = async () => {
    setLoading(true)
    try {
      let response
      if (activeTab === 'overdue') {
        response = await adminLoanApi.getOverdue()
        setLoans(response.data)
      } else {
        response = await adminLoanApi.getAll({ size: 50 })
        setLoans(response.data.content || [])
      }
    } catch (error) {
      console.error('Failed to load loans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (loan) => {
    if (loan.status === 'RETURNED') {
      return <span className="badge badge-success">Returned</span>
    }
    if (loan.overdue) {
      return <span className="badge badge-error">Overdue</span>
    }
    return <span className="badge badge-info">Active</span>
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { text: `${Math.abs(diff)} days overdue`, class: 'badge-error' }
    if (diff === 0) return { text: 'Due today', class: 'badge-warning' }
    return { text: `${diff} days remaining`, class: 'badge-success' }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Loan Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor and manage all book loans in the library.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('all')}
        >
          All Loans
        </button>
        <button
          className={`btn ${activeTab === 'overdue' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{loans.filter(l => l.status === 'ACTIVE').length}</h3>
            <p>Active Loans</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{loans.filter(l => l.overdue).length}</h3>
            <p>Overdue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{loans.filter(l => l.status === 'RETURNED').length}</h3>
            <p>Returned</p>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : loans.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const daysInfo = getDaysRemaining(loan.dueDate)
                return (
                  <tr key={loan.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                          {loan.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span style={{ fontWeight: '500' }}>{loan.userName}</span>
                          {loan.status === 'ACTIVE' && (
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              <span className={`badge ${daysInfo.class}`} style={{ fontSize: '10px' }}>
                                {daysInfo.text}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '44px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <span style={{ fontWeight: '500' }}>{loan.bookTitle}</span>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {loan.bookAuthor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(loan.borrowedAt).toLocaleDateString()}</td>
                    <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(loan)}</td>
                    <td>
                      {loan.returnedAt
                        ? new Date(loan.returnedAt).toLocaleDateString()
                        : '-'
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h3>{activeTab === 'overdue' ? 'No overdue loans' : 'No loans found'}</h3>
          <p>
            {activeTab === 'overdue'
              ? 'All books are returned on time. Great!'
              : 'Loan records will appear here.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminLoans
