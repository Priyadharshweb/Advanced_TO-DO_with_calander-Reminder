import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUser.css';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams(); // Get user ID from route
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'USER',
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      await axios.put(`http://localhost:8080/api/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User updated successfully!');
      navigate('/userList'); // redirect to user list after update
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form className="edit-user-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Enter name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <label>Role</label>
        <select name="role" value={userData.role} onChange={handleChange} required>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" className="submit-btn">Update User</button>
      </form>
    </div>
  );
};

export default EditUser;
