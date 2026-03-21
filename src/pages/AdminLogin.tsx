import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Loader2, KeyRound, User } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username !== 'gmu' || password !== 'gmu123') {
      setError('Invalid username or password.');
      setLoading(false);
      return;
    }

    try {
      // We map the simple username to an email for Firebase Auth
      await signInWithEmailAndPassword(auth, 'gmu@admin.com', 'gmu123');
      navigate('/admin');
    } catch (err: any) {
      console.log('Sign in failed, attempting to create user...', err.code);
      
      try {
        // If sign in fails for any reason (user not found, invalid credential), try to create it
        await createUserWithEmailAndPassword(auth, 'gmu@admin.com', 'gmu123');
        navigate('/admin');
      } catch (createErr: any) {
        console.error('Create user error:', createErr);
        
        if (createErr.code === 'auth/email-already-in-use') {
          setError('Invalid credentials. The admin user exists but the password was incorrect.');
        } else if (createErr.code === 'auth/operation-not-allowed' || err.code === 'auth/operation-not-allowed') {
          setError('Please enable "Email/Password" authentication in the Firebase Console (Authentication > Sign-in method).');
        } else {
          setError(createErr.message || err.message || 'Failed to authenticate.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-black/5 max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Admin Access</h1>
          <p className="text-gray-500 mt-2">Sign in to manage Tech Carnival 2026 - Brain Quest.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start space-x-3 text-sm font-medium border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mt-8"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login to Dashboard</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
