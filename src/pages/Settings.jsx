import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, updateProfile, theme, setTheme, logout } = useStudy();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);

  // Notification preferences
  const [emailNotify, setEmailNotify] = useState(true);
  const [soundNotify, setSoundNotify] = useState(true);
  const [streakNotify, setStreakNotify] = useState(true);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(name.trim(), email.trim());
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
      <div className="pb-2 border-b border-edge">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
          <span className="material-symbols-outlined text-xs">settings</span>
          <span>Account Preferences</span>
        </div>
        <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Settings</h1>
        <p className="text-xs text-content-sub">Manage your profile, theme mode, and session preferences.</p>
      </div>

      {showNotifyMessage && (
        <div className="p-3 bg-success-soft border border-success/30 text-success rounded-xl text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Panel */}
        <div className="md:col-span-8 bg-card p-6 rounded-2xl border border-edge shadow-xs space-y-4 transition-colors">
          <h2 className="font-heading text-sm font-bold text-content">Profile Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-content-sub mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-content-sub mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content outline-none transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-purple hover:bg-purple-hover text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Preferences Sidebar */}
        <div className="md:col-span-4 space-y-5">
          {/* Theme switcher */}
          <div className="bg-card p-5 rounded-2xl border border-edge shadow-xs space-y-3 transition-colors">
            <h2 className="font-heading text-sm font-bold text-content">Appearance</h2>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-medium text-content">Dark Mode</span>
                <p className="text-[10px] text-content-dim">Optimized contrast for nighttime study</p>
              </div>
              <button 
                onClick={handleThemeChange}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-purple' : 'bg-edge'
                }`}
                aria-label="Toggle Dark Mode"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card p-5 rounded-2xl border border-edge shadow-xs space-y-3 transition-colors">
            <h2 className="font-heading text-sm font-bold text-content">Study Alerts</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-content-sub">Email digest</span>
                <input 
                  type="checkbox" 
                  checked={emailNotify} 
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-purple cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-content-sub">Pomodoro completion chime</span>
                <input 
                  type="checkbox" 
                  checked={soundNotify} 
                  onChange={(e) => setSoundNotify(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-purple cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-content-sub">Streak preservation reminders</span>
                <input 
                  type="checkbox" 
                  checked={streakNotify} 
                  onChange={(e) => setStreakNotify(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-purple cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-card p-5 rounded-2xl border border-edge shadow-xs transition-colors">
            <button 
              onClick={handleLogout}
              className="w-full bg-danger-soft hover:bg-danger text-danger hover:text-white font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
