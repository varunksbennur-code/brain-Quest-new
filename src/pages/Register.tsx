import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { db, doc, setDoc, auth, createUserWithEmailAndPassword } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    member1: '',
    member2: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user with email and password
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const teamId = result.user.uid;
      
      const teamRef = doc(db, 'teams', teamId);
      
      await setDoc(teamRef, {
        name: formData.name,
        email: formData.email,
        member1: formData.member1,
        member2: formData.member2 || '',
        scores: {
          quiz: 0,
          logo: 0,
          debug: 0,
          optimization: 0
        },
        totalScore: 0,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in Firebase Console.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-md w-full border border-black/5"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-500 mb-8">Your team "{formData.name}" has been registered. Redirecting to your dashboard...</p>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="bg-emerald-500 h-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-wider">
            <UserPlus size={16} />
            <span>Join the Quest</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight italic">
            Register Your Team
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
            Form a team of 1 or 2 members and compete for the title of Tech Carnival 2026 - Brain Quest Champion. Make sure your team name is unique and catchy!
          </p>
          
          <div className="space-y-6 pt-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">1</div>
              <p className="text-gray-600">Choose a unique team name that represents your group.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">2</div>
              <p className="text-gray-600">Provide your team members' names.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">3</div>
              <p className="text-gray-600">Create an account with your email and password to access your dashboard.</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-black/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-3 text-sm font-medium border border-red-100">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Team Name</label>
              <input
                required
                type="text"
                placeholder="Enter a unique team name"
                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Email</label>
              <input
                required
                type="email"
                placeholder="team@example.com"
                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                minLength={6}
                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Member 1 (Primary)</label>
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={formData.member1}
                onChange={(e) => setFormData({ ...formData, member1: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Member 2 (Optional)</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={formData.member2}
                onChange={(e) => setFormData({ ...formData, member2: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Register Team</span>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Already registered? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in here</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
