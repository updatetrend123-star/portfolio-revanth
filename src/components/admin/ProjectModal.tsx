import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Link as LinkIcon, Github, Globe, Star, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
  project?: any;
}

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
    github: '',
    link: '',
    featured: false,
    category: '',
    liveDemo: false
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        tech: '',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
        github: '',
        link: '',
        featured: false,
        category: 'Web App',
        liveDemo: false
      });
    }
  }, [project, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataUpload
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, image: data.url }));
          toast.success('Resource uploaded to nexus');
        }
      } catch (err) {
        toast.error('Upload failed');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()).filter(Boolean),
      id: project?.id || Date.now()
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-primary/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border-white/10 shadow-2xl relative scrollbar-hide"
          >
            <div className="sticky top-0 z-10 bg-primary/50 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{project ? 'Edit Mission' : 'New Deployment'}</h2>
                <p className="text-beige/40 text-xs font-bold uppercase tracking-widest mt-1">Project Core Configuration</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-10">
              {/* Image Preview & Upload Simulated */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-5 space-y-6">
                  <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 group relative">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer flex flex-col items-center gap-2">
                         <Upload size={32} className="text-accent" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Replace Texture</span>
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                       </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Image Perspective (URL)</label>
                    <input 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 focus:border-accent/40 focus:outline-none text-xs font-mono"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="md:col-span-7 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2 text-primary bg-accent px-2 py-0.5 rounded">Identity</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none text-lg font-bold"
                      placeholder="Enter project name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Operational Summary</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none h-32 resize-none leading-relaxed"
                      placeholder="What is the objective of this project?"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Core Tech Stack (Comma Separated)</label>
                  <input 
                    required
                    value={formData.tech}
                    onChange={(e) => setFormData({...formData, tech: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none font-bold"
                    placeholder="React, Node, TypeScript"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Sector / Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none font-bold appearance-none"
                  >
                    <option value="Web App">Web App</option>
                    <option value="AgriTech">AgriTech</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Business">Business</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Links & Entrypoints</label>
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-beige/20 group-focus-within:text-accent transition-colors"><Github size={18} /></div>
                      <input 
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-accent/40 focus:outline-none text-sm"
                        placeholder="GitHub Repository URL"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-beige/20 group-focus-within:text-accent transition-colors"><Globe size={18} /></div>
                      <input 
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-accent/40 focus:outline-none text-sm"
                        placeholder="Live Deployment URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Global Flags</label>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                      type="button"
                      onClick={() => setFormData({...formData, featured: !formData.featured})}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border transition-all",
                        formData.featured ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/10 text-beige/40"
                      )}
                     >
                       <span className="font-bold text-sm">Featured</span>
                       <Star size={18} fill={formData.featured ? "currentColor" : "none"} />
                     </button>
                     <button 
                      type="button"
                      onClick={() => setFormData({...formData, liveDemo: !formData.liveDemo})}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border transition-all",
                        formData.liveDemo ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/10 text-beige/40"
                      )}
                     >
                       <span className="font-bold text-sm">Live Demo</span>
                       <Eye size={18} />
                     </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  className="flex-grow py-5 bg-accent text-primary rounded-2xl font-black text-xl shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all"
                >
                  {project ? 'Update Deployment' : 'Initiate Deployment'}
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-10 py-5 glass-panel rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Terminate
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
