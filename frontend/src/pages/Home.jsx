import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-content nb-container">
        <header className="hero-section">
          <h1 className="hero-title">
            Welcome to <span className="brand">NebulaBoard</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate platform for managing your projects and tasks with ease.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-ghost btn-large">
              Login
            </Link>
          </div>
        </header>

        <section className="features-section">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Project Management</h3>
              <p>Organize your projects, assign tasks, and track progress.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Customizable Boards</h3>
              <p>Create boards that fit your workflow with custom columns and cards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Work with your team in real-time and stay in sync.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>Sign up for free and start managing your projects today.</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Sign Up Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(Home);