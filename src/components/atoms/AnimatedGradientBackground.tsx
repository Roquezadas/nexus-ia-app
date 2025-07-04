// src/components/atoms/AnimatedGradientBackground.tsx
import React from 'react';

export const AnimatedGradientBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
      <div className="relative h-full w-full bg-white dark:bg-slate-950">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>
    </div>
  );
};