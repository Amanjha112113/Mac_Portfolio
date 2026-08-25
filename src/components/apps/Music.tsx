'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Heart, Shuffle, Repeat, ListMusic, Radio, Flame, Sparkles, 
  Disc, Clock, Music2, Headphones, BarChart2
} from 'lucide-react';
import { Icon } from '@iconify/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSec: number;
  coverGradient: string;
}

const PLAYLISTS = [
  { id: 'focus', title: 'Deep Focus AI', subtitle: 'Binaural & ambient synths for ML modeling', icon: Flame, count: '18 songs' },
  { id: 'coding', title: 'Late Night Coding', subtitle: 'Cyberpunk & synthwave beats for coding', icon: Sparkles, count: '24 songs' },
  { id: 'lofi', title: 'Neural Lo-Fi', subtitle: 'Chill instrumental beats to study to', icon: Headphones, count: '30 songs' },
  { id: 'ambient', title: 'Silicon Ambient', subtitle: 'Minimalist electronic soundscapes', icon: Radio, count: '15 songs' },
];

const TRACKS: Track[] = [
  { id: '1', title: 'Neural Oscillations', artist: 'Aman Jha & Synthetica', album: 'Latent Space', duration: '3:45', durationSec: 225, coverGradient: 'from-purple-600 via-indigo-600 to-blue-700' },
  { id: '2', title: 'Gradient Descent Flow', artist: 'Vector Fields', album: 'Optimization Epoch', duration: '4:12', durationSec: 252, coverGradient: 'from-pink-600 via-rose-600 to-amber-600' },
  { id: '3', title: 'Attention Is All You Need', artist: 'Transformer Quartet', album: 'Self-Attention', duration: '3:18', durationSec: 198, coverGradient: 'from-emerald-600 via-teal-600 to-cyan-700' },
  { id: '4', title: 'Cybernetic Midnight', artist: 'Silicon Dreams', album: 'Neon Highway', duration: '5:02', durationSec: 302, coverGradient: 'from-blue-600 via-violet-600 to-fuchsia-600' },
  { id: '5', title: 'Whisper in the Latent Space', artist: 'Diffusion Echoes', album: 'Stable States', duration: '2:56', durationSec: 176, coverGradient: 'from-amber-600 via-orange-600 to-red-600' },
  { id: '6', title: 'Loss Function Horizon', artist: 'Stochastic', album: 'Convergence', duration: '4:30', durationSec: 270, coverGradient: 'from-cyan-600 via-blue-600 to-indigo-800' },
];

export default function Music() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('focus');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(42);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set(['1', '3']));

  const currentTrack = TRACKS[currentTrackIndex];
  const selectedPlaylist = PLAYLISTS.find(p => p.id === selectedPlaylistId) || PLAYLISTS[0];

  // Simulated audio progress timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= currentTrack.durationSec) {
            // Auto advance next track
            setCurrentTrackIndex((idx) => (idx + 1) % TRACKS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.durationSec]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgressSec(0);
    setIsPlaying(true);
  };

  const toggleLike = (id: string) => {
    setLikedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white/90 overflow-hidden font-sans select-none">
      {/* Main Content Area: Sidebar + Browse Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Spotify / Apple Music Style Sidebar */}
        <div className="w-56 bg-[#0c0c0e] border-r border-white/5 flex flex-col p-4 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <Music2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Apple Music</span>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-2 mb-2">Library</p>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-white/10 transition-colors">
                  <ListMusic size={15} className="text-pink-400" />
                  <span>Playlists</span>
                </button>
                <button className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  <Headphones size={15} className="text-purple-400" />
                  <span>Made for You</span>
                </button>
                <button className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  <Radio size={15} className="text-blue-400" />
                  <span>Radio</span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-2 mb-2">Curated Playlists</p>
              <div className="space-y-1">
                {PLAYLISTS.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => setSelectedPlaylistId(pl.id)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                      selectedPlaylistId === pl.id 
                        ? "bg-pink-600/20 text-pink-300 font-semibold border border-pink-500/30" 
                        : "text-white/70 hover:bg-white/5"
                    )}
                  >
                    <span className="truncate">{pl.title}</span>
                    <span className="text-[10px] text-white/30 shrink-0">{pl.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Playlist & Tracks Main Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1c1427] to-[#121214] p-6 lg:p-8 selectable">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
            <div className={cn(
              "w-44 h-44 rounded-2xl shadow-2xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br border border-white/20",
              currentTrack.coverGradient
            )}>
              <Disc size={64} className={cn("text-white/80", isPlaying && "animate-spin [animation-duration:8s]")} />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-pink-400">Playlist</span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{selectedPlaylist.title}</h1>
              <p className="text-xs text-white/60 max-w-lg leading-relaxed">{selectedPlaylist.subtitle}</p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-xs shadow-lg shadow-pink-500/30 hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-white" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <span className="text-xs text-white/40">Created by Aman Jha • 6 tracks, 23 min</span>
              </div>
            </div>
          </div>

          {/* Tracks Table */}
          <div className="space-y-1">
            <div className="grid grid-cols-12 text-[11px] font-semibold text-white/40 uppercase tracking-wider px-3 py-2 border-b border-white/10">
              <span className="col-span-1">#</span>
              <span className="col-span-6">Title</span>
              <span className="col-span-3">Album</span>
              <span className="col-span-2 text-right">Time</span>
            </div>

            {TRACKS.map((track, index) => {
              const isCurrent = currentTrackIndex === index;
              const isLiked = likedTracks.has(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setProgressSec(0);
                    setIsPlaying(true);
                  }}
                  className={cn(
                    "grid grid-cols-12 items-center px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer group",
                    isCurrent 
                      ? "bg-white/10 text-white font-medium shadow-sm border border-white/10" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="col-span-1 flex items-center">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end gap-[2px] h-3.5">
                        <span className="w-1 bg-pink-400 animate-[bounce_0.6s_infinite_ease-in-out]" style={{ height: '60%' }} />
                        <span className="w-1 bg-pink-400 animate-[bounce_0.8s_infinite_ease-in-out]" style={{ height: '100%' }} />
                        <span className="w-1 bg-pink-400 animate-[bounce_0.5s_infinite_ease-in-out]" style={{ height: '40%' }} />
                      </div>
                    ) : (
                      <span className="group-hover:hidden text-white/40">{index + 1}</span>
                    )}
                    <Play size={12} className="hidden group-hover:block text-white" />
                  </div>

                  <div className="col-span-6 flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg shrink-0 bg-gradient-to-tr flex items-center justify-center text-white text-xs", track.coverGradient)}>
                      🎵
                    </div>
                    <div className="truncate">
                      <p className={cn("truncate font-medium", isCurrent ? "text-pink-400" : "text-white/90")}>{track.title}</p>
                      <p className="text-[11px] text-white/40 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <span className="col-span-3 text-white/50 truncate text-[11px]">{track.album}</span>

                  <div className="col-span-2 flex items-center justify-end gap-3 text-white/40">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                    >
                      <Heart size={14} className={isLiked ? "fill-pink-500 text-pink-500 opacity-100" : "text-white/40"} />
                    </button>
                    <span className="text-[11px]">{track.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Player Bar */}
      <div className="h-20 bg-[#161619] border-t border-white/10 px-4 flex items-center justify-between shrink-0 shadow-2xl z-10">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/4">
          <div className={cn("w-12 h-12 rounded-xl shrink-0 bg-gradient-to-br flex items-center justify-center text-white shadow-md border border-white/10", currentTrack.coverGradient)}>
            <Music2 size={20} />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white/95 truncate">{currentTrack.title}</p>
            <p className="text-[11px] text-white/50 truncate">{currentTrack.artist}</p>
          </div>
          <button onClick={() => toggleLike(currentTrack.id)} className="ml-1 text-white/40 hover:text-pink-400">
            <Heart size={15} className={likedTracks.has(currentTrack.id) ? "fill-pink-500 text-pink-500" : ""} />
          </button>
        </div>

        {/* Player Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-md">
          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white transition-colors"><Shuffle size={14} /></button>
            <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors"><SkipBack size={17} /></button>
            <button 
              onClick={togglePlay} 
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-black ml-0.5" />}
            </button>
            <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors"><SkipForward size={17} /></button>
            <button className="text-white/40 hover:text-white transition-colors"><Repeat size={14} /></button>
          </div>

          <div className="w-full flex items-center gap-2 text-[10px] text-white/40 font-mono">
            <span>{formatTime(progressSec)}</span>
            <div 
              className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                setProgressSec(Math.floor(ratio * currentTrack.durationSec));
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full group-hover:brightness-125 transition-all"
                style={{ width: `${(progressSec / currentTrack.durationSec) * 100}%` }}
              />
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Volume & Equalizer badge */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-pink-400 font-mono">
            <BarChart2 size={12} />
            <span>Lossless FLAC</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
