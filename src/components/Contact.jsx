import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { scrollToSection } from '../utils/scroll';
import { loadGsap } from '../utils/anim';
import {
  GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, MailIcon, LocationIcon,
  CheckIcon, CheckCircleIcon, ChevronUpIcon,
} from './icons';

const contactDetails = [
  { icon: <MailIcon        size={20} className="text-accent" />, label: 'Email',        value: 'sahshivchandar14@gmail.com', href: 'mailto:sahshivchandar14@gmail.com' },
  { icon: <LocationIcon    size={20} className="text-accent" />, label: 'Location',     value: 'Kathmandu, Nepal',           href: null },
  { icon: <CheckCircleIcon size={20} className="text-accent" />, label: 'Availability', value: 'Open to opportunities',      href: null },
];

const socialLinks = [
  { name: 'GitHub',    href: 'https://github.com/shivchandarsah',                      icon: <GithubIcon    size={18} /> },
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/in/shivchandar-sah-394250296', icon: <LinkedinIcon  size={18} /> },
  { name: 'Instagram', href: 'https://instagram.com/shivchandar_sah33',                icon: <InstagramIcon size={18} /> },
  { name: 'Facebook',  href: 'https://facebook.com/Sahprince0',                        icon: <FacebookIcon  size={18} /> },
];

const topics = [
  { value: 'project',       label: 'New Project Inquiry' },
  { value: 'freelance',     label: 'Freelance Opportunity' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'other',         label: 'Other' },
];

const EMPTY    = { name: '', email: '', subject: '', message: '' };
const MAX_CHARS = 1000;

const inputBase  = 'w-full px-4 py-2.5 rounded-lg border text-text-primary text-sm placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2';
const inputStyle = { backgroundColor: 'var(--color-bg-secondary)' };

export default function Contact() {
  const scrollTo       = (id) => scrollToSection(id);
  const sectionRef     = useRef(null);
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');   // 'idle' | 'submitting' | 'success' | 'error'
  const prefersReduced      = useReducedMotion();

  /* Deferred reveal: GSAP loads only when Contact mounts (already lazy),
     never on the Hero critical path. */
  useEffect(() => {
    if (prefersReduced) return;
    let ctx = null;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray('.contact-reveal').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => gsap.fromTo(el, { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: i * 0.09 }),
          });
        });
      }, sectionRef);
    }).catch(() => {});
    return () => { cancelled = true; if (ctx) ctx.revert(); };
  }, [prefersReduced]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.subject)        e.subject = 'Please select a topic';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_CHARS) return;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!validate()) return;
    setStatus('submitting');

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name:     form.name,
            email:    form.email,
            subject:  form.subject,
            message:  form.message,
            _subject: `[Portfolio] ${form.subject} — ${form.name}`,
            /* Honeypot — Formspree ignores submissions where _gotcha is filled */
            _gotcha:  '',
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `HTTP ${res.status}`);
        }
        setStatus('success');
        setForm(EMPTY);
        setErrors({});
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        /* No endpoint configured — open mailto fallback */
        const sub  = encodeURIComponent(`[Portfolio - ${form.subject}] ${form.name}`);
        const body = encodeURIComponent(`Hi Shivchandar,\n\n${form.message}\n\n---\nFrom: ${form.name} (${form.email})`);
        window.open(`mailto:sahshivchandar14@gmail.com?subject=${sub}&body=${body}`, '_blank');
        setStatus('success');
        setForm(EMPTY);
        setErrors({});
        setTimeout(() => setStatus('idle'), 6000);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 8000);
    }
  };

  const fieldClass = (field) =>
    `${inputBase} border-border focus:ring-accent/40 focus:border-accent/60 ${errors[field] ? '!border-red-500/60 focus:ring-red-500/30' : ''}`;

  const charsLeft = MAX_CHARS - form.message.length;

  return (
    <section ref={sectionRef} id="contact" className="section section-alt" aria-labelledby="contact-title">
      <div className="section-inner">

        {/* Header */}
        <div className="contact-reveal mb-12">
          <h2 id="contact-title" className="section-title">
            Let&apos;s <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-md mt-2 leading-relaxed">
            Have a project in mind or want to collaborate? Send a message and I&apos;ll get back to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {contactDetails.map((item) => (
              <div key={item.label} className="contact-reveal">
                {item.href ? (
                  <a href={item.href} className="flex items-center gap-4 p-4 card group hover:border-accent/30">
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(94,234,212,0.10)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 card">
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(94,234,212,0.10)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Social */}
            <div className="contact-reveal pt-2">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">Follow Me</p>
              <div className="flex gap-2">
                {socialLinks.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200"
                    style={{ backgroundColor: 'rgba(94,234,212,0.08)' }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 contact-reveal">
            <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-8 space-y-5">

              {/* Honeypot — hidden from humans, bots fill it, Formspree rejects */}
              <input type="text" name="_gotcha" tabIndex={-1} aria-hidden="true"
                style={{ display: 'none' }} autoComplete="off" />

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Name <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input id="name" name="name" type="text"
                    autoComplete="name"
                    value={form.name} onChange={handleChange}
                    placeholder="Your Name"
                    className={fieldClass('name')} style={inputStyle}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    disabled={status === 'submitting'} />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Email <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input id="email" name="email" type="email"
                    autoComplete="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass('email')} style={inputStyle}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={status === 'submitting'} />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Topic <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <select id="subject" name="subject"
                  value={form.subject} onChange={handleChange}
                  className={`${fieldClass('subject')} ${!form.subject ? 'text-text-muted' : ''}`}
                  style={inputStyle}
                  aria-required="true"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  disabled={status === 'submitting'}>
                  <option value="" disabled>Select a topic…</option>
                  {topics.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {errors.subject && (
                  <p id="subject-error" role="alert" className="mt-1 text-xs text-red-400">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-text-secondary">
                    Message <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <span className={`text-[10px] tabular-nums ${charsLeft < 100 ? 'text-amber-400' : 'text-text-muted'}`}
                    aria-live="polite" aria-atomic="true">
                    {charsLeft} / {MAX_CHARS}
                  </span>
                </div>
                <textarea id="message" name="message"
                  value={form.message} onChange={handleChange}
                  rows={5} maxLength={MAX_CHARS}
                  placeholder="Tell me about your project or idea…"
                  className={`${fieldClass('message')} resize-none`} style={inputStyle}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                  disabled={status === 'submitting'} />
                <p id="message-hint" className="sr-only">Maximum {MAX_CHARS} characters</p>
                {errors.message && (
                  <p id="message-error" role="alert" className="mt-1 text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              {/* Submit row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button type="submit" className="btn-primary flex-shrink-0"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>Sending…</>
                  ) : status === 'success' ? (
                    <><CheckIcon size={16} />Message sent!</>
                  ) : 'Send Message'}
                </button>

                {/* Always-rendered live region — reliable across all screen readers */}
                <p role="status" aria-live="polite" aria-atomic="true"
                  className={`text-sm font-semibold flex items-center gap-1.5 transition-opacity duration-300 ${status === 'success' ? 'text-accent opacity-100' : status === 'error' ? 'text-red-400 opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {status === 'success' && <><CheckIcon size={16} />I&apos;ll get back to you soon!</>}
                  {status === 'error'   && <>Couldn&apos;t send — please try again or <a href="mailto:sahshivchandar14@gmail.com" className="underline">email me directly</a>.</>}
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Scroll to top */}
        <div className="mt-14 lg:mt-16 flex justify-center">
          <button onClick={() => scrollTo('hero')}
            className="flex flex-col items-center gap-2 text-text-muted hover:text-accent transition-colors duration-200 group"
            aria-label="Scroll back to top">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Back to Top</span>
            <ChevronUpIcon size={16} className="group-hover:-translate-y-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}
