import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Target, Code2, Cpu, Zap, Loader2, LogOut, Clock } from 'lucide-react';
import { auth, db, doc, onSnapshot, signOut } from '../firebase';
import { Team, GlobalSettings } from '../types';
import { onAuthStateChanged } from 'firebase/auth';

const CountdownTimer = ({ duration, startTime }: { duration: number, startTime?: number }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!startTime) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsedSeconds);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, startTime]);

  if (timeLeft <= 0) {
    return (
      <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
        Time's Up
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-gray-500 text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
      <Clock size={14} />
      <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
    </div>
  );
};

export default function UserDashboard() {
  const [team, setTeam] = useState<Team | null>(null);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeDoc) unsubscribeDoc();
      if (unsubscribeSettings) unsubscribeSettings();

      if (!user) {
        navigate('/login');
        return;
      }

      unsubscribeDoc = onSnapshot(doc(db, 'teams', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setTeam({ _id: docSnap.id, ...docSnap.data() } as Team);
        } else {
          console.error("No team document found for user");
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching team:", error);
        setLoading(false);
      });

      unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          setGlobalSettings(docSnap.data() as GlobalSettings);
        }
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col space-y-4">
        <p className="text-xl text-gray-500">Team not found.</p>
        <button onClick={handleLogout} className="text-indigo-600 font-bold">Log out</button>
      </div>
    );
  }

  const rounds = [
    {
      id: 'quiz',
      title: 'Tech Quiz',
      icon: <Zap size={24} />,
      description: 'General computer science and programming trivia.',
      score: team.scores.quiz,
      maxScore: 30,
      color: 'bg-blue-100 text-blue-600',
      path: '/round/quiz'
    },
    {
      id: 'logo',
      title: 'Logo Identification',
      icon: <Target size={24} />,
      description: 'Identify the logos of popular tech companies and tools.',
      score: team.scores.logo,
      maxScore: 20,
      color: 'bg-emerald-100 text-emerald-600',
      path: '/round/logo'
    },
    {
      id: 'debug',
      title: 'Debugging',
      icon: <Code2 size={24} />,
      description: 'Find and fix the bugs in the provided code snippets.',
      score: team.scores.debug,
      maxScore: 30,
      color: 'bg-amber-100 text-amber-600',
      path: '/round/debug'
    },
    {
      id: 'optimization',
      title: 'Optimization',
      icon: <Cpu size={24} />,
      description: 'Analyze and optimize the time complexity of algorithms.',
      score: team.scores.optimization,
      maxScore: 20,
      color: 'bg-purple-100 text-purple-600',
      path: '/round/optimization'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">Tech Carnival 2026 - Brain Quest</div>
          <h1 className="text-4xl font-black tracking-tight italic uppercase">Welcome, {team.name}</h1>
          <p className="text-gray-500 mt-1">Total Score: <span className="font-bold text-black">{team.totalScore}</span> / 100</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-black/5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rounds.map((round, index) => {
          const isCompleted = team.completedRounds?.includes(round.id) || round.score > 0;
          const roundSettings = globalSettings?.rounds[round.id as keyof GlobalSettings['rounds']];
          const isActive = roundSettings?.isActive || false;
          const duration = roundSettings?.duration || 0;
          
          const now = Date.now();
          const elapsedSeconds = roundSettings?.startTime ? Math.floor((now - roundSettings.startTime) / 1000) : 0;
          const remainingTime = Math.max(0, duration - elapsedSeconds);
          const isTimeUp = roundSettings?.startTime ? remainingTime <= 0 : false;
          
          const isDisabled = isCompleted || !isActive || isTimeUp;

          return (
            <motion.div
              key={round.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${
                isCompleted ? 'bg-gray-50 border-black/5 opacity-75' : 'bg-white border-black/10 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${round.color}`}>
                  {round.icon}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {isCompleted && (
                    <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                      Score: {round.score} / {round.maxScore}
                    </div>
                  )}
                  {!isCompleted && isActive && duration > 0 && (
                    <CountdownTimer duration={duration} startTime={roundSettings?.startTime} />
                  )}
                  {!isCompleted && !isActive && !isTimeUp && (
                    <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                      Round Not Active
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{round.title}</h3>
              <p className="text-gray-500 mb-8">{round.description}</p>
              
              <button
                onClick={() => navigate(round.path)}
                disabled={isDisabled}
                className={`w-full py-4 font-bold rounded-2xl transition-all ${
                  isDisabled 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isCompleted ? 'Round Completed' : (!isActive ? 'Waiting for Admin...' : 'Start Round')}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
