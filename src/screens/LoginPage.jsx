import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../store/useAppStore';
import { login } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuthToken = useAppStore((s) => s.setAuthToken);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }

      const data = await login(email, password);

      setAuthToken(data.token);
      setCurrentUser(data.user);
      toast.success(`Welcome, Dr. ${data.user.name}`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <Stethoscope className="w-10 h-10 text-cyan" />
            <span className="text-4xl font-bold text-offwhite tracking-tight">
              Kast<span className="text-cyan">Hunt</span>
            </span>
          </div>
          <p className="text-offwhite/50 text-sm">Clinical Scribe Platform</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-navy/80 border border-offwhite/10 rounded-2xl p-8 shadow-2xl space-y-6"
          noValidate
        >
          <h2 className="text-xl font-semibold text-offwhite text-center">
            Sign in to your account
          </h2>

          {error && (
            <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-offwhite/30" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3 bg-offwhite/5 border border-offwhite/10 rounded-lg text-offwhite placeholder:text-offwhite/30 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition"
                autoComplete="email"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-offwhite/30" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3 bg-offwhite/5 border border-offwhite/10 rounded-lg text-offwhite placeholder:text-offwhite/30 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan text-navy font-semibold rounded-lg hover:bg-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
