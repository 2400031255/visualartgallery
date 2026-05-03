import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { useToast } from './Toast';

const AdminPanel = ({ artworks, setArtworks }) => {
  const toast = useToast();
  const [users] = useState([
    { id: 1, name: 'John Artist', role: 'artist', status: 'active' },
    { id: 2, name: 'Jane Curator', role: 'curator', status: 'active' },
    { id: 3, name: 'Bob Visitor', role: 'visitor', status: 'active' }
  ]);

  const [settings, setSettings] = useState({
    galleryName: 'Galerie Lumière',
    commissionRate: 15,
    allowPurchases: true,
    maintenanceMode: false
  });

  const [confirmDelete, setConfirmDelete] = useState(null); // artwork id to delete

  const handleDelete = (id) => setConfirmDelete(id);

  const confirmDeleteArtwork = () => {
    setArtworks(artworks.filter(art => art.id !== confirmDelete));
    toast('Artwork removed from collection', 'success');
    setConfirmDelete(null);
  };

  const saveSettings = () => toast('Settings saved successfully', 'success');

  const stats = {
    totalArtworks: artworks.length,
    totalUsers: users.length,
    totalRevenue: artworks.reduce((sum, art) => sum + art.price, 0),
    activeUsers: users.filter(u => u.status === 'active').length
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Administration</h2>
        <p>Gallery Management Console</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Artworks', value: stats.totalArtworks },
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Collection Value', value: `$${stats.totalRevenue.toLocaleString()}` },
          { label: 'Active Users', value: stats.activeUsers }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Gallery Settings</h3>
        <div className="form-group">
          <label>Gallery Name</label>
          <input type="text" value={settings.galleryName} onChange={e => setSettings({ ...settings, galleryName: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Commission Rate (%)</label>
          <input type="number" value={settings.commissionRate} onChange={e => setSettings({ ...settings, commissionRate: parseInt(e.target.value) })} />
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.allowPurchases} onChange={e => setSettings({ ...settings, allowPurchases: e.target.checked })} />
            &nbsp; Allow Acquisitions
          </label>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
            &nbsp; Maintenance Mode
          </label>
        </div>
        <button className="btn" onClick={saveSettings}>Save Settings</button>
      </div>

      <div className="dashboard-section">
        <h3>User Management</h3>
        <div className="artwork-list">
          {users.map(user => (
            <div key={user.id} className="artwork-item">
              <div>
                <strong>{user.name}</strong>
                <p>{user.role} · <span className={`status ${user.status}`}>{user.status}</span></p>
              </div>
              <div className="artwork-item-actions">
                <button className="btn-ghost btn">Edit</button>
                <button className="btn btn-danger">Suspend</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Artwork Management</h3>
        <div className="artwork-list">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-item">
              <div>
                <strong>{artwork.title}</strong>
                <p>{artwork.artist} · ${artwork.price.toLocaleString()}</p>
              </div>
              <div className="artwork-item-actions">
                <button className="btn-ghost btn">Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(artwork.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          message="Remove this artwork from the collection? This cannot be undone."
          onConfirm={confirmDeleteArtwork}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
