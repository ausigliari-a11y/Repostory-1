import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Car, LogIn, LogOut, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-navy-900/90 backdrop-blur-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-gold-500 transition-colors">
            <Car className="h-8 w-8 text-gold-500" />
            <span className="text-xl font-bold tracking-wider">LOMBARDIA <span className="text-gold-500">NCC</span> CLASS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
            <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About Us</a>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/admin" className="flex items-center gap-2 text-gold-500 hover:text-gold-400">
                  <Shield className="h-4 w-4" />
                  {user?.role === 'admin' ? 'Admin Dashboard' : 'Driver Dashboard'}
                </Link>
                <Button variant="outline" onClick={handleLogout} className="py-2 px-4 text-sm">
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" className="py-2 px-4 text-sm">
                  <LogIn className="h-4 w-4" /> Client Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
