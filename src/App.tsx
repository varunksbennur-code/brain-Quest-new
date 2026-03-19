import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Trophy, Users, Shield, Home as HomeIcon, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import HomePage from './pages/Home';
import RegisterPage from './pages/Register';
import UserLoginPage from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import ActiveRound from './pages/ActiveRound';
import AdminLoginPage from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LeaderboardPage from './pages/Leaderboard';
import LogoQuizPage from './pages/LogoQuiz';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && (currentUser.email === 'varunksbennur@gmail.com' || currentUser.email?.endsWith('@admin.com'))) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-indigo-600 leading-none">TECH CARNIVAL 2026</p>
                <p className="text-sm font-bold tracking-tight leading-none">Brain Quest</p>
              </div>
              <div className="sm:hidden">
                <span className="text-lg font-bold tracking-tight">Brain Quest</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-black font-medium transition-colors flex items-center space-x-1"
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
            
            {!user && (
              <>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-black font-medium transition-colors flex items-center space-x-1"
                >
                  <Users size={18} />
                  <span>Register</span>
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-black font-medium transition-colors flex items-center space-x-1"
                >
                  <User size={18} />
                  <span>Team Login</span>
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                  <Link to="/admin" className="text-indigo-600 font-semibold">Admin Dashboard</Link>
                ) : (
                  <Link to="/dashboard" className="text-emerald-600 font-semibold">My Dashboard</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-gray-400 hover:text-black transition-colors"
                title="Admin Login"
              >
                <Shield size={20} />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-black p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <link.icon size={20} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              ))}
              
              {!user && (
                <>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <Users size={20} />
                      <span>Register</span>
                    </div>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <User size={20} />
                      <span>Team Login</span>
                    </div>
                  </Link>
                </>
              )}

              {user ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-600 hover:bg-emerald-50"
                    >
                      My Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/round/:roundId" element={<ActiveRound />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/quiz" element={<LogoQuizPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-black/5 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Brain Quest Competition. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
