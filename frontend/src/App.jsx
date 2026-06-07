import React, { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Heart, CheckCircle2, AlertCircle, PanelLeftClose, PanelLeft, PanelRightClose, PanelRight } from 'lucide-react';

import logoImg from './assets/thedatecrew_logo.jpg';
import coverImg from './assets/thedatecrew_cover.jpg';

// Import our modular components
import { Sidebar } from './components/layout/Sidebar';
import { ProfileViewer } from './components/layout/ProfileViewer';
import { MatchPool } from './components/layout/MatchPool';
import { MatchReviewModal } from './components/modals/MatchReviewModal';
import { EmailDraftModal } from './components/modals/EmailDraftModal';

function App() {
  // Data State
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [matches, setMatches] = useState([]);
  
  // UI & Loading State
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Layout Collapse States
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMatchPool, setShowMatchPool] = useState(true);
  
  // Interaction State
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [algoMode, setAlgoMode] = useState('advanced');
  
  // Modal State
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);

  // Cache Refs (to avoid redundant API calls and enable instant navigation)
  const detailsCache = useRef({}); // { [id]: profileData }
  const matchesCache = useRef({}); // { [`${id}_${algo}`]: matchesData }

  const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customers`;

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setCustomers(data);
        if (data.length > 0) setSelectedCustomerId(data[0]._id);
      } catch (err) {
        triggerToast('Failed to connect to the server framework.', 'error');
      } finally {
        setLoadingList(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;

    const cachedProfile = detailsCache.current[selectedCustomerId];
    const cacheKey = `${selectedCustomerId}_${algoMode}`;
    const cachedMatches = matchesCache.current[cacheKey];

    if (cachedProfile && cachedMatches) {
      setSelectedCustomer(cachedProfile);
      setMatches(cachedMatches);
      setLoadingDetails(false);
      return;
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchProfileAndMatches = async () => {
      setLoadingDetails(true);
      try {
        let profileData = cachedProfile;
        let matchesData = cachedMatches;

        const fetches = [];
        let profileFetchIndex = -1;
        let matchesFetchIndex = -1;

        if (!profileData) {
          profileFetchIndex = fetches.length;
          fetches.push(
            fetch(`${API_BASE}/${selectedCustomerId}`, { signal }).then(res => {
              if (!res.ok) throw new Error('Profile fetch failed');
              return res.json();
            })
          );
        }

        if (!matchesData) {
          matchesFetchIndex = fetches.length;
          fetches.push(
            fetch(`${API_BASE}/${selectedCustomerId}/matches?algo=${algoMode}`, { signal }).then(res => {
              if (!res.ok) throw new Error('Matches fetch failed');
              return res.json();
            })
          );
        }

        const results = await Promise.all(fetches);

        if (profileFetchIndex !== -1) {
          profileData = results[profileFetchIndex];
        }
        if (matchesFetchIndex !== -1) {
          matchesData = results[matchesFetchIndex];
        }

        if (!signal.aborted) {
          setSelectedCustomer(profileData);
          setMatches(matchesData);

          // Update caches
          detailsCache.current[selectedCustomerId] = profileData;
          matchesCache.current[cacheKey] = matchesData;
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          triggerToast('AI analysis synchronization encounter tracking error.', 'error');
        }
      } finally {
        if (!signal.aborted) {
          setLoadingDetails(false);
        }
      }
    };

    fetchProfileAndMatches();

    return () => {
      abortController.abort();
    };
  }, [selectedCustomerId, algoMode]);

  const handleGenerateEmailDraft = async (candidateId) => {
    try {
      const res = await fetch(`${API_BASE}/${selectedCustomerId}/send-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId })
      });
      const data = await res.json();
      setModalPayload({ ...data, candidateId }); 
      setSelectedMatch(null);
      triggerToast('AI-Personalized match proposal compiled successfully!');
    } catch (err) {
      triggerToast('Could not compile personalized email draft.', 'error');
    }
  };

  const handleSaveNote = async (customerId, updatedNotes) => {
    try {
      const res = await fetch(`${API_BASE}/${customerId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
      if (res.ok) {
        setSelectedCustomer(prev => ({ ...prev, notes: updatedNotes }));
        // Sync cache
        if (detailsCache.current[customerId]) {
          detailsCache.current[customerId] = {
            ...detailsCache.current[customerId],
            notes: updatedNotes
          };
        }
        triggerToast('Matchmaker notes synchronized with database.');
      } else {
        triggerToast('Failed to save notes to database.', 'error');
      }
    } catch (err) {
      triggerToast('Network error while saving notes.', 'error');
    }
  };

  const processedCustomers = customers
    .filter(c => {
      const matchesSearch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || c.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = genderFilter === 'All' || c.gender === genderFilter;
      const matchesStatus = statusFilter === 'All' || c.statusTag === statusFilter;
      return matchesSearch && matchesGender && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'income') return b.incomeLPA - a.incomeLPA;
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });

  return (
    <>
      <SignedOut>
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
          {/* Subtle brand background cover banner */}
          <div className="absolute inset-0 z-0 flex items-start justify-center pt-16">
            <img 
              src={coverImg} 
              alt="The Date Crew Background" 
              className="w-full max-w-5xl object-contain opacity-25 filter blur-[0.5px] select-none pointer-events-none"
            />
            {/* Dark gradient vignette layer to blend the background smoothly */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/95 to-slate-950" />
          </div>

          {/* Glassmorphic Login Card */}
          <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 text-center shadow-[0_0_80px_-15px_rgba(244,63,94,0.15)] transition-all duration-300">
            {/* Brand Logo circular badge */}
            <div className="mb-5 inline-block">
              <img 
                src={logoImg} 
                alt="TDC Logo" 
                className="w-20 h-20 rounded-full border-2 border-rose-500/40 shadow-lg object-cover mx-auto select-none pointer-events-none transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-100 mb-2">TDC Matchmaker MVP</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide max-w-xs mx-auto">
              Find your true right love • Operator Workstation
            </p>

            <SignInButton mode="modal">
              <button className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer mt-8 shadow-md hover:shadow-rose-600/20 active:scale-[0.98]">
                Sign In to Workstation
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative">
          
          {/* Global Toast Notification */}
          {toast && (
            <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 opacity-100 bg-slate-900 ${toast.type === 'error' ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}`}>
              {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span className="text-xs font-medium text-slate-200">{toast.message}</span>
            </div>
          )}

          {/* App Header with Toggle Controls */}
          <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowSidebar(!showSidebar)} className="text-slate-400 hover:text-rose-400 transition cursor-pointer" title="Toggle Sidebar">
                {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
                <span className="font-semibold text-lg tracking-wide">TDC Matchmaker Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setShowMatchPool(!showMatchPool)} className="text-slate-400 hover:text-amber-400 transition flex items-center gap-2 text-sm font-medium cursor-pointer" title="Toggle AI Matches">
                {showMatchPool ? 'Hide Matches' : 'Show Matches'}
                {showMatchPool ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
                <span className="text-sm text-slate-400 font-medium">Operator Instance</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          {/* Main 3-Column Workspace */}
          <main className="flex flex-1 overflow-hidden relative">
            {showSidebar && (
              <Sidebar 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                genderFilter={genderFilter} setGenderFilter={setGenderFilter}
                sortBy={sortBy} setSortBy={setSortBy}
                loadingList={loadingList} processedCustomers={processedCustomers}
                selectedCustomerId={selectedCustomerId} setSelectedCustomerId={setSelectedCustomerId}
                algoMode={algoMode} setAlgoMode={setAlgoMode}
              />
            )}
            
            {/* The middle column will automatically flex to fill available space */}
            <ProfileViewer 
              loadingDetails={loadingDetails} 
              selectedCustomer={selectedCustomer} 
              onSaveNote={handleSaveNote}
            />

            {showMatchPool && (
              <MatchPool 
                loadingDetails={loadingDetails} 
                matches={matches} 
                setSelectedMatch={setSelectedMatch} 
              />
            )}
          </main>

          {/* Overlay Modals */}
          <MatchReviewModal 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)} 
            onGenerate={handleGenerateEmailDraft} 
          />
          <EmailDraftModal 
            payload={modalPayload} 
            onClose={() => setModalPayload(null)} 
            onSend={() => { 
              const updatedMatches = matches.map(m => m._id === modalPayload.candidateId ? { ...m, reasoningTag: 'PROPOSAL SENT' } : m);
              setMatches(updatedMatches);
              // Sync cache
              const cacheKey = `${selectedCustomerId}_${algoMode}`;
              matchesCache.current[cacheKey] = updatedMatches;

              triggerToast('Email transmitted seamlessly.'); 
              setModalPayload(null); 
            }} 
          />
        </div>
      </SignedIn>
    </>
  );
}

export default App;