import { useEffect, useState } from 'react'
import { userApi } from '../api/axios'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await userApi.getAll()
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userApi.updateRole(userId, newRole)
      loadUsers()
      setSelectedUser(null)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role')
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(userId)
        loadUsers()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user')
      }
    }
  }

  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true
    return user.role === roleFilter
  })

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage user accounts and permissions.</p>
        </div>
        <select
          className="form-input"
          style={{ width: 'auto' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="ADMIN">Admins</option>
          <option value="USER">Regular Users</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontWeight: '500' }}>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-info">{user.provider}</span>
                </td>
                <td>
                  {selectedUser?.id === user.id ? (
                    <select
                      className="form-input"
                      style={{ width: 'auto', padding: '6px 12px' }}
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      autoFocus
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-warning' : 'badge-success'}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Change Role
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDelete(user.id)}
                      style={{ color: 'var(--error)' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h3>No users found</h3>
          <p>No users match the current filter.</p>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
