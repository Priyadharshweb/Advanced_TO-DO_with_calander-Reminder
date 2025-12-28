import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";
import NavigationLogout from "./NavigationLogout";

const AdminPage = () => {
  const navigate = useNavigate();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const [usersRes, tasksRes] = await Promise.all([
        axios.get("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8080/api/tasks", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const users = usersRes.data;
      const tasks = tasksRes.data;

      setSystemStats({
        totalUsers: users.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === "Completed").length,
        pendingTasks: tasks.filter(t => t.status !== "Completed").length
      });
    } catch (error) {
      console.error("Failed to fetch system stats:", error);
    }
  };

  const handleUsers = () => {
    navigate("/userList");
  };

  const handleTask = () => {
    navigate("/task");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <NavigationLogout />
      <div className="admin-container">
        {/* Side Heading */}
        <div className="admin-title-heading">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Admin Cards Section */}
        <div className="admin-cards-section">
          <div className="admin-features">
            <div className="admin-card">
              <h3>Manage Users</h3>
              <p>
                Easily manage your users records, track details, and maintain an
                up-to-date roster.
              </p>
              <button className="admin-btn" onClick={handleUsers}>View Users</button>
            </div>

            <div className="admin-card">
              <h3>Track Tasks</h3>
              <p>
                Organize your company's structure with detailed information on each
                department.
              </p>
              <button className="admin-btn" onClick={handleTask}>View Tasks</button>
            </div>

            <div className="admin-card">
              <h3>Analyze Growth</h3>
              <p>
                Use our comprehensive dashboard to analyze employee growth and
                organizational structure.
              </p>
              <button className="admin-btn" onClick={handleDashboard}>Go to Dashboard</button>
            </div>
          </div>
        </div>

        {/* System Overview Section */}
        <div className="system-overview">
          <h2>System Overview</h2>
          <div className="overview-stats">
            <div className="stat-card">
              <div className="stat-number">{systemStats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{systemStats.totalTasks}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{systemStats.completedTasks}</div>
              <div className="stat-label">Completed Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{systemStats.pendingTasks}</div>
              <div className="stat-label">Pending Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
