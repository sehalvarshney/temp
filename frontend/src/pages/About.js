import React from "react";
import '../css/About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Animated Background */}
      <div className="about-background">
        <div className="about-bubble bubble-1"></div>
        <div className="about-bubble bubble-2"></div>
        <div className="about-bubble bubble-3"></div>
      </div>

      {/* Navigation */}
      <header className="about-header">
        <div className="about-nav-container">
          <div className="about-logo">
            <div className="about-logo-circle"></div>
            <span className="about-logo-text">LeadIntelligence</span>
          </div>
          
          <nav className="about-nav-menu">
            <a href="/" className="about-nav-link">Home</a>
            <a href="/about" className="about-nav-link active">About</a>
            <a href="/contact" className="about-nav-link">Contact</a>
            <a href="/features" className="about-nav-link">Features</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About Our Platform</h1>
          <p>
            Revolutionizing B2B lead generation with AI-powered intelligence 
            for industrial fuels and specialty products.
          </p>
        </section>

        {/* Mission Section */}
        <section className="about-section mission-section">
          <div className="section-icon">🎯</div>
          <h3>Our Mission</h3>
          <p>
            To transform how industrial sales teams discover and engage with 
            high-potential customers through intelligent data analysis and 
            predictive insights.
          </p>
        </section>

        {/* Problem Section */}
        <section className="about-section problem-section">
          <div className="section-icon">🔍</div>
          <h3>The Problem We Solve</h3>
          <p>
            Traditional B2B sales rely on manual research and outdated methods 
            to identify potential customers, leading to missed opportunities 
            and inefficient resource allocation.
          </p>
          <ul className="problem-list">
            <li>Manual lead discovery is time-consuming</li>
            <li>Missed opportunities in emerging markets</li>
            <li>Lack of predictive insights</li>
            <li>Inefficient sales team allocation</li>
          </ul>
        </section>

        {/* Solution Section */}
        <section className="about-section solution-section">
          <div className="section-icon">💡</div>
          <h3>Our Solution</h3>
          <p>
            We built an AI-powered platform that automatically identifies 
            high-intent industrial customers by analyzing public web signals, 
            news, tenders, and company expansion activities.
          </p>
          <div className="solution-features">
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h4>AI-Powered Analysis</h4>
              <p>Machine learning algorithms process millions of data points</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📈</div>
              <h4>Predictive Scoring</h4>
              <p>Confidence scoring for lead quality and conversion probability</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h4>Real-time Monitoring</h4>
              <p>Continuous tracking of market signals and opportunities</p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="about-section tech-section">
          <div className="section-icon">⚙️</div>
          <h3>Technology Stack</h3>
          <div className="tech-stack">
            <div className="tech-card">
              <h4>Frontend</h4>
              <ul>
                <li>React.js</li>
                <li>Redux</li>
                <li>CSS3 with Animations</li>
                <li>Chart.js</li>
              </ul>
            </div>
            <div className="tech-card">
              <h4>Backend</h4>
              <ul>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>Redis</li>
              </ul>
            </div>
            <div className="tech-card">
              <h4>AI/ML</h4>
              <ul>
                <li>Python</li>
                <li>TensorFlow</li>
                <li>NLP Processing</li>
                <li>Predictive Models</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section team-section">
          <div className="section-icon">👥</div>
          <h3>Built For</h3>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">🏭</div>
              <h4>Industrial Sales Teams</h4>
              <p>Accelerate lead generation and improve conversion rates</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">🏢</div>
              <h4>Business Development</h4>
              <p>Identify market expansion opportunities with data-driven insights</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">📊</div>
              <h4>Sales Operations</h4>
              <p>Optimize resource allocation and track performance metrics</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <h3>Ready to Transform Your Sales Process?</h3>
          <p>Join leading industrial companies using our platform</p>
          <a href="/contact" className="cta-button">Get Started Today</a>
        </section>
      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logo-icon">🚀</div>
            <span>LeadIntelligence</span>
          </div>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
            <a href="/careers">Careers</a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} LeadIntelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;