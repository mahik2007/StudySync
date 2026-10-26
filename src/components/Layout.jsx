import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

export const Layout = ({ children }) => {
  const { user, logout, addTask } = useStudy();
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
        <div className="px-6 mb-8">
          <h1 className="font-display-lg text-3xl font-bold text-primary dark:text-inverse-primary tracking-tight">StudySync</h1>
        </div>

        {/* User Stats Card */}
        <div className="px-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-primary-fixed flex items-center justify-center font-bold text-primary">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-title-md text-base text-primary font-bold">{user.name}</p>
            <p className="font-body-sm text-xs text-on-surface-variant">Level {user.level} Scholar ({user.xp} XP)</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-xl mx-4 flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white dark:bg-primary-container dark:text-on-primary-container shadow-md translate-x-1'
                    : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-sm text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Start Focus Session Button */}
        <div className="px-4 mt-auto">
          <button
            onClick={() => navigate('/pomodoro')}
            className="w-full bg-primary-container text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 hover:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">bolt</span>
            Start Focus Session
          </button>
          
          <button
            onClick={logout}
            className="w-full text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-sm text-sm">Logout</span>
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full cursor-pointer transition-colors">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </div>
            <button
              onClick={() => navigate('/pomodoro')}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase hover:scale-95 transition-transform shadow-sm"
            >
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-inverse-surface/90 backdrop-blur-md flex justify-around items-center px-4 z-50 border-t border-outline-variant/20">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-caps text-[9px]">Home</span>
        </NavLink>
        
        <NavLink
          to="/pomodoro"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">timer</span>
          <span className="font-label-caps text-[9px]">Focus</span>
        </NavLink>
        
        {/* Quick Add Action Button */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center -translate-y-4 shadow-lg active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
        </button>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">insights</span>
          <span className="font-label-caps text-[9px]">Stats</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-caps text-[9px]">Profile</span>
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
