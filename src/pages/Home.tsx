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
    { 
      name: "Technical Quiz", 
      marks: 30, 
      icon: Zap, 
      color: "bg-amber-100 text-amber-600",
      description: "Test your foundational knowledge in computer science, programming languages, and emerging technologies.",
      rules: ["30 Multiple Choice Questions", "1 mark for each correct answer", "No negative marking", "Time limit: 15 minutes"]
    },
    { 
      name: "Logo Identification", 
      marks: 20, 
      icon: Target, 
      color: "bg-blue-100 text-blue-600",
      description: "Identify popular tech company logos, programming language icons, and software tools.",
      rules: ["10 Image-based Questions", "2 marks for each correct answer", "No negative marking", "Time limit: 30 minutes"]
    },
    { 
      name: "Debugging Round", 
      marks: 30, 
      icon: Code, 
      color: "bg-emerald-100 text-emerald-600",
      description: "Find and fix bugs in provided code snippets across various programming languages.",
      rules: ["15 Debugging Challenges", "2 marks for each correct fix", "No negative marking", "Time limit: 25 minutes"]
    },
    { 
      name: "Optimization Round", 
      marks: 20, 
      icon: Trophy, 
      color: "bg-purple-100 text-purple-600",
      description: "Analyze code snippets and choose the most optimal solution or identify the time complexity.",
      rules: ["10 Optimization Problems", "2 marks for each correct answer", "No negative marking", "Time limit: 30 minutes"]
    }
  ];

  const schedule = [
    { time: "09:00 AM - 10:00 AM", event: "Inauguration & Welcome Address", description: "Kickoff Tech Carnival 2026 at the Main Auditorium." },
    { time: "10:00 AM", event: "Round 1: Technical Quiz", description: "15-minute simultaneous online quiz for all registered teams." },
    { time: "10:45 AM", event: "Round 2: Logo Identification", description: "30-minute fast-paced visual recognition round." },
    { time: "11:45 AM", event: "Round 3: Debugging Round", description: "25-minute code fixing challenges." },
    { time: "12:45 PM", event: "Round 4: Optimization Round", description: "30-minute final showdown for the top teams." }
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
            <div className="mb-6 space-y-4 flex flex-col items-center">
              <img src="https://i.ibb.co/zHsdg2Tg/logo.png" alt="GM University Logo" className="h-24 md:h-32 w-auto drop-shadow-2xl" referrerPolicy="no-referrer" />
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-indigo-400 tracking-widest uppercase">
                  Tech Carnival 2026
                </h2>
                <p className="text-sm md:text-base text-gray-400 font-medium tracking-wide uppercase">
                  Organized by Faculty of Computing and IT, GM University, Davanagere
                  <br />
                  <span className="text-indigo-300 font-bold mt-2 inline-block">Date: 27-03-2026</span>
                </p>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
              Brain Quest
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl mx-auto mt-6">
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

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-indigo-600 text-white p-10 md:p-14 rounded-[3rem] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-sm font-bold tracking-widest uppercase text-indigo-200 mb-2">The Main Event</h2>
              <h3 className="text-3xl md:text-4xl font-black italic uppercase mb-6">Tech Carnival 2026</h3>
              <p className="text-indigo-100 leading-relaxed text-lg mb-6">
                Organized by the Faculty of Computing and IT at GM University, Davanagere, Tech Carnival 2026 is the premier technical symposium of the year. 
              </p>
              <p className="text-indigo-100 leading-relaxed text-lg">
                It brings together the brightest minds to showcase their skills, innovate, and compete across various technical domains. Join us for a celebration of technology, creativity, and excellence.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-black/5 p-10 md:p-14 rounded-[3rem] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Trophy size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-2">The Flagship Competition</h2>
              <h3 className="text-3xl md:text-4xl font-black italic uppercase mb-6">Brain Quest</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                As the flagship event of Tech Carnival 2026, Brain Quest is a multi-round technical showdown designed to push your limits.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Test your knowledge, speed, and precision through intense rounds of Technical Quizzes, Logo Identification, Debugging, and Code Optimization. Only the sharpest teams will emerge victorious.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rounds Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Competition Rounds</h2>
          <p className="text-gray-500 mt-2">Four challenging rounds to determine the ultimate champions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rounds.map((round, idx) => (
            <motion.div
              key={round.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${round.color} rounded-2xl flex items-center justify-center`}>
                  <round.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Max Score</p>
                  <div className="text-2xl font-black text-indigo-600">{round.marks}</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{round.name}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{round.description}</p>
              
              <div className="bg-gray-50 rounded-2xl p-5 border border-black/5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Round Rules</h4>
                <ul className="space-y-2">
                  {round.rules.map((rule, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Schedule Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-black/5 shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Event Schedule</h2>
            <p className="text-gray-500 mt-2">Timeline of events for Tech Carnival 2026 - Brain Quest.</p>
          </div>
          
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-indigo-100 transform md:-translate-x-1/2"></div>
            
            <div className="space-y-8">
              {schedule.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-indigo-600 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 mt-1.5 md:mt-0 shadow-[0_0_0_4px_white]"></div>
                  
                  {/* Content Box */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-black/5 hover:border-indigo-100 transition-colors">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-3">
                        {item.time}
                      </span>
                      <h4 className="text-lg font-bold mb-2">{item.event}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
            Registration is open for a limited time. Form your team and secure your spot in Tech Carnival 2026 - Brain Quest.
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
