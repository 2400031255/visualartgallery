import React, { useState } from 'react';
import './App.css';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './auth/useAuth';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Gallery from './components/Gallery';
import AdminPanel from './components/AdminPanel';
import ArtistDashboard from './components/ArtistDashboard';
import CuratorPanel from './components/CuratorPanel';
import VirtualTour from './components/VirtualTour';
import { artworksData } from './data/artworks';

function AppShell() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('gallery');
  const [artworks, setArtworks]       = useState(artworksData);
  const [cart, setCart]               = useState([]);

  const handleLogin = (user) => {
    const defaultView = user.role === 'admin' ? 'admin'
      : user.role === 'artist'  ? 'artist'
      : user.role === 'curator' ? 'curator'
      : 'gallery';
    setCurrentView(defaultView);
  };

  const switchRole = (role) => {
    setCurrentView(
      role === 'admin' ? 'admin' : role === 'artist' ? 'artist' : role === 'curator' ? 'curator' : 'gallery'
    );
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'admin':   return <AdminPanel artworks={artworks} setArtworks={setArtworks} />;
      case 'artist':  return <ArtistDashboard artworks={artworks} setArtworks={setArtworks} currentUser={currentUser} />;
      case 'curator': return <CuratorPanel artworks={artworks} setArtworks={setArtworks} />;
      case 'tour':    return <VirtualTour artworks={artworks} />;
      default:        return <Gallery artworks={artworks} currentUser={currentUser} cart={cart} setCart={setCart} />;
    }
  };

  return (
    <div className="App">
      <Header
        currentUser={currentUser}
        switchRole={switchRole}
        setCurrentView={setCurrentView}
        currentView={currentView}
        cart={cart}
        setCart={setCart}
      />
      {renderContent()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
