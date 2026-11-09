import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useStudy } from '../context/useStudy';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useStudy();
  const [email, setEmail] = useState(() => location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState(() => 
    location.state?.registeredEmail ? 'Account created! Please enter your password to sign in.' : ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    const res = loginUser(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials. Please register first if you do not have an account.');
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-surface text-content font-body antialiased">
      {/* Left Column: Visual Brand Experience */}
      <section className="hidden md:flex md:w-1/2 bg-plum text-white relative flex-col justify-between p-10 lg:p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-2xs">
            <Logo className="w-full h-full" />
          </div>
          <span className="font-heading text-lg font-bold text-white tracking-tight">StudySync</span>
        </div>

        <div className="max-w-md space-y-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-violet bg-white/10 px-2.5 py-1 rounded-md">
            Productivity Suite
          </span>
          <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Structure your study time with calm confidence.
          </h1>
          <p className="text-xs lg:text-sm text-lavender/80 leading-relaxed">
            Organize tasks, sustain streaks, and run structured Pomodoro sprints from a unified academic workspace.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <span className="material-symbols-outlined text-sm text-success">check_circle</span>
              <span>Client-side privacy & persistence</span>
            </div>
            <p className="text-[11px] text-lavender/70 pl-5">
              All tasks and logs stay in your browser. Seamless demo access available instantly.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-lavender/60">
          © {new Date().getFullYear()} StudySync • Smart Study Tracker
        </div>
      </section>

      {/* Right Column: Clean Form */}
      <section className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex md:hidden items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-lavender dark:bg-purple/20 border border-purple/20 flex items-center justify-center p-1">
              <Logo className="w-full h-full" />
            </div>
            <span className="font-heading text-base font-bold text-content">StudySync</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-bold text-content">Sign in</h2>
            <p className="text-xs text-content-sub">Access your personal study dashboard.</p>
          </div>

          {infoMsg && (
            <div className="p-3 bg-success-soft border border-success/30 text-success rounded-xl text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{infoMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-danger-soft border border-danger/30 text-danger rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-content-sub" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@rivers.com"
                className="w-full px-3.5 py-2.5 bg-card border border-edge rounded-xl focus:ring-2 focus:ring-purple/20 focus:border-purple outline-none text-xs text-content placeholder:text-content-dim transition-all"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-content-sub" htmlFor="password">
                  Password
                </label>
                <Link to="/register" className="text-[11px] text-purple hover:underline cursor-pointer">
                  New here? Create account
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-card border border-edge rounded-xl focus:ring-2 focus:ring-purple/20 focus:border-purple outline-none text-xs text-content placeholder:text-content-dim transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-edge text-purple focus:ring-purple cursor-pointer"
              />
              <label className="text-xs text-content-sub cursor-pointer select-none" htmlFor="remember">
                Remember this device
              </label>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-purple hover:bg-purple-hover text-white font-semibold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-edge">
            <p className="text-xs text-content-sub">
              Don't have an account?{' '}
              <Link className="text-purple font-semibold hover:underline" to="/register">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
