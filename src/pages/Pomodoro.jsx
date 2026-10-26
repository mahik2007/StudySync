import { useState, useEffect, useRef, useCallback } from 'react';
import { useStudy } from '../context/useStudy';

export default function Pomodoro() {
  const { pomodoro, addPomodoroSession } = useStudy();

  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [duration, setDuration] = useState(25 * 60); // in seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionName, setSessionName] = useState('Deep Work: Psychology Thesis');
  const [showNotification, setShowNotification] = useState(false);

  const timerRef = useRef(null);

  // Sound generator using Web Audio API
  const playAlertSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(520, audioCtx.currentTime); // C5 note
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Sound is an enhancement; timers continue if a browser blocks Web Audio.
    }
  }, []);

  const handleSessionComplete = useCallback(() => {
    playAlertSound();
    if (mode === 'focus') {
      const minutesStudied = Math.round(duration / 60);
      addPomodoroSession(minutesStudied);
      setShowNotification(true);
      setMode('break');
      setDuration(5 * 60);
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setDuration(25 * 60);
      setTimeLeft(25 * 60);
    }
  }, [addPomodoroSession, duration, mode, playAlertSound]);

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
    if (mode === 'focus') {
      setTimeLeft(25 * 60);
      setDuration(25 * 60);
    } else {
      setTimeLeft(5 * 60);
      setDuration(5 * 60);
    }
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'focus') {
      setTimeLeft(25 * 60);
      setDuration(25 * 60);
    } else {
      setTimeLeft(5 * 60);
      setDuration(5 * 60);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Radial SVG logic
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Focus Mode</h2>
          <p className="text-sm text-on-surface-variant">Elevate your academic productivity through precision timing.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary">Deep Work Mode</span>
            <div className="flex items-center gap-1 text-tertiary">
              <span className={`w-2 h-2 rounded-full bg-tertiary ${isRunning ? 'animate-pulse' : ''}`}></span>
              <span className="text-xs">{isRunning ? 'Active Now' : 'Paused'}</span>
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="p-4 bg-tertiary/10 border border-tertiary/20 text-tertiary rounded-2xl flex items-center justify-between">
          <span className="text-xs font-semibold">Focus Session logged successfully! You gained +40 XP.</span>
          <button onClick={() => setShowNotification(false)} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Timer Circle (Glassmorphism) */}
        <div className="md:col-span-8 flex flex-col items-center justify-center p-8 md:p-12 rounded-[40px] bg-white/40 dark:bg-inverse-surface/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-tertiary/60 rounded-r-full blur-sm"></div>
          
          {/* Mode Switcher Presets */}
          <div className="flex gap-2 mb-6 bg-surface-container p-1 rounded-xl">
            <button 
              onClick={() => switchMode('focus')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'focus' ? 'bg-primary text-white shadow' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Focus (25m)
            </button>
            <button 
              onClick={() => switchMode('break')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'break' ? 'bg-primary text-white shadow' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Short Break (5m)
            </button>
          </div>

          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Progress Ring */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r={radius} stroke="currentColor" strokeWidth="5"></circle>
              <circle 
                className="text-primary transition-all duration-300 ease-linear" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r={radius} 
                stroke="currentColor" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                strokeWidth="5" 
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              ></circle>
            </svg>
            {/* Center Content */}
            <div className="z-10 text-center">
              <h3 className="text-6xl md:text-7xl font-bold text-primary tracking-tighter leading-none" id="timer-display">
                {formatTime(timeLeft)}
              </h3>
              <p className="text-[10px] font-bold text-on-surface-variant tracking-[0.2em] mt-2">
                {mode === 'focus' ? 'FOCUS TIME' : 'BREAK TIME'}
              </p>
            </div>
            <div className="absolute inset-0 rounded-full border-[10px] border-white/20 shadow-inner"></div>
          </div>

          {/* Timer Controls */}
          <div className="mt-8 flex items-center gap-4">
            <button 
              onClick={resetTimer}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center bg-white hover:bg-surface-container-high transition-all group"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">refresh</span>
            </button>
            
            {isRunning ? (
              <button 
                onClick={pauseTimer}
                className="px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">pause</span>
                Pause Session
              </button>
            ) : (
              <button 
                onClick={startTimer}
                className="px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined fill-current">play_arrow</span>
                Start Session
              </button>
            )}

            <button 
              onClick={handleSessionComplete}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center bg-white hover:bg-surface-container-high transition-all group"
              title="Skip Session"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">skip_next</span>
            </button>
          </div>
        </div>

        {/* Right Side Stats Panel */}
        <div className="md:col-span-4 space-y-6">
          {/* Current Session Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-inverse-surface border border-outline-variant/30 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-primary">CURRENT TASK</span>
            </div>
            <input 
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-2 text-sm font-bold outline-none mb-1 focus:border-primary"
              placeholder="What are you studying?"
            />
            <p className="text-xs text-on-surface-variant">Update the text field to match your current focus task.</p>
            <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <span className="text-xs text-tertiary font-bold">Focus Status: High</span>
              <span className="material-symbols-outlined text-tertiary text-lg">trending_up</span>
            </div>
          </div>

          {/* Progress Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-inverse-surface border border-outline-variant/30 shadow-sm text-center">
              <p className="text-[10px] font-bold text-on-surface-variant mb-2">TODAY'S STUDY</p>
              <p className="text-2xl font-bold text-primary">{(pomodoro.todayMinutes / 60).toFixed(1)}h</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-inverse-surface border border-outline-variant/30 shadow-sm text-center">
              <p className="text-[10px] font-bold text-on-surface-variant mb-2">COMPLETED</p>
              <p className="text-2xl font-bold text-primary">{pomodoro.sessionsCompleted}</p>
            </div>
          </div>

          {/* AI Smart Insight Glass Card */}
          <div className="p-6 rounded-3xl bg-tertiary-container/10 border-l-4 border-tertiary relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-emerald-700 text-sm">auto_awesome</span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">AI Focus Tip</span>
            </div>
            <p className="text-xs text-emerald-950 dark:text-emerald-300 leading-relaxed">
              You complete 20% more study goals when studying in morning focus periods. Try setting your alarm for a morning Pomodoro study flow tomorrow!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
