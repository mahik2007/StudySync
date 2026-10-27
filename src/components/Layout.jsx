import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

export const Layout = ({ children }) => {
  const { user, logout, addTask, theme, setTheme } = useStudy();
  const navigate = useNavigate();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskSubject, setTaskSubject] = useState('General');
  const [taskDeadline, setTaskDeadline] = useState('');

  const handleQuickAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const deadline = taskDeadline || new Date().toISOString().split('T')[0];
    addTask(taskTitle, taskPriority, taskSubject, deadline);
    setTaskTitle('');
    setTaskDeadline('');
    setQuickAddOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Smart Plan', path: '/smart-plan', icon: 'auto_awesome' },
    { name: 'Habit Tracker', path: '/habits', icon: 'calendar_today' },
    { name: 'Task Manager', path: '/tasks', icon: 'format_list_bulleted' },
    { name: 'Pomodoro', path: '/pomodoro', icon: 'timer' },
    { name: 'Analytics', path: '/analytics', icon: 'insights' },
    { name: 'Goal Planner', path: '/goals', icon: 'target' },
    { name: 'Calendar', path: '/calendar', icon: 'event' },
    { name: 'Achievements', path: '/achievements', icon: 'military_tech' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  if (!user) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation Shell */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 py-6 bg-surface-container dark:bg-inverse-surface border-r border-outline-variant/30 w-72 z-50">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/25">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div>
              <h1 className="font-display-lg text-2xl font-extrabold text-primary tracking-tight">StudySync</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#5e5b79] dark:text-[#a5a2bf]">Smart Academic Hub</p>
            </div>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="mx-4 mb-5 p-3 rounded-2xl bg-white/80 dark:bg-surface-container-high/60 border border-outline-variant/25 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full border-2 border-primary/25 bg-primary-fixed flex items-center justify-center font-bold text-primary text-sm shadow-inner shrink-0">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-[#1b1b24] dark:text-white truncate">{user.name}</p>
            <p className="text-xs font-medium text-[#5e5b79] dark:text-[#b4b1ca]">Level {user.level} Scholar • <span className="text-primary dark:text-primary-fixed font-bold">{user.xp} XP</span></p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-xl mx-2 flex items-center gap-3 px-3.5 py-2.5 transition-all duration-200 text-sm font-semibold ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25 translate-x-1'
                    : 'text-[#3c3954] dark:text-[#d3d0e8] hover:text-primary dark:hover:text-white hover:bg-surface-container-high/70'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Start Focus Session Button & Logout */}
        <div className="px-4 pt-3 mt-auto border-t border-outline-variant/20">
          <button
            onClick={() => navigate('/pomodoro')}
            className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">bolt</span>
            Start Focus Session
          </button>
          
          <button
            onClick={logout}
            className="w-full text-[#524f6d] dark:text-[#c4c1dc] hover:text-error hover:bg-error/10 flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left font-semibold text-xs"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 min-h-screen pb-20 md:pb-6 flex flex-col">
        {/* Header */}
        <header className="h-20 px-6 md:px-8 flex justify-between items-center bg-white/80 dark:bg-inverse-surface/80 backdrop-blur-xl sticky top-0 z-40 border-b border-outline-variant/30">
          <div>
            <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-semibold">
              Welcome, {user.name}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickAddOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              title="Quick Add Task"
            >
              <span className="material-symbols-outlined text-base">add_task</span>
              <span>New Task</span>
            </button>
            <button
              onClick={() => {
                const next = theme === 'dark' ? 'light' : 'dark';
                setTheme(next);
              }}
              className="p-2 text-[#3b3852] dark:text-[#f4f2fc] hover:bg-surface-container-low rounded-full cursor-pointer transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme mode"
            >
              <span className="material-symbols-outlined text-xl">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <div className="relative">
              <span className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full cursor-pointer transition-colors">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-ping"></span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </div>
            <button
              onClick={() => navigate('/pomodoro')}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase hover:scale-95 transition-transform shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              Study Now
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7-xl mx-auto w-full motion-page">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-surface-container/95 backdrop-blur-md flex justify-around items-center px-4 z-50 border-t border-outline-variant/30 shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary font-bold' : 'text-[#4b4863] dark:text-[#c4c1dc]'}`
          }
        >
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="text-[10px] font-semibold">Home</span>
        </NavLink>
        
        <NavLink
          to="/smart-plan"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary font-bold' : 'text-[#4b4863] dark:text-[#c4c1dc]'}`
          }
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
          <span className="text-[10px] font-semibold">Plan</span>
        </NavLink>
        
        {/* Quick Add Action Button */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center -translate-y-4 shadow-lg shadow-primary/30 active:scale-90 transition-transform"
          aria-label="Quick Add Task"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        <NavLink
          to="/pomodoro"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary font-bold' : 'text-[#4b4863] dark:text-[#c4c1dc]'}`
          }
        >
          <span className="material-symbols-outlined text-xl">timer</span>
          <span className="text-[10px] font-semibold">Focus</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary font-bold' : 'text-[#4b4863] dark:text-[#c4c1dc]'}`
          }
        >
          <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
          <span className="text-[10px] font-semibold">Tasks</span>
        </NavLink>
      </nav>

      {/* Quick Add Modal */}
      {quickAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">Quick Add Task</h3>
              <button onClick={() => setQuickAddOpen(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleQuickAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve Math Homework"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Subject</label>
                  <input
                    type="text"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder="e.g. Math"
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 text-sm outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Deadline</label>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:scale-95 transition-transform"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
