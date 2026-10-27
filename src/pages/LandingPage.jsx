import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import Logo from '../components/Logo';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useStudy();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="overflow-x-hidden bg-background text-[#1b1b24] selection:bg-primary selection:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-container/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-20">
        <div className="flex justify-between items-center w-full px-6 max-w-7-xl mx-auto h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center p-1.5 shadow-sm">
              <Logo className="w-full h-full" />
            </div>
            <div className="text-2xl font-extrabold text-primary tracking-tight">
              StudySync
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-extrabold border-b-2 border-primary py-2 text-xs uppercase tracking-wider" href="#features">Features</a>
            <a className="text-[#3b3852] hover:text-primary transition-colors duration-200 text-xs uppercase tracking-wider font-bold" href="#methodology">Methodology</a>
            <a className="text-[#3b3852] hover:text-primary transition-colors duration-200 text-xs uppercase tracking-wider font-bold" href="#testimonials">Reviews</a>
            <a className="text-[#3b3852] hover:text-primary transition-colors duration-200 text-xs uppercase tracking-wider font-bold" href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden sm:block text-primary font-bold text-xs uppercase tracking-wider hover:bg-surface-container-low px-4 py-2.5 rounded-xl transition-all"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md hover:scale-95 transition-all"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md hover:scale-95 transition-all"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 bg-gradient-to-tr from-primary-fixed/40 via-surface-container-low to-primary-fixed-dim/30 overflow-hidden py-16">
          <div className="max-w-7-xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10 w-full">
            <div className="text-center lg:text-left motion-page space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary-fixed text-primary px-4 py-1.5 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span className="text-[10px] uppercase tracking-widest font-extrabold">New: Smart Study Planner</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.15] text-[#1b1b24] tracking-tight">
                Study <span className="text-primary italic">Smarter</span>,<br />Stay Consistent.
              </h1>
              <p className="text-base md:text-lg text-[#3b3852] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Harness habit tracking, precision Pomodoro intervals, and academic planning to conquer coursework without the burnout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button 
                  onClick={handleCTA}
                  className="bg-primary hover:bg-primary-container text-white text-xs uppercase tracking-wider font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  className="bg-white text-primary border border-primary/20 text-xs uppercase tracking-wider font-extrabold px-8 py-4 rounded-xl hover:bg-surface-container-low transition-all shadow-sm"
                >
                  Open Dashboard
                </button>
              </div>
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100')" }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100')" }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100')" }}></div>
                </div>
                <p className="text-xs font-bold text-[#3b3852]">
                  Joined by <span className="font-extrabold text-primary">12,000+</span> scholars this semester.
                </p>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-outline-variant/30 shadow-2xl max-w-lg bg-white">
                <img className="w-full h-auto" src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" alt="Student Studying with StudySync" />
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-outline-variant/30 hidden md:block ambient-float z-20">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="material-symbols-outlined text-tertiary text-xl font-bold">check_circle</span>
                  <span className="font-bold text-sm text-[#1b1b24]">Daily Goal Met!</span>
                </div>
                <p className="text-xs font-semibold text-[#5e5b79]">4 hours of focused study logged.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-20 px-6 max-w-7-xl mx-auto w-full space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider">
              Productivity Engine
            </div>
            <h2 className="text-3xl font-extrabold text-[#1b1b24] tracking-tight">Precision Tools for Modern Scholars</h2>
            <p className="text-sm font-medium text-[#4b4863]">
              Everything you need to optimize your daily routine, powered by cognitive science and behavioral habit loops.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Habit Tracker */}
            <div className="md:col-span-3 lg:col-span-2 bg-white p-7 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">calendar_today</span>
              </div>
              <h3 className="text-lg font-bold text-[#1b1b24]">Habit Tracker</h3>
              <p className="text-xs text-[#5e5b79] leading-relaxed">Build unbreakable streaks with 15-week completion heatmaps and category tags.</p>
              <div className="h-10 bg-surface-container rounded-xl w-full flex items-center px-4 gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-primary/25"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
            </div>

            {/* Pomodoro */}
            <div className="md:col-span-3 lg:col-span-2 bg-white p-7 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">timer</span>
              </div>
              <h3 className="text-lg font-bold text-[#1b1b24]">Pomodoro Focus Timer</h3>
              <p className="text-xs text-[#5e5b79] leading-relaxed">Deep focus cycles with customizable break intervals, audio chimes, and XP rewards.</p>
              <div className="text-center py-1 bg-surface-container rounded-xl">
                <span className="text-2xl font-black text-primary">25:00</span>
              </div>
            </div>

            {/* Smart Plan */}
            <div className="md:col-span-6 lg:col-span-2 bg-white p-7 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4 border-l-4 border-l-primary">
              <div className="w-12 h-12 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <h3 className="text-lg font-bold text-[#1b1b24]">StudySync Smart Plan</h3>
              <p className="text-xs text-[#5e5b79] leading-relaxed">
                "I have 30 minutes. What should I study?" Instant prioritization based on energy and deadlines.
              </p>
              <div className="text-[10px] font-extrabold text-primary bg-primary-fixed/40 px-3 py-1 rounded-full w-fit uppercase">
                Instant Scheduling
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="bg-surface-container py-20 px-6 border-y border-outline-variant/20">
          <div className="max-w-7-xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider">
                Evidence-Based
              </div>
              <h2 className="text-3xl font-extrabold text-[#1b1b24] tracking-tight">Scientifically Backed Academic System</h2>
              <p className="text-sm text-[#4b4863] leading-relaxed">
                StudySync synthesizes the Pomodoro Technique, James Clear's habit friction models, and spaced repetition intervals to maximize long-term retention.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="text-xs font-bold text-[#1b1b24]">Precision sprints: 25-minute Pomodoro intervals.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="text-xs font-bold text-[#1b1b24]">Visual heatmaps to trigger daily dopamine momentum.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="text-xs font-bold text-[#1b1b24]">Gamification with scholar XP levels and unlockable badges.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30">
              <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600" alt="StudySync Methodology" />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6 max-w-7-xl mx-auto w-full space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-[#1b1b24] tracking-tight">Loved by Students Worldwide</h2>
            <p className="text-sm font-medium text-[#5e5b79]">Read verified reviews from students elevating their academic grades.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
              <p className="italic text-xs text-[#3b3852] leading-relaxed">
                "My GPA increased from 3.1 to 3.8 after using StudySync. The streak tracker keeps me accountable every single day."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs">EW</div>
                <div>
                  <h4 className="font-bold text-xs text-[#1b1b24]">Emily Watson</h4>
                  <p className="text-[10px] text-[#5e5b79] font-medium">Medical Scholar</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
              <p className="italic text-xs text-[#3b3852] leading-relaxed">
                "The Smart Plan feature is a lifesaver. Whenever I have only 30 or 45 minutes between classes, it tells me exactly what to study."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs">RK</div>
                <div>
                  <h4 className="font-bold text-xs text-[#1b1b24]">Ryan Kim</h4>
                  <p className="text-[10px] text-[#5e5b79] font-medium">Computer Science</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
              <p className="italic text-xs text-[#3b3852] leading-relaxed">
                "I complete daily writing tasks with ease. The gamified XP and badges make studying feel rewarding rather than exhausting."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs">MA</div>
                <div>
                  <h4 className="font-bold text-xs text-[#1b1b24]">Marcus Aurel</h4>
                  <p className="text-[10px] text-[#5e5b79] font-medium">Engineering Student</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-surface-container py-20 px-6 border-t border-outline-variant/20">
          <div className="max-w-3xl mx-auto w-full space-y-8">
            <h2 className="text-3xl font-extrabold text-[#1b1b24] tracking-tight text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-1.5">
                <h4 className="font-bold text-sm text-[#1b1b24]">Is StudySync free to use?</h4>
                <p className="text-xs text-[#4b4863] leading-relaxed">Yes! StudySync is completely free to use. All progress, tasks, and streaks are safely saved in local storage.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-1.5">
                <h4 className="font-bold text-sm text-[#1b1b24]">How does the StudySync Smart Plan work?</h4>
                <p className="text-xs text-[#4b4863] leading-relaxed">It calculates task priority scores against deadlines, estimated durations, and your current energy level to allocate exact focus blocks and rest intervals.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm space-y-1.5">
                <h4 className="font-bold text-sm text-[#1b1b24]">Can I customize my Pomodoro and break durations?</h4>
                <p className="text-xs text-[#4b4863] leading-relaxed">Yes, you can choose from presets (15m, 25m, 30m, 45m, 60m) or custom durations with audio chimes directly on the Focus page.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-8 px-6">
        <div className="max-w-7-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Logo className="w-6 h-6" />
            <span className="text-lg font-extrabold text-primary">StudySync</span>
          </div>
          <p className="text-xs text-[#5e5b79] font-medium">© {new Date().getFullYear()} StudySync. Crafted for modern scholars.</p>
        </div>
      </footer>
    </div>
  );
}
