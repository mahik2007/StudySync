import { useState } from 'react';
import { useStudy } from '../context/useStudy';
import { formatLocalDate } from '../utils/dateUtils';

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
    setGoalTargetDate(formatLocalDate());
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-edge">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-xs">flag</span>
            <span>Milestones & Goals</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Goal Planner</h1>
          <p className="text-xs text-content-sub">Set long-term targets, track progress milestones, and celebrate completions.</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple hover:bg-purple-hover text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.99] self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const isCompleted = goal.completed || Number(goal.progress) === 100;
            return (
              <div 
                key={goal.id} 
                className="bg-card p-5 rounded-2xl border border-edge shadow-xs flex flex-col justify-between space-y-4 hover:border-purple/30 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="bg-lavender dark:bg-purple/20 text-purple dark:text-violet px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                      {goal.category || 'Academic'}
                    </span>
                    <h2 className={`font-heading text-sm font-bold mt-2 truncate ${isCompleted ? 'line-through text-content-dim' : 'text-content'}`}>
                      {goal.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1.5 text-content-dim hover:text-content hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
                      title="Edit Goal"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(goal.id)}
                      className="p-1.5 text-content-dim hover:text-danger hover:bg-danger-soft/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete Goal"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-content-dim">Target: {goal.targetDate}</span>
                    <span className="font-semibold text-purple">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-edge">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-success' : 'bg-purple'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex justify-between items-center pt-2 border-t border-edge text-xs">
                  <button 
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                      isCompleted ? 'text-success' : 'text-purple hover:underline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  <span className="text-[11px] text-content-dim">
                    {isCompleted ? '100% Achieved' : `${100 - goal.progress}% Remaining`}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 bg-card rounded-2xl border border-edge text-xs text-content-sub space-y-2">
            <span className="material-symbols-outlined text-3xl text-content-dim">flag</span>
            <p className="font-semibold text-content">No active goals found.</p>
            <p className="text-[11px] text-content-dim">Set a new academic target above to track milestones.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-plum/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl border border-edge space-y-4">
            <div className="flex items-center gap-2 text-danger">
              <span className="material-symbols-outlined text-xl">warning</span>
              <h3 className="font-heading text-sm font-bold text-content">Delete Goal</h3>
            </div>
            <p className="text-xs text-content-sub">
              Are you sure you want to delete this milestone? Its progress will be removed.
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
                  deleteGoal(deleteConfirmId);
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
                {editingGoal ? 'Edit Goal' : 'New Goal'}
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
                <label className="block text-xs font-medium text-content-sub mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Master Linear Algebra Chapter 5"
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content placeholder:text-content-dim outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl px-3 py-2 text-xs text-content outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl px-3 py-2 text-xs text-content outline-none"
                  />
                </div>
              </div>

              {editingGoal && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-content-sub">Current Progress</label>
                    <span className="text-xs font-semibold text-purple">{goalProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goalProgress}
                    onChange={(e) => setGoalProgress(Number(e.target.value))}
                    className="w-full accent-purple cursor-pointer"
                  />
                </div>
              )}

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
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
