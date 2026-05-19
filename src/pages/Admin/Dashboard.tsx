import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, 
  Layers, 
  Users, 
  MessageSquare, 
  Settings, 
  Bell, 
  LogOut, 
  Plus, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  Monitor,
  MousePointer2,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { portfolioData } from '@/src/constants';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from '@/src/lib/utils';

const analyticsData = [
  { name: 'Mon', visits: 400, clicks: 240, engagement: 2400 },
  { name: 'Tue', visits: 300, clicks: 139, engagement: 2210 },
  { name: 'Wed', visits: 200, clicks: 980, engagement: 2290 },
  { name: 'Thu', visits: 278, clicks: 390, engagement: 2000 },
  { name: 'Fri', visits: 189, clicks: 480, engagement: 2181 },
  { name: 'Sat', visits: 239, clicks: 380, engagement: 2500 },
  { name: 'Sun', visits: 349, clicks: 430, engagement: 2100 },
];

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

  const stats = [
    { label: 'Total Visits', value: '12.4k', trend: '+14%', icon: <Monitor /> },
    { label: 'Project Clicks', value: '842', trend: '+8.2%', icon: <MousePointer2 /> },
    { label: 'Feedback', value: '42', trend: '+24%', icon: <MessageSquare /> },
    { label: 'Uptime', value: '99.9%', trend: 'Stable', icon: <Activity /> },
  ];

  return (
    <div className="min-h-screen bg-[#0d1213] text-beige flex flex-col lg:flex-row font-sans">
      {/* Sidebar - becomes top nav on mobile */}
      <aside className="w-full lg:w-72 bg-primary border-b lg:border-b-0 lg:border-r border-white/5 p-6 lg:p-8 flex flex-col gap-8 lg:gap-10 shrink-0">
        <div className="flex items-center justify-between lg:justify-start lg:gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-black text-xl">YR</div>
            <span className="font-bold text-xl tracking-tight">Console</span>
          </div>
          <div className="lg:hidden">
             <button className="p-2 text-beige/50"><Bell size={20}/></button>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {['Overview', 'Projects', 'Testimonials', 'Analytics', 'Feedback', 'Settings'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={cn(
                "flex items-center gap-4 px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === item 
                  ? "bg-accent text-primary shadow-lg shadow-accent/10" 
                  : "text-beige/40 hover:bg-white/5 hover:text-beige"
              )}
            >
              {item === 'Overview' && <BarChart2 size={18} />}
              {item === 'Projects' && <Layers size={18} />}
              {item === 'Testimonials' && <Users size={18} />}
              {item === 'Analytics' && <TrendingUp size={18} />}
              {item === 'Feedback' && <MessageSquare size={18} />}
              {item === 'Settings' && <Settings size={18} />}
              <span className="lg:inline">{item}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-8 border-t border-white/5 mt-auto">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 sm:p-8 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 md:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Portfolio {activeTab}</h1>
            <p className="text-beige/40 font-medium">Welcome back, {user?.email.split('@')[0]}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex p-3 rounded-2xl glass-panel relative">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-primary" />
            </button>
            <button className="flex-grow sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-accent text-primary rounded-2xl font-bold text-sm shadow-lg shadow-accent/20">
                <Plus size={18} />
                <span className="whitespace-nowrap">New {activeTab.slice(0, -1)}</span>
            </button>
            <button onClick={logout} className="lg:hidden p-3 bg-red-400/10 text-red-400 rounded-2xl">
               <LogOut size={20} />
            </button>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            {stat.icon}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-beige/40 mb-4">{stat.label}</div>
                        <div className="text-3xl sm:text-4xl font-black mb-2">{stat.value}</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-accent">
                            <ArrowUpRight size={14} />
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
                <div className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem]">
                    <div className="flex items-center justify-between mb-8 md:mb-10">
                        <h3 className="text-xl font-bold">Engagement Flow</h3>
                        <Activity className="text-accent" />
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A7AA63" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#A7AA63" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#121A1B', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    itemStyle={{ color: '#A7AA63' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="#A7AA63" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem]">
                    <div className="flex items-center justify-between mb-8 md:mb-10">
                        <h3 className="text-xl font-bold">Click Conversion</h3>
                        <Calendar className="text-accent" />
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#121A1B', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey="clicks" fill="#505039" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Content Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
                <div className="xl:col-span-2 glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem]">
                    <h3 className="text-xl font-bold mb-8">Recent Projects</h3>
                    <div className="space-y-4 md:space-y-6">
                        {portfolioData.projects.slice(0, 3).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-accent/40 transition-all">
                                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                                    <div className="w-12 h-10 sm:w-16 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden shrink-0">
                                        <img src={p.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-base sm:text-lg truncate">{p.title}</div>
                                        <div className="text-[10px] text-beige/40">ID: PRJ-00{p.id} • Posted 2 days ago</div>
                                    </div>
                                </div>
                                <button className="text-accent font-black tracking-widest text-[10px] uppercase group-hover:underline shrink-0 ml-4">Edit</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem]">
                    <h3 className="text-xl font-bold mb-8">System Notifications</h3>
                    <div className="space-y-4 md:space-y-6">
                        {[
                            { msg: "New feedback from G. Siva Ganesh", time: "2m ago", icon: <MessageSquare className="text-blue-400" /> },
                            { msg: "Project spike", time: "1h ago", icon: <TrendingUp className="text-green-500" /> },
                            { msg: "Report ready", time: "5h ago", icon: <BarChart2 className="text-accent" /> },
                            { msg: "Secure v1.0", time: "1d ago", icon: <ShieldCheck className="text-red-400" /> }
                        ].map((n, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">{n.icon}</div>
                                <div className="min-w-0">
                                    <div className="text-[13px] font-medium leading-snug truncate">{n.msg}</div>
                                    <div className="text-[10px] text-beige/20 font-bold uppercase mt-1">{n.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        {activeTab !== 'Overview' && (
             <div className="flex flex-col items-center justify-center py-40 opacity-20">
                <Settings size={100} className="animate-spin-slow mb-10" />
                <h2 className="text-3xl font-black tracking-tight text-center">{activeTab} module is under construction</h2>
             </div>
        )}
      </main>
    </div>
  );
}

function ShieldCheck({ size = 20, className = "" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
            <polyline points="9 11 12 14 22 4" />
        </svg>
    )
}
