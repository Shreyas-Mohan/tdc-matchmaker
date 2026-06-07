import React from 'react';

export const EmailDraftModal = ({ payload, onClose, onSend }) => {
  if (!payload) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-scale-in">
        <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-100">Automated Intro Email Compiled</h3>
            <p className="text-xs text-slate-500 mt-0.5">Drafted natively via AI Context Integration</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm font-semibold cursor-pointer px-2">✕</button>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 text-sm">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-xs">
            <p><span className="text-slate-500">To:</span> {payload.recipientEmail}</p>
            <p><span className="text-slate-500">Subject:</span> {payload.subject}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
            {payload.emailContent}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-4">
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-4 py-2.5 rounded-xl transition cursor-pointer">
            Dismiss Draft
          </button>
          <button onClick={onSend} className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition cursor-pointer">
            Transmit Match Email
          </button>
        </div>
      </div>
    </div>
  );
};