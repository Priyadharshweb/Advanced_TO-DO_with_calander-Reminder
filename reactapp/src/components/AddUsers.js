import React, { useState } from 'react';
import './AddUsers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationLogout from './NavigationLogout';

const AddUsers = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    category: '',
    work: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('jwt');
      // Save to backend
      await axios.post('http://localhost:8080/api/users', {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role: formData.category, // Backend expects 'role'
        work: formData.work
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('User added successfully!');
      navigate('/userlist'); // go to user list page
    } catch (error) {
      console.error('Failed to add user:', error.response?.data || error.message);
      alert('Failed to add user. Please try again.');
    }
  };

  return (
    <>
   <NavigationLogout/>
    <div className="add-user-container">
      <h2 className="form-heading">Add User</h2>
      <form className="add-user-form" onSubmit={handleSubmit}>

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
        </select>

        <label>Assign Work</label>
        <textarea
          name="work"
          placeholder="Enter work description"
          value={formData.work}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>

        <button type="submit" className="submit-btn">Add User</button>
      </form>
    </div>
    </>
  );
};

export default AddUsers;
