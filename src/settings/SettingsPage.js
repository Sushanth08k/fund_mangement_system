import React, { useState, useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import SystemSettings from './SystemSettings';
import DatabaseInitializer from './DatabaseInitializer';
import { getCurrentUserProfile } from '../services/userService';
import '../styles/settings.css';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  // Temporarily set isAdmin to true to allow database initialization
  const [isAdmin, setIsAdmin] = useState(true);
  
  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const profile = await getCurrentUserProfile();
        // Commented out for now to allow database initialization
        // setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
    
    checkAdminStatus();
  }, []);

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>Settings</h2>
      </div>
      
      <div className="settings-container">
        <div className="settings-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i> Profile Settings
          </button>
          <button 
            className={activeTab === 'system' ? 'active' : ''}
            onClick={() => setActiveTab('system')}
          >
            <i className="fas fa-cog"></i> System Settings
          </button>
          {isAdmin && (
            <button 
              className={activeTab === 'database' ? 'active' : ''}
              onClick={() => setActiveTab('database')}
            >
              <i className="fas fa-database"></i> Database
            </button>
          )}
        </div>
        
        <div className="settings-content">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'system' && <SystemSettings />}
          {activeTab === 'database' && isAdmin && <DatabaseInitializer />}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
