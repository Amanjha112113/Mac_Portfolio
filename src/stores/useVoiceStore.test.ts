import { describe, it, expect, beforeEach } from 'vitest';
import { useVoiceStore } from './useVoiceStore';

describe('useVoiceStore', () => {
  beforeEach(() => {
    useVoiceStore.setState({
      state: 'IDLE',
      transcript: [],
      isMicActive: false,
      isMuted: false,
      audioLevel: 0,
      latency: 140,
      speechSynthesisEnabled: true,
      activeStreamingId: null,
    });
  });

  it('should initialize with idle voice state and empty transcript', () => {
    const state = useVoiceStore.getState();
    expect(state.state).toBe('IDLE');
    expect(state.transcript).toEqual([]);
    expect(state.isMicActive).toBe(false);
  });

  it('should add transcript items properly with timestamps', () => {
    const { addTranscript } = useVoiceStore.getState();
    addTranscript({
      id: 'test-1',
      sender: 'user',
      text: 'Who is Aman?',
    });

    const state = useVoiceStore.getState();
    expect(state.transcript.length).toBe(1);
    expect(state.transcript[0].text).toBe('Who is Aman?');
    expect(state.transcript[0].timestamp).toBeDefined();
  });

  it('should stream/update the last AI transcript chunk', () => {
    const { addTranscript, updateLastAiTranscript } = useVoiceStore.getState();
    addTranscript({
      id: 'ai-1',
      sender: 'ai',
      text: 'Initial',
    });

    updateLastAiTranscript('Initial and streamed chunk', 'Finder Tool');

    const state = useVoiceStore.getState();
    expect(state.transcript[0].text).toBe('Initial and streamed chunk');
    expect(state.transcript[0].toolCall).toBe('Finder Tool');
  });

  it('should toggle mic, mute, latency, and audioLevel', () => {
    const { setMicActive, setIsMuted, setAudioLevel, setLatency, setState } = useVoiceStore.getState();

    setMicActive(true);
    setIsMuted(true);
    setAudioLevel(0.85);
    setLatency(95);
    setState('SPEAKING');

    const state = useVoiceStore.getState();
    expect(state.isMicActive).toBe(true);
    expect(state.isMuted).toBe(true);
    expect(state.audioLevel).toBe(0.85);
    expect(state.latency).toBe(95);
    expect(state.state).toBe('SPEAKING');
  });

  it('should clear the conversation transcript', () => {
    const { addTranscript, clearTranscript } = useVoiceStore.getState();
    addTranscript({ id: '1', sender: 'user', text: 'Hello' });
    expect(useVoiceStore.getState().transcript.length).toBe(1);

    clearTranscript();
    expect(useVoiceStore.getState().transcript.length).toBe(0);
  });
});
