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
  const [sessionName, setSessionName] = useState(() => activeFocusTask?.title || 'Deep Work: Academic Focus');
  const [sessionSubject, setSessionSubject] = useState(() => activeFocusTask?.subject || 'General');
  const [showNotification, setShowNotification] = useState(false);

  // Custom durations presets (in minutes)
  const [focusLength, setFocusLength] = useState(25);
  const [shortBreakLength, setShortBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(15);

  const timerRef = useRef(null);

  // Sync if activeFocusTask changes
  useEffect(() => {
    if (activeFocusTask) {
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
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio is optional enhancement
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
  }, [handleSessionComplete, isRunning]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    let target = focusLength * 60;
    if (mode === 'shortBreak') target = shortBreakLength * 60;
    if (mode === 'longBreak') target = longBreakLength * 60;
    setTimeLeft(target);
    setDuration(target);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    let target = focusLength * 60;
    if (newMode === 'shortBreak') target = shortBreakLength * 60;
    if (newMode === 'longBreak') target = longBreakLength * 60;
    setTimeLeft(target);
    setDuration(target);
  };

  const setCustomMinutes = (mins) => {
    if (mins <= 0) return;
    setIsRunning(false);
    if (mode === 'focus') {
      setFocusLength(mins);
      setDuration(mins * 60);
      setTimeLeft(mins * 60);
    } else if (mode === 'shortBreak') {
      setShortBreakLength(mins);
      setDuration(mins * 60);
      setTimeLeft(mins * 60);
    } else {
      setLongBreakLength(mins);
      setDuration(mins * 60);
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Radial SVG calculation
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = duration > 0 ? (timeLeft / duration) : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">timelapse</span>
            Academic Flow State
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
            Focus Pomodoro Timer
          </h2>
          <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
            Elevate cognitive retention with science-backed focus intervals and structured breaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider font-extrabold text-primary">
              {mode === 'focus' ? 'Deep Work Cycle' : 'Restoration Phase'}
            </span>
            <div className="flex items-center gap-1.5 text-tertiary font-bold">
              <span className={`w-2.5 h-2.5 rounded-full bg-tertiary ${isRunning ? 'animate-ping' : ''}`}></span>
              <span className="text-xs">{isRunning ? 'Clock Running' : 'Session Standby'}</span>
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="p-4 bg-tertiary-fixed/30 border border-tertiary/30 text-tertiary rounded-2xl flex items-center justify-between shadow-sm motion-page">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">celebration</span>
            <span className="text-xs font-bold">Focus block completed and logged! You gained +40 XP.</span>
          </div>
          <button onClick={() => setShowNotification(false)} className="text-xs font-extrabold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Timer Display */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl bg-white dark:bg-surface-container border border-outline-variant/30 shadow-sm relative overflow-hidden">
          {/* Top Mode Selector Tabs */}
          <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/20">
            <button 
              onClick={() => switchMode('focus')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'focus' 
                  ? 'bg-primary text-white shadow-md shadow-primary/25' 
                  : 'text-[#3b3852] dark:text-[#bbb8d0] hover:bg-surface-container'
              }`}
            >
              Focus ({focusLength}m)
            </button>
            <button 
              onClick={() => switchMode('shortBreak')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'shortBreak' 
                  ? 'bg-primary text-white shadow-md shadow-primary/25' 
                  : 'text-[#3b3852] dark:text-[#bbb8d0] hover:bg-surface-container'
              }`}
            >
              Short Break ({shortBreakLength}m)
            </button>
            <button 
              onClick={() => switchMode('longBreak')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'longBreak' 
                  ? 'bg-primary text-white shadow-md shadow-primary/25' 
                  : 'text-[#3b3852] dark:text-[#bbb8d0] hover:bg-surface-container'
              }`}
            >
              Long Break ({longBreakLength}m)
            </button>
          </div>

          {/* Radial Countdown Circle */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-surface-container-high"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Indicator */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-primary transition-all duration-1000 ease-linear"
                strokeWidth="5.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Time Digital Overlay */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl md:text-6xl font-extrabold tracking-tighter text-[#1b1b24] dark:text-white tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mt-2">
                {mode === 'focus' ? 'Concentration Sprint' : 'Rest & Breathe'}
              </span>
              <span className="text-[11px] font-semibold text-[#5e5b79] dark:text-[#a5a2bf] max-w-[200px] truncate mt-1">
                {sessionName}
              </span>
            </div>
          </div>

          {/* Quick Duration Adjuster Buttons */}
          <div className="flex items-center gap-2 mt-6">
            <span className="text-[11px] font-bold text-[#5e5b79] dark:text-[#a5a2bf]">Quick Duration:</span>
            {[15, 25, 30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setCustomMinutes(mins)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${
                  (mode === 'focus' && focusLength === mins) || (mode === 'shortBreak' && shortBreakLength === mins)
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-outline-variant/30 text-[#3b3852] dark:text-[#c4c1dc] hover:border-primary'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Primary Timer Controls */}
          <div className="mt-8 flex items-center gap-4">
            <button 
              onClick={resetTimer}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-all text-[#3b3852] dark:text-white"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <span className="material-symbols-outlined text-xl">restart_alt</span>
            </button>
            
            {isRunning ? (
              <button 
                onClick={pauseTimer}
                className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">pause</span>
                Pause Session
              </button>
            ) : (
              <button 
                onClick={startTimer}
                className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined fill-current">play_arrow</span>
                Start Focus Session
              </button>
            )}

            <button 
              onClick={handleSessionComplete}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-all text-[#3b3852] dark:text-white"
              title="Fast Complete Session"
              aria-label="Skip to Next Cycle"
            >
              <span className="material-symbols-outlined text-xl">skip_next</span>
            </button>
          </div>
        </div>

        {/* Right Side Stats & Target Session Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Current Task & Objective Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-surface-container border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">track_changes</span>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-primary">
                    Session Objective
                  </h3>
                  <span className="text-[10px] font-bold text-[#5e5b79] dark:text-[#a5a2bf]">
                    Subject: {sessionSubject}
                  </span>
                </div>
              </div>
              {activeFocusTask && (
                <button
                  onClick={() => {
                    setActiveFocusTask(null);
                    setSessionName('Deep Work: Academic Focus');
                    setSessionSubject('General');
                  }}
                  className="text-[10px] text-error font-bold hover:underline"
                >
                  Clear Task
                </button>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3b3852] dark:text-[#bbb8d0] mb-1">
                Active Topic / Problem Set
              </label>
              <input 
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none focus:border-primary text-[#1b1b24] dark:text-white"
                placeholder="What are you working on right now?"
              />
            </div>

            <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">Interval Target:</span>
              <span className="font-extrabold text-[#1b1b24] dark:text-white">{Math.round(duration / 60)} minutes</span>
            </div>
          </div>

          {/* Daily Productivity Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-surface-container border border-outline-variant/30 shadow-sm text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5e5b79] dark:text-[#a5a2bf] mb-1">
                Today's Focus
              </p>
              <p className="text-3xl font-extrabold text-primary">
                {(pomodoro.todayMinutes / 60).toFixed(1)}<span className="text-sm font-semibold">h</span>
              </p>
              <p className="text-[10px] text-[#5e5b79] dark:text-[#a5a2bf] font-medium mt-1">Logged today</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-surface-container border border-outline-variant/30 shadow-sm text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5e5b79] dark:text-[#a5a2bf] mb-1">
                Sessions
              </p>
              <p className="text-3xl font-extrabold text-primary">
                {pomodoro.sessionsCompleted}
              </p>
              <p className="text-[10px] text-[#5e5b79] dark:text-[#a5a2bf] font-medium mt-1">Total finished</p>
            </div>
          </div>

          {/* Evidence-Based Study Tip */}
          <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/25 relative overflow-hidden space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Productivity Science
              </span>
            </div>
            <p className="text-xs text-[#3b3852] dark:text-[#c4c1dc] leading-relaxed">
              Research demonstrates that taking deliberate, screen-free 5-minute pauses between 25-minute sprints improves factual retention by up to 28%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
