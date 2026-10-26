import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

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
    <div className="overflow-x-hidden bg-[#fcf8ff] text-[#1b1b24] selection:bg-primary-container selection:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm h-20">
        <div className="flex justify-between items-center w-full px-6 max-w-7-xl mx-auto h-full">
          <div className="text-2xl font-bold text-primary tracking-tight">
            StudySync
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold border-b-2 border-primary py-2 text-xs uppercase tracking-wider font-semibold" href="#features">Features</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-xs uppercase tracking-wider font-semibold" href="#methodology">Methodology</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-xs uppercase tracking-wider font-semibold" href="#testimonials">Reviews</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-xs uppercase tracking-wider font-semibold" href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden sm:block text-primary font-bold text-xs uppercase tracking-wider hover:bg-surface-container-low px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md hover:scale-95 active:scale-90 transition-transform duration-150"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md hover:scale-95 active:scale-90 transition-transform duration-150"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 overflow-hidden py-12">
          <div className="max-w-7-xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10 w-full">
            <div className="text-center lg:text-left motion-page">
              <div className="inline-flex items-center gap-2 bg-primary-container/10 text-primary px-4 py-1.5 rounded-full mb-6">
                <span className="material-symbols-outlined text-[18px] fill-current">auto_awesome</span>
                <span className="text-[10px] uppercase tracking-widest font-bold">New: AI Study Planner 2.0</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 text-on-background">
                Study <span className="text-primary italic">Smarter</span>,<br />Stay Consistent.
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl mb-10 mx-auto lg:mx-0">
                Harness the power of AI-driven habit tracking, focused Pomodoro sessions, and deep analytics to master your academic journey without the burnout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleCTA}
                  className="bg-primary text-white text-xs uppercase tracking-wider font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  className="bg-surface-container text-primary text-xs uppercase tracking-wider font-bold px-8 py-4 rounded-xl hover:bg-surface-container-high transition-all duration-300"
                >
                  View Dashboard
                </button>
              </div>
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100')" }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100')" }}></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100')" }}></div>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Joined by <span className="font-bold text-primary">12,000+</span> scholars this month.
                </p>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl max-w-lg">
                <img className="w-full h-auto" src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" alt="Student Studying" />
              </div>
              <div className="absolute -top-6 -right-6 bg-white dark:bg-inverse-surface p-6 rounded-2xl shadow-xl border border-outline-variant/30 hidden md:block ambient-float">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="font-bold text-sm">Daily Goal Met!</span>
                </div>
                <p className="text-xs text-on-surface-variant">4 hours of focused study logged.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-20 px-6 max-w-7-xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Precision Tools for Modern Scholars</h2>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">Everything you need to optimize your study routine, powered by behavioral science and artificial intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Habit Tracker */}
            <div className="md:col-span-3 lg:col-span-2 bg-white p-8 rounded-[20px] border border-outline-variant/30 shadow-sm hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">calendar_today</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Habit Tracker</h3>
              <p className="text-sm text-on-surface-variant mb-6">Build unstoppable momentum with streak tracking and visual progress heatmaps.</p>
              <div className="h-12 bg-surface-container rounded-lg w-full flex items-center px-4 gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
            </div>
            {/* Pomodoro */}
            <div className="md:col-span-3 lg:col-span-2 bg-white p-8 rounded-[20px] border border-outline-variant/30 shadow-sm hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">timer</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Pomodoro Pro</h3>
              <p className="text-sm text-on-surface-variant mb-6">Deep focus sessions with integrated break management and ambient soundscapes.</p>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">25:00</span>
              </div>
            </div>
            {/* AI Insights */}
            <div className="md:col-span-6 lg:col-span-2 bg-white p-8 rounded-[20px] border border-outline-variant/30 shadow-sm hover:scale-[1.02] transition-transform duration-300 border-l-4 border-l-emerald-500">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <h3 className="text-lg font-bold mb-3">AI Insights</h3>
              <p className="text-sm text-on-surface-variant mb-6">Our AI analyzes your performance to predict burnout and suggest optimal study times.</p>
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full w-fit">Smart Suggestion Active</div>
            </div>
            {/* Analytics */}
            <div className="md:col-span-4 bg-white p-8 rounded-[20px] border border-outline-variant/30 shadow-sm hover:scale-[1.02] transition-transform duration-300 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">insights</span>
                </div>
                <h3 className="text-lg font-bold mb-3">Deep Analytics</h3>
                <p className="text-sm text-on-surface-variant">Visualize your growth with granular data on focus intensity and subject mastery.</p>
              </div>
              <div className="w-full md:w-64 h-32 bg-surface-container rounded-xl overflow-hidden flex items-end justify-between px-4 pb-4 gap-2">
                <div className="w-6 bg-primary h-[40%] rounded-t"></div>
                <div className="w-6 bg-primary h-[65%] rounded-t"></div>
                <div className="w-6 bg-primary h-[50%] rounded-t"></div>
                <div className="w-6 bg-primary h-[90%] rounded-t"></div>
                <div className="w-6 bg-primary h-[75%] rounded-t"></div>
              </div>
            </div>
            {/* Goal Planner */}
            <div className="md:col-span-2 bg-white p-8 rounded-[20px] border border-outline-variant/30 shadow-sm hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">target</span>
              </div>
              <h3 className="text-lg font-bold mb-3">Goal Planner</h3>
              <p className="text-sm text-on-surface-variant">Break large projects into manageable milestones with automatic deadline tracking.</p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="bg-surface-container py-20 px-6">
          <div className="max-w-7-xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
            <div>
              <h2 className="text-3xl font-bold mb-6">Scientifically Backed Academic System</h2>
              <p className="text-base text-on-surface-variant mb-6 leading-relaxed">
                StudySync blends the Pomodoro Technique, Habit Building Theories from James Clear's Atomic Habits, and Spaced Repetition frameworks to maximize focus retention and consistency.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm font-semibold">Micro-dosing focus: 25-minute Pomodoro intervals.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm font-semibold">Visual Heatmaps to trigger dopamine for consistency.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-sm font-semibold">Gamification with XP points, levels, and badges.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20">
              <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600" alt="Methodology" />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6 max-w-7-xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Students Worldwide</h2>
            <p className="text-base text-on-surface-variant">Read stories of consistency and academic excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <p className="italic text-on-surface-variant mb-6">"My GPA increased from 3.1 to 3.8 after using StudySync. The streak tracker keeps me accountable every single day."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <h4 className="font-bold text-sm">Emily Watson</h4>
                  <p className="text-xs text-on-surface-variant">Medical Student, Stanford</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <p className="italic text-on-surface-variant mb-6">"The AI Study Tips are scarily accurate. It recommended I study Calculus at 9 AM instead of late nights, and it works!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <h4 className="font-bold text-sm">Ryan Kim</h4>
                  <p className="text-xs text-on-surface-variant">Computer Science, MIT</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
              <p className="italic text-on-surface-variant mb-6">"I complete daily writing tasks with ease. The gamified XP and badges make studying feel like an actual game."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <h4 className="font-bold text-sm">Marcus Aurel</h4>
                  <p className="text-xs text-on-surface-variant">Literature Major, Oxford</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-surface-container py-20 px-6">
          <div className="max-w-3xl mx-auto w-full">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30">
                <h4 className="font-bold mb-2">Is StudySync free to use?</h4>
                <p className="text-sm text-on-surface-variant">Yes! StudySync is completely free to use locally. We store all data in your browser's local storage so you can access it offline.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30">
                <h4 className="font-bold mb-2">How does the AI insights feature work?</h4>
                <p className="text-sm text-on-surface-variant">Our built-in logic reviews your completed tasks, daily habits, and Pomodoro logs to generate optimized suggestions tailored to your schedule.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30">
                <h4 className="font-bold mb-2">Can I sync my data across devices?</h4>
                <p className="text-sm text-on-surface-variant">Currently, StudySync saves data locally. You can export your profile details and import them into another device via the settings panel.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-12 px-6">
        <div className="max-w-7-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-primary">StudySync</div>
          <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} StudySync. Crafted for modern scholars.</p>
        </div>
      </footer>
    </div>
  );
}
