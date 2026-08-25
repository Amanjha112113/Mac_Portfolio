'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { PROJECTS } from '@config/projects.config';
import { useWindowStore } from '@/stores/useWindowStore';
import { useVoiceStore, TranscriptItem } from '@/stores/useVoiceStore';
import { 
  Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Wifi, 
  RotateCcw, Activity, ArrowRight, 
  Copy, Check, Cpu
} from 'lucide-react';

interface PromptCategory {
  label: string;
  prompts: string[];
}

const CATEGORIZED_PROMPTS: PromptCategory[] = [
  {
    label: '✨ Top Questions',
    prompts: [
      "Who is Aman Jha?",
      "What are Aman's core AI skills?",
      "Show all portfolio projects",
      "How is this realtime voice assistant built?",
    ],
  },
  {
    label: '🚀 Projects',
    prompts: [
      "Explain the Speaker Recognition System",
      "How does the Drowsy Driving Detection work?",
      "What is the Talent Intelligence Agent?",
      "Open Finder to view project files",
    ],
  },
  {
    label: '🎨 Mac Controls',
    prompts: [
      "Change wallpaper to liquid glass",
      "Open interactive Terminal",
      "Launch Music app",
      "Open System Settings for Resume",
    ],
  },
];

export default function VoiceAssistant() {
  const { 
    state: voiceState, 
    transcript, 
    isMicActive, 
    isMuted,
    audioLevel,
    latency,
    speechSynthesisEnabled,
    setState, 
    addTranscript, 
    updateLastAiTranscript,
    setMicActive, 
    setIsMuted,
    setAudioLevel,
    setLatency,
    clearTranscript 
  } = useVoiceStore();

  const [textInput, setTextInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const openApp = useWindowStore((s) => s.openApp);
  const setWallpaper = useWindowStore((s) => s.setWallpaper);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioAnimationRef = useRef<number | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, voiceState]);

  // Audio level oscillation simulation for fluid waveform/orb
  useEffect(() => {
    let phase = 0;
    const animateAudio = () => {
      if (voiceState === 'LISTENING' || voiceState === 'SPEAKING') {
        phase += 0.15;
        const base = voiceState === 'SPEAKING' ? 0.65 : 0.45;
        const variance = Math.sin(phase) * 0.25 + Math.cos(phase * 1.7) * 0.15;
        setAudioLevel(Math.max(0.1, Math.min(1, base + variance)));
      } else if (voiceState === 'THINKING') {
        phase += 0.2;
        setAudioLevel(0.35 + Math.sin(phase) * 0.15);
      } else {
        setAudioLevel(0);
      }
      audioAnimationRef.current = requestAnimationFrame(animateAudio);
    };

    audioAnimationRef.current = requestAnimationFrame(animateAudio);
    return () => {
      if (audioAnimationRef.current) cancelAnimationFrame(audioAnimationRef.current);
    };
  }, [voiceState, setAudioLevel]);

  // Stop synthetic audio speech (Barge-in / Interruption)
  const stopSpeechSynthesis = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Text to Speech playback with fallback
  const speakResponse = useCallback((text: string, onComplete?: () => void) => {
    if (isMuted || !speechSynthesisEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete) {
        setTimeout(onComplete, Math.min(text.length * 40, 3000));
      }
      return;
    }

    stopSpeechSynthesis();

    // Clean text for speech synthesis (remove markdown and URLs)
    const cleanText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_#`]/g, '')
      .replace(/https?:\/\/\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }, [isMuted, speechSynthesisEnabled, stopSpeechSynthesis]);

  // Handle Intent & Tool execution with real-time text streaming
  const handleProcessQuery = useCallback((query: string) => {
    if (!query.trim()) return;

    // Barge-in: interrupt any active speaking
    stopSpeechSynthesis();
    if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);

    const userMessageId = `user-${Date.now()}`;
    addTranscript({
      id: userMessageId,
      sender: 'user',
      text: query,
    });
    
    setTextInput('');
    setState('THINKING');
    setMicActive(false);

    // Simulate WebRTC roundtrip latency calculation
    const currentLatency = Math.floor(120 + Math.random() * 60);
    setLatency(currentLatency);

    const lower = query.toLowerCase();

    // Natural Language Intent Engine
    setTimeout(() => {
      let replyText = "";
      let toolCall: string | undefined;
      let actionPayload: TranscriptItem['actionPayload'] | undefined;

      if (lower.includes('who is') || lower.includes('about aman') || lower.includes('bio') || lower.includes('profile')) {
        replyText = `Aman Jha is an AI/ML Engineer & Researcher specializing in low-latency Voice AI, Computer Vision, and Agentic Systems. He designs production ML pipelines, multi-modal applications, and high-performance WebRTC architectures.`;
        toolCall = 'Personal Profile Knowledge Base';
      } else if (lower.includes('speaker recognition') || lower.includes('voice recognition') || lower.includes('speaker id')) {
        replyText = `The Speaker Recognition System is a deep neural network pipeline using d-vector embeddings with 98.2% verification accuracy on noisy datasets. It features real-time streaming verification via FastAPI WebSockets. Opening the project details for you now!`;
        toolCall = 'Finder (Speaker Recognition)';
        actionPayload = { appId: 'finder', actionType: 'open-app' };
        openApp('finder');
      } else if (lower.includes('drowsy') || lower.includes('driver') || lower.includes('fatigue')) {
        replyText = `The Drowsy Driving Detection system uses computer vision with Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) tracking via OpenCV & MediaPipe. It sustains 30 FPS on edge processors and triggers instant alerts within 1.5s.`;
        toolCall = 'Finder (Drowsy Driving Detection)';
        actionPayload = { appId: 'finder', actionType: 'open-app' };
        openApp('finder');
      } else if (lower.includes('talent') || lower.includes('intelligence') || lower.includes('agentic') || lower.includes('langchain') || lower.includes('langgraph')) {
        replyText = `The Talent Intelligence Agent is an autonomous agentic pipeline built with LangGraph, LangChain, and OpenAI. It autonomously researches candidate profiles, parses complex resumes against JSON schemas, and scores candidates with 95% accuracy.`;
        toolCall = 'Finder (Talent Intelligence Agent)';
        actionPayload = { appId: 'finder', actionType: 'open-app' };
        openApp('finder');
      } else if (lower.includes('voice assistant') || lower.includes('realtime') || lower.includes('how is this built') || lower.includes('architecture')) {
        replyText = `This Realtime Voice AI assistant is engineered with a WebRTC transport layer, ultra-low latency streaming ASR/TTS pipelines, VAD (Voice Activity Detection), and client-side agentic tool calling with < 200ms interruption barge-in support.`;
        toolCall = 'System Architecture (WebRTC + VAD)';
      } else if (lower.includes('project') || lower.includes('portfolio') || lower.includes('show all')) {
        replyText = `Aman has 4 featured production systems:\n1. 🎙️ Speaker Recognition (98.2% Accuracy, PyTorch)\n2. 🚗 Drowsy Driving Detection (30 FPS, OpenCV/MediaPipe)\n3. 🤖 Talent Intelligence Agent (LangGraph, Agentic AI)\n4. ⚡ Realtime Voice AI Assistant (WebRTC, Streaming Pipeline)\n\nOpening Finder to explore all project directories!`;
        toolCall = 'Finder (All Projects)';
        actionPayload = { appId: 'finder', actionType: 'open-app' };
        openApp('finder');
      } else if (lower.includes('skill') || lower.includes('stack') || lower.includes('technologies') || lower.includes('tools')) {
        replyText = `Aman's core engineering stack includes:\n• AI/ML: PyTorch, Deep Learning, NLP, Voice AI, Computer Vision, LangChain, RAG\n• Backend: Python, FastAPI, WebRTC, Docker, WebSockets\n• Frontend: Next.js, TypeScript, React, TailwindCSS\n\nOpening Notes with his comprehensive skill directory.`;
        toolCall = 'Notes (Aman Technical Skills)';
        actionPayload = { appId: 'notes', actionType: 'open-app' };
        openApp('notes');
      } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('experience') || lower.includes('hire') || lower.includes('job')) {
        replyText = `Aman Jha is open for full-time AI/ML Engineering & Research opportunities. You can review his education, experience, or download his official resume inside System Settings.`;
        toolCall = 'System Settings (Resume & Experience)';
        actionPayload = { appId: 'system-settings', actionType: 'open-app' };
        openApp('system-settings');
      } else if (lower.includes('wallpaper') || lower.includes('background') || lower.includes('theme')) {
        setWallpaper('/wallpaper.jpg');
        replyText = `Updated desktop wallpaper to the high-definition glassmorphic macOS fluid aesthetic!`;
        toolCall = 'Desktop Manager (Set Wallpaper)';
        actionPayload = { actionType: 'set-wallpaper', data: '/wallpaper.jpg' };
      } else if (lower.includes('terminal') || lower.includes('command') || lower.includes('cli') || lower.includes('zsh') || lower.includes('bash')) {
        replyText = `Launching interactive macOS zsh Terminal. You can run diagnostics, inspect repositories, or execute system utilities.`;
        toolCall = 'Terminal';
        actionPayload = { appId: 'terminal', actionType: 'open-app' };
        openApp('terminal');
      } else if (lower.includes('music') || lower.includes('song') || lower.includes('audio') || lower.includes('playlist')) {
        replyText = `Opening the Music player! Enjoy curated coding and lo-fi beats while exploring the portfolio.`;
        toolCall = 'Music Player';
        actionPayload = { appId: 'music', actionType: 'open-app' };
        openApp('music');
      } else if (lower.includes('safari') || lower.includes('browse') || lower.includes('web')) {
        replyText = `Launching Safari browser. You can explore research publications, GitHub repos, and live demos.`;
        toolCall = 'Safari';
        actionPayload = { appId: 'safari', actionType: 'open-app' };
        openApp('safari');
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('message') || lower.includes('reach out')) {
        replyText = `Opening Messages app to connect with Aman directly via email or professional socials.`;
        toolCall = 'Messages';
        actionPayload = { appId: 'messages', actionType: 'open-app' };
        openApp('messages');
      } else if (lower.includes('time') || lower.includes('date') || lower.includes('clock')) {
        const now = new Date();
        replyText = `The current time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on ${now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}.`;
        toolCall = 'System Clock API';
      } else {
        replyText = `I processed your inquiry: "${query}". I can explain Aman's 4 production AI projects, break down his technical stack, launch apps like Finder, Terminal, and Music, or update your macOS wallpaper.`;
        toolCall = 'General LLM Reasoning';
      }

      // Stream words into the transcript
      const aiMessageId = `ai-${Date.now()}`;
      addTranscript({
        id: aiMessageId,
        sender: 'ai',
        text: '',
        toolCall,
        actionPayload,
      });

      setState('SPEAKING');

      const words = replyText.split(' ');
      let currentWordIndex = 0;
      let streamedAccumulator = '';

      const streamNextWord = () => {
        if (currentWordIndex < words.length) {
          streamedAccumulator += (currentWordIndex > 0 ? ' ' : '') + words[currentWordIndex];
          updateLastAiTranscript(streamedAccumulator, toolCall, actionPayload);
          currentWordIndex++;
          streamTimeoutRef.current = setTimeout(streamNextWord, 35);
        } else {
          // Finished streaming text, start audio synthesis
          speakResponse(replyText, () => {
            setState('IDLE');
          });
        }
      };

      streamNextWord();
    }, 450);
  }, [addTranscript, openApp, setLatency, setMicActive, setState, setWallpaper, speakResponse, stopSpeechSynthesis, updateLastAiTranscript]);

  // Toggle Microphone (supports native Web Speech API if available)
  const toggleMic = () => {
    if (voiceState === 'LISTENING') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setState('IDLE');
      setMicActive(false);
      stopSpeechSynthesis();
    } else {
      // Barge-in: if currently speaking, interrupt it
      stopSpeechSynthesis();
      setState('LISTENING');
      setMicActive(true);

      // Check if browser Speech Recognition is available
      const SpeechRecognition = typeof window !== 'undefined' && 
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const transcriptText = event.results[0][0].transcript;
            if (transcriptText) {
              handleProcessQuery(transcriptText);
            }
          };

          recognition.onerror = () => {
            // Fallback to simulated query if microphone permission denied or network error
            simulateVoiceQuery();
          };

          recognition.onend = () => {
            setMicActive(false);
          };

          recognitionRef.current = recognition;
          recognition.start();
          return;
        } catch (e) {
          // Fall through to simulation
        }
      }

      // Fallback Voice Simulation
      simulateVoiceQuery();
    }
  };

  const simulateVoiceQuery = () => {
    const simulationOptions = [
      "Tell me about Aman's Speaker Recognition system and accuracy",
      "What are Aman's top AI and engineering skills?",
      "Open the interactive Terminal to check system status",
      "How is this realtime voice assistant built?",
      "Show all featured projects in Finder",
    ];
    const randomQuery = simulationOptions[Math.floor(Math.random() * simulationOptions.length)];

    setTimeout(() => {
      if (useVoiceStore.getState().state === 'LISTENING') {
        handleProcessQuery(randomQuery);
      }
    }, 2800);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActionClick = (payload?: TranscriptItem['actionPayload']) => {
    if (!payload) return;
    if (payload.actionType === 'open-app' && payload.appId) {
      openApp(payload.appId);
    } else if (payload.actionType === 'set-wallpaper') {
      const wp = typeof payload.data === 'string' ? payload.data : '/wallpaper.jpg';
      setWallpaper(wp);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e13]/95 backdrop-blur-2xl text-white overflow-hidden font-sans select-none relative">
      
      {/* Top Header & Telemetry HUD */}
      <div className="h-12 bg-white/[0.04] border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-300",
            voiceState === 'LISTENING' ? "bg-emerald-400 animate-ping" :
            voiceState === 'THINKING' ? "bg-purple-400 animate-spin" :
            voiceState === 'SPEAKING' ? "bg-blue-400 animate-pulse" : "bg-emerald-500"
          )} />
          <span className="font-semibold text-xs text-white/90 tracking-wide">Aman AI Assistant</span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono flex items-center gap-1">
            <Cpu size={10} /> WebRTC Realtime
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/60">
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            <Wifi size={12} className="text-emerald-400" />
            <span className="text-[10px] font-mono">Opus 48kHz</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            <Activity size={12} className="text-blue-400" />
            <span className="text-[10px] font-mono">{latency}ms TTFA</span>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title={isMuted ? "Unmute TTS Audio" : "Mute TTS Audio"}
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
          </button>
          <button
            onClick={clearTranscript}
            className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Siri / Apple Intelligence Voice Visualizer Stage */}
      <div className="h-52 bg-gradient-to-b from-[#15151f] via-[#101017] to-[#0e0e13] border-b border-white/10 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
        
        {/* Dynamic Multi-layered Ambient Glow */}
        <motion.div 
          animate={{
            scale: voiceState === 'LISTENING' ? [1, 1.3, 1.1] :
                   voiceState === 'THINKING' ? [1, 1.2, 1] :
                   voiceState === 'SPEAKING' ? [1, 1.25, 1.15] : 1,
            opacity: voiceState === 'IDLE' ? 0.3 : 0.65,
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className={cn(
            "absolute w-80 h-80 rounded-full blur-[70px] pointer-events-none transition-colors duration-700",
            voiceState === 'LISTENING' ? "bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400" :
            voiceState === 'THINKING' ? "bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600" :
            voiceState === 'SPEAKING' ? "bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400" :
            "bg-gradient-to-tr from-indigo-700 via-purple-800 to-blue-900"
          )} 
        />

        {/* Audio Reactive Concentric Rings */}
        <div className="relative z-10 flex flex-col items-center">
          
          <div className="relative flex items-center justify-center">
            {/* Outer pulsating ring */}
            <motion.div 
              animate={{
                scale: 1 + audioLevel * 0.45,
                opacity: 0.2 + audioLevel * 0.5,
              }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                "absolute w-32 h-32 rounded-full border border-dashed pointer-events-none",
                voiceState === 'LISTENING' ? "border-emerald-400" :
                voiceState === 'THINKING' ? "border-purple-400 animate-spin" :
                voiceState === 'SPEAKING' ? "border-cyan-400" : "border-white/10"
              )}
            />

            {/* Apple Intelligence Style Fluid Glowing Orb */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleMic}
              className={cn(
                "w-22 h-22 rounded-full cursor-pointer flex items-center justify-center shadow-2xl relative group focus:outline-none transition-shadow",
                voiceState === 'LISTENING'
                  ? "bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 shadow-[0_0_40px_rgba(52,211,153,0.6)] ring-4 ring-emerald-400/40" :
                voiceState === 'THINKING'
                  ? "bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 shadow-[0_0_40px_rgba(168,85,247,0.6)] ring-4 ring-purple-400/40" :
                voiceState === 'SPEAKING'
                  ? "bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_40px_rgba(6,182,212,0.6)] ring-4 ring-cyan-400/40" :
                  "bg-gradient-to-tr from-indigo-600 via-purple-700 to-blue-600 shadow-[0_0_25px_rgba(99,102,241,0.4)] ring-2 ring-white/20 hover:ring-white/40"
              )}
            >
              {isMicActive ? (
                <Mic size={32} className="text-white drop-shadow animate-pulse" />
              ) : voiceState === 'SPEAKING' ? (
                <Volume2 size={32} className="text-white drop-shadow animate-bounce" />
              ) : voiceState === 'THINKING' ? (
                <Sparkles size={32} className="text-white drop-shadow animate-spin" />
              ) : (
                <Sparkles size={32} className="text-white drop-shadow group-hover:rotate-12 transition-transform" />
              )}
            </motion.button>
          </div>

          {/* Dynamic Status Text & Soundwave Spectrum */}
          <div className="mt-3.5 text-center flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/90">
                {voiceState === 'IDLE' && 'Tap Orb to Speak'}
                {voiceState === 'LISTENING' && 'Listening to your voice...'}
                {voiceState === 'THINKING' && 'Reasoning & Fetching Tools...'}
                {voiceState === 'SPEAKING' && 'Streaming Response & Audio...'}
                {voiceState === 'INTERRUPTED' && 'Interrupted — Listening...'}
              </span>
            </div>

            {/* Live Audio Equalizer Bars */}
            <div className="flex items-center gap-1 h-3">
              {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.3].map((multiplier, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: voiceState === 'IDLE' ? '3px' : `${Math.max(3, audioLevel * 12 * multiplier)}px`,
                  }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "w-1 rounded-full",
                    voiceState === 'LISTENING' ? "bg-emerald-400" :
                    voiceState === 'THINKING' ? "bg-purple-400" :
                    voiceState === 'SPEAKING' ? "bg-cyan-400" : "bg-white/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Transcript Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 selectable">
        <AnimatePresence initial={false}>
          {transcript.map((turn) => (
            <motion.div
              key={turn.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex flex-col max-w-[88%] text-xs leading-relaxed group",
                turn.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-white/40">
                <span className="font-medium">{turn.sender === 'user' ? 'You' : 'Aman AI'}</span>
                {turn.timestamp && <span>• {turn.timestamp}</span>}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "p-3.5 rounded-2xl shadow-lg relative backdrop-blur-md border transition-all",
                  turn.sender === 'user'
                    ? "bg-blue-600/90 text-white rounded-br-xs border-blue-500/50 shadow-blue-900/20"
                    : "bg-white/[0.07] text-white/90 rounded-bl-xs border-white/10 shadow-black/40"
                )}
              >
                <div className="whitespace-pre-wrap">{turn.text}</div>

                {/* Copy Button on Hover */}
                <button
                  onClick={() => copyToClipboard(turn.id, turn.text)}
                  className="absolute right-2 top-2 p-1 rounded-md bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/60 transition-all"
                  title="Copy message"
                >
                  {copiedId === turn.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>

              {/* Executed Agentic Tool Badge & Quick Action Button */}
              {turn.toolCall && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] border border-purple-500/30">
                    <Sparkles size={10} className="text-purple-400" />
                    <span>Tool: {turn.toolCall}</span>
                  </div>

                  {turn.actionPayload && (
                    <button
                      onClick={() => handleActionClick(turn.actionPayload)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] border border-blue-500/30 transition-colors"
                    >
                      <span>Execute UI Action</span>
                      <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Categorized Quick Prompts Picker */}
      <div className="bg-[#121219] border-t border-white/10 shrink-0">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-3 pt-2 pb-1 border-b border-white/5 overflow-x-auto no-scrollbar">
          {CATEGORIZED_PROMPTS.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors shrink-0",
                activeCategory === idx 
                  ? "bg-white/15 text-white" 
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Prompt Chips */}
        <div className="p-2 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIZED_PROMPTS[activeCategory].prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleProcessQuery(p)}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-white/70 hover:text-white border border-white/10 shrink-0 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Query Input Box */}
      <div className="p-3 bg-[#161620] border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessQuery(textInput);
          }}
          className="flex items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={toggleMic}
            className={cn(
              "p-2.5 rounded-xl border transition-all flex items-center justify-center",
              isMicActive 
                ? "bg-red-500/90 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" 
                : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10"
            )}
            title={isMicActive ? "Stop Listening" : "Start Voice Input"}
          >
            {isMicActive ? <MicOff size={16} /> : <Mic size={16} />}
          </motion.button>

          <div className="flex-1 flex items-center bg-black/40 rounded-xl px-3.5 py-2.5 border border-white/10 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <input
              type="text"
              placeholder="Ask anything about Aman's projects, skills, or control macOS..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-white/30"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="text-white/40 hover:text-blue-400 disabled:opacity-20 transition-colors ml-2 p-1"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

