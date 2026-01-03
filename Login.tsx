
import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (phone: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(phone);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200">
            N
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">NeighborJob</h1>
          <p className="text-slate-500 font-medium">Your neighborhood service network</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Verification Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-black tracking-[0.5em] text-center text-xl"
                  required
                />
              </div>
              <p className="text-center text-xs text-slate-400 font-bold">Sent to {phone}</p>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('phone')} 
              className="w-full text-sm font-bold text-blue-600 text-center"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
