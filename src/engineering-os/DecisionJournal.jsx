import { useState } from 'react';
import { DECISIONS } from './data.js';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '../components/icons';

const PROJECT_COLORS = {
  'Support Hub AI': '#10b981',
  'Bolts Army':     '#f59e0b',
  'Sikshamantra':   '#3b82f6',
  'SmartInvoice':   '#10b981',
};

export default function DecisionJournal() {
  const [active,  setActive]  = useState(null);
  const [filter,  setFilter]  = useState('All');

  const projects = ['All', ...new Set(DECISIONS.map(d => d.project))];
  const filtered = filter === 'All' ? DECISIONS : DECISIONS.filter(d => d.project === filter);

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {projects.map(p => {
          const c = PROJECT_COLORS[p] ?? '#475569';
          return (
            <button key={p} onClick={() => { setFilter(p); setActive(null); }}
              className="px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-200"
              style={filter === p
                ? { backgroundColor: c, borderColor: c, color: '#000' }
                : { backgroundColor: 'transparent', borderColor: 'rgba(148,163,184,0.15)', color: '#94a3b8' }
              }>
              {p}
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto flex-1 pb-2">
        {filtered.map(dec => {
          const color     = PROJECT_COLORS[dec.project] ?? '#64748b';
          const isOpen    = active === dec.id;
          return (
            <div key={dec.id}
              className="rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: '#0f172a',
                borderColor: isOpen ? `${color}50` : 'rgba(148,163,184,0.1)',
                boxShadow: isOpen ? `0 0 24px ${color}12` : 'none',
              }}
              onClick={() => setActive(a => a === dec.id ? null : dec.id)}
              role="button"
              aria-expanded={isOpen}
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}28` }}>
                    {dec.project}
                  </span>
                  <span className="text-text-muted group-hover:text-text-secondary transition-colors flex-shrink-0">
                    {isOpen ? <ChevronUpIcon size={15} /> : <ChevronDownIcon size={15} />}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">{dec.title}</h3>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] text-text-muted">Decision:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${color}18`, color }}>
                    {dec.chosen}
                  </span>
                </div>
              </div>

              {/* Expanded detail — CSS max-height animation for smooth open/close */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? 600 : 0, opacity: isOpen ? 1 : 0 }}
              >
                <div className="px-5 pb-5 space-y-4 border-t border-border">
                  {/* Problem */}
                  <div className="pt-4">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Problem</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{dec.problem}</p>
                  </div>

                  {/* Options considered */}
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Options Considered</p>
                    <div className="flex flex-wrap gap-2">
                      {dec.options.map(opt => (
                        <span key={opt}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1"
                          style={{
                            backgroundColor: opt === dec.chosen ? `${color}18` : 'rgba(148,163,184,0.06)',
                            color:           opt === dec.chosen ? color : '#64748b',
                            border:          `1px solid ${opt === dec.chosen ? color + '35' : 'rgba(148,163,184,0.1)'}`,
                            fontWeight:      opt === dec.chosen ? 700 : 400,
                          }}>
                          {opt === dec.chosen && <CheckIcon size={11} strokeWidth={3} />}{opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reasons */}
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Why {dec.chosen}?</p>
                    <ul className="space-y-1.5">
                      {dec.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <ChevronRightIcon size={12} className="flex-shrink-0 mt-0.5" style={{ color }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tradeoffs */}
                  {dec.tradeoffs && (
                    <div className="rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">Tradeoffs Accepted</p>
                      <p className="text-xs text-amber-300/80 leading-relaxed">{dec.tradeoffs}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
