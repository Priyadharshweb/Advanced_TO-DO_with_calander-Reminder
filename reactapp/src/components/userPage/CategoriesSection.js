import React, { useState } from 'react';
import './CategoriesSection.css';
import {useNavigate} from 'react-router-dom';
const CategoriesSection = () => {
  const navigate=useNavigate();
  const handleUsersHome=()=>{
    navigate("/UserHome");
  };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);

  const categories = [
    { name: 'Personal', icon: '👤' },
    { name: 'Work', icon: '💼' },
    { name: 'Education', icon: '💡' },
  ];

  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleCollaboration = () => {
    setCollaborationEnabled((prev) => !prev);
  };

  return (
    <div className="categories-container">
      <div className="categories-left">
        <h2>How do you plan to use this app?</h2>
        <p>Choose all that apply.</p>

        <div className="categories-options">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`category-option ${
                selectedCategories.includes(category.name) ? 'selected' : ''
              }`}
              onClick={() => toggleCategory(category.name)}
            >
              <span className="icon">{category.icon}</span>
              {category.name}
            </div>
          ))}
        </div>

        <div className="collab-toggle">
          <label>Collaboration with Team</label>
          <button
            className={`toggle-btn ${collaborationEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleCollaboration}
          >
            {collaborationEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <button
          className="launch-btn"
          disabled={selectedCategories.length === 0} onClick={handleUsersHome}
        >
          Launch App
        </button>
      </div>

      <div className="categories-right">
        <img
          src="https://img.freepik.com/free-vector/colorful-todo-list-illustration_1308-172724.jpg"
          alt="To-do Illustration"
        />
      </div>
    </div>
  );
};

export default CategoriesSection;
