import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Code, Target, Users } from 'lucide-react';

export default function Home() {
  // Hardcoded coordinators list
  const coordinators = [
    {
      _id: '1',
      name: 'VARUN K S',
      role: 'Faculty Coordinator',
      photoUrl: 'https://i.ibb.co/99mhDWFm/Image-Generator-2026-03-19-4.png'
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
  ];

  const rounds = [
    { name: "Technical Quiz", marks: 30, icon: Zap, color: "bg-amber-100 text-amber-600" },
    { name: "Logo Identification", marks: 20, icon: Target, color: "bg-blue-100 text-blue-600" },
    { name: "Debugging Round", marks: 30, icon: Code, color: "bg-emerald-100 text-emerald-600" },
    { name: "Optimization Round", marks: 20, icon: Trophy, color: "bg-purple-100 text-purple-600" }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
              Brain Quest
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl mx-auto mt-4">
              The ultimate technical showdown. Test your knowledge, speed, and precision in the most awaited competition of the year.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Register Your Team
            </Link>
            <Link 
              to="/leaderboard" 
              className="px-8 py-4 border border-white/30 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              View Leaderboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Rounds Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Competition Rounds</h2>
          <p className="text-gray-500 mt-2">Four challenging rounds to determine the ultimate champions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rounds.map((round, idx) => (
            <motion.div
              key={round.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${round.color} rounded-2xl flex items-center justify-center mb-6`}>
                <round.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{round.name}</h3>
              <p className="text-gray-500 text-sm mb-4">Maximum Score</p>
              <div className="text-3xl font-black">{round.marks} Marks</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coordinators Section */}
      {coordinators.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 border border-black/5 shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight mb-4 italic">Event Coordinators</h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                Our dedicated team of coordinators are here to ensure a smooth and fair competition for all participants.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coordinators.map((coordinator) => (
                <div key={coordinator._id} className="text-center space-y-4">
                  <img 
                    src={coordinator.photoUrl} 
                    alt={coordinator.name}
                    className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-indigo-50 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-xl">{coordinator.name}</h4>
                    <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">{coordinator.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-indigo-600 rounded-[3rem] p-16 text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to take the challenge?</h2>
          <p className="text-indigo-100 mb-10 max-w-xl mx-auto">
            Registration is open for a limited time. Form your team and secure your spot in Brain Quest 2026.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-2 px-10 py-5 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-all"
          >
            <Users size={20} />
            <span>Register Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
