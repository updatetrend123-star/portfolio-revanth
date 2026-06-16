import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: any) => void;
  experience?: any;
}

export default function ExperienceModal({ isOpen, onClose, onSave, experience }: ExperienceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    period: '',
    type: 'Full-time',
    description: '',
    achievements: [''],
    skills: ['']
  });

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        period: '',
        type: 'Full-time',
        description: '',
        achievements: [''],
        skills: ['']
      });
    }
  }, [experience, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: experience?.id || Date.now() });
    onClose();
  };

  const addAchievement = () => {
    setFormData(prev => ({ ...prev, achievements: [...prev.achievements, ''] }));
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData(prev => ({ ...prev, achievements: newAchievements }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0d1213] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-3xl font-black">{experience ? 'Adjust Milestone' : 'Record New Milestone'}</h2>
              <p className="text-beige/40 font-medium">Professional Odyssey parameters</p>
            </div>
            <button 
              onClick={onClose}
              className="p-4 hover:bg-white/5 rounded-2xl transition-colors"
            >
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Job Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent text-white font-bold"
                  placeholder="e.g. Senior Architect"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Organization</label>
                <input
                  required
                  value={formData.company}
                  onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent text-white font-bold"
                  placeholder="e.g. Nexus Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Chronology (Period)</label>
                <input
                  required
                  value={formData.period}
                  onChange={e => setFormData(p => ({ ...p, period: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent text-white font-bold"
                  placeholder="e.g. 2022 - Present"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Base Operations (Location)</label>
                <input
                  value={formData.location}
                  onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent text-white font-bold"
                  placeholder="e.g. Remote / Matrix"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Contract Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent text-white font-bold appearance-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Mission Intelligence (Description)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 focus:border-accent text-white font-medium h-32 resize-none"
                placeholder="Core responsibilities and vision..."
              />
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Key Achievements</label>
                  <button 
                    type="button"
                    onClick={addAchievement}
                    className="flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add Achievement
                  </button>
               </div>
               <div className="space-y-4">
                  {formData.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-4">
                       <input 
                         value={ach}
                         onChange={e => updateAchievement(i, e.target.value)}
                         className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-6 focus:border-accent text-sm font-medium"
                         placeholder={`Achievement #${i + 1}`}
                       />
                       <button 
                         type="button"
                         onClick={() => removeAchievement(i)}
                         className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
              <button
                type="submit"
                className="flex-grow bg-accent text-primary py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Save size={20} />
                {experience ? 'Synchronize Milestone' : 'Authorize Milestone'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-10 py-5 glass-panel rounded-2xl font-black text-beige/50 hover:bg-white/10 transition-all border border-white/10"
              >
                Abort
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
