import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import { formatLocalDate } from '../utils/dateUtils';
import Logo from './Logo';

export const Layout = ({ children }) => {
  const { user, logout, addTask, theme, setTheme } = useStudy();
  const navigate = useNavigate();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskSubject, setTaskSubject] = useState('General');
  const [taskDeadline, setTaskDeadline] = useState('');

  const handleQuickAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const deadline = taskDeadline || formatLocalDate();
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
    { name: 'Goal Planner', path: '/goals', icon: 'flag' },
    { name: 'Calendar', path: '/calendar', icon: 'event' },
    { name: 'Achievements', path: '/achievements', icon: 'military_tech' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  if (!user) {
    return <div className="min-h-screen bg-surface">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-surface text-content font-body flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation Shell (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 py-5 bg-card border-r border-edge w-72 z-40 transition-colors duration-200">
        <div className="px-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavender dark:bg-purple/20 border border-purple/30 flex items-center justify-center p-1.5 shadow-xs">
              <Logo className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-content tracking-tight">StudySync</h1>
              <p className="text-[11px] font-medium text-content-dim">Smart Productivity</p>
            </div>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-surface-alt border border-edge flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lavender dark:bg-purple/20 text-purple font-semibold text-xs flex items-center justify-center border border-purple/20 shrink-0">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs text-content truncate">{user.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-content-sub">
              <span>Lvl {user.level}</span>
              <span>•</span>
              <span className="font-semibold text-purple">{user.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-lavender dark:bg-purple/25 text-purple dark:text-purple font-bold shadow-2xs'
                    : 'text-content-sub hover:text-content hover:bg-surface-alt'
                }`
              }
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Start Focus & Sign Out */}
        <div className="px-4 pt-3 mt-auto border-t border-edge space-y-2">
          <button
            onClick={() => navigate('/pomodoro')}
            className="w-full bg-purple hover:bg-purple-hover text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">timer</span>
            Start Focus Session
          </button>
          
          <button
            onClick={logout}
            className="w-full text-content-sub hover:text-danger hover:bg-danger-soft/40 flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-xs font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (When Opened) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-plum/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-card h-full p-5 flex flex-col z-10 border-r border-edge shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lavender dark:bg-purple/20 border border-purple/20 flex items-center justify-center p-1.5">
                  <Logo className="w-full h-full" />
                </div>
                <h2 className="font-heading font-bold text-lg text-content">StudySync</h2>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-alt text-content-sub"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-lavender dark:bg-purple/25 text-purple dark:text-purple font-bold'
                        : 'text-content-sub hover:text-content hover:bg-surface-alt'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="mt-4 pt-3 border-t border-edge w-full text-content-sub hover:text-danger flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 min-h-screen pb-20 md:pb-8 flex flex-col">
        {/* Header */}
        <header className="h-16 px-5 md:px-8 flex justify-between items-center bg-card/85 backdrop-blur-md sticky top-0 z-30 border-b border-edge transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-content-sub hover:bg-surface-alt cursor-pointer"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex items-baseline gap-2">
              <h2 className="font-heading text-base md:text-lg font-bold text-content">
                Welcome back, {user.name.split(' ')[0]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setQuickAddOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-lavender dark:bg-purple/15 text-purple dark:text-violet hover:bg-purple hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Task</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const next = theme === 'dark' ? 'light' : 'dark';
                setTheme(next);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-content-sub hover:text-content hover:bg-surface-alt transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme mode"
            >
              <span className="material-symbols-outlined text-lg">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Study Now CTA */}
            <button
              onClick={() => navigate('/pomodoro')}
              className="bg-purple hover:bg-purple-hover text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs tracking-wide shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              <span>Study Now</span>
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md flex justify-around items-center px-2 z-40 border-t border-edge shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 ${isActive ? 'text-purple font-semibold' : 'text-content-sub'}`
          }
        >
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="text-[10px]">Home</span>
        </NavLink>
        
        <NavLink
          to="/smart-plan"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 ${isActive ? 'text-purple font-semibold' : 'text-content-sub'}`
          }
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
          <span className="text-[10px]">Plan</span>
        </NavLink>
        
        {/* Quick Add FAB */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="w-11 h-11 bg-purple hover:bg-purple-hover text-white rounded-full flex items-center justify-center -translate-y-3 shadow-md shadow-purple/30 active:scale-95 transition-all cursor-pointer"
          aria-label="Quick Add Task"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        <NavLink
          to="/pomodoro"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 ${isActive ? 'text-purple font-semibold' : 'text-content-sub'}`
          }
        >
          <span className="material-symbols-outlined text-xl">timer</span>
          <span className="text-[10px]">Focus</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 ${isActive ? 'text-purple font-semibold' : 'text-content-sub'}`
          }
        >
          <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
          <span className="text-[10px]">Tasks</span>
        </NavLink>
      </nav>

      {/* Quick Add Modal */}
      {quickAddOpen && (
        <div className="fixed inset-0 bg-plum/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl border border-edge animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-base font-bold text-content">Quick Add Task</h3>
              <button
                onClick={() => setQuickAddOpen(false)}
                className="text-content-dim hover:text-content p-1 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleQuickAddTaskSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-content-sub mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Finish Calculus chapter 4"
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content outline-none transition-all placeholder:text-content-dim"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Subject</label>
                  <input
                    type="text"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder="e.g. Math"
                    className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content outline-none transition-all placeholder:text-content-dim"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3 py-2 text-xs text-content outline-none transition-all cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-content-sub mb-1">Deadline</label>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content outline-none transition-all"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-content-sub hover:text-content hover:bg-surface-alt rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple hover:bg-purple-hover text-white px-5 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
