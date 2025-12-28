import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import './NavigationLogout.css'; // Assuming you're styling it separately

const NavigationLogout = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userRole = currentUser.role;

  const funnyMessages = [
    "Don't miss this task like you missed your last deadline! 😅",
    "Your task is calling... Will you answer? 📞",
    "Time to be productive! Your future self will thank you 🚀",
    "This task won't complete itself! Get moving! 💪",
    "Procrastination is the thief of time... Don't let it steal yours! ⏰",
    "Your task is waiting patiently... Don't keep it waiting too long! 😊",
    "Remember: Done is better than perfect! Let's go! ✨",
    "Your productivity meter is beeping! Time to act! 📊"
  ];

  useEffect(() => {
    if (currentUser.id) {
      // Load dismissed notifications from localStorage
      const saved = localStorage.getItem(`dismissedNotifications_${currentUser.id}`);
      if (saved) {
        setDismissedNotifications(new Set(JSON.parse(saved)));
      }
      fetchUserNotifications();
      const interval = setInterval(fetchUserNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [currentUser.id]);

  const fetchUserNotifications = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token || !currentUser.id) return;
      
      const res = await fetch('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tasks = await res.json();
      
      const userTasks = tasks.filter(task => task.user && task.user.id === currentUser.id);
      const now = new Date();
      
      // Show notifications for all pending tasks with reminders enabled
      const activeReminders = userTasks.filter(task => {
        if (task.status === 'Completed') return false;
        
        // Show notification if reminder is enabled OR if task is due soon
        const taskDate = new Date(task.date);
        const daysDiff = Math.ceil((taskDate - now) / (1000 * 60 * 60 * 24));
        
        // Show if reminder enabled or if task is due within 3 days
        return task.reminderEnabled || daysDiff <= 3;
      });
      
      const notificationList = activeReminders
        .filter(task => !dismissedNotifications.has(task.id))
        .map(task => ({
          id: task.id,
          title: task.title,
          dueDate: new Date(task.date).toLocaleDateString(),
          dueTime: task.reminderTime || '09:00',
          message: funnyMessages[Math.floor(Math.random() * funnyMessages.length)],
          priority: task.priority
        }));
      
      setNotifications(notificationList);
      setHasNotifications(notificationList.length > 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleFeatures = () => {
    navigate("/featureSection");
  };

  const handleAboutUs = () => {
    navigate("/aboutUs");
  };

  const handleDashboard = () => {
    if (userRole === 'ADMIN') {
      navigate('/adminPage');
    } else if (userRole === 'USER') {
      navigate('/userHome');
    } else if (userRole === 'MANAGER') {
      navigate('/manager');
    }
    setShowDropdown(false);
  };

  const handleProfile = () => {
    navigate('/profilePage');
    setShowDropdown(false);
  };

  const clearAllNotifications = () => {
    const newDismissed = new Set(dismissedNotifications);
    notifications.forEach(notification => {
      newDismissed.add(notification.id);
    });
    setDismissedNotifications(newDismissed);
    setNotifications([]);
    setHasNotifications(false);
    localStorage.setItem(`dismissedNotifications_${currentUser.id}`, JSON.stringify([...newDismissed]));
  };

  const dismissSingleNotification = (notificationId) => {
    const newDismissed = new Set(dismissedNotifications);
    newDismissed.add(notificationId);
    setDismissedNotifications(newDismissed);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setHasNotifications(notifications.length > 1);
    localStorage.setItem(`dismissedNotifications_${currentUser.id}`, JSON.stringify([...newDismissed]));
  };


  return (
    <div className="nav">
      <nav className="navbar">
        {/* Left links */}
        <ul className="nav-left">
          <div className="logo">AdvancedToDo</div>
          <li onClick={handleHome}>Home</li>
          <li onClick={handleFeatures}>Features</li>
          <li onClick={handleAboutUs}>About Us</li>
        </ul>

        {/* Right buttons */}
        <div className="nav-right">
          <div className="notification-container">
            <NotificationsActiveIcon 
              className={`notification-icon ${hasNotifications ? 'shake' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {hasNotifications && <span className="notification-badge">{notifications.length}</span>}
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Task Reminders</h4>
                  <div className="header-actions">
                    {notifications.length > 0 && (
                      <button className="clear-all-btn" onClick={clearAllNotifications}>
                        Clear All
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)}>✕</button>
                  </div>
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      🎉 All caught up! No pending reminders.
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div key={notification.id} className="notification-item">
                        <div className="notification-content">
                          <div className="task-title">{notification.title}</div>
                          <div className="task-timing">
                            📅 Due: {notification.dueDate} at {notification.dueTime}
                          </div>
                          <div className={`priority-badge priority-${notification.priority.toLowerCase()}`}>
                            {notification.priority}
                          </div>
                          <div className="funny-message">{notification.message}</div>
                        </div>
                        <button 
                          className="dismiss-btn"
                          onClick={() => dismissSingleNotification(notification.id)}
                          title="Dismiss this notification"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="profile-dropdown">
            <AccountCircleIcon 
              className="profile-icon" 
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item dashboard-item" onClick={handleDashboard}>
                  <HomeIcon className="dropdown-icon" />
                  {userRole ? `${userRole.charAt(0) + userRole.slice(1).toLowerCase()} Dashboard` : 'Dashboard'}
                </div>
                <div className="dropdown-item profile-item" onClick={handleProfile}>
                  <InsertEmoticonIcon className="dropdown-icon" />
                  Profile
                </div>
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogoutIcon className="dropdown-icon" />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavigationLogout;
