import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Loader2, Lock, Unlock, Shield } from 'lucide-react';
import { Customer } from './types';
import { Dashboard } from './components/Dashboard';
import { SegmentList } from './components/SegmentList';
import { CustomerDetail } from './components/CustomerDetail';
import { PinModal } from './components/PinModal';
import { SearchBar } from './components/SearchBar';

const API_URL = "https://script.google.com/macros/s/AKfycbzoNFQ1mJAijr3-v1Dzohc6SfwCSn7f9W7FUTWsAtXp9gIe9G7RZQ8DSrINN7XbhNcZoA/exec";

type ViewState = 'dashboard' | 'segment' | 'detail';

export default function App() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setIsPinModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S2</div>
            <h1 className="text-2xl font-light tracking-tight">Squad 2 Dashboard</h1>
          </div>
          {!loading && !error && (
            <button onClick={handleAdminToggle} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isAdmin ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
              {isAdmin ? <><Unlock className="w-4 h-4" /><span>Yetkili Modu Açık</span></> : <><Lock className="w-4 h-4" /><span>Yetkili Girişi</span></>}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Veriler Google Sheets'ten çekiliyor...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Bağlantı Hatası</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {(view === 'dashboard' || view === 'segment') && (
              <SearchBar data={data} onSelectCustomer={(c) => { setSelectedCustomer(c); setSelectedSegment((c.statu || '').trim()); setView('detail'); }} />
            )}
            <AnimatePresence mode="wait">
              {view === 'dashboard' && <Dashboard key="dashboard" data={data} onSelectSegment={(s) => { setSelectedSegment(s); setView('segment'); }} />}
              {view === 'segment' && <SegmentList key="segment" segment={selectedSegment} data={data} onBack={() => setView('dashboard')} onSelectCustomer={(c) => { setSelectedCustomer(c); setView('detail'); }} />}
              {view === 'detail' && selectedCustomer && <CustomerDetail key="detail" customer={selectedCustomer} isAdmin={isAdmin} onBack={() => setView('segment')} onHome={() => setView('dashboard')} />}
            </AnimatePresence>
          </>
        )}
      </main>
      <PinModal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} onSuccess={() => { setIsAdmin(true); setIsPinModalOpen(false); }} />
    </div>
  );
}