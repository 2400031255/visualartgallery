import React, { useState } from 'react';

const FALLBACK = 'https://via.placeholder.com/600x800/1a1a1a/c9a84c?text=Artwork';
const ArtImage = ({ src, alt, className, style }) => {
  const [err, setErr] = useState(false);
  return err
    ? <div className="artwork-image-fallback" style={style}>{alt}</div>
    : <img src={src} alt={alt} className={className} style={style} onError={() => setErr(true)} />;
};

const Gallery = ({ artworks, currentUser, cart, setCart }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const addToCart = (artwork) => {
    if (cart.find(item => item.id === artwork.id)) return;
    setCart([...cart, artwork]);
  };

  const inCart = (id) => cart.some(item => item.id === id);

  return (
    <div>
      <div className="gallery-hero">
        <p>Curated Collection</p>
        <div className="gold-divider" />
        <h2>Masterworks of the Ages</h2>
        <div className="gold-divider" />
        {cart.length > 0 && (
          <p style={{ marginTop: '1rem', color: 'var(--gold)', fontSize: '0.82rem', letterSpacing: '0.1em' }}>
            {cart.length} work{cart.length > 1 ? 's' : ''} selected · ${cart.reduce((s, i) => s + i.price, 0).toLocaleString()}
          </p>
        )}
      </div>

      <div className="gallery-grid">
        {artworks.map(artwork => (
          <div key={artwork.id} className="artwork-card" onClick={() => setSelectedArtwork(artwork)}>
            <ArtImage src={artwork.image} alt={artwork.title} className="artwork-image" />

            <div className="artwork-overlay-always">
              <div className="artwork-title">{artwork.title}</div>
              <div className="artwork-artist">{artwork.artist} · {artwork.year}</div>
            </div>

            <div className="artwork-overlay">
              <span className="artwork-category-tag">{artwork.category}</span>
              <div className="artwork-title">{artwork.title}</div>
              <div className="artwork-artist">{artwork.artist} · {artwork.year}</div>
              <div className="artwork-price">${artwork.price.toLocaleString()}</div>
              <div className="overlay-actions" onClick={e => e.stopPropagation()}>
                <button className="btn" onClick={() => setSelectedArtwork(artwork)}>
                  View
                </button>
                <button
                  className={inCart(artwork.id) ? 'btn-ghost' : 'btn'}
                  onClick={() => addToCart(artwork)}
                  disabled={inCart(artwork.id)}
                >
                  {inCart(artwork.id) ? 'In Collection' : 'Acquire'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <div className="modal-backdrop" onClick={() => setSelectedArtwork(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <ArtImage src={selectedArtwork.image} alt={selectedArtwork.title} className="modal-image" style={{ height: '360px', objectFit: 'cover', width: '100%' }} />
            <div className="modal-body">
              <span className="artwork-category-tag">{selectedArtwork.category}</span>
              <h2>{selectedArtwork.title}</h2>
              <div className="artwork-artist">{selectedArtwork.artist}</div>
              <div className="modal-meta">
                <span><strong>Year</strong> {selectedArtwork.year}</span>
                <span><strong>Medium</strong> Oil on Canvas</span>
                <span><strong>Category</strong> {selectedArtwork.category}</span>
              </div>
              <div className="gold-divider" style={{ margin: '1rem 0' }} />
              <p className="modal-description">{selectedArtwork.description}</p>
              <div className="cultural-info">
                <h4>Cultural & Historical Context</h4>
                <p>{selectedArtwork.culturalHistory}</p>
              </div>
              <div className="modal-price">${selectedArtwork.price.toLocaleString()}</div>
              <div className="modal-actions">
                <button className="btn" onClick={() => { addToCart(selectedArtwork); setSelectedArtwork(null); }}
                  disabled={inCart(selectedArtwork.id)}>
                  {inCart(selectedArtwork.id) ? 'In Collection' : 'Acquire Artwork'}
                </button>
                <button className="btn-ghost" onClick={() => setSelectedArtwork(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
