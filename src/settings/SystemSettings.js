import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function SystemSettings() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="system-settings">
      <h3>System Settings</h3>
      
      <div className="settings-section">
        <h4>Appearance</h4>
        
        <div className="setting-item">
          <div className="setting-label">
            <span>Dark Mode</span>
            <p className="setting-description">
              Switch between light and dark theme
            </p>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={toggleTheme} 
                aria-label="Toggle dark mode"
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Notifications</h4>
        
        <div className="setting-item">
          <div className="setting-label">
            <span>Email Notifications</span>
            <p className="setting-description">
              Receive email notifications for important events
            </p>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Data & Privacy</h4>
        
        <div className="setting-item">
          <div className="setting-label">
            <span>Data Export</span>
            <p className="setting-description">
              Export all your transaction data as CSV
            </p>
          </div>
          <div className="setting-control">
            <button className="export-button">
              <i className="fas fa-download"></i> Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
