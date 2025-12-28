import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTask.css';
import { useNavigate } from 'react-router-dom';
import NavigationLogout from './NavigationLogout';

const AddTask = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    description: '',
    date: '',
    priority: 'LOW',
    status: 'Pending',
  });

  // Fetch users for dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map userId to user object
      const selectedUser = users.find(user => user.id === parseInt(formData.userId));

      // Send POST request to backend
      const token = localStorage.getItem('jwt');
      await axios.post('http://localhost:8080/api/tasks', {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        priority: formData.priority,
        status: formData.status,
        user: { id: selectedUser.id } // only user ID needed for backend
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Task assigned successfully!');

      // Reset form
      setFormData({
        userId: '',
        title: '',
        description: '',
        date: '',
        priority: 'LOW',
        status: 'Pending',
      });

      // Navigate to Task page after successful assignment
      navigate('/task');

    } catch (error) {
      console.error('Failed to assign task:', error);
      alert('Failed to assign task. Please try again.');
    }
  };

  return (
    <>
    <NavigationLogout/>
    <div className="add-task-container">
      <h2>Assign Task</h2>
      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>User</label>
            <select name="userId" value={formData.userId} onChange={handleChange} required>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="Enter task title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} required>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-full-row">
          <label>Description</label>
          <textarea 
            name="description" 
            placeholder="Enter task description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Assign Task</button>
      </form>

    </div>
    </>
  );
};

export default AddTask;
