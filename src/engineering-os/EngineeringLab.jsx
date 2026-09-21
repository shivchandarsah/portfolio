import { useState, useEffect, useRef, useCallback } from 'react';
import { LAB_AUTH_STEPS, LAB_API_METHODS, LAB_DB_OPS } from './data.js';
import { AppIcon, AlertTriangleIcon, ArrowRightIcon, CheckIcon, PlayIcon } from '../components/icons';

/* ── Auth Flow Lab ─────────────────────────────────────────────── */
function AuthFlowLab() {
  const [step,    setStep]    = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setStep(-1);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    let i = 0;
    timerRef.current = setInterval(() => {
      setStep(i);
      i++;
      if (i >= LAB_AUTH_STEPS.length) { clearInterval(timerRef.current); setRunning(false); }
    }, 700);
    return () => clearInterval(timerRef.current);
  }, [running]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">JWT Authentication Flow</h3>
          <p className="text-xs text-text-secondary mt-0.5">Visualise every step from login to protected resource access.</p>
        </div>
        <button onClick={start} disabled={running}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-black transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: running ? '#475569' : '#10b981' }}>
          {running ? 'Running…' : (
            <>
              {step >= 0 ? 'Replay' : 'Start'}
              <PlayIcon size={12} />
            </>
          )}
        </button>
      </div>

      <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
        {LAB_AUTH_STEPS.map((s, idx) => {
          const done    = step >= idx;
          const current = step === idx;
          return (
            <div key={s.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-300"
              style={{
                backgroundColor: done ? `${s.color}10` : '#0f172a',
                borderLeft: `2px solid ${done ? s.color : 'transparent'}`,
                opacity: step === -1 ? 0.5 : done ? 1 : 0.3,
              }}>
              <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5"
                style={{ backgroundColor: done ? s.color : '#1e293b', color: done ? '#000' : '#475569' }}>
                {done ? <CheckIcon size={11} strokeWidth={3} /> : idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: done ? s.color : '#64748b' }}>{s.label}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
              {current && running && (
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 animate-pulse" style={{ backgroundColor: s.color }} />
              )}
            </div>
          );
        })}
      </div>

      {step >= LAB_AUTH_STEPS.length - 1 && !running && (
        <div className="rounded-lg px-4 py-3 text-sm text-accent font-semibold inline-flex items-center gap-2 w-full justify-center"
          style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <CheckIcon size={15} />
          Authentication complete, user is authorised and has access
        </div>
      )}
    </div>
  );
}

/* ── API Request Lab ───────────────────────────────────────────── */
const API_PIPELINE = [
  { id: 'client',     label: 'Client',      color: '#3b82f6' },
  { id: 'request',    label: 'HTTP Request', color: '#61dafb' },
  { id: 'auth',       label: 'Auth Middleware', color: '#f59e0b' },
  { id: 'controller', label: 'Controller',  color: '#84cc16' },
  { id: 'service',    label: 'Service',     color: '#10b981' },
  { id: 'database',   label: 'Database',    color: '#47a248' },
  { id: 'response',   label: 'Response',    color: '#46e3b7' },
];

function APIRequestLab() {
  const [method,    setMethod]    = useState('GET');
  const [activeStep, setActive]   = useState(-1);
  const [running,   setRunning]   = useState(false);
  const timerRef = useRef(null);

  const m = LAB_API_METHODS.find(x => x.method === method);

  const fire = useCallback(() => {
    setActive(-1);
    setRunning(true);
    let i = 0;
    timerRef.current = setInterval(() => {
      setActive(i);
      i++;
      if (i >= API_PIPELINE.length) { clearInterval(timerRef.current); setRunning(false); }
    }, 480);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-white text-sm">API Request Pipeline</h3>
        <p className="text-xs text-text-secondary mt-0.5">Select a method and fire a request to see it travel through the stack.</p>
      </div>

      {/* Method selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {LAB_API_METHODS.map(mm => (
          <button key={mm.method} onClick={() => { setMethod(mm.method); setActive(-1); }}
            className="px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-150"
            style={{
              backgroundColor: method === mm.method ? `${mm.color}20` : 'transparent',
              borderColor: method === mm.method ? mm.color : 'rgba(148,163,184,0.2)',
              color: method === mm.method ? mm.color : '#64748b',
            }}>
            {mm.method}
          </button>
        ))}
        <button onClick={fire} disabled={running}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-black disabled:opacity-50 transition-all"
          style={{ backgroundColor: running ? '#475569' : m.color }}>
          {running ? 'In flight…' : (
            <>
              Fire Request
              <PlayIcon size={11} />
            </>
          )}
        </button>
      </div>

      {/* Endpoint */}
      <div className="rounded-lg px-3 py-2 text-xs font-mono"
        style={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.1)' }}>
        <span style={{ color: m.color }} className="font-bold">{m.method}</span>
        <span className="text-text-secondary ml-2">{m.example}</span>
        <span className="ml-2 text-text-muted inline-flex items-center gap-1">
          <ArrowRightIcon size={12} />
          {m.statusCode}
        </span>
      </div>

      {/* Pipeline — horizontal scroll on mobile to prevent jagged wrapping */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-center gap-1" style={{ minWidth: 'max-content' }}>
          {API_PIPELINE.map((stage, idx) => (
            <div key={stage.id} className="flex items-center gap-1">
              <div className="rounded-lg px-3 py-2 text-center transition-all duration-300"
                style={{
                  backgroundColor: activeStep >= idx ? `${stage.color}18` : '#0f172a',
                  border: `1px solid ${activeStep >= idx ? stage.color : 'rgba(148,163,184,0.1)'}`,
                  minWidth: 72,
                }}>
                <p className="text-[10px] font-bold whitespace-nowrap" style={{ color: activeStep >= idx ? stage.color : '#475569' }}>
                  {stage.label}
                </p>
                {activeStep === idx && running && (
                  <span className="block w-1.5 h-1.5 rounded-full animate-pulse mx-auto mt-1" style={{ backgroundColor: stage.color }} />
                )}
              </div>
              {idx < API_PIPELINE.length - 1 && (
                <ArrowRightIcon size={12} className="text-text-muted flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-text-muted">{m.desc}</p>
    </div>
  );
}

/* ── Database Lab ──────────────────────────────────────────────── */
function DatabaseLab() {
  const [op,      setOp]      = useState('FIND');
  const [running, setRunning] = useState(false);
  const [stage,   setStage]   = useState(-1);
  const timerRef = useRef(null);

  const dbOp  = LAB_DB_OPS.find(x => x.op === op);
  const STAGES = ['Application', 'ORM / ODM', 'Query Builder', 'Database Engine', 'Storage Layer', 'Result'];

  const STAGE_COUNT = STAGES.length;

  const run = useCallback(() => {
    setStage(-1);
    setRunning(true);
    let i = 0;
    timerRef.current = setInterval(() => {
      setStage(i); i++;
      if (i >= STAGE_COUNT) { clearInterval(timerRef.current); setRunning(false); }
    }, 500);
  }, [STAGE_COUNT]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const MONGO_EXAMPLE = { FIND: 'User.findOne({ email })', INSERT: 'User.create({ name, email, role })', UPDATE: 'User.updateOne({ _id }, { $set: { role } })', DELETE: 'User.deleteOne({ _id })' };
  const MYSQL_EXAMPLE = { FIND: 'SELECT * FROM users WHERE email = ?', INSERT: 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)', UPDATE: 'UPDATE users SET role = ? WHERE id = ?', DELETE: 'DELETE FROM users WHERE id = ?' };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-white text-sm">Database Operation Flow</h3>
        <p className="text-xs text-text-secondary mt-0.5">Trace how a CRUD operation travels from application to storage and back.</p>
      </div>

      {/* Operation picker */}
      <div className="flex items-center gap-2 flex-wrap">
        {LAB_DB_OPS.map(d => (
          <button key={d.op} onClick={() => { setOp(d.op); setStage(-1); }}
            className="px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-150"
            style={{
              backgroundColor: op === d.op ? `${d.color}18` : 'transparent',
              borderColor: op === d.op ? d.color : 'rgba(148,163,184,0.2)',
              color: op === d.op ? d.color : '#64748b',
            }}>
            {d.label} ({d.op})
          </button>
        ))}
        <button onClick={run} disabled={running}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-black disabled:opacity-50 transition-all"
          style={{ backgroundColor: running ? '#475569' : dbOp.color }}>
          {running ? 'Running…' : (
            <>
              Execute
              <PlayIcon size={11} />
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-text-secondary">{dbOp.desc}</p>

      {/* Query examples side by side */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[['MongoDB / Mongoose', MONGO_EXAMPLE[op], '#47a248'], ['MySQL / Sequelize', MYSQL_EXAMPLE[op], '#4479a1']].map(([db, q, c]) => (
          <div key={db} className="rounded-lg p-3" style={{ backgroundColor: '#0f172a', border: `1px solid ${c}30` }}>
            <p className="text-[10px] font-bold mb-1.5" style={{ color: c }}>{db}</p>
            <p className="font-mono text-[10px] text-text-secondary break-all">{q}</p>
          </div>
        ))}
      </div>

      {/* Stage pipeline */}
      <div className="flex flex-col gap-1.5">
        {STAGES.map((s, idx) => (
          <div key={s} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300"
            style={{
              backgroundColor: stage >= idx ? `${dbOp.color}10` : '#0f172a',
              borderLeft: `2px solid ${stage >= idx ? dbOp.color : 'transparent'}`,
              opacity: stage === -1 ? 0.5 : stage >= idx ? 1 : 0.35,
            }}>
            <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
              style={{ backgroundColor: stage >= idx ? dbOp.color : '#1e293b', color: stage >= idx ? '#000' : '#475569' }}>
              {stage >= idx ? <CheckIcon size={10} strokeWidth={3} /> : idx + 1}
            </span>
            <p className="text-xs font-semibold" style={{ color: stage >= idx ? dbOp.color : '#475569' }}>{s}</p>
            {stage === idx && running && <span className="w-1.5 h-1.5 rounded-full animate-pulse ml-auto" style={{ backgroundColor: dbOp.color }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Rate Limiter Lab ──────────────────────────────────────────── */
function RateLimiterLab() {
  const [rps,     setRps]     = useState(5);
  const [limit]               = useState(10);
  const [running, setRunning] = useState(false);
  const [log,     setLog]     = useState([]);
  const [stats,   setStats]   = useState({ accepted: 0, limited: 0 });
  const timerRef = useRef(null);
  const countRef = useRef(0);

  const start = useCallback(() => {
    setLog([]); setStats({ accepted: 0, limited: 0 }); countRef.current = 0;
    setRunning(true);
    const interval = 1000 / rps;
    let acc = 0; let lim = 0;
    timerRef.current = setInterval(() => {
      countRef.current++;
      const windowCount = countRef.current % limit;
      const blocked = windowCount === 0;
      const entry = { id: countRef.current, blocked, time: new Date().toLocaleTimeString('en', { hour12: false }) };
      if (blocked) lim++; else acc++;
      setLog(p => [...p.slice(-20), entry]);
      setStats({ accepted: acc, limited: lim });
      if (countRef.current >= rps * 4) { clearInterval(timerRef.current); setRunning(false); }
    }, interval);
  }, [rps, limit]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-sm">Rate Limiter Simulation</h3>
          <p className="text-xs text-text-secondary mt-0.5">Adjust requests/sec and see how a sliding-window rate limiter responds.</p>
          <p className="text-[10px] text-amber-400/80 mt-1 font-semibold inline-flex items-center gap-1.5">
            <AlertTriangleIcon size={12} />
            SIMULATION, not real production data
          </p>
        </div>
        <button onClick={start} disabled={running}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold text-black flex-shrink-0 disabled:opacity-50 transition-all"
          style={{ backgroundColor: running ? '#475569' : '#a78bfa' }}>
          {running ? 'Running…' : (
            <>
              Simulate
              <PlayIcon size={12} />
            </>
          )}
        </button>
      </div>

      {/* RPS slider */}
      <div>
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Requests / second</span>
          <span className="font-bold text-white">{rps} req/s</span>
        </div>
        <input type="range" min="1" max="20" value={rps} onChange={e => setRps(+e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#a78bfa' }} />
        <div className="flex justify-between text-[10px] text-text-muted mt-0.5"><span>1</span><span>20</span></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Rate Limit',  value: `${limit}/s`,        color: '#64748b' },
          { label: 'Accepted',    value: stats.accepted,      color: '#10b981' },
          { label: 'Rate Limited',value: stats.limited,       color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3 text-center"
            style={{ backgroundColor: '#0f172a', border: `1px solid ${s.color}30` }}>
            <p className="font-bold text-lg" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Request log */}
      {log.length > 0 && (
        <div className="rounded-lg p-3 max-h-36 overflow-y-auto space-y-1"
          style={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.1)' }}>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Request Log</p>
          {log.map(entry => (
            <div key={entry.id} className="flex items-center gap-2 text-[11px]">
              <span className="font-mono text-text-muted w-14 flex-shrink-0">{entry.time}</span>
              <span className="font-mono text-text-muted">REQ #{entry.id}</span>
              <span className="ml-auto font-bold px-2 py-0.5 rounded-full text-[10px]"
                style={{
                  backgroundColor: entry.blocked ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                  color: entry.blocked ? '#ef4444' : '#10b981',
                }}>
                {entry.blocked ? '429 LIMITED' : '200 OK'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tab selector ──────────────────────────────────────────────── */
const LABS = [
  { id: 'auth',    label: 'Auth Flow',     icon: 'lock' },
  { id: 'api',     label: 'API Request',   icon: 'server' },
  { id: 'db',      label: 'Database',      icon: 'database' },
  { id: 'rate',    label: 'Rate Limiter',  icon: 'zap' },
];

export default function EngineeringLab() {
  const [active, setActive] = useState('auth');

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Tab strip */}
      <div className="flex flex-wrap gap-2">
        {LABS.map(lab => (
          <button key={lab.id} onClick={() => setActive(lab.id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
              active === lab.id
                ? 'bg-bg-card border-border text-white'
                : 'bg-transparent border-border text-text-secondary hover:text-text-primary hover:border-border'
            }`}>
            <AppIcon name={lab.icon} size={14} />{lab.label}
          </button>
        ))}
      </div>

      {/* Lab content */}
      <div className="rounded-xl border border-border p-5 flex-1 overflow-y-auto"
        style={{ backgroundColor: '#0f172a' }}>
        {active === 'auth' && <AuthFlowLab />}
        {active === 'api'  && <APIRequestLab />}
        {active === 'db'   && <DatabaseLab />}
        {active === 'rate' && <RateLimiterLab />}
      </div>
    </div>
  );
}
