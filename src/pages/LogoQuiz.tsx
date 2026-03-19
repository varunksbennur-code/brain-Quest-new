import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Timer, CheckCircle2, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Logo } from '../types';
import { db, collection, getDocs } from '../firebase';

export default function LogoQuiz() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'logos'));
        const logosData = snapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data()
        })) as Logo[];
        
        if (logosData.length === 0) {
          // Sample data if Firestore is empty
          setLogos([
            { _id: '1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png', answer: 'Google' },
            { _id: '2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', answer: 'Facebook' },
            { _id: '3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', answer: 'Microsoft' }
          ]);
        } else {
          setLogos(logosData);
        }
      } catch (err) {
        console.error('Failed to fetch logos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  useEffect(() => {
    if (loading || isFinished || showResult) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, isFinished, showResult]);

  const handleNext = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === logos[currentIndex].answer.toLowerCase().trim();
    if (isCorrect) setScore(score + 1);
    
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      setUserAnswer('');
      setTimeLeft(15);
      if (currentIndex < logos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-md w-full border border-black/5"
        >
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-gray-500 mb-8">You identified {score} out of {logos.length} logos correctly.</p>
          <div className="text-5xl font-black mb-8">{Math.round((score / logos.length) * 100)}%</div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const currentLogo = logos[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black">
            {currentIndex + 1}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Logo Identification</h1>
            <p className="text-gray-500 text-sm">Round 2 Practice</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold border transition-colors
          ${timeLeft <= 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-black border-black/5'}
        `}>
          <Timer size={20} className={timeLeft <= 5 ? 'animate-pulse' : ''} />
          <span className="tabular-nums">{timeLeft}s</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-black/5 shadow-sm text-center space-y-12">
        <div className="h-64 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentLogo._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={currentLogo.imageUrl}
              alt="Logo to identify"
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <input
              disabled={showResult}
              type="text"
              placeholder="Who am I?"
              className="w-full px-8 py-5 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xl text-center uppercase tracking-widest"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {userAnswer.toLowerCase().trim() === currentLogo.answer.toLowerCase().trim() ? (
                    <CheckCircle2 className="text-emerald-500" size={32} />
                  ) : (
                    <XCircle className="text-red-500" size={32} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            disabled={showResult || !userAnswer.trim()}
            onClick={handleNext}
            className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>Submit Answer</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        {logos.map((_, idx) => (
          <div 
            key={idx}
            className={`h-2 rounded-full transition-all duration-500
              ${idx === currentIndex ? 'w-8 bg-black' : 
                idx < currentIndex ? 'w-4 bg-emerald-500' : 'w-4 bg-gray-200'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
