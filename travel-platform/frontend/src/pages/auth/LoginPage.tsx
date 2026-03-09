import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      {error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{error}</div>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded border p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="flex w-full items-center justify-center rounded bg-sky-600 p-2 text-white" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm">Don't have an account? <Link to="/register" className="text-sky-600">Register</Link></p>
    </div>
  );
}
