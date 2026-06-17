import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Calendar,
  FileText,
  Smartphone,
  Globe,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Save,
  RotateCcw,
  Star,
  Eye,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  Lightbulb,
  Github,
  Cpu,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { usePortfolio } from '@/src/context/PortfolioContext';
import { 
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
import { toast } from 'sonner';
import { downloadFile } from '@/src/utils/download';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import ProjectModal from '@/src/components/admin/ProjectModal';
import TestimonialModal from '@/src/components/admin/TestimonialModal';
import ExperienceModal from '@/src/components/admin/ExperienceModal';
import LazyImage from '@/src/components/LazyImage';
import * as Icons from 'lucide-react';

const LucideIcon = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  // @ts-ignore
  const Icon = Icons[name] || Icons.HelpCircle;
  return <Icon size={size} className={className} />;
};

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
  const { 
    data: portfolioData, 
    isLoading,
    addProject, 
    updateProject, 
    deleteProject, 
    toggleProjectFeatured,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updatePersonal,
    updateSocial,
    updateSkills,
    updateServices,
    updateExperience,
    resetToDefaults
  } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full"
        />
        <div className="text-accent font-black uppercase tracking-[0.2em] text-xs">Synchronizing Nexus...</div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('Overview');
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(d => {
        list.push({ ...d.data(), _id: d.id });
      });
      setMessages(list);
    } catch (err) {
      console.error('Failed to fetch messages from Firestore:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    askConfirm('Are you absolutely sure you want to purge this contact message?', async () => {
      try {
        await deleteDoc(doc(db, 'messages', msgId));
        setMessages(prev => prev.filter(m => m._id !== msgId));
        toast.success('Message purged from database');
      } catch (err) {
        console.error('Failed to purge message from Firestore:', err);
        toast.error('Could not complete deletion request');
      }
    });
  };

  useEffect(() => {
    if (activeTab === 'Messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialIndex, setTestimonialIndex] = useState<number>(-1);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

  // Custom iframe-safe Dialog States
  const [customConfirm, setCustomConfirm] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [customPrompt, setCustomPrompt] = useState<{
    title: string;
    defaultValue: string;
    onConfirm: (val: string) => void;
  } | null>(null);

  const [promptInput, setPromptInput] = useState('');

  const askConfirm = (message: string, onConfirm: () => void) => {
    setCustomConfirm({ message, onConfirm });
  };

  const askPrompt = (title: string, defaultValue: string, onConfirm: (val: string) => void) => {
    setPromptInput(defaultValue);
    setCustomPrompt({ title, defaultValue, onConfirm });
  };

  const stats = [
    { label: 'Total Visits', value: '12.4k', trend: '+14%', icon: <Monitor /> },
    { label: 'Project Clicks', value: '842', trend: '+8.2%', icon: <MousePointer2 /> },
    { label: 'Feedback', value: '42', trend: '+24%', icon: <MessageSquare /> },
    { label: 'Uptime', value: '99.9%', trend: 'Stable', icon: <Activity /> },
  ];

  const handleSaveProject = async (project: any) => {
    if (editingProject) {
      await updateProject(editingProject._id || project._id, project);
      toast.success('Project parameters updated successfully');
    } else {
      await addProject(project);
      toast.success('New project deployed to nexus');
    }
    setEditingProject(null);
  };

  const handleSaveTestimonial = async (testimonial: any) => {
    if (editingTestimonial) {
      await updateTestimonial(editingTestimonial._id, testimonial);
      toast.success('Reputation node updated');
    } else {
      await addTestimonial(testimonial);
      toast.success('New testimony logged');
    }
    setEditingTestimonial(null);
    setTestimonialIndex(-1);
  };

  const handleSaveExperience = async (experience: any) => {
    // Experience is still bulk-synced for simplicity or I should implement individual endpoints
    const newExperience = editingExperience 
      ? portfolioData.experience.map(exp => exp._id === experience._id ? experience : exp)
      : [...portfolioData.experience, experience];
    
    await updateExperience(newExperience);
    toast.success(editingExperience ? 'Milestone synchronized' : 'New milestone recorded');
    setIsExperienceModalOpen(false);
  };

  const menuItems = [
    { id: 'Overview', icon: <BarChart2 size={18} /> },
    { id: 'Projects', icon: <Layers size={18} /> },
    { id: 'Testimonials', icon: <Users size={18} /> },
    { id: 'Services', icon: <Cpu size={18} /> },
    { id: 'Experiences', icon: <Briefcase size={18} /> },
    { id: 'Content', icon: <FileText size={18} /> },
    { id: 'Contacts', icon: <Smartphone size={18} /> },
    { id: 'Messages', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0d1213] text-beige flex flex-col lg:flex-row font-sans selection:bg-accent selection:text-primary">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-primary border-b lg:border-b-0 lg:border-r border-white/5 p-6 lg:p-8 flex flex-col gap-10 shrink-0 sticky top-0 lg:h-screen z-40 backdrop-blur-xl">
        <div className="flex items-center justify-between lg:justify-start lg:gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-black text-xl shadow-lg shadow-accent/20">YRK</div>
            <span className="font-bold text-xl tracking-tight">YRK Console</span>
          </div>
          <button className="lg:hidden p-2 text-beige/50" onClick={logout}><LogOut size={20}/></button>
        </div>

        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === item.id 
                  ? "bg-accent text-primary shadow-xl shadow-accent/10" 
                  : "text-beige/40 hover:bg-white/5 hover:text-beige"
              )}
            >
              {item.icon}
              <span>{item.id}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-8 border-t border-white/5 mt-auto">
          <div className="p-4 bg-white/5 rounded-2xl mb-6">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-beige/40">Nexus Online</span>
             </div>
             <div className="text-xs font-medium text-beige/60 truncate">{user?.email}</div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={20} />
            Detach Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-10 lg:p-16 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Portfolio Management System v2.0</div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Nexus <span className="text-beige/30">/</span> {activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {(activeTab === 'Projects' || activeTab === 'Testimonials') && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    if (activeTab === 'Projects') {
                      setEditingProject(null);
                      setIsProjectModalOpen(true);
                    } else {
                      setEditingTestimonial(null);
                      setTestimonialIndex(-1);
                      setIsTestimonialModalOpen(true);
                    }
                  }}
                  className="flex-grow sm:flex-initial flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary rounded-2xl font-black text-sm shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all"
                >
                  <Plus size={20} />
                  Initiate {activeTab === 'Projects' ? 'Deployment' : 'Testimony'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Tab Content Renderers */}
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
                <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-accent/30 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4 text-accent">
                    <Layers size={48} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-beige/40 mb-6">Total Projects</div>
                  <div className="text-4xl font-black mb-3">{portfolioData?.projects?.length || 0}</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-accent">
                    Active on Nexus Grid
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-accent/30 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4 text-accent">
                    <Users size={48} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-beige/40 mb-6">Testimonials Count</div>
                  <div className="text-4xl font-black mb-3">{portfolioData?.testimonials?.length || 0}</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-accent">
                    Endorsed Stakeholders
                  </div>
                </div>
              </div>

              {/* Resume Management Component */}
              <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border-white/5 max-w-4xl">
                 <div className="mb-10">
                    <h3 className="text-2xl font-black mb-2">Resumé Management</h3>
                    <p className="text-beige/45 text-sm">Upload, download, or revoke the primary PDF document resource served on your public profile card.</p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5 gap-6">
                    <div className="space-y-2 min-w-0">
                       <div className="text-lg font-bold text-beige leading-snug-truncate font-sans">Resumé Archive (PDF)</div>
                       <p className="text-beige/35 text-xs font-medium font-mono truncate max-w-xs sm:max-w-md">
                         {portfolioData?.personal?.resumeUrl ? portfolioData.personal.resumeUrl : 'No document currently uploaded'}
                       </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <input
                        type="file"
                        id="resume-file-input"
                        accept=".pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const toastId = toast.loading('Uploading resumé...');
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            const token = localStorage.getItem('token');
                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              },
                              body: formData
                            });
                            
                            if (response.ok) {
                              const result = await response.json();
                              await updatePersonal({ resumeUrl: result.url });
                              toast.success('Resumé uploaded successfully!', { id: toastId });
                            } else {
                              toast.error('Failed to upload resumé', { id: toastId });
                            }
                          } catch (err) {
                            console.error(err);
                            toast.error('Error uploading resumé file', { id: toastId });
                          }
                        }}
                      />
                      <button 
                        onClick={() => document.getElementById('resume-file-input')?.click()}
                        className="px-6 py-4 bg-accent text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-accent/20 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Upload size={14} />
                        Upload PDF
                      </button>
                      {portfolioData?.personal?.resumeUrl && (
                        <>
                          <button 
                            onClick={() => {
                              downloadFile(portfolioData.personal.resumeUrl, 'revanth_kumar_resume.pdf');
                            }}
                            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-beige rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <FileText size={14} />
                            Download
                          </button>
                          <button 
                            onClick={async () => {
                                askConfirm('Are you sure you want to remove the current resumé?', async () => {
                                  await updatePersonal({ resumeUrl: '' });
                                  toast.success('Resumé removed from profile');
                                });
                            }}
                            className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all flex items-center justify-center cursor-pointer"
                            title="Remove Resumé"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Projects' && (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {portfolioData.projects.map((project) => (
                  <div key={project._id} className="glass-panel overflow-hidden rounded-[3rem] border-white/5 flex flex-col group hover:border-accent/40 transition-all">
                    <div className="h-60 w-full relative overflow-hidden">
                      <LazyImage 
                        src={project.image} 
                        alt={project.title} 
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-sm">
                         <button 
                          onClick={() => {
                            setEditingProject(project);
                            setIsProjectModalOpen(true);
                          }}
                          className="w-14 h-14 bg-accent text-primary rounded-2xl flex items-center justify-center shadow-2xl hover:-translate-y-1 transition-all"
                         >
                            <Edit3 size={24} />
                         </button>
                         <button 
                          onClick={() => {
                            askConfirm(`Exterminate project: ${project.title}?`, () => {
                              deleteProject(project._id);
                              toast.error('Project terminated');
                            });
                          }}
                          className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:-translate-y-1 transition-all"
                         >
                            <Trash2 size={24} />
                         </button>
                      </div>
                      <div className="absolute top-6 left-6 flex gap-2">
                         <div className="px-4 py-2 bg-primary/80 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{project.category}</div>
                         {project.featured && <div className="px-4 py-2 bg-accent text-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Star size={10} fill="currentColor" /> Featured</div>}
                      </div>
                    </div>
                    <div className="p-10 flex flex-col flex-grow">
                      <h3 className="font-black text-2xl mb-4 group-hover:text-accent transition-colors">{project.title}</h3>
                      <p className="text-beige/40 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                         {project.tech.map(tag => (
                           <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full text-accent/60 border border-white/5">{tag}</span>
                         ))}
                      </div>
 
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                         <div className="flex gap-4">
                           {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-beige/30 hover:text-accent transition-colors"><Github size={18}/></a>}
                           {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-beige/30 hover:text-accent transition-colors"><ExternalLink size={18}/></a>}
                         </div>
                         <button 
                          onClick={() => toggleProjectFeatured(project._id)}
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                            project.featured ? "text-accent" : "text-beige/20 hover:text-beige/60"
                          )}
                         >
                           {project.featured ? 'Featured In System' : 'Mark As Highlight'}
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Testimonials' && (
            <motion.div 
              key="testimonials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                {portfolioData.testimonials.map((test, i) => (
                  <div key={test._id} className="glass-panel p-8 sm:p-10 rounded-[3rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-accent/40 transition-all">
                    <div className="flex flex-col md:flex-row items-center gap-10 flex-grow">
                      <div className="w-24 h-24 bg-secondary rounded-[2.5rem] flex items-center justify-center font-black text-accent text-4xl shrink-0 uppercase shadow-2xl relative">
                        {test.author[0]}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-primary border-4 border-primary shadow-xl">
                          <CheckCircle2 size={18} />
                        </div>
                      </div>
                      <div className="text-center md:text-left min-w-0">
                         <div className="flex justify-center md:justify-start gap-1 mb-3">
                           {[...Array(5)].map((_, idx) => (
                             <Star key={idx} size={14} className={cn("fill-current", idx < test.rating ? "text-accent" : "text-beige/10")} />
                           ))}
                         </div>
                         <div className="font-black text-2xl mb-1">{test.author}</div>
                         <div className="text-xs text-accent font-bold mb-6 uppercase tracking-[0.2em]">{test.role}</div>
                         <p className="text-beige/60 text-lg sm:text-xl font-medium italic leading-relaxed max-w-3xl">"{test.quote}"</p>
                      </div>
                    </div>
                    <div className="flex gap-4 shrink-0">
                       <button 
                        onClick={() => {
                          setEditingTestimonial(test);
                          setTestimonialIndex(i);
                          setIsTestimonialModalOpen(true);
                        }}
                        className="w-14 h-14 bg-white/5 hover:bg-accent hover:text-primary rounded-2xl flex items-center justify-center transition-all shadow-xl"
                       >
                         <Edit3 size={20} />
                       </button>
                       <button 
                        onClick={() => {
                          askConfirm(`Remove testimony from ${test.author}?`, () => {
                            deleteTestimonial(test._id);
                            toast.error('Testimony purged');
                          });
                        }}
                        className="w-14 h-14 bg-white/5 hover:bg-red-500 rounded-2xl flex items-center justify-center transition-all shadow-xl group-hover:bg-red-500/10 group-hover:text-red-500"
                       >
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Content' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
               {/* Hero & About Manager */}
               <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border-white/5">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-3xl font-black">Identity & Vision</h3>
                     <ShieldCheckIcon className="text-accent" />
                  </div>
                  <div className="grid grid-cols-1 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Hero Tagline</label>
                        <input 
                          value={portfolioData.personal.tagline}
                          onChange={(e) => updatePersonal({ tagline: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 px-10 focus:border-accent text-3xl font-black tracking-tight"
                          placeholder="Your visionary statement..."
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Name Token</label>
                          <input 
                            value={portfolioData.personal.name}
                            onChange={(e) => updatePersonal({ name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 focus:border-accent font-black text-xl"
                            placeholder="Full Name"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Legacy Role</label>
                          <input 
                            value={portfolioData.personal.role}
                            onChange={(e) => updatePersonal({ role: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 focus:border-accent font-black text-xl"
                            placeholder="Role (e.g. FullStack Lead)"
                          />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Biographical Data</label>
                        <textarea 
                          value={portfolioData.personal.about}
                          onChange={(e) => updatePersonal({ about: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-[3rem] py-10 px-12 focus:border-accent text-lg font-medium leading-relaxed h-64 resize-none"
                          placeholder="Tell your story..."
                        />
                     </div>
                  </div>
               </div>

               {/* Statistics & Numbers */}
               <div className="glass-panel p-10 lg:p-16 rounded-[4rem] border-white/5">
                  <h3 className="text-2xl font-black mb-10">Neural Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {[
                       { label: 'Years Experience', key: 'years' },
                       { label: 'Cumulative Projects', key: 'projects' },
                       { label: 'Happy Stakeholders', key: 'clients' },
                       { label: 'Lines of Precision', key: 'lines' }
                     ].map((stat) => (
                        <div key={stat.key} className="p-8 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col items-center text-center">
                           <div className="text-[10px] font-black uppercase tracking-widest text-beige/20 mb-6">{stat.label}</div>
                           <input 
                              type="text"
                              className="bg-transparent text-5xl font-black text-accent text-center focus:outline-none w-full"
                              value={portfolioData.personal.stats ? (portfolioData.personal.stats as any)[stat.key] : ''}
                              onChange={(e) => {
                                const newStats = { ...(portfolioData.personal.stats || {}), [stat.key]: e.target.value };
                                updatePersonal({ stats: newStats as any });
                              }}
                           />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Skills Framework Manager */}
               <div className="glass-panel p-10 lg:p-16 rounded-[4rem] border-white/5">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black">Skills Framework</h3>
                    <button 
                      onClick={() => {
                        askPrompt('Skill Group Name (e.g. Frontend):', '', (name) => {
                          updateSkills([...portfolioData.skills, { category: name, items: [] }]);
                          toast.success('Skill category initialized');
                        });
                      }}
                      className="px-6 py-3 bg-accent text-primary rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      New Category
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.skills.map((group, groupIdx) => (
                      <div key={groupIdx} className="p-8 bg-white/5 rounded-[3rem] border border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                           <input 
                              value={group.category}
                              onChange={(e) => {
                                const newSkills = [...portfolioData.skills];
                                newSkills[groupIdx] = { ...group, category: e.target.value };
                                updateSkills(newSkills);
                              }}
                              className="bg-transparent font-black text-xl text-accent focus:outline-none"
                           />
                           <button 
                              onClick={() => {
                                if (confirm('Delete entire category?')) {
                                  updateSkills(portfolioData.skills.filter((_, i) => i !== groupIdx));
                                }
                              }}
                              className="text-red-500/50 hover:text-red-500 transition-colors"
                           >
                            <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {group.items.map((skill, skillIdx) => (
                              <div key={skillIdx} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 group/skill relative">
                                 <span className="text-xs font-bold">{skill.name}</span>
                                 <button 
                                    onClick={() => {
                                      const newSkills = [...portfolioData.skills];
                                      const newItems = group.items.filter((_, i) => i !== skillIdx);
                                      newSkills[groupIdx] = { ...group, items: newItems };
                                      updateSkills(newSkills);
                                    }}
                                    className="opacity-0 group-hover/skill:opacity-100 text-red-500 transition-opacity"
                                 >
                                    <X size={12} />
                                 </button>
                              </div>
                           ))}
                           <button 
                              onClick={() => {
                                askPrompt('Skill Name:', '', (name) => {
                                  const newSkills = [...portfolioData.skills];
                                  const newItems = [...group.items, { name, icon: 'Code2' }];
                                  newSkills[groupIdx] = { ...group, items: newItems };
                                  updateSkills(newSkills);
                                });
                              }}
                              className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all"
                           >
                              + Add
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

            </motion.div>
          )}

          {activeTab === 'Services' && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 max-w-4xl"
            >
               {/* Services Manager */}
               <div className="glass-panel p-10 lg:p-16 rounded-[4rem] border-white/5 font-sans">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-beige mb-1">Service Ecosystem</h3>
                    <button 
                      onClick={() => {
                        askPrompt('Service Title:', '', (title) => {
                          const newService = {
                            id: Date.now(),
                            title,
                            tagline: 'New dynamic service',
                            description: 'Service description goes here...',
                            features: ['Feature 1'],
                            color: 'from-accent/20 to-accent/40',
                            highlighted: false,
                            icon: 'Cpu'
                          };
                          updateServices([...portfolioData.services, newService]);
                          toast.success('Service node established');
                        });
                      }}
                      className="px-6 py-3 bg-accent text-primary rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                    >
                      New Service
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.services.map((service, idx) => (
                      <div key={service.id} className="p-8 bg-white/5 rounded-[3rem] border border-white/5 group hover:border-accent/30 transition-all relative">
                        <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => {
                                askPrompt('New Title:', service.title, (newTitle) => {
                                  const newServices = [...portfolioData.services];
                                  newServices[idx] = { ...service, title: newTitle };
                                  updateServices(newServices);
                                });
                              }}
                              className="p-3 bg-white/5 rounded-xl hover:text-accent transition-colors cursor-pointer"
                           >
                            <Edit3 size={16} />
                           </button>
                           <button 
                              onClick={() => {
                                askConfirm('Remove service?', () => {
                                  updateServices(portfolioData.services.filter(s => s.id !== service.id));
                                });
                              }}
                              className="p-3 bg-white/5 rounded-xl hover:text-red-500 transition-colors cursor-pointer"
                           >
                            <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="flex items-center gap-6 mb-8">
                           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center text-accent shadow-xl">
                              <LucideIcon name={service.icon} size={28} />
                           </div>
                           <div>
                              <div className="font-black text-xl mb-1 text-beige">{service.title}</div>
                              <div className="text-accent text-[10px] font-black uppercase tracking-widest">{service.tagline}</div>
                           </div>
                        </div>
                        <p className="text-beige/40 text-sm font-medium leading-relaxed mb-8">{service.description}</p>
                        <div className="flex flex-wrap gap-2">
                           {service.features.map((f, fi) => (
                              <span key={fi} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-beige/30">{f}</span>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'Experiences' && (
            <motion.div 
              key="experiences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 max-w-4xl"
            >
               {/* Experience Logic Manager */}
                <div className="glass-panel p-10 lg:p-16 rounded-[4rem] border-white/5 font-sans">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-beige">Experience Sequence</h3>
                    <button 
                      onClick={() => {
                        setEditingExperience(null);
                        setIsExperienceModalOpen(true);
                      }}
                      className="px-6 py-3 bg-accent text-primary rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Add Experience
                    </button>
                  </div>
                  <div className="space-y-6">
                    {portfolioData.experience.map((exp) => (
                      <div key={exp._id} className="p-8 bg-white/5 rounded-[3.5rem] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 group hover:border-accent/30 transition-all">
                         <div className="flex items-center gap-10">
                            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center font-black text-accent text-2xl shrink-0">
                                {exp.company[0]}
                            </div>
                            <div>
                                <div className="font-black text-2xl mb-1 text-beige leading-tight">{exp.title}</div>
                                <div className="text-beige/40 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                   {exp.company} <span className="w-1 h-1 bg-beige/20 rounded-full" /> {exp.period}
                                </div>
                            </div>
                         </div>
                         <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                            <button 
                              onClick={() => {
                                setEditingExperience(exp);
                                setIsExperienceModalOpen(true);
                              }}
                              className="p-4 bg-white/5 rounded-2xl hover:text-accent transition-colors cursor-pointer"
                            >
                              <Edit3 size={20} />
                            </button>
                            <button 
                              onClick={() => {
                                askConfirm('Erase this experience?', () => {
                                  updateExperience(portfolioData.experience.filter(e => e._id !== exp._id));
                                });
                              }}
                              className="p-4 bg-white/5 rounded-2xl hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 size={20} />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* HIDDEN_RESIDUAL_BLOCK_START
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black">Experience Sequence</h3>
                    <button 
                      onClick={() => {
                        setEditingExperience(null);
                        setIsExperienceModalOpen(true);
                      }}
                      className="px-6 py-3 bg-white/5 hover:bg-accent hover:text-primary rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      Add Experience
                    </button>
                  </div>
                  <div className="space-y-6">
                    {portfolioData.experience.map((exp) => (
                      <div key={exp._id} className="p-8 bg-white/5 rounded-[3.5rem] border border-white/5 flex justify-between items-center group hover:border-accent/30 transition-all">
                         <div className="flex items-center gap-10">
                            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center font-black text-accent text-2xl">
                               {exp.company[0]}
                            </div>
                            <div>
                               <div className="font-black text-2xl mb-1">{exp.title}</div>
                               <div className="text-beige/40 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                  {exp.company} <span className="w-1 h-1 bg-beige/20 rounded-full" /> {exp.period}
                                </div>
                            </div>
                         </div>
                         <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingExperience(exp);
                                setIsExperienceModalOpen(true);
                              }}
                              className="p-4 bg-white/5 rounded-2xl hover:text-accent transition-colors"
                            >
                              <Edit3 size={20} />
                            </button>
                            <button 
                              onClick={() => {
                                askConfirm('Erase this experience?', () => {
                                  updateExperience(portfolioData.experience.filter(e => e._id !== exp._id));
                                });
                              }}
                              className="p-4 bg-white/5 rounded-2xl hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          HIDDEN_RESIDUAL_BLOCK_END */}

          {activeTab === 'Contacts' && (
            <motion.div 
               key="contacts"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="max-w-4xl space-y-12"
            >
               <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 opacity-5 font-black text-[12rem] pointer-events-none">@</div>
                  <h3 className="text-3xl font-black mb-12">Contact Nodes</h3>
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Electronic Mail</label>
                        <input 
                          value={portfolioData.personal.email}
                          onChange={(e) => updatePersonal({ email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-10 focus:border-accent font-bold text-2xl"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Communication Link (Phone)</label>
                        <input 
                          value={portfolioData.personal.phone}
                          onChange={(e) => updatePersonal({ phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-10 focus:border-accent font-bold text-2xl"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent ml-2">Geographical Base</label>
                        <input 
                          value={portfolioData.personal.location}
                          onChange={(e) => updatePersonal({ location: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-10 focus:border-accent font-bold text-2xl"
                        />
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border-white/5">
                  <h3 className="text-2xl font-black mb-12">Digital Social Ecosystem</h3>
                  <div className="space-y-6">
                    {portfolioData.social.map((s, i) => (
                      <div key={s.name} className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/5 group hover:border-accent/30 transition-all">
                         <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-accent shadow-2xl shrink-0"><Globe size={28} /></div>
                         <div className="flex-grow w-full space-y-4">
                            <div className="flex items-center justify-between">
                               <div className="text-[10px] font-black uppercase tracking-widest text-beige/30">{s.name} Gateway</div>
                               <button 
                                onClick={() => {
                                  askPrompt(`Update ${s.name} URL:`, s.url, (newUrl) => {
                                    const newSocial = [...portfolioData.social];
                                    newSocial[i] = { ...s, url: newUrl };
                                    updateSocial(newSocial);
                                    toast.success(`${s.name} link updated`);
                                  });
                                }}
                                className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline"
                               >
                                Update Link
                               </button>
                            </div>
                            <div className="font-mono text-sm text-beige/50 truncate w-full">{s.url}</div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'Messages' && (
            <motion.div 
               key="messages"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="max-w-4xl space-y-12"
            >
               <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 opacity-5 font-black text-[12rem] pointer-events-none">✉</div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black mb-2">Message Ingestion Node</h3>
                      <p className="text-beige/45 text-sm">Real-time visitor queries and transmission logs stored securely in cloud-hosted Firebase.</p>
                    </div>
                    <button 
                      onClick={fetchMessages}
                      disabled={loadingMessages}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-accent rounded-xl border border-white/5 transition-all font-black uppercase tracking-widest cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {loadingMessages ? 'Syncing...' : 'Sync Messages'}
                    </button>
                  </div>

                  {loadingMessages && messages.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full"
                      />
                      <span className="text-xs text-beige/45 font-mono">Syncing Firestore Data...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-24 text-center glass-panel rounded-[3rem] bg-white/[0.01] border-white/5">
                      <MessageSquare className="mx-auto text-beige/25 mb-6" size={48} />
                      <h4 className="text-xl font-bold mb-2">No transmissions logged</h4>
                      <p className="text-beige/45 text-sm max-w-sm mx-auto">When visitors populate the contact gateway, records populate here with atomic prompt triggers.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((msg) => (
                        <div key={msg._id} className="p-8 sm:p-10 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-accent/20 transition-all flex flex-col md:flex-row justify-between items-start gap-6 group">
                          <div className="space-y-4 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-lg font-black text-beige leading-none">{msg.name}</span>
                              <span className="text-[10px] font-mono bg-white/5 px-3 py-1 rounded-full text-beige/50 border border-white/5">{msg.email}</span>
                            </div>
                            
                            <p className="text-beige/70 text-base leading-relaxed break-words whitespace-pre-wrap font-medium">
                              {msg.message}
                            </p>

                            <div className="text-[10px] font-mono text-beige/30 flex items-center gap-2">
                              <span>Received:</span>
                              <span className="text-beige/40 font-medium font-mono">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown Timestamp'}
                              </span>
                              <span className="text-beige/20">•</span>
                              <span>ID:</span>
                              <span className="text-beige/35 hover:text-accent font-medium select-all cursor-pointer font-mono">{msg._id}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="p-4 bg-red-500/10 hover:bg-red-500/25 md:opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-300 rounded-2xl transition-all cursor-pointer shrink-0 self-end md:self-start border border-red-500/10"
                            title="Delete permanently from Firestore"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div 
               key="settings"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="max-w-4xl space-y-12"
            >
               <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border-white/5">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-3xl font-black">System Preferences</h3>
                     <Settings className="text-accent" />
                  </div>
                  
                  <div className="space-y-12">
                     <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                        <div className="space-y-2">
                           <div className="text-xl font-bold">Resumé Archive (PDF)</div>
                           <p className="text-beige/30 text-sm font-medium">Currently using: {portfolioData.personal.resumeUrl}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <input
                            type="file"
                            id="resume-file-input"
                            accept=".pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const toastId = toast.loading('Uploading resumé...');
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                
                                const token = localStorage.getItem('token');
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: formData
                                });
                                
                                if (response.ok) {
                                  const result = await response.json();
                                  await updatePersonal({ resumeUrl: result.url });
                                  toast.success('Resumé uploaded successfully!', { id: toastId });
                                } else {
                                  toast.error('Failed to upload resumé', { id: toastId });
                                }
                              } catch (err) {
                                console.error(err);
                                toast.error('Error uploading resumé file', { id: toastId });
                              }
                            }}
                          />
                          <button 
                            onClick={() => document.getElementById('resume-file-input')?.click()}
                            className="px-8 py-4 bg-accent text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-accent/20 transition-all flex items-center gap-3 cursor-pointer"
                          >
                            <Upload size={16} />
                            Upload PDF
                          </button>
                          {portfolioData.personal.resumeUrl && (
                            <>
                              <button 
                                onClick={() => {
                                  downloadFile(portfolioData.personal.resumeUrl, 'revanth_kumar_resume.pdf');
                                }}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-beige rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer"
                              >
                                <FileText size={16} />
                                Download PDF
                              </button>
                              <button 
                                onClick={async () => {
                                    askConfirm('Are you sure you want to remove the current resumé?', async () => {
                                      await updatePersonal({ resumeUrl: '' });
                                      toast.success('Resumé removed from profile');
                                    });
                                }}
                                className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer"
                              >
                                <Trash2 size={16} />
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                     </div>

                     <div className="space-y-10">
                        <div className="flex items-center justify-between">
                           <h4 className="font-bold text-lg">Infrastructure Controls</h4>
                           <CheckCircle2 className="text-green-500" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {[
                             { label: 'Auto-Sync LocalStorage', active: true },
                             { label: 'Real-time Preview', active: true },
                             { label: 'Advanced Debugger', active: false },
                             { label: 'Analytics Tracking', active: true }
                           ].map((c, i) => (
                             <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                <span className={cn("text-sm font-bold", c.active ? "text-beige" : "text-beige/30")}>{c.label}</span>
                                <div className={cn("w-12 h-6 rounded-full relative transition-all cursor-pointer", c.active ? "bg-accent" : "bg-white/10")}>
                                   <div className={cn("w-4 h-4 bg-primary rounded-full absolute top-1 transition-all", c.active ? "right-1" : "left-1")} />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-10 sm:p-16 rounded-[4rem] border border-red-500/20 bg-red-500/5 transition-all hover:bg-red-500/10">
                  <div className="flex items-center gap-6 mb-8 text-red-500">
                     <AlertTriangle size={48} />
                     <div>
                        <h3 className="text-3xl font-black">Danger Sector</h3>
                        <p className="text-red-500/60 font-medium">Irreversible Nexus operations</p>
                     </div>
                  </div>
                  <p className="text-beige/40 mb-12 text-lg leading-relaxed">Resetting the Nexus will erase all local modifications and restore the portfolio to its original production state. This action cannot be undone.</p>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <button 
                       onClick={() => {
                         askConfirm('ABSOLUTE RESET: Erase all modifications?', async () => {
                           await resetToDefaults();
                           toast.success('Nexus factory reset complete');
                           setTimeout(() => window.location.reload(), 1500);
                         });
                       }}
                       className="px-10 py-6 bg-red-500 text-white rounded-[2.5rem] font-black text-lg shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:-translate-y-2 transition-all flex items-center justify-center gap-4"
                     >
                        <RotateCcw size={22} className="rotate-180" />
                        Execute Factory Reset
                     </button>
                     <button className="px-10 py-6 glass-panel rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] text-beige/50 hover:bg-white/10 transition-all border-white/10">
                        Diagnostics Mode
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <TestimonialModal 
        isOpen={isTestimonialModalOpen}
        onClose={() => {
          setIsTestimonialModalOpen(false);
          setEditingTestimonial(null);
          setTestimonialIndex(-1);
        }}
        onSave={handleSaveTestimonial}
        testimonial={editingTestimonial}
        index={testimonialIndex}
      />

      <ExperienceModal 
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        experience={editingExperience}
      />

      {/* Custom Iframe-Safe Confirmation Modal */}
      <AnimatePresence>
        {customConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-8 max-w-sm w-full rounded-[2.5rem] border border-white/10 text-center space-y-6 animate-in fade-in duration-250"
            >
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-xl">
                <AlertTriangle size={32} />
              </div>
              <p className="text-beige/80 text-sm font-bold leading-relaxed">{customConfirm.message}</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    customConfirm.onConfirm();
                    setCustomConfirm(null);
                  }}
                  className="py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Confirm
                </button>
                <button 
                  type="button"
                  onClick={() => setCustomConfirm(null)}
                  className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-beige/50 border border-white/5 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Iframe-Safe Prompt Modal */}
      <AnimatePresence>
        {customPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-8 max-w-md w-full rounded-[3rem] border border-white/10 space-y-6 animate-in fade-in duration-250"
            >
              <div>
                <h3 className="text-xl font-black text-accent">{customPrompt.title}</h3>
                <p className="text-beige/40 text-[9px] font-black uppercase tracking-widest mt-1">Operational Parameter Input</p>
              </div>
              <input 
                autoFocus
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (promptInput.trim()) {
                      customPrompt.onConfirm(promptInput.trim());
                      setCustomPrompt(null);
                    }
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none text-beige font-medium text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    if (promptInput.trim()) {
                      customPrompt.onConfirm(promptInput.trim());
                      setCustomPrompt(null);
                    }
                  }}
                  className="py-4 bg-accent text-primary rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent/10 cursor-pointer"
                >
                  Submit
                </button>
                <button 
                  type="button"
                  onClick={() => setCustomPrompt(null)}
                  className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-beige/50 border border-white/5 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShieldCheckIcon({ size = 20, className = "" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
            <polyline points="9 11 12 14 22 4" />
        </svg>
    )
}
