import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, GestureState, GestureType } from './types';
import MediaPipeController from './components/MediaPipeController';
import { Scene } from './components/Scene';

// --- INLINE ICONS ---
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const IconMouse = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
);

// Default placeholder photos
const DEFAULT_PHOTOS = [
  'https://picsum.photos/id/1011/400/400',
  'https://picsum.photos/id/1015/400/400',
  'https://picsum.photos/id/1016/400/400',
  'https://picsum.photos/id/1018/400/400',
  'https://picsum.photos/id/1025/400/400',
];

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TREE);
  const [gesture, setGesture] = useState<GestureState>({ type: GestureType.IDLE, position: { x: 0.5, y: 0.5 } });
  const [photos, setPhotos] = useState<string[]>(DEFAULT_PHOTOS);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Remove Loader on Mount
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      // Fade out
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, []);

  // Gesture State Machine
  const handleGestureUpdate = useCallback((newGesture: GestureState) => {
    setGesture(newGesture);

    // State Transitions
    if (newGesture.type === GestureType.FIST) {
      setMode(AppMode.TREE);
    } else if (newGesture.type === GestureType.OPEN_HAND) {
      // Only transition to exploded if we aren't already there or focus
      setMode(prev => (prev === AppMode.TREE ? AppMode.EXPLODED : prev));
    } else if (newGesture.type === GestureType.PINCH && mode === AppMode.EXPLODED) {
      // Pinch logic is handled inside Scene for selecting specific photos
    }
  }, [mode]);

  const handleStart = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionGranted(true);
      setShowIntro(false);
    } catch (e) {
      alert("Camera permission is required for gesture control.");
    }
  };

  const handleSkipCamera = () => {
    setPermissionGranted(false);
    setShowIntro(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file as File));
      setPhotos(prev => [...newPhotos, ...prev].slice(0, 15)); // Keep max 15
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-christmas-silver">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene mode={mode} gesture={gesture} photos={photos} />
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
        <div>
          <h1 className="text-4xl font-serif text-christmas-gold tracking-widest drop-shadow-[0_2px_10px_rgba(197,160,89,0.5)]">
            LUMIÈRE DE NOËL
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase opacity-70 mt-2">Interactive 3D Experience</p>
        </div>
        
        <div className="pointer-events-auto flex gap-4">
           <label className="cursor-pointer bg-christmas-green/80 hover:bg-christmas-green border border-christmas-gold text-christmas-gold px-4 py-2 rounded-full flex items-center gap-2 transition-all backdrop-blur-sm">
             <IconUpload />
             <span className="text-sm font-bold">ADD PHOTOS</span>
             <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
           </label>
        </div>
      </div>

      {/* Gesture Status Indicator (Only visible if camera enabled) */}
      {permissionGranted && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
           <div className="text-christmas-gold text-sm font-serif mb-2 tracking-widest uppercase">
              Current Gesture: <span className="font-bold">{gesture.type}</span>
           </div>
           <div className="text-xs opacity-50 text-center max-w-md">
              {gesture.type === GestureType.IDLE && "Show hand to interact"}
              {gesture.type === GestureType.FIST && "Forming the Tree"}
              {gesture.type === GestureType.OPEN_HAND && "Exploding particles"}
              {gesture.type === GestureType.PINCH && "Focusing content"}
           </div>
        </div>
      )}

      {/* Manual Controls (Only visible if camera DISABLED) */}
      {!permissionGranted && !showIntro && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-6">
            <button 
                onClick={() => setMode(AppMode.TREE)}
                className={`px-8 py-3 rounded-full border font-serif tracking-widest transition-all backdrop-blur-md ${mode === AppMode.TREE ? 'bg-christmas-gold text-black border-christmas-gold shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'bg-black/40 text-christmas-gold border-christmas-gold/40 hover:bg-black/60'}`}
            >
                TREE MODE
            </button>
            <button 
                onClick={() => setMode(AppMode.EXPLODED)}
                className={`px-8 py-3 rounded-full border font-serif tracking-widest transition-all backdrop-blur-md ${mode === AppMode.EXPLODED ? 'bg-christmas-gold text-black border-christmas-gold shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'bg-black/40 text-christmas-gold border-christmas-gold/40 hover:bg-black/60'}`}
            >
                EXPLODE MODE
            </button>
        </div>
      )}

      {/* Intro Modal */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="max-w-2xl w-full p-10 border border-christmas-gold/30 bg-christmas-green/20 rounded-xl text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-christmas-gold to-transparent"></div>
            
            <h2 className="text-5xl font-serif text-christmas-gold mb-8">Welcome</h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Experience a cinematic Christmas journey controlled by your hands. 
              <br/>Use gestures to manipulate the magical tree and explore your memories.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10 text-sm">
              <div className="p-4 border border-white/10 rounded bg-white/5">
                <div className="font-bold text-christmas-gold mb-2">FIST ✊</div>
                <p>Form the Christmas Tree</p>
              </div>
              <div className="p-4 border border-white/10 rounded bg-white/5">
                <div className="font-bold text-christmas-gold mb-2">OPEN HAND 🖐️</div>
                <p>Explode particles & Move</p>
              </div>
              <div className="p-4 border border-white/10 rounded bg-white/5">
                <div className="font-bold text-christmas-gold mb-2">PINCH 👌</div>
                <p>Focus on a Photo</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleStart}
                className="w-full max-w-sm bg-christmas-gold hover:bg-yellow-600 text-black font-bold py-4 px-10 rounded-full transition-all tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)]"
              >
                <IconCamera />
                ENABLE CAMERA & ENTER
              </button>
              
              <button 
                onClick={handleSkipCamera}
                className="text-christmas-silver/50 hover:text-christmas-gold text-xs uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 py-2"
              >
                <IconMouse />
                Continue without Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden MediaPipe Controller - Only renders if permission granted */}
      {permissionGranted && (
        <MediaPipeController 
          onGestureUpdate={handleGestureUpdate} 
          permissionGranted={permissionGranted} 
        />
      )}
    </div>
  );
};

export default App;