import React, { useState } from "react";
import "./Calander.css"; // Your CSS file
import NavigationLogout from "../NavigationLogout";

const Calander = ({ tasks }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderCalendar = () => {
    const calendarDays = [];

    // empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div className="calendar-cell empty" key={`empty-${i}`}></div>);
    }

    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayTasks = tasks.filter((t) => t.date === dateStr);

      calendarDays.push(
        <div className="calendar-cell" key={day}>
          <div className="date">{day}</div>
          {dayTasks.map((task) => (
            <div key={task.id} className={`reminder priority-${task.priority.toLowerCase()}`}>
              {task.title}
            </div>
          ))}
        </div>
      );
    }

    return calendarDays;
  };
 
  return <div className="calendar-grid">{renderCalendar()}</div>;

};

export default Calander;
