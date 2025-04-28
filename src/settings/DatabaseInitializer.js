import React, { useState } from 'react';
import { initializeDatabase } from '../scripts/initializeDatabase';
import { setUserAsAdmin } from '../scripts/setAdmin';

function DatabaseInitializer() {
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInitialize = async () => {
    if (window.confirm('Are you sure you want to initialize the database? This will add initial data for sectors, states, and districts.')) {
      try {
        setInitializing(true);
        setMessage('');
        setError('');
        
        const success = await initializeDatabase();
        
        if (success) {
          setMessage('Database initialized successfully!');
        } else {
          setError('Database initialization failed. Check console for details.');
        }
      } catch (err) {
        console.error('Error in initialization:', err);
        setError('An error occurred during initialization: ' + err.message);
      } finally {
        setInitializing(false);
      }
    }
  };

  const handleSetAdmin = async () => {
    if (window.confirm('Are you sure you want to make your account an admin? This is required for database initialization.')) {
      try {
        setInitializing(true);
        setMessage('');
        setError('');
        
        await setUserAsAdmin();
        setMessage('Admin access granted successfully! You can now initialize the database.');
      } catch (err) {
        console.error('Error setting admin:', err);
        setError('Failed to set admin access: ' + err.message);
      } finally {
        setInitializing(false);
      }
    }
  };

  return (
    <div className="database-initializer">
      <h3>Database Management</h3>
      
      <div className="admin-section">
        <h4>Admin Access</h4>
        <p>You need admin access to initialize the database. Click the button below to grant admin access to your account.</p>
        <button 
          className="admin-button"
          onClick={handleSetAdmin}
          disabled={initializing}
        >
          {initializing ? 'Setting up...' : 'Grant Admin Access'}
        </button>
      </div>

      <div className="init-section">
        <h4>Database Initialization</h4>
        <p>
          This will set up the initial data for your fund management system, including sectors, 
          states, and districts. Only use this once when setting up the system for the first time.
        </p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <button 
          className="initialize-button"
          onClick={handleInitialize}
          disabled={initializing}
        >
          {initializing ? 'Initializing...' : 'Initialize Database'}
        </button>
      </div>
    </div>
  );
}

export default DatabaseInitializer;
