import React, { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateUserProfile } from '../services/userService';
import { isValidEmail } from '../utils/validators';

function ProfileSettings() {
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const userData = await getCurrentUserProfile();
        
        if (userData) {
          setProfile({
            displayName: userData.displayName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            role: userData.role || 'user'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user types
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!profile.displayName) {
      setError('Display name is required');
      return;
    }
    
    if (!isValidEmail(profile.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Only update fields that can be changed
      await updateUserProfile({
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber
      });
      
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
    <div className="profile-settings">
      <h3>Profile Settings</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            disabled
          />
          <small>Email cannot be changed</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={profile.role}
            disabled
          />
          <small>Role cannot be changed</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
