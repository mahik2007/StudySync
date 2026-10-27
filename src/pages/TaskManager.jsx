import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

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
  const subjects = ['All', ...new Set(tasks.map(t => t.subject || 'General'))];

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskSubject('CS 101');
    setTaskPriority('medium');
    setTaskDeadline(new Date().toISOString().split('T')[0]);
    setTaskEstDuration(25);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskSubject(task.subject || 'General');
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline || new Date().toISOString().split('T')[0]);
    setTaskEstDuration(task.estimatedDuration || 25);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const deadline = taskDeadline || new Date().toISOString().split('T')[0];

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
  const filteredTasks = tasks.filter(task => {
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
    } else if (sortBy === 'deadline-desc') {
      return new Date(b.deadline) - new Date(a.deadline);
    } else if (sortBy === 'priority-desc') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    } else if (sortBy === 'priority-asc') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[a.priority] - priorityWeights[b.priority];
    }
    return 0;
  });

  const getPriorityBadge = (priority) => {
    if (priority === 'high') {
      return 'bg-error/15 text-error border border-error/20';
    }
    if (priority === 'medium') {
      return 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/30';
    }
    return 'bg-secondary-fixed/50 text-secondary border border-secondary/20';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">checklist</span>
            Academic Task Flow
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
            Task Manager
          </h2>
          <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
            Stay organized with coursework, problem sets, and upcoming deliverables.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md w-fit"
        >
          <span className="material-symbols-outlined text-sm">add</span> Add New Task
        </button>
      </div>

      {/* Controls: Search, Filters, and Sorting */}
      <div className="bg-white dark:bg-surface-container p-4 md:p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#5e5b79] dark:text-[#bbb8d0] text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, topics, homework..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm outline-none focus:border-primary text-[#1b1b24] dark:text-white font-medium"
            />
          </div>

          {/* Filters */}
          <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-outline-variant/30 bg-surface-container-low rounded-xl text-xs font-bold text-[#3b3852] dark:text-white outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {subjects.slice(1).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-outline-variant/30 bg-surface-container-low rounded-xl text-xs font-bold text-[#3b3852] dark:text-white outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-outline-variant/30 bg-surface-container-low rounded-xl text-xs font-bold text-[#3b3852] dark:text-white outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-outline-variant/30 bg-surface-container-low rounded-xl text-xs font-bold text-[#3b3852] dark:text-white outline-none focus:border-primary cursor-pointer"
            >
              <option value="deadline-asc">Due Date (Earliest)</option>
              <option value="deadline-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed 
                  ? 'bg-surface-container-low/70 border-outline-variant/20 opacity-70' 
                  : 'bg-white dark:bg-surface-container border-outline-variant/30 shadow-sm hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button 
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? 'Mark task pending' : 'Complete task'}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                    task.completed 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'border-outline-variant/50 hover:border-primary text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </button>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <h4 className={`text-sm font-bold truncate ${
                    task.completed ? 'line-through text-[#5e5b79] dark:text-[#a5a2bf]' : 'text-[#1b1b24] dark:text-white'
                  }`}>
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span className="bg-surface-container-high px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#3b3852] dark:text-[#d3d0e8]">
                      {task.subject}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-semibold text-[#5e5b79] dark:text-[#a5a2bf] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {task.deadline}
                    </span>
                    <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">timer</span>
                      {task.estimatedDuration || 25}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!task.completed && (
                  <button
                    onClick={() => handleStartFocus(task)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-fixed hover:bg-primary-fixed-dim text-primary rounded-xl text-xs font-bold transition-all"
                    title="Start Pomodoro with this task"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    <span>Focus</span>
                  </button>
                )}
                <button 
                  onClick={() => handleOpenEdit(task)}
                  className="p-1.5 hover:bg-surface-container-high rounded-xl text-[#5e5b79] dark:text-[#bbb8d0] hover:text-primary transition-colors"
                  title="Edit Task"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(task.id)}
                  className="p-1.5 hover:bg-error/10 rounded-xl text-[#5e5b79] dark:text-[#bbb8d0] hover:text-error transition-colors"
                  title="Delete Task"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/30 text-xs text-[#5e5b79] dark:text-[#a5a2bf] space-y-2">
            <span className="material-symbols-outlined text-3xl text-primary">fact_check</span>
            <p className="font-semibold">No tasks match your filters.</p>
            <button
              onClick={handleOpenAdd}
              className="text-primary font-bold hover:underline"
            >
              Add a new task now
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container rounded-2xl p-6 w-full max-w-sm shadow-xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">Delete Task?</h3>
            </div>
            <p className="text-xs text-[#4b4863] dark:text-[#bbb8d0]">
              Are you sure you want to remove this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error text-white hover:opacity-90"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-container rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#5e5b79] dark:text-[#bbb8d0]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve physics problems 1-12"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none text-[#1b1b24] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder="e.g. Math, CS, Bio"
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">Est. Duration</label>
                  <select
                    value={taskEstDuration}
                    onChange={(e) => setTaskEstDuration(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-2 text-sm outline-none text-[#1b1b24] dark:text-white cursor-pointer"
                  >
                    <option value={15}>15 mins</option>
                    <option value={25}>25 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[0.99] transition-transform"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
