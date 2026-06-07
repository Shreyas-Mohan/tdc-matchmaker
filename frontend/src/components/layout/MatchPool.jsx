import React from 'react';
import { Sparkles } from 'lucide-react';
import { MatchPoolSkeleton } from '../ui/Skeletons';

export const MatchPool = ({ loadingDetails, matches, setSelectedMatch }) => {
  return (
    <section className="w-112.5 shrink-0 border-l border-slate-800 overflow-y-auto p-6 bg-slate-900/10 transition-colors duration-500">
      <div className="border-b border-slate-800 pb-4 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold tracking-tight text-slate-100">Algorithmic Pool Matches</h3>
      </div>

      <div className="space-y-4">
        {loadingDetails ? (
          <MatchPoolSkeleton />
        ) : matches.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8 animate-fade-in">No matching candidate footprints met the pipeline's deterministic threshold.</p>
        ) : (
          matches.map((match, index) => (
            <button 
              key={match._id} 
              onClick={() => setSelectedMatch(match)}
              // Apply staggered slide-up animation using inline delay based on index
              style={{ animationDelay: `${index * 75}ms` }}
              className="animate-slide-up w-full text-left bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <h4 className="font-semibold text-slate-200 group-hover:text-rose-400 transition-colors duration-300">{match.firstName} {match.lastName}</h4>
                <p className="text-xs text-slate-500 mt-0.5 transition-colors duration-300">{match.city} • {match.designation}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block text-xs font-bold px-2 py-1 rounded-lg transition-colors duration-500 ${
                  match.matchScore >= 85 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {match.matchScore}% Match
                </span>
                <span className="block text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{match.reasoningTag}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
};