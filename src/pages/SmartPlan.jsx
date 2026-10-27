import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import Logo from '../components/Logo';

export default function SmartPlan() {
  const { tasks, addTask, setActiveFocusTask } = useStudy();
  const navigate = useNavigate();

  // Inputs
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [energyLevel, setEnergyLevel] = useState('medium'); // 'high', 'medium', 'low'
  const [selectedTaskIds, setSelectedTaskIds] = useState(() => 
    tasks.filter(t => !t.completed).map(t => t.id)
  );
  const [customTopic, setCustomTopic] = useState('');
  const [customSubject, setCustomSubject] = useState('General');
  const [customEstDuration, setCustomEstDuration] = useState(25);
  const [customPriority, setCustomPriority] = useState('high');

  // Generated Plan state
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active uncompleted tasks
  const uncompletedTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);

  const toggleSelectTask = (id) => {
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    const newTask = addTask(customTopic.trim(), customPriority, customSubject, null, customEstDuration);
    setSelectedTaskIds(prev => [...prev, newTask.id]);
    setCustomTopic('');
  };

  // Deterministic, realistic prioritization algorithm
  const generatePlan = (targetMinutes = availableMinutes) => {
    setIsGenerating(true);

    setTimeout(() => {
      // 1. Gather selected tasks
      const pool = tasks.filter(t => selectedTaskIds.includes(t.id) && !t.completed);

      // 2. Score tasks
      const scored = pool.map(task => {
        let score = 0;

        // Priority weighting
        if (task.priority === 'high') score += 50;
        else if (task.priority === 'medium') score += 30;
        else score += 10;

        // Deadline urgency
        if (task.deadline) {
          const daysAway = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          if (daysAway <= 0) score += 40; // Due today or overdue
          else if (daysAway === 1) score += 30; // Due tomorrow
          else if (daysAway <= 3) score += 18;
          else score += 5;
        }

        // Energy-level tuning
        if (energyLevel === 'high') {
          if (task.priority === 'high') score += 15;
        } else if (energyLevel === 'low') {
          // Low energy favors shorter, bite-sized tasks
          const est = task.estimatedDuration || 25;
          if (est <= 20) score += 20;
          else if (est <= 30) score += 10;
        }

        return { ...task, score };
      });

      // Sort descending by calculated score
      scored.sort((a, b) => b.score - a.score);

      // 3. Allocate items to fit within targetMinutes
      let remaining = targetMinutes;
      const scheduledBlocks = [];
      let blockIndex = 1;

      for (const item of scored) {
        if (remaining <= 5) break;

        const defaultDuration = item.estimatedDuration || (energyLevel === 'low' ? 20 : 25);
        // Can fit full block or remaining slice
        const blockDuration = Math.min(defaultDuration, remaining);

        let rationale = '';
        if (item.priority === 'high') rationale = 'High academic priority with fast-approaching milestone.';
        else if (item.deadline && new Date(item.deadline) <= new Date(Date.now() + 86400000)) {
          rationale = 'Urgent upcoming deadline requiring immediate review.';
        } else if (energyLevel === 'low' && blockDuration <= 20) {
          rationale = 'Low energy sweet spot: small focused sprint to build momentum.';
        } else {
          rationale = 'Strategic balanced study block for consistent retention.';
        }

        scheduledBlocks.push({
          id: `block-${blockIndex++}`,
          taskId: item.id,
          title: item.title,
          subject: item.subject || 'General',
          priority: item.priority,
          duration: blockDuration,
          rationale,
          type: 'study'
        });

        remaining -= blockDuration;

        // Automatically inject short rest break if more study time remains
        if (remaining >= 15 && targetMinutes >= 45) {
          const breakTime = 5;
          scheduledBlocks.push({
            id: `break-${blockIndex++}`,
            title: 'Mindful Recharge Break',
            subject: 'Rest & Hydration',
            priority: 'low',
            duration: breakTime,
            rationale: 'Evidence-based cognitive reset: hydrate and look away from screen.',
            type: 'break'
          });
          remaining -= breakTime;
        }
      }

      setPlan({
        totalAllocated: targetMinutes - remaining,
        requestedMinutes: targetMinutes,
        energyLevel,
        blocks: scheduledBlocks,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setIsGenerating(false);
    }, 280);
  };

  const handleStartFocus = (block) => {
    setActiveFocusTask({
      id: block.taskId,
      title: block.title,
      subject: block.subject,
      durationMinutes: block.duration
    });
    navigate('/pomodoro');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Intelligent Schedule Builder
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center p-1 shadow-sm shrink-0">
              <Logo className="w-full h-full" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
              StudySync Smart Plan
            </h2>
          </div>
          <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0] mt-1">
            Turn limited available time into an achievable, science-backed study schedule.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#4b4863] dark:text-[#bbb8d0]">Quick Plan:</span>
          {[25, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setAvailableMinutes(mins);
                generatePlan(mins);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                availableMinutes === mins
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-[#3b3852] dark:text-white hover:bg-surface-container-high'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Prominent Quick-Planning Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-primary-fixed/80 via-primary-fixed-dim/60 to-surface-container border border-primary/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">hourglass_top</span>
            "I have 30 minutes. What should I study?"
          </h3>
          <p className="text-xs text-[#3b3852] dark:text-[#1b1b24] font-medium max-w-xl">
            Instantly isolates your highest-priority urgent task, cuts out indecision, and sets a 30-minute focused sprint.
          </p>
        </div>
        <button
          onClick={() => {
            setAvailableMinutes(30);
            generatePlan(30);
          }}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          Generate 30m Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Task Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Study Parameters Card */}
          <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#1b1b24] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">tune</span>
              Plan Parameters
            </h3>

            {/* Time Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0]">
                  Available Study Time
                </label>
                <span className="text-xs font-extrabold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                  {availableMinutes} minutes
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="5"
                value={availableMinutes}
                onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5e5b79] dark:text-[#9e9bb8] mt-1 font-semibold">
                <span>15 min</span>
                <span>60 min</span>
                <span>120 min</span>
                <span>180 min</span>
              </div>
            </div>

            {/* Energy Level Selector */}
            <div>
              <label className="block text-xs font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-2">
                Current Energy & Focus Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'high', label: 'High Energy', icon: 'bolt', desc: 'Deep hard topics' },
                  { id: 'medium', label: 'Balanced', icon: 'psychology', desc: 'Standard flow' },
                  { id: 'low', label: 'Fatigued', icon: 'battery_low', desc: 'Bite-sized sprints' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setEnergyLevel(lvl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      energyLevel === lvl.id
                        ? 'border-primary bg-primary-fixed/40 dark:bg-primary/20 text-primary dark:text-white font-bold ring-2 ring-primary/20'
                        : 'border-outline-variant/30 bg-surface-container-low text-[#4b4863] dark:text-[#b4b1ca] hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-base">{lvl.icon}</span>
                      <span className="text-xs">{lvl.label}</span>
                    </div>
                    <p className="text-[10px] opacity-75 font-normal leading-tight">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={() => generatePlan(availableMinutes)}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">
                {isGenerating ? 'sync' : 'auto_awesome'}
              </span>
              {isGenerating ? 'Computing Optimal Schedule...' : 'Build My Study Plan'}
            </button>
          </div>

          {/* Task Pool Selection */}
          <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">
                  Available Topics & Tasks
                </h3>
                <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">
                  {selectedTaskIds.length} of {uncompletedTasks.length} included
                </p>
              </div>
              <button
                onClick={() => {
                  if (selectedTaskIds.length === uncompletedTasks.length) {
                    setSelectedTaskIds([]);
                  } else {
                    setSelectedTaskIds(uncompletedTasks.map(t => t.id));
                  }
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                {selectedTaskIds.length === uncompletedTasks.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* List of active tasks */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {uncompletedTasks.map(task => {
                const isChecked = selectedTaskIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleSelectTask(task.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-primary/40 bg-primary-fixed/20 dark:bg-primary/10'
                        : 'border-outline-variant/25 bg-surface-container-low opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-primary w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1b1b24] dark:text-white truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#4b4863] dark:text-[#bbb8d0] font-semibold">{task.subject}</span>
                        <span className="text-[10px] font-bold text-primary">{task.estimatedDuration || 25}m</span>
                        {task.priority === 'high' && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-error/15 text-error">High</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Custom Study Topic Form */}
            <form onSubmit={handleAddCustomTopic} className="pt-3 border-t border-outline-variant/20 space-y-2">
              <span className="text-[11px] font-bold text-[#3b3852] dark:text-[#bbb8d0]">Add New Study Topic</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Organic Chemistry ch. 4"
                  className="flex-1 text-xs bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 outline-none focus:border-primary text-[#1b1b24] dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Generated Smart Schedule */}
        <div className="lg:col-span-7">
          {plan ? (
            <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6 motion-page">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/25">
                <div>
                  <h3 className="text-lg font-bold text-[#1b1b24] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">event_available</span>
                    Your Tailored Plan
                  </h3>
                  <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">
                    Generated at {plan.generatedAt} • {plan.totalAllocated}m of {plan.requestedMinutes}m allocated
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generatePlan(plan.requestedMinutes)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Scheduled Blocks */}
              <div className="space-y-4">
                {plan.blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`p-4 rounded-xl border transition-all ${
                      block.type === 'break'
                        ? 'border-dashed border-tertiary/40 bg-tertiary-fixed/15 dark:bg-tertiary/10'
                        : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          block.type === 'break' 
                            ? 'bg-tertiary text-white' 
                            : 'bg-primary text-white shadow-sm'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#1b1b24] dark:text-white">
                              {block.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-primary">
                              {block.duration} min
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#5e5b79] dark:text-[#a5a2bf] mt-0.5">
                            {block.subject}
                          </p>
                          <p className="text-xs text-[#3b3852] dark:text-[#bbb8d0] mt-1.5 bg-white/60 dark:bg-surface-container/60 p-2 rounded-lg border border-outline-variant/15">
                            💡 <span className="font-medium">{block.rationale}</span>
                          </p>
                        </div>
                      </div>

                      {block.type === 'study' && (
                        <button
                          onClick={() => handleStartFocus(block)}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-sm hover:scale-95 transition-all"
                          title="Load this task into Pomodoro"
                        >
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                          Study Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Summary Stats */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-semibold text-[#5e5b79] dark:text-[#a5a2bf]">Total Focus Time: </span>
                  <span className="font-extrabold text-primary">
                    {plan.blocks.filter(b => b.type === 'study').reduce((a, b) => a + b.duration, 0)} minutes
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#5e5b79] dark:text-[#a5a2bf]">Recharge Breaks: </span>
                  <span className="font-extrabold text-tertiary">
                    {plan.blocks.filter(b => b.type === 'break').reduce((a, b) => a + b.duration, 0)} minutes
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#5e5b79] dark:text-[#a5a2bf]">Tasks Scheduled: </span>
                  <span className="font-extrabold text-[#1b1b24] dark:text-white">
                    {plan.blocks.filter(b => b.type === 'study').length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-surface-container p-10 rounded-2xl border border-outline-variant/30 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">psychology_alt</span>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-[#1b1b24] dark:text-white">
                  No Active Study Plan Yet
                </h3>
                <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">
                  Choose your available time and energy on the left, then click <b>"Build My Study Plan"</b> to generate an optimized roadmap.
                </p>
              </div>
              <button
                onClick={() => generatePlan(availableMinutes)}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
              >
                Generate Plan Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
