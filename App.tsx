
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Navbar';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';
import JobDetails from './components/JobDetails';
import PostJobModal from './components/PostJobModal';
import Login from './components/Login';
import ChatView from './components/ChatView';
import { MOCK_JOBS, CURRENT_USER, CATEGORY_ICONS } from './constants';
import { Job, JobStatus, JobCategory, Conversation, ChatMessage } from './types';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Map as MapIcon, 
  LayoutList, 
  Trophy, 
  User as UserIcon,
  Zap,
  Briefcase,
  Users,
  Filter,
  MessageSquare,
  ChevronRight,
  Star,
  X,
  Navigation,
  Clock
} from 'lucide-react';

// Distance calculation using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); 
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({ lat: 0, lng: 0 });
  const [activeTab, setActiveTab] = useState('explore');
  const [appMode, setAppMode] = useState<'work' | 'hire'>('work');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mapPreviewJob, setMapPreviewJob] = useState<Job | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string | null>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Initialize location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // Handle tab switch safety when changing modes
  const handleModeSwitch = (mode: 'work' | 'hire') => {
    setAppMode(mode);
    if (mode === 'work' && activeTab === 'post') {
      setActiveTab('explore');
    }
  };

  const handleLogin = (phone: string) => {
    setIsLoggedIn(true);
  };

  const handlePostJob = (jobData: any) => {
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      seekerId: CURRENT_USER.id,
      seekerName: CURRENT_USER.name,
      seekerAvatar: CURRENT_USER.avatar,
      createdAt: new Date().toISOString(),
      location: { 
        lat: userLocation.lat + (Math.random() - 0.5) * 0.01, 
        lng: userLocation.lng + (Math.random() - 0.5) * 0.01 
      }
    };
    setJobs([newJob, ...jobs]);
    setIsPosting(false);
    setAppMode('hire');
    setActiveTab('explore');
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      text,
      timestamp: Date.now()
    };

    const updatedConversations = conversations.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: text
    });
  };

  const startConversation = (job: Job) => {
    const existing = conversations.find(c => c.jobId === job.id);
    if (existing) {
      setActiveConversation(existing);
      setActiveTab('messages');
    } else {
      const newConv: Conversation = {
        id: `c_${job.id}`,
        jobId: job.id,
        jobTitle: job.title,
        participantId: job.seekerId,
        participantName: job.seekerName,
        participantAvatar: job.seekerAvatar,
        messages: [
          {
            id: 'init',
            senderId: job.seekerId,
            text: `Hi! Thanks for showing interest in "${job.title}". When can you start?`,
            timestamp: Date.now()
          }
        ],
        lastMessage: 'Interested in the job.'
      };
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv);
      setActiveTab('messages');
    }
    setSelectedJob(null);
    setMapPreviewJob(null);
  };

  const jobsWithDistance = useMemo(() => {
    return jobs.map(j => ({
      ...j,
      distance: calculateDistance(userLocation.lat, userLocation.lng, j.location.lat, j.location.lng)
    }));
  }, [jobs, userLocation]);

  const filteredJobs = useMemo(() => {
    return jobsWithDistance
      .filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUrgency = !urgencyFilter || job.urgency === urgencyFilter;
        const matchesMode = appMode === 'hire' ? job.seekerId === CURRENT_USER.id : job.seekerId !== CURRENT_USER.id;
        return matchesSearch && matchesUrgency && matchesMode;
      })
      .sort((a, b) => {
        const urgencyWeight: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
      });
  }, [jobsWithDistance, searchQuery, urgencyFilter, appMode]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <Header />
      
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        {activeTab !== 'messages' && (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex w-full max-w-xs">
              <button 
                onClick={() => handleModeSwitch('work')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  appMode === 'work' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Briefcase size={16} />
                Work
              </button>
              <button 
                onClick={() => handleModeSwitch('hire')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  appMode === 'hire' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Users size={16} />
                Hire
              </button>
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder={appMode === 'work' ? "Find neighborhood jobs..." : "Search your postings..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
                  <button 
                    onClick={() => setUrgencyFilter(null)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      !urgencyFilter ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    All
                  </button>
                  {['High', 'Medium', 'Low'].map(u => (
                    <button 
                      key={u}
                      onClick={() => setUrgencyFilter(u)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                        urgencyFilter === u ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {u === 'High' && <Zap size={12} fill="currentColor" />}
                      {u}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                  className="ml-4 flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm"
                >
                  {viewMode === 'list' ? <MapIcon size={20} /> : <LayoutList size={20} />}
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={setSelectedJob} />
                  ))
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No matches found.</p>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="h-[65vh] rounded-[40px] overflow-hidden border border-slate-200 relative map-bg bg-white shadow-xl animate-in zoom-in-95 duration-500"
                onClick={() => setMapPreviewJob(null)}
              >
                 {/* Map Overlay HUD */}
                 <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 w-fit pointer-events-auto">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Radius</span>
                    </div>
                 </div>

                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Simulated Map Grid */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]"></div>
                    
                    {/* User Pin */}
                    <div className="relative z-10 flex items-center justify-center pointer-events-auto">
                      <div className="absolute w-48 h-48 bg-blue-400/10 rounded-full animate-pulse"></div>
                      <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">
                        <UserIcon size={16} fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Job Pins */}
                    {filteredJobs.map(job => {
                      const isSelected = mapPreviewJob?.id === job.id;
                      return (
                        <div 
                          key={job.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMapPreviewJob(job);
                          }}
                          style={{ 
                            top: `calc(50% + ${(job.location.lat - userLocation.lat) * 10000}px)`, 
                            left: `calc(50% + ${(job.location.lng - userLocation.lng) * 10000}px)` 
                          }}
                          className={`absolute group cursor-pointer pointer-events-auto transition-all duration-300 ${isSelected ? 'z-40 scale-125' : 'z-30 hover:scale-110'}`}
                        >
                           <div className={`relative flex flex-col items-center`}>
                              <div className={`w-14 h-14 bg-white rounded-2xl shadow-xl border-2 flex flex-col items-center justify-center transition-all ${
                                isSelected ? 'border-blue-600 -translate-y-2 ring-4 ring-blue-100' : 
                                job.urgency === 'High' ? 'border-red-500' : job.urgency === 'Medium' ? 'border-amber-500' : 'border-green-500'
                              }`}>
                                <span className={`font-black text-sm ${isSelected ? 'text-blue-600' : ''}`}>${job.price}</span>
                                <div className="p-1 bg-slate-50 rounded-lg scale-75">
                                    {CATEGORY_ICONS[job.category]}
                                </div>
                              </div>
                              <div className={`w-2 h-2 bg-slate-300 rounded-full mt-1 transition-all ${isSelected ? 'scale-150 bg-blue-600' : ''}`}></div>
                           </div>
                        </div>
                      );
                    })}
                 </div>

                 {/* Map Preview Job Summary Card */}
                 {mapPreviewJob && (
                   <div 
                     className="absolute bottom-6 left-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-300"
                     onClick={(e) => e.stopPropagation()}
                   >
                     <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-5 shadow-2xl border border-white/20 flex flex-col gap-4">
                        <div className="flex gap-4">
                           <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                              {CATEGORY_ICONS[mapPreviewJob.category]}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <h3 className="font-black text-slate-900 truncate pr-2">{mapPreviewJob.title}</h3>
                                 <button onClick={() => setMapPreviewJob(null)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400">
                                    <X size={16} />
                                 </button>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">{mapPreviewJob.category}</span>
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                    <Clock size={10} />
                                    {mapPreviewJob.urgency}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                           <div className="flex items-center gap-4">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-400 uppercase">Distance</span>
                                 <span className="font-black text-slate-900 flex items-center gap-1 text-sm">
                                    <Navigation size={12} className="text-blue-600" />
                                    {mapPreviewJob.distance}m
                                 </span>
                              </div>
                              <div className="w-px h-6 bg-slate-100"></div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-400 uppercase">Fixed Pay</span>
                                 <span className="font-black text-green-600 text-lg">${mapPreviewJob.price}</span>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedJob(mapPreviewJob);
                                  setMapPreviewJob(null);
                                }}
                                className="px-5 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-200 transition-colors"
                              >
                                Details
                              </button>
                              <button 
                                onClick={() => startConversation(mapPreviewJob)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
                              >
                                Chat
                              </button>
                           </div>
                        </div>
                     </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Messages</h2>
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.map(conv => (
                  <div 
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md cursor-pointer transition-all"
                  >
                    <img src={conv.participantAvatar} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 truncate">{conv.participantName}</h4>
                        <span className="text-[10px] font-bold text-slate-400">2m ago</span>
                      </div>
                      <p className="text-xs font-bold text-blue-600 mb-1 truncate">Job: {conv.jobTitle}</p>
                      <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-slate-300" />
                 </div>
                 <p className="text-slate-500 font-bold">No conversations yet.</p>
                 <p className="text-xs text-slate-400 mt-1">Start a conversation by applying for a job.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'post' && (
           <div className="py-10 text-center flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center shadow-inner">
                 <MapIcon size={48} />
              </div>
              <div className="space-y-2 max-w-sm">
                 <h2 className="text-3xl font-extrabold text-slate-900">Need some help?</h2>
                 <p className="text-slate-500 text-lg">Post a task and nearby neighbors can apply in minutes.</p>
              </div>
              <button 
                onClick={() => setIsPosting(true)}
                className="w-full max-w-xs py-5 bg-blue-600 text-white rounded-[20px] font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all"
              >
                Launch Live Request
              </button>
           </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden">
               <div className="relative w-28 h-28 mx-auto mb-6">
                  <img src={CURRENT_USER.avatar} className="w-full h-full rounded-[32px] object-cover shadow-2xl border-4 border-white" alt="" />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap size={14} className="text-white" fill="currentColor" />
                  </div>
               </div>
               <h2 className="text-3xl font-black text-slate-900">{CURRENT_USER.name}</h2>
               
               <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-6">
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-slate-900">{CURRENT_USER.rating}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Stars</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-slate-900">{CURRENT_USER.reviews}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Feedback</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-slate-900">12</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Tasks</p>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full py-4 text-red-600 font-black text-sm uppercase tracking-widest bg-red-50 rounded-2xl hover:bg-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        )}
      </main>

      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={CURRENT_USER} 
        showPostTab={appMode === 'hire'}
      />

      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          onApply={() => startConversation(selectedJob)}
        />
      )}

      {isPosting && (
        <PostJobModal onClose={() => setIsPosting(false)} onPost={handlePostJob} />
      )}

      {activeConversation && (
        <ChatView 
          conversation={activeConversation}
          currentUserId={CURRENT_USER.id}
          onSendMessage={handleSendMessage}
          onBack={() => setActiveConversation(null)}
        />
      )}
    </div>
  );
};

export default App;
