import React, { useState, useRef } from 'react';
import { useToast } from './Toast';

const ArtistDashboard = ({ artworks, setArtworks, currentUser }) => {
  const toast = useToast();
  const idCounter = useRef(Date.now());

  const artistName = currentUser?.name && currentUser.name !== 'Guest'
    ? currentUser.name
    : 'Vincent van Gogh'; // default to a real artist for demo purposes

  const [newArtwork, setNewArtwork] = useState({
    title: '', artist: artistName, year: new Date().getFullYear(),
    description: '', culturalHistory: '', price: '', category: ''
  });

  const [sales] = useState([
    { id: 1, artwork: 'Starry Night', buyer: 'Private Collector', amount: 50000000, date: '2024-01-15' },
    { id: 2, artwork: 'Mona Lisa', buyer: 'Museum of Fine Arts', amount: 100000000, date: '2024-01-10' }
  ]);

  const handleChange = e => setNewArtwork({ ...newArtwork, [e.target.name]: e.target.value });

  const addArtwork = (e) => {
    e.preventDefault();
    if (!newArtwork.title || !newArtwork.price) {
      toast('Please fill in all required fields', 'error');
      return;
    }
    idCounter.current += 1;
    setArtworks([...artworks, {
      ...newArtwork,
      id: idCounter.current,
      price: parseInt(newArtwork.price),
      image: 'https://via.placeholder.com/600x800/1a1a1a/c9a84c?text=New+Artwork'
    }]);
    toast(`"${newArtwork.title}" added to the gallery`, 'success');
    setNewArtwork({
      title: '', artist: artistName, year: new Date().getFullYear(),
      description: '', culturalHistory: '', price: '', category: ''
    });
  };

  const myArtworks = artworks.filter(art => art.artist === artistName);
  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Artist Studio</h2>
        <p>Manage your portfolio &amp; sales</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'My Artworks', value: myArtworks.length },
          { label: 'Total Sales', value: sales.length },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
          { label: 'Commission Rate', value: '85%' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Submit New Artwork</h3>
        <form onSubmit={addArtwork}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" name="title" value={newArtwork.title} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Year</label>
              <input type="number" name="year" value={newArtwork.year} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input type="number" name="price" value={newArtwork.price} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={newArtwork.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {['Renaissance', 'Impressionism', 'Post-Impressionism', 'Modern', 'Contemporary'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={newArtwork.description} onChange={handleChange} rows="3" />
          </div>
          <div className="form-group">
            <label>Cultural History</label>
            <textarea name="culturalHistory" value={newArtwork.culturalHistory} onChange={handleChange} rows="3" />
          </div>
          <button type="submit" className="btn">Submit Artwork</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h3>My Portfolio</h3>
        <div className="artwork-list">
          {myArtworks.length === 0
            ? <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', padding: '1rem 0' }}>No artworks submitted yet.</p>
            : myArtworks.map(artwork => (
              <div key={artwork.id} className="artwork-item">
                <div>
                  <strong>{artwork.title}</strong>
                  <p>{artwork.year} · ${artwork.price.toLocaleString()}</p>
                </div>
                <div className="artwork-item-actions">
                  <button className="btn-ghost btn">Edit</button>
                  <button className="btn-ghost btn">Stats</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Sales History</h3>
        <div className="artwork-list">
          {sales.map(sale => (
            <div key={sale.id} className="artwork-item">
              <div>
                <strong>{sale.artwork}</strong>
                <p>Acquired by {sale.buyer} · {sale.date}</p>
              </div>
              <span style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: '1rem' }}>
                ${sale.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
