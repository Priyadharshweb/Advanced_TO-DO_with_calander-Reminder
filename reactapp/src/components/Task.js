import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Task.css';
import { useNavigate } from 'react-router-dom';
import NavigationLogout from './NavigationLogout';

const Task = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('none');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.role === 'ADMIN';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleAddTask = () => {
    navigate('/addTask');
  };

  const handleEdit = (taskId) => {
    navigate(`/editTask/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'in progress': return 'status-progress';
      default: return 'status-default';
    }
  };

  const getSortedTasks = () => {
    if (sortBy === 'none') return tasks;
    
    const statusOrder = {
      'Pending': 1,
      'In Progress': 2,
      'Completed': 3
    };
    
    return [...tasks].sort((a, b) => {
      if (sortBy === 'status-asc') {
        return statusOrder[a.status] - statusOrder[b.status];
      } else if (sortBy === 'status-desc') {
        return statusOrder[b.status] - statusOrder[a.status];
      }
      return 0;
    });
  };

  const getPaginatedTasks = () => {
    const sortedTasks = getSortedTasks();
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedTasks.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  return (
    <>
    <NavigationLogout/>
    <div className="task-container">
      <div className="header-row">
        <h2>Task List</h2>
        <div className="header-actions">
          {isAdmin && (
            <div className="sort-controls">
              <label>Sort by Status:</label>
              <select 
                value={sortBy} 
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="sort-select"
              >
                <option value="none">No Sort</option>
                <option value="status-asc">Status: Pending → Completed</option>
                <option value="status-desc">Status: Completed → Pending</option>
              </select>
            </div>
          )}
          <button className="add-task-btnn" onClick={handleAddTask}>
            Add Task
          </button>
          <span className="task-count">Total Tasks: {tasks.length}</span>
        </div>
      </div>
      <table className="task-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan="7">No tasks assigned yet</td></tr>
          ) : (
            getPaginatedTasks().map(task => (
              <tr key={task.id}>
                <td>{task.user.name}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.date}</td>
                <td>{task.priority}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(task.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <span>Rows per page:</span>
        <select 
          value={rowsPerPage} 
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(0);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
        <span>
          {currentPage * rowsPerPage + 1}–{Math.min((currentPage + 1) * rowsPerPage, tasks.length)} of {tasks.length}
        </span>
        <button 
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          {'<'}
        </button>
        <button 
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          {'>'}
        </button>
      </div>
    </div>
    </>
  );
};

export default Task;
