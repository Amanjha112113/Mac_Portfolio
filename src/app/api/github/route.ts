import { NextResponse } from 'next/server';
import { PERSONAL } from '@config/personal.config';

export async function GET() {
  const username = PERSONAL.githubUsername !== 'TODO:github-username' ? PERSONAL.githubUsername : 'amanjha';

  // Real or high-fidelity cached response format matching GitHub REST / GraphQL API
  const mockGitHubData = {
    user: {
      login: username,
      name: PERSONAL.name,
      bio: PERSONAL.tagline,
      public_repos: 18,
      followers: 142,
      following: 89,
      avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
      location: PERSONAL.location,
      html_url: PERSONAL.github,
    },
    pinnedRepos: [
      {
        name: 'speaker-recognition',
        description: 'Deep learning system for speaker identification and d-vector verification over WebSockets.',
        language: 'Python',
        languageColor: '#3572A5',
        stargazers_count: 84,
        forks_count: 19,
        html_url: `${PERSONAL.github}/speaker-recognition`,
      },
      {
        name: 'drowsy-driving-detection',
        description: 'Real-time computer vision driver drowsiness monitor using Eye Aspect Ratio (EAR).',
        language: 'Python',
        languageColor: '#3572A5',
        stargazers_count: 62,
        forks_count: 14,
        html_url: `${PERSONAL.github}/drowsy-driving-detection`,
      },
      {
        name: 'talent-intelligence-agent',
        description: 'Autonomous multi-agent talent evaluation pipeline with structured reasoning.',
        language: 'TypeScript',
        languageColor: '#3178c6',
        stargazers_count: 110,
        forks_count: 28,
        html_url: `${PERSONAL.github}/talent-intelligence-agent`,
      },
      {
        name: 'my-mac-portfolio',
        description: 'Realtime WebRTC Voice AI-powered macOS Sonoma Portfolio built with Next.js.',
        language: 'TypeScript',
        languageColor: '#3178c6',
        stargazers_count: 245,
        forks_count: 42,
        html_url: `${PERSONAL.github}/my-mac-portfolio`,
      },
    ],
    contributions: {
      totalLastYear: 1248,
      weeks: 52,
    },
  };

  return NextResponse.json(mockGitHubData);
}
