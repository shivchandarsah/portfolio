import { useState } from 'react';
import { CHALLENGES } from './data.js';
import { ArrowRightIcon, CheckIcon, CloseIcon, RotateCcwIcon } from '../components/icons';

const CATEGORY_COLOR = {
  Security:     '#ef4444',
  Architecture: '#3b82f6',
  Database:     '#f59e0b',
  Backend:      '#10b981',
};

export default function TechnicalChallenges() {
  const [idx,      setIdx]      = useState(0);
  const [answered, setAnswered] = useState(null);   // index of chosen option
  const [xp,       setXp]       = useState(0);
  const [history,  setHistory]  = useState([]);     // { id, correct }
  const [filter,   setFilter]   = useState('All');

  const categories = ['All', ...new Set(CHALLENGES.map(c => c.category))];
  const filtered   = filter === 'All' ? CHALLENGES : CHALLENGES.filter(c => c.category === filter);
  const challenge  = filtered[idx % filtered.length];
  const color      = CATEGORY_COLOR[challenge?.category] ?? '#64748b';

  const choose = (optIdx) => {
    if (answered !== null) return;
    setAnswered(optIdx);
    const correct = optIdx === challenge.correct;
    if (correct) setXp(p => p + challenge.xp);
    setHistory(h => [...h, { id: challenge.id, correct }]);
  };

  const next = () => {
    setAnswered(null);
    setIdx(i => i + 1);
  };

  const handleFilter = (cat) => {
    setFilter(cat);
    setIdx(0);
    setAnswered(null);
  };

  if (!challenge) return <p className="text-text-muted text-sm">No challenges available.</p>;

  const totalAnswered = history.length;
  const totalCorrect  = history.filter(h => h.correct).length;

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-bold text-lg text-accent">{xp}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">XP Earned</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-white">{totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-text-secondary">{totalAnswered} / {filtered.length}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Answered</p>
          </div>
        </div>
        <p className="text-[10px] text-text-muted italic">Engineering knowledge, not a certification or exam</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => handleFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              filter === cat ? 'text-white border-transparent' : 'bg-transparent border-border text-text-secondary hover:text-text-primary'
            }`}
            style={filter === cat ? { backgroundColor: CATEGORY_COLOR[cat] ?? '#475569' } : {}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Challenge card */}
      <div className="rounded-xl border flex-1 overflow-y-auto"
        style={{ backgroundColor: '#0f172a', borderColor: `${color}30` }}>
        <div className="p-5 space-y-5">
          {/* Meta */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}>
              {challenge.category}
            </span>
            <span className="text-[10px] font-bold text-text-muted">+{challenge.xp} XP</span>
            <span className="text-[10px] text-text-muted ml-auto">#{challenge.id} of {filtered.length}</span>
          </div>

          {/* Question */}
          <p className="text-white font-semibold text-base leading-relaxed">{challenge.question}</p>

          {/* Options */}
          <div className="space-y-2.5">
            {challenge.options.map((opt, i) => {
              const isChosen  = answered === i;
              const isCorrect = i === challenge.correct;
              let bg = '#172026'; let border = 'rgba(148,163,184,0.12)'; let textC = '#94a3b8';
              if (answered !== null) {
                if (isCorrect)            { bg = 'rgba(16,185,129,0.12)';  border = '#10b981'; textC = '#10b981'; }
                else if (isChosen)        { bg = 'rgba(239,68,68,0.12)';   border = '#ef4444'; textC = '#ef4444'; }
                else                      { textC = '#334155'; }
              }
              return (
                <button key={i} onClick={() => choose(i)} disabled={answered !== null}
                  className="w-full text-left rounded-lg px-4 py-3 transition-all duration-200 flex items-start gap-3 disabled:cursor-default"
                  style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
                  <span className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ borderColor: border, color: textC,
                      backgroundColor: (answered !== null && isCorrect) ? '#10b981' : (answered !== null && isChosen) ? '#ef4444' : 'transparent' }}>
                    {answered !== null && isCorrect ? <CheckIcon size={11} strokeWidth={3} /> : answered !== null && isChosen ? <CloseIcon size={11} strokeWidth={3} /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: textC }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered !== null && (
            <div className="rounded-lg p-4 space-y-2"
              style={{
                backgroundColor: answered === challenge.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${answered === challenge.correct ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm inline-flex items-center gap-1.5" style={{ color: answered === challenge.correct ? '#10b981' : '#ef4444' }}>
                  {answered === challenge.correct ? <CheckIcon size={15} /> : <CloseIcon size={15} />}
                  {answered === challenge.correct ? 'Correct' : 'Not quite'}
                </span>
                {answered === challenge.correct && (
                  <span className="text-xs font-bold text-accent px-2 py-0.5 rounded-full bg-accent/15">
                    +{challenge.xp} XP
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{challenge.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {answered !== null && (
            <button onClick={next}
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-black transition-all inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: color }}>
              {idx + 1 >= filtered.length ? (
                <>
                  Restart Challenges
                  <RotateCcwIcon size={14} />
                </>
              ) : (
                <>
                  Next Challenge
                  <ArrowRightIcon size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
