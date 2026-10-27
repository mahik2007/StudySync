import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { useNavigate } from 'react-router-dom';

const studyTips = [
  "Try the Feynman Technique: Explain your topic in simple terms to spot gaps in conceptual understanding.",
  "Leverage Spaced Repetition: Review your notes after 24 hours, 3 days, and 7 days to solidify neural retention.",
  "Optimize cognitive energy: Clear your desk of clutter and keep notifications muted during active Pomodoro cycles.",
  "Take active screen-free pauses: A 5-minute stretch or hydration break restores dopamine receptors for your next sprint.",
  "Interleave learning: Alternate between problem solving and reading theory to build flexible mental models."
];

export default function Dashboard() {
  const { user, tasks, pomodoro, addTask, toggleTask, setActiveFocusTask } = useStudy();
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
    .slice(0, 3);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    const today = new Date().toISOString().split('T')[0];
    addTask(`${selectedTag}: ${taskTitle.trim()}`, 'medium', selectedTag, today, 25);
    setTaskTitle('');

    setTaskAdded(true);
    window.setTimeout(() => setTaskAdded(false), 1500);
  };

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % studyTips.length);
  };

  const getBarHeight = (minutes) => {
    const maxMinutes = 120; // 2 hours target
    const pct = Math.min((minutes / maxMinutes) * 100, 100);
    return `${Math.max(pct, 6)}%`;
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
    <div className="space-y-6">
      {/* Personalized Welcome Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary-fixed/90 via-surface-container to-primary-fixed-dim/50 border border-primary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">sparkles</span>
            Academic Overview
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
            Ready to conquer your goals, {user?.name?.split(' ')[0] || 'Scholar'}?
          </h2>
          <p className="text-xs md:text-sm text-[#4b4863] dark:text-[#bbb8d0] font-medium max-w-xl">
            You're currently on a <b>{activeStreak}-day study streak</b>. Turn today's momentum into focus blocks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/smart-plan')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs uppercase tracking-wider border border-primary/25 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            Smart Plan
          </button>
          <button
            onClick={() => navigate('/pomodoro')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            Start Focus Session
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left/Center Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Quick Stats Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-surface-container p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-36 motion-card">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed/50 rounded-xl">flag</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#5e5b79] dark:text-[#bbb8d0]">Daily Target</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#1b1b24] dark:text-white">4.0<span className="text-sm font-medium text-[#5e5b79] dark:text-[#bbb8d0]">h / day</span></p>
                <p className="text-[10px] text-[#5e5b79] dark:text-[#a5a2bf] font-semibold mt-0.5">Recommended daily goal</p>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-container p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-36 motion-card">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary-fixed/60 rounded-xl">local_fire_department</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#5e5b79] dark:text-[#bbb8d0]">Current Streak</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#1b1b24] dark:text-white">{activeStreak} <span className="text-sm font-medium text-[#5e5b79] dark:text-[#bbb8d0]">days</span></p>
                <p className="text-[10px] text-tertiary font-bold mt-0.5">Keep the chain unbroken</p>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-container p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-36 motion-card">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary p-2 bg-secondary-fixed/60 rounded-xl">schedule</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#5e5b79] dark:text-[#bbb8d0]">Today's Focus</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#1b1b24] dark:text-white">{todayHours}<span className="text-sm font-medium text-[#5e5b79] dark:text-[#bbb8d0]">h studied</span></p>
                <p className="text-[10px] text-primary font-bold mt-0.5">{pomodoro.sessionsCompleted} sessions logged</p>
              </div>
            </div>
          </div>

          {/* Weekly Progress Section */}
          <div className="bg-white dark:bg-surface-container p-6 md:p-7 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Weekly Focus Time</h3>
                <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">Minutes of deep work logged across the last 7 days</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">{progressPercent}% Task Completion</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* 7-Day Bar Histogram */}
              <div className="grid grid-cols-7 gap-2 pt-2">
                {last7Days.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-[#5e5b79] dark:text-[#a5a2bf]">
                      {day.minutes > 0 ? `${day.minutes}m` : '-'}
                    </span>
                    <div className="w-full h-24 bg-surface-container-low rounded-xl relative overflow-hidden flex items-end justify-center border border-outline-variant/20">
                      <div 
                        className={`w-full ${day.isToday ? 'bg-primary' : 'bg-primary/50'} rounded-t-lg transition-all duration-300`}
                        style={{ height: getBarHeight(day.minutes) }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${day.isToday ? 'text-primary font-black' : 'text-[#5e5b79] dark:text-[#a5a2bf]'}`}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tasks & Deadlines Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quick Add Task Card */}
            <div className="bg-white dark:bg-surface-container p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">add_task</span>
                <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Quick Add Task</h3>
              </div>
              <form onSubmit={handleQuickAdd} className="space-y-3">
                <div className="relative">
                  <input 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-3.5 pr-12 py-2.5 text-xs md:text-sm outline-none text-[#1b1b24] dark:text-white font-medium" 
                    placeholder="Enter coursework, homework..." 
                    type="text"
                  />
                  <button 
                    id="quick-add-btn"
                    type="submit" 
                    aria-label={taskAdded ? 'Task added' : 'Add task'}
                    className={`absolute right-1.5 top-1.5 p-1.5 text-white rounded-lg flex items-center justify-center transition-all ${
                      taskAdded ? 'bg-tertiary success-pop' : 'bg-primary hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{taskAdded ? 'check' : 'add'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Revision', 'Reading', 'Assignment', 'Exam Prep'].map((tag) => (
                    <button 
                      type="button"
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        selectedTag === tag 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'bg-surface-container text-[#3b3852] dark:text-[#bbb8d0] hover:bg-surface-container-high'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Upcoming Deadlines Card */}
            <div className="bg-white dark:bg-surface-container p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">event_upcoming</span>
                  <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Upcoming Tasks</h3>
                </div>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-primary font-bold text-xs uppercase tracking-wider hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2.5">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-all"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-5 h-5 rounded-md border border-outline-variant/50 hover:border-primary flex items-center justify-center shrink-0"
                        title="Mark Completed"
                      >
                        {task.completed && <span className="material-symbols-outlined text-xs text-primary">check</span>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1b1b24] dark:text-white truncate">{task.title}</p>
                        <p className="text-[10px] text-[#5e5b79] dark:text-[#a5a2bf] font-medium">Due: {task.deadline}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveFocusTask({
                            id: task.id,
                            title: task.title,
                            subject: task.subject || 'General',
                            durationMinutes: task.estimatedDuration || 25
                          });
                          navigate('/pomodoro');
                        }}
                        className="p-1 rounded-lg text-primary hover:bg-primary-fixed text-xs font-bold shrink-0"
                        title="Focus on this task"
                      >
                        <span className="material-symbols-outlined text-base">play_arrow</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-[#5e5b79] dark:text-[#a5a2bf]">
                    No active tasks. Add a new task above!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white dark:bg-surface-container p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#1b1b24] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                Today's Schedule
              </h3>
              <span className="text-[#5e5b79] dark:text-[#a5a2bf] font-extrabold text-xs uppercase tracking-wider">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/30">
              <div className="flex gap-3.5 relative">
                <div className="w-6 h-6 rounded-full bg-primary ring-4 ring-white dark:ring-surface-container z-10 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs text-primary font-bold">09:00 - 10:30</p>
                  <p className="text-sm font-bold text-[#1b1b24] dark:text-white">Deep Work: Problem Sets</p>
                  <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">Independent Study Session</p>
                </div>
              </div>

              <div className="flex gap-3.5 relative">
                <div className="w-6 h-6 rounded-full bg-outline-variant ring-4 ring-white dark:ring-surface-container z-10 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf] font-bold">13:00 - 14:15</p>
                  <p className="text-sm font-bold text-[#1b1b24] dark:text-white">Core Lecture & Notes</p>
                  <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">Academic Review</p>
                </div>
              </div>

              <div className="flex gap-3.5 relative">
                <div className="w-6 h-6 rounded-full bg-outline-variant ring-4 ring-white dark:ring-surface-container z-10 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf] font-bold">16:30 - 17:30</p>
                  <p className="text-sm font-bold text-[#1b1b24] dark:text-white">Flashcards & Quiz Prep</p>
                  <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">Active Recall Flow</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/calendar')}
              className="w-full mt-2 border border-outline-variant/40 text-[#3b3852] dark:text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors"
            >
              Open Full Calendar
            </button>
          </div>

          {/* Academic Study Tip Card */}
          <div className="bg-primary-fixed/20 border-l-4 border-primary p-5 rounded-2xl shadow-sm border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">psychology</span>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Productivity Principle</h4>
              </div>
              <button onClick={rotateTip} className="text-primary hover:rotate-180 transition-transform">
                <span className="material-symbols-outlined text-base">refresh</span>
              </button>
            </div>
            <p className="text-xs text-[#3b3852] dark:text-[#c4c1dc] leading-relaxed italic">
              "{studyTips[tipIndex]}"
            </p>
          </div>

          {/* Smart Plan Promo Callout */}
          <div 
            onClick={() => navigate('/smart-plan')}
            className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white shadow-md cursor-pointer hover:shadow-lg transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                Standout Feature
              </span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
            <h4 className="text-base font-extrabold leading-tight">
              Short on time? Build a 30-min plan in seconds.
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Let StudySync compute your optimal task order and rest intervals based on current energy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
