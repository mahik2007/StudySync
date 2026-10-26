import { useState } from 'react';
import { useStudy } from '../context/useStudy';

export default function HabitTracker() {
  const { 
    habits, 
    addHabit, 
    editHabit, 
    deleteHabit, 
    toggleHabit,
    user
  } = useStudy();

  const [filterCategory, setFilterCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Study');

  const todayStr = new Date().toISOString().split('T')[0];
  const categories = ['All', 'Study', 'Practice', 'Development', 'Health', 'Other'];

  const filteredHabits = habits.filter(h => {
    if (filterCategory === 'All') return true;
    return h.category === filterCategory;
  });

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setHabitName('');
    setHabitCategory('Study');
    setModalOpen(true);
  };

  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setHabitName(habit.name);
    setHabitCategory(habit.category);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    if (editingHabit) {
      editHabit(editingHabit.id, habitName, habitCategory);
    } else {
      addHabit(habitName, habitCategory);
    }
    setModalOpen(false);
  };

  // Streaks calculations
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.maxStreak || 0)) : 0;
  const currentStreak = user?.streak || 0;

  // Completion calculation
  const totalChecksThisWeek = habits.reduce((acc, curr) => acc + curr.completedDates.length, 0);
  const totalPossibleChecks = habits.length * 7;
  const completionPercentage = totalPossibleChecks > 0 
    ? Math.round((totalChecksThisWeek / totalPossibleChecks) * 100) 
    : 0;

  // Dynamic Heatmap generation for last 15 weeks (105 days)
  const renderHeatmap = () => {
    const squares = [];
    const today = new Date();
    
    // We want a 7 rows (Sunday to Saturday) by 15 columns grid
    // Sunday of the week 15 weeks ago
    const totalDays = 105;
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays + 1);

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Calculate how many habits were completed on this date
      const completions = habits.filter(h => h.completedDates.includes(dateStr)).length;

      // Color mapping
      let colorClass = 'bg-surface-container'; // 0 completions
      if (completions === 1) {
        colorClass = 'bg-primary/20';
      } else if (completions === 2) {
        colorClass = 'bg-primary/50';
      } else if (completions >= 3) {
        colorClass = 'bg-primary';
      }

      squares.push(
        <div 
          key={dateStr} 
          title={`${dateStr}: ${completions} completions`}
          className={`w-3.5 h-3.5 rounded-sm ${colorClass} hover:ring-2 hover:ring-primary/40 cursor-pointer transition-all`}
        />
      );
    }

    return (
      <div className="grid grid-rows-7 grid-flow-col gap-1.5 overflow-x-auto pb-2 justify-start max-w-full">
        {squares}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Habit Tracker</h2>
          <p className="text-sm text-on-surface-variant">Master your consistency, one day at a time.</p>
        </div>
        <div className="flex gap-2">
          {/* Category Filter */}
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-outline-variant/30 rounded-xl bg-white text-xs outline-none focus:ring-4 focus:ring-primary/5"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span> New Habit
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Stat: Completion */}
        <div className="md:col-span-2 p-6 bg-white dark:bg-inverse-surface rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Weekly Average Completion</span>
            <span className="material-symbols-outlined text-tertiary">trending_up</span>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeWidth="6"></circle>
                <circle 
                  className="text-primary transition-all duration-500" 
                  cx="40" 
                  cy="40" 
                  fill="transparent" 
                  r="32" 
                  stroke="currentColor" 
                  strokeDasharray="201" 
                  strokeDashoffset={201 - (201 * completionPercentage) / 100} 
                  strokeWidth="6"
                ></circle>
              </svg>
              <span className="absolute text-lg font-bold">{completionPercentage}%</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Consistency is the secret of learning. Complete daily tasks to unlock rewards.</p>
              <div className="mt-2 flex gap-1">
                <span className="bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded-full text-[9px] font-bold">PEAK FLOW</span>
                <span className="bg-secondary-fixed text-secondary px-2 py-0.5 rounded-full text-[9px] font-bold">CONSISTENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="p-6 bg-primary text-white rounded-2xl shadow-md flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-white/80">Current Streak</span>
          <div className="mt-4">
            <p className="text-4xl font-extrabold tracking-tighter">{currentStreak}</p>
            <p className="text-xs text-white/80">Days of active tracking</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined fill-current">local_fire_department</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">KEEP IT UP!</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-inverse-surface rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">Longest Streak</span>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-on-background tracking-tighter">{maxStreak}</p>
            <p className="text-xs text-on-surface-variant">Personal Best record</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">military_tech</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">BEST</span>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="p-6 bg-white dark:bg-inverse-surface rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">Habit Focus Intensity</h3>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-surface-container rounded-sm"></div>
              <div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
              <div className="w-3 h-3 bg-primary/50 rounded-sm"></div>
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
        {renderHeatmap()}
      </div>

      {/* Habits List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold">Active Habits</h3>
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => {
              const isDoneToday = habit.completedDates.includes(todayStr);
              return (
                <div key={habit.id} className="p-4 bg-white dark:bg-inverse-surface rounded-xl border border-outline-variant/30 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleHabit(habit.id, todayStr)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                        isDoneToday 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/50 hover:border-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {isDoneToday ? 'check' : 'circle'}
                      </span>
                    </button>
                    <div>
                      <h4 className={`text-sm font-bold ${isDoneToday ? 'line-through text-on-surface-variant' : 'text-on-background'}`}>
                        {habit.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant">{habit.category} • Streak: {habit.currentStreak || 0}d</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-inverse-surface rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant">
              No habits found. Create a new habit to start tracking!
            </div>
          )}
        </div>

        {/* Categories Quick Board */}
        <div className="space-y-4">
          <h3 className="text-base font-bold">Category Distribution</h3>
          <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
            {categories.slice(1).map(cat => {
              const count = habits.filter(h => h.category === cat).length;
              return (
                <div key={cat} className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">{cat}</span>
                  <span className="font-bold bg-surface-container px-2 py-0.5 rounded-full">{count} habits</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Habit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{editingHabit ? 'Edit Habit' : 'New Habit'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. Read 30 mins"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                >
                  {categories.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:scale-95 transition-transform"
              >
                {editingHabit ? 'Save Changes' : 'Create Habit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
