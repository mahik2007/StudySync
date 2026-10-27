import { useState } from 'react';
import { useStudy } from '../context/useStudy';

export default function CalendarView() {
  const { tasks, pomodoro, toggleTask } = useStudy();
  
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

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
    const dateStr = d.toISOString().split('T')[0];
    gridCells.push({
      day: prevMonthDays - i,
      month: 'prev',
      dateStr
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = i.toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    gridCells.push({
      day: i,
      month: 'current',
      dateStr
    });
  }

  // Next month overflow days to pad to 42 cells (6 rows)
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 1 : month + 2;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    gridCells.push({
      day: i,
      month: 'next',
      dateStr
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayContent = (dateStr) => {
    const dayTasks = tasks.filter(t => t.deadline === dateStr);
    const dayStudy = pomodoro.history.find(h => h.date === dateStr);
    return { tasks: dayTasks, study: dayStudy };
  };

  const selectedDayData = selectedDate ? getDayContent(selectedDate) : { tasks: [], study: null };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Schedule Overview
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1b24] dark:text-white tracking-tight">
            Academic Calendar
          </h2>
          <p className="text-sm font-medium text-[#4b4863] dark:text-[#bbb8d0]">
            Track exam dates, assignment deadlines, and historical study hours.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-3 bg-white dark:bg-surface-container border border-outline-variant/30 rounded-2xl px-4 py-2 shadow-sm w-fit">
          <button 
            onClick={handlePrevMonth} 
            className="p-1 hover:bg-surface-container-high rounded-lg text-[#3b3852] dark:text-white transition-colors"
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-base">arrow_back_ios_new</span>
          </button>
          <span className="text-sm font-extrabold text-[#1b1b24] dark:text-white min-w-36 text-center">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="p-1 hover:bg-surface-container-high rounded-lg text-[#3b3852] dark:text-white transition-colors"
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-base">arrow_forward_ios</span>
          </button>
        </div>
      </div>

      {/* Main Grid Calendar */}
      <div className="bg-white dark:bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-outline-variant/25 bg-surface-container-low py-3 text-center text-xs font-extrabold text-[#5e5b79] dark:text-[#a5a2bf]">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 grid-rows-6">
          {gridCells.map((cell, idx) => {
            const { tasks: cellTasks, study: cellStudy } = getDayContent(cell.dateStr);
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
            const isSelected = selectedDate === cell.dateStr;

            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-[105px] p-2.5 border-r border-b border-outline-variant/20 flex flex-col justify-between cursor-pointer transition-all hover:bg-surface-container-low ${
                  cell.month === 'current' ? 'text-[#1b1b24] dark:text-white' : 'text-[#8c89a4] dark:text-[#6a6784] opacity-50'
                } ${isToday ? 'bg-primary-fixed/20' : ''} ${isSelected ? 'ring-2 ring-primary ring-inset bg-primary-fixed/30' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-extrabold ${isToday ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm' : ''}`}>
                    {cell.day}
                  </span>
                  
                  {/* Study session indicator */}
                  {cellStudy && cellStudy.minutes > 0 && (
                    <span 
                      className="w-2.5 h-2.5 rounded-full bg-tertiary" 
                      title={`Studied for ${cellStudy.minutes} mins on this date`}
                    />
                  )}
                </div>

                {/* Deadlines list preview */}
                <div className="space-y-1 mt-2">
                  {cellTasks.slice(0, 2).map(t => (
                    <div 
                      key={t.id} 
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate ${
                        t.completed 
                          ? 'bg-surface-container text-[#5e5b79] dark:text-[#a5a2bf] line-through' 
                          : 'bg-primary-fixed text-primary border border-primary/20'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {cellTasks.length > 2 && (
                    <div className="text-[9px] text-primary font-bold">
                      +{cellTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Panel Details */}
      {selectedDate && (
        <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
            <div>
              <h3 className="text-base font-bold text-[#1b1b24] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event</span>
                Schedule for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>
            {selectedDayData.study && selectedDayData.study.minutes > 0 && (
              <span className="text-xs font-bold text-tertiary bg-tertiary-fixed/40 px-3 py-1 rounded-full w-fit">
                ⏱️ {selectedDayData.study.minutes} mins studied
              </span>
            )}
          </div>

          {selectedDayData.tasks.length > 0 ? (
            <div className="space-y-2.5">
              {selectedDayData.tasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        task.completed ? 'bg-primary text-white border-primary' : 'border-outline-variant/50'
                      }`}
                    >
                      {task.completed && <span className="material-symbols-outlined text-xs">check</span>}
                    </button>
                    <div>
                      <h4 className={`text-xs md:text-sm font-bold ${task.completed ? 'line-through text-[#5e5b79] dark:text-[#a5a2bf]' : 'text-[#1b1b24] dark:text-white'}`}>
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-[#5e5b79] dark:text-[#a5a2bf] font-medium">
                        {task.subject} • Priority: <span className="uppercase font-bold">{task.priority}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#5e5b79] dark:text-[#a5a2bf]">
              No deadlines or tasks scheduled for this day.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
