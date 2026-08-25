/**
 * personal.config.ts
 * Single source of truth for Aman Jha's personal information.
 * All portfolio content derives from this file.
 * Do NOT duplicate these values across components.
 */

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number | 'Present';
  gpa?: string;
  highlights: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description: string[];
  technologies: string[];
}

export interface Achievement {
  title: string;
  description: string;
  year: number;
  icon?: string;
}

export interface PersonalConfig {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  resumeUrl: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
  education: Education[];
  experience: Experience[];
  skills: {
    ai: string[];
    languages: string[];
    frameworks: string[];
    tools: string[];
    cloud: string[];
  };
  achievements: Achievement[];
}

export const PERSONAL: PersonalConfig = {
  name: 'Aman Jha',
  firstName: 'Aman',
  lastName: 'Jha',
  title: 'AI/ML Engineer & Researcher',
  tagline: 'Building intelligent systems at the intersection of voice AI, computer vision, and agentic systems.',
  bio: `I'm Aman Jha, an AI/ML engineer passionate about building intelligent, human-centered systems. 
My work spans realtime voice AI, computer vision, agentic AI, and full-stack development. 
I enjoy pushing the boundaries of what AI can do in production environments — from low-latency voice 
assistants to sophisticated multi-modal systems.`,
  location: 'India',
  email: 'TODO:your-email@example.com',
  github: 'https://github.com/TODO:github-username',
  githubUsername: 'TODO:github-username',
  linkedin: 'https://linkedin.com/in/TODO:linkedin-handle',
  resumeUrl: '/resume.pdf',
  avatarUrl: '/avatar.jpg',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/TODO:github-username',
      handle: 'TODO:github-username',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/TODO:linkedin-handle',
      handle: 'TODO:linkedin-handle',
    },
  ],
  education: [
    {
      degree: 'TODO:Degree',
      field: 'TODO:Field of Study (e.g. AI and Data Science)',
      institution: 'TODO:University Name',
      location: 'TODO:City, Country',
      startYear: 2022,
      endYear: 2026,
      highlights: [
        'TODO: Add academic highlight or project',
        'TODO: Add relevant coursework',
      ],
    },
  ],
  experience: [
    {
      title: 'TODO:Role Title',
      company: 'TODO:Company Name',
      location: 'TODO:Location or Remote',
      startDate: 'TODO:Start Date',
      endDate: 'Present',
      description: [
        'TODO: Add a key responsibility or achievement',
        'TODO: Add another one',
      ],
      technologies: ['Python', 'TODO: Add technologies'],
    },
  ],
  skills: {
    ai: [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Voice AI',
      'Agentic AI',
      'RAG',
      'TODO: Add more AI skills',
    ],
    languages: ['Python', 'TypeScript', 'JavaScript', 'TODO: Add more languages'],
    frameworks: [
      'Next.js',
      'React',
      'FastAPI',
      'PyTorch',
      'TODO: Add more frameworks',
    ],
    tools: ['Git', 'Docker', 'WebRTC', 'TODO: Add more tools'],
    cloud: ['TODO: Add cloud providers (e.g. AWS, GCP, Azure, Vercel)'],
  },
  achievements: [
    {
      title: 'TODO: Achievement Title',
      description: 'TODO: Achievement description',
      year: 2024,
    },
  ],
};
