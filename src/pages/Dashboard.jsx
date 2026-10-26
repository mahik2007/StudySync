import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { useNavigate } from 'react-router-dom';

const studyTips = [
  "Try the Feynman Technique: Explain your topic to a fictional audience. If you can't simplify it, you don't understand it yet.",
  "Use Spaced Repetition: Review your notes 1 day, 3 days, and 7 days after the lecture to lock them into long-term memory.",
  "Optimize your setup: Clear your workspace of distractions. Keep your phone in another room during Pomodoro sessions.",
  "Take meaningful breaks: A 5-minute walk or light stretching does wonders to restore cognitive focus.",
  "Change study locations: Studying in different environments can enhance recall efficiency by building diverse associations."
];

export default function Dashboard() {
  const { user, tasks, pomodoro, addTask, toggleTask } = useStudy();
  const navigate = useNavigate();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('Revision');
  const [tipIndex, setTipIndex] = useState(0);
  const [taskAdded, setTaskAdded] = useState(false);

  // Quick stats calculations
  const todayMinutes = pomodoro.todayMinutes || 0;
  const todayHours = (todayMinutes / 60).toFixed(1);
  const activeStreak = user?.streak || 0;
  
  // Weekly progress
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Next upcoming tasks
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .slice(0, 2);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    // Add task
    const today = new Date().toISOString().split('T')[0];
    addTask(`${selectedTag}: ${taskTitle}`, 'medium', 'General', today);
    setTaskTitle('');

    setTaskAdded(true);
    window.setTimeout(() => setTaskAdded(false), 1500);
  };

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % studyTips.length);
  };

  // Weekly hours bar height calculation
  const getBarHeight = (minutes) => {
    const maxMinutes = 120; // 2 hours
    const pct = Math.min((minutes / maxMinutes) * 100, 100);
    return `${pct}%`;
  };

  const weekdayLabel = (dateStr) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  // Populate last 7 days for progress chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = pomodoro.history.find(h => h.date === dateStr) || { minutes: 0 };
    return {
      label: weekdayLabel(dateStr),
      minutes: log.minutes,
      isToday: i === 0
    };
  }).reverse();

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left/Center Column */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* Quick Stats Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-[20px] shadow-sm border border-outline-variant/30 flex flex-col justify-between h-40 motion-card">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary p-2 bg-surface-container rounded-lg">flag</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Daily Goal</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-on-background">4h <span className="text-sm font-normal text-on-surface-variant">/ day</span></p>
            </div>
          </div>
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-[20px] shadow-sm border border-outline-variant/30 flex flex-col justify-between h-40 motion-card">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary-fixed rounded-lg">local_fire_department</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Streak</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-on-background">{activeStreak} <span className="text-sm font-normal text-on-surface-variant">days</span></p>
            </div>
          </div>
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-[20px] shadow-sm border border-outline-variant/30 flex flex-col justify-between h-40 motion-card">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary p-2 bg-secondary-fixed rounded-lg">history</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Today</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-on-background">{todayHours}h <span className="text-sm font-normal text-on-surface-variant">studied</span></p>
            </div>
          </div>
        </div>

        {/* Main Progress Section */}
        <div className="bg-white dark:bg-inverse-surface p-6 md:p-8 rounded-[20px] shadow-sm border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-background">Weekly Progress</h3>
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{progressPercent}% Complete</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-full h-24 bg-surface-container rounded-lg relative overflow-hidden flex items-end justify-center">
                    <div 
                      className={`w-full ${day.isToday ? 'bg-primary' : 'bg-primary/40'} rounded-t-sm transition-all duration-300`}
                      style={{ height: getBarHeight(day.minutes) }}
                    ></div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${day.isToday ? 'text-primary font-extrabold' : 'text-on-surface-variant'}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tasks & Deadlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Add Task */}
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-[20px] shadow-sm border border-outline-variant/30">
            <h3 className="text-base font-bold mb-4">Quick Add Task</h3>
            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div className="relative">
                <input 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-3 text-sm transition-all outline-none" 
                  placeholder="What needs study?" 
                  type="text"
                />
                <button 
                  id="quick-add-btn"
                  type="submit" 
                  aria-label={taskAdded ? 'Task added' : 'Add task'}
                  className={`absolute right-2 top-2 p-1.5 text-white rounded-lg flex items-center justify-center transition-colors ${taskAdded ? 'bg-tertiary success-pop' : 'bg-primary'}`}
                >
                  <span className="material-symbols-outlined text-sm">{taskAdded ? 'check' : 'add'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Revision', 'Reading', 'Assignment', 'Exam Prep'].map((tag) => (
                  <span 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                      selectedTag === tag 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </form>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-[20px] shadow-sm border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold">Upcoming</h3>
              <button 
                onClick={() => navigate('/tasks')}
                className="text-primary font-bold text-xs uppercase tracking-wider hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-4 p-3 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-secondary-fixed text-secondary rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">event_note</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-background line-clamp-1">{task.title}</p>
                      <p className="text-xs text-on-surface-variant">Due: {task.deadline}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant hover:text-primary">
                      radio_button_unchecked
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-on-surface-variant">
                  No upcoming deadlines! Add some tasks.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-inverse-surface p-6 rounded-[20px] shadow-sm border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold">Today's Schedule</h3>
            <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/30">
            <div className="flex gap-4 pb-6 relative">
              <div className="w-6 h-6 rounded-full bg-primary ring-4 ring-white z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-xs text-primary font-bold">09:00 - 11:00</p>
                <p className="text-sm font-bold text-on-background">Deep Work: Algebra</p>
                <p className="text-xs text-on-surface-variant">Library Level 2</p>
              </div>
            </div>
            <div className="flex gap-4 pb-6 relative">
              <div className="w-6 h-6 rounded-full bg-outline-variant ring-4 ring-white z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-bold">13:00 - 14:30</p>
                <p className="text-sm font-bold text-on-background">History Lecture</p>
                <p className="text-xs text-on-surface-variant">Hall B</p>
              </div>
            </div>
            <div className="flex gap-4 pb-2 relative">
              <div className="w-6 h-6 rounded-full bg-outline-variant ring-4 ring-white z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-bold">16:00 - 18:00</p>
                <p className="text-sm font-bold text-on-background">Study Group: Physics</p>
                <p className="text-xs text-on-surface-variant">Student Union</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/calendar')}
            className="w-full mt-4 border border-outline-variant text-on-surface-variant py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors"
          >
            Edit Schedule
          </button>
        </div>

        {/* AI Study Tip */}
        <div className="bg-[#f0fdf4] dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-6 rounded-[20px] shadow-sm border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-emerald-700">auto_awesome</span>
            <h3 className="text-base font-bold text-on-background">Study Tip</h3>
          </div>
          <p className="text-sm text-on-surface-variant mb-6 italic">
            "{studyTips[tipIndex]}"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">AI Insight</span>
            <button onClick={rotateTip} className="text-primary hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Insight Card */}
        <div className="rounded-[20px] overflow-hidden relative h-48 shadow-sm border border-outline-variant/30 group cursor-pointer" onClick={() => navigate('/pomodoro')}>
          <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6">
            <p className="text-base font-bold text-white">Focus Mode Mastery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
