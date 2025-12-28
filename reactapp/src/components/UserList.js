import React, { useEffect, useState } from 'react';
import './UserList.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationLogout from './NavigationLogout';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUserId, setNewUserId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data || error.message);
      alert("Unauthorized or something went wrong.");
    }
  };

  const handleToNewUsers = () => navigate('/addusers');
  const handleAssignTask = () => navigate('/addTask');
  const handleViewTask = () => navigate("/task");

  const handleEdit = (id) => {
    navigate("/editUser/" + id);
    alert(`Edit user with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:8080/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleSortRole = () => {
    const sorted = [...users].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    });
    setUsers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getRoleClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'user': return 'role-user';
      case 'manager': return 'role-manager';
      default: return '';
    }
  };

  return (
    <>
      <NavigationLogout />
      <div className="user-list-container">
        <div className="header-section">
          <div className="title-row">
            <h2>Users</h2>
            <span className="total-count">Total Users: {users.length}</span>
          </div>
          
          <div className="action-buttons">
            <button className="action-btn add-btn" onClick={handleToNewUsers}>
              Add Users
            </button>
            <button className="action-btn assign-btn" onClick={handleAssignTask}>
              Assign Task
            </button>
            <button className="action-btn view-btn" onClick={handleViewTask}>
              View Tasks
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="sortable" onClick={handleSortRole}>
                Role {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4">No users found</td></tr>
            ) : (
              users
                .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
                .map((user) => (
                  <tr key={user.id}>
                    <td className="name-cell">
                      <span>{user.name}</span>
                      {user.id === newUserId && <span className="new-badge">New</span>}
                    </td>
                    <td>{user.email}</td>
                    <td><span className={getRoleClass(user.role)}>{user.role}</span></td>
                    <td>
                      <div className="actions">
                        <button className="edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <span>Rows per page:</span>
          <select value={rowsPerPage} onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(0);
          }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span>{currentPage * rowsPerPage + 1}–{Math.min((currentPage + 1) * rowsPerPage, users.length)} of {users.length}</span>
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >{'<'}</button>
          <button
            onClick={() => setCurrentPage(Math.min(Math.floor(users.length / rowsPerPage), currentPage + 1))}
            disabled={(currentPage + 1) * rowsPerPage >= users.length}
          >{'>'}</button>
        </div>
      </div>
    </>
  );
};

export default UserList;
