import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ADMIN_EMAIL = 'admin@ncc.it';
  const ADMIN_PASS = 'BairesMBadmin2015';
  const DRIVER_DEFAULT_PASS = 'driver123';

  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('ncc_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
    }
    return [
      {
        email: ADMIN_EMAIL,
        password: ADMIN_PASS,
        role: 'admin',
        name: 'Admin User',
      },
    ];
  };

  const saveUsers = (users) => {
    try {
      localStorage.setItem('ncc_users', JSON.stringify(users));
    } catch {
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('ncc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      const users = getStoredUsers();
      saveUsers(users);
    }
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers();
        const found = users.find(
          (u) => u.email === email && u.password === password
        );
        if (!found) {
          reject(new Error('Invalid credentials'));
          return;
        }
        const { password: _password, ...userData } = found;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('ncc_user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ncc_user');
  };

  const createAdmin = (newAdminData) => {
    const users = getStoredUsers();
    const exists = users.some((u) => u.email === newAdminData.email);
    if (exists) {
      return Promise.reject(new Error('User with this email already exists'));
    }
    const newUser = {
      email: newAdminData.email,
      password: DRIVER_DEFAULT_PASS,
      role: 'driver',
      name: newAdminData.name || newAdminData.email.split('@')[0],
    };
    const nextUsers = [...users, newUser];
    saveUsers(nextUsers);
    return Promise.resolve(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, createAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
