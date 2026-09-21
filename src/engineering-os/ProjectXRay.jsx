import { useState } from 'react';
import { PROJECTS, XRAY_LAYERS } from './data.js';
import { AppIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon, InspectIcon } from '../components/icons';

export default function ProjectXRay() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [animating,     setAnimating]     = useState(false);

  const project = PROJECTS.find(p => p.id === activeProject);
  const layers  = XRAY_LAYERS[activeProject] || [];

  const handleProjectChange = (id) => {
    setAnimating(true);
    setSelectedLayer(null);
    setTimeout(() => { setActiveProject(id); setAnimating(false); }, 220);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Project tabs */}
      <div className="flex flex-wrap gap-2">
        {PROJECTS.map(p => (
          <button key={p.id} onClick={() => handleProjectChange(p.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
              activeProject === p.id ? 'text-bg border-transparent' : 'bg-transparent border-border text-text-secondary hover:border-border'
            }`}
            style={activeProject === p.id ? { backgroundColor: p.color } : {}}>
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Layer stack, 2 cols */}
        <div className={`lg:col-span-2 flex flex-col gap-2 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">System Layers</p>
          {layers.map((layer, idx) => (
            <div key={layer.id}>
              <button
                onClick={() => setSelectedLayer(s => s === layer.id ? null : layer.id)}
                className="w-full text-left rounded-xl border px-4 py-3 transition-all duration-200 group"
                style={{
                  backgroundColor: selectedLayer === layer.id ? `${layer.color}14` : '#0f172a',
                  borderColor: selectedLayer === layer.id ? `${layer.color}50` : 'rgba(148,163,184,0.1)',
                  boxShadow: selectedLayer === layer.id ? `0 0 16px ${layer.color}15` : 'none',
                }}
                aria-pressed={selectedLayer === layer.id}
              >
                <div className="flex items-center gap-3">
                  <span className="text-text-secondary"><AppIcon name={layer.icon} size={18} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{layer.label}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {layer.tech.map(t => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: `${layer.color}18`, color: layer.color, border: `1px solid ${layer.color}25` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-text-muted group-hover:text-text-secondary transition-colors">
                    {selectedLayer === layer.id ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
                  </span>
                </div>
              </button>

              {/* Connector arrow */}
              {idx < layers.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-px h-3 bg-bg-card" />
                    <ArrowDownIcon size={13} className="text-text-muted" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail panel, 3 cols */}
        <div className="lg:col-span-3">
          {selectedLayer ? (() => {
            const layer = layers.find(l => l.id === selectedLayer);
            return (
              <div className="rounded-xl border h-full overflow-y-auto p-6 space-y-5"
                style={{ backgroundColor: '#0f172a', borderColor: `${layer.color}40` }}>
                <div className="flex items-center gap-3">
                  <span style={{ color: layer.color }}><AppIcon name={layer.icon} size={24} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-bold text-white text-base">{layer.label}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {layer.tech.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: `${layer.color}18`, color: layer.color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">What it does</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{layer.what}</p>
                </div>

                {layer.decisions && (
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Engineering Decision</p>
                    <div className="rounded-lg p-3 text-sm text-text-secondary leading-relaxed"
                      style={{ backgroundColor: `${layer.color}08`, border: `1px solid ${layer.color}20` }}>
                      {layer.decisions}
                    </div>
                  </div>
                )}

                {layer.security && (
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Security Considerations</p>
                    <div className="rounded-lg p-3 text-sm text-amber-300/80 leading-relaxed"
                      style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      {layer.security}
                    </div>
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="rounded-xl border border-border h-full flex flex-col items-center justify-center p-8 text-center"
              style={{ backgroundColor: '#0f172a', minHeight: 300 }}>
              <InspectIcon size={34} strokeWidth={1.5} className="text-text-secondary mb-4" />
              <p className="text-text-secondary font-semibold text-sm mb-1">X-Ray Mode</p>
              <p className="text-text-muted text-xs leading-relaxed max-w-48">
                Select a layer to decompose {project.title} and understand every engineering decision.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
