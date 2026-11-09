import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import Logo from '../components/Logo';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, theme, setTheme } = useStudy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const faqs = [
    {
      q: "How does StudySync store my data?",
      a: "All your study logs, goals, habits, and tasks are persisted locally in your browser's LocalStorage. No account verification or external database is required to get started."
    },
    {
      q: "How does the Smart Plan recommendation work?",
      a: "Smart Plan uses a deterministic prioritization rule-set that weighs task deadlines, urgency, estimated duration, and your chosen energy state to compute an optimal timetable with structured recharge breaks."
    },
    {
      q: "Can I adjust Pomodoro intervals and audio alerts?",
      a: "Yes. StudySync offers 15m, 25m, 30m, 45m, and 60m focus presets, alongside customizable short and long break intervals with subtle audio chimes."
    },
    {
      q: "Does StudySync support dark mode?",
      a: "Full dark mode is built in with dedicated high-contrast color tokens for deep focus during late-night study sessions."
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-content font-body antialiased transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/85 backdrop-blur-md border-b border-edge h-16 transition-colors">
        <div className="flex justify-between items-center w-full px-5 md:px-8 max-w-7xl mx-auto h-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lavender dark:bg-card border border-purple/20 flex items-center justify-center p-1.5 shadow-2xs">
              <Logo className="w-full h-full" />
            </div>
            <span className="font-heading text-lg font-bold text-plum dark:text-purple tracking-tight">
              StudySync
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            <a className="text-content-sub hover:text-purple text-xs font-medium transition-colors" href="#features">Features</a>
            <a className="text-content-sub hover:text-purple text-xs font-medium transition-colors" href="#smart-plan">Smart Plan</a>
            <a className="text-content-sub hover:text-purple text-xs font-medium transition-colors" href="#workflow">Workflow</a>
            <a className="text-content-sub hover:text-purple text-xs font-medium transition-colors" href="#faq">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-content-sub hover:text-content hover:bg-surface-alt transition-colors cursor-pointer"
              title="Toggle theme"
              aria-label="Toggle theme mode"
            >
              <span className="material-symbols-outlined text-lg">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {!user ? (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden sm:inline-flex text-content-sub hover:text-purple font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-purple hover:bg-purple-hover text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-purple hover:bg-purple-hover text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-content-sub hover:bg-surface-alt"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-edge px-5 py-3 space-y-2">
            <a 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-content-sub hover:text-purple text-xs py-1.5 font-medium" 
              href="#features"
            >
              Features
            </a>
            <a 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-content-sub hover:text-purple text-xs py-1.5 font-medium" 
              href="#smart-plan"
            >
              Smart Plan
            </a>
            <a 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-content-sub hover:text-purple text-xs py-1.5 font-medium" 
              href="#workflow"
            >
              Workflow
            </a>
            <a 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-content-sub hover:text-purple text-xs py-1.5 font-medium" 
              href="#faq"
            >
              FAQ
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative px-5 md:px-8 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-lavender dark:bg-purple/20 text-purple dark:text-violet px-3 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Clean, focused study companion</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-content tracking-tight leading-[1.15]">
              Master your study routine with <span className="text-purple">calm precision</span>.
            </h1>

            <p className="text-sm md:text-base text-content-sub max-w-xl mx-auto leading-relaxed">
              StudySync unites structured Pomodoro intervals, habit tracking, and rule-based scheduling to keep your academic momentum continuous and sustainable.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button 
                onClick={handleCTA}
                className="bg-purple hover:bg-purple-hover text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{user ? 'Open Dashboard' : 'Create Free Account'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              {!user && (
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-card hover:bg-surface-alt text-content border border-edge text-xs font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Sign In to Existing Account
                </button>
              )}
            </div>

            <p className="text-[11px] text-content-dim pt-1">
              Create an account in 10 seconds • No credit card required • Client-side private storage
            </p>
          </div>

          {/* Interactive Feature Mockup Preview */}
          <div className="mt-12 md:mt-16 bg-card border border-edge rounded-2xl p-4 md:p-6 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-edge">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                <div className="w-3 h-3 rounded-full bg-success/80"></div>
                <span className="text-xs text-content-dim ml-2 font-mono">studysync.app/dashboard</span>
              </div>
              <span className="text-[11px] text-purple bg-lavender dark:bg-purple/20 px-2 py-0.5 rounded-md font-semibold">Active Session</span>
            </div>

            {/* Dashboard UI Simulation */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface-alt border border-edge space-y-1">
                <span className="text-[11px] text-content-sub font-medium">Daily Target</span>
                <p className="font-heading text-xl font-bold text-content">4.0 <span className="text-xs font-normal text-content-sub">hours</span></p>
                <div className="h-1.5 w-full bg-edge rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-purple w-3/4 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface-alt border border-edge space-y-1">
                <span className="text-[11px] text-content-sub font-medium">Active Streak</span>
                <p className="font-heading text-xl font-bold text-content">5 <span className="text-xs font-normal text-content-sub">days</span></p>
                <p className="text-[10px] text-warning font-semibold">Unbroken momentum</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-alt border border-edge space-y-1">
                <span className="text-[11px] text-content-sub font-medium">Today's Focus</span>
                <p className="font-heading text-xl font-bold text-content">2.5 <span className="text-xs font-normal text-content-sub">hours</span></p>
                <p className="text-[10px] text-success font-semibold">6 Pomodoro blocks</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section id="features" className="py-16 px-5 md:px-8 max-w-7xl mx-auto space-y-10 border-t border-edge">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-purple uppercase tracking-wider">Product Features</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-content tracking-tight">
              Built for sustained academic focus
            </h2>
            <p className="text-xs md:text-sm text-content-sub">
              Every tool is engineered to reduce friction and encourage consistent daily progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-2xl border border-edge shadow-xs space-y-3">
              <div className="w-10 h-10 bg-lavender dark:bg-purple/20 text-purple rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">calendar_today</span>
              </div>
              <h3 className="font-heading text-base font-bold text-content">Habit Tracker</h3>
              <p className="text-xs text-content-sub leading-relaxed">
                Log daily academic habits and visualize your consistency through a 15-week activity heatmap.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-2xl border border-edge shadow-xs space-y-3">
              <div className="w-10 h-10 bg-lavender dark:bg-purple/20 text-purple rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">timer</span>
              </div>
              <h3 className="font-heading text-base font-bold text-content">Pomodoro Focus Timer</h3>
              <p className="text-xs text-content-sub leading-relaxed">
                Work in structured sprints with visual circular countdowns, audio notifications, and session history logs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-2xl border border-edge shadow-xs space-y-3">
              <div className="w-10 h-10 bg-lavender dark:bg-purple/20 text-purple rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">insights</span>
              </div>
              <h3 className="font-heading text-base font-bold text-content">Productivity Analytics</h3>
              <p className="text-xs text-content-sub leading-relaxed">
                Track study-hour trends, subject workload distribution, and task completion velocity via clear charts.
              </p>
            </div>
          </div>
        </section>

        {/* Smart Plan Deep Dive */}
        <section id="smart-plan" className="bg-surface-alt py-16 px-5 md:px-8 border-y border-edge">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-purple uppercase tracking-wider">Algorithmic Timetable</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-content tracking-tight">
                StudySync Smart Plan
              </h2>
              <p className="text-xs md:text-sm text-content-sub leading-relaxed">
                Have only 45 minutes between classes? The Smart Plan takes your current available time, energy state (High, Balanced, or Fatigued), and pending tasks to assemble an optimized timetable with calculated 5-minute pauses.
              </p>
              <ul className="space-y-2.5 pt-1 text-xs text-content">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple text-base">check_circle</span>
                  <span>Calculates task urgency based on approaching deadlines</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple text-base">check_circle</span>
                  <span>Weights cognitive load according to your energy selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple text-base">check_circle</span>
                  <span>Injects restorative recharge intervals to avoid mental burnout</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-edge shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-edge">
                <span className="text-xs font-semibold text-content">Generated 60-min Schedule</span>
                <span className="text-[10px] text-purple bg-lavender dark:bg-purple/20 px-2 py-0.5 rounded font-semibold">Balanced Energy</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-surface-alt border border-edge flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-content">0:00 – 0:25 • Physics Problem Set</p>
                    <p className="text-[10px] text-content-dim">High priority deadline</p>
                  </div>
                  <span className="text-purple font-semibold">25m</span>
                </div>
                <div className="p-2 rounded-lg bg-lavender/40 dark:bg-purple/10 border border-purple/20 flex items-center justify-between text-xs text-content-sub">
                  <span>0:25 – 0:30 • Active Recharge Break</span>
                  <span className="text-content-dim">5m</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-alt border border-edge flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-content">0:30 – 0:55 • Organic Chemistry Flashcards</p>
                    <p className="text-[10px] text-content-dim">Spaced recall review</p>
                  </div>
                  <span className="text-purple font-semibold">25m</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / Methodology */}
        <section id="workflow" className="py-16 px-5 md:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-purple uppercase tracking-wider">Methodology</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-content tracking-tight">
              A 3-step cycle that compounds daily
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-card border border-edge shadow-xs space-y-2">
              <span className="font-heading text-2xl font-bold text-purple">01</span>
              <h3 className="font-heading text-sm font-bold text-content">Capture & Prioritize</h3>
              <p className="text-xs text-content-sub leading-relaxed">
                Organize assignments and revision topics by subject, priority level, and target deadlines.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-edge shadow-xs space-y-2">
              <span className="font-heading text-2xl font-bold text-purple">02</span>
              <h3 className="font-heading text-sm font-bold text-content">Focus in Intervals</h3>
              <p className="text-xs text-content-sub leading-relaxed">
                Execute deep work blocks using Pomodoro timers that keep your cognitive stamina fresh.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-edge shadow-xs space-y-2">
              <span className="font-heading text-2xl font-bold text-purple">03</span>
              <h3 className="font-heading text-sm font-bold text-content">Reflect & Track</h3>
              <p className="text-xs text-content-sub leading-relaxed">
                Review weekly study distribution and maintain your streak across weeks of persistent learning.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-surface-alt py-16 px-5 md:px-8 border-t border-edge">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-semibold text-purple uppercase tracking-wider">Questions</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-content tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="bg-card rounded-xl border border-edge overflow-hidden transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex justify-between items-center text-xs font-semibold text-content cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-base text-content-dim">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-content-sub leading-relaxed border-t border-edge pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-edge py-8 px-5 md:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span className="font-heading font-bold text-sm text-plum dark:text-purple">StudySync</span>
          </div>
          <p className="text-content-dim">
            © {new Date().getFullYear()} StudySync. Client-side study companion.
          </p>
        </div>
      </footer>
    </div>
  );
}
