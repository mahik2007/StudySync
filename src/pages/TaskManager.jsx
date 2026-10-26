import { useState } from 'react';
import { useStudy } from '../context/useStudy';

export default function TaskManager() {
  const { tasks, addTask, editTask, deleteTask, toggleTask } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('deadline-asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('CS 101');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDeadline, setTaskDeadline] = useState('');

  // Extract unique subjects
  const subjects = ['All', ...new Set(tasks.map(t => t.subject || 'General'))];

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskSubject('CS 101');
    setTaskPriority('medium');
    setTaskDeadline(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskSubject(task.subject || 'General');
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const deadline = taskDeadline || new Date().toISOString().split('T')[0];

    if (editingTask) {
      editTask(editingTask.id, {
        title: taskTitle,
        subject: taskSubject,
        priority: taskPriority,
        deadline: deadline
      });
    } else {
      addTask(taskTitle, taskPriority, taskSubject, deadline);
    }
    setModalOpen(false);
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

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-error/10 text-error';
    if (priority === 'medium') return 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300';
    return 'bg-secondary/10 text-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Task Manager</h2>
          <p className="text-sm text-on-surface-variant">Stay on top of lectures, homework, and prep assignments.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm w-fit"
        >
          <span className="material-symbols-outlined text-sm">add</span> Add New Task
        </button>
      </div>

      {/* Controls: Search, Filters, and Sorting */}
      <div className="bg-white dark:bg-inverse-surface p-4 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            />
          </div>

          {/* Filters */}
          <div className="md:col-span-7 flex flex-wrap gap-2 justify-end">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-outline-variant/25 bg-surface-container-low rounded-xl text-xs outline-none focus:ring-4 focus:ring-primary/5"
            >
              <option value="All">All Subjects</option>
              {subjects.slice(1).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-outline-variant/25 bg-surface-container-low rounded-xl text-xs outline-none focus:ring-4 focus:ring-primary/5"
            >
              <option value="All">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-outline-variant/25 bg-surface-container-low rounded-xl text-xs outline-none focus:ring-4 focus:ring-primary/5"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-outline-variant/25 bg-surface-container-low rounded-xl text-xs outline-none focus:ring-4 focus:ring-primary/5"
            >
              <option value="deadline-asc">Deadline (Asc)</option>
              <option value="deadline-desc">Deadline (Desc)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-4 bg-white dark:bg-inverse-surface rounded-xl border border-outline-variant/30 flex items-center justify-between hover:shadow-sm transition-all ${
                task.completed ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Completion Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    task.completed 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-outline-variant/50 text-outline-variant hover:border-primary'
                  }`}
                >
                  {task.completed && <span className="material-symbols-outlined text-sm">check</span>}
                </button>

                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-on-surface-variant' : 'text-on-background'}`}>
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant">
                      {task.subject}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {task.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenEdit(task)}
                  className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-inverse-surface rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant">
            No tasks match your filters. Add a new task or update filters!
          </div>
        )}
      </div>

      {/* Task Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-inverse-surface rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve math lab report"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder="e.g. Math"
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Deadline</label>
                <input
                  type="date"
                  required
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:scale-95 transition-transform"
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
