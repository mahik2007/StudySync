import { useStudy } from '../context/useStudy';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

export default function Analytics() {
  const { pomodoro, tasks, habits } = useStudy();

  // 1. Weekly study hours log
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = pomodoro.history.find(h => h.date === dateStr) || { minutes: 0, sessions: 0 };
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: (log.minutes / 60),
      sessions: log.sessions
    };
  }).reverse();

  // 2. Subject Distribution Pie Chart data
  const subjectCounts = {};
  tasks.forEach(t => {
    const sub = t.subject || 'General';
    subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
  });

  const subjectData = Object.keys(subjectCounts).map(sub => ({
    name: sub,
    value: subjectCounts[sub]
  }));

  const COLORS = ['#3525cd', '#8792fe', '#005523', '#ba1a1a', '#e0e0ff', '#f5f2ff'];

  // 3. Monthly completion rates
  const monthlyData = [
    { name: 'Week 1', habits: 4, tasks: 5 },
    { name: 'Week 2', habits: 6, tasks: 3 },
    { name: 'Week 3', habits: 8, tasks: 7 },
    { name: 'Week 4', habits: 5, tasks: 6 }
  ];

  // Productivity metrics
  const totalFocusHours = (pomodoro.history.reduce((acc, curr) => acc + curr.minutes, 0) / 60).toFixed(1);
  const totalTasksCompleted = tasks.filter(t => t.completed).length;
  const totalHabitsCompleted = habits.reduce((acc, curr) => acc + curr.completedDates.length, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Productivity Analytics</h2>
        <p className="text-sm text-on-surface-variant">Real-time charts and data-driven learning statistics.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Total Focus Time</p>
          <p className="text-3xl font-bold text-primary">{totalFocusHours} hrs</p>
          <p className="text-xs text-on-surface-variant mt-2">Logged across all focus sessions</p>
        </div>
        <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Tasks Finished</p>
          <p className="text-3xl font-bold text-tertiary">{totalTasksCompleted} tasks</p>
          <p className="text-xs text-on-surface-variant mt-2">Completed out of {tasks.length} total tasks</p>
        </div>
        <div className="bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Habits Checked</p>
          <p className="text-3xl font-bold text-secondary">{totalHabitsCompleted} times</p>
          <p className="text-xs text-on-surface-variant mt-2">Across all daily active habits</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Hours Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6">Weekly Study Activity (Hours)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#3525cd" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-Wise distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6">Subject Task Weight</h3>
          <div className="h-56 flex justify-center items-center">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-on-surface-variant">No tasks logged to plot.</div>
            )}
          </div>
          {/* Custom Legends */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {subjectData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1 text-[10px] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity Bar Chart */}
        <div className="lg:col-span-12 bg-white dark:bg-inverse-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6">Monthly Completion Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="habits" fill="#3525cd" name="Habits Marked" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" fill="#8792fe" name="Tasks Finished" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
