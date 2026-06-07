import React from 'react';

export const RosterSkeleton = () => (
  <div className="space-y-3 p-2">
    {[1, 2, 3, 4, 5].map(n => (
      <div key={n} className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl space-y-2 animate-pulse">
        <div className="flex justify-between">
          <div className="h-4 w-28 bg-slate-800 rounded"></div>
          <div className="h-4 w-12 bg-slate-800 rounded-full"></div>
        </div>
        <div className="h-3 w-36 bg-slate-800/60 rounded"></div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="border-b border-slate-800 pb-4 space-y-2">
      <div className="h-7 w-48 bg-slate-800 rounded"></div>
      <div className="h-4 w-32 bg-slate-800/60 rounded"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-16 bg-slate-900/60 border border-slate-800/40 rounded-xl"></div>
      <div className="h-16 bg-slate-900/60 border border-slate-800/40 rounded-xl"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 w-36 bg-slate-800 rounded"></div>
      <div className="h-32 bg-slate-900/40 border border-slate-800 rounded-xl"></div>
    </div>
  </div>
);

export const MatchPoolSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2].map(n => (
      <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-800 rounded"></div>
            <div className="h-3 w-40 bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-12 bg-slate-950/60 rounded-lg border border-slate-800/40"></div>
      </div>
    ))}
  </div>
);