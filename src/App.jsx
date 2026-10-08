import { useState, useEffect, useRef } from 'react'
import Visualiser from './Visualiser.jsx'
import ShadeAlbum from './ShadeAlbum.jsx'

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Reveal({ children, className = '' }) {
  const [ref, inView] = useInView(0.15)
  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`}>
      {children}
    </div>
  )
}

const SLIDES = [
  { eyebrow: 'Interior & exterior painting', title: 'Painted with perfection, one wall at a time.', text: 'Expert painters, premium paints and a free colour consultation. 1,000+ projects finished across 10 cities.' },
  { eyebrow: 'Colour visualiser', title: 'See your colour on your own house first.', text: 'Try 1,100+ shades and 13 textures on a sample room, a whole house or a photo of your home.' },
  { eyebrow: 'Weatherproof finishes', title: 'Exteriors built for monsoon and summer alike.', text: 'Crack-bridging, fade-resistant coats that still look fresh years later.' },
  { eyebrow: 'Free home visit', title: 'A colour expert comes to your door. No cost.', text: 'We bring swatches, samples and honest advice before you decide anything.' },
]

const PRODUCTS = [
  { icon: '🏠', bg: '#FFE3D6', title: 'Interior Emulsion', desc: 'Smooth, low-odour finish with washable durability for every room.' },
  { icon: '🌦️', bg: '#DCEFE9', title: 'Exterior Weatherproof', desc: 'Built for Indian monsoons and summers — 12-year fade protection.' },
  { icon: '🪵', bg: '#FBE7B6', title: 'Wood & Metal Enamel', desc: 'High-gloss, rust-resistant coats for doors, grills and furniture.' },
  { icon: '💧', bg: '#E4E1F5', title: 'Waterproofing', desc: 'Seals terraces, basements and bathrooms against seepage for years.' },
]

const WHY = [
  { n: '01', title: 'Colour-match guarantee', desc: 'Bring any swatch, fabric or photo — we mix the exact shade in-store.' },
  { n: '02', title: 'Low-VOC formulas', desc: 'Safe for bedrooms and nurseries, with virtually no paint smell.' },
  { n: '03', title: 'Doorstep consultation', desc: 'A colour expert visits your home, free, before you decide anything.' },
  { n: '04', title: '2-year finish warranty', desc: 'Peeling, cracking or fading within warranty is repainted at no cost.' },
]

const TESTIMONIALS = [
  { quote: 'The consultant matched the exact terracotta from my grandmother\u2019s house in Jaipur. Three years on, the colour still looks freshly painted.' },
  { quote: 'We repainted the whole exterior before the monsoon. Zero seepage this year for the first time in a decade.' },
  { quote: 'Booked the free visualiser session on a Sunday and had painters at our door by Tuesday. Genuinely painless.' },
]

// --- WhatsApp contact -------------------------------------------------
// Change this one number to update every WhatsApp link/button on the whole site.
const WHATSAPP_NUMBER = '917821999822' // country code + number, no + or spaces
const WHATSAPP_MESSAGE = "Hi CP Paint, I'd like to know more about your paints and colour consultation."
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CP Paint on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.3.64 4.46 1.75 6.31L4 29l7.86-1.7a11.9 11.9 0 0 0 4.15.74h.01C22.65 28.04 28 22.66 28 16.03 28 9.4 22.65 3 16.01 3Zm0 21.63h-.01a9.6 9.6 0 0 1-4.9-1.34l-.35-.21-4.66 1.01 1.02-4.55-.23-.37a9.55 9.55 0 0 1-1.47-5.16c0-5.3 4.32-9.62 9.63-9.62 2.57 0 4.98 1 6.8 2.82a9.55 9.55 0 0 1 2.82 6.8c0 5.31-4.32 9.62-9.65 9.62Zm5.29-7.2c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.66-1.58-.9-2.17-.24-.57-.48-.5-.66-.51h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.43 1.02 2.81 1.17 3 .14.19 2 3.06 4.86 4.29.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.25.17-1.38-.07-.13-.26-.2-.55-.35Z"
        />
      </svg>
    </a>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="logo" href="#top">
          <img className="logo-mark" src="/logo.png" alt="CP Paint" />
          <span className="logo-text">
            CP Paint
            <small>Consultancy &amp; Services</small>
          </span>
        </a>
        <nav className="nav-links">
          <a href="#shades">Shades</a>
          <a href="#products">Products</a>
          <a href="#visualiser">Visualiser</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="nav-cta">Get a free sample</button>
        <button className="nav-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
      {open && (
        <div className="wrap" style={{ paddingBottom: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <a href="#shades" onClick={() => setOpen(false)}>Shades</a>
          <a href="#products" onClick={() => setOpen(false)}>Products</a>
          <a href="#visualiser" onClick={() => setOpen(false)}>Visualiser</a>
          <a href="#reviews" onClick={() => setOpen(false)}>Reviews</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
      )}
    </header>
  )
}

const SLIDE_DURATION = 6000

function Hero() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), SLIDE_DURATION)
    return () => clearInterval(t)
  }, [active])
  const go = (i) => setActive((i + SLIDES.length) % SLIDES.length)
  return (
    <section className="hero-video" id="top">
      <video className="hero-bg" src="/hero.mp4" poster="/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="hero-scrim" />
      <div className="wrap hero-video-inner">
        <div className="hv-slides">
          {SLIDES.map((s, i) => (
            <div key={i} className={`hv-slide ${i === active ? 'active' : ''}`} aria-hidden={i !== active}>
              <span className="slide-eyebrow"><span className="dot" />{s.eyebrow}</span>
              <h1>{s.title}</h1>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="slide-ctas">
          <a href="#visualiser"><button className="btn-primary">Try the colour visualiser</button></a>
          <a href="#contact"><button className="btn-ghost" style={{ borderColor: '#fff', color: '#fff' }}>Book a free home visit</button></a>
        </div>
        <div className="hv-nav">
          <button onClick={() => go(active - 1)} aria-label="Previous slide">‹</button>
          {SLIDES.map((_, i) => <button key={i} className={`hv-dot ${i === active ? 'active' : ''}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}><span key={active} style={i === active ? { animationDuration: `${SLIDE_DURATION}ms` } : undefined} /></button>)}
          <button onClick={() => go(active + 1)} aria-label="Next slide">›</button>
        </div>
      </div>
    </section>
  )
}

const FAMILIES = [
  { name: 'Terracottas & Reds', color: '#D6620A', color2: '#D93B2B' },
  { name: 'Yellows & Golds', color: '#C98A00', color2: '#FFC53D' },
  { name: 'Fresh Greens', color: '#1F5C2E', color2: '#3CB44B' },
  { name: 'Blues & Teals', color: '#12294B', color2: '#1E88E5' },
  { name: 'Pinks & Purples', color: '#5E3B8C', color2: '#E91E63' },
  { name: 'Neutrals & Greys', color: '#3A2A22', color2: '#7C8790' },
]

function ColourFamilies() {
  return (
    <section className="family-strip">
      <div className="wrap">
        <div className="family-grid">
          {FAMILIES.map((f) => (
            <a href="#shades" className="family-card" key={f.name} style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color2})` }}>
              <span>{f.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ target, decimals = 0, suffix = '', active }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const duration = 1200
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setVal(target * progress)
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target])
  return <>{val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}</>
}

function Stats() {
  const [ref, inView] = useInView(0.4)
  const items = [
    { value: 1000, suffix: '+', label: 'Projects completed' },
    { value: 10, suffix: '', label: 'Cities served' },
    { value: 1100, suffix: '+', label: 'Shades to choose from' },
    { value: 13, suffix: '', label: 'Textures & finishes' },
  ]
  return (
    <section className="stats" ref={ref}>
      <div className="wrap stats-inner">
        {items.map((it) => (
          <div key={it.label}>
            <div className="stat-num">
              <CountUp target={it.value} decimals={it.decimals || 0} suffix={it.suffix} active={inView} />
            </div>
            <div className="stat-label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Products() {
  return (
    <section className="section" id="products" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <h2>A finish for every surface</h2>
          <p>Interior, exterior, wood, metal or waterproofing — pick the job, we've got the formula.</p>
        </Reveal>
        <div className="product-grid">
          {PRODUCTS.map((p) => (
            <div className="product-card" key={p.title}>
              <div className="product-icon" style={{ background: p.bg }}>{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Why homeowners switch to CP Paint</h2>
        </Reveal>
        <div className="why-grid">
          {WHY.map((w) => (
            <div className="why-item" key={w.n}>
              <div className="why-num">{w.n}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section" id="reviews" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Homes across India, repainted</h2>
        </Reveal>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">“{t.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Sign up free at https://formspree.io, create a form, and paste its endpoint below
// to make this form deliver real emails. Until then, it shows a working success
// state locally so you can see and test the full flow.
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', time: 'Morning (9am–12pm)', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('sending')

    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
      // Demo mode: no real endpoint configured yet — simulate the round trip.
      await new Promise((r) => setTimeout(r, 700))
      setStatus('sent')
      return
    }
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <Reveal>
          <div className="contact-wrap">
            <div className="contact-form">
              <h2>Book your free colour consultation</h2>
              <p>Leave your details and a CP Paint consultant will call you back to fix a visit — no obligation to buy.</p>

              {status === 'sent' ? (
                <div className="form-success">
                  <span className="tick">✓</span>
                  <div>
                    <strong>Thanks, {form.name.split(' ')[0] || 'there'} — request received.</strong>
                    <p style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-70)' }}>
                      Our team will call you on {form.phone} during your preferred slot ({form.time}).
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="cf-name">Full name</label>
                    <input id="cf-name" type="text" required placeholder="Your name" value={form.name} onChange={update('name')} />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="cf-phone">Phone number</label>
                      <input id="cf-phone" type="tel" required placeholder="10-digit mobile number" value={form.phone} onChange={update('phone')} />
                    </div>
                    <div className="field">
                      <label htmlFor="cf-time">Preferred call-back time</label>
                      <select id="cf-time" value={form.time} onChange={update('time')}>
                        <option>Morning (9am–12pm)</option>
                        <option>Afternoon (12pm–4pm)</option>
                        <option>Evening (4pm–7pm)</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="cf-message">What are you looking to paint? (optional)</label>
                    <textarea id="cf-message" placeholder="e.g. 3BHK exterior, Sector 12, Gurugram" value={form.message} onChange={update('message')} />
                  </div>
                  <button className="btn-primary contact-submit" type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Request a call back'}
                  </button>
                  {status === 'error' && (
                    <p className="form-note" style={{ color: 'var(--coral)' }}>
                      Something went wrong sending that — please try again, or call us directly.
                    </p>
                  )}
                  <p className="form-note">We'll only use these details to arrange your consultation.</p>
                </form>
              )}
            </div>
            <div className="contact-info">
              <div>
                <h3>Talk to us directly</h3>
                <div className="contact-info-item">
                  <div className="label">Phone</div>
                  <div className="value">+917821999822</div>
                </div>
                <div className="contact-info-item">
                  <div className="label">Email</div>
                  <div className="value">cppaint09@gmail.com</div>
                </div>
                <div className="contact-info-item">
                  <div className="label">Hours</div>
                  <div className="value">Mon–Sat, 9am–7pm</div>
                </div>
                <div className="contact-info-item">
                  <div className="label">WhatsApp</div>
                  <a className="value contact-wa-link" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    Chat with us →
                  </a>
                </div>
              </div>
              <div className="brush-line" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a className="logo" href="#top" style={{ marginBottom: 14, display: 'inline-flex' }}>
              <img className="logo-mark" src="/logo.png" alt="CP Paint" />
              <span className="logo-text">
                CP Paint
                <small>Consultancy &amp; Services</small>
              </span>
            </a>
            <p style={{ fontSize: 14, color: 'var(--ink-70)', maxWidth: '32ch', marginTop: 14, lineHeight: 1.6 }}>
              Painted with perfection — premium paints and colour consultation for Indian homes.
            </p>
          </div>
          <div>
            <h5>Products</h5>
            <ul className="footer-links">
              <li><a href="#products">Interior Emulsion</a></li>
              <li><a href="#products">Exterior Weatherproof</a></li>
              <li><a href="#products">Wood &amp; Metal</a></li>
              <li><a href="#products">Waterproofing</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><a href="#shades">Shade catalogue</a></li>
              <li><a href="#visualiser">Visualiser</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#contact">Find a dealer</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul className="footer-links">
              <li>+917821999822</li>
              <li>cppaint09@gmail.com</li>
              <li>Mon–Sat, 9am–7pm</li>
              <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CP Paint Consultancy &amp; Services — All rights reserved.</span>
          <span>Made for Indian homes, room by room.</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ColourFamilies />
      <Stats />
      <ShadeAlbum />
      <Products />
      <Visualiser />
      <Why />
      <Testimonials />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
