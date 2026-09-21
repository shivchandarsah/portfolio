import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { loadGsap } from '../utils/anim';
import { BookOpenIcon, CalendarIcon, GraduationCapIcon, LocationIcon, MonitorIcon } from './icons';

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
    icon: <BookOpenIcon className="w-5 h-5" strokeWidth={1.5} />,
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
    icon: <MonitorIcon className="w-5 h-5" strokeWidth={1.5} />,
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
    description: 'Graduated with a Bachelor of Computer Engineering. Four years of converting caffeine and late-night debugging sessions into production-grade full-stack applications, real-time platforms, and AI-powered tools. The degree is framed. The learning never stops.',
    color:       'accent',
    icon: <GraduationCapIcon className="w-5 h-5" strokeWidth={1.5} />,
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
          <LocationIcon size={12} />
          {item.location}
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon size={12} />
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
