import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card, CardContent, Grid, Typography, Box, CircularProgress } from '@mui/material';
import NavigationBar from './NavigationBar';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [taskGrowth, setTaskGrowth] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState({ admin: 0, user: 0, manager: 0 });
  const [statusData, setStatusData] = useState({ pending: 0, inProgress: 0, completed: 0 });
  const [monthlyTasks, setMonthlyTasks] = useState({ thisMonth: 0, lastMonth: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [usersRes, tasksRes] = await Promise.all([
          axios.get('http://localhost:8080/api/users', { headers }),
          axios.get('http://localhost:8080/api/tasks', { headers })
        ]);
        
        const users = usersRes.data;
        const tasks = tasksRes.data;
        
        setUserCount(users.length);
        setTaskCount(tasks.length);
        setCompletedTasks(tasks.filter(task => task.status === 'Completed').length);

        // Role distribution
        const roles = { admin: 0, user: 0, manager: 0 };
        users.forEach(user => {
          const role = user.role ? user.role.toLowerCase() : 'user';
          if (roles.hasOwnProperty(role)) {
            roles[role]++;
          } else {
            roles.user++; // Default to user if role not recognized
          }
        });
        setRoleData(roles);

        // Status distribution
        const statuses = { pending: 0, inProgress: 0, completed: 0 };
        tasks.forEach(task => {
          if (task.status === 'Pending') statuses.pending++;
          else if (task.status === 'In Progress') statuses.inProgress++;
          else if (task.status === 'Completed') statuses.completed++;
        });
        setStatusData(statuses);

        // Priority distribution
        const priorities = { LOW: 0, MEDIUM: 0, HIGH: 0 };
        tasks.forEach(task => {
          const priority = task.priority ? task.priority.toUpperCase() : 'LOW';
          if (priorities.hasOwnProperty(priority)) {
            priorities[priority]++;
          }
        });
        setPriorityData(priorities);

        // Calculate actual monthly data
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const thisMonthTasks = tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
        }).length;
        
        const lastMonthTasks = tasks.filter(task => {
          const taskDate = new Date(task.date);
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return taskDate.getMonth() === lastMonth && taskDate.getFullYear() === lastMonthYear;
        }).length;
        
        setMonthlyTasks({ thisMonth: thisMonthTasks, lastMonth: lastMonthTasks });

        // Calculate task growth data based on actual dates
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const growthData = [];
        
        for (let i = 5; i >= 0; i--) {
          const targetDate = new Date(currentYear, currentMonth - i, 1);
          const monthTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate.getMonth() === targetDate.getMonth() && taskDate.getFullYear() === targetDate.getFullYear();
          }).length;
          
          growthData.push({
            month: monthNames[targetDate.getMonth()],
            count: monthTasks
          });
        }
        
        setTaskGrowth(growthData);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Set default values if API calls fail
        setUserCount(0);
        setTaskCount(0);
        setCompletedTasks(0);
        setRoleData({ admin: 0, user: 0, manager: 0 });
        setStatusData({ pending: 0, inProgress: 0, completed: 0 });
        setPriorityData({ LOW: 0, MEDIUM: 0, HIGH: 0 });
        setMonthlyTasks({ thisMonth: 0, lastMonth: 0 });
        setTaskGrowth([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const animationStyle = {
    animation: 'dropDown 0.8s ease forwards',
    opacity: 0,
    '@keyframes dropDown': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  };

  const totalOverviewData = {
    labels: ['Users', 'Tasks'],
    datasets: [
      {
        label: 'Total Count',
        data: [userCount, taskCount],
        backgroundColor: ['#3f51b5', '#ff9800'],
        borderColor: ['#3f51b5', '#ff9800'],
        borderWidth: 1,
      },
    ],
  };

  const roleChartData = {
    labels: ['Admin', 'User', 'Manager'],
    datasets: [
      {
        label: 'Role Distribution',
        data: [roleData.admin, roleData.user, roleData.manager],
        backgroundColor: ['#42A5F5', '#FF7043', '#66BB6A'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Task Status',
        data: [statusData.pending, statusData.inProgress, statusData.completed],
        backgroundColor: ['#FFEB3B', '#FF9800', '#4CAF50'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const priorityChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Task Priority',
        data: [priorityData.LOW, priorityData.MEDIUM, priorityData.HIGH],
        backgroundColor: ['#4FC3F7', '#FFB74D', '#F44336'],
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const monthlyTasksData = {
    labels: ['This Month', 'Last Month'],
    datasets: [
      {
        label: 'Monthly Tasks',
        data: [monthlyTasks.thisMonth, monthlyTasks.lastMonth],
        backgroundColor: ['#8BC34A', '#FFC107'],
        borderColor: ['#8BC34A', '#FFC107'],
        borderWidth: 1,
      },
    ],
  };

  const taskGrowthData = taskGrowth.length
    ? {
        labels: taskGrowth.map(d => d.month),
        datasets: [
          {
            label: 'Task Growth Over Time',
            data: taskGrowth.map(d => d.count),
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const lineChartData = taskGrowth.length
    ? {
        labels: taskGrowth.map(d => d.month),
        datasets: [
          {
            label: 'Task Growth Trend',
            data: taskGrowth.map(d => d.count),
            fill: false,
            borderColor: '#FF6384',
            tension: 0.1,
          },
        ],
      }
    : null;

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <NavigationBar/>
    <Box sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>
        Task Management Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Metric Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" textAlign="center">
                Total Users
              </Typography>
              <Typography variant="h4" textAlign="center">
                {userCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" textAlign="center">
                Total Tasks
              </Typography>
              <Typography variant="h4" textAlign="center">
                {taskCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" textAlign="center">
                Completed Tasks
              </Typography>
              <Typography variant="h4" textAlign="center">
                {completedTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Total Overview</Typography>
              <Bar data={totalOverviewData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Task Priority Distribution</Typography>
              <Bar data={priorityChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Task Growth Over Time</Typography>
              {taskGrowthData ? <Bar data={taskGrowthData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Monthly Tasks Comparison</Typography>
              <Bar data={monthlyTasksData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Task Status Distribution</Typography>
              <Pie data={statusChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Task Growth Trend</Typography>
              {lineChartData ? <Line data={lineChartData} /> : <Typography>No data available</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">User Role Distribution</Typography>
              <Bar data={roleChartData} options={{ scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">Task Priority Breakdown</Typography>
              <Pie data={priorityChartData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...animationStyle, boxShadow: 3, borderRadius: 2, height: '100%', backgroundColor: '#fff' }}>
            <CardContent>
              <Typography variant="h6">User Roles Overview</Typography>
              <Pie data={roleChartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Dashboard;
