import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ChevronRight, Timer } from 'lucide-react';
import { auth, db, doc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Question, GlobalSettings } from '../types';

export default function ActiveRound() {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let unsubscribeSettings: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setTeamId(user.uid);

      try {
        // Check if team already completed this round
        const teamDoc = await getDoc(doc(db, 'teams', user.uid));
        if (teamDoc.exists()) {
          const data = teamDoc.data();
          const isCompleted = data.completedRounds?.includes(roundId) || (data.scores && data.scores[roundId as string] > 0);
          if (isCompleted) {
            navigate('/dashboard'); // Already completed
            return;
          }
        }

        // Fetch questions for this round
        const qQuery = query(collection(db, 'questions'), where('roundId', '==', roundId));
        const qSnapshot = await getDocs(qQuery);
        const fetchedQuestions = qSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as Question));
        
        if (fetchedQuestions.length === 0) {
          alert("No questions found for this round. Please contact the administrator.");
          navigate('/dashboard');
          return;
        }

        // Shuffle questions
        const shuffled = fetchedQuestions.sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
        setLoading(false);

        // Listen to global settings to check if round is active and get duration
        unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (settingsDoc) => {
          if (settingsDoc.exists()) {
            const settings = settingsDoc.data() as GlobalSettings;
            const roundSetting = settings.rounds[roundId as keyof GlobalSettings['rounds']];
            
            if (!roundSetting || !roundSetting.isActive) {
              alert("This round has been stopped by the administrator.");
              navigate('/dashboard'); // Round not active
              return;
            }
            
            const now = Date.now();
            const startTime = roundSetting.startTime || now;
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const remainingTime = Math.max(0, roundSetting.duration - elapsedSeconds);
            
            if (remainingTime <= 0) {
              setTimeLeft(0);
              return;
            }
            
            setTimeLeft(remainingTime);
          } else {
            navigate('/dashboard');
          }
        });

      } catch (error) {
        console.error("Error initializing round:", error);
        navigate('/dashboard');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, [navigate, roundId]);

  useEffect(() => {
    if (timeLeft === null || isFinished || loading) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, loading]);

  const handleTimeUp = async () => {
    setIsFinished(true);
    await saveScore(score);
  };

  const handleNext = async () => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    let newScore = score;
    if (isCorrect) {
      newScore += 1;
      setScore(newScore);
    }
    
    setShowResult(true);
    
    setTimeout(async () => {
      setShowResult(false);
      setSelectedOption('');
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
        await saveScore(newScore);
      }
    }, 2000);
  };

  const saveScore = async (finalScore: number) => {
    if (!teamId || !roundId) return;
    
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (teamDoc.exists()) {
        const data = teamDoc.data();
        
        // Calculate max possible score for this round
        let maxScore = 0;
        if (roundId === 'quiz' || roundId === 'debug') maxScore = 30;
        if (roundId === 'logo' || roundId === 'optimization') maxScore = 20;
        
        // Scale score based on number of questions
        const scaledScore = questions.length > 0 ? Math.round((finalScore / questions.length) * maxScore) : 0;
        
        const newScores = { ...data.scores, [roundId]: scaledScore };
        const newTotal = newScores.quiz + newScores.logo + newScores.debug + newScores.optimization;
        
        const currentCompletedRounds = data.completedRounds || [];
        const newCompletedRounds = currentCompletedRounds.includes(roundId) 
          ? currentCompletedRounds 
          : [...currentCompletedRounds, roundId];

        await updateDoc(teamRef, {
          scores: newScores,
          totalScore: newTotal,
          completedRounds: newCompletedRounds
        });
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-500 font-medium animate-pulse text-center max-w-sm">
          Loading questions...
        </p>
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
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Round Completed!</h2>
          <p className="text-gray-500 mb-8">You got {score} out of {questions.length} correct.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isNextDisabled = showResult || !selectedOption;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black">
            {currentIndex + 1} / {questions.length}
          </div>
          <div>
            <h1 className="text-2xl font-bold capitalize">{roundId} Round</h1>
          </div>
        </div>
        
        {timeLeft !== null && (
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
            <Timer size={20} />
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-sm space-y-8">
        <h2 className="text-xl font-medium leading-relaxed whitespace-pre-wrap">{currentQ.question}</h2>

        {currentQ.imageUrl && (
          <div className="flex justify-center">
            <img 
              src={currentQ.imageUrl} 
              alt="Question Image" 
              className="max-h-64 object-contain rounded-2xl border border-black/5 shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {currentQ.codeSnippet && (
          <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto shadow-inner">
            <pre className="text-gray-100 font-mono text-sm">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div className="space-y-4">
          {currentQ.options?.map((opt, idx) => {
            if (!opt) return null; // Skip empty options
            
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentQ.correctAnswer;
            
            let btnClass = "w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium ";
            
            if (showResult) {
              if (isCorrect) {
                btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else if (isSelected && !isCorrect) {
                btnClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                btnClass += "border-gray-100 bg-gray-50 text-gray-400";
              }
            } else {
              if (isSelected) {
                btnClass += "border-indigo-500 bg-indigo-50 text-indigo-700";
              } else {
                btnClass += "border-gray-200 hover:border-indigo-300 hover:bg-gray-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={showResult}
                onClick={() => setSelectedOption(opt)}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="text-emerald-500" size={20} />}
                  {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4">
          <button
            disabled={isNextDisabled}
            onClick={handleNext}
            className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{currentIndex === questions.length - 1 ? 'Finish Round' : 'Next Question'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
