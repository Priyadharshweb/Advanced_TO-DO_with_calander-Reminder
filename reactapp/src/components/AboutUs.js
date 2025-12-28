import React from 'react';
import NavigationBar from './NavigationBar';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <NavigationBar />

      {/* Hero Section */}
      <section className="aboutus-hero">
        <h1>About <span style={{ color: "yellow" }}>Advanced To-Do</span></h1>
        <p>Redefining task management with innovation, precision, and elegance.</p>
      </section>

      <div className="aboutus-container">

        {/* Mission Section */}
        <section className="aboutus-mission">
          <div className="aboutus-mission-text">
            <h2>Who We Are</h2>
            <p>
              Founded in 2023, we aim to revolutionize productivity by delivering intuitive, smart, and scalable task management solutions. Whether you're an individual or part of a large team, our tools are designed to fit your lifestyle and workflow.
            </p>
          </div>
          <div className="aboutus-mission-image">
            <img
              src="https://media.istockphoto.com/id/1284038459/photo/im-sure-ill-have-all-the-boxes-checked-by-tonight.jpg?s=612x612&w=0&k=20&c=Ax0lmBiU67ZdkmDhlT5-NIgBtUCmtQngac9E7fFRWQo="
              alt="About Us"
            />
          </div>
        </section>

        {/* Rich and Diverse Features Section */}
        <section className="feature-gallery">
          <h2 className="section-title-why">Why Choose Us?</h2>
          <div className="feature-gallery-header">
            <h2 className="highlight">Rich and diverse features</h2>
            <div className="subheading">Meet your unique needs</div>
          </div>

          <div className="gallery-grid">
            {/* Copy only the icons & titles you want from the previous data OR use map if from array */}
            <div className="feature-card">
              <h3>Constant Reminder</h3>
              <p>Notifications keep ringing until you handle them.</p>
            </div>

            <div className="feature-card">
              <h3>Repeat Reminder</h3>
              <p>Use recurring rules like weekly, monthly, yearly.</p>
            </div>

            <div className="feature-card">
              <h3>NLP</h3>
              <p>Smart time recognition from your input.</p>
            </div>

            <div className="feature-card">
              
              <h3>Filter</h3>
              <p>Filter high-priority tasks by week, tag, or category.</p>
            </div>

            <div className="feature-card">
             
              <h3>Keyboard Shortcuts</h3>
              <p>Quickly access features using shortcuts or commands.</p>
            </div>

            <div className="feature-card">
            
              <h3>Collaboration</h3>
              <p>Assign tasks, share lists, and boost team efficiency.</p>
            </div>

            <div className="feature-card">
              
              <h3>Statistics</h3>
              <p>Track your focus, task completion, and habits.</p>
            </div>

            <div className="feature-card">
            
              <h3>Theme</h3>
              <p>Choose from 40+ themes to customize your app.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
