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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
      editHabit(editingHabit.id, habitName.trim(), habitCategory);
    } else {
      addHabit(habitName.trim(), habitCategory);
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
        colorClass = 'bg-primary/25';
      } else if (completions === 2) {
        colorClass = 'bg-primary/60';
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">repeat</span>
            Habit Consistency
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
            Habit Tracker
          </h2>
          <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
            Master your academic consistency and build neural momentum day after day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3.5 py-2 border border-outline-variant/30 rounded-xl bg-white dark:bg-surface-container text-xs font-bold text-[#3b3852] dark:text-white outline-none focus:border-primary cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-sm">add</span> New Habit
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Main Stat: Completion */}
        <div className="md:col-span-2 p-6 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#5e5b79] dark:text-[#bbb8d0]">Weekly Average Completion</span>
            <span className="material-symbols-outlined text-tertiary">trending_up</span>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-high" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeWidth="6"></circle>
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
                  strokeLinecap="round"
                ></circle>
              </svg>
              <span className="absolute text-lg font-extrabold text-[#1b1b24] dark:text-white">{completionPercentage}%</span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#4b4863] dark:text-[#c4c1dc]">
                Consistency compounds faster than intensity. Complete daily check-ins to preserve streaks.
              </p>
              <div className="mt-2.5 flex gap-1.5">
                <span className="bg-tertiary-fixed text-tertiary px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase">PEAK FLOW</span>
                <span className="bg-secondary-fixed text-secondary px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase">CONSISTENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="p-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl shadow-md flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-white/80">Active Streak</span>
          <div className="mt-3">
            <p className="text-4xl font-black tracking-tight">{currentStreak} <span className="text-base font-normal opacity-80">days</span></p>
            <p className="text-xs text-white/80 font-medium mt-1">Unbroken habit sequence</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-tertiary-fixed">
            <span className="material-symbols-outlined text-lg fill-current">local_fire_department</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">ACTIVE MOMENTUM</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#5e5b79] dark:text-[#bbb8d0]">All-Time Best Streak</span>
          <div className="mt-3">
            <p className="text-4xl font-black text-[#1b1b24] dark:text-white tracking-tight">{maxStreak} <span className="text-base font-normal text-[#5e5b79] dark:text-[#bbb8d0]">days</span></p>
            <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf] font-medium mt-1">Personal best benchmark</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-lg">military_tech</span>
            <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">RECORD</span>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="p-6 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Habit Check-in Intensity</h3>
            <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">15-week completion visual matrix</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#5e5b79] dark:text-[#a5a2bf]">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-surface-container rounded-sm"></div>
              <div className="w-3 h-3 bg-primary/25 rounded-sm"></div>
              <div className="w-3 h-3 bg-primary/60 rounded-sm"></div>
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
        {renderHeatmap()}
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Active Habits ({filteredHabits.length})</h3>
        {filteredHabits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map((habit) => {
              const isDoneToday = habit.completedDates.includes(todayStr);
              return (
                <div key={habit.id} className="p-4 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 flex items-center justify-between hover:border-primary/40 transition-all shadow-sm">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button 
                      onClick={() => toggleHabit(habit.id, todayStr)}
                      aria-label={isDoneToday ? 'Mark habit undone today' : 'Complete habit today'}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                        isDoneToday 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'bg-surface-container-low text-[#5e5b79] dark:text-[#bbb8d0] border-outline-variant/50 hover:border-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isDoneToday ? 'check' : 'radio_button_unchecked'}
                      </span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-sm font-bold truncate ${isDoneToday ? 'line-through text-[#5e5b79] dark:text-[#a5a2bf]' : 'text-[#1b1b24] dark:text-white'}`}>
                        {habit.name}
                      </h4>
                      <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf] font-medium mt-0.5">
                        {habit.category} • Streak: <span className="text-primary font-bold">{habit.currentStreak || 0}d</span> (Best: {habit.maxStreak || 0}d)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button 
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1.5 hover:bg-surface-container-high rounded-lg text-[#5e5b79] dark:text-[#bbb8d0] hover:text-primary transition-colors"
                      title="Edit Habit"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(habit.id)}
                      className="p-1.5 hover:bg-error/10 rounded-lg text-[#5e5b79] dark:text-[#bbb8d0] hover:text-error transition-colors"
                      title="Delete Habit"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 text-xs text-[#5e5b79] dark:text-[#a5a2bf] space-y-2">
            <span className="material-symbols-outlined text-3xl text-primary">eco</span>
            <p className="font-semibold">No habits match this category.</p>
            <button onClick={handleOpenAdd} className="text-primary font-bold hover:underline">
              Create your first habit
            </button>
          </div>
        )}
      </div>

      {/* Delete Habit Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container rounded-2xl p-6 w-full max-w-sm shadow-xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Delete Habit?</h3>
            </div>
            <p className="text-xs text-[#4b4863] dark:text-[#bbb8d0]">
              Are you sure you want to delete this habit and its associated streak history?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHabit(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error text-white hover:opacity-90"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habit Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{editingHabit ? 'Edit Habit' : 'New Habit'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#5e5b79] dark:text-[#bbb8d0]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. Read 20 mins of textbook"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none text-[#1b1b24] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white cursor-pointer"
                >
                  {categories.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[0.99] transition-transform"
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
