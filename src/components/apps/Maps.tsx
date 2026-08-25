'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { PERSONAL } from '@config/personal.config';
import { 
  MapPin, Navigation, Search, Layers, Compass, ZoomIn, ZoomOut,
  Crosshair, Share2, Globe, Building2, Wifi
} from 'lucide-react';

const LOCATIONS = [
  { id: '1', name: 'Bengaluru / New Delhi, India', type: 'Primary Base', coordinates: '28.6139° N, 77.2090° E', desc: 'AI/ML Engineering & Research center' },
  { id: '2', name: 'San Francisco, CA', type: 'Remote Hub', coordinates: '37.7749° N, 122.4194° W', desc: 'Collaborations & Open Source deployments' },
  { id: '3', name: 'London, UK', type: 'Remote Hub', coordinates: '51.5074° N, 0.1278° W', desc: 'Voice AI Research & Conferences' },
];

export default function Maps() {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);
  const [mapMode, setMapMode] = useState<'map' | 'satellite' | 'transit'>('map');
  const [zoomLevel, setZoomLevel] = useState(12);

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-white/90 overflow-hidden font-sans select-none relative">
      {/* Top Search & Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#1c1c22]/90 backdrop-blur-xl rounded-xl p-1.5 border border-white/15 shadow-2xl pointer-events-auto w-80">
          <Search size={14} className="text-white/40 ml-2" />
          <input
            type="text"
            value={activeLocation.name}
            readOnly
            className="bg-transparent border-none outline-none text-xs text-white/90 w-full"
          />
        </div>

        {/* View toggles */}
        <div className="flex items-center bg-[#1c1c22]/90 backdrop-blur-xl rounded-xl p-1 border border-white/15 shadow-2xl pointer-events-auto text-xs">
          <button
            onClick={() => setMapMode('map')}
            className={cn("px-3 py-1 rounded-lg transition-colors", mapMode === 'map' ? "bg-blue-600 text-white font-semibold" : "text-white/60 hover:text-white")}
          >
            Explore
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={cn("px-3 py-1 rounded-lg transition-colors", mapMode === 'satellite' ? "bg-blue-600 text-white font-semibold" : "text-white/60 hover:text-white")}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Layer */}
      <div className="flex-1 relative overflow-hidden bg-[#0c121e] flex items-center justify-center">
        {/* Dark Grid Canvas / Map Background */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-700",
            mapMode === 'satellite' 
              ? "bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:16px_16px] bg-[#050b14]" 
              : "bg-[radial-gradient(#253248_1px,transparent_1px)] [background-size:24px_24px] bg-[#0d1522]"
          )}
        >
          {/* Animated radar rings around current location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 rounded-full border border-blue-500/20 animate-ping [animation-duration:4s]" />
            <div className="w-64 h-64 rounded-full border border-blue-400/30 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Main Location Pin Badge */}
        <div className="relative z-10 flex flex-col items-center animate-bounce [animation-duration:2s]">
          <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 border border-blue-400/40 text-xs font-bold">
            <Navigation size={14} className="fill-white" />
            <span>{activeLocation.name}</span>
          </div>
          <div className="w-4 h-4 bg-blue-600 rotate-45 -mt-2 shadow-lg" />
          <div className="w-3 h-3 bg-white rounded-full shadow-2xl mt-1 border-2 border-blue-600" />
        </div>

        {/* Floating Map Zoom Controls */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col bg-[#1c1c22]/90 backdrop-blur-xl rounded-xl border border-white/15 shadow-2xl overflow-hidden text-white/80">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="p-2 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <div className="h-[1px] bg-white/10" />
          <button 
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 2))}
            className="p-2 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <div className="h-[1px] bg-white/10" />
          <button 
            onClick={() => setActiveLocation(LOCATIONS[0])}
            className="p-2 hover:bg-white/10 hover:text-white transition-colors" 
            title="Recenter"
          >
            <Crosshair size={16} />
          </button>
        </div>

        {/* Bottom Location Information Drawer */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#1c1c22]/95 backdrop-blur-xl rounded-2xl border border-white/15 p-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{activeLocation.name}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  {activeLocation.type}
                </span>
              </div>
              <p className="text-xs text-white/50">{activeLocation.desc} • Coordinates: {activeLocation.coordinates}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  activeLocation.id === loc.id
                    ? "bg-white text-black shadow-md"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {loc.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
