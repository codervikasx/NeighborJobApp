
import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { getMatchingAdvice } from '../geminiService';
import { X, ShieldCheck, Star, Send, Loader2 } from 'lucide-react';

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onApply?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onClose, onApply }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(true);
  const [applying, setApplying] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchAdvice = async () => {
      const result = await getMatchingAdvice(job.description);
      setAdvice(result);
      setLoadingAdvice(false);
    };
    fetchAdvice();
  }, [job]);

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      onApply?.();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="p-5 bg-blue-50 text-blue-600 rounded-[24px]">
              {CATEGORY_ICONS[job.category]}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{job.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{job.category}</span>
                <span className="text-slate-300">•</span>
                <span className="text-lg font-black text-green-600">${job.price}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 mb-6 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Task Brief</h4>
            <p className="text-slate-600 font-medium leading-relaxed">{job.description}</p>
          </div>

          <div className="flex items-center gap-4 p-5 border border-slate-100 rounded-3xl mb-8">
            <img src={job.seekerAvatar} alt="" className="w-14 h-14 rounded-2xl shadow-sm" />
            <div className="flex-1">
              <p className="font-bold text-slate-900">{job.seekerName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                ))}
                <span className="text-[10px] font-black text-slate-400 ml-1">4.8 (24)</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-blue-600 px-2 py-1 bg-blue-50 rounded-lg uppercase tracking-wider">Top Seeker</span>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-3xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-blue-600" />
              <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest">Neighborhood Safety Guidelines</h4>
            </div>
            {loadingAdvice ? (
              <div className="flex items-center gap-2 text-blue-600 py-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm italic font-medium">Fetching safety tips...</span>
              </div>
            ) : (
              <p className="text-sm text-blue-700 leading-relaxed font-medium italic opacity-80">{advice}</p>
            )}
          </div>

          <button 
            disabled={applying}
            onClick={handleApply}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
          >
            {applying ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Confirm & Chat
                <Send size={20} />
              </>
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Walking distance: approx. {job.distance || '...'} meters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
