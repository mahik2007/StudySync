import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { formatLocalDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const studyTips = [
  "Try the Feynman Technique: Explain your topic in simple terms to spot gaps in conceptual understanding.",
  "Leverage Spaced Repetition: Review your notes after 24 hours, 3 days, and 7 days to solidify retention.",
  "Optimize cognitive energy: Clear your desk and keep notifications muted during active Pomodoro cycles.",
  "Take active screen-free pauses: A 5-minute stretch or hydration break restores focus for your next sprint.",
  "Interleave learning: Alternate between problem solving and reading theory to build flexible mental models."
];

export default function Dashboard() {
  const { user, tasks, pomodoro, addTask, toggleTask, setActiveFocusTask } = useStudy();
  const navigate = useNavigate();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('Revision');
  const [tipIndex, setTipIndex] = useState(0);
  const [taskAdded, setTaskAdded] = useState(false);

  // Stats calculations
  const todayMinutes = pomodoro?.todayMinutes || 0;
  const todayHours = (todayMinutes / 60).toFixed(1);
  const activeStreak = user?.streak || 0;
  
  // Weekly progress
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Next upcoming tasks
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    const today = formatLocalDate();
    addTask(`${selectedTag}: ${taskTitle.trim()}`, 'medium', selectedTag, today, 25);
    setTaskTitle('');
    setTaskAdded(true);
    window.setTimeout(() => setTaskAdded(false), 1500);
  };

  const rotateTip = () => {
    setTipIndex((prev) => (prev + 1) % studyTips.length);
  };

  const getBarHeight = (minutes) => {
    const maxMinutes = 120;
    const pct = Math.min((minutes / maxMinutes) * 100, 100);
    return `${Math.max(pct, 8)}%`;
  };

  const weekdayLabel = (dateStr) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);
    const log = pomodoro?.history?.find((h) => h.date === dateStr) || { minutes: 0 };
    return {
      label: weekdayLabel(dateStr),
      minutes: log.minutes,
      isToday: i === 0
    };
  }).reverse();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="bg-card border border-edge rounded-2xl p-6 md:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold">
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            <span>{formattedDate}</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">
            Ready to conquer your goals, {user?.name?.split(' ')[0] || 'Scholar'}?
          </h1>
          <p className="text-xs md:text-sm text-content-sub max-w-xl">
            You're currently on a <span className="font-semibold text-purple">{activeStreak}-day study streak</span>. Turn momentum into deliberate focus blocks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/smart-plan')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-alt hover:bg-lavender dark:hover:bg-purple/20 text-content hover:text-purple text-xs font-semibold border border-edge transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>Smart Plan</span>
          </button>
          <button
            onClick={() => navigate('/pomodoro')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">timer</span>
            <span>Start Focus Session</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Metrics & Activity */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Key Productivity Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Daily Target */}
            <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs flex flex-col justify-between h-34 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-content-sub">Daily Target</span>
                <span className="material-symbols-outlined text-purple text-lg p-1.5 bg-lavender dark:bg-purple/20 rounded-lg">flag</span>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-content">4.0 <span className="text-xs font-normal text-content-sub">hours</span></p>
                <p className="text-[11px] text-content-dim mt-0.5">Recommended daily benchmark</p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs flex flex-col justify-between h-34 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-content-sub">Current Streak</span>
                <span className="material-symbols-outlined text-warning text-lg p-1.5 bg-warning-soft rounded-lg">local_fire_department</span>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-content">{activeStreak} <span className="text-xs font-normal text-content-sub">days</span></p>
                <p className="text-[11px] text-content-dim mt-0.5">Keep the habit chain intact</p>
              </div>
            </div>

            {/* Today's Focus */}
            <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs flex flex-col justify-between h-34 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-content-sub">Today's Focus</span>
                <span className="material-symbols-outlined text-success text-lg p-1.5 bg-success-soft rounded-lg">schedule</span>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-content">{todayHours} <span className="text-xs font-normal text-content-sub">hours</span></p>
                <p className="text-[11px] text-content-dim mt-0.5">{pomodoro?.sessionsCompleted || 0} sessions completed</p>
              </div>
            </div>
          </div>

          {/* Weekly Focus Time Activity */}
          <div className="bg-card border border-edge p-6 rounded-2xl shadow-xs space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-heading text-base font-bold text-content">Weekly Study Activity</h2>
                <p className="text-xs text-content-sub">Minutes of focused study logged over the past 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-alt px-3 py-1 rounded-full border border-edge self-start sm:self-auto">
                <span className="material-symbols-outlined text-purple text-sm">trending_up</span>
                <span className="text-xs font-semibold text-purple">{progressPercent}% tasks done</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Progress bar */}
              <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 7-Day Bar Histogram */}
              <div className="grid grid-cols-7 gap-2 pt-2">
                {last7Days.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-medium text-content-sub">
                      {day.minutes > 0 ? `${day.minutes}m` : '0m'}
                    </span>
                    <div className="w-full h-24 bg-surface-alt rounded-lg relative overflow-hidden flex items-end justify-center border border-edge">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          day.isToday ? 'bg-purple' : 'bg-muted-violet/60 dark:bg-purple/50'
                        }`}
                        style={{ height: getBarHeight(day.minutes) }}
                      />
                    </div>
                    <span className={`text-[11px] font-medium ${day.isToday ? 'text-purple font-semibold' : 'text-content-dim'}`}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tasks & Deadlines Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quick Add Task */}
            <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs space-y-3.5 transition-colors">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple text-lg">add_task</span>
                <h2 className="font-heading text-sm font-bold text-content">Quick Add Task</h2>
              </div>
              <form onSubmit={handleQuickAdd} className="space-y-3">
                <div className="relative">
                  <input 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl pl-3.5 pr-11 py-2 text-xs text-content placeholder:text-content-dim outline-none transition-all" 
                    placeholder="Enter coursework, homework..." 
                    type="text"
                  />
                  <button 
                    type="submit" 
                    aria-label={taskAdded ? 'Task added' : 'Add task'}
                    className={`absolute right-1 top-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      taskAdded ? 'bg-success text-white' : 'bg-purple hover:bg-purple-hover text-white'
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedTag === tag 
                          ? 'bg-purple text-white shadow-2xs' 
                          : 'bg-surface-alt text-content-sub hover:text-content'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs space-y-3 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple text-lg">checklist</span>
                  <h2 className="font-heading text-sm font-bold text-content">Upcoming Tasks</h2>
                </div>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-purple hover:underline text-xs font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-alt border border-edge hover:border-purple/30 transition-colors"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded border border-edge hover:border-purple flex items-center justify-center shrink-0 cursor-pointer"
                        title="Mark Completed"
                      >
                        {task.completed && <span className="material-symbols-outlined text-xs text-purple">check</span>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-content truncate">{task.title}</p>
                        <p className="text-[10px] text-content-dim">Due: {task.deadline || 'Today'}</p>
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
                        className="p-1 rounded-md text-purple hover:bg-lavender dark:hover:bg-purple/20 transition-colors shrink-0 cursor-pointer"
                        title="Focus on this task"
                      >
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-content-dim">
                    No active tasks. Add one using the form!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Guidance */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          {/* Today's Schedule Card */}
          <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs space-y-4 transition-colors">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-sm font-bold text-content flex items-center gap-2">
                <span className="material-symbols-outlined text-purple text-lg">schedule</span>
                Today's Schedule
              </h2>
              <span className="text-content-dim text-xs font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-3.5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-edge">
              <div className="flex gap-3 relative">
                <div className="w-5 h-5 rounded-full bg-purple ring-3 ring-card z-10 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple">09:00 - 10:30</p>
                  <p className="text-xs font-medium text-content">Deep Work: Problem Sets</p>
                  <p className="text-[11px] text-content-dim">Independent Focus</p>
                </div>
              </div>

              <div className="flex gap-3 relative">
                <div className="w-5 h-5 rounded-full bg-edge ring-3 ring-card z-10 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 bg-content-dim rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-sub">13:00 - 14:15</p>
                  <p className="text-xs font-medium text-content">Core Lecture Review</p>
                  <p className="text-[11px] text-content-dim">Active Recall</p>
                </div>
              </div>

              <div className="flex gap-3 relative">
                <div className="w-5 h-5 rounded-full bg-edge ring-3 ring-card z-10 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 bg-content-dim rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-sub">16:30 - 17:30</p>
                  <p className="text-xs font-medium text-content">Quiz & Flashcard Sprint</p>
                  <p className="text-[11px] text-content-dim">Knowledge Retention</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/calendar')}
              className="w-full mt-1 border border-edge hover:border-purple/30 bg-surface-alt hover:bg-lavender dark:hover:bg-purple/15 text-content hover:text-purple py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Open Full Calendar
            </button>
          </div>

          {/* Academic Study Tip */}
          <div className="bg-lavender/50 dark:bg-card border border-purple/20 p-4.5 rounded-2xl shadow-xs space-y-2.5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple text-base">psychology</span>
                <span className="text-xs font-semibold text-purple">Study Principle</span>
              </div>
              <button 
                onClick={rotateTip} 
                className="text-content-dim hover:text-purple transition-colors cursor-pointer"
                title="Next Tip"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
              </button>
            </div>
            <p className="text-xs text-content-sub leading-relaxed italic">
              "{studyTips[tipIndex]}"
            </p>
          </div>

          {/* Smart Plan Promo Callout */}
          <div 
            onClick={() => navigate('/smart-plan')}
            className="p-5 rounded-2xl bg-plum text-white shadow-xs cursor-pointer hover:bg-plum/95 transition-all space-y-2 border border-edge group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet bg-white/10 px-2 py-0.5 rounded-md">
                Smart Plan
              </span>
              <span className="material-symbols-outlined text-base text-violet group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
            <h3 className="font-heading text-sm font-bold text-white">
              Short on time? Build an optimal session plan.
            </h3>
            <p className="text-xs text-lavender/80 leading-relaxed">
              StudySync calculates your task sequence and rest intervals based on available time and current energy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
