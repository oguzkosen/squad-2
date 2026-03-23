import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Users, ChevronRight } from 'lucide-react';
import { Customer } from '../types';

export function SearchBar({ data, onSelectCustomer }: { data: Customer[]; onSelectCustomer: (c: Customer) => void }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLocaleLowerCase('tr-TR').trim();
    return data.filter(m => String(m.musteriNo).includes(q) || String(m.musteriAdi).toLocaleLowerCase('tr-TR').includes(q)).slice(0, 8);
  }, [query, data]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto z-30 mb-8">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500" />
        <input type="text" className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="Müşteri Adı veya No ile ara..." value={query} onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((c) => (
              <li key={c.musteriNo}>
                <button onClick={() => { setQuery(''); setIsOpen(false); onSelectCustomer(c); }} className="w-full text-left px-6 py-3 hover:bg-slate-50 flex items-center justify-between group">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Users className="w-5 h-5" /></div><div><div className="font-medium">{c.musteriAdi}</div><div className="text-sm text-slate-500">No: {c.musteriNo} &bull; {c.statu}</div></div></div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}