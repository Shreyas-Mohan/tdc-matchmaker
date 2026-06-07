import React from 'react';
import { Mail } from 'lucide-react';

export const MatchReviewModal = ({ match, onClose, onGenerate }) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col animate-scale-in">
        <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-2xl text-slate-100">{match.firstName} {match.lastName}</h3>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-2 py-0.5 rounded-md">
                {match.matchScore}% Match
              </span>
            </div>
            <p className="text-sm text-slate-400">{match.designation} in {match.city}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg p-1 cursor-pointer">✕</button>
        </div>
        
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Groq AI Compatibility Analysis</h4>
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-xl">
              <p className="text-sm text-indigo-200 leading-relaxed italic">"{match.explanation}"</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Income & Edu</span>
              <span className="text-sm text-slate-300 font-medium">{match.incomeLPA} LPA • {match.undergradCollege}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Diet & Family</span>
              <span className="text-sm text-slate-300 font-medium">{match.dietaryPreference} • {match.familyType}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-slate-800 mt-6">
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm px-4 py-2.5 rounded-xl transition cursor-pointer">
            Close Review
          </button>
          <button onClick={() => onGenerate(match._id)} className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2">
            <Mail className="w-4 h-4" /> Generate Match Proposal
          </button>
        </div>
      </div>
    </div>
  );
};