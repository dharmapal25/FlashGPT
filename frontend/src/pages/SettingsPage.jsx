import { useState } from 'react';
import { ArrowLeft, Sun, Moon, LogOut } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, authLoading, theme, toggleTheme, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (authLoading) return (
    <div className="appShell">
      <div className="loadingScreen">
        <div className="loadingSpinner" /><span>Loading…</span>
      </div>
    </div>
  );

  // user nahi hai → login pe bhejo
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="appShell" data-theme={theme}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentChatId={null}
        onDeleteClick={() => {}}
      />

      <main className="main">
        <div className="settingsPage">
          <div className="settingsHeader">
            <button className="backBtn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back
            </button>
            <h2>Settings</h2>
          </div>

          <div className="settingsBody">
            <section className="settingsSection">
              <h3>Appearance</h3>
              <div className="settingsRow">
                <span>Theme</span>
                <button className="themeToggle" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </section>

            <section className="settingsSection">
              <h3>Account</h3>
              <div className="settingsRow">
                <span>Sign out of your account</span>
                <button className="settingsLogoutBtn" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;