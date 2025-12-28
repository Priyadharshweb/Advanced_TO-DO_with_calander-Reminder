import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import AdminPage from './components/AdminPage';
import NavigationBar from './components/NavigationBar';
import UserList from './components/UserList';
import AddUsers from './components/AddUsers';
import Task from './components/Task';
import AddTask from './components/AddTask';
import EditUser from './components/EditUser';
import CategoriesSection from './components/userPage/CategoriesSection';
import UserHome from './components/userPage/UserHome';
import Calendar from './components/Calendar';
import FeatureSection from './components/FeatureSection';
import AboutUs from './components/AboutUs';
import EditTask from './components/userPage/EditTask';
import ProfilePage from './components/profile/ProfilePage';



const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/featureSection" element={<FeatureSection/>}/>
      <Route path="/aboutUs" element={<AboutUs/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/adminPage" element={<AdminPage/>}/>
      <Route path="/userList" element={<UserList/>}/>
      <Route path="/addusers" element={<AddUsers/>}/>
      <Route path="/editUser/:id" element={<EditUser/>}/>
      <Route path="/task" element={<Task/>}/>
      <Route path="/addTask" element={<AddTask/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categoriesSection" element={<CategoriesSection/>}/>
      <Route path="/UserHome" element={<UserHome/>}/>
      <Route path="/editTask/:id" element={<EditTask/>}/>
      <Route path="/calendar" element={<Calendar/>}/>
      <Route path="/profilePage" element={<ProfilePage/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
