import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, updateProfile, theme, setTheme, logout } = useStudy();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);

  // Mock Notification settings
  const [emailNotify, setEmailNotify] = useState(true);
  const [soundNotify, setSoundNotify] = useState(true);
  const [streakNotify, setStreakNotify] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(name, email);
    setShowNotifyMessage(true);
    setTimeout(() => setShowNotifyMessage(false), 2000);
  };

  const handleThemeChange = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Settings</h2>
        <p className="text-sm text-on-surface-variant">Manage your profile, theme mode, and preferences.</p>
      </div>

      {showNotifyMessage && (
        <div className="p-3 bg-tertiary/10 border border-tertiary/20 text-tertiary rounded-xl text-xs font-semibold">
          Settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Details Panel */}
        <div className="md:col-span-8 bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-background">Profile Information</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none text-on-background"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none text-on-background"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 rounded-xl shadow-sm hover:scale-95 transition-all w-fit"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Preferences Panel */}
        <div className="md:col-span-4 space-y-6">
          {/* Theme switcher */}
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-background">Appearance</h3>
            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">Dark Mode</span>
              <button 
                onClick={handleThemeChange}
                className={`w-12 h-6 rounded-full p-1 transition-all ${
                  theme === 'dark' ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : ''
                }`}></div>
              </button>
            </div>
          </div>

          {/* Notifications config */}
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-background">Notifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Email alerts</span>
                <input 
                  type="checkbox" 
                  checked={emailNotify} 
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Pomodoro sound alerts</span>
                <input 
                  type="checkbox" 
                  checked={soundNotify} 
                  onChange={(e) => setSoundNotify(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Daily streak reminders</span>
                <input 
                  type="checkbox" 
                  checked={streakNotify} 
                  onChange={(e) => setStreakNotify(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <button 
              onClick={handleLogout}
              className="w-full bg-error text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
