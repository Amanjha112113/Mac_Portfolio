/**
 * voice.types.ts
 * Core types for the voice/AI system.
 */

/**
 * Authoritative voice state machine.
 * Do NOT represent this with multiple independent booleans.
 */
export type VoiceState =
  | 'IDLE'
  | 'CONNECTING'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'ERROR';

export interface VoiceSession {
  sessionId: string;
  state: VoiceState;
  currentTurnId: string | null;
  createdAt: number;
}

export interface VoiceTurn {
  turnId: string;
  sessionId: string;
  startedAt: number;
  cancelled: boolean;
  userTranscript?: string;
  agentResponse?: string;
}

export interface VoiceMetrics {
  sessionId: string;
  turnId: string;
  timestamps: {
    speechStart?: number;
    speechEnd?: number;
    vadStart?: number;
    vadEnd?: number;
    asrStart?: number;
    asrFirstPartial?: number;
    asrFinal?: number;
    llmStart?: number;
    llmFirstToken?: number;
    ttsStart?: number;
    ttsFirstAudio?: number;
    playbackStart?: number;
    interruptionDetected?: number;
    playbackStopped?: number;
    turnCompleted?: number;
  };
}

export interface VoiceMessage {
  type:
    | 'voice.state'
    | 'transcript.partial'
    | 'transcript.final'
    | 'turn.started'
    | 'turn.cancelled'
    | 'tool.started'
    | 'tool.completed'
    | 'error'
    | 'metrics';
  sessionId: string;
  turnId?: string;
  payload: unknown;
}

/**
 * Transport provider interface.
 * WebRTCTransport is the default implementation.
 * AgoraTransport would be an optional future adapter.
 * The rest of the system must not care which is active.
 */
export interface TransportProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(message: unknown): void;
  onMessage(callback: (message: unknown) => void): void;
  readonly isConnected: boolean;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  turnId?: string;
}

export interface VoiceStoreState {
  session: VoiceSession | null;
  turns: VoiceTurn[];
  conversation: ConversationMessage[];
  micPermission: 'unknown' | 'granted' | 'denied' | 'prompt';
  error: string | null;
  isDevPanelOpen: boolean;
}

export interface VoiceStoreActions {
  initSession: () => void;
  endSession: () => void;
  setState: (state: VoiceState) => void;
  startTurn: () => string;
  cancelTurn: (turnId: string) => void;
  addUserMessage: (content: string, turnId?: string) => void;
  addAgentMessage: (content: string, turnId?: string) => void;
  setMicPermission: (status: VoiceStoreState['micPermission']) => void;
  setError: (error: string | null) => void;
  toggleDevPanel: () => void;
}
