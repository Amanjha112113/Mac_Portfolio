import { create } from 'zustand';

export type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'INTERRUPTED' | 'ERROR';

export interface TranscriptItem {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  toolCall?: string;
  actionPayload?: {
    appId?: string;
    actionType?: 'open-app' | 'set-wallpaper' | 'download-resume' | 'run-command';
    data?: unknown;
  };
  timestamp?: string;
}

interface VoiceStore {
  state: VoiceState;
  transcript: TranscriptItem[];
  isMicActive: boolean;
  isMuted: boolean;
  audioLevel: number;
  latency: number;
  speechSynthesisEnabled: boolean;
  activeStreamingId: string | null;

  setState: (state: VoiceState) => void;
  addTranscript: (turn: TranscriptItem) => void;
  updateLastAiTranscript: (text: string, toolCall?: string, actionPayload?: TranscriptItem['actionPayload']) => void;
  clearTranscript: () => void;
  setMicActive: (active: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setAudioLevel: (level: number) => void;
  setLatency: (latency: number) => void;
  setSpeechSynthesisEnabled: (enabled: boolean) => void;
  setActiveStreamingId: (id: string | null) => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  state: 'IDLE',
  transcript: [
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm Aman's AI realtime assistant powered by WebRTC & Fast ASR/TTS. Ask me about Aman's projects, experience, tech stack, or tell me to control macOS apps!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  isMicActive: false,
  isMuted: false,
  audioLevel: 0,
  latency: 142,
  speechSynthesisEnabled: true,
  activeStreamingId: null,
  
  setState: (state) => set({ state }),
  
  addTranscript: (turn) => set((s) => ({ 
    transcript: [
      ...s.transcript, 
      {
        ...turn,
        timestamp: turn.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ] 
  })),

  updateLastAiTranscript: (text, toolCall, actionPayload) => set((s) => {
    const lastIndex = s.transcript.map(t => t.sender).lastIndexOf('ai');
    if (lastIndex === -1) return s;
    const updated = [...s.transcript];
    updated[lastIndex] = {
      ...updated[lastIndex],
      text,
      ...(toolCall !== undefined ? { toolCall } : {}),
      ...(actionPayload !== undefined ? { actionPayload } : {}),
    };
    return { transcript: updated };
  }),
  
  clearTranscript: () => set({ transcript: [] }),
  
  setMicActive: (isMicActive) => set({ isMicActive }),
  
  setIsMuted: (isMuted) => set({ isMuted }),

  setAudioLevel: (audioLevel) => set({ audioLevel }),
  
  setLatency: (latency) => set({ latency }),

  setSpeechSynthesisEnabled: (speechSynthesisEnabled) => set({ speechSynthesisEnabled }),

  setActiveStreamingId: (activeStreamingId) => set({ activeStreamingId }),
}));
