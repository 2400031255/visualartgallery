import React, { useState } from 'react';
import InsightModal from './InsightModal';
import { useToast } from './Toast';

const CuratorPanel = ({ artworks }) => {
  const toast = useToast();
  const [exhibitions, setExhibitions] = useState([
    {
      id: 1, title: 'Masters of Renaissance',
      description: 'A collection of Renaissance masterpieces',
      startDate: '2024-02-01', endDate: '2024-04-30',
      artworks: [2], status: 'active'
    }
  ]);

  const [newExhibition, setNewExhibition] = useState({
    title: '', description: '', startDate: '', endDate: '', selectedArtworks: []
  });

  const [insights, setInsights] = useState({});
  const [insightTarget, setInsightTarget] = useState(null); // artwork object

  const handleChange = e => setNewExhibition({ ...newExhibition, [e.target.name]: e.target.value });

  const toggleArtwork = (id) => {
    const sel = newExhibition.selectedArtworks;
    setNewExhibition({
      ...newExhibition,
      selectedArtworks: sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]
    });
  };

  const createExhibition = (e) => {
    e.preventDefault();
    if (!newExhibition.title || !newExhibition.startDate) {
      toast('Please fill in required fields', 'error');
      return;
    }
    setExhibitions([...exhibitions, {
      ...newExhibition, id: Date.now(),
      artworks: newExhibition.selectedArtworks, status: 'active'
    }]);
    toast(`Exhibition "${newExhibition.title}" created`, 'success');
    setNewExhibition({ title: '', description: '', startDate: '', endDate: '', selectedArtworks: [] });
  };

  const saveInsight = (value) => {
    setInsights({ ...insights, [insightTarget.id]: value });
    toast('Curatorial insight saved', 'success');
    setInsightTarget(null);
  };

  const getArtworksByIds = (ids) => artworks.filter(art => ids.includes(art.id));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Curator's Studio</h2>
        <p>Exhibition &amp; Collection Management</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Exhibitions', value: exhibitions.length },
          { label: 'Active Exhibitions', value: exhibitions.filter(e => e.status === 'active').length },
          { label: 'Artwork Insights', value: Object.keys(insights).length },
          { label: 'Works to Curate', value: artworks.length }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Create Exhibition</h3>
        <form onSubmit={createExhibition}>
          <div className="form-group">
            <label>Exhibition Title *</label>
            <input type="text" name="title" value={newExhibition.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={newExhibition.description} onChange={handleChange} rows="3" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" name="startDate" value={newExhibition.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={newExhibition.endDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Select Artworks</label>
            <div className="artwork-select-list">
              {artworks.map(artwork => (
                <label key={artwork.id} className="artwork-select-item">
                  <input type="checkbox" checked={newExhibition.selectedArtworks.includes(artwork.id)} onChange={() => toggleArtwork(artwork.id)} />
                  {artwork.title} — {artwork.artist}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn">Create Exhibition</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h3>Current Exhibitions</h3>
        <div className="artwork-list">
          {exhibitions.map(ex => (
            <div key={ex.id} className="artwork-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <strong>{ex.title}</strong>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`status ${ex.status}`}>{ex.status}</span>
                  <button className="btn-ghost btn">Edit</button>
                </div>
              </div>
              <p>{ex.description}</p>
              <p style={{ color: 'var(--gold)', fontSize: '0.78rem' }}>
                {getArtworksByIds(ex.artworks).map(a => a.title).join(' · ')}
              </p>
              <p>{ex.startDate} → {ex.endDate || 'Ongoing'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Curatorial Insights</h3>
        <div className="artwork-list">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-item">
              <div>
                <strong>{artwork.title}</strong>
                <p>{artwork.artist}</p>
                {insights[artwork.id] && (
                  <p style={{ fontStyle: 'italic', color: 'var(--gold)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                    "{insights[artwork.id]}"
                  </p>
                )}
              </div>
              <button className="btn-ghost btn" onClick={() => setInsightTarget(artwork)}>
                {insights[artwork.id] ? 'Edit Insight' : 'Add Insight'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {insightTarget && (
        <InsightModal
          artwork={insightTarget}
          existing={insights[insightTarget.id]}
          onSave={saveInsight}
          onCancel={() => setInsightTarget(null)}
        />
      )}
    </div>
  );
};

export default CuratorPanel;
