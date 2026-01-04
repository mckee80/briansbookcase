import React, { useState, useEffect } from 'react';
import { Book, ShoppingBag, Heart, Download, User, LogOut, CreditCard, Package, Menu, X, Check, Star } from 'lucide-react';

// Simulated backend - replace with actual API calls
const mockBackend = {
  users: [
    { id: 1, email: 'demo@example.com', password: 'demo123', name: 'Demo User', subscription: 'member', downloads: [1, 3] }
  ],
  ebooks: [
    { id: 1, title: 'The Art of Digital Minimalism', author: 'Sarah Chen', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', description: 'Discover the principles of living intentionally in a digital world', pages: 240, requiresMembership: true },
    { id: 2, title: 'Modern Typography Handbook', author: 'Marcus Webb', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', description: 'A comprehensive guide to contemporary type design', pages: 320, requiresMembership: true },
    { id: 3, title: 'Code & Consciousness', author: 'Alex Rivera', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop', description: 'Exploring the philosophy of software development', pages: 280, requiresMembership: true },
    { id: 4, title: 'Visual Storytelling', author: 'Nina Patel', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop', description: 'The power of narrative through design', pages: 195, requiresMembership: true },
    { id: 5, title: 'Finding Peace in Chaos', author: 'Dr. James Wilson', cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop', description: 'A guide to managing anxiety and finding inner calm', pages: 215, requiresMembership: true },
    { id: 6, title: 'Hope & Healing', author: 'Maria Santos', cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=600&fit=crop', description: 'Stories of resilience and mental health recovery', pages: 268, requiresMembership: true },
  ],
  products: [
    { id: 1, name: 'Minimalist Quote Tee', type: 'tshirt', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', sizes: ['S', 'M', 'L', 'XL'] },
    { id: 2, name: 'Reader Life Sticker Pack', type: 'sticker', price: 8.99, image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=400&fit=crop' },
    { id: 3, name: 'Typography Hoodie', type: 'tshirt', price: 49.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 4, name: 'Book Lover Sticker Set', type: 'sticker', price: 6.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
  ]
};

export default function EbookStore() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "BriansBookshelf - Read & Support Mental Health";
  }, []);

  // Auth handlers
  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockBackend.users.find(u => u.email === authForm.email && u.password === authForm.password);
    if (user) {
      setCurrentUser(user);
      setShowAuth(false);
      setAuthForm({ email: '', password: '', name: '' });
    } else {
      alert('Invalid credentials. Try demo@example.com / demo123');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const newUser = {
      id: mockBackend.users.length + 1,
      email: authForm.email,
      password: authForm.password,
      name: authForm.name,
      subscription: 'guest',
      downloads: []
    };
    mockBackend.users.push(newUser);
    setCurrentUser(newUser);
    setShowAuth(false);
    setAuthForm({ email: '', password: '', name: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('home');
  };

  const handleDownload = (ebookId) => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }
    if (currentUser.subscription === 'guest') {
      alert('Ebook downloads require membership. Join us to access our library and support suicide prevention!');
      setActiveView('subscription');
      return;
    }
    const ebook = mockBackend.ebooks.find(e => e.id === ebookId);
    alert(`Downloading "${ebook.title}"...`);
    if (!currentUser.downloads.includes(ebookId)) {
      currentUser.downloads.push(ebookId);
    }
  };

  const addToCart = (product, selectedSize = null) => {
    setCart([...cart, { ...product, selectedSize, cartId: Date.now() }]);
    setSelectedProduct(null);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Views
  const HomeView = () => (
    <div className="home-view">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">Read & Make a Difference</span>
            <span className="hero-title-sub">Brian's mission to save lives through reading</span>
          </h1>
          <p className="hero-description">
            Join our community of readers supporting suicide prevention. Access our full ebook library 
            while your monthly contribution goes directly to mental health charities. 
            Every book you read helps fund crisis intervention and mental health resources.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setActiveView('subscription')}>
              Become a Member
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveView('ebooks')}>
              Browse Library
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">{mockBackend.ebooks.length}</div>
            <div className="stat-label">Ebooks</div>
          </div>
          <div className="stat">
            <div className="stat-number">2.1K</div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat">
            <div className="stat-number">$124K</div>
            <div className="stat-label">Donated</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon"><Book /></div>
          <h3>Unlimited Ebooks</h3>
          <p>Members get full access to our curated library of digital books on various topics</p>
        </div>
        <div className="feature">
          <div className="feature-icon"><Heart /></div>
          <h3>Support Mental Health</h3>
          <p>100% of membership fees fund suicide prevention and mental health programs</p>
        </div>
        <div className="feature">
          <div className="feature-icon"><ShoppingBag /></div>
          <h3>Shop for Everyone</h3>
          <p>Browse and purchase our merchandise - no membership required</p>
        </div>
      </section>
    </div>
  );

  const EbooksView = () => (
    <div className="ebooks-view">
      <div className="view-header">
        <h2>Ebook Library</h2>
        <p>Download unlimited books with your membership - and support mental health</p>
      </div>
      <div className="ebook-grid">
        {mockBackend.ebooks.map(ebook => (
          <div key={ebook.id} className="ebook-card">
            <div className="ebook-cover">
              <img src={ebook.cover} alt={ebook.title} />
              {ebook.requiresMembership && <span className="badge-premium">Members Only</span>}
              {currentUser?.downloads.includes(ebook.id) && (
                <span className="badge-downloaded"><Check size={12} /> Downloaded</span>
              )}
            </div>
            <div className="ebook-info">
              <h3>{ebook.title}</h3>
              <p className="ebook-author">{ebook.author}</p>
              <p className="ebook-description">{ebook.description}</p>
              <div className="ebook-meta">
                <span>{ebook.pages} pages</span>
              </div>
              <button 
                className="btn btn-download"
                onClick={() => handleDownload(ebook.id)}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ShopView = () => (
    <div className="shop-view">
      <div className="view-header">
        <h2>Merchandise Shop</h2>
        <p>Open to everyone - no membership required</p>
      </div>
      <div className="product-grid">
        {mockBackend.products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-type">{product.type}</p>
              <p className="product-price">${product.price}</p>
              <button 
                className="btn btn-cart"
                onClick={() => setSelectedProduct(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SubscriptionView = () => (
    <div className="subscription-view">
      <div className="view-header">
        <h2>Support Mental Health</h2>
        <p>Your monthly contribution goes directly to suicide prevention charities</p>
        <div className="charity-info">
          <Heart size={20} style={{ color: 'var(--accent)' }} />
          <span>100% of membership fees support organizations like AFSP, Crisis Text Line, and The Trevor Project</span>
        </div>
      </div>
      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>Guest</h3>
          <div className="price">$0<span>/month</span></div>
          <ul className="features-list">
            <li><Check size={16} /> Browse ebook catalog</li>
            <li><Check size={16} /> Shop all merchandise</li>
            <li><Check size={16} /> Free shipping over $50</li>
          </ul>
          <button className="btn btn-secondary" disabled>
            No Commitment Required
          </button>
        </div>
        
        <div className="pricing-card featured">
          <div className="featured-badge">Support Mental Health</div>
          <h3>Member</h3>
          <div className="price">$9.99<span>/month</span></div>
          <ul className="features-list">
            <li><Check size={16} /> All guest features</li>
            <li><Check size={16} /> Download all ebooks</li>
            <li><Check size={16} /> Access entire library</li>
            <li><Check size={16} /> New releases monthly</li>
            <li><Check size={16} /> Member community forum</li>
            <li><Check size={16} /> Supporting suicide prevention</li>
          </ul>
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (!currentUser) {
                setShowAuth(true);
                return;
              }
              alert('Redirecting to secure payment... Your contribution will support suicide prevention charities.');
              // In production, integrate Stripe/PayPal here
            }}
          >
            {currentUser?.subscription === 'member' ? 'Current Plan' : 'Become a Member'}
          </button>
        </div>

        <div className="pricing-card">
          <h3>Champion</h3>
          <div className="price">$25<span>/month</span></div>
          <ul className="features-list">
            <li><Check size={16} /> All member features</li>
            <li><Check size={16} /> Champion badge & recognition</li>
            <li><Check size={16} /> Exclusive bonus content</li>
            <li><Check size={16} /> 20% merchandise discount</li>
            <li><Check size={16} /> Direct impact updates</li>
            <li><Check size={16} /> Making a bigger difference</li>
          </ul>
          <button className="btn btn-secondary" onClick={() => {
            if (!currentUser) {
              setShowAuth(true);
              return;
            }
            alert('Redirecting to secure payment... Thank you for your generous support!');
          }}>
            {currentUser?.subscription === 'champion' ? 'Current Plan' : 'Become a Champion'}
          </button>
        </div>
      </div>
      
      <div className="impact-section">
        <h3>Your Impact</h3>
        <div className="impact-stats">
          <div className="impact-stat">
            <div className="impact-number">$124K+</div>
            <div className="impact-label">Donated to Date</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number">2,100+</div>
            <div className="impact-label">Active Members</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number">5</div>
            <div className="impact-label">Partner Charities</div>
          </div>
        </div>
        <p className="impact-description">
          Every membership directly funds crisis intervention services, mental health resources, 
          and suicide prevention programs. Together, we're making a real difference in saving lives.
        </p>
      </div>
    </div>
  );

  const AccountView = () => (
    <div className="account-view">
      <div className="view-header">
        <h2>My Account</h2>
      </div>
      <div className="account-grid">
        <div className="account-section">
          <h3>Profile Information</h3>
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span>{currentUser?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span>{currentUser?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Subscription:</span>
            <span className="subscription-badge">{currentUser?.subscription}</span>
          </div>
          <button className="btn btn-secondary">Edit Profile</button>
        </div>

        <div className="account-section">
          <h3>My Downloads</h3>
          {currentUser?.downloads.length > 0 ? (
            <div className="downloads-list">
              {currentUser.downloads.map(ebookId => {
                const ebook = mockBackend.ebooks.find(e => e.id === ebookId);
                return (
                  <div key={ebookId} className="download-item">
                    <img src={ebook.cover} alt={ebook.title} />
                    <div>
                      <div className="download-title">{ebook.title}</div>
                      <div className="download-author">{ebook.author}</div>
                    </div>
                    <button className="btn-icon"><Download size={16} /></button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">No downloads yet. Start exploring our library!</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,700;1,300&family=Inter:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #1a1a1a;
          --primary-light: #2d2d2d;
          --accent: #ff6b6b;
          --accent-hover: #ff5252;
          --bg: #fafafa;
          --surface: #ffffff;
          --text: #1a1a1a;
          --text-light: #666666;
          --border: #e0e0e0;
          --success: #4caf50;
          --shadow: rgba(0, 0, 0, 0.1);
        }

        body {
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
        }

        /* Navigation */
        .navbar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1.2rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          cursor: pointer;
          color: var(--text);
          font-weight: 500;
          transition: color 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent);
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .cart-button {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text);
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .cart-button:hover {
          background: var(--bg);
        }

        .cart-count {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .user-menu:hover {
          background: var(--bg);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          min-height: calc(100vh - 200px);
        }

        /* Home View */
        .hero {
          text-align: center;
          padding: 4rem 0 6rem;
          position: relative;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .hero-title {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .hero-title-main {
          font-family: 'Fraunces', serif;
          font-size: 4.5rem;
          font-weight: 700;
          line-height: 1.1;
          color: var(--primary);
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-title-sub {
          font-family: 'Fraunces', serif;
          font-size: 3rem;
          font-weight: 300;
          font-style: italic;
          color: var(--text-light);
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .hero-description {
          font-size: 1.25rem;
          color: var(--text-light);
          margin: 2rem auto;
          max-width: 600px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-family: 'Fraunces', serif;
          font-size: 3rem;
          font-weight: 700;
          color: var(--accent);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-top: 6rem;
        }

        .feature {
          text-align: center;
          padding: 2rem;
          animation: fadeInUp 0.8s ease-out both;
        }

        .feature:nth-child(1) { animation-delay: 0.5s; }
        .feature:nth-child(2) { animation-delay: 0.6s; }
        .feature:nth-child(3) { animation-delay: 0.7s; }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: var(--accent);
          color: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          transform: rotate(-5deg);
          transition: transform 0.3s;
        }

        .feature:hover .feature-icon {
          transform: rotate(0deg) scale(1.1);
        }

        .feature h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        /* View Header */
        .view-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .view-header h2 {
          font-family: 'Fraunces', serif;
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .view-header p {
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .charity-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 107, 107, 0.1);
          padding: 1rem 2rem;
          border-radius: 12px;
          margin-top: 1rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 500;
        }

        .impact-section {
          background: var(--surface);
          border-radius: 16px;
          padding: 3rem;
          margin-top: 4rem;
          box-shadow: 0 4px 20px var(--shadow);
        }

        .impact-section h3 {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .impact-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .impact-stat {
          text-align: center;
          padding: 1.5rem;
          background: var(--bg);
          border-radius: 12px;
        }

        .impact-number {
          font-family: 'Fraunces', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .impact-label {
          color: var(--text-light);
          font-size: 0.95rem;
        }

        .impact-description {
          text-align: center;
          color: var(--text-light);
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Ebook Grid */
        .ebook-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .ebook-card {
          background: var(--surface);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px var(--shadow);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .ebook-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px var(--shadow);
        }

        .ebook-cover {
          position: relative;
          height: 350px;
          overflow: hidden;
        }

        .ebook-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge-premium, .badge-downloaded {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--accent);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-downloaded {
          background: var(--success);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .ebook-info {
          padding: 1.5rem;
        }

        .ebook-info h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          margin-bottom: 0.3rem;
        }

        .ebook-author {
          color: var(--text-light);
          font-size: 0.9rem;
          margin-bottom: 0.8rem;
        }

        .ebook-description {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .ebook-meta {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        /* Product Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .product-card {
          background: var(--surface);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px var(--shadow);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px var(--shadow);
        }

        .product-image {
          height: 300px;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-info h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }

        .product-type {
          color: var(--text-light);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        /* Pricing Cards */
        .pricing-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pricing-card {
          background: var(--surface);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px var(--shadow);
          position: relative;
          transition: transform 0.3s;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
        }

        .pricing-card.featured {
          border: 2px solid var(--accent);
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent);
          color: white;
          padding: 0.3rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .pricing-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .price {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .price span {
          font-size: 1.2rem;
          color: var(--text-light);
          font-weight: 400;
        }

        .features-list {
          list-style: none;
          margin-bottom: 2rem;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
          color: var(--text-light);
        }

        .features-list svg {
          color: var(--success);
          flex-shrink: 0;
        }

        /* Account View */
        .account-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .account-section {
          background: var(--surface);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px var(--shadow);
        }

        .account-section h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.8rem 0;
          border-bottom: 1px solid var(--border);
        }

        .info-label {
          font-weight: 600;
        }

        .subscription-badge {
          background: var(--accent);
          color: white;
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .downloads-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .download-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg);
          border-radius: 8px;
        }

        .download-item img {
          width: 50px;
          height: 70px;
          object-fit: cover;
          border-radius: 4px;
        }

        .download-title {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .download-author {
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .empty-state {
          text-align: center;
          color: var(--text-light);
          padding: 2rem;
        }

        /* Buttons */
        .btn {
          padding: 0.8rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .btn-primary {
          background: var(--accent);
          color: white;
        }

        .btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: var(--primary);
          color: white;
        }

        .btn-secondary:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
        }

        .btn-download, .btn-cart {
          width: 100%;
          background: var(--primary);
          color: white;
        }

        .btn-download:hover, .btn-cart:hover {
          background: var(--primary-light);
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--text);
          transition: color 0.2s;
        }

        .btn-icon:hover {
          color: var(--accent);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Auth Modal */
        .auth-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }

        .auth-modal {
          background: var(--surface);
          border-radius: 16px;
          padding: 3rem;
          max-width: 450px;
          width: 90%;
          animation: slideUp 0.3s;
        }

        .auth-modal h2 {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .auth-modal p {
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .form-group input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--text-light);
        }

        .auth-switch button {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          font-weight: 600;
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--text-light);
        }

        /* Product Modal */
        .product-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }

        .product-modal-content {
          background: var(--surface);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          animation: slideUp 0.3s;
        }

        .size-selector {
          margin: 1.5rem 0;
        }

        .size-selector h4 {
          margin-bottom: 1rem;
        }

        .size-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .size-option {
          padding: 0.5rem 1rem;
          border: 2px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
        }

        .size-option:hover {
          border-color: var(--accent);
        }

        .size-option.selected {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        /* Cart Sidebar */
        .cart-sidebar {
          position: fixed;
          right: 0;
          top: 0;
          height: 100vh;
          width: 400px;
          background: var(--surface);
          box-shadow: -4px 0 20px var(--shadow);
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.3s;
          display: flex;
          flex-direction: column;
        }

        .cart-sidebar.open {
          transform: translateX(0);
        }

        .cart-header {
          padding: 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-header h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .cart-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .cart-item-size {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 0.3rem;
        }

        .cart-item-price {
          font-weight: 600;
          color: var(--accent);
        }

        .cart-footer {
          padding: 2rem;
          border-top: 1px solid var(--border);
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .hero-title-main {
            font-size: 2.5rem;
          }

          .hero-title-sub {
            font-size: 1.8rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 2rem;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .account-grid {
            grid-template-columns: 1fr;
          }

          .cart-sidebar {
            width: 100%;
          }

          .pricing-cards {
            grid-template-columns: 1fr;
          }

          .pricing-card.featured {
            transform: scale(1);
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => setActiveView('home')}>
            <Book size={28} />
            BriansBookshelf
          </div>
          
          <div className="nav-links">
            <div 
              className={`nav-link ${activeView === 'ebooks' ? 'active' : ''}`}
              onClick={() => setActiveView('ebooks')}
            >
              Library
            </div>
            <div 
              className={`nav-link ${activeView === 'shop' ? 'active' : ''}`}
              onClick={() => setActiveView('shop')}
            >
              Shop
            </div>
            <div 
              className={`nav-link ${activeView === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveView('subscription')}
            >
              Membership
            </div>
          </div>

          <div className="nav-actions">
            <button className="cart-button" onClick={() => setActiveView('cart')}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
            
            {currentUser ? (
              <div className="user-menu" onClick={() => setActiveView('account')}>
                <User size={20} />
                <span>{currentUser.name}</span>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
                Sign In
              </button>
            )}

            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'home' && <HomeView />}
        {activeView === 'ebooks' && <EbooksView />}
        {activeView === 'shop' && <ShopView />}
        {activeView === 'subscription' && <SubscriptionView />}
        {activeView === 'account' && currentUser && <AccountView />}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="auth-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{authMode === 'login' ? 'Sign in to access your library' : 'Join our community of readers'}</p>
            
            <form onSubmit={authMode === 'login' ? handleLogin : handleSignup}>
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    required={authMode === 'signup'}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  required
                  placeholder="demo@example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  required
                  placeholder={authMode === 'login' ? 'demo123' : ''}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Size Modal */}
      {selectedProduct && (
        <div className="product-modal" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProduct.name}</h3>
            <p className="product-price">${selectedProduct.price}</p>
            
            {selectedProduct.sizes && (
              <div className="size-selector">
                <h4>Select Size</h4>
                <div className="size-options">
                  {selectedProduct.sizes.map(size => (
                    <div 
                      key={size}
                      className="size-option"
                      onClick={() => {
                        addToCart(selectedProduct, size);
                      }}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedProduct.sizes && (
              <button 
                className="btn btn-primary" 
                style={{width: '100%'}}
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Cart
              </button>
            )}

            <button 
              className="btn btn-secondary" 
              style={{width: '100%', marginTop: '1rem'}}
              onClick={() => setSelectedProduct(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${activeView === 'cart' ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button className="btn-icon" onClick={() => setActiveView('home')}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-state">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  {item.selectedSize && (
                    <div className="cart-item-size">Size: {item.selectedSize}</div>
                  )}
                  <div className="cart-item-price">${item.price}</div>
                </div>
                <button className="btn-icon" onClick={() => removeFromCart(item.cartId)}>
                  <X size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{width: '100%'}}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
