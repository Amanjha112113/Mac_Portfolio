/**
 * voice.config.ts
 * Single source of truth for voice AI provider configuration.
 * All voice provider choices are driven by environment variables.
 * No provider is hardcoded here — the runtime selects based on config.
 */

export type ASRProvider = 'deepgram' | 'openai-whisper' | 'assemblyai';
export type LLMProvider = 'openai' | 'anthropic' | 'google';
export type TTSProvider = 'elevenlabs' | 'openai-tts' | 'azure-tts';

export interface VoiceConfig {
  /** URL of the FastAPI voice server */
  voiceServerUrl: string;
  /** Primary ASR provider */
  asrProvider: ASRProvider;
  /** Primary LLM provider */
  llmProvider: LLMProvider;
  /** LLM model identifier */
  llmModel: string;
  /** Primary TTS provider */
  ttsProvider: TTSProvider;
  /** TTS voice identifier */
  ttsVoiceId: string;
  /** WebRTC ICE servers */
  iceServers: RTCIceServer[];
  /** Voice latency targets (engineering goals, not SLAs) */
  latencyTargets: {
    ttfaP50Ms: number;
    interruptionStopMs: number;
  };
  /** Maximum audio queue size before backpressure */
  maxAudioQueueSize: number;
  /** VAD configuration */
  vad: {
    silenceThresholdMs: number;
    speechThresholdMs: number;
  };
}

export const VOICE_CONFIG: VoiceConfig = {
  voiceServerUrl: process.env.NEXT_PUBLIC_VOICE_SERVER_URL ?? 'http://localhost:8000',
  asrProvider: (process.env.ASR_PROVIDER as ASRProvider) ?? 'deepgram',
  llmProvider: (process.env.LLM_PROVIDER as LLMProvider) ?? 'openai',
  llmModel: process.env.LLM_MODEL ?? 'gpt-4o-mini',
  ttsProvider: (process.env.TTS_PROVIDER as TTSProvider) ?? 'openai-tts',
  ttsVoiceId: process.env.TTS_VOICE_ID ?? 'alloy',
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // TODO: Add TURN server for production NAT traversal
    // {
    //   urls: process.env.TURN_SERVER_URL ?? '',
    //   username: process.env.TURN_USERNAME ?? '',
    //   credential: process.env.TURN_CREDENTIAL ?? '',
    // },
  ],
  latencyTargets: {
    ttfaP50Ms: 700,
    interruptionStopMs: 200,
  },
  maxAudioQueueSize: 32,
  vad: {
    silenceThresholdMs: 800,
    speechThresholdMs: 200,
  },
};
