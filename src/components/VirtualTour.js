import React, { useState, useEffect } from 'react';

const VirtualTour = ({ artworks }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tourMode, setTourMode] = useState('guided');
  const [imgErr, setImgErr] = useState(false);

  const current = artworks[currentIndex];

  useEffect(() => {
    setImgErr(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!isPlaying || tourMode !== 'guided') return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % artworks.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying, tourMode, artworks.length, currentIndex]);

  if (!current) return <div className="virtual-tour" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No artworks available</div>;

  return (
    <div className="virtual-tour">
      <div className="tour-stage">
        <div className="tour-image-wrap">
          <div className="tour-frame" />
          {imgErr
            ? <div className="artwork-image-fallback" style={{ height: '65vh' }}>{current.title}</div>
            : <img src={current.image} alt={current.title} onError={() => setImgErr(true)} />
          }
        </div>
      </div>

      <div className="tour-info">
        <span className="artwork-category-tag">{current.category}</span>
        <h3>{current.title}</h3>
        <div className="artwork-artist">{current.artist} · {current.year}</div>
        <div className="gold-divider" style={{ margin: '1.25rem 0' }} />
        <p className="modal-description">{current.description}</p>
        <div className="cultural-info">
          <h4>Cultural & Historical Context</h4>
          <p>{current.culturalHistory}</p>
        </div>
        <div className="cultural-info" style={{ marginTop: '1rem' }}>
          <h4>Audio Guide</h4>
          <p>
            Welcome to this magnificent piece. <em>{current.title}</em> represents a significant moment in art history.
            Created in {current.year} by {current.artist}, this work showcases the {current.category} movement's
            distinctive characteristics. {current.culturalHistory}
          </p>
        </div>
      </div>

      <div className="tour-dots">
        {artworks.map((_, i) => (
          <button key={i} className={`tour-dot ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)} />
        ))}
      </div>

      <div className="tour-controls-bar">
        <div className="tour-mode-btns">
          <button className={`nav-btn ${tourMode === 'guided' ? 'active' : ''}`} onClick={() => setTourMode('guided')}>Guided</button>
          <button className={`nav-btn ${tourMode === 'self-paced' ? 'active' : ''}`} onClick={() => setTourMode('self-paced')}>Self-Paced</button>
        </div>

        <button className="btn-ghost" onClick={() => setCurrentIndex(prev => (prev - 1 + artworks.length) % artworks.length)}>
          ← Prev
        </button>

        <span className="tour-counter">{currentIndex + 1} / {artworks.length}</span>

        <button className="btn-ghost" onClick={() => setCurrentIndex(prev => (prev + 1) % artworks.length)}>
          Next →
        </button>

        {tourMode === 'guided' && (
          <button className="btn" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VirtualTour;
