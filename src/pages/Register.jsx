import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useStudy();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = registerUser(name, email, password);
    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: email.trim().toLowerCase() } });
      }, 1200);
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-surface text-content font-body antialiased">
      {/* Left Column: Visual Brand */}
      <section className="hidden md:flex md:w-1/2 bg-plum text-white relative flex-col justify-between p-10 lg:p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-2xs">
            <Logo className="w-full h-full" />
          </div>
          <span className="font-heading text-lg font-bold text-white tracking-tight">StudySync</span>
        </div>

        <div className="max-w-md space-y-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-violet bg-white/10 px-2.5 py-1 rounded-md">
            Academic Growth
          </span>
          <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Start building your focused study routine today.
          </h1>
          <p className="text-xs lg:text-sm text-lavender/80 leading-relaxed">
            Gain immediate access to custom timetable generation, habit consistency heatmaps, and streak tracking.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-lavender/90">
              <span className="material-symbols-outlined text-sm text-success">check_circle</span>
              <span>Unlimited habit and task management</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-lavender/90">
              <span className="material-symbols-outlined text-sm text-success">check_circle</span>
              <span>Intelligent 30-min to 180-min session planner</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-lavender/90">
              <span className="material-symbols-outlined text-sm text-success">check_circle</span>
              <span>Distraction-free customizable Pomodoro timer</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-lavender/60">
          © {new Date().getFullYear()} StudySync • Smart Study Tracker
        </div>
      </section>

      {/* Right Column: Register Form */}
      <section className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-sm space-y-5 my-6">
          <div className="flex md:hidden items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-lavender dark:bg-purple/20 border border-purple/20 flex items-center justify-center p-1">
              <Logo className="w-full h-full" />
            </div>
            <span className="font-heading text-base font-bold text-content">StudySync</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-bold text-content">Create account</h2>
            <p className="text-xs text-content-sub">Start tracking your academic habits.</p>
          </div>

          {error && (
            <div className="p-3 bg-danger-soft border border-danger/30 text-danger rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-success-soft border border-success/30 text-success rounded-xl text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-content-sub" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2.5 bg-card border border-edge rounded-xl focus:ring-2 focus:ring-purple/20 focus:border-purple outline-none text-xs text-content placeholder:text-content-dim transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-content-sub" htmlFor="reg-email">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@rivers.com"
                className="w-full px-3.5 py-2.5 bg-card border border-edge rounded-xl focus:ring-2 focus:ring-purple/20 focus:border-purple outline-none text-xs text-content placeholder:text-content-dim transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-content-sub" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-card border border-edge rounded-xl focus:ring-2 focus:ring-purple/20 focus:border-purple outline-none text-xs text-content placeholder:text-content-dim transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-content-sub" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3.5 py-2.5 bg-card border border-edge rounded-xl focus:ring-2 focus:ring-purple/20 focus:border-purple outline-none text-xs text-content placeholder:text-content-dim transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-purple hover:bg-purple-hover text-white font-semibold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-edge">
            <p className="text-xs text-content-sub">
              Already have an account?{' '}
              <Link className="text-purple font-semibold hover:underline" to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
