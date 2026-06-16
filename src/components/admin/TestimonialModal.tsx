import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, User, Upload } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimonial: any) => void;
  testimonial?: any;
  index?: number;
}

export default function TestimonialModal({ isOpen, onClose, onSave, testimonial, index }: TestimonialModalProps) {
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    rating: 5,
    avatar: ''
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        ...testimonial,
        avatar: testimonial.avatar || ''
      });
    } else {
      setFormData({
        quote: '',
        author: '',
        role: '',
        rating: 5,
        avatar: ''
      });
    }
  }, [testimonial, isOpen]);

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
          setFormData(prev => ({ ...prev, avatar: data.url }));
          toast.success('Identity node updated');
        }
      } catch (err) {
        toast.error('Upload failed');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            className="glass-panel w-full max-w-2xl rounded-[3rem] border-white/10 shadow-2xl relative"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{testimonial ? 'Edit Feedback' : 'New Reputation Node'}</h2>
                <p className="text-beige/40 text-[10px] font-black uppercase tracking-widest mt-1">Social Proof Configuration</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative group">
                  {formData.avatar ? (
                    <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <User size={32} className="text-beige/20" />
                  )}
                  <label className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Upload size={20} className="text-accent" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <div className="space-y-4 flex-grow">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Rating Level</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={cn(
                          "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
                          formData.rating >= star ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/10 text-beige/20"
                        )}
                      >
                        <Star size={20} fill={formData.rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">The Testimony</label>
                <textarea 
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({...formData, quote: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none h-32 resize-none leading-relaxed italic"
                  placeholder="Insert the feedback here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Source / Author</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-beige/20 group-focus-within:text-accent transition-colors"><User size={18} /></div>
                    <input 
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-accent/40 focus:outline-none font-bold"
                      placeholder="John Wick"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">Designation / Role</label>
                  <input 
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-accent/40 focus:outline-none font-medium text-beige/60"
                    placeholder="CEO, Global Nexus"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button 
                  type="submit" 
                  className="flex-grow py-5 bg-accent text-primary rounded-2xl font-black text-lg shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all"
                >
                  {testimonial ? 'Authorize Update' : 'Log Testimony'}
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 py-5 glass-panel rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
