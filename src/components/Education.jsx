import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { loadGsap } from '../utils/anim';

const timeline = [
  {
    id: 1,
    level:       'SEE / Class 10',
    degree:      'Secondary Education Examination (SEE)',
    institution: 'Shree Janata Model Secondary School',
    location:    'Giddha, Belapatti',
    status:      'Completed',
    description: 'Completed foundational secondary education with a focus on Science and Mathematics. This is where curiosity turned into obsession, numbers, logic, and the question "how does this actually work?" never left.',
    color:       'blue',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 2,
    level:       '+2 Science (NEB)',
    degree:      'Higher Secondary Education, Science',
    institution: 'Nasa National Secondary College',
    location:    'Tinkune, Kathmandu',
    period:      '2019 - 2021',
    status:      'Completed',
    grade:       'GPA 3.15',
    description: 'Studied Physics, Chemistry, Mathematics and Computer Science. Wrote my first lines of C, broke things spectacularly, fixed them, and realised building software was exactly what I wanted to do for life.',
    color:       'amber',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    level:       'Bachelor\'s Degree',
    degree:      'Bachelor of Computer Engineering (BCE)',
    institution: 'Cosmos College of Management and Technology',
    location:    'Sitapaila, Kathmandu',
    period:      '2022 - 2026',
    status:      'Completed',
    grade:       'GPA 3.24',
    description: 'Graduated with a BCE in Computer Engineering. Four years of converting caffeine and late-night debugging sessions into production-grade full-stack applications, real-time platforms, and AI-powered tools. The degree is framed. The learning never stops.',
    color:       'accent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

const colorMap = {
  accent: {
    dot:    'bg-accent border-accent/40',
    icon:   'bg-accent-dim text-accent',
    badge:  'bg-accent-dim text-accent border border-accent/25',
    grade:  'text-accent',
    line:   'border-accent/30',
  },
  amber: {
    dot:    'bg-amber border-amber/40',
    icon:   'bg-amber-dim text-amber',
    badge:  'bg-amber-dim text-amber border border-amber/25',
    grade:  'text-amber',
    line:   'border-amber/30',
  },
  blue: {
    dot:    'bg-blue border-blue/40',
    icon:   'bg-blue-dim text-blue',
    badge:  'bg-blue-dim text-blue border border-blue/25',
    grade:  'text-blue',
    line:   'border-blue/30',
  },
};

export default function Education() {
  const sectionRef     = useRef(null);
  const prefersReduced = useReducedMotion();

  /* Deferred reveal: GSAP loads only when Education mounts (already lazy),
     never on the Hero critical path. */
  useEffect(() => {
    if (prefersReduced) return;
    let ctx = null;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        /* Animate the vertical line drawing down */
        gsap.fromTo('.edu-line',
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '.edu-line', start: 'top 80%', once: true },
          }
        );

        /* Stagger each card */
        gsap.utils.toArray('.edu-card').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () =>
              gsap.fromTo(el,
                { x: i % 2 === 0 ? -32 : 32, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: i * 0.12 }
              ),
          });
        });
      }, sectionRef);
    }).catch(() => {});
    return () => { cancelled = true; if (ctx) ctx.revert(); };
  }, [prefersReduced]);

  return (
    <section ref={sectionRef} id="education" className="section" aria-labelledby="education-title">
      <div className="section-inner">

        {/* Header */}
        <div className="edu-card mb-16 text-center">
          <h2 id="education-title" className="section-title--center">
            Academic <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-subtitle mt-2">
            From a small school in Belapatti to a Computer Engineering degree in Kathmandu, the foundation that turned curiosity into craft.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">

          {/* Vertical line */}
          <div
            className="edu-line absolute left-6 md:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-border md:-translate-x-px"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {timeline.map((item, idx) => {
              const c = colorMap[item.color];
              const isRight = idx % 2 === 0;

              return (
                <div key={item.id} className="edu-card relative flex items-start gap-6 md:gap-0">

                  {/* ── Mobile layout (always left-aligned) ── */}
                  <div className="md:hidden flex items-start gap-4 w-full pl-12">
                    {/* Dot centred on the line (line at left-6=24px, dot w-4=16px → left-[16px]) */}
                    <div className={`absolute left-[16px] top-5 w-4 h-4 rounded-full border-2 ${c.dot} z-10`}
                      aria-hidden="true" />
                    <MobileCard item={item} c={c} />
                  </div>

                  {/* ── Desktop alternating layout ── */}
                  <div className="hidden md:flex w-full items-start gap-0">
                    {/* Left half */}
                    <div className={`w-1/2 pr-10 ${isRight ? 'flex justify-end' : ''}`}>
                      {isRight && <DesktopCard item={item} c={c} />}
                    </div>

                    {/* Centre dot */}
                    <div className="relative flex-shrink-0 w-0 flex justify-center">
                      <div className={`absolute -left-[9px] top-5 w-[18px] h-[18px] rounded-full border-2 ${c.dot} z-10`}
                        aria-hidden="true" />
                    </div>

                    {/* Right half */}
                    <div className={`w-1/2 pl-10 ${!isRight ? 'flex justify-start' : ''}`}>
                      {!isRight && <DesktopCard item={item} c={c} />}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function CardContent({ item, c }) {
  return (
    <>
      {/* Top row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.icon}`}>
          {item.icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
          {item.status}
        </span>
        <span className={`text-[10px] font-bold ml-auto ${c.grade}`}>{item.grade}</span>
      </div>

      {/* Level label */}
      <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 ${c.grade}`}>
        {item.level}
      </p>

      {/* Degree */}
      <h3 className="font-display font-bold text-text-primary text-base leading-snug tracking-tight mb-1">
        {item.degree}
      </h3>

      {/* Institution */}
      <p className="text-sm font-semibold text-text-secondary">{item.institution}</p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mt-1.5 mb-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {item.location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {item.period}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
    </>
  );
}

function MobileCard({ item, c }) {
  return (
    <div className="card w-full">
      <CardContent item={item} c={c} />
    </div>
  );
}

function DesktopCard({ item, c }) {
  return (
    <div className="card w-full max-w-sm text-left">
      <CardContent item={item} c={c} />
    </div>
  );
}
