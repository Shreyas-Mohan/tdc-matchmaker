import React from 'react';
import { Search, Filter } from 'lucide-react';
import { RosterSkeleton } from '../ui/Skeletons';

export const Sidebar = ({ 
  searchQuery, setSearchQuery, 
  genderFilter, setGenderFilter, 
  sortBy, setSortBy, 
  loadingList, processedCustomers, 
  selectedCustomerId, setSelectedCustomerId,
  algoMode, setAlgoMode
}) => {
  return (
    <section className="w-80 border-r border-slate-800 bg-slate-900/20 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search name or city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
          />
        </div>

        <div className="flex flex-col gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium pb-1 border-b border-slate-800/60">
            <Filter className="w-3 h-3" /> Matrix Workspace Filters
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div>
              <label className="text-slate-500 block mb-0.5 font-medium">Gender</label>
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 focus:outline-none">
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-slate-500 block mb-0.5 font-medium">Sort Roster</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 focus:outline-none">
                <option value="name">Alphanumeric</option>
                <option value="income">Income (High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 relative z-0 overflow-hidden">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md transition-all duration-300 ease-out -z-10 ${
              algoMode === 'advanced' ? 'bg-rose-500/20 translate-x-[calc(100%+8px)]' : 'bg-slate-800 translate-x-0'
            }`} 
          />
          <button 
            onClick={() => setAlgoMode('basic')}
            className={`flex-1 text-[10px] font-bold uppercase py-1.5 transition-colors duration-300 ${
              algoMode === 'basic' ? 'text-slate-200' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Basic AI 
          </button>
          <button 
            onClick={() => setAlgoMode('advanced')}
            className={`flex-1 text-[10px] font-bold uppercase py-1.5 transition-colors duration-300 ${
              algoMode === 'advanced' ? 'text-rose-400' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Advanced Math
          </button>
        </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loadingList ? (
          <RosterSkeleton />
        ) : processedCustomers.length === 0 ? (
          <div className="text-center p-6 text-xs text-slate-500">No active operational client match tracks.</div>
        ) : (
          processedCustomers.map(c => {
            // Calculate age dynamically from DOB
            const age = new Date().getFullYear() - new Date(c.dob).getFullYear();
            
            return (
              <button
                key={c._id}
                onClick={() => setSelectedCustomerId(c._id)}
                className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1.5 cursor-pointer ${
                  selectedCustomerId === c._id ? 'bg-slate-800/80 border border-slate-700/50 shadow-sm' : 'hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-sm truncate pr-2">{c.firstName} {c.lastName}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase shrink-0">{c.statusTag}</span>
                </div>
                {/* UPDATED TO MEET EXACT RUBRIC REQUIREMENTS */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 font-medium">
                  <span>{age} yrs</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span>{c.city}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <span>{c.maritalStatus || 'Single'}</span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </section>
  );
};