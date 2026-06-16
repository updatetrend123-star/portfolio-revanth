import { 
  getPersonal, 
  updatePersonal, 
  getProjects, 
  createProject, 
  getTestimonials, 
  createTestimonial, 
  getServices, 
  updateServices, 
  getSkills, 
  updateSkills, 
  getExperiences, 
  updateExperiences, 
  getUserByEmail, 
  createUser 
} from './db';
import { portfolioData as initialData } from '../src/constants';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('--- Initializing Firestore Database Synchronization ---');

    // 1. Projects
    const projects = await getProjects();
    if (projects.length === 0) {
      console.log('Seeding Projects...');
      for (const p of initialData.projects) {
        await createProject(p);
      }
    } else {
      console.log('Projects already initialized in Firestore.');
    }

    // 2. Testimonials
    const testimonials = await getTestimonials();
    if (testimonials.length === 0) {
      console.log('Seeding Testimonials...');
      for (const t of initialData.testimonials) {
        await createTestimonial(t);
      }
    } else {
      console.log('Testimonials already initialized.');
    }

    // 3. Services
    const services = await getServices();
    if (services.length === 0) {
      console.log('Seeding Services...');
      await updateServices(initialData.services);
    } else {
      console.log('Services already initialized.');
    }

    // 4. Skills
    const skills = await getSkills();
    if (skills.length === 0) {
      console.log('Seeding Skills...');
      await updateSkills(initialData.skills || []);
    } else {
      console.log('Skills already initialized.');
    }

    // 5. Experience
    const experiences = await getExperiences();
    if (experiences.length === 0) {
      console.log('Seeding Experience milestones...');
      await updateExperiences(initialData.experience);
    } else {
      console.log('Experience already initialized.');
    }

    // 6. Personal Info
    const personal = await getPersonal();
    if (!personal) {
      console.log('Initializing Personal Reputation Node...');
      await updatePersonal(initialData.personal);
    } else {
      console.log('Personal context already initialized.');
    }

    // 7. Admin User
    const adminEmail = 'admin@revanth.com';
    const existingAdmin = await getUserByEmail(adminEmail);
    if (!existingAdmin) {
      console.log('Deploying Nexus Admin account...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await createUser({
        email: adminEmail,
        password: hashedPassword,
        name: 'Revanth Admin'
      });
      console.log('Admin account deployed successfully.');
    } else {
      console.log('Admin account already active in Nexus.');
    }

    console.log('--- Firestore Database Synchronization Module: ONLINE ---');
  } catch (error) {
    console.error('CRITICAL ERROR: Firestore Database Synchronization Failed:', error);
  }
}
