import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={handleBack} className="back-button" aria-label="Go back">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="large-title">Fund Management System</h1>
      </div>
      <div className="navbar-right">
        {currentUser && (
          <>
            <div className="user-info">
              <button 
                onClick={toggleTheme} 
                className="theme-toggle-button"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <span>{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
