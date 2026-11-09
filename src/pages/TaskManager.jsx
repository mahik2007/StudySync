import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import { formatLocalDate } from '../utils/dateUtils';

export default function TaskManager() {
  const { tasks, addTask, editTask, deleteTask, toggleTask, setActiveFocusTask } = useStudy();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('deadline-asc');

  // Modals & Delete confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('CS 101');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskEstDuration, setTaskEstDuration] = useState(25);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Extract unique subjects
  const subjects = ['All', ...new Set(tasks.map((t) => t.subject || 'General'))];

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskSubject('CS 101');
    setTaskPriority('medium');
    setTaskDeadline(formatLocalDate());
    setTaskEstDuration(25);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskSubject(task.subject || 'General');
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline || formatLocalDate());
    setTaskEstDuration(task.estimatedDuration || 25);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const deadline = taskDeadline || formatLocalDate();

    if (editingTask) {
      editTask(editingTask.id, {
        title: taskTitle.trim(),
        subject: taskSubject.trim(),
        priority: taskPriority,
        deadline: deadline,
        estimatedDuration: Number(taskEstDuration) || 25
      });
    } else {
      addTask(taskTitle.trim(), taskPriority, taskSubject.trim(), deadline, Number(taskEstDuration) || 25);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = (id) => {
    deleteTask(id);
    setConfirmDeleteId(null);
  };

  const handleStartFocus = (task) => {
    setActiveFocusTask({
      id: task.id,
      title: task.title,
      subject: task.subject || 'General',
      durationMinutes: task.estimatedDuration || 25
    });
    navigate('/pomodoro');
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'All' || task.subject === filterSubject;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesStatus = 
      filterStatus === 'All' ? true :
      filterStatus === 'Active' ? !task.completed :
      task.completed;
      
    return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
  });

  // Sort Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline-asc') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'deadline-desc') {
      return new Date(b.deadline) - new Date(a.deadline);
    }
    if (sortBy === 'priority-high') {
      const pWeights = { high: 3, medium: 2, low: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-edge">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-xs">format_list_bulleted</span>
            <span>Task Management</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Task Manager</h1>
          <p className="text-xs text-content-sub">Track, prioritize, and focus on academic assignments.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple hover:bg-purple-hover text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.99] self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-card p-4 rounded-2xl border border-edge shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-content-dim text-base">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl pl-9 pr-3.5 py-2 text-xs text-content placeholder:text-content-dim outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="md:col-span-7 flex flex-wrap sm:flex-nowrap gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="flex-1 min-w-[100px] bg-surface-alt border border-edge rounded-xl px-2.5 py-2 text-xs text-content outline-none cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {subjects.filter((s) => s !== 'All').map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 min-w-[100px] bg-surface-alt border border-edge rounded-xl px-2.5 py-2 text-xs text-content outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 min-w-[100px] bg-surface-alt border border-edge rounded-xl px-2.5 py-2 text-xs text-content outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 min-w-[110px] bg-surface-alt border border-edge rounded-xl px-2.5 py-2 text-xs text-content outline-none cursor-pointer"
            >
              <option value="deadline-asc">Deadline ↑</option>
              <option value="deadline-desc">Deadline ↓</option>
              <option value="priority-high">Priority High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-card p-4 rounded-xl border border-edge shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                task.completed ? 'opacity-60 bg-surface-alt/50' : 'hover:border-purple/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    task.completed 
                      ? 'bg-purple border-purple text-white' 
                      : 'border-edge hover:border-purple bg-surface-alt'
                  }`}
                  title={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed && <span className="material-symbols-outlined text-xs">check</span>}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold text-content truncate ${task.completed ? 'line-through text-content-dim' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-content-dim">
                    <span className="font-medium px-2 py-0.5 rounded bg-surface-alt text-content-sub">{task.subject || 'General'}</span>
                    <span>•</span>
                    <span>Due: {task.deadline || 'No date'}</span>
                    <span>•</span>
                    <span>{task.estimatedDuration || 25}m</span>
                  </div>
                </div>
              </div>

              {/* Actions & Badges */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Priority Badge */}
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                  task.priority === 'high' 
                    ? 'bg-danger-soft text-danger' 
                    : task.priority === 'medium'
                    ? 'bg-warning-soft text-warning'
                    : 'bg-surface-alt text-content-dim'
                }`}>
                  {task.priority}
                </span>

                {/* Focus Button */}
                {!task.completed && (
                  <button
                    onClick={() => handleStartFocus(task)}
                    className="p-1.5 text-purple hover:bg-lavender dark:hover:bg-purple/20 rounded-lg transition-colors cursor-pointer"
                    title="Focus on this task in Pomodoro"
                  >
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                  </button>
                )}

                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(task)}
                  className="p-1.5 text-content-dim hover:text-content hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
                  title="Edit task"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => setConfirmDeleteId(task.id)}
                  className="p-1.5 text-content-dim hover:text-danger hover:bg-danger-soft/40 rounded-lg transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card p-10 rounded-2xl border border-edge text-center space-y-2">
            <span className="material-symbols-outlined text-3xl text-content-dim">task_alt</span>
            <p className="text-xs font-semibold text-content">No tasks match your filters</p>
            <p className="text-[11px] text-content-dim">Create a new task or modify search filters.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-plum/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl border border-edge space-y-4">
            <div className="flex items-center gap-2 text-danger">
              <span className="material-symbols-outlined text-xl">warning</span>
              <h3 className="font-heading text-sm font-bold text-content">Delete Task</h3>
            </div>
            <p className="text-xs text-content-sub">
              Are you sure you want to remove this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-content-sub hover:bg-surface-alt transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(confirmDeleteId)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-danger hover:bg-danger/90 text-white shadow-xs cursor-pointer"
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
                {editingTask ? 'Edit Task' : 'New Task'}
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
                <label className="block text-xs font-medium text-content-sub mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve physics problems 1-12"
                  className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content placeholder:text-content-dim outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder="e.g. Math, CS"
                    className="w-full bg-surface-alt border border-edge focus:border-purple focus:ring-2 focus:ring-purple/15 rounded-xl px-3.5 py-2 text-xs text-content placeholder:text-content-dim outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl px-3 py-2 text-xs text-content outline-none cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl px-3 py-2 text-xs text-content outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-content-sub mb-1">Est. Duration</label>
                  <select
                    value={taskEstDuration}
                    onChange={(e) => setTaskEstDuration(Number(e.target.value))}
                    className="w-full bg-surface-alt border border-edge focus:border-purple rounded-xl px-3 py-2 text-xs text-content outline-none cursor-pointer"
                  >
                    <option value={15}>15 mins</option>
                    <option value={25}>25 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
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
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
