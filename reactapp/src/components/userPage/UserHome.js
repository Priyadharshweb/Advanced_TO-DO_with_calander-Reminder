import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InboxIcon from '@mui/icons-material/Inbox';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import NewLabelRoundedIcon from '@mui/icons-material/NewLabelRounded';
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import './UserHome.css';
import NavigationLogout from '../NavigationLogout';
const UserHome = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [activeView, setActiveView] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('none');
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [showListPopup, setShowListPopup] = useState(false);
  const [listName, setListName] = useState('');
  const [customLists, setCustomLists] = useState([]);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, listId: null });
  const [editingList, setEditingList] = useState({ id: null, name: '' });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'LOW',
    status: 'Pending',
    categoryId: null,
    reminderEnabled: false,
    reminderDays: 1,
    reminderTime: '09:00'
  });
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchTasks();
    getCurrentUser();
    fetchCustomLists();
    requestNotificationPermission();
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkReminders();
  }, [tasks]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const sendNotification = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Task Reminder: ${task.title}`, {
        body: `Due on ${new Date(task.date).toLocaleDateString()}`,
        icon: '/favicon.ico'
      });
    }
  };

  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  };

  const fetchCustomLists = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8080/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
      const userLists = res.data.filter(category => category.user.id === currentUserId);
      setCustomLists(userLists);
    } catch (error) {
      console.error('Failed to fetch custom lists:', error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      const listData = {
        name: listName,
        userId: currentUser.id
      };
      
      await axios.post('http://localhost:8080/api/categories', listData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`List "${listName}" created successfully!`);
      setListName('');
      setShowListPopup(false);
      fetchCustomLists();
    } catch (error) {
      console.error('Failed to create list:', error);
      alert('Failed to create list. Please try again.');
    }
  };

  const handleListRightClick = (e, listId) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, listId });
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:8080/api/categories/${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCustomLists();
        setContextMenu({ show: false, x: 0, y: 0, listId: null });
      } catch (error) {
        console.error('Failed to delete list:', error);
        alert('Failed to delete list.');
      }
    }
  };

  const handleEditList = (listId, currentName) => {
    setEditingList({ id: listId, name: currentName });
    setContextMenu({ show: false, x: 0, y: 0, listId: null });
  };

  const handleListNameChange = async (listId, newName) => {
    if (newName.trim() === '') return;
    try {
      const token = localStorage.getItem('jwt');
      const listToUpdate = customLists.find(list => list.id === listId);
      await axios.put(`http://localhost:8080/api/categories/${listId}`, {
        ...listToUpdate,
        name: newName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomLists();
      setEditingList({ id: null, name: '' });
    } catch (error) {
      console.error('Failed to update list:', error);
      alert('Failed to update list.');
    }
  };

  const handleClickOutside = () => {
    setContextMenu({ show: false, x: 0, y: 0, listId: null });
    setEditingList({ id: null, name: '' });
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
      const userTasks = res.data.filter(task => task.user.id === currentUserId);
      setTasks(userTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const checkReminders = () => {
    const now = new Date();
    const activeReminders = tasks.filter(task => {
      if (task.status === 'Completed' || !task.reminderEnabled) return false;
      
      const taskDate = new Date(task.date);
      const reminderDate = new Date(taskDate);
      reminderDate.setDate(taskDate.getDate() - (task.reminderDays || 1));
      
      const [hours, minutes] = (task.reminderTime || '09:00').split(':');
      reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const isReminderTime = now >= reminderDate && now < taskDate;
      
      if (isReminderTime && !task.notificationSent) {
        sendNotification(task);
        task.notificationSent = true;
      }
      
      return isReminderTime;
    });
    setReminders(activeReminders);
  };

  const dismissReminder = (taskId) => {
    setReminders(prev => prev.filter(r => r.id !== taskId));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        date: taskForm.date,
        priority: taskForm.priority,
        status: taskForm.status,
        reminderEnabled: taskForm.reminderEnabled,
        reminderDays: taskForm.reminderDays,
        reminderTime: taskForm.reminderTime,
        user: { id: currentUser.id },
        category: taskForm.categoryId ? { id: taskForm.categoryId } : null
      };
      
      const token = localStorage.getItem('jwt');
      await axios.post('http://localhost:8080/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Task added successfully!');
      setShowTaskPopup(false);
      setTaskForm({ title: '', description: '', date: '', priority: 'LOW', status: 'Pending', categoryId: null, reminderEnabled: false, reminderDays: 1, reminderTime: '09:00' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const token = localStorage.getItem('jwt');
      await axios.put(`http://localhost:8080/api/tasks/${taskId}`, {
        ...task,
        status: 'Completed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/editTask/${taskId}`);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('jwt');
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getFilteredTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const filtered = tasks.filter(task => {
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      switch (activeView) {
        case 'today': return task.date === today;
        case 'upcoming': return new Date(task.date) > new Date();
        case 'completed': return task.status === 'Completed';
        case 'personal': return task.priority === 'LOW';
        case 'work': return task.priority === 'HIGH';
        case 'learning': return task.priority === 'MEDIUM';
        default: 
          if (activeView.startsWith('list-')) {
            const listId = activeView.replace('list-', '');
            return task.category && task.category.id === parseInt(listId);
          }
          return task.status !== 'Completed';
      }
    });
    return filtered;
  };

  const getTaskCounts = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      inbox: tasks.filter(t => t.status !== 'Completed').length,
      today: tasks.filter(t => t.date === today).length,
      upcoming: tasks.filter(t => new Date(t.date) > new Date()).length,
      completed: tasks.filter(t => t.status === 'Completed').length
    };
  };

  const counts = getTaskCounts();
  const filteredTasks = getFilteredTasks();

  return (
    <>
    <NavigationLogout/>
      <div className="user-home" onClick={handleClickOutside}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-item teams-btn" onClick={() => setShowTeamPopup(true)}>
          <GroupIcon className="menu-icon" /> Add Teams
        </div>
        <button className="add-task-btn" onClick={() => setShowTaskPopup(true)}>+ Add task</button>
        <input 
          type="text" 
          className="search" 
          placeholder="Search" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <nav className="menu">
          <div 
            className={`menu-item ${activeView === 'inbox' ? 'selected' : ''}`}
            onClick={() => setActiveView('inbox')}
          >
            <InboxIcon className="menu-icon" /> Inbox <span className="count">{counts.inbox}</span>
          </div>
          <div 
            className={`menu-item ${activeView === 'today' ? 'selected' : ''}`}
            onClick={() => setActiveView('today')}
          >
            <EventAvailableRoundedIcon className="menu-icon" /> Today <span className="count">{counts.today}</span>
          </div>
          <div 
            className={`menu-item ${activeView === 'upcoming' ? 'selected' : ''}`}
            onClick={() => setActiveView('upcoming')}
          >
            <CalendarMonthRoundedIcon className="menu-icon" /> Upcoming <span className="count">{counts.upcoming}</span>
          </div>
          <div 
            className={`menu-item ${activeView === 'completed' ? 'selected' : ''}`}
            onClick={() => setActiveView('completed')}
          >
            <DoneOutlineRoundedIcon className="menu-icon" /> Completed <span className="count">{counts.completed}</span>
          </div>
        </nav>

        <div className="projects">
          <h4>My List</h4>
          <div 
            className={`menu-item ${activeView === 'personal' ? 'selected' : ''}`}
            onClick={() => setActiveView('personal')}
          >
            <LocalLibraryIcon className="menu-icon" /> Personal <span className="count">{tasks.filter(t => t.priority === 'LOW').length}</span>
          </div>
          <div 
            className={`menu-item ${activeView === 'work' ? 'selected' : ''}`}
            onClick={() => setActiveView('work')}
          >
            <WorkIcon className="menu-icon" /> Work <span className="count">{tasks.filter(t => t.priority === 'HIGH').length}</span>
          </div>
          <div 
            className={`menu-item ${activeView === 'learning' ? 'selected' : ''}`}
            onClick={() => setActiveView('learning')}
          >
            <SchoolIcon className="menu-icon" /> Learning <span className="count">{tasks.filter(t => t.priority === 'MEDIUM').length}</span>
          </div>
          <button className="create-list-btn" onClick={() => setShowListPopup(true)}>+ Create New List</button>
          {customLists.map(list => (
            <div 
              key={list.id}
              className={`menu-item ${activeView === `list-${list.id}` ? 'selected' : ''}`}
              onClick={() => setActiveView(`list-${list.id}`)}
              onContextMenu={(e) => handleListRightClick(e, list.id)}
            >
              <NewLabelRoundedIcon className="menu-icon" /> 
              {editingList.id === list.id ? (
                <input
                  type="text"
                  value={editingList.name}
                  onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                  onBlur={() => handleListNameChange(list.id, editingList.name)}
                  onKeyPress={(e) => e.key === 'Enter' && handleListNameChange(list.id, editingList.name)}
                  className="edit-list-input"
                  autoFocus
                />
              ) : (
                list.name
              )}
              <span className="count">{tasks.filter(t => t.category && t.category.id === list.id).length}</span>
            </div>
          ))}
        </div>

        <div className="footer">
        </div>
      </aside>

      {/* Main content */}
      <main className={`main-content ${selectedBackground !== 'none' ? `bg-${selectedBackground}` : ''}`}>
        {reminders.length > 0 && (
          <div className="reminders-section">
            <h4>🔔 Reminders</h4>
            {reminders.map(task => (
              <div key={task.id} className="reminder-item">
                <span>📅 {task.title} is due on {new Date(task.date).toLocaleDateString()}</span>
                <button onClick={() => dismissReminder(task.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="inbox-header">
          <div>
            {activeView === 'inbox' && 'Inbox'}
            {activeView === 'today' && 'Today'}
            {activeView === 'upcoming' && 'Upcoming'}
            {activeView === 'completed' && 'Completed'}
            {activeView === 'personal' && 'Personal Tasks'}
            {activeView === 'work' && 'Work Tasks'}
            {activeView === 'learning' && 'Learning Tasks'}
            {activeView.startsWith('list-') && (
              customLists.find(list => list.id === parseInt(activeView.replace('list-', '')))?.name || 'Custom List'
            )}
          </div>
          <div className="header-controls">
            <select 
              className="background-selector"
              value={selectedBackground}
              onChange={(e) => setSelectedBackground(e.target.value)}
            >
              <option value="none">No Background</option>
              <option value="nature">Nature</option>
              <option value="office">Office</option>
              <option value="minimal">Minimal</option>
              <option value="gradient">Gradient</option>
              <option value="dark">Dark Mode</option>
              <option value="ocean">Ocean</option>
              <option value="sunset">Sunset</option>
              <option value="forest">Forest</option>
              <option value="space">Space</option>
              <option value="retro">Retro</option>
            </select>
            <button className="calendar-btn" onClick={() => navigate('/calendar')}>📅 Calendar</button>
          </div>
        </div>
        
        {activeView === 'upcoming' ? (
          <div className="calendar-view">
            {filteredTasks.map(task => (
              <div key={task.id} className="calendar-task">
                <div className="task-date">{new Date(task.date).toLocaleDateString()}</div>
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className={`task-priority priority-${task.priority.toLowerCase()}`}>{task.priority}</div>
                </div>
                <div className="task-actions">
                  <button 
                    className="edit-task-btn" 
                    onClick={() => handleEditTask(task.id)}
                    title="Edit Task"
                  >
                    <EditIcon />
                  </button>
                  <button 
                    className="delete-task-btn" 
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete Task"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.length === 0 ? (
              <li className="no-tasks">No tasks found</li>
            ) : (
              filteredTasks.map(task => (
                <li key={task.id} className="task-item">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'Completed'}
                    onChange={() => handleTaskComplete(task.id)}
                  />
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <div className="task-subtext">
                      {task.priority === 'HIGH' && '🔴'}
                      {task.priority === 'MEDIUM' && '🟠'}
                      {task.priority === 'LOW' && '🟢'}
                      {' '}{new Date(task.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button 
                      className="edit-task-btn" 
                      onClick={() => handleEditTask(task.id)}
                      title="Edit Task"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      className="delete-task-btn" 
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete Task"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
        
        <button className="add-task-inline" onClick={() => setShowTaskPopup(true)}>+ Add task</button>
      </main>

      {/* Task Popup */}
      {showTaskPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add New Task</h3>
            <form onSubmit={handleTaskSubmit}>
              <input
                type="text"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                required
              />
              <input
                type="date"
                value={taskForm.date}
                onChange={(e) => setTaskForm({...taskForm, date: e.target.value})}
                required
              />
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
              <select
                value={taskForm.categoryId || ''}
                onChange={(e) => setTaskForm({...taskForm, categoryId: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">No Category</option>
                {customLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
              <div className="reminder-section">
                <label>
                  <input
                    type="checkbox"
                    checked={taskForm.reminderEnabled}
                    onChange={(e) => setTaskForm({...taskForm, reminderEnabled: e.target.checked})}
                  />
                  Enable Reminder
                </label>
                {taskForm.reminderEnabled && (
                  <div>
                    <select
                      value={taskForm.reminderDays}
                      onChange={(e) => setTaskForm({...taskForm, reminderDays: parseInt(e.target.value)})}
                    >
                      <option value={1}>1 day before</option>
                      <option value={2}>2 days before</option>
                      <option value={3}>3 days before</option>
                      <option value={7}>1 week before</option>
                    </select>
                    <input
                      type="time"
                      value={taskForm.reminderTime}
                      onChange={(e) => setTaskForm({...taskForm, reminderTime: e.target.value})}
                      className="reminder-time"
                    />
                  </div>
                )}
              </div>
              <div className="popup-buttons">
                <button type="submit">Add Task</button>
                <button type="button" onClick={() => setShowTaskPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Creation Popup */}
      {showTeamPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Create Team</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Team "${teamName}" created! You can now assign tasks to team members.`);
              setTeamName('');
              setShowTeamPopup(false);
            }}>
              <input
                type="text"
                placeholder="Team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
              <div className="popup-buttons">
                <button type="submit">Create Team</button>
                <button type="button" onClick={() => setShowTeamPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Creation Popup */}
      {showListPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Create New List</h3>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                placeholder="List name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                required
              />
              <div className="popup-buttons">
                <button type="submit">Create List</button>
                <button type="button" onClick={() => setShowListPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="context-menu-item"
            onClick={() => {
              const list = customLists.find(l => l.id === contextMenu.listId);
              handleEditList(contextMenu.listId, list.name);
            }}
          >
            Edit
          </div>
          <div 
            className="context-menu-item delete"
            onClick={() => handleDeleteList(contextMenu.listId)}
          >
            Delete
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default UserHome;
