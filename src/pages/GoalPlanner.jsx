import { useState } from 'react';
import { useStudy } from '../context/useStudy';

export default function GoalPlanner() {
  const { goals, addGoal, editGoal, deleteGoal, toggleGoal } = useStudy();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalCategory, setGoalCategory] = useState('Academic');
  const [goalProgress, setGoalProgress] = useState(0);

  const categories = ['Academic', 'Skills', 'Reading', 'Personal'];

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalTargetDate(new Date().toISOString().split('T')[0]);
    setGoalCategory('Academic');
    setGoalProgress(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalTargetDate(goal.targetDate);
    setGoalCategory(goal.category || 'Academic');
    setGoalProgress(goal.progress || 0);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    if (editingGoal) {
      editGoal(
        editingGoal.id, 
        goalTitle, 
        goalTargetDate, 
        goalProgress, 
        goalProgress === 100, 
        goalCategory
      );
    } else {
      addGoal(goalTitle, goalTargetDate, goalCategory);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Goal Planner</h2>
          <p className="text-sm text-on-surface-variant">Track long-term academic targets and skill milestones.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm w-fit"
        >
          <span className="material-symbols-outlined text-sm">add</span> Create New Goal
        </button>
      </div>

      {/* Goals Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const isCompleted = goal.completed || goal.progress === 100;
            return (
              <div 
                key={goal.id} 
                className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {goal.category || 'Academic'}
                    </span>
                    <h3 className={`text-base font-bold mt-2 ${isCompleted ? 'line-through text-on-surface-variant' : ''}`}>
                      {goal.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-error transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Target Date: {goal.targetDate}</span>
                    <span className="text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${
                        isCompleted ? 'from-emerald-500 to-emerald-400' : 'from-primary to-secondary'
                      } rounded-full transition-all duration-300`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      isCompleted ? 'text-emerald-700' : 'text-primary hover:underline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 bg-white dark:bg-inverse-surface rounded-2xl border border-outline-variant/30 text-xs text-on-surface-variant">
            No goals planned yet. Add a new goal to start scheduling!
          </div>
        )}
      </div>

      {/* Goal Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{editingGoal ? 'Edit Goal' : 'New Goal'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Finish React advanced certification"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              {editingGoal && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Progress ({goalProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goalProgress}
                    onChange={(e) => setGoalProgress(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:scale-95 transition-transform"
              >
                {editingGoal ? 'Save Changes' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
