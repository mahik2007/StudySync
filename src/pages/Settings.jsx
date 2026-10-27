import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, updateProfile, theme, setTheme, logout } = useStudy();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);

  // Notification settings
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
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-sm">tune</span>
          Preferences & Account
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
          Settings
        </h2>
        <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
          Manage your student profile, theme mode, and study notifications.
        </p>
      </div>

      {showNotifyMessage && (
        <div className="p-3 bg-tertiary-fixed/30 border border-tertiary/30 text-tertiary rounded-xl text-xs font-bold flex items-center gap-2 motion-page">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          Profile settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Details Panel */}
        <div className="md:col-span-8 bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Profile Information</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none text-[#1b1b24] dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none text-[#1b1b24] dark:text-white font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 rounded-xl shadow-md hover:scale-[0.99] transition-all w-fit"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Preferences Panel */}
        <div className="md:col-span-4 space-y-6">
          {/* Theme switcher */}
          <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Appearance</h3>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-[#3b3852] dark:text-white">Dark Theme</span>
                <p className="text-[10px] text-[#5e5b79] dark:text-[#a5a2bf]">Optimized for night study</p>
              </div>
              <button 
                onClick={handleThemeChange}
                className={`w-12 h-6 rounded-full p-1 transition-all ${
                  theme === 'dark' ? 'bg-primary' : 'bg-surface-container-high'
                }`}
                aria-label="Toggle Dark Mode"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : ''
                }`}></div>
              </button>
            </div>
          </div>

          {/* Notifications config */}
          <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Preferences</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#3b3852] dark:text-[#c4c1dc]">Email alerts</span>
                <input 
                  type="checkbox" 
                  checked={emailNotify} 
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#3b3852] dark:text-[#c4c1dc]">Pomodoro sound alerts</span>
                <input 
                  type="checkbox" 
                  checked={soundNotify} 
                  onChange={(e) => setSoundNotify(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#3b3852] dark:text-[#c4c1dc]">Daily streak reminders</span>
                <input 
                  type="checkbox" 
                  checked={streakNotify} 
                  onChange={(e) => setStreakNotify(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <button 
              onClick={handleLogout}
              className="w-full bg-error text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
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
