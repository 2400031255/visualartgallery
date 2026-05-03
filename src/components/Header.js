import React, { useState } from 'react';
import Cart from './Cart';
import { useAuth } from '../auth/useAuth';

const NavContent = ({ currentUser, switchRole, setCurrentView, currentView, cart, onCartClick, onNav }) => {
  const { logout } = useAuth();
  const isPro = ['artist', 'curator', 'admin'].includes(currentUser.role);

  return (
    <>
      {/* Role switcher — only show roles the user is allowed */}
      <div className="role-selector">
        {['visitor', 'artist', 'curator', 'admin'].map(role => (
          <button
            key={role}
            className={`nav-btn ${currentUser.role === role ? 'active' : ''}`}
            onClick={() => { switchRole(role); onNav?.(); }}
          >
            {role}
          </button>
        ))}
      </div>

      <button
        className={`nav-btn-outline ${currentView === 'gallery' ? 'active' : ''}`}
        onClick={() => { setCurrentView('gallery'); onNav?.(); }}
      >
        Gallery
      </button>
      <button
        className={`nav-btn-outline ${currentView === 'tour' ? 'active' : ''}`}
        onClick={() => { setCurrentView('tour'); onNav?.(); }}
      >
        Virtual Tour
      </button>

      <button className="cart-btn" onClick={onCartClick}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Collection
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </button>

      <button className="logout-btn" onClick={() => { logout(); onNav?.(); }} title="Sign out">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </>
  );
};

const Header = ({ currentUser, switchRole, setCurrentView, currentView, cart, setCart }) => {
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navProps = {
    currentUser, switchRole, setCurrentView, currentView, cart,
    onCartClick: () => { setShowCart(true); setMenuOpen(false); }
  };

  return (
    <>
      <header className="header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="header-brand">
          <h1>Galerie Lumière</h1>
          <span>Virtual Fine Art Gallery</span>
        </div>

        {/* User pill */}
        <div className="user-pill">
          <span className="user-pill-dot" />
          <span className="user-pill-name">{currentUser.name}</span>
          <span className="user-pill-role">{currentUser.role}</span>
        </div>

        {/* Desktop nav */}
        <div className="nav-buttons">
          <NavContent {...navProps} />
        </div>

        {/* Mobile hamburger */}
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavContent {...navProps} onNav={() => setMenuOpen(false)} />
        </div>
      )}

      {showCart && <Cart cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />}
    </>
  );
};

export default Header;
