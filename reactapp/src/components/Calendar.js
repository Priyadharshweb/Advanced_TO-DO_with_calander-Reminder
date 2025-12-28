import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationLogout from './NavigationLogout';
import './Calendar.css';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
      const userTasks = res.data.filter(task => task.user.id === currentUserId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAndUpcomingTasks = userTasks.filter(task => new Date(task.date) >= today);
      setTasks(todayAndUpcomingTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getTasksForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <NavigationLogout />
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>📅 Task Calendar</h2>
          <div className="user-info">
            <span>Welcome, {currentUser?.name || 'User'}!</span>
          </div>
        </div>

      <div className="calendar-navigation">
        <button onClick={() => navigateMonth(-1)}>‹</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={() => navigateMonth(1)}>›</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-days-header">
          {dayNames.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {getDaysInMonth(currentDate).map((day, index) => {
            const dayTasks = getTasksForDate(day);
            return (
              <div key={index} className={`calendar-day ${day ? 'active' : 'inactive'}`}>
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    <div className="day-tasks">
                      {dayTasks.map(task => (
                        <div key={task.id} className={`task-item priority-${task.priority.toLowerCase()}`}>
                          <div className="task-title">{task.title}</div>
                          <div className="task-priority">{task.priority}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default Calendar;