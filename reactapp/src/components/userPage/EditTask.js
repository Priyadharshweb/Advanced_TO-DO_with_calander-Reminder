import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationLogout from '../NavigationLogout';
import './EditTask.css';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'LOW',
    status: 'Pending',
    reminderEnabled: false,
    reminderDays: 1,
    reminderTime: '09:00'
  });
  const [originalTask, setOriginalTask] = useState(null);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const task = res.data.find(t => t.id === parseInt(id));
      if (task) {
        setOriginalTask(task);
        setTaskForm({
          title: task.title || '',
          description: task.description || '',
          date: task.date || '',
          priority: task.priority || 'LOW',
          status: task.status || 'Pending',
          reminderEnabled: task.reminderEnabled || false,
          reminderDays: task.reminderDays || 1,
          reminderTime: task.reminderTime || '09:00'
        });
      } else {
        alert('Task not found');
        navigate('/userHome');
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
      alert('Failed to load task data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      const updatedTask = {
        ...originalTask,
        ...taskForm
      };
      await axios.put(`http://localhost:8080/api/tasks/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Task updated successfully!');
      navigate('/userHome');
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <NavigationLogout />
        <div className="edit-task-container">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationLogout />
      <div className="edit-task-container">
        <h2>Edit Task</h2>
        <form className="edit-task-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" placeholder="Enter task title" value={taskForm.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={taskForm.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={taskForm.priority} onChange={handleChange} required>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={taskForm.status} onChange={handleChange} required>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-full-row">
            <label>Description</label>
            <textarea name="description" placeholder="Enter task description" value={taskForm.description} onChange={handleChange} rows="3" required />
          </div>

          <div className="reminder-section">
            <label>
              <input type="checkbox" name="reminderEnabled" checked={taskForm.reminderEnabled} onChange={handleChange} />
              Enable Reminder
            </label>
            {taskForm.reminderEnabled && (
              <div className="reminder-options">
                <select name="reminderDays" value={taskForm.reminderDays} onChange={handleChange}>
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                </select>
                <input type="time" name="reminderTime" value={taskForm.reminderTime} onChange={handleChange} className="reminder-time" />
              </div>
            )}
          </div>

          <div className="button-row">
            <button type="submit" className="submit-btn">Update Task</button>
            <button type="button" className="submit-btn cancel-btn" onClick={() => navigate('/userHome')}>Cancel</button>
          </div>
        </form>

      </div>
    </>
  );
};

export default EditTask;
