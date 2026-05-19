import { createContext, useContext, useState, useEffect } from 'react';
import { portfolioData as initialData } from '@/src/constants';

interface PortfolioContextType {
  data: typeof initialData;
  updatePersonal: (personal: Partial<typeof initialData.personal>) => void;
  addProject: (project: any) => void;
  updateProject: (id: number, project: any) => void;
  deleteProject: (id: number) => void;
  addTestimonial: (testimonial: any) => void;
  deleteTestimonial: (author: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const savedData = localStorage.getItem('yrk_portfolio_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse portfolio data', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yrk_portfolio_data', JSON.stringify(data));
  }, [data]);

  const updatePersonal = (personal: Partial<typeof initialData.personal>) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...personal }
    }));
  };

  const addProject = (project: any) => {
    setData(prev => ({
      ...prev,
      projects: [{ ...project, id: Date.now() }, ...prev.projects]
    }));
  };

  const updateProject = (id: number, project: any) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p)
    }));
  };

  const deleteProject = (id: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addTestimonial = (testimonial: any) => {
    setData(prev => ({
      ...prev,
      testimonials: [testimonial, ...prev.testimonials]
    }));
  };

  const deleteTestimonial = (author: string) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.author !== author)
    }));
  };

  return (
    <PortfolioContext.Provider value={{ 
      data, 
      updatePersonal, 
      addProject, 
      updateProject, 
      deleteProject,
      addTestimonial,
      deleteTestimonial 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
