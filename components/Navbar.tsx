
import React from 'react';
import { Home, Map as MapIcon, PlusCircle, User, Bell, MessageCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  unreadCount?: number;
  showPostTab?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, user, unreadCount = 0, showPostTab = true }) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: <MapIcon size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} />, badge: unreadCount },
    ...(showPostTab ? [{ id: 'post', label: 'Post Job', icon: <PlusCircle size={20} /> }] : []),
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-50 flex justify-between items-center safe-area-bottom">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors relative ${
            activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          {tab.icon}
          {tab.badge && tab.badge > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
              {tab.badge}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 glass border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
        N
      </div>
      <div>
        <h1 className="font-black text-slate-900 leading-none">NeighborJob</h1>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Live Network</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        142 neighbors online
      </div>
      <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        <Bell size={24} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  </header>
);

export default Navbar;
