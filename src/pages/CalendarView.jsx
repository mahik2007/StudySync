import { useState } from 'react';
import { useStudy } from '../context/useStudy';

export default function CalendarView() {
  const { tasks, pomodoro } = useStudy();
  
  const [currentDate, setCurrentDate] = useState(() => new Date());

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
    gridCells.push({
      day: prevMonthDays - i,
      month: 'prev',
      dateStr: new Date(year, month - 1, prevMonthDays - i).toISOString().split('T')[0]
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    // Adjust for time zone offset when converting to ISO date string
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset*60*1000));
    gridCells.push({
      day: i,
      month: 'current',
      dateStr: localDate.toISOString().split('T')[0]
    });
  }

  // Next month overflow days to pad to 42 cells (6 rows)
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      day: i,
      month: 'next',
      dateStr: new Date(year, month + 1, i).toISOString().split('T')[0]
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const getDayContent = (dateStr) => {
    const dayTasks = tasks.filter(t => t.deadline === dateStr);
    const dayStudy = pomodoro.history.find(h => h.date === dateStr);
    return { tasks: dayTasks, study: dayStudy };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Calendar</h2>
          <p className="text-sm text-on-surface-variant">View all academic deadlines and study sessions in a calendar view.</p>
        </div>
        {/* Calendar Nav */}
        <div className="flex items-center gap-4 bg-white dark:bg-inverse-surface border border-outline-variant/30 rounded-xl px-4 py-2 w-fit">
          <button onClick={handlePrevMonth} className="material-symbols-outlined text-base hover:text-primary">
            arrow_back_ios
          </button>
          <span className="text-sm font-bold text-on-background min-w-32 text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="material-symbols-outlined text-base hover:text-primary">
            arrow_forward_ios
          </button>
        </div>
      </div>

      {/* Main Grid Calendar */}
      <div className="bg-white dark:bg-inverse-surface border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-outline-variant/20 bg-surface-container py-3 text-center text-xs font-bold text-on-surface-variant">
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
                className={`min-h-[100px] p-2 border-r border-b border-outline-variant/15 flex flex-col justify-between cursor-pointer transition-all hover:bg-surface-container/50 ${
                  cell.month === 'current' ? 'text-on-background' : 'text-on-surface-variant/40'
                } ${isToday ? 'bg-primary/5' : ''} ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold ${isToday ? 'bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center' : ''}`}>
                    {cell.day}
                  </span>
                  
                  {/* Study session indicator */}
                  {cellStudy && cellStudy.minutes > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title={`Studied for ${cellStudy.minutes} mins`}></span>
                  )}
                </div>

                {/* Deadlines list preview */}
                <div className="space-y-1 mt-2">
                  {cellTasks.slice(0, 2).map(t => (
                    <div 
                      key={t.id} 
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                        t.completed 
                          ? 'bg-surface-container text-on-surface-variant line-through' 
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {cellTasks.length > 2 && (
                    <div className="text-[9px] text-on-surface-variant font-bold">
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
        <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
            <h3 className="text-sm font-bold text-primary">Detail View: {selectedDate}</h3>
            <button onClick={() => setSelectedDate(null)} className="text-xs font-semibold hover:underline text-on-surface-variant">Close</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deadlines */}
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Deadlines due:</h4>
              {getDayContent(selectedDate).tasks.length > 0 ? (
                <div className="space-y-2">
                  {getDayContent(selectedDate).tasks.map(t => (
                    <div key={t.id} className="text-xs font-bold p-2 bg-surface-container rounded-lg border border-outline-variant/10">
                      {t.title} ({t.priority.toUpperCase()} priority) - {t.completed ? 'Completed' : 'Pending'}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No deadlines due on this day.</p>
              )}
            </div>
            
            {/* Study Session Details */}
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Focus study logs:</h4>
              {getDayContent(selectedDate).study ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-500/20 text-xs">
                  <p className="font-bold">Total duration: {getDayContent(selectedDate).study.minutes} minutes</p>
                  <p className="mt-1">Completed Pomodoro intervals: {getDayContent(selectedDate).study.sessions} sessions</p>
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No study sessions logged on this day.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
