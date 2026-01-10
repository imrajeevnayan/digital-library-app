import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookApi, loanApi } from '../api/axios'

function Books() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 })
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    stockQuantity: 1
  })

  useEffect(() => {
    loadBooks()
  }, [searchParams])

  const loadBooks = async () => {
    setLoading(true)
    try {
      const params = {
        page: searchParams.get('page') || 0,
        size: 12
      }
      
      if (searchParams.get('search')) {
        params.search = searchParams.get('search')
      }
      
      if (searchParams.get('category')) {
        params.category = searchParams.get('category')
      }

      const response = await bookApi.getAll(params)
      setBooks(response.data.content || [])
      setPagination({
        page: response.data.number || 0,
        totalPages: response.data.totalPages || 1
      })
    } catch (error) {
      console.error('Failed to load books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const search = formData.get('search')
    if (search) {
      setSearchParams({ search })
    } else {
      setSearchParams({})
    }
  }

  const handleBorrow = async (bookId) => {
    try {
      await loanApi.borrow(bookId)
      loadBooks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to borrow book')
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    try {
      await bookApi.create(newBook)
      setShowAddModal(false)
      setNewBook({ title: '', author: '', isbn: '', description: '', stockQuantity: 1 })
      loadBooks()
    } catch (error) {
      alert('Failed to add book')
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 0; i < pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i })}
          className={`btn ${pagination.page === i ? 'btn-primary' : 'btn-outline'} btn-sm`}
          style={{ minWidth: '40px' }}
        >
          {i + 1}
        </button>
      )
    }
    return pages
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Books</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Browse and borrow books from our collection.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Book
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
        <div className="header-search" style={{ maxWidth: '100%' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            type="text"
            name="search"
            placeholder="Search by title, author, or ISBN..."
            defaultValue={searchParams.get('search') || ''}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
      </form>

      {/* Books Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-4">
            {books.map((book) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    {book.available ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-warning">Borrowed</span>
                    )}
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Stock: {book.stockQuantity}
                    </span>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '12px' }}
                    onClick={() => handleBorrow(book.id)}
                    disabled={!book.available}
                  >
                    {book.available ? 'Borrow' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {renderPagination()}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3>No books found</h3>
          <p>Try adjusting your search or browse all books.</p>
          <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear Search</button>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline btn-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddBook}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Author *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    value={newBook.stockQuantity}
                    onChange={(e) => setNewBook({ ...newBook, stockQuantity: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Add Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Books
