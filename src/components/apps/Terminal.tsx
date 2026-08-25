'use client';

import { useState, useRef, useEffect } from 'react';
import { PERSONAL } from '@config/personal.config';
import { PROJECTS } from '@config/projects.config';

interface HistoryItem {
  command: string;
  output: string | React.ReactNode;
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-2">
          <p className="text-emerald-400 font-bold">Welcome to Aman Jha&apos;s macOS Shell (zsh)</p>
          <p className="text-white/60">Type <span className="text-yellow-400 font-semibold">help</span> to view all available commands.</p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      const args = trimmedInput.split(' ');
      const cmd = args[0].toLowerCase();
      let output: string | React.ReactNode = '';

      switch (cmd) {
        case 'help':
          output = (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-white/80">
              <div><span className="text-cyan-400 font-medium">about</span> - Brief bio of Aman</div>
              <div><span className="text-cyan-400 font-medium">skills</span> - View technical skills</div>
              <div><span className="text-cyan-400 font-medium">projects</span> - List portfolio projects</div>
              <div><span className="text-cyan-400 font-medium">contact</span> - Contact information</div>
              <div><span className="text-cyan-400 font-medium">neofetch</span> - System profile overview</div>
              <div><span className="text-cyan-400 font-medium">clear</span> - Clear the terminal screen</div>
            </div>
          );
          break;
        case 'about':
          output = PERSONAL.bio;
          break;
        case 'skills':
          output = (
            <div className="space-y-2 text-white/80">
              <p><span className="text-yellow-400 font-semibold">AI/ML:</span> {PERSONAL.skills.ai.join(', ')}</p>
              <p><span className="text-yellow-400 font-semibold">Languages:</span> {PERSONAL.skills.languages.join(', ')}</p>
              <p><span className="text-yellow-400 font-semibold">Frameworks:</span> {PERSONAL.skills.frameworks.join(', ')}</p>
              <p><span className="text-yellow-400 font-semibold">Tools:</span> {PERSONAL.skills.tools.join(', ')}</p>
            </div>
          );
          break;
        case 'projects':
          output = (
            <div className="space-y-3">
              <p className="text-yellow-400 font-semibold">Featured Projects:</p>
              {PROJECTS.map((p) => (
                <div key={p.id} className="pl-4 border-l-2 border-cyan-500/50">
                  <p className="font-bold text-white/90">{p.title} ({p.year})</p>
                  <p className="text-white/60 text-xs">{p.shortDescription}</p>
                  <p className="text-cyan-400/80 text-[11px] mt-0.5">{p.technologies.join(' · ')}</p>
                </div>
              ))}
            </div>
          );
          break;
        case 'contact':
          output = (
            <div className="space-y-1 text-white/80">
              <p>Email: <a href={`mailto:${PERSONAL.email}`} className="text-cyan-400 hover:underline">{PERSONAL.email}</a></p>
              <p>GitHub: <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{PERSONAL.githubUsername}</a></p>
              <p>LinkedIn: <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Aman Jha</a></p>
            </div>
          );
          break;
        case 'neofetch':
          output = (
            <div className="flex flex-col md:flex-row gap-6 font-mono text-xs">
              <div className="text-cyan-400 font-bold leading-none select-none hidden md:block">
                {`   /\\_/\\
  ( o.o )
   > ^ <
  /     \\
 (       )
  \\_/^\\_/`}
              </div>
              <div className="space-y-1">
                <p className="text-cyan-400 font-bold">{PERSONAL.name}@macbook</p>
                <p className="text-white/40">-------------------</p>
                <p><span className="text-yellow-400 font-medium">OS:</span> macOS Sonoma Portfolio Edition</p>
                <p><span className="text-yellow-400 font-medium">Host:</span> Apple Silicon M3 Max Simulator</p>
                <p><span className="text-yellow-400 font-medium">Kernel:</span> zsh / React App Router</p>
                <p><span className="text-yellow-400 font-medium">Shell:</span> Aman-Zsh v1.0.0</p>
                <p><span className="text-yellow-400 font-medium">Uptime:</span> Dynamic / Serverless</p>
                <p><span className="text-yellow-400 font-medium">CPU:</span> Neural Engine (Realtime Voice)</p>
                <p><span className="text-yellow-400 font-medium">Memory:</span> Next.js Optimized</p>
              </div>
            </div>
          );
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        default:
          output = `zsh: command not found: ${cmd}. Type 'help' for options.`;
      }

      setHistory((prev) => [...prev, { command: trimmedInput, output }]);
      setCommandHistory((prev) => [...prev, trimmedInput]);
      setInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full bg-[#17171a] text-white/90 p-4 font-mono text-[13px] overflow-y-auto leading-relaxed select-text cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-4">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            {item.command !== 'welcome' && (
              <div className="flex items-center gap-2 text-white/40">
                <span className="text-emerald-400">aman@macbook</span>
                <span>%</span>
                <span className="text-white">{item.command}</span>
              </div>
            )}
            <div className="whitespace-pre-wrap">{item.output}</div>
          </div>
        ))}

        {/* Input prompt */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">aman@macbook</span>
          <span className="text-white/40">%</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 font-mono text-[13px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
