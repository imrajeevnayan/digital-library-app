import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { bookApi, loanApi, categoryApi } from '../api/axios'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    myActiveLoans: 0,
    categories: 0
  })
  const [recentBooks, setRecentBooks] = useState([])
  const [myLoans, setMyLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [booksRes, loansRes, categoriesRes] = await Promise.all([
        bookApi.getAll({ size: 4 }),
        loanApi.getMyActive(),
        categoryApi.getAll()
      ])

      setStats({
        totalBooks: booksRes.data.totalElements || 0,
        availableBooks: booksRes.data.content?.filter(b => b.available).length || 0,
        myActiveLoans: loansRes.data.length,
        categories: categoriesRes.data.length
      })

      setRecentBooks(booksRes.data.content || [])
      setMyLoans(loansRes.data.slice(0, 3))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here's an overview of your library activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.availableBooks}</h3>
            <p>Available Now</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.myActiveLoans}</h3>
            <p>My Active Loans</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      {/* Recent Books */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Books</h2>
          <Link to="/books" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {recentBooks.length > 0 ? (
          <div className="grid grid-cols-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="card">
                <div className="card-image" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '48px'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{book.title}</h3>
                  <p className="card-author">{book.author}</p>
                  {book.available ? (
                    <span className="badge badge-success">Available</span>
                  ) : (
                    <span className="badge badge-warning">Borrowed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h3>No books available</h3>
            <p>Start by adding some books to your library.</p>
          </div>
        )}
      </div>

      {/* My Active Loans */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>My Active Loans</h2>
          <Link to="/my-loans" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {myLoans.length > 0 ? (
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
                {myLoans.map((loan) => (
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
                        <span style={{ fontWeight: '500' }}>{loan.bookTitle}</span>
                      </div>
                    </td>
                    <td>{loan.bookAuthor}</td>
                    <td>{new Date(loan.borrowedAt).toLocaleDateString()}</td>
                    <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(loan)}</td>
                    <td>
                      {loan.status === 'ACTIVE' && (
                        <button className="btn btn-success btn-sm">
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
            <h3>No active loans</h3>
            <p>Browse the catalog to borrow some books.</p>
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
