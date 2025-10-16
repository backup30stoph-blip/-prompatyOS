import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const { login, profile } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-center text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Card>
            <form onSubmit={handleLogin} className="p-8 space-y-6">
                 {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password_unc" className="block text-sm font-medium text-gray-700 mb-1">
                        كلمة المرور
                    </label>
                    <Input
                        id="password_unc"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
