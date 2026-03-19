import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Users, Star, Loader2, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { Team } from '../types';
import { db, collection, query, orderBy, onSnapshot, doc, deleteDoc, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Leaderboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Check admin status
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && (user.email === 'varunksbennur@gmail.com' || user.email === 'gmu@admin.com' || user.email?.endsWith('@admin.com'))) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // Fetch teams
    const q = query(collection(db, 'teams'), orderBy('totalScore', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      })) as Team[];
      setTeams(teamsData);
      setLoading(false);
    }, (error) => {
      console.error('Leaderboard error:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, []);

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!isAdmin) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'teams', teamId));
      setDeleteConfirm(null);
      // Teams will automatically update via onSnapshot
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && teams.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const topTeam = teams[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">Tech Carnival 2026 - Brain Quest</p>
          <h1 className="text-4xl font-black tracking-tight italic uppercase">Leaderboard</h1>
          <p className="text-gray-500 mt-2">Real-time rankings of all participating teams in Brain Quest.</p>
        </div>
        <div className="flex items-center space-x-2 px-6 py-3 bg-white border border-black/5 rounded-2xl font-bold shadow-sm">
          <RefreshCw size={18} className="text-emerald-500" />
          <span>Live Updates</span>
        </div>
      </div>

      {/* Winner Spotlight */}
      <AnimatePresence>
        {topTeam && topTeam.totalScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Trophy size={200} />
            </div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center space-x-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-amber-400 font-black uppercase tracking-widest text-sm border border-white/10">
                <Star size={16} fill="currentColor" />
                <span>Current Leader</span>
                <Star size={16} fill="currentColor" />
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                {topTeam.name}
              </h2>
              
              <div className="text-2xl font-light text-gray-400">
                🏆 Brain Quest Winner
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-black">{topTeam.totalScore}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Score</div>
                </div>
                <div className="w-px h-12 bg-white/10 hidden sm:block" />
                <div className="text-center">
                  <div className="text-4xl font-black">{topTeam.scores.quiz}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Quiz</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black">{topTeam.scores.logo}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Logo</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black">{topTeam.scores.debug}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Debug</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black">{topTeam.scores.optimization}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Opt</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rankings Table */}
      <div className="bg-white rounded-[3rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-black/5">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Rank</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Team & Members</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Quiz</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Logo</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Debug</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Opt</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Total Score</th>
                {isAdmin && <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {teams.map((team, index) => (
                <tr key={team._id} className={`hover:bg-gray-50/50 transition-colors ${index === 0 ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg
                        ${index === 0 ? 'bg-amber-400 text-white' : 
                          index === 1 ? 'bg-gray-300 text-white' : 
                          index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-400'}
                      `}>
                        {index + 1}
                      </div>
                      {index === 0 && <Medal className="text-amber-400" size={24} />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-lg">{team.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {team.member1}{team.member2 ? `, ${team.member2}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center font-medium">{team.scores.quiz}</td>
                  <td className="px-6 py-6 text-center font-medium">{team.scores.logo}</td>
                  <td className="px-6 py-6 text-center font-medium">{team.scores.debug}</td>
                  <td className="px-6 py-6 text-center font-medium">{team.scores.optimization}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-2xl font-black text-xl">
                      {team.totalScore}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-6 text-center">
                      {deleteConfirm === team._id ? (
                        <div className="flex items-center justify-center space-x-2">
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
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Team"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-8 py-20 text-center text-gray-400 italic">
                    No teams registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
