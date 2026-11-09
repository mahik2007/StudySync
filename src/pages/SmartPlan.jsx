import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

export default function SmartPlan() {
  const { tasks, addTask, setActiveFocusTask } = useStudy();
  const navigate = useNavigate();

  // Inputs
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [energyLevel, setEnergyLevel] = useState('medium'); // 'high', 'medium', 'low'
  const [selectedTaskIds, setSelectedTaskIds] = useState(() => 
    tasks.filter((t) => !t.completed).map((t) => t.id)
  );
  const [customTopic, setCustomTopic] = useState('');
  const customSubject = 'General';
  const customEstDuration = 25;
  const customPriority = 'high';

  // Generated Plan state
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active uncompleted tasks
  const uncompletedTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  const toggleSelectTask = (id) => {
    setSelectedTaskIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    const newTask = addTask(customTopic.trim(), customPriority, customSubject, null, customEstDuration);
    setSelectedTaskIds((prev) => [...prev, newTask.id]);
    setCustomTopic('');
  };

  // Deterministic prioritization algorithm
  const generatePlan = (targetMinutes = availableMinutes) => {
    setIsGenerating(true);

    setTimeout(() => {
      const pool = tasks.filter((t) => selectedTaskIds.includes(t.id) && !t.completed);

      const scored = pool.map((task) => {
        let score = 0;

        // Priority weighting
        if (task.priority === 'high') score += 50;
        else if (task.priority === 'medium') score += 30;
        else score += 10;

        // Deadline urgency
        if (task.deadline) {
          const daysAway = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          if (daysAway <= 0) score += 40;
          else if (daysAway === 1) score += 30;
          else if (daysAway <= 3) score += 18;
          else score += 5;
        }

        // Energy-level tuning
        if (energyLevel === 'high') {
          if (task.priority === 'high') score += 15;
        } else if (energyLevel === 'low') {
          const est = task.estimatedDuration || 25;
          if (est <= 20) score += 20;
          else if (est <= 30) score += 10;
        }

        return { ...task, score };
      });

      scored.sort((a, b) => b.score - a.score);

      let remaining = targetMinutes;
      const scheduledBlocks = [];
      let blockIndex = 1;

      for (const item of scored) {
        if (remaining <= 5) break;

        const defaultDuration = item.estimatedDuration || (energyLevel === 'low' ? 20 : 25);
        const blockDuration = Math.min(defaultDuration, remaining);

        const rationale = item.priority === 'high'
          ? 'High academic priority with near-term delivery target.'
          : (item.deadline && new Date(item.deadline) <= new Date(Date.now() + 86400000))
          ? 'Urgent deadline approaching; immediate review advised.'
          : (energyLevel === 'low' && blockDuration <= 20)
          ? 'Short sprint designed to preserve cognitive energy during fatigue.'
          : 'Balanced subject rotation to maintain learning retention.';

        scheduledBlocks.push({
          id: `block-${blockIndex++}`,
          type: 'study',
          taskId: item.id,
          title: item.title,
          subject: item.subject || 'General',
          duration: blockDuration,
          rationale
        });

        remaining -= blockDuration;

        // Add 5-min recharge break if at least 15 min remain
        if (remaining >= 15) {
          scheduledBlocks.push({
            id: `block-${blockIndex++}`,
            type: 'break',
            title: 'Active Recharge Break',
            subject: 'Rest & Hydration',
            duration: 5,
            rationale: '5-minute screen-free break restores focus for your next sprint.'
          });
          remaining -= 5;
        }
      }

      setPlan({
        requestedMinutes: targetMinutes,
        totalAllocated: targetMinutes - remaining,
        blocks: scheduledBlocks,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setIsGenerating(false);
    }, 250);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-edge">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            <span>Intelligent Timetable</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Smart Plan</h1>
          <p className="text-xs text-content-sub">Generate a structured session plan tailored to your available time and energy.</p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-xl border border-edge self-start sm:self-auto">
          {[25, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setAvailableMinutes(mins);
                generatePlan(mins);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                availableMinutes === mins
                  ? 'bg-purple text-white shadow-2xs font-semibold'
                  : 'text-content-sub hover:text-content'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* 30-Minute Quick Action Banner */}
      <div className="p-5 rounded-2xl bg-card border border-edge shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <h2 className="font-heading text-sm font-bold text-content flex items-center gap-2">
            <span className="material-symbols-outlined text-purple text-base">hourglass_top</span>
            "I have 30 minutes. What should I study?"
          </h2>
          <p className="text-xs text-content-sub max-w-xl">
            Calculates your highest-urgency task and sets an immediate 30-minute focused interval.
          </p>
        </div>
        <button
          onClick={() => {
            setAvailableMinutes(30);
            generatePlan(30);
          }}
          className="px-4 py-2 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] shrink-0 cursor-pointer"
        >
          Generate 30m Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Controls Card */}
          <div className="bg-card p-5 rounded-2xl border border-edge shadow-xs space-y-4.5 transition-colors">
            <h2 className="font-heading text-sm font-bold text-content flex items-center gap-2">
              <span className="material-symbols-outlined text-purple text-base">tune</span>
              Plan Parameters
            </h2>

            {/* Time Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-content-sub">Available Study Time</label>
                <span className="text-xs font-semibold text-purple bg-lavender dark:bg-purple/20 px-2.5 py-0.5 rounded-full">
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
                className="w-full accent-purple cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-content-dim mt-1 font-medium">
                <span>15m</span>
                <span>60m</span>
                <span>120m</span>
                <span>180m</span>
              </div>
            </div>

            {/* Energy Level Selector */}
            <div>
              <label className="block text-xs font-medium text-content-sub mb-2">Current Focus & Energy</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'high', label: 'High', icon: 'bolt', desc: 'Complex topics' },
                  { id: 'medium', label: 'Balanced', icon: 'psychology', desc: 'Steady focus' },
                  { id: 'low', label: 'Fatigued', icon: 'battery_low', desc: 'Shorter blocks' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setEnergyLevel(lvl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      energyLevel === lvl.id
                        ? 'border-purple bg-lavender/60 dark:bg-purple/20 text-purple dark:text-violet font-semibold ring-1 ring-purple/30'
                        : 'border-edge bg-surface-alt text-content-sub hover:text-content hover:border-purple/30'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="material-symbols-outlined text-base">{lvl.icon}</span>
                      <span className="text-xs">{lvl.label}</span>
                    </div>
                    <p className="text-[10px] text-content-dim font-normal">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action */}
            <button
              onClick={() => generatePlan(availableMinutes)}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-purple hover:bg-purple-hover text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span className={`material-symbols-outlined text-base ${isGenerating ? 'animate-spin' : ''}`}>
                {isGenerating ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isGenerating ? 'Computing Schedule...' : 'Build Study Plan'}</span>
            </button>
          </div>

          {/* Task Pool Selection */}
          <div className="bg-card p-5 rounded-2xl border border-edge shadow-xs space-y-3.5 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-heading text-sm font-bold text-content">Task Pool</h2>
                <p className="text-[11px] text-content-dim">
                  {selectedTaskIds.length} of {uncompletedTasks.length} included in optimization
                </p>
              </div>
              <button
                onClick={() => {
                  if (selectedTaskIds.length === uncompletedTasks.length) {
                    setSelectedTaskIds([]);
                  } else {
                    setSelectedTaskIds(uncompletedTasks.map((t) => t.id));
                  }
                }}
                className="text-xs text-purple font-semibold hover:underline cursor-pointer"
              >
                {selectedTaskIds.length === uncompletedTasks.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {uncompletedTasks.map((task) => {
                const isChecked = selectedTaskIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleSelectTask(task.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-purple/30 bg-lavender/40 dark:bg-purple/15 text-content'
                        : 'border-edge bg-surface-alt opacity-60 text-content-sub'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-purple w-3.5 h-3.5 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-content-dim">
                        <span>{task.subject}</span>
                        <span>•</span>
                        <span>{task.estimatedDuration || 25}m</span>
                        {task.priority === 'high' && (
                          <span className="font-semibold text-danger">High priority</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom study item */}
            <form onSubmit={handleAddCustomTopic} className="pt-2.5 border-t border-edge space-y-2">
              <span className="text-xs font-medium text-content-sub">Add Quick Topic to Plan</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Organic Chemistry Review"
                  className="flex-1 text-xs bg-surface-alt border border-edge rounded-xl px-3 py-1.5 outline-none focus:border-purple text-content placeholder:text-content-dim"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple hover:bg-purple-hover text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Generated Plan */}
        <div className="lg:col-span-7">
          {plan ? (
            <div className="bg-card p-5 md:p-6 rounded-2xl border border-edge shadow-xs space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-edge">
                <div>
                  <h2 className="font-heading text-base font-bold text-content flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple text-lg">event_available</span>
                    Generated Timetable
                  </h2>
                  <p className="text-xs text-content-dim">
                    Built at {plan.generatedAt} • {plan.totalAllocated}m of {plan.requestedMinutes}m allocated
                  </p>
                </div>

                <button
                  onClick={() => generatePlan(plan.requestedMinutes)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-purple hover:bg-lavender dark:hover:bg-purple/20 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Scheduled Blocks */}
              <div className="space-y-3">
                {plan.blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      block.type === 'break'
                        ? 'border-dashed border-edge bg-surface-alt/60'
                        : 'border-edge bg-card hover:border-purple/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          block.type === 'break' 
                            ? 'bg-surface-alt text-content-sub' 
                            : 'bg-lavender dark:bg-purple/20 text-purple'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-content">{block.title}</h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-alt text-purple">
                              {block.duration}m
                            </span>
                          </div>
                          <p className="text-[11px] text-content-dim mt-0.5">{block.subject}</p>
                          <p className="text-[11px] text-content-sub mt-1 bg-surface-alt/70 p-2 rounded-lg border border-edge/60 leading-relaxed">
                            {block.rationale}
                          </p>
                        </div>
                      </div>

                      {block.type === 'study' && (
                        <button
                          onClick={() => handleStartFocus(block)}
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-purple hover:bg-purple-hover text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                          title="Load this task into Pomodoro"
                        >
                          <span className="material-symbols-outlined text-xs">play_arrow</span>
                          <span>Focus</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Summary */}
              <div className="p-3.5 rounded-xl bg-surface-alt border border-edge flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-content-sub">Focus Time: </span>
                  <span className="font-semibold text-purple">
                    {plan.blocks.filter((b) => b.type === 'study').reduce((a, b) => a + b.duration, 0)}m
                  </span>
                </div>
                <div>
                  <span className="text-content-sub">Recharge Breaks: </span>
                  <span className="font-semibold text-warning">
                    {plan.blocks.filter((b) => b.type === 'break').reduce((a, b) => a + b.duration, 0)}m
                  </span>
                </div>
                <div>
                  <span className="text-content-sub">Tasks Scheduled: </span>
                  <span className="font-semibold text-content">
                    {plan.blocks.filter((b) => b.type === 'study').length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card p-10 rounded-2xl border border-edge shadow-xs text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-lavender dark:bg-purple/20 text-purple flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">psychology_alt</span>
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h2 className="font-heading text-sm font-bold text-content">No Active Study Plan Yet</h2>
                <p className="text-xs text-content-sub">
                  Adjust your parameters on the left and click "Build Study Plan" to compute your schedule.
                </p>
              </div>
              <button
                onClick={() => generatePlan(availableMinutes)}
                className="px-4 py-2 bg-purple hover:bg-purple-hover text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
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
