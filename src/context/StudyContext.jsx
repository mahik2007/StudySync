import { createContext, useState, useEffect } from 'react';

const StudyContext = createContext(null);
const isoDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};
const readStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const defaultBadges = [
  { id: 'first_pomodoro', title: 'Focus Pioneer', description: 'Complete your first Pomodoro session', icon: '⏱️', unlocked: false },
  { id: 'habit_starter', title: 'Consistency Core', description: 'Create and complete your first daily habit', icon: '🌱', unlocked: false },
  { id: 'goal_getter', title: 'Peak Achiever', description: 'Fully finish one major academic goal', icon: '🏆', unlocked: false },
  { id: 'streak_five', title: 'High Flier', description: 'Maintain a 5-day study streak', icon: '🔥', unlocked: false },
  { id: 'xp_champion', title: 'Grandmaster', description: 'Earn a total of 1000 XP', icon: '⚡', unlocked: false },
  { id: 'night_owl', title: 'Midnight Scholar', description: 'Complete a study session after 10 PM', icon: '🦉', unlocked: false },
];

export const StudyProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('studysync_theme') || 'light');
  const [user, setUser] = useState(() => readStorage('studysync_user', null));

  const [habits, setHabits] = useState(() =>
    readStorage('studysync_habits', [
      { id: '1', name: 'Read Research Papers', category: 'Study', streak: 4, completedDates: [isoDate(1), isoDate(2), isoDate(3), isoDate(4)], currentStreak: 4, maxStreak: 4 },
      { id: '2', name: 'Solve Math Problems', category: 'Practice', streak: 2, completedDates: [isoDate(1), isoDate(2)], currentStreak: 2, maxStreak: 3 },
      { id: '3', name: 'Write Code', category: 'Development', streak: 0, completedDates: [], currentStreak: 0, maxStreak: 5 }
    ])
  );

  const [tasks, setTasks] = useState(() =>
    readStorage('studysync_tasks', [
      { id: '1', title: 'Design System Documentation', priority: 'high', subject: 'CS 101', deadline: isoDate(1), completed: false },
      { id: '2', title: 'Calculus Assignment 4', priority: 'medium', subject: 'Math', deadline: isoDate(2), completed: false },
      { id: '3', title: 'Literature Review Intro', priority: 'low', subject: 'English', deadline: isoDate(4), completed: true }
    ])
  );

  const [goals, setGoals] = useState(() =>
    readStorage('studysync_goals', [
      { id: '1', title: 'Master React Context & Hooks', targetDate: isoDate(-21), progress: 65, completed: false, category: 'Skills' },
      { id: '2', title: 'Complete AI Ethics Essay', targetDate: isoDate(-5), progress: 100, completed: true, category: 'Academic' }
    ])
  );

  const [pomodoro, setPomodoro] = useState(() =>
    readStorage('studysync_pomodoro', {
      sessionsCompleted: 12,
      todayMinutes: 50,
      history: [
        { date: isoDate(), minutes: 50, sessions: 2 },
        { date: isoDate(1), minutes: 75, sessions: 3 },
        { date: isoDate(2), minutes: 25, sessions: 1 },
      ]
    })
  );

  const [badges, setBadges] = useState(() => readStorage('studysync_badges', defaultBadges));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('studysync_theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('studysync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studysync_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('studysync_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('studysync_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studysync_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('studysync_pomodoro', JSON.stringify(pomodoro));
  }, [pomodoro]);

  useEffect(() => {
    localStorage.setItem('studysync_badges', JSON.stringify(badges));
  }, [badges]);

  // Actions
  const loginUser = (email, password) => {
    // Simple client side validation & simulation
    if (email && password) {
      const mockUser = {
        name: 'Alex Rivera',
        email: email,
        xp: 450,
        level: 3,
        streak: 5,
        avatar: null
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const registerUser = (name, email, password) => {
    if (name && email && password) {
      const mockUser = {
        name: name,
        email: email,
        xp: 100,
        level: 1,
        streak: 1,
        avatar: null
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addXp = (amount) => {
    if (!user) return;
    setUser(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1; // 200 XP per level
      
      // Unlock badge if XP threshold met
      if (newXp >= 1000) {
        unlockBadge('xp_champion');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev => prev.map(badge => {
      if (badge.id === badgeId && !badge.unlocked) {
        return { ...badge, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
      }
      return badge;
    }));
  };

  // Habits Operations
  const addHabit = (name, category) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      category,
      streak: 0,
      completedDates: [],
      currentStreak: 0,
      maxStreak: 0
    };
    setHabits(prev => [...prev, newHabit]);
    unlockBadge('habit_starter');
    addXp(20);
  };

  const editHabit = (id, name, category) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name, category } : h));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabit = (id, dateStr) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDates.includes(dateStr);
        let newDates;
        if (isCompleted) {
          newDates = h.completedDates.filter(d => d !== dateStr);
        } else {
          newDates = [...h.completedDates, dateStr].sort();
        }

        // Calculate Streaks
        let streak = 0;
        let maxStreak = h.maxStreak;
        
        // Simple sequential date checker
        const sortedDates = [...newDates].sort((a, b) => new Date(b) - new Date(a));
        if (sortedDates.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          const start = sortedDates[0];
          if (start === today || start === yesterday) {
            streak = 1;
            let current = new Date(start);
            for (let i = 1; i < sortedDates.length; i++) {
              const prevDate = new Date(sortedDates[i]);
              const diffTime = Math.abs(current - prevDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                streak++;
                current = prevDate;
              } else if (diffDays === 0) {
                continue;
              } else {
                break;
              }
            }
          }
        }

        if (streak > maxStreak) {
          maxStreak = streak;
        }

        if (streak >= 5) {
          unlockBadge('streak_five');
        }

        // Award XP on check
        if (!isCompleted) {
          addXp(15);
        }

        return {
          ...h,
          completedDates: newDates,
          currentStreak: streak,
          streak: streak,
          maxStreak: maxStreak
        };
      }
      return h;
    }));
  };

  const [activeFocusTask, setActiveFocusTask] = useState(() => readStorage('studysync_active_focus_task', null));

  useEffect(() => {
    localStorage.setItem('studysync_active_focus_task', JSON.stringify(activeFocusTask));
  }, [activeFocusTask]);

  // Tasks Operations
  const addTask = (title, priority = 'medium', subject = 'General', deadline = null, estimatedDuration = 25) => {
    const finalDeadline = deadline || new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      subject,
      deadline: finalDeadline,
      estimatedDuration: Number(estimatedDuration) || 25,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addXp(10);
    return newTask;
  };

  const editTask = (id, updatedTask) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedTask } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          addXp(30);
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  // Goals Operations
  const addGoal = (title, targetDate, category) => {
    const newGoal = {
      id: Date.now().toString(),
      title,
      targetDate,
      progress: 0,
      completed: false,
      category
    };
    setGoals(prev => [...prev, newGoal]);
    addXp(25);
  };

  const editGoal = (id, title, targetDate, progress, completed, category) => {
    if (completed) {
      unlockBadge('goal_getter');
    }
    setGoals(prev => prev.map(g => g.id === id ? { ...g, title, targetDate, progress: Number(progress), completed, category } : g));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) {
          addXp(50);
          unlockBadge('goal_getter');
        }
        return { ...g, completed: nextState, progress: nextState ? 100 : g.progress };
      }
      return g;
    }));
  };

  // Pomodoro
  const addPomodoroSession = (minutes) => {
    const today = new Date().toISOString().split('T')[0];
    const isLate = new Date().getHours() >= 22;

    setPomodoro(prev => {
      const historyCopy = [...prev.history];
      const todayIndex = historyCopy.findIndex(h => h.date === today);

      if (todayIndex >= 0) {
        historyCopy[todayIndex].minutes += minutes;
        historyCopy[todayIndex].sessions += 1;
      } else {
        historyCopy.push({ date: today, minutes, sessions: 1 });
      }

      return {
        sessionsCompleted: prev.sessionsCompleted + 1,
        todayMinutes: prev.todayMinutes + minutes,
        history: historyCopy
      };
    });

    unlockBadge('first_pomodoro');
    if (isLate) {
      unlockBadge('night_owl');
    }
    addXp(40);
  };

  const updateProfile = (name, email) => {
    if (user) {
      setUser(prev => ({ ...prev, name, email }));
    }
  };

  return (
    <StudyContext.Provider value={{
      theme,
      setTheme,
      user,
      setUser,
      habits,
      tasks,
      goals,
      pomodoro,
      badges,
      loginUser,
      registerUser,
      logout,
      addXp,
      unlockBadge,
      addHabit,
      editHabit,
      deleteHabit,
      toggleHabit,
      addTask,
      editTask,
      deleteTask,
      toggleTask,
      addGoal,
      editGoal,
      deleteGoal,
      toggleGoal,
      addPomodoroSession,
      updateProfile,
      activeFocusTask,
      setActiveFocusTask
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export { StudyContext };
