import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Car, Loader2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-300 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-navy-800 p-8 rounded-2xl border border-navy-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-navy-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-navy-700">
              <Car className="h-8 w-8 text-gold-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-sm text-slate-400 mt-2">Access the management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};
