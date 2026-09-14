import { useState, useRef, useCallback, useEffect } from 'react';
import { GRAPH_NODES, GRAPH_EDGES } from './data.js';

const NODE_R = { project: 22, tech: 16 };

export default function KnowledgeGraph() {
  const svgRef   = useRef(null);
  const [nodes,  setNodes]    = useState(() => GRAPH_NODES.map(n => ({ ...n })));
  const [selected, setSelected] = useState(null);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const drag     = useRef(null);
  const nodesRef = useRef(nodes);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  const SVG_W = 640;
  const SVG_H = 500;

  /* Connected node IDs for selected */
  const getConnected = useCallback((id) => {
    if (!id) return new Set();
    const s = new Set([id]);
    GRAPH_EDGES.forEach(e => { if (e.from === id) s.add(e.to); if (e.to === id) s.add(e.from); });
    return s;
  }, []);

  const connected = getConnected(selected);

  /* Search filter */
  const searchLower = search.toLowerCase();
  const visibleIds  = new Set(
    nodes
      .filter(n => {
        if (filter !== 'all' && n.type !== filter) return false;
        if (search && !n.label.toLowerCase().includes(searchLower)) return false;
        return true;
      })
      .map(n => n.id)
  );

  
  /* Safe SVG point conversion - returns null if SVG/CTM unavailable */
  const svgPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    return pt.matrixTransform(ctm.inverse());
  }, []);

  const dragNode = useCallback((id, clientX, clientY) => {
    const svgPt = svgPoint(clientX, clientY);
    if (!svgPt) return;
    const node = nodesRef.current.find(n => n.id === id);
    if (!node) return;
    drag.current = { id, offsetX: svgPt.x - node.x, offsetY: svgPt.y - node.y };
  }, [svgPoint]);

  const moveNode = useCallback((clientX, clientY) => {
    if (!drag.current) return;
    const svgPt = svgPoint(clientX, clientY);
    if (!svgPt) return;
    const { id, offsetX, offsetY } = drag.current;
    setNodes(prev => prev.map(n =>
      n.id === id
        ? { ...n, x: Math.max(20, Math.min(SVG_W - 20, svgPt.x - offsetX)), y: Math.max(20, Math.min(SVG_H - 20, svgPt.y - offsetY)) }
        : n
    ));
  }, [svgPoint]);

  /* Mouse drag */
  const onMouseDown = useCallback((e, id) => { e.preventDefault(); dragNode(id, e.clientX, e.clientY); }, [dragNode]);
  const onMouseMove = useCallback((e) => { moveNode(e.clientX, e.clientY); }, [moveNode]);
  const onMouseUp   = useCallback(() => { drag.current = null; }, []);

  /* Touch drag */
  const onTouchStart = useCallback((e, id) => { dragNode(id, e.touches[0].clientX, e.touches[0].clientY); }, [dragNode]);
  const onTouchMove  = useCallback((e) => { if (drag.current) { e.preventDefault(); moveNode(e.touches[0].clientX, e.touches[0].clientY); } }, [moveNode]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",  onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  useEffect(() => {
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend",  onMouseUp);
    return () => { window.removeEventListener("touchmove", onTouchMove); window.removeEventListener("touchend", onMouseUp); };
  }, [onTouchMove, onMouseUp]);

  const reset = () => setNodes(GRAPH_NODES.map(n => ({ ...n })));
  const selectedNode = selected ? nodes.find(n => n.id === selected) : null;
  const isSelected = (id) => id === selected;
  const isDimmed = (id) => selected && !connected.has(id) && id !== selected;

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Controls — stacked on mobile, single row on desktop */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:border-accent/40"
          aria-label="Filter node type"
        >
          <option value="all">All Types</option>
          <option value="project">Projects</option>
          <option value="tech">Technologies</option>
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes…"
          className="flex-1 min-w-32 bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/40"
          aria-label="Search nodes"
        />
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-border hover:text-text-primary hover:border-accent/40 transition-all whitespace-nowrap"
        >
          Reset Layout
        </button>
      </div>

      {/* Content — stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 flex-1 min-h-0">

        {/* Graph */}
        <div
          className="lg:col-span-3 rounded-xl border border-border overflow-hidden relative"
          style={{ backgroundColor: '#1a2329', minHeight: 280 }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-full select-none"
            style={{ minHeight: 280, touchAction: 'none' }}
            onTouchMove={onTouchMove}
            onTouchEnd={onMouseUp}
          >
            <defs>
              <radialGradient id="kg-bg" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#1a2329" />
                <stop offset="100%" stopColor="#11161a" />
              </radialGradient>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#kg-bg)" />

            {GRAPH_EDGES.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from);
              const to   = nodes.find(n => n.id === edge.to);
              if (!from || !to || !visibleIds.has(edge.from) || !visibleIds.has(edge.to)) return null;
              const hl = isSelected(edge.from) || isSelected(edge.to);
              return (
                <line key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={hl ? '#8faf9b' : '#3a474b'}
                  strokeWidth={hl ? 1.8 : 0.8}
                  strokeDasharray={hl ? '0' : '3 3'}
                  opacity={isDimmed(edge.from) || isDimmed(edge.to) ? 0.15 : 1}
                />
              );
            })}

            {nodes.map(node => {
              if (!visibleIds.has(node.id)) return null;
              const r = NODE_R[node.type] || 16;
              return (
                <g key={node.id}
                  onMouseDown={e => onMouseDown(e, node.id)}
                  onTouchStart={e => onTouchStart(e, node.id)}
                  onClick={() => setSelected(selected === node.id ? null : node.id)}
                  style={{ cursor: 'grab', opacity: isDimmed(node.id) ? 0.25 : 1 }}
                  role="button"
                  aria-label={`${node.label} — tap to explore connections`}
                >
                  <circle cx={node.x} cy={node.y} r={r + 4}
                    fill={isSelected(node.id) ? '#8faf9b' : 'transparent'}
                    opacity={isSelected(node.id) ? 0.18 : 0}
                  />
                  <circle cx={node.x} cy={node.y} r={r}
                    fill={node.type === 'project' ? '#29363b' : '#202b32'}
                    stroke={node.color}
                    strokeWidth={isSelected(node.id) ? 2.5 : 1.5}
                  />
                  <text x={node.x} y={node.y - r - 8} textAnchor="middle"
                    fontSize={node.type === 'project' ? '10' : '9'}
                    fill={isDimmed(node.id) ? '#334155' : '#94a3b8'}
                    fontFamily="Inter, sans-serif"
                    fontWeight={isSelected(node.id) ? '700' : '500'}>
                    {node.label.length > 13 ? node.label.slice(0, 11) + '…' : node.label}
                  </text>
                  <text x={node.x} y={node.y + 4} textAnchor="middle"
                    fontSize={node.type === 'project' ? '10' : '8'}
                    fill={node.color} fontFamily="Inter, sans-serif" fontWeight="700">
                    {node.type === 'project' ? '◆' : '●'}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-text-muted pointer-events-none">
            Tap to select · Drag to reposition
          </p>
        </div>

        {/* Info panel — full width on mobile, 2 cols on desktop */}
        <div
          className="lg:col-span-2 rounded-xl border border-border p-4 overflow-y-auto"
          style={{ backgroundColor: '#1a2329', minHeight: 180 }}
        >
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedNode.color }} />
                <p className="font-bold text-white text-sm">{selectedNode.label}</p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: selectedNode.color }}>
                {selectedNode.type}
              </p>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Connected To</p>
                <div className="space-y-1.5">
                  {Array.from(connected)
                    .filter(id => id !== selectedNode.id)
                    .map(id => {
                      const n = nodes.find(x => x.id === id);
                      return n ? (
                        <button key={id}
                          onClick={() => setSelected(id)}
                          className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-secondary transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: n.color }} />
                          <span className="text-xs text-text-secondary">{n.label}</span>
                          <span className="text-[10px] text-text-muted ml-auto capitalize">{n.type}</span>
                        </button>
                      ) : null;
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-6">
              <p className="text-text-muted text-xs leading-relaxed">
                Select a node to explore its connections.
              </p>
              <div className="mt-4 space-y-1.5 w-full text-left">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Legend</p>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="text-text-secondary">◆</span><span>Project</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="text-text-secondary">●</span><span>Technology</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
