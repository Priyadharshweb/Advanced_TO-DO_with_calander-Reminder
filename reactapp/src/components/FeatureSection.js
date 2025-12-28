import React from 'react';
import './FeaturesSection.css';
import NavigationBar from './NavigationBar';

const FeatureSection = () => {
  return (
    <>
      <NavigationBar />

      {/* Hero Section for Features */}
      <section className="feature-hero">
        <h1 className="hero-title floating-text">
          Boost Your Productivity <br />
          <span className="hero-highlight">with Features</span>
        </h1>
        <p className="hero-subtext">
          Strike a balance between powerful features and ease of use to keep you focused on goals.
        </p>
      </section>

      {/* Feature Cards */}
      <div className="gallery">
        <div className="title-group">
          <h2 className="title highlight">Rich and diverse features</h2>
          <div className="subtitle">Meet your unique needs</div>
        </div>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-title">Constant Reminder</div>
            <div className="feature-desc">Notifications will keep ringing until you handle them.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Repeat Reminder</div>
            <div className="feature-desc">Set weekly, monthly, or custom repeating reminders.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">NLP</div>
            <div className="feature-desc">Smart time recognition from input with auto reminders.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Filter</div>
            <div className="feature-desc">Easily customize and apply filters like “high-priority tasks.”</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Keyboard Shortcuts</div>
            <div className="feature-desc">Perform quick operations with command menus.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Collaboration</div>
            <div className="feature-desc">Assign tasks and share lists with friends or colleagues.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Integration</div>
            <div className="feature-desc">Subscribe to calendar, integrate with apps, manage all.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Statistics</div>
            <div className="feature-desc">Track focus duration, tasks, and habits.</div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Theme</div>
            <div className="feature-desc">Customize your UI with 40+ themes.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureSection;
