
import React from 'react';
import { Job } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { MapPin, Clock, ChevronRight, Zap } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const urgencyColor = {
    'High': 'text-red-600 bg-red-50',
    'Medium': 'text-amber-600 bg-amber-50',
    'Low': 'text-green-600 bg-green-50'
  };

  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
    >
      {job.urgency === 'High' && (
        <div className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-bl-xl shadow-lg">
          <Zap size={14} fill="currentColor" />
        </div>
      )}
      
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {CATEGORY_ICONS[job.category]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors leading-tight">
              {job.title}
            </h3>
            <span className="text-xl font-black text-slate-900 leading-none shrink-0">
              ${job.price}
            </span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
              <MapPin size={12} />
              {job.distance}m
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider ${urgencyColor[job.urgency]}`}>
              <Clock size={12} />
              {job.urgency}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center ml-2">
          <img 
            src={job.seekerAvatar} 
            className="w-10 h-10 rounded-2xl border-2 border-white shadow-md mb-2 group-hover:scale-110 transition-transform" 
            alt={job.seekerName} 
          />
          <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
