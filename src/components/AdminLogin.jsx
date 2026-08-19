import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaExclamationCircle, FaLock, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { supabase } from '../supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/certificate-admin';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    let active = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (active) {
        setSession(currentSession);
        setCheckingSession(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (active) {
        setSession(currentSession);
        setCheckingSession(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message || 'Unable to sign in. Please check your credentials.');
      setSubmitting(false);
      return;
    }

    navigate(destination, { replace: true });
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-violet-300" role="status">
        <FaSpinner className="animate-spin text-3xl" aria-hidden="true" />
        <span className="sr-only">Checking authentication</span>
      </div>
    );
  }

  if (session) {
    return <Navigate to={destination} replace />;
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 pb-20 pt-28 text-white">
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="glass-card relative w-full max-w-md rounded-2xl p-6 sm:p-8">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-2xl text-violet-300">
            <FaShieldAlt aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-black">Admin <span className="gradient-text">Login</span></h1>
          <p className="mt-3 text-sm text-gray-400">Sign in to manage student certificates.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300" role="alert">
            <FaExclamationCircle className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-gray-300">Email address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 outline-none transition focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60" placeholder="admin@example.com" />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 outline-none transition focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60" placeholder="Enter your password" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 font-bold shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60">
            {submitting && <FaSpinner className="animate-spin" aria-hidden="true" />}
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </section>
  );
}
