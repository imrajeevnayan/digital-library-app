import { useEffect, useState } from 'react'
import { loanApi } from '../api/axios'

function MyLoans() {
  const [loans, setLoans] = useState([])
  const [activeTab, setActiveTab] = useState('active')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLoans()
  }, [activeTab])

  const loadLoans = async () => {
    setLoading(true)
    try {
      let response
      if (activeTab === 'active') {
        response = await loanApi.getMyActive()
        setLoans(response.data)
      } else {
        response = await loanApi.getMyHistory({ size: 50 })
        setLoans(response.data.content || [])
      }
    } catch (error) {
      console.error('Failed to load loans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (loanId) => {
    try {
      await loanApi.return(loanId)
      loadLoans()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to return book')
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
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>My Loans</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and manage your borrowed books.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('active')}
        >
          Active Loans
        </button>
        <button
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
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
                <th>Book</th>
                <th>Author</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const daysInfo = getDaysRemaining(loan.dueDate)
                return (
                  <tr key={loan.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '56px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <span style={{ fontWeight: '500' }}>{loan.bookTitle}</span>
                          {loan.status === 'ACTIVE' && (
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              <span className={`badge ${daysInfo.class}`} style={{ fontSize: '11px' }}>
                                {daysInfo.text}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{loan.bookAuthor}</td>
                    <td>{new Date(loan.borrowedAt).toLocaleDateString()}</td>
                    <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusBadge(loan)}
                        {loan.returnedAt && activeTab === 'history' && (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Returned: {new Date(loan.returnedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {loan.status === 'ACTIVE' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturn(loan.id)}
                        >
                          Return Book
                        </button>
                      )}
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
          <h3>{activeTab === 'active' ? 'No active loans' : 'No loan history'}</h3>
          <p>
            {activeTab === 'active'
              ? 'You have not borrowed any books yet.'
              : 'Your borrowing history will appear here.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default MyLoans
