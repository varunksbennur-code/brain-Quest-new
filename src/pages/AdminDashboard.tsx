import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Edit3, Save, X, Search, Loader2, AlertCircle, Plus, Trash2, Upload, Settings, Play, Square } from 'lucide-react';
import { Team, Coordinator, GlobalSettings, Question } from '../types';
import { db, collection, onSnapshot, query, orderBy, doc, updateDoc, auth, addDoc, deleteDoc, setDoc, getDoc } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'coordinators' | 'rounds'>('teams');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editScores, setEditScores] = useState({
    quiz: 0,
    logo: 0,
    debug: 0,
    optimization: 0
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Round Settings State
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>('quiz');
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    roundId: 'quiz',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    codeSnippet: '',
    imageUrl: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        if (user.email === 'varunksbennur@gmail.com' || user.email === 'gmu@admin.com' || user.email?.endsWith('@admin.com')) {
          setIsAdmin(true);
        } else {
          setError('Unauthorized access. Admin privileges required.');
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const qTeams = query(collection(db, 'teams'), orderBy('createdAt', 'desc'));
    const unsubscribeTeams = onSnapshot(qTeams, (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      })) as Team[];
      setTeams(teamsData);
      setLoading(false);
    }, (err) => {
      console.error('Fetch teams error:', err);
      setError('Failed to fetch teams. You might not have permission.');
      setLoading(false);
    });

    // Fetch Settings
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setGlobalSettings(docSnap.data() as GlobalSettings);
      } else {
        // Initialize default settings
        const defaultSettings: GlobalSettings = {
          rounds: {
            quiz: { isActive: false, duration: 600 },
            logo: { isActive: false, duration: 300 },
            debug: { isActive: false, duration: 900 },
            optimization: { isActive: false, duration: 1200 }
          }
        };
        setDoc(doc(db, 'settings', 'global'), defaultSettings);
      }
    });

    // Fetch Questions
    const qQuestions = query(collection(db, 'questions'));
    const unsubscribeQuestions = onSnapshot(qQuestions, (snapshot) => {
      const questionsData = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      })) as Question[];
      setQuestions(questionsData);
    });

    // Hardcoded coordinators
    setCoordinators([
      {
        _id: '1',
        name: 'VARUN K S',
        role: 'Faculty Coordinator',
        photoUrl: 'https://i.ibb.co/99mhDWFm/Image-Generator-2026-03-19-4.png',
      },
      {
        _id: '2',
        name: 'Mohammed Hasibullah Khan',
        role: 'Student Coordinator',
        photoUrl: 'https://i.ibb.co/QvZLF66s/Whats-App-Image-2026-03-19-at-7-31-40-PM.jpg'
      },
      {
        _id: '3',
        name: 'Saba Naaz',
        role: 'Student Coordinator',
        photoUrl: 'https://i.ibb.co/pj6vjCHd/Whats-App-Image-2026-03-19-at-7-29-37-PM.jpg'
      }
    ]);

    return () => {
      unsubscribeTeams();
      unsubscribeSettings();
      unsubscribeQuestions();
    };
  }, [isAdmin]);

  const handleEdit = (team: Team) => {
    setEditingTeam(team._id);
    setEditScores({
      quiz: team.scores.quiz,
      logo: team.scores.logo,
      debug: team.scores.debug,
      optimization: team.scores.optimization
    });
  };

  const handleSave = async (teamId: string) => {
    setSaving(true);
    try {
      const teamRef = doc(db, 'teams', teamId);
      const totalScore = editScores.quiz + editScores.logo + editScores.debug + editScores.optimization;
      
      await updateDoc(teamRef, {
        scores: editScores,
        totalScore: totalScore
      });
      
      setEditingTeam(null);
    } catch (err: any) {
      console.error('Update score error:', err);
      alert(err.message || 'Failed to update scores');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!window.confirm(`Are you sure you want to delete the team "${teamName}"? This action cannot be undone.`)) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'teams', teamId));
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Delete team error:', err);
      alert('Failed to delete team');
    } finally {
      setDeleting(false);
    }
  };
    if (!globalSettings) return;
    try {
      const currentStatus = globalSettings.rounds[roundId].isActive;
      const updates: any = {
        [`rounds.${roundId}.isActive`]: !currentStatus
      };
      
      if (!currentStatus) {
        // Round is being activated, set the start time
        updates[`rounds.${roundId}.startTime`] = Date.now();
      }
      
      await updateDoc(doc(db, 'settings', 'global'), updates);
    } catch (err: any) {
      console.error('Toggle round error:', err);
      alert('Failed to toggle round status');
    }
  };

  const updateRoundDuration = async (roundId: keyof GlobalSettings['rounds'], duration: number) => {
    try {
      await updateDoc(doc(db, 'settings', 'global'), {
        [`rounds.${roundId}.duration`]: duration
      });
    } catch (err: any) {
      console.error('Update duration error:', err);
      alert('Failed to update round duration');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.correctAnswer) return;
    
    try {
      await addDoc(collection(db, 'questions'), {
        ...newQuestion,
        roundId: selectedRound
      });
      setNewQuestion({
        roundId: selectedRound,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        codeSnippet: '',
        imageUrl: ''
      });
    } catch (err: any) {
      console.error('Add question error:', err);
      alert('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteDoc(doc(db, 'questions', questionId));
    } catch (err: any) {
      console.error('Delete question error:', err);
      alert('Failed to delete question');
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.member1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.member2?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight italic uppercase">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage teams, scores, rounds, and event coordinators.</p>
        </div>
        
        {activeTab === 'teams' && (
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teams or members..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex space-x-4 border-b border-black/5 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'teams' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Teams & Scores
        </button>
        <button
          onClick={() => setActiveTab('rounds')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'rounds' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Rounds & Questions
        </button>
        <button
          onClick={() => setActiveTab('coordinators')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'coordinators' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Event Coordinators
        </button>
      </div>

      {error && (
        <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] flex items-center space-x-4 border border-red-100">
          <AlertCircle size={24} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-black/5">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Team Details</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Quiz (30)</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Logo (20)</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Debug (30)</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Opt (20)</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Total</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredTeams.map((team) => (
                  <tr key={team._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-lg">{team.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {team.member1}{team.member2 ? `, ${team.member2}` : ''}
                      </div>
                    </td>
                    
                    {editingTeam === team._id ? (
                      <>
                        <td className="px-4 py-6">
                          <input
                            type="number"
                            max={30}
                            className="w-20 mx-auto block px-3 py-2 border border-black/10 rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={editScores.quiz}
                            onChange={(e) => setEditScores({ ...editScores, quiz: Number(e.target.value) })}
                          />
                        </td>
                        <td className="px-4 py-6">
                          <input
                            type="number"
                            max={20}
                            className="w-20 mx-auto block px-3 py-2 border border-black/10 rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={editScores.logo}
                            onChange={(e) => setEditScores({ ...editScores, logo: Number(e.target.value) })}
                          />
                        </td>
                        <td className="px-4 py-6">
                          <input
                            type="number"
                            max={30}
                            className="w-20 mx-auto block px-3 py-2 border border-black/10 rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={editScores.debug}
                            onChange={(e) => setEditScores({ ...editScores, debug: Number(e.target.value) })}
                          />
                        </td>
                        <td className="px-4 py-6">
                          <input
                            type="number"
                            max={20}
                            className="w-20 mx-auto block px-3 py-2 border border-black/10 rounded-lg text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={editScores.optimization}
                            onChange={(e) => setEditScores({ ...editScores, optimization: Number(e.target.value) })}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-6 text-center font-medium">{team.scores.quiz}</td>
                        <td className="px-6 py-6 text-center font-medium">{team.scores.logo}</td>
                        <td className="px-6 py-6 text-center font-medium">{team.scores.debug}</td>
                        <td className="px-6 py-6 text-center font-medium">{team.scores.optimization}</td>
                      </>
                    )}
                    
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl font-black">
                        {editingTeam === team._id 
                          ? editScores.quiz + editScores.logo + editScores.debug + editScores.optimization
                          : team.totalScore
                        }
                      </div>
                    </td>
                    
                    <td className="px-8 py-6 text-right">
                      {editingTeam === team._id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSave(team._id)}
                            disabled={saving}
                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                            title="Save"
                          >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                          </button>
                          <button
                            onClick={() => setEditingTeam(null)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Cancel"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(team)}
                            className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all"
                            title="Edit Scores"
                          >
                            <Edit3 size={20} />
                          </button>
                          {deleteConfirm === team._id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDeleteTeam(team._id, team.name)}
                                disabled={deleting}
                                className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleting ? 'Deleting...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-lg hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(team._id)}
                              className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                              title="Delete Team"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-gray-400 italic">
                      No teams found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rounds' && globalSettings && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(globalSettings.rounds) as Array<keyof GlobalSettings['rounds']>).map((roundId) => {
              const round = globalSettings.rounds[roundId];
              return (
                <div key={roundId} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold capitalize">{roundId}</h3>
                    <button
                      onClick={() => toggleRound(roundId)}
                      className={`p-2 rounded-xl transition-colors ${
                        round.isActive 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      }`}
                      title={round.isActive ? "Stop Round" : "Start Round"}
                    >
                      {round.isActive ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Status:</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      round.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {round.isActive ? 'Active' : 'Stopped'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Timer (seconds)</label>
                    <input
                      type="number"
                      value={round.duration}
                      onChange={(e) => updateRoundDuration(roundId, parseInt(e.target.value) || 600)}
                      className="w-full px-4 py-2 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Manage Questions</h2>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="px-4 py-2 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              >
                <option value="quiz">Quiz Round</option>
                <option value="logo">Logo Round</option>
                <option value="debug">Debug Round</option>
                <option value="optimization">Optimization Round</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Add Question Form */}
              <form onSubmit={handleAddQuestion} className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2">Add New Question</h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Question Text</label>
                  <textarea
                    required
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                    placeholder="Enter the question..."
                  />
                </div>

                {(selectedRound === 'debug' || selectedRound === 'optimization') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Code Snippet (Optional)</label>
                    <textarea
                      value={newQuestion.codeSnippet}
                      onChange={(e) => setNewQuestion({...newQuestion, codeSnippet: e.target.value})}
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm min-h-[150px]"
                      placeholder="Enter code snippet here..."
                    />
                  </div>
                )}

                {selectedRound === 'logo' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image URL (Required for Logo Round)</label>
                    <input
                      required
                      type="url"
                      value={newQuestion.imageUrl || ''}
                      onChange={(e) => setNewQuestion({...newQuestion, imageUrl: e.target.value})}
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Options</label>
                  {newQuestion.options?.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <span className="font-bold text-gray-400 w-6">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        required
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(newQuestion.options || [])];
                          newOpts[idx] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOpts});
                        }}
                        className="flex-grow px-4 py-2 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder={`Option ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correct Answer</label>
                  <select
                    required
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select correct option...</option>
                    {newQuestion.options?.map((opt, idx) => (
                      opt && <option key={idx} value={opt}>{String.fromCharCode(65 + idx)}: {opt}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Question</span>
                </button>
              </form>

              {/* Questions List */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-2">Existing Questions ({questions.filter(q => q.roundId === selectedRound).length})</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                  {questions.filter(q => q.roundId === selectedRound).map((q, idx) => (
                    <div key={q._id} className="p-4 border border-black/10 rounded-2xl bg-gray-50 relative group">
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Question"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="font-bold mb-2 pr-8">{idx + 1}. {q.question}</div>
                      {q.imageUrl && (
                        <div className="mb-3">
                          <img src={q.imageUrl} alt="Question Image" className="h-20 object-contain rounded-lg border border-black/10" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      {q.codeSnippet && (
                        <pre className="bg-gray-800 text-gray-100 p-3 rounded-xl text-xs overflow-x-auto mb-3">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`p-2 rounded-lg ${opt === q.correctAnswer ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-white border border-black/5 text-gray-600'}`}>
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {questions.filter(q => q.roundId === selectedRound).length === 0 && (
                    <div className="text-center py-12 text-gray-400 italic">
                      No questions added for this round yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coordinators' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Event Coordinators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coordinators.map((coordinator) => (
              <div key={coordinator._id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex items-center space-x-4">
                <img
                  src={coordinator.photoUrl}
                  alt={coordinator.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{coordinator.name}</h3>
                  <p className="text-gray-500 text-sm">{coordinator.role}</p>
                </div>
              </div>
            ))}
            {coordinators.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 italic bg-white rounded-[2rem] border border-black/5">
                No coordinators added yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
