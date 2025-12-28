import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import NavigationLogout from '../NavigationLogout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.id) return;

      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`http://localhost:8080/api/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        fetchUserStats(currentUser.id, token);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const fetchUserStats = async (userId, token) => {
    try {
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userTasks = res.data.filter(task => task.user.id === userId);
      const completed = userTasks.filter(task => task.status === 'Completed').length;
      setStats({
        totalTasks: userTasks.length,
        completedTasks: completed,
        pendingTasks: userTasks.length - completed
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return (
    <>
      <NavigationLogout/>
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    </>
  );

  const handleEditToggle = () => {
    if (isEditing) {
      // Save on backend
      const token = localStorage.getItem('jwt');
      axios.put(`http://localhost:8080/api/users/${user.id}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => alert("Profile updated"))
        .catch(() => alert("Failed to update"));
    }
    setIsEditing(!isEditing);
  };

  const handleProfileClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target.result;
          setUser(prev => ({ ...prev, profileImage: imageData }));
          localStorage.setItem('profileImage_' + user.id, imageData);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
    <NavigationLogout/>
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-main">
          <div className="profile-pic-section">
            <img 
              src={localStorage.getItem('profileImage_' + user.id) || user.profileImage || "https://i.pravatar.cc/150?img=11"} 
              alt="avatar" 
              className="profile-pic clickable" 
              onClick={handleProfileClick}
              title="Click to change profile picture"
            />
            <div className="online-status"></div>
          </div>
          <div className="profile-details">
            <div className="name-section">
              <h2>{user.name}</h2>
              <span className={`role-badge ${user.role?.toLowerCase()}`}>{user.role}</span>
            </div>
            <p className="user-email"><EmailIcon className="icon" /> {user.email}</p>
            <button className="edit-button" onClick={handleEditToggle}>
              {isEditing ? <><SaveIcon /> Save</> : <><EditIcon /> Edit Profile</>}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="left-section">
            <div className="info-card">
              <h3><PersonIcon className="section-icon" /> Personal Information</h3>
              <div className="form-section">
                <div className="form-group">
                  <label><PersonIcon className="input-icon" /> Full Name</label>
                  <input type="text" name="name" value={user.name || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                  <label><EmailIcon className="input-icon" /> Email Address</label>
                  <input type="email" name="email" value={user.email || ''} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                  <label><PhoneIcon className="input-icon" /> Phone Number</label>
                  <input type="tel" name="phone" value={user.phone || ''} onChange={handleChange} disabled={!isEditing} placeholder="Enter phone number" />
                </div>
                <div className="form-group">
                  <label><LocationOnIcon className="input-icon" /> Location</label>
                  <input type="text" name="location" value={user.location || ''} onChange={handleChange} disabled={!isEditing} placeholder="Enter location" />
                </div>
              </div>
            </div>
          </div>
            <div className="activity-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-dot completed"></div>
                  <div className="activity-text">
                    <p>Completed {stats.completedTasks} tasks</p>
                    <small>This month</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot pending"></div>
                  <div className="activity-text">
                    <p>{stats.pendingTasks} tasks pending</p>
                    <small>Need attention</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot profile"></div>
                  <div className="activity-text">
                    <p>Profile updated</p>
                    <small>Today</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;