/**
 * projects.config.ts
 * Single source of truth for Aman Jha's portfolio projects.
 * Used by Finder, App Store, search, and the voice agent.
 */

export type ProjectCategory =
  | 'ai-ml'
  | 'computer-vision'
  | 'voice-ai'
  | 'agentic-ai'
  | 'data-science'
  | 'full-stack'
  | 'nlp';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: ProjectCategory[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  highlights: string[];
  year: number;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'speaker-recognition',
    title: 'Speaker Recognition System',
    shortDescription: 'Deep learning system for speaker identification and verification.',
    longDescription: `A production-grade speaker recognition system that uses deep neural networks 
to identify and verify speakers from audio signals. Implements state-of-the-art speaker embeddings 
and robust noise-invariant feature extraction.`,
    category: ['voice-ai', 'ai-ml'],
    technologies: ['Python', 'PyTorch', 'Librosa', 'FastAPI'],
    githubUrl: 'https://github.com/amanjha/speaker-recognition',
    imageUrl: '/projects/speaker-recognition.jpg',
    highlights: [
      'Over 98.2% verification accuracy on custom noisy datasets',
      'Uses d-vector embeddings extractor optimized with Cosine Similarity',
      'Realtime streaming verification pipeline with FastAPIs WebSockets',
    ],
    year: 2024,
    featured: true,
  },
  {
    id: 'drowsy-driving',
    title: 'Drowsy Driving Detection',
    shortDescription: 'Real-time computer vision system for driver drowsiness detection.',
    longDescription: `A real-time drowsy driver detection system using facial landmark analysis 
and computer vision techniques. The system monitors Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) 
to detect signs of fatigue and alert the driver.`,
    category: ['computer-vision', 'ai-ml'],
    technologies: ['Python', 'OpenCV', 'dlib', 'MediaPipe'],
    githubUrl: 'https://github.com/amanjha/drowsy-driving',
    imageUrl: '/projects/drowsy-driving.jpg',
    highlights: [
      'Maintains 30 FPS processing on standard mobile processor/edge devices',
      'Uses Eye Aspect Ratio (EAR) mapping for custom blink detection threshold',
      'Alert system triggers visual and voice alerts within 1.5 seconds of threshold breach',
    ],
    year: 2024,
    featured: true,
  },
  {
    id: 'talent-intelligence-agent',
    title: 'Talent Intelligence Agent',
    shortDescription: 'Agentic AI system for talent discovery and evaluation.',
    longDescription: `An agentic AI pipeline that autonomously researches, evaluates, and ranks 
candidates for technical roles. Uses multi-step reasoning, structured data extraction, and 
portfolio analysis to generate actionable talent intelligence reports.`,
    category: ['agentic-ai', 'nlp', 'ai-ml'],
    technologies: ['Python', 'LangChain', 'OpenAI', 'FastAPI'],
    githubUrl: 'https://github.com/amanjha/talent-intelligence',
    imageUrl: '/projects/talent-intelligence.jpg',
    highlights: [
      'Multi-agent pipeline using LangGraph with specialized evaluation roles',
      'Parses and scores resume files dynamically with JSON Schema validations',
      'Generates 95% accurate matches based on custom role criteria',
    ],
    year: 2024,
    featured: true,
  },
  {
    id: 'voice-ai-portfolio',
    title: 'Aman AI — Voice Portfolio Assistant',
    shortDescription: 'This portfolio\'s realtime voice AI assistant built on WebRTC.',
    longDescription: `A production-quality realtime voice assistant embedded in this portfolio. 
Implements streaming ASR, streaming LLM, streaming TTS, VAD, barge-in, and cancellation 
over WebRTC transport. The assistant can answer portfolio questions and control portfolio UI.`,
    category: ['voice-ai', 'agentic-ai', 'full-stack'],
    technologies: ['WebRTC', 'FastAPI', 'Next.js', 'TypeScript', 'Python'],
    demoUrl: '/',
    imageUrl: '/projects/voice-ai.jpg',
    highlights: [
      'WebRTC primary transport — no Agora dependency',
      'Streaming ASR → LLM → TTS pipeline',
      'Barge-in with < 200ms interruption target',
      'Portfolio agent with tool calling',
    ],
    year: 2025,
    featured: true,
  },
];

/** Get a project by ID. Returns undefined if not found. */
export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Get featured projects. */
export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

/** Get projects by category. */
export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return PROJECTS.filter((p) => p.category.includes(category));
}
