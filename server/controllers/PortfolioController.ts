import { 
  getPersonal, 
  updatePersonal as updatePersonalDb, 
  getProjects, 
  createProject as createProjectDb, 
  updateProject as updateProjectDb, 
  deleteProject as deleteProjectDb,
  getSkills, 
  updateSkills as updateSkillsDb, 
  getServices, 
  updateServices as updateServicesDb, 
  getExperiences, 
  updateExperiences as updateExperiencesDb, 
  getTestimonials, 
  createTestimonial as createTestimonialDb, 
  updateTestimonial as updateTestimonialDb, 
  deleteTestimonial as deleteTestimonialDb 
} from '../db';

export const getPortfolio = async (req: any, res: any) => {
  try {
    const [personal, projects, testimonials, services, skills, experience] = await Promise.all([
      getPersonal(),
      getProjects(),
      getTestimonials(),
      getServices(),
      getSkills(),
      getExperiences()
    ]);
    res.json({ personal, projects, testimonials, services, skills, experience });
  } catch (error) {
    console.error('Failed to fetch portfolio from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio from Firestore' });
  }
};

export const updatePersonal = async (req: any, res: any) => {
  try {
    await updatePersonalDb(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update personal info in Firestore:', error);
    res.status(500).json({ error: 'Failed to update personal info' });
  }
};

export const createProject = async (req: any, res: any) => {
  try {
    const project = await createProjectDb(req.body);
    res.json(project);
  } catch (error) {
    console.error('Failed to create project in Firestore:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: any, res: any) => {
  try {
    const project = await updateProjectDb(req.params.id, req.body);
    res.json(project);
  } catch (error) {
    console.error('Failed to update project in Firestore:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: any, res: any) => {
  try {
    await deleteProjectDb(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project from Firestore:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const updateSkills = async (req: any, res: any) => {
  try {
    await updateSkillsDb(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update skills in Firestore:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
};

export const updateServices = async (req: any, res: any) => {
  try {
    await updateServicesDb(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update services in Firestore:', error);
    res.status(500).json({ error: 'Failed to update services' });
  }
};

export const updateExperience = async (req: any, res: any) => {
  try {
    await updateExperiencesDb(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update experience in Firestore:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

export const createTestimonial = async (req: any, res: any) => {
  try {
    const testimonial = await createTestimonialDb(req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('Failed to create testimonial in Firestore:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

export const updateTestimonial = async (req: any, res: any) => {
  try {
    const testimonial = await updateTestimonialDb(req.params.id, req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('Failed to update testimonial in Firestore:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

export const deleteTestimonial = async (req: any, res: any) => {
  try {
    await deleteTestimonialDb(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete testimonial from Firestore:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
