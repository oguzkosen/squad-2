import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';

export function PinModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1907') { setPin(''); setError(false); onSuccess(); } else { setError(true); setPin(''); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white rounded-2xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2 font-medium"><Lock className="w-5 h-5 text-indigo-600" /> Yetkili Girişi</div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-sm text-slate-500 mb-4">Lütfen yetkili PIN kodunu girin.</p>
              <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }} placeholder="PIN Kodu" className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'} text-center text-xl tracking-[0.5em] outline-none`} autoFocus />
              {error && <p className="text-red-500 text-sm mt-2 text-center">Hatalı PIN!</p>}
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl mt-4 font-medium">Doğrula</button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}