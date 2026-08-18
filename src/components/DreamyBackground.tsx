import React from 'react';

export const DreamyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Base Natural Tones Gradient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e0f4ff] via-[#fcf3ff] to-[#fffef0]" />

      {/* Atmospheric Soft Light Orbs */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-blue-100/60 opacity-40 blur-[120px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/70 opacity-30 blur-[100px] rounded-full" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-100/30 blur-[140px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#fff9c4]/30 blur-[110px] rounded-full" />

      {/* Delicate Star & Glow Points from Natural Tones Spec */}
      <div className="absolute top-10 left-20 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.9)] animate-pulse" />
      <div className="absolute top-40 right-40 w-2 h-2 bg-white rounded-full opacity-60 shadow-[0_0_8px_1px_rgba(255,255,255,0.7)]" />
      <div className="absolute bottom-60 left-1/4 w-1 h-1 bg-white rounded-full opacity-50" />
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-20 right-1/2 w-2.5 h-2.5 bg-yellow-100 rounded-full blur-[1px] opacity-40 animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute bottom-24 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
    </div>
  );
};
