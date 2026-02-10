import React, { useState } from "react";
import '../css/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="contact-container">
      {/* Animated Background */}
      <div className="contact-background">
        <div className="contact-bubble bubble-1"></div>
        <div className="contact-bubble bubble-2"></div>
        <div className="contact-bubble bubble-3"></div>
      </div>

      {/* Navigation */}
      <header className="contact-header">
        <div className="contact-nav-container">
          <div className="contact-logo">
            <div className="contact-logo-circle"></div>
            <span className="contact-logo-text">LeadIntelligence</span>
          </div>
          
          <nav className="contact-nav-menu">
            <a href="/" className="contact-nav-link">Home</a>
            <a href="/about" className="contact-nav-link">About</a>
            <a href="/contact" className="contact-nav-link active">Contact</a>
            <a href="/features" className="contact-nav-link">Features</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="contact-main">
        {/* Hero Section */}
        <section className="contact-hero">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Reach out for inquiries, demos, or partnerships.</p>
        </section>

        {/* Contact Info Grid */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-icon">📝</div>
            <h3>Send us a Message</h3>
            
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h4>Message Sent Successfully!</h4>
                <p>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 90000 00000"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows="5"
                    required
                  />
                </div>
                
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="info-icon">📍</div>
            <h3>Contact Information</h3>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="card-icon">📧</div>
                <h4>Email</h4>
                <p>support@b2bleadintel.com</p>
                <a href="mailto:support@b2bleadintel.com" className="info-link">
                  Send Email
                </a>
              </div>
              
              <div className="info-card">
                <div className="card-icon">📞</div>
                <h4>Phone</h4>
                <p>+91 90000 00000</p>
                <a href="tel:+919000000000" className="info-link">
                  Call Now
                </a>
              </div>
              
              <div className="info-card">
                <div className="card-icon">🏢</div>
                <h4>Location</h4>
                <p>India</p>
                <p className="info-note">Remote team across major cities</p>
              </div>
              
              <div className="info-card">
                <div className="card-icon">⏰</div>
                <h4>Business Hours</h4>
                <p>Mon - Fri: 9AM - 6PM</p>
                <p>Sat: 10AM - 4PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <section className="support-section">
          <div className="section-icon">💬</div>
          <h3>Support Channels</h3>
          <div className="channels-grid">
            <div className="channel">
              <div className="channel-icon">🔧</div>
              <h4>Technical Support</h4>
              <p>For technical issues and platform assistance</p>
              <a href="mailto:tech@b2bleadintel.com" className="channel-link">
                tech@b2bleadintel.com
              </a>
            </div>
            
            <div className="channel">
              <div className="channel-icon">💰</div>
              <h4>Sales Inquiries</h4>
              <p>For pricing, demos, and partnership opportunities</p>
              <a href="mailto:sales@b2bleadintel.com" className="channel-link">
                sales@b2bleadintel.com
              </a>
            </div>
            
            <div className="channel">
              <div className="channel-icon">🤝</div>
              <h4>Partnerships</h4>
              <p>For business development and collaborations</p>
              <a href="mailto:partners@b2bleadintel.com" className="channel-link">
                partners@b2bleadintel.com
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-icon">❓</div>
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How quickly do you respond?</h4>
              <p>We typically respond within 24 hours during business days. Emergency support is available within 4 hours.</p>
            </div>
            
            <div className="faq-item">
              <h4>Do you offer platform demos?</h4>
              <p>Yes, we provide personalized demos. Contact our sales team to schedule a session.</p>
            </div>
            
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>We offer a 14-day free trial with full platform access to qualified businesses.</p>
            </div>
            
            <div className="faq-item">
              <h4>What industries do you serve?</h4>
              <p>We specialize in industrial manufacturing, energy, chemicals, and B2B services.</p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <div className="section-icon">🗺️</div>
          <h3>Our Presence</h3>
          <div className="map-placeholder">
            <div className="map-content">
              <div className="location-pin">
                <div className="pin-icon">📍</div>
                <span>India Headquarters</span>
              </div>
              <p className="map-note">Serving clients across India with remote support teams in major cities.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="contact-cta">
          <h3>Ready to Transform Your Sales Process?</h3>
          <p>Book a demo today and see how our platform can accelerate your lead generation.</p>
          <a href="mailto:sales@b2bleadintel.com" className="cta-button">
            Schedule a Demo
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="contact-footer">
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

export default Contact;