import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const isUserLoggedIn = localStorage.getItem('jwt') && localStorage.getItem('currentUser');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userRole = currentUser.role;

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLoginOnLanding = () => {
    navigate("/login");
  };

  const handleFeatures = () => {
    navigate("/featureSection");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleAboutUs = () => {
    navigate("/aboutUs");
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
    navigate('/');
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

  return (
    <div className='nav'>
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
          <button className="loginn-btn" onClick={handleLoginOnLanding}>LOGIN</button>
          <button className="signup-btn" onClick={handleGetStarted}>SIGNUP</button>
          <div className="profile-dropdown">
            <AccountCircleIcon 
              className="profile-icon" 
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                {isUserLoggedIn ? (
                  <>
                    <div className="dropdown-item" onClick={handleDashboard}>
                      {userRole ? `${userRole.charAt(0) + userRole.slice(1).toLowerCase()} Dashboard` : 'Dashboard'}
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </div>
                  </>
                ) : (
                  <div className="dropdown-item" onClick={handleLoginOnLanding}>
                    Login
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
