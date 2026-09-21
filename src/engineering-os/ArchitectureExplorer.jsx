import { useState, useRef, useCallback } from 'react';
import { PROJECTS, ARCHITECTURES } from './data.js';
import { ChevronRightIcon, CloseIcon, LayersIcon, LockIcon } from '../components/icons';

const TYPE_COLORS = {
  client:   '#3b82f6',
  frontend: '#61dafb',
  backend:  '#84cc16',
  auth:     '#f59e0b',
  realtime: '#a78bfa',
  service:  '#10b981',
  ai:       '#6366f1',
  database: '#47a248',
  orm:      '#52b0e7',
};

const toSVG = (pct, dim) => (pct / 100) * dim;

export default function ArchitectureExplorer() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id);
  const [selectedNode,  setSelectedNode]  = useState(null);
  const [hoveredNode,   setHoveredNode]   = useState(null);
  // Reset transient node selection whenever the project changes — derived
  // during render (keyed by activeProject) rather than via setState-in-effect.
  const [selectionScope, setSelectionScope] = useState(activeProject);
  const svgRef = useRef(null);

  const arch    = ARCHITECTURES[activeProject];
  const project = PROJECTS.find(p => p.id === activeProject);

  const SVG_W = 640;
  const SVG_H = 520;

  const getConnected = useCallback((nodeId) => {
    if (!nodeId) return new Set();
    const set = new Set([nodeId]);
    arch.edges.forEach(e => {
      if (e.from === nodeId) set.add(e.to);
      if (e.to   === nodeId) set.add(e.from);
    });
    return set;
  }, [arch]);

  const highlight = hoveredNode || selectedNode;
  const connected = getConnected(highlight);

  if (selectionScope !== activeProject) {
    // Scope changed → clear stale selection (applied once per project switch).
    setSelectionScope(activeProject);
    setSelectedNode(null);
    setHoveredNode(null);
  }

  const selectedNodeData = selectedNode ? arch.nodes.find(n => n.id === selectedNode) : null;
  const detail = selectedNodeData?.detail ?? null;
  const detailColor = selectedNodeData ? (TYPE_COLORS[selectedNodeData.type] || selectedNodeData.color) : null;

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Project selector — wraps on mobile */}
      <div className="flex flex-wrap gap-2">
        {PROJECTS.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all duration-200 ${
              activeProject === p.id
                ? 'text-bg border-transparent'
                : 'bg-transparent border-border text-text-secondary hover:border-accent/40'
            }`}
            style={activeProject === p.id ? { backgroundColor: p.color, borderColor: p.color } : {}}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Content — stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 flex-1 min-h-0">

        {/* SVG diagram */}
        <div
          className="lg:col-span-3 rounded-xl border border-border overflow-hidden relative"
          style={{ backgroundColor: '#0f172a', minHeight: 260 }}
        >
          {/* Legend — scrolls horizontally on narrow screens */}
          <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap gap-x-2 gap-y-1 overflow-x-auto pb-0.5">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <span key={type} className="flex items-center gap-1 text-[9px] sm:text-[10px] text-text-secondary capitalize whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                {type}
              </span>
            ))}
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-full"
            style={{ minHeight: 260 }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(148,163,184,0.4)" />
              </marker>
              <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={project.color} />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {arch.edges.map((edge, i) => {
              const from = arch.nodes.find(n => n.id === edge.from);
              const to   = arch.nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              const fx = toSVG(from.x, SVG_W);
              const fy = toSVG(from.y, SVG_H);
              const tx = toSVG(to.x,   SVG_W);
              const ty = toSVG(to.y,   SVG_H);
              const isActive = highlight && connected.has(from.id) && connected.has(to.id);
              return (
                <line key={i}
                  x1={fx} y1={fy + 18} x2={tx} y2={ty - 18}
                  stroke={isActive ? project.color : 'rgba(148,163,184,0.18)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? 'none' : '4 4'}
                  markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              );
            })}

            {arch.nodes.map(node => {
              const cx          = toSVG(node.x, SVG_W);
              const cy          = toSVG(node.y, SVG_H);
              const isSel       = selectedNode === node.id;
              const isHl        = connected.has(node.id);
              const isDim       = !!(highlight && !connected.has(node.id));
              const color       = TYPE_COLORS[node.type] || node.color;
              return (
                <g key={node.id}
                  onClick={() => setSelectedNode(s => s === node.id ? null : node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer', opacity: isDim ? 0.25 : 1, transition: 'opacity 0.2s' }}
                  role="button"
                  aria-label={`${node.label} — tap for details`}
                >
                  {isSel && (
                    <circle cx={cx} cy={cy} r={26} fill="none"
                      stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5}
                      style={{ filter: 'url(#glow)' }}
                    />
                  )}
                  <circle cx={cx} cy={cy} r={18}
                    fill={isHl ? `${color}28` : 'rgba(15,23,42,0.9)'}
                    stroke={color}
                    strokeWidth={isSel ? 2.5 : isHl ? 2 : 1.5}
                    style={{ transition: 'all 0.2s', filter: isSel ? 'url(#glow)' : 'none' }}
                  />
                  <text x={cx} y={cy + 34} textAnchor="middle"
                    fontSize="10" fill={isDim ? '#475569' : '#cbd5e1'}
                    fontFamily="Inter, sans-serif" fontWeight={isSel ? '700' : '500'}>
                    {node.label.length > 14 ? node.label.slice(0, 12) + '…' : node.label}
                  </text>
                  <text x={cx} y={cy + 4} textAnchor="middle"
                    fontSize="10" fill={color} fontFamily="Inter, sans-serif" fontWeight="700">
                    {node.type.slice(0, 2).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {!selectedNode && (
            <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-text-muted">
              Tap any node for technical details
            </p>
          )}
        </div>

        {/* Detail panel — full width on mobile, 2 cols on desktop */}
        <div className="lg:col-span-2" style={{ minHeight: 200 }}>
          {detail && detailColor ? (
            <div
              className="rounded-xl border h-full overflow-y-auto p-4 sm:p-5 space-y-4"
              style={{ backgroundColor: '#0f172a', borderColor: `${detailColor}40` }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: detailColor }} />
                <h3 className="font-bold text-white text-sm">{detail.title}</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="ml-auto text-text-muted hover:text-white p-1"
                  aria-label="Close detail panel"
                ><CloseIcon size={14} /></button>
              </div>

              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.tech?.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: `${detailColor}18`, color: detailColor, border: `1px solid ${detailColor}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {detail.responsibilities && (
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Responsibilities</p>
                  <ul className="space-y-1">
                    {detail.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                        <ChevronRightIcon size={12} className="mt-0.5 flex-shrink-0" style={{ color: detailColor }} />{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {detail.security && (
                <div>
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Security</p>
                  <ul className="space-y-1">
                    {detail.security.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-amber-300/80">
                        <LockIcon size={12} className="mt-0.5 flex-shrink-0 text-amber-500" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {detail.notes && (
                <div className="rounded-lg p-3 text-xs text-text-secondary leading-relaxed"
                  style={{ backgroundColor: `${detailColor}08`, border: `1px solid ${detailColor}20` }}>
                  {detail.notes}
                </div>
              )}
            </div>
          ) : (
            <div
              className="rounded-xl border border-border h-full flex flex-col items-center justify-center p-6 text-center"
              style={{ backgroundColor: '#0f172a', minHeight: 180 }}
            >
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                style={{ color: project.color, backgroundColor: `${project.color}18` }}>
                <LayersIcon size={20} strokeWidth={1.5} />
              </div>
              <p className="text-text-secondary font-semibold text-sm mb-1">{project.title}</p>
              <p className="text-text-muted text-xs leading-relaxed max-w-xs">{project.tagline}</p>
              <p className="text-text-muted text-[10px] mt-3">Tap a node to explore its technical details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
