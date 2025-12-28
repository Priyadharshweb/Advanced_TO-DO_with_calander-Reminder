import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";


const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="landing-container">
     <NavigationBar/>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <h1>
            stay organized, <br /> stay focused, <br /> achieve your goals effortlessly!
          </h1>
          <p>
            <b>
              Manage tasks, set deadlines,
              <br />
              and get smart reminders — making productivity simple and effective!
            </b>
          </p>
          <button className="dashboard-btn" onClick={handleGetStarted}>
            Get Started Now
          </button>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG8lMjBkbyUyMGxpc3R8ZW58MHx8MHx8fDA%3D"
            alt="To Do List"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-left">
          <img
            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRhc2tzfGVufDB8fDB8fHww"
            alt="Task Management"
          />
        </div>

        <div className="features-right">
          <h2>Key <span>Features</span></h2>
          <ul>
            <li>Create and manage tasks effortlessly</li>
            <li>Set deadlines and reminders to stay on track</li>
            <li>Organize tasks by categories and priorities</li>
            <li>Collaborate with your team seamlessly</li>
            <li>Get productivity insights and reports</li>
            <li>Simple, fast, and user-friendly interface</li>
          </ul>
          <button className="explore-btn" onClick={handleGetStarted}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About <span>Our Project</span></h2>
        <p className="about-desc">
          Our project helps you manage tasks effortlessly, stay organized, and work smarter.
          It's designed for individuals, teams, and organizations to improve productivity.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <img
              src="https://media.istockphoto.com/id/2004891095/photo/busy-mid-aged-business-woman-working-in-office-with-laptop-and-documents.jpg?s=612x612&w=0&k=20&c=y8IqPqzMZebJFtWaajNY5hVJKWnI4d_7pNO_c1caWsU="
              alt="Organize Work"
            />
            <h3>Organize Your Work</h3>
            <p>Easily track, manage, and organize your tasks and deadlines efficiently.</p>
          </div>

          <div className="about-card">
            <img
              src="https://smallstuffcounts.com/wp-content/uploads/2018/07/free-printable-assignment-tracker_lri-6.jpg"
              alt="Task Tracking"
            />
            <h3>Smart Task Tracking</h3>
            <p>Keep your assignments and projects well-planned and up-to-date.</p>
          </div>

          <div className="about-card">
            <img
              src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?cs=srgb&dl=pexels-fauxels-3182773.jpg&fm=jpg"
              alt="Collaboration"
            />
            <h3>Team Collaboration</h3>
            <p>Collaborate with your team seamlessly and achieve goals together.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
