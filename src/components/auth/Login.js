import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const { login, currentUser, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setErrorMessage('');
      setLoading(true);
      await login(email, password, loginType);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (loginType === 'admin' && error.message.includes('not an admin')) {
        setErrorMessage('Access denied. This login is for administrators only.');
      } else {
        setErrorMessage('Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Fund Management System</h2>
          <p>Login to access your dashboard</p>
        </div>
        
        <div className="login-type-selector">
          <button 
            className={`login-type-btn ${loginType === 'user' ? 'active' : ''}`}
            onClick={() => setLoginType('user')}
          >
            <i className="fas fa-user"></i> User Login
          </button>
          <button 
            className={`login-type-btn ${loginType === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginType('admin')}
          >
            <i className="fas fa-user-shield"></i> Admin Login
          </button>
        </div>
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : `Login as ${loginType === 'admin' ? 'Administrator' : 'User'}`}
          </button>
          
          <div className="auth-links">
            {loginType === 'user' && (
              <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            )}
            <p><Link to="/forgot-password">Forgot Password?</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
