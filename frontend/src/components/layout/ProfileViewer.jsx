import React, { useState, useEffect } from 'react';
import { Briefcase, IndianRupee, MapPin, Cake, GraduationCap, Phone, Mail, FileText, Loader2 } from 'lucide-react';
import { ProfileSkeleton } from '../ui/Skeletons';

export const ProfileViewer = ({ loadingDetails, selectedCustomer, onSaveNote }) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      setNotes(selectedCustomer.notes || '');
    }
  }, [selectedCustomer]);

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSaveNote(selectedCustomer._id, notes);
    setIsSaving(false);
  };

  if (loadingDetails || !selectedCustomer) {
    return (
      <section className="flex-1 border-r border-slate-800 overflow-y-auto bg-slate-950">
        <div className="max-w-4xl mx-auto p-8">
          <ProfileSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 border-r border-slate-800 overflow-y-auto bg-slate-950">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Header with Contact Info */}
        <div className="border-b border-slate-800/80 pb-5">
          <h2 className="text-3xl font-bold tracking-tight text-white">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
          <div className="flex items-center gap-5 mt-3 text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-md border border-slate-800"><Mail className="w-3.5 h-3.5 text-rose-400" /> {selectedCustomer.email || 'client@example.com'}</span>
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-md border border-slate-800"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {selectedCustomer.phone || '+91 9876543210'}</span>
          </div>
        </div>

        {/* Basic Demographics */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl flex items-start gap-4 hover:border-slate-600 transition-colors shadow-sm">
            <Cake className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">DOB & Height</span>
              <span className="text-base text-slate-100 font-semibold mt-0.5 block">{new Date(selectedCustomer.dob).toLocaleDateString()} <span className="text-slate-500 font-normal mx-1">•</span> {selectedCustomer.heightCm || '170'}cm</span>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl flex items-start gap-4 hover:border-slate-600 transition-colors shadow-sm">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Location</span>
              <span className="text-base text-slate-100 font-semibold mt-0.5 block">{selectedCustomer.city}, {selectedCustomer.country}</span>
            </div>
          </div>
        </div>

        {/* Professional Status */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">Professional & Financial Status</h3>
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl divide-y divide-slate-800/80 shadow-sm">
            <div className="p-4 flex justify-between items-center text-sm hover:bg-slate-800/30 transition-colors rounded-t-2xl">
              <div className="flex items-center gap-3"><GraduationCap className="w-4 h-4 text-slate-400" /> <span className="text-slate-300 font-medium">Education</span></div>
              <span className="font-semibold text-slate-100">{selectedCustomer.degree} — {selectedCustomer.undergradCollege}</span>
            </div>
            <div className="p-4 flex justify-between items-center text-sm hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-slate-400" /> <span className="text-slate-300 font-medium">Designation</span></div>
              <span className="font-semibold text-slate-100">{selectedCustomer.designation} at {selectedCustomer.currentCompany}</span>
            </div>
            <div className="p-4 flex justify-between items-center text-sm hover:bg-slate-800/30 transition-colors rounded-b-2xl">
              <div className="flex items-center gap-3"><IndianRupee className="w-4 h-4 text-slate-400" /> <span className="text-slate-300 font-medium">Declared Income</span></div>
              <span className="font-bold text-emerald-400 text-base">{selectedCustomer.incomeLPA} LPA</span>
            </div>
          </div>
        </div>
        
        {/* Expanded Cultural Alignment */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1">Cultural & Family Alignment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center shadow-sm">
              <span className="text-slate-400 font-medium">Marital Status</span><span className="font-semibold text-slate-100">{selectedCustomer.maritalStatus || 'Never Married'}</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center shadow-sm">
              <span className="text-slate-400 font-medium">Religion/Caste</span><span className="font-semibold text-slate-100">{selectedCustomer.religion} ({selectedCustomer.caste})</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center shadow-sm">
              <span className="text-slate-400 font-medium">Languages</span><span className="font-semibold text-slate-100">{selectedCustomer.languagesKnown || 'English, Hindi'}</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center shadow-sm">
              <span className="text-slate-400 font-medium">Siblings</span><span className="font-semibold text-slate-100">{selectedCustomer.siblings || '1 Brother, 0 Sisters'}</span>
            </div>
          </div>
        </div>

        {/* Lifestyle Goals */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 ml-1 mt-8">Lifestyle & Future Goals</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-slate-400 text-[11px] uppercase font-bold mb-1.5 tracking-wider">Want Kids?</span>
              <span className="font-bold text-slate-100 text-base">{selectedCustomer.wantKids}</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-slate-400 text-[11px] uppercase font-bold mb-1.5 tracking-wider">Relocate?</span>
              <span className="font-bold text-slate-100 text-base">{selectedCustomer.openToRelocate}</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-slate-400 text-[11px] uppercase font-bold mb-1.5 tracking-wider">Pets?</span>
              <span className="font-bold text-slate-100 text-base">{selectedCustomer.openToPets}</span>
            </div>
          </div>
        </div>

        {/* MATCHMAKER NOTES SECTION */}
        <div className="mt-10 border-t border-slate-800/80 pt-8">
          <div className="flex items-center gap-2.5 mb-4 ml-1">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Matchmaker Internal Notes</h3>
          </div>
          <textarea 
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner leading-relaxed"
            rows="4"
            placeholder="Record notes from client calls, feedback, or meeting summaries here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-3">
            <button 
              onClick={handleSaveClick}
              disabled={isSaving}
              className="text-sm font-medium bg-slate-800 hover:bg-emerald-500/10 text-slate-200 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSaving ? 'Saving...' : 'Save to Database'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};