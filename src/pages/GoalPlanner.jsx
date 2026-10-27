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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const categories = ['Academic', 'Skills', 'Reading', 'Personal', 'Exams'];

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
        goalTitle.trim(), 
        goalTargetDate, 
        goalProgress, 
        Number(goalProgress) === 100, 
        goalCategory
      );
    } else {
      addGoal(goalTitle.trim(), goalTargetDate, goalCategory);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">flag</span>
            Semester Milestones
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
            Goal Planner
          </h2>
          <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
            Track long-term academic targets, certifications, and core skill milestones.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md w-fit"
        >
          <span className="material-symbols-outlined text-sm">add</span> Create New Goal
        </button>
      </div>

      {/* Goals Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const isCompleted = goal.completed || Number(goal.progress) === 100;
            return (
              <div 
                key={goal.id} 
                className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                      {goal.category || 'Academic'}
                    </span>
                    <h3 className={`text-base font-bold mt-2 truncate ${isCompleted ? 'line-through text-[#5e5b79] dark:text-[#a5a2bf]' : 'text-[#1b1b24] dark:text-white'}`}>
                      {goal.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1.5 hover:bg-surface-container-high rounded-xl text-[#5e5b79] dark:text-[#bbb8d0] hover:text-primary transition-colors"
                      title="Edit Goal"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(goal.id)}
                      className="p-1.5 hover:bg-error/10 rounded-xl text-[#5e5b79] dark:text-[#bbb8d0] hover:text-error transition-colors"
                      title="Delete Goal"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#5e5b79] dark:text-[#a5a2bf]">Target Date: {goal.targetDate}</span>
                    <span className="text-primary font-extrabold">{goal.progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/20">
                    <div 
                      className={`h-full bg-gradient-to-r ${
                        isCompleted ? 'from-tertiary to-tertiary-fixed' : 'from-primary to-primary-container'
                      } rounded-full transition-all duration-500`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
                  <button 
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                      isCompleted ? 'text-tertiary' : 'text-primary hover:underline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {isCompleted ? 'Completed Goal' : 'Mark Complete'}
                  </button>

                  <span className="text-[11px] font-bold text-[#5e5b79] dark:text-[#a5a2bf]">
                    {isCompleted ? '100% Achieved' : `${100 - goal.progress}% Remaining`}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 text-xs text-[#5e5b79] dark:text-[#a5a2bf] space-y-2">
            <span className="material-symbols-outlined text-3xl text-primary">target</span>
            <p className="font-semibold">No goals planned yet. Add a new goal to start tracking!</p>
          </div>
        )}
      </div>

      {/* Delete Goal Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container rounded-2xl p-6 w-full max-w-sm shadow-xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Delete Goal?</h3>
            </div>
            <p className="text-xs text-[#4b4863] dark:text-[#bbb8d0]">
              Are you sure you want to delete this milestone? This will remove its recorded progress.
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
                  deleteGoal(deleteConfirmId);
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

      {/* Goal Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{editingGoal ? 'Edit Goal' : 'New Goal'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#5e5b79] dark:text-[#bbb8d0]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Master Linear Algebra Chapter 5"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none text-[#1b1b24] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white"
                  />
                </div>
              </div>

              {editingGoal && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0]">Current Progress</label>
                    <span className="text-xs font-extrabold text-primary">{goalProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goalProgress}
                    onChange={(e) => setGoalProgress(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[0.99] transition-transform"
              >
                {editingGoal ? 'Save Milestone' : 'Add Academic Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
