import { useState, useEffect, useRef, useCallback } from 'react';
import { useStudy } from '../context/useStudy';

export default function Pomodoro() {
  const { pomodoro, addPomodoroSession, activeFocusTask, setActiveFocusTask } = useStudy();

  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [duration, setDuration] = useState(() => {
    if (activeFocusTask?.durationMinutes) {
      return activeFocusTask.durationMinutes * 60;
    }
    return 25 * 60;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    if (activeFocusTask?.durationMinutes) {
      return activeFocusTask.durationMinutes * 60;
    }
    return 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [sessionName, setSessionName] = useState(() => activeFocusTask?.title || 'Academic Focus Sprint');
  const [sessionSubject, setSessionSubject] = useState(() => activeFocusTask?.subject || 'General');
  const [showNotification, setShowNotification] = useState(false);

  // Custom durations presets (in minutes)
  const [focusLength, setFocusLength] = useState(25);
  const shortBreakLength = 5;
  const longBreakLength = 15;

  const timerRef = useRef(null);

  // Sync if activeFocusTask changes
  useEffect(() => {
    if (activeFocusTask) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionName(activeFocusTask.title);
      setSessionSubject(activeFocusTask.subject || 'General');
      if (activeFocusTask.durationMinutes) {
        setFocusLength(activeFocusTask.durationMinutes);
        if (mode === 'focus' && !isRunning) {
          setDuration(activeFocusTask.durationMinutes * 60);
          setTimeLeft(activeFocusTask.durationMinutes * 60);
        }
      }
    }
  }, [activeFocusTask, mode, isRunning]);

  // Audio tone feedback
  const playAlertSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio optional
    }
  }, []);

  const handleSessionComplete = useCallback(() => {
    playAlertSound();
    if (mode === 'focus') {
      const minutesStudied = Math.round(duration / 60);
      addPomodoroSession(minutesStudied);
      setShowNotification(true);
      setMode('shortBreak');
      const nextDuration = shortBreakLength * 60;
      setDuration(nextDuration);
      setTimeLeft(nextDuration);
    } else {
      setMode('focus');
      const nextDuration = focusLength * 60;
      setDuration(nextDuration);
      setTimeLeft(nextDuration);
    }
  }, [addPomodoroSession, duration, mode, playAlertSound, shortBreakLength, focusLength]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, handleSessionComplete]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    let target = focusLength * 60;
    if (newMode === 'shortBreak') target = shortBreakLength * 60;
    if (newMode === 'longBreak') target = longBreakLength * 60;
    setDuration(target);
    setTimeLeft(target);
  };

  const handleSelectPreset = (mins) => {
    setIsRunning(false);
    setFocusLength(mins);
    if (mode === 'focus') {
      setDuration(mins * 60);
      setTimeLeft(mins * 60);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const strokeDashoffset = duration > 0 ? ((duration - timeLeft) / duration) * 283 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-edge">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-xs">timer</span>
            <span>Focus Timer</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Pomodoro</h1>
          <p className="text-xs text-content-sub">Work in dedicated focus sprints with structured rest intervals.</p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-xl border border-edge self-start sm:self-auto">
          {[15, 25, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectPreset(mins)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                focusLength === mins && mode === 'focus'
                  ? 'bg-purple text-white shadow-2xs font-semibold'
                  : 'text-content-sub hover:text-content'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Completion Toast Notification */}
      {showNotification && (
        <div className="p-4 rounded-xl bg-success-soft border border-success/30 text-success flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Focus session completed! XP rewarded and rest interval started.</span>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-xs hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Circular Timer */}
        <div className="lg:col-span-8 bg-card border border-edge rounded-2xl p-6 md:p-10 shadow-xs flex flex-col items-center justify-center transition-colors">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-surface-alt p-1 rounded-xl border border-edge mb-8">
            <button
              onClick={() => switchMode('focus')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                mode === 'focus' ? 'bg-purple text-white shadow-2xs font-semibold' : 'text-content-sub hover:text-content'
              }`}
            >
              Focus Sprint
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                mode === 'shortBreak' ? 'bg-purple text-white shadow-2xs font-semibold' : 'text-content-sub hover:text-content'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                mode === 'longBreak' ? 'bg-purple text-white shadow-2xs font-semibold' : 'text-content-sub hover:text-content'
              }`}
            >
              Long Break
            </button>
          </div>

          {/* SVG Circular Progress Timer */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-surface-alt"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Animated progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-purple transition-all duration-300"
                strokeWidth="4"
                strokeDasharray="283"
                strokeDashoffset={283 - strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner countdown text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-heading text-5xl md:text-6xl font-bold text-content tracking-tight tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-medium text-content-dim mt-1">
                {mode === 'focus' ? 'Deep Work' : 'Recharge Break'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-3">
            <button 
              onClick={resetTimer}
              className="w-10 h-10 rounded-xl border border-edge bg-surface-alt hover:bg-lavender dark:hover:bg-purple/20 text-content-sub hover:text-purple flex items-center justify-center transition-colors cursor-pointer"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>

            {isRunning ? (
              <button 
                onClick={pauseTimer}
                className="px-6 py-2.5 rounded-xl bg-purple hover:bg-purple-hover text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">pause</span>
                <span>Pause</span>
              </button>
            ) : (
              <button 
                onClick={startTimer}
                className="px-6 py-2.5 rounded-xl bg-purple hover:bg-purple-hover text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Start Session</span>
              </button>
            )}

            <button 
              onClick={handleSessionComplete}
              className="w-10 h-10 rounded-xl border border-edge bg-surface-alt hover:bg-lavender dark:hover:bg-purple/20 text-content-sub hover:text-purple flex items-center justify-center transition-colors cursor-pointer"
              title="Complete Session"
              aria-label="Next Session"
            >
              <span className="material-symbols-outlined text-lg">skip_next</span>
            </button>
          </div>
        </div>

        {/* Right Column: Objective & Stats */}
        <div className="lg:col-span-4 space-y-5">
          {/* Objective Card */}
          <div className="bg-card border border-edge p-5 rounded-2xl shadow-xs space-y-3.5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple text-lg">track_changes</span>
                <h2 className="font-heading text-sm font-bold text-content">Active Objective</h2>
              </div>
              {activeFocusTask && (
                <button
                  onClick={() => {
                    setActiveFocusTask(null);
                    setSessionName('Academic Focus Sprint');
                    setSessionSubject('General');
                  }}
                  className="text-[11px] text-danger hover:underline cursor-pointer"
                >
                  Clear Task
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-content-sub mb-1">Topic or Problem Set</label>
              <input 
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full bg-surface-alt border border-edge rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:border-purple text-content placeholder:text-content-dim"
                placeholder="What are you focusing on?"
              />
            </div>

            <div className="p-3 rounded-xl bg-surface-alt border border-edge flex items-center justify-between text-xs">
              <span className="text-content-sub">Subject / Target:</span>
              <span className="font-semibold text-purple">{sessionSubject} • {Math.round(duration / 60)}m</span>
            </div>
          </div>

          {/* Productivity Stats Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-edge p-4.5 rounded-2xl shadow-xs text-center transition-colors">
              <p className="text-xs font-medium text-content-sub mb-1">Today's Focus</p>
              <p className="font-heading text-2xl font-bold text-content">
                {(pomodoro.todayMinutes / 60).toFixed(1)} <span className="text-xs font-normal text-content-sub">hrs</span>
              </p>
              <p className="text-[10px] text-content-dim mt-0.5">Logged today</p>
            </div>
            <div className="bg-card border border-edge p-4.5 rounded-2xl shadow-xs text-center transition-colors">
              <p className="text-xs font-medium text-content-sub mb-1">Sessions</p>
              <p className="font-heading text-2xl font-bold text-content">
                {pomodoro.sessionsCompleted}
              </p>
              <p className="text-[10px] text-content-dim mt-0.5">Finished today</p>
            </div>
          </div>

          {/* Principle Card */}
          <div className="bg-lavender/40 dark:bg-card border border-purple/20 p-4 rounded-2xl shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple text-base">lightbulb</span>
              <span className="text-xs font-semibold text-purple">Focus Science</span>
            </div>
            <p className="text-xs text-content-sub leading-relaxed">
              Screen-free 5-minute pauses between 25-minute sprints restore working memory and prevent cognitive fatigue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
