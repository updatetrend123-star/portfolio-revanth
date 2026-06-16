import { createContext, useContext, useState, useEffect } from 'react';
import { portfolioData as initialData } from '@/src/constants';
import { db, auth } from '@/src/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface PortfolioContextType {
  data: any;
  isLoading: boolean;
  updatePersonal: (personal: any) => Promise<void>;
  updateSocial: (social: any[]) => Promise<void>;
  updateSkills: (skills: any[]) => Promise<void>;
  updateExperience: (experience: any[]) => Promise<void>;
  updateServices: (services: any[]) => Promise<void>;
  
  // Projects CRUD
  addProject: (project: any) => Promise<void>;
  updateProject: (id: string, project: any) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectFeatured: (id: string) => Promise<void>;
  
  // Testimonials CRUD
  addTestimonial: (testimonial: any) => Promise<void>;
  updateTestimonial: (id: string, testimonial: any) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  
  // General
  resetToDefaults: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  const seedFirestore = async (seedData: any) => {
    try {
      // 1. Seed personal info
      await setDoc(doc(db, 'personal', 'main'), {
        ...seedData.personal,
        social: seedData.social
      });

      // 2. Seed skills
      for (let i = 0; i < seedData.skills.length; i++) {
        const skillGroup = seedData.skills[i];
        await setDoc(doc(db, 'skills', `skill_${i}`), {
          ...skillGroup,
          index: i
        });
      }

      // 3. Seed services
      for (let i = 0; i < seedData.services.length; i++) {
        const service = seedData.services[i];
        await setDoc(doc(db, 'services', `service_${i}`), {
          ...service,
          index: i
        });
      }

      // 4. Seed experiences
      for (let i = 0; i < seedData.experience.length; i++) {
        const exp = seedData.experience[i];
        const docId = exp._id || `exp_${i}`;
        await setDoc(doc(db, 'experience', docId), {
          ...exp,
          _id: docId,
          index: i
        });
      }

      // 5. Seed projects
      for (let i = 0; i < seedData.projects.length; i++) {
        const proj = seedData.projects[i];
        const docId = `proj_${proj.id || i}`;
        await setDoc(doc(db, 'projects', docId), {
          ...proj,
          _id: docId,
          id: proj.id || i
        });
      }

      // 6. Seed testimonials
      for (let i = 0; i < seedData.testimonials.length; i++) {
        const test = seedData.testimonials[i];
        const docId = `test_${i}`;
        await setDoc(doc(db, 'testimonials', docId), {
          ...test,
          _id: docId
        });
      }
      
      console.log("Firestore successfully seeded!");
    } catch (err) {
      console.error("Failed to auto-seed Firestore database", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch personal info
        let personalDoc;
        try {
          personalDoc = await getDoc(doc(db, 'personal', 'main'));
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, 'personal/main');
          return;
        }
        
        let fetchedData = { ...initialData };
        let needsSeeding = !personalDoc.exists();

        if (personalDoc.exists()) {
          const personalData = personalDoc.data();
          fetchedData.personal = { ...fetchedData.personal, ...personalData };
          if (personalData.social) {
            fetchedData.social = personalData.social;
          }
        }

        // 2. Fetch skills
        try {
          const skillsSnap = await getDocs(collection(db, 'skills'));
          if (!skillsSnap.empty) {
            const skillsList: any[] = [];
            skillsSnap.forEach(docSnap => {
              skillsList.push({ ...docSnap.data(), _id: docSnap.id });
            });
            fetchedData.skills = skillsList.sort((a, b) => (a.index || 0) - (b.index || 0));
          } else {
            fetchedData.skills = fetchedData.skills.map((skillG, idx) => ({
              ...skillG,
              _id: `skill_${idx}`
            }));
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'skills');
        }

        // 3. Fetch services
        try {
          const servicesSnap = await getDocs(collection(db, 'services'));
          if (!servicesSnap.empty) {
            const servicesList: any[] = [];
            servicesSnap.forEach(docSnap => {
              servicesList.push({ ...docSnap.data(), _id: docSnap.id, id: docSnap.data().id ?? docSnap.id });
            });
            fetchedData.services = servicesList.sort((a, b) => (a.index || 0) - (b.index || 0));
          } else {
            fetchedData.services = fetchedData.services.map((s, idx) => ({
              ...s,
              _id: `service_${idx}`
            }));
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'services');
        }

        // 4. Fetch experiences
        try {
          const expSnap = await getDocs(collection(db, 'experience'));
          if (!expSnap.empty) {
            const expList: any[] = [];
            expSnap.forEach(docSnap => {
              expList.push({ ...docSnap.data(), _id: docSnap.id, id: docSnap.data().id ?? docSnap.id });
            });
            fetchedData.experience = expList.sort((a, b) => (a.index || 0) - (b.index || 0));
          } else {
            fetchedData.experience = fetchedData.experience.map((exp, idx) => ({
              ...exp,
              _id: `exp_${idx}`
            }));
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'experience');
        }

        // 5. Fetch projects & Check Upgrade
        let projectsNeedUpgrade = false;
        try {
          const projSnap = await getDocs(collection(db, 'projects'));
          if (!projSnap.empty) {
            const projList: any[] = [];
            projSnap.forEach(docSnap => {
              projList.push({ ...docSnap.data(), _id: docSnap.id, id: docSnap.data().id ?? docSnap.id });
            });
            fetchedData.projects = projList;

            // Check if projects contain old lists or need an upgrade
            const hasOldDemoProjects = projList.some((p: any) => p.title === "E-Commerce Website" || p.title === "Hotel Management Software" || p.title === "AgriConnect - Chittoor");
            const hasNewUniqueProjects = projList.some((p: any) => p.title === "Sri Hari Homestays" || p.title === "Kiritara Resorts" || p.title === "Idika Stays");
            if (hasOldDemoProjects || !hasNewUniqueProjects || projList.length < 9) {
              projectsNeedUpgrade = true;
            }
          } else {
            fetchedData.projects = fetchedData.projects.map((proj, idx) => ({
              ...proj,
              _id: `proj_${proj.id || idx}`
            }));
            projectsNeedUpgrade = true;
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'projects');
        }

        // 6. Fetch testimonials
        try {
          const testSnap = await getDocs(collection(db, 'testimonials'));
          if (!testSnap.empty) {
            const testList: any[] = [];
            testSnap.forEach(docSnap => {
              testList.push({ ...docSnap.data(), _id: docSnap.id });
            });
            fetchedData.testimonials = testList;
          } else {
            fetchedData.testimonials = fetchedData.testimonials.map((test, idx) => ({
              ...test,
              _id: `test_${idx}`
            }));
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'testimonials');
        }

        if (needsSeeding) {
          console.log("Firestore personal document not found. Auto-seeding default portfolio data to Firestore...");
          await seedFirestore(initialData);
          setData(initialData);
        } else if (projectsNeedUpgrade) {
          console.log("Old/incomplete projects set detected. Upgrading/seeding new list of projects to Firestore...");
          try {
            const oldProjSnap = await getDocs(collection(db, 'projects'));
            for (const docSnap of oldProjSnap.docs) {
              await deleteDoc(doc(db, 'projects', docSnap.id));
            }
          } catch (e) {
            console.warn("Could not delete older projects:", e);
          }
          
          const seededProjList: any[] = [];
          for (let i = 0; i < initialData.projects.length; i++) {
            const proj = initialData.projects[i];
            const docId = `proj_${proj.id || i}`;
            await setDoc(doc(db, 'projects', docId), {
              ...proj,
              _id: docId,
              id: proj.id || i
            });
            seededProjList.push({ ...proj, _id: docId, id: proj.id || i });
          }
          fetchedData.projects = seededProjList;
          setData(fetchedData);
        } else {
          setData(fetchedData);
        }
      } catch (e) {
        console.error('Failed to fetch from Firestore', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePersonal = async (personal: Partial<typeof initialData.personal>) => {
    try {
      await setDoc(doc(db, 'personal', 'main'), personal, { merge: true });
      setData(prev => ({
        ...prev,
        personal: { ...prev.personal, ...personal }
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'personal/main');
    }
  };

  const updateSocial = async (social: typeof initialData.social) => {
    try {
      await setDoc(doc(db, 'personal', 'main'), { social }, { merge: true });
      setData(prev => ({ ...prev, social }));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'personal/main/social');
    }
  };

  const updateSkills = async (skills: typeof initialData.skills) => {
    try {
      const skillsSnap = await getDocs(collection(db, 'skills'));
      for (const d of skillsSnap.docs) {
        await deleteDoc(doc(db, 'skills', d.id));
      }
      for (let i = 0; i < skills.length; i++) {
        await setDoc(doc(db, 'skills', `skill_${i}`), {
          ...skills[i],
          index: i
        });
      }
      setData(prev => ({ ...prev, skills }));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'skills');
    }
  };

  const updateExperience = async (experience: typeof initialData.experience) => {
    try {
      const expSnap = await getDocs(collection(db, 'experience'));
      for (const d of expSnap.docs) {
        await deleteDoc(doc(db, 'experience', d.id));
      }
      for (let i = 0; i < experience.length; i++) {
        const exp = experience[i] as any;
        const docId = exp._id || `exp_${Date.now()}_${i}`;
        await setDoc(doc(db, 'experience', docId), {
          ...exp,
          _id: docId,
          index: i
        });
      }
      setData(prev => ({ ...prev, experience }));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'experience');
    }
  };

  const updateServices = async (services: typeof initialData.services) => {
    try {
      const servicesSnap = await getDocs(collection(db, 'services'));
      for (const d of servicesSnap.docs) {
        await deleteDoc(doc(db, 'services', d.id));
      }
      for (let i = 0; i < services.length; i++) {
        const s = services[i] as any;
        const docId = s._id || `service_${Date.now()}_${i}`;
        await setDoc(doc(db, 'services', docId), {
          ...s,
          _id: docId,
          index: i
        });
      }
      setData(prev => ({ ...prev, services }));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'services');
    }
  };

  const addProject = async (project: any) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...project,
        createdAt: new Date().toISOString()
      });
      const newProject = {
        ...project,
        _id: docRef.id,
        id: project.id || docRef.id
      };
      await updateDoc(doc(db, 'projects', docRef.id), { _id: docRef.id });
      
      setData(prev => ({
        ...prev,
        projects: [newProject, ...prev.projects]
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'projects');
    }
  };

  const updateProject = async (id: string, project: any) => {
    try {
      const docId = id || project._id || (project.id ? `proj_${project.id}` : null);
      if (!docId) {
        throw new Error("No valid project document ID found");
      }
      const cleaned = { ...project };
      delete cleaned._id;
      await setDoc(doc(db, 'projects', docId), cleaned, { merge: true });
      setData((prev: any) => ({
        ...prev,
        projects: prev.projects.map((p: any) => (p._id === docId || String(p.id) === String(project.id)) ? { ...p, ...project, _id: docId } : p)
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const project = data.projects.find((p: any) => p._id === id || String(p.id) === id);
      const docId = id || project?._id || (project?.id ? `proj_${project.id}` : null);
      if (!docId) {
        throw new Error("No valid project document ID found to delete");
      }
      await deleteDoc(doc(db, 'projects', docId));
      setData((prev: any) => ({
        ...prev,
        projects: prev.projects.filter((p: any) => p._id !== docId && String(p.id) !== String(project?.id))
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `projects/${id}`);
    }
  };

  const toggleProjectFeatured = async (id: string) => {
    const project = data.projects.find((p: any) => p._id === id || String(p.id) === id);
    if (project) {
      const docId = id || project._id || (project.id ? `proj_${project.id}` : null);
      await updateProject(docId, { featured: !project.featured });
    }
  };

  const addTestimonial = async (testimonial: any) => {
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonial,
        createdAt: new Date().toISOString()
      });
      const newT = {
        ...testimonial,
        _id: docRef.id
      };
      await updateDoc(doc(db, 'testimonials', docRef.id), { _id: docRef.id });
      setData((prev: any) => ({
        ...prev,
        testimonials: [newT, ...prev.testimonials]
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'testimonials');
    }
  };

  const updateTestimonial = async (id: string, testimonial: any) => {
    try {
      const stateTest = data.testimonials.find((t: any) => t._id === id || t.author === testimonial.author);
      const docId = id || testimonial._id || stateTest?._id;
      if (!docId) {
        throw new Error("No valid testimonial document ID found");
      }
      const cleaned = { ...testimonial };
      delete cleaned._id;
      await setDoc(doc(db, 'testimonials', docId), cleaned, { merge: true });
      setData((prev: any) => ({
        ...prev,
        testimonials: prev.testimonials.map((t: any) => (t._id === docId || t.author === testimonial.author) ? { ...t, ...testimonial, _id: docId } : t)
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `testimonials/${id}`);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const stateTest = data.testimonials.find((t: any) => t._id === id);
      const docId = id || stateTest?._id;
      if (!docId) {
        throw new Error("No valid testimonial document ID found to delete");
      }
      await deleteDoc(doc(db, 'testimonials', docId));
      setData((prev: any) => ({
        ...prev,
        testimonials: prev.testimonials.filter((t: any) => t._id !== docId)
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  const resetToDefaults = async () => {
    try {
      setIsLoading(true);
      const collectionsToClear = ['personal', 'skills', 'services', 'experience', 'projects', 'testimonials'];
      for (const col of collectionsToClear) {
        const snap = await getDocs(collection(db, col));
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, col, docSnap.id));
        }
      }
      await seedFirestore(initialData);
      setData(initialData);
    } catch (e) {
      console.error("Failed to wipe and re-seed defaults to Firestore:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      data, 
      isLoading,
      updatePersonal,
      updateSocial,
      updateSkills,
      updateExperience,
      updateServices,
      addProject, 
      updateProject, 
      deleteProject,
      toggleProjectFeatured,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      resetToDefaults
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

