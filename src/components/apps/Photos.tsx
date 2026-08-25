'use client';

import { useState } from 'react';
import { PROJECTS } from '@config/projects.config';
import { cn } from '@/lib/cn';
import { ChevronLeft, ChevronRight, Grid, ZoomIn, Info, Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';

const ALBUMS = [
  { id: 'library', label: 'Library', count: PROJECTS.length },
  { id: 'favorites', label: 'Favorites', count: PROJECTS.filter(p => p.featured).length },
  { id: 'recent', label: 'Recents', count: PROJECTS.length },
];

export default function Photos() {
  const [selectedAlbum, setSelectedAlbum] = useState('library');
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  const displayedPhotos = PROJECTS.filter(p => p.imageUrl);
  const activePhoto = PROJECTS.find(p => p.id === activePhotoId);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden rounded-b-xl select-none font-sans">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2e] border-b border-white/10 shrink-0 h-[52px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button 
              className="p-1 rounded hover:bg-white/10 text-white/40 disabled:opacity-30"
              onClick={() => setActivePhotoId(null)}
              disabled={!activePhotoId}
            >
              <ChevronLeft size={18} />
            </button>
            <button className="p-1 rounded hover:bg-white/10 text-white/40 disabled:opacity-30" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="text-[13px] font-semibold text-white/90">
            {activePhotoId ? activePhoto?.title : 'Photos'}
          </span>
        </div>

        {activePhotoId && (
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded hover:bg-white/10 text-white/70">
              <Heart size={16} className="text-rose-500 fill-rose-500/20" />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 text-white/70">
              <Info size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 text-white/70">
              <ZoomIn size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Only show if not in full screen photo view) */}
        {!activePhotoId && (
          <div className="w-48 bg-[#232326] border-r border-white/10 flex flex-col py-3 overflow-y-auto shrink-0">
            <div className="px-4 py-1.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Photos</div>
            {ALBUMS.map(album => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album.id)}
                className={cn(
                  "flex items-center justify-between px-4 py-2 mx-2 rounded-md text-[13px] transition-colors",
                  selectedAlbum === album.id ? "bg-blue-500 text-white" : "text-white/70 hover:bg-white/5"
                )}
              >
                <span>{album.label}</span>
                <span className="text-xs opacity-50">{album.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#151518] p-6">
          {activePhotoId && activePhoto ? (
            /* Lightbox view */
            <div className="flex flex-col items-center justify-center h-full relative">
              <div className="relative w-full h-[85%] rounded-lg overflow-hidden border border-white/10">
                <Image 
                  src={activePhoto.imageUrl!} 
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="text-center mt-4">
                <h2 className="text-lg font-bold text-white">{activePhoto.title}</h2>
                <p className="text-sm text-white/50">{activePhoto.shortDescription}</p>
              </div>
            </div>
          ) : (
            /* Album grid view */
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedPhotos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoId(photo.id)}
                  className="group relative aspect-video bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md"
                >
                  <Image
                    src={photo.imageUrl!}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="font-semibold text-sm truncate">{photo.title}</p>
                    <p className="text-xs text-white/60 line-clamp-1">{photo.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
