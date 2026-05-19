/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized portfolio data
export const portfolioData = {
  personal: {
    name: "Yallanuru Revanth Kumar",
    role: "FullStack Web Developer",
    tagline: "Turning bold ideas into blazing web experiences.",
    about: "I am a detail-oriented web developer with a strong foundation in React.js and a commitment to creating user-friendly applications. I thrive on enhancing user experience through collaboration and effective debugging techniques. My education in Artificial Intelligence and practical experience in internships have equipped me with modern web technologies and teamwork skills necessary to excel in dynamic environments.",
    email: "revanthkumaryallanuru103@gmail.com",
    phone: "+91 7207357312",
    location: "Tirupati, India",
    portraitImage: "/portrait.jpg",
    resumeUrl: "/resume.pdf", 
    emailJsServiceId: "service_wh1e55s", 
    emailJsTemplateId: "template_v7hlhyr",
    emailJsPublicKey: "wYWNraaxlIDzx3Yc7", 
  },

  social: [
    { name: "GitHub", icon: "Github", url: "https://github.com/revanthkumaryallanuru" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://www.linkedin.com/in/revanth-kumar-yallanuru-434488329/" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com/revanth_kumar_yallanuru" },
    { name: "Email", icon: "Mail", url: "mailto:revanthkumaryallanuru103@gmail.com" },
  ],

  skills: [
    {
      category: "Frontend",
      items: [
        { name: "React.js", icon: "React" },
        { name: "JavaScript", icon: "Code2" },
        { name: "TypeScript", icon: "FileJson" },
        { name: "HTML5", icon: "Layout" },
        { name: "CSS3", icon: "Palette" },
        { name: "Responsive Design", icon: "Smartphone" },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", icon: "Server" },
        { name: "Express", icon: "Cpu" },
        { name: "PHP", icon: "Database" },
        { name: "REST APIs", icon: "Link" },
      ],
    },
    {
      category: "Database & Services",
      items: [
        { name: "Firebase", icon: "Flame" },
        { name: "MySQL", icon: "Database" },
        { name: "MongoDB", icon: "Leaf" },
        { name: "Git & GitHub", icon: "Github" },
      ],
    },
    {
      category: "Other Skills",
      items: [
        { name: "SEO", icon: "Search" },
        { name: "Project Management", icon: "ClipboardList" },
        { name: "Debugging", icon: "Bug" },
        { name: "Web Development", icon: "Globe" },
      ],
    },
  ],

  projects: [
    {
      id: 1,
      title: "E-Commerce Website",
      description: "Collaborated on a team-based e-commerce platform with a strong focus on responsive design. Built dynamic product pages and ensured smooth user experience across devices.",
      tech: ["Reactjs", "TailwindCss", "Node.js"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
      github: "https://github.com/RevanthkumarYallanuru",
      liveDemo: false,
      featured: true,
      category: "Web App"
    },
    {
      id: 3,
      title: "JPR Infraworks",
      description: "Built a professional service showcase application using React and Firebase. Implemented secure login, data handling, and production-ready deployment.",
      tech: ["React", "Firebase", "Netlify"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      link: "https://jprinfraworks.com/",
      github: "https://github.com/RevanthkumarYallanuru",
      liveDemo: true,
      featured: true,
      category: "Business"
    },
    {
      id: 4,
      title: "Hotel Management Software",
      description: "Developed a hotel management system with billing and staff modules. Designed a personal dashboard tailored for client usage.",
      tech: ["React", "JavaScript", "Dashboard"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      github: "https://github.com/RevanthkumarYallanuru",
      liveDemo: false,
      featured: true,
      category: "SaaS"
    },
    {
      id: 7,
      title: "AgriConnect - Chittoor",
      description: "A responsive AgriTech platform connecting local farmers directly with buyers. Enables transparent product listings and promotions.",
      tech: ["React", "JavaScript", "MVP"],
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
      link: "https://agriconnectchithoor.netlify.app/",
      github: "https://github.com/RevanthkumarYallanuru",
      liveDemo: true,
      featured: false,
      category: "AgriTech"
    }
  ],

  experience: [
    {
      id: 1,
      title: "Web Developer Intern",
      company: "Web Development Company",
      location: "Tirupati, India",
      period: "Sep-2024 - Feb-2025",
      type: "Internship",
      description: "Built responsive web applications using React.js with focus on clean code and user experience.",
      achievements: [
        "Developed React.js applications with responsive design",
        "Collaborated on feature enhancements and bug fixes",
        "Tested across multiple browsers and devices"
      ],
      skills: ["React", "JavaScript", "Responsive Design", "Git"]
    },
    {
      id: 2,
      title: "Freelance Web Developer",
      company: "Self Employed",
      location: "Remote | India",
      period: "Feb 2025 – Present",
      type: "Freelance",
      description: "Delivering custom web solutions for clients with focus on responsive design, performance, and SEO.",
      achievements: [
        "Designed and developed responsive, user-centric websites",
        "Built custom components and layouts",
        "Optimized performance and SEO"
      ],
      skills: ["React", "TypeScript", "TailwindCSS", "Node.js", "MongoDB", "SEO"]
    }
  ],

  services: [
    {
      id: 1,
      title: "Full Stack Web Applications",
      tagline: "End-to-end digital solutions",
      description: "Transform your business vision into scalable, production-ready web applications.",
      features: ["React.js frontend", "Node.js backend", "Database design", "Responsive UI", "SEO"],
      color: "from-primary to-secondary",
      highlighted: true,
      icon: "Cpu"
    },
    {
      id: 3,
      title: "From Idea to App",
      tagline: "Your vision, realized",
      description: "I guide you through the entire development journey—from concept to launch.",
      features: ["Idea validation", "MVP development", "Agile approach"],
      color: "from-primary to-accent",
      highlighted: true,
      icon: "Lightbulb"
    }
  ],

  testimonials: [
    {
      quote: "Revanth delivered an exceptional website that exceeded our expectations.",
      author: "G.Siva Ganesh",
      role: "Project Manager",
      rating: 5
    },
    {
      quote: "Working with Revanth was a game-changer. Highly recommended!",
      author: "Sarah Ali Khan",
      role: "Client - Tech Startup",
      rating: 5
    }
  ],
};
