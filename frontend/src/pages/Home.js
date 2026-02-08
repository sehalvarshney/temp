// Home.js
import React from 'react';
import '../css/Home.css';

function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <div className="logo-container">
                    <div className="hpcl-logo">
                        <div className="logo-circle"></div>
                        <div className="logo-text">HPCL</div>
                    </div>
                    <h1>B2B Lead Intelligence Agent</h1>
                </div>
                
                <nav className="home-nav">
                    <a href="/home" className="nav-link active">Home</a>
                    <a href="/about" className="nav-link">About</a>
                    <a href="/contact" className="nav-link">Contact</a>
                    <a href="/login" className="nav-link login-btn">Login</a>
                    <a href="/register" className="nav-link register-btn">Register</a>
                </nav>
            </header>

            <main className="home-main">
                <section className="hero-section">
                    <div className="hero-content">
                        <h2>Transform B2B Lead Generation</h2>
                        <p>AI-powered intelligence for discovering industrial customers, predicting product needs, and generating actionable sales leads.</p>
                        <div className="hero-buttons">
                            <a href="/register" className="cta-primary">Get Started</a>
                            <a href="/about" className="cta-secondary">Learn More</a>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="visual-circle"></div>
                        <div className="visual-line"></div>
                        <div className="visual-dots">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="dot"></div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="features-section">
                    <h3>Key Features</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h4>Web Intelligence</h4>
                            <p>Monitor public signals from websites, news, tenders, and industry directories</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h4>AI Product Inference</h4>
                            <p>Predict customer product requirements using intelligent extraction</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📋</div>
                            <h4>Lead Dossier</h4>
                            <p>Generate comprehensive company profiles with procurement clues</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h4>Instant Alerts</h4>
                            <p>Real-time WhatsApp notifications for sales officers</p>
                        </div>
                    </div>
                </section>

                <section className="products-section">
                    <h3>Product Portfolio</h3>
                    <div className="products-list">
                        <div className="product-category">
                            <h4>Industrial Fuels</h4>
                            <p>MS, HSD, LDO, FO, LSHS, SKO</p>
                        </div>
                        <div className="product-category">
                            <h4>Specialty Products</h4>
                            <p>Hexane, Solvent 1425, Mineral Turpentine Oil, Jute Batch Oil</p>
                        </div>
                        <div className="product-category">
                            <h4>Other Products</h4>
                            <p>Bitumen, Marine-Bunker Fuels, Sulphur, Propylene</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <p>© 2024 Hindustan Petroleum Corporation Limited. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact Support</a>
                </div>
            </footer>
        </div>
    );
}

export default Home;  