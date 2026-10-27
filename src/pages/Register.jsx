import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useStudy();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name) {
      setError('Full name is required.');
      return;
    }
    if (!email) {
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

    const success = registerUser(name, email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed.');
    }
  };

  return (
    <main className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-background text-on-background">
      {/* Left Side: Graphic Panel */}
      <section className="hidden md:flex md:w-1/2 relative bg-primary-container overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 w-full max-w-lg aspect-square">
          {/* Top Floating Card */}
          <div className="absolute top-0 right-0 w-48 h-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col items-start gap-4 shadow-2xl">
            <span className="material-symbols-outlined text-white text-4xl">auto_awesome</span>
            <div className="h-2 w-1/2 bg-white/30 rounded-full"></div>
            <div className="h-2 w-full bg-white/25 rounded-full"></div>
            <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
          </div>
          {/* Center Brand */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/20 backdrop-blur-2xl flex items-center justify-center shadow-2xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white tracking-tight">StudySync</h1>
              <p className="text-white/80 mt-2">Elevate your academic workflow</p>
            </div>
          </div>
          {/* Bottom Floating Badge */}
          <div className="absolute bottom-10 left-0 w-56 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-400/25 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            </div>
            <div>
              <div className="h-2 w-20 bg-white/30 rounded-full mb-2"></div>
              <div className="h-2 w-12 bg-white/25 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 z-20">
          <p className="text-xs uppercase tracking-widest text-white/60 font-bold">Trusted by 2M+ Students</p>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="w-full md:w-1/2 h-full flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute top-6 left-6 md:hidden">
          <span className="text-xl font-bold text-primary tracking-tight">StudySync</span>
        </div>
        <div className="w-full max-w-[400px] space-y-6 my-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-on-background">Create Account</h2>
            <p className="text-sm text-on-surface-variant">Start your journey to organized study habits.</p>
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full px-4 py-3 bg-white dark:bg-surface-container-high border border-outline-variant/50 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none text-sm text-[#1b1b24] dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@rivers.com"
                className="w-full px-4 py-3 bg-white dark:bg-surface-container-high border border-outline-variant/50 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none text-sm text-[#1b1b24] dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 bg-white dark:bg-surface-container-high border border-outline-variant/50 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none text-sm text-[#1b1b24] dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant" htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-surface-container-high border border-outline-variant/50 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none text-sm text-[#1b1b24] dark:text-white"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:underline" to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
