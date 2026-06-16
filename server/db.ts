import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface DbState {
  personal: any | null;
  projects: any[];
  testimonials: any[];
  services: any[];
  skills: any[];
  experience: any[];
  users: any[];
}

let cache: DbState | null = null;

// Ensure database directory and file exist, returning the cached state
function ensureDb(): DbState {
  if (cache) return cache;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      cache = JSON.parse(content);
      return cache!;
    } catch (e) {
      console.error("Failed to parse db.json, reinitializing empty database...", e);
    }
  }

  // Initialize empty state; seedDatabase on startup will populate this correctly
  cache = {
    personal: null,
    projects: [],
    testimonials: [],
    services: [],
    skills: [],
    experience: [],
    users: []
  };

  saveDb();
  return cache!;
}

function saveDb() {
  if (!cache) return;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to save db.json", e);
  }
}

// Dummy mock database client so that any other imports of getDb don't break
export function getDb(): any {
  ensureDb();
  return {
    collection: (name: string) => ({
      doc: (id: string) => ({
        get: async () => ({
          exists: true,
          data: () => null
        })
      })
    })
  };
}

// --- DATABASE OPERATIONS ---

// 1. Personal
export async function getPersonal() {
  const db = ensureDb();
  return db.personal;
}

export async function updatePersonal(data: any) {
  const db = ensureDb();
  const cleanedData = { ...data };
  delete cleanedData._id;
  delete cleanedData.id;

  db.personal = {
    ...cleanedData,
    _id: 'main',
    id: 'main',
    updatedAt: new Date().toISOString()
  };
  saveDb();
  return { success: true };
}

// 2. Projects
export async function getProjects() {
  const db = ensureDb();
  return db.projects;
}

export async function createProject(data: any) {
  const db = ensureDb();
  const cleanedData = { ...data };
  delete cleanedData._id;

  const newId = `proj_${Date.now()}`;
  const newProject = {
    ...cleanedData,
    _id: newId,
    id: cleanedData.id ?? Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.projects.push(newProject);
  saveDb();
  return newProject;
}

export async function updateProject(id: string, data: any) {
  const db = ensureDb();
  const cleanedData = { ...data };
  delete cleanedData._id;

  const index = db.projects.findIndex(p => p._id === id || String(p.id) === id);
  if (index === -1) throw new Error("Project not found");

  db.projects[index] = {
    ...db.projects[index],
    ...cleanedData,
    updatedAt: new Date().toISOString()
  };

  saveDb();
  return db.projects[index];
}

export async function deleteProject(id: string) {
  const db = ensureDb();
  db.projects = db.projects.filter(p => p._id !== id && String(p.id) !== id);
  saveDb();
  return { success: true };
}

// 3. Testimonials
export async function getTestimonials() {
  const db = ensureDb();
  return db.testimonials;
}

export async function createTestimonial(data: any) {
  const db = ensureDb();
  const cleanedData = { ...data };
  delete cleanedData._id;

  const newId = `test_${Date.now()}`;
  const newTestimonial = {
    ...cleanedData,
    _id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.testimonials.push(newTestimonial);
  saveDb();
  return newTestimonial;
}

export async function updateTestimonial(id: string, data: any) {
  const db = ensureDb();
  const cleanedData = { ...data };
  delete cleanedData._id;

  const index = db.testimonials.findIndex(t => t._id === id);
  if (index === -1) throw new Error("Testimonial not found");

  db.testimonials[index] = {
    ...db.testimonials[index],
    ...cleanedData,
    updatedAt: new Date().toISOString()
  };

  saveDb();
  return db.testimonials[index];
}

export async function deleteTestimonial(id: string) {
  const db = ensureDb();
  db.testimonials = db.testimonials.filter(t => t._id !== id);
  saveDb();
  return { success: true };
}

// 4. Services
export async function getServices() {
  const db = ensureDb();
  return db.services;
}

export async function updateServices(services: any[]) {
  const db = ensureDb();
  db.services = services.map((s, idx) => ({
    ...s,
    id: s.id ?? idx,
    updatedAt: new Date().toISOString()
  }));
  saveDb();
  return { success: true };
}

// 5. Skills
export async function getSkills() {
  const db = ensureDb();
  return db.skills;
}

export async function updateSkills(skills: any[]) {
  const db = ensureDb();
  db.skills = skills;
  saveDb();
  return { success: true };
}

// 6. Experiences
export async function getExperiences() {
  const db = ensureDb();
  return db.experience;
}

export async function updateExperiences(experience: any[]) {
  const db = ensureDb();
  db.experience = experience.map((exp, index) => ({
    ...exp,
    _id: exp._id || `exp_${Date.now()}_${index}`,
    id: exp.id || index,
    updatedAt: new Date().toISOString()
  }));
  saveDb();
  return { success: true };
}

// 7. Users
export async function getUserByEmail(email: string) {
  const db = ensureDb();
  const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return found || null;
}

export async function createUser(data: any) {
  const db = ensureDb();
  const cleanedData = { ...data };
  delete cleanedData._id;

  const newUser = {
    ...cleanedData,
    _id: `user_${Date.now()}`,
    email: cleanedData.email.toLowerCase(),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb();
  return newUser;
}
