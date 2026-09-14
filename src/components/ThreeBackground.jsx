export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base background */}
      <div className="absolute inset-0" style={{ background: 'var(--color-bg)' }} />

      {/* Grid lines */}
      <div className="absolute inset-0 bg-grid-dark" />

      {/* Large olive glow, top left */}
      <div
        className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(94, 234, 212, 0.12) 0%, rgba(94, 234, 212, 0.03) 40%, transparent 70%)' }}
      />

      {/* Amber glow, bottom right */}
      <div
        className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217, 155, 59, 0.09) 0%, rgba(217, 155, 59, 0.02) 40%, transparent 70%)' }}
      />

      {/* Moss teal tonal glow, center right */}
      <div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.06) 0%, transparent 70%)' }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-50" />
    </div>
  );
}
