import { useState, useMemo } from 'react';
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

  // Use local timezone YYYY-MM-DD
  const todayObj = new Date();
  const formatYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const todayStr = formatYMD(todayObj);

  const categories = ['All', 'Study', 'Practice', 'Development', 'Health', 'Other'];

  const filteredHabits = habits.filter((h) => {
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
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.maxStreak || 0)) : 0;
  const currentStreak = user?.streak || 0;

  // Completion calculation — last 7 days only
  const normalizeDate = (d) => String(d).split('T')[0];
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    return formatYMD(dt);
  });
  const totalChecksThisWeek = habits.reduce((acc, curr) =>
    acc + (curr.completedDates || []).filter(cd => last7.includes(normalizeDate(cd))).length, 0);
  const totalPossibleChecks = habits.length * 7;
  const completionPercentage = totalPossibleChecks > 0
    ? Math.min(100, Math.round((totalChecksThisWeek / totalPossibleChecks) * 100))
    : 0;

  // 22-Week Sunday-aligned Heatmap Data
  const { weeksData, monthLabels } = useMemo(() => {
    const WEEKS = 22;
    const now = new Date();
    const todayDayOfWeek = now.getDay(); // 0 = Sunday

    // End on the coming Saturday (or today if already Saturday)
    const daysToSat = (6 - todayDayOfWeek + 7) % 7;
    // Start: WEEKS*7 days before the end Saturday, then back to its Sunday
    const totalDays = WEEKS * 7;

    // Build an array of all day objects from (totalDays-1) days ago up to this Saturday
    // Use UTC noon to avoid DST / timezone boundary issues when comparing date strings
    const startMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - (totalDays - 1 - daysToSat), 12);

    const weeks = [];
    const months = [];
    let lastMonth = '';

    for (let w = 0; w < WEEKS; w++) {
      // Month label: use first day of this column
      const colFirstMs = startMs + (w * 7) * 86400000;
      const colFirstDate = new Date(colFirstMs);
      const mName = colFirstDate.toLocaleDateString('en-US', { month: 'short' });
      if (mName !== lastMonth) {
        months.push({ weekIndex: w, month: mName });
        lastMonth = mName;
      }

      const daysInWeek = [];
      for (let d = 0; d < 7; d++) {
        const dayMs = startMs + (w * 7 + d) * 86400000;
        const dayDate = new Date(dayMs);
        // Build YYYY-MM-DD from UTC components (since we used UTC noon, this is reliable)
        const y = dayDate.getUTCFullYear();
        const mo = String(dayDate.getUTCMonth() + 1).padStart(2, '0');
        const dy = String(dayDate.getUTCDate()).padStart(2, '0');
        const dateStr = `${y}-${mo}-${dy}`;
        // isFuture: date string is strictly after today
        const isFuture = dateStr > todayStr;
        daysInWeek.push({
          dateStr,
          isFuture,
          isToday: dateStr === todayStr,
          formatted: dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
        });
      }
      weeks.push(daysInWeek);
    }

    return { weeksData: weeks, monthLabels: months };
  }, [todayStr]);

  const getHeatmapColor = (completions, isFuture) => {
    if (isFuture) {
      return 'bg-surface-alt/40 border border-edge/30 opacity-30 cursor-default';
    }
    if (completions === 0) {
      return 'bg-[#EDEAF6] border border-[#DDD7EE] dark:bg-[#28243A] dark:border-[#3E3854] hover:border-purple/60';
    }
    if (completions === 1) {
      return 'bg-[#B4A6F5] border border-[#9684EE] dark:bg-[#5848C7] dark:border-[#7363DC] shadow-2xs';
    }
    if (completions === 2) {
      return 'bg-[#826FF0] border border-[#6D5CE8] dark:bg-[#7261EB] dark:border-[#8E7FF2] shadow-2xs';
    }
    return 'bg-[#5B49D8] border border-[#4837C0] dark:bg-[#A89AF9] dark:border-[#C4BAFC] shadow-xs';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-edge">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            <span>Habit Tracking</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Habit Tracker</h1>
          <p className="text-xs text-content-sub">Reinforce daily learning disciplines and build unbroken streaks.</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple hover:bg-purple-hover text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.99] self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Habit</span>
        </button>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Weekly Completion */}
        <div className="md:col-span-2 bg-card border border-edge p-5 rounded-2xl shadow-xs flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-content-sub">Weekly Discipline</span>
            <p className="font-heading text-2xl font-bold text-content">{completionPercentage}% <span className="text-xs font-normal text-content-sub">overall rate</span></p>
            <p className="text-[11px] text-content-sub">Across all tracked study routines</p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" className="stroke-surface-alt" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="32"
                className="stroke-purple transition-all duration-300"
                strokeWidth="6"
                strokeDasharray="201"
                strokeDashoffset={201 - (completionPercentage / 100) * 201}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-content">{completionPercentage}%</span>
          </div>
        </div>

        {/* Active Streak */}
        <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs flex flex-col justify-between h-32 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-content-sub">Active Streak</span>
            <span className="material-symbols-outlined text-warning text-lg p-1.5 bg-warning-soft rounded-lg">local_fire_department</span>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-content">{currentStreak} <span className="text-xs font-normal text-content-sub">days</span></p>
            <p className="text-[11px] text-content-sub mt-0.5">Consecutive check-in record</p>
          </div>
        </div>

        {/* Max Streak */}
        <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs flex flex-col justify-between h-32 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-content-sub">Best Streak</span>
            <span className="material-symbols-outlined text-purple text-lg p-1.5 bg-lavender dark:bg-purple/20 rounded-lg">emoji_events</span>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-content">{maxStreak} <span className="text-xs font-normal text-content-sub">days</span></p>
            <p className="text-[11px] text-content-sub mt-0.5">Personal best habit record</p>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-card border border-edge p-5 md:p-6 rounded-2xl shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple text-lg">grid_on</span>
            <h2 className="font-heading text-sm font-bold text-content">22-Week Consistency Heatmap</h2>
            <span className="text-[11px] font-medium text-content-dim hidden md:inline">• 154 days overview</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-content-dim self-end sm:self-auto">
            <span>Less</span>
            <div className="w-3 h-3 rounded-xs bg-[#EDEAF6] border border-[#DDD7EE] dark:bg-[#28243A] dark:border-[#3E3854]" title="0 habits completed" />
            <div className="w-3 h-3 rounded-xs bg-[#B4A6F5] border border-[#9684EE] dark:bg-[#5848C7] dark:border-[#7363DC]" title="1 habit completed" />
            <div className="w-3 h-3 rounded-xs bg-[#826FF0] border border-[#6D5CE8] dark:bg-[#7261EB] dark:border-[#8E7FF2]" title="2 habits completed" />
            <div className="w-3 h-3 rounded-xs bg-[#5B49D8] border border-[#4837C0] dark:bg-[#A89AF9] dark:border-[#C4BAFC]" title="3+ habits completed" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Scroll Container */}
        <div className="overflow-x-auto pb-2 pt-1">
          <div className="inline-block min-w-full">
            {/* Month labels row */}
            <div className="flex pl-8 mb-1.5 text-[10px] font-bold text-content-dim select-none">
              {weeksData.map((_, wIdx) => {
                const monthEntry = monthLabels.find((m) => m.weekIndex === wIdx);
                return (
                  <div key={wIdx} className="w-4 mr-1.5 shrink-0 text-left">
                    {monthEntry ? monthEntry.month : ''}
                  </div>
                );
              })}
            </div>

            {/* Grid with weekday row labels on left */}
            <div className="flex items-start">
              {/* Day of week labels */}
              <div className="flex flex-col justify-between py-0.5 pr-2 w-8 shrink-0 text-[9px] font-semibold text-content-dim select-none h-[134px]">
                <span className="h-4 leading-4">Sun</span>
                <span className="h-4 leading-4">Tue</span>
                <span className="h-4 leading-4">Thu</span>
                <span className="h-4 leading-4">Sat</span>
              </div>

              {/* Week columns */}
              <div className="flex gap-1.5">
                {weeksData.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5 shrink-0">
                    {week.map((day) => {
                      const completions = habits.filter((h) => 
                        (h.completedDates || []).some((cd) => normalizeDate(cd) === day.dateStr)
                      ).length;

                      const colorCls = getHeatmapColor(completions, day.isFuture);

                      return (
                        <div
                          key={day.dateStr}
                          title={`${day.formatted}: ${completions} completed habit${completions === 1 ? '' : 's'}${day.isToday ? ' (Today)' : ''}`}
                          className={`w-4 h-4 rounded-xs transition-all ${colorCls} ${
                            day.isToday ? 'ring-2 ring-purple ring-offset-1 dark:ring-offset-card' : ''
                          } ${!day.isFuture ? 'hover:scale-115 hover:z-10 cursor-pointer' : ''}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List Header & Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple text-lg">checklist</span>
            <h2 className="font-heading text-sm font-bold text-content">Today's Habits</h2>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 bg-surface-alt p-1 rounded-xl border border-edge">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-purple text-white shadow-2xs font-semibold'
                    : 'text-content-sub hover:text-content'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Habit Cards Grid */}
        {filteredHabits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredHabits.map((habit) => {
              const isDoneToday = (habit.completedDates || []).some((d) => normalizeDate(d) === todayStr);

              return (
                <div 
                  key={habit.id}
                  className={`bg-card p-4 rounded-xl border border-edge shadow-xs flex items-center justify-between gap-3 transition-colors ${
                    isDoneToday ? 'bg-surface-alt/40 border-purple/20' : 'hover:border-purple/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleHabit(habit.id, todayStr)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isDoneToday 
                          ? 'bg-purple border-purple text-white shadow-2xs' 
                          : 'border-edge hover:border-purple bg-surface-alt text-content-dim'
                      }`}
                      title={isDoneToday ? 'Mark incomplete for today' : 'Mark done for today'}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isDoneToday ? 'check' : 'radio_button_unchecked'}
                      </span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-xs font-semibold truncate ${isDoneToday ? 'line-through text-content-sub opacity-70' : 'text-content'}`}>
                        {habit.name}
                      </h3>
                      <p className="text-[11px] text-content-sub mt-0.5">
                        {habit.category} • Streak: <span className="text-purple font-semibold">{habit.currentStreak || 0}d</span> (Best: {habit.maxStreak || 0}d)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1.5 text-content-dim hover:text-content hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
                      title="Edit Habit"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(habit.id)}
                      className="p-1.5 text-content-dim hover:text-danger hover:bg-danger-soft/40 rounded-lg transition-colors cursor-pointer"
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
          <div className="text-center py-10 bg-card rounded-2xl border border-edge text-xs text-content-sub space-y-2">
            <span className="material-symbols-outlined text-3xl text-content-dim">eco</span>
            <p className="font-semibold text-content">No habits found in this category.</p>
            <button onClick={handleOpenAdd} className="text-purple font-semibold hover:underline cursor-pointer">
              Create your first habit
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-plum/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl border border-edge space-y-4">
            <div className="flex items-center gap-2 text-danger">
              <span className="material-symbols-outlined text-xl">warning</span>
              <h3 className="font-heading text-sm font-bold text-content">Delete Habit</h3>
            </div>
            <p className="text-xs text-content-sub">
              Are you sure you want to delete this habit and its history? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-content-sub hover:bg-surface-alt transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHabit(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-danger text-white shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-plum/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl border border-edge">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-base font-bold text-content">
                {editingHabit ? 'Edit Habit' : 'New Habit'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)} 
                className="text-content-dim hover:text-content p-1 rounded-lg hover:bg-surface-alt"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-content-sub mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. Read 20 pages of textbook"
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content placeholder:text-content-dim outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-content-sub mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value)}
                  className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl px-3 py-2 text-xs text-content outline-none cursor-pointer"
                >
                  {categories.slice(1).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-content-sub hover:text-content hover:bg-surface-alt rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple hover:bg-purple-hover text-white px-5 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
