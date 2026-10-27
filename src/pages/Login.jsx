import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudy } from '../context/useStudy';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useStudy();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    const success = loginUser(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid login details.');
    }
  };

  const handleGoogleLogin = () => {
    // Mock login
    loginUser('alex@rivers.com', 'password');
    navigate('/dashboard');
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
      <section className="w-full md:w-1/2 h-full flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6 md:hidden">
          <span className="text-xl font-bold text-primary tracking-tight">StudySync</span>
        </div>
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-on-background">Sign In</h2>
            <p className="text-sm text-on-surface-variant">Access your dashboard and focus sessions.</p>
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant" htmlFor="password">Password</label>
                <a className="text-xs text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-surface-container-high border border-outline-variant/50 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none text-sm text-[#1b1b24] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant/50 text-primary focus:ring-primary cursor-pointer"
              />
              <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember this device</label>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200"
              >
                Sign In
              </button>

              <div className="relative flex items-center justify-center py-2">
                <span className="absolute px-4 bg-background text-[10px] uppercase tracking-wider text-outline font-semibold">Or continue with</span>
                <div className="w-full h-px bg-outline-variant/30"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-white dark:bg-surface-container-high border border-outline-variant/50 flex items-center justify-center gap-3 rounded-xl text-sm font-semibold text-[#1b1b24] dark:text-white hover:bg-surface-container-low transition-all duration-200 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google Login
              </button>
            </div>
          </form>

          <div className="text-center pt-4">
            <p className="text-xs text-on-surface-variant">
              Don't have an account?{' '}
              <Link className="text-primary font-bold hover:underline" to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
