import { useState } from 'react';
import { useStudy } from '../context/useStudy';

export default function CalendarView() {
  const { tasks, pomodoro, toggleTask } = useStudy();
  
  const formatYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => formatYMD(new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Logic to build month days grid
  const startDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const gridCells = [];

  // Previous month overflow days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    gridCells.push({
      day: prevMonthDays - i,
      month: 'prev',
      dateStr: formatYMD(d)
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    gridCells.push({
      day: i,
      month: 'current',
      dateStr: formatYMD(d)
    });
  }

  // Next month overflow days
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    gridCells.push({
      day: i,
      month: 'next',
      dateStr: formatYMD(d)
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayContent = (dateStr) => {
    const dayTasks = tasks.filter((t) => t.deadline === dateStr);
    const dayStudy = pomodoro?.history?.find((h) => h.date === dateStr);
    return { tasks: dayTasks, study: dayStudy };
  };

  const selectedDayData = selectedDate ? getDayContent(selectedDate) : { tasks: [], study: null };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-edge">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavender dark:bg-purple/20 text-purple dark:text-violet text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-xs">event</span>
            <span>Monthly View</span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-content tracking-tight">Calendar</h1>
          <p className="text-xs text-content-sub">Keep track of assignment deadlines, exams, and daily study records.</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-card border border-edge rounded-xl px-3 py-1.5 shadow-2xs self-start sm:self-auto transition-colors">
          <button 
            onClick={handlePrevMonth} 
            className="p-1 hover:bg-surface-alt rounded-lg text-content-sub hover:text-content transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
          </button>
          <span className="text-xs font-semibold text-content min-w-32 text-center">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="p-1 hover:bg-surface-alt rounded-lg text-content-sub hover:text-content transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
          </button>
        </div>
      </div>

      {/* Main Grid Calendar */}
      <div className="bg-card border border-edge rounded-2xl overflow-hidden shadow-xs transition-colors">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-edge bg-surface-alt py-2.5 text-center text-[11px] font-semibold text-content-sub">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 grid-rows-6">
          {gridCells.map((cell, idx) => {
            const { tasks: cellTasks, study: cellStudy } = getDayContent(cell.dateStr);
            const isToday = cell.dateStr === formatYMD(new Date());
            const isSelected = selectedDate === cell.dateStr;

            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-[85px] md:min-h-[100px] p-2 border-r border-b border-edge flex flex-col justify-between cursor-pointer transition-colors hover:bg-surface-alt/70 ${
                  cell.month === 'current' ? 'text-content' : 'text-content-dim opacity-40'
                } ${isToday ? 'bg-lavender/30 dark:bg-purple/10' : ''} ${
                  isSelected ? 'ring-2 ring-purple ring-inset bg-lavender/40 dark:bg-purple/15' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-medium ${isToday ? 'bg-purple text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px]' : ''}`}>
                    {cell.day}
                  </span>
                  
                  {cellStudy && cellStudy.minutes > 0 && (
                    <span 
                      className="w-2 h-2 rounded-full bg-success" 
                      title={`${cellStudy.minutes} mins studied`}
                    />
                  )}
                </div>

                {/* Deadlines preview */}
                <div className="space-y-1 mt-1.5">
                  {cellTasks.slice(0, 2).map((t) => (
                    <div 
                      key={t.id} 
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded truncate ${
                        t.completed 
                          ? 'bg-surface-alt text-content-dim line-through' 
                          : 'bg-lavender dark:bg-purple/20 text-purple border border-purple/20'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {cellTasks.length > 2 && (
                    <div className="text-[9px] text-purple font-semibold pl-1">
                      +{cellTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDate && (
        <div className="bg-card p-5 rounded-2xl border border-edge shadow-xs space-y-3.5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-edge">
            <h2 className="font-heading text-sm font-bold text-content flex items-center gap-2">
              <span className="material-symbols-outlined text-purple text-base">event</span>
              <span>
                Schedule for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </h2>
            {selectedDayData.study && selectedDayData.study.minutes > 0 && (
              <span className="text-xs font-semibold text-success bg-success-soft px-2.5 py-0.5 rounded-full w-fit">
                {selectedDayData.study.minutes} mins studied
              </span>
            )}
          </div>

          {selectedDayData.tasks.length > 0 ? (
            <div className="space-y-2">
              {selectedDayData.tasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-alt border border-edge"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                        task.completed ? 'bg-purple text-white border-purple' : 'border-edge bg-card'
                      }`}
                    >
                      {task.completed && <span className="material-symbols-outlined text-xs">check</span>}
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-content-dim' : 'text-content'}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-content-dim">
                        {task.subject} • Priority: <span className="font-semibold uppercase">{task.priority}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-content-sub">
              No tasks or deadlines scheduled for this date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
