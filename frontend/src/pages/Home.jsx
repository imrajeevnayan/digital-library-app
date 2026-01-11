import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

function Home() {
    const { user } = useAuth()

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <h1>LibStack</h1>
                    </div>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Your Gateway to <br /> <span className="highlight">Digital Knowledge</span></h1>
                    <p>
                        Access thousands of books, articles, and resources from anywhere in the world.
                        Manage your loans, discover new reads, and expand your horizons with LibStack.
                    </p>
                    <div className="hero-actions">
                        <Link to="/books" className="btn btn-lg btn-primary">Browse Collection</Link>
                        {!user && <Link to="/login" className="btn btn-lg btn-outline">Member Login</Link>}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-cards">
                        <div className="float-card card-1">
                            <div className="card-icon book">📚</div>
                            <h3>Huge Library</h3>
                            <p>Over 10,000+ Titles</p>
                        </div>
                        <div className="float-card card-2">
                            <div className="card-icon time">⚡</div>
                            <h3>Instant Access</h3>
                            <p>Read Anywhere</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Why Choose LibStack?</h2>
                    <p>Experience the future of library management and digital reading.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Smart Search</h3>
                        <p>Find exactly what you're looking for with our advanced filtering and search capabilities.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Cross-Platform</h3>
                        <p>Seamlessly switch between your desktop, tablet, and mobile devices without losing your place.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Loans</h3>
                        <p>Borrow digital copies instantly with automated returns. No more late fees.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Start Reading?</h2>
                    <p>Join thousands of readers who trust LibStack for their digital library needs.</p>
                    <Link to={user ? "/dashboard" : "/login"} className="btn btn-lg btn-light">
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>LibStack</h3>
                        <p>Empowering the world with knowledge.</p>
                    </div>
                    <div className="footer-links">
                        <div className="col">
                            <h4>Platform</h4>
                            <a href="#">Books</a>
                            <a href="#">Categories</a>
                            <a href="#">New Arrivals</a>
                        </div>
                        <div className="col">
                            <h4>Support</h4>
                            <a href="#">Help Center</a>
                            <a href="#">Contact Us</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 LibStack Digital Library. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}


export default Home
