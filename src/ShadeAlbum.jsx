import { useState, useMemo, useRef } from 'react'
import { ALL_SHADES, FAMILY_LIST } from './data.js'

const albumStyles = `
.album{border:1px solid var(--line,#e3e8ef);border-radius:22px;background:#fff;box-shadow:0 18px 40px -26px rgba(15,39,72,.35);overflow:hidden;margin-top:8px}
.album-head{display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:20px 24px 8px}
.album-cover{width:56px;height:56px;border-radius:14px;overflow:hidden;flex:none;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;box-shadow:0 8px 18px -8px rgba(0,0,0,.35)}
.album-cover span{display:block}
.album-title{display:flex;flex-direction:column;gap:3px;flex:1;min-width:200px}
.album-title strong{font-size:18px;color:var(--ink,#0f2748)}
.album-title span{font-size:14px;color:var(--ink-70,#4a5a73)}
.album-toggle{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:999px;border:none;background:var(--ink,#0f2748);color:#fff;font-weight:600;font-size:15px;cursor:pointer;transition:transform .18s ease}
.album-toggle:hover{transform:translateY(-2px)}
.album-chevron{display:inline-block;transition:transform .3s ease}
.album.is-open .album-chevron{transform:rotate(180deg)}
.album-peek{display:flex;flex-wrap:wrap;gap:10px;padding:14px 24px 22px}
.peek-dot{width:30px;height:30px;border-radius:50%;padding:0;border:2px solid #fff;cursor:pointer;box-shadow:0 0 0 1px rgba(15,39,72,.18),0 6px 12px -6px rgba(0,0,0,.35);transition:transform .15s ease,box-shadow .15s ease}
.peek-dot:hover{transform:translateY(-3px) scale(1.1)}
.peek-dot.active{box-shadow:0 0 0 2.5px var(--ink,#0f2748)}
.album-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s ease;border-top:1px solid transparent}
.album.is-open .album-body{grid-template-rows:1fr;border-top-color:var(--line,#e3e8ef)}
.album-body-inner{overflow:hidden;min-height:0;padding:0 24px}
.album.is-open .album-body-inner{padding:22px 24px 20px}
.album .family-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.album .family-tab{padding:8px 14px;border-radius:999px;border:1px solid var(--line,#e3e8ef);background:#fff;color:var(--ink,#0f2748);font-size:13.5px;font-weight:600;cursor:pointer}
.album .family-tab.active{background:var(--ink,#0f2748);color:#fff;border-color:var(--ink,#0f2748)}
.album-scroll{max-height:min(62vh,560px);overflow-y:auto;padding:4px 6px 6px 2px;scrollbar-width:thin}
.album-scroll::-webkit-scrollbar{width:8px}
.album-scroll::-webkit-scrollbar-thumb{background:rgba(15,39,72,.25);border-radius:8px}
.album .shade-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.album .shade-card{overflow:hidden;border:1px solid var(--line,#e3e8ef);border-radius:14px;background:#fff;box-shadow:0 8px 20px -16px rgba(15,39,72,.4);transition:transform .18s ease,box-shadow .18s ease}
.album .shade-card:hover{transform:translateY(-3px);box-shadow:0 12px 25px -16px rgba(15,39,72,.5)}
.album .shade-swatch{height:84px;width:100%}
.album .shade-info{padding:10px 12px 12px}
.album .shade-name{font-size:13.5px;font-weight:600;color:var(--ink,#0f2748);margin-bottom:4px}
.album .shade-code{font-size:11.5px;color:var(--ink-70,#4a5a73)}
.album-more{text-align:center;margin:22px 0 8px}
.album .btn-ghost{padding:10px 18px;border:1px solid var(--line,#e3e8ef);border-radius:999px;background:#fff;color:var(--ink,#0f2748);font-weight:600;cursor:pointer;transition:all .18s ease}
.album .btn-ghost:hover{background:var(--ink,#0f2748);color:#fff;transform:translateY(-1px)}
.album-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line,#e3e8ef);font-size:14px;color:var(--ink-70,#4a5a73)}
.album-close{background:none;border:none;font-weight:600;font-size:14px;color:var(--ink,#0f2748);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
@media (max-width:560px){
.album-head{padding:16px 16px 6px}
.album-peek{padding:12px 16px 18px}
.album.is-open .album-body-inner{padding:18px 16px 16px}
.album-toggle{width:100%;justify-content:center}
.album .shade-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.album .shade-swatch{height:70px}
.album-foot{flex-direction:column;align-items:flex-start}
}
`

const SHADE_LIST = ALL_SHADES()
const PAGE = 48

export default function ShadeAlbum() {
  const [open, setOpen] = useState(false)
  const [family, setFamily] = useState(FAMILY_LIST[0])
  const [limit, setLimit] = useState(PAGE)
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)

  const byFamily = useMemo(() => {
    const map = {}
    SHADE_LIST.forEach((shade) => {
      if (!map[shade.family]) map[shade.family] = []
      map[shade.family].push(shade)
    })
    return map
  }, [])

  const list = byFamily[family] || []

  const peek = FAMILY_LIST
    .map((f) => ({ family: f, shade: byFamily[f]?.[0] }))
    .filter((x) => x.shade)

  const pickFamily = (f) => {
    setFamily(f)
    setLimit(PAGE)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }

  const openAt = (f) => {
    pickFamily(f)
    setOpen(true)
  }

  const closeAlbum = () => {
    setOpen(false)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <>
      <style>{albumStyles}</style>
      <section className="section" id="shades" ref={sectionRef}>
        <div className="wrap">
          <div className="section-head">
            <h2>{SHADE_LIST.length.toLocaleString('en-IN')} shades, every family</h2>
            <p>Our complete shade album. Open it to browse every colour family, or tap a colour below to jump straight to it.</p>
          </div>

          <div className={`album ${open ? 'is-open' : ''}`}>
            <div className="album-head">
              <div className="album-cover" aria-hidden="true">
                <span style={{ background: '#D93B2B' }} />
                <span style={{ background: '#F2B705' }} />
                <span style={{ background: '#3CB44B' }} />
                <span style={{ background: '#1E88E5' }} />
              </div>

              <div className="album-title">
                <strong>CP Paint Shade Album</strong>
                <span>
                  {SHADE_LIST.length.toLocaleString('en-IN')} shades · {FAMILY_LIST.length} colour families
                </span>
              </div>

              <button
                type="button"
                className="album-toggle"
                aria-expanded={open}
                aria-controls="album-body"
                onClick={() => (open ? closeAlbum() : setOpen(true))}
              >
                {open ? 'Close album' : 'Open shade album'}
                <span className="album-chevron" aria-hidden="true">▾</span>
              </button>
            </div>

            <div className="album-peek" role="list" aria-label="Jump to a colour family">
              {peek.map(({ family: f, shade }) => (
                <button
                  key={f}
                  type="button"
                  role="listitem"
                  className={`peek-dot ${open && family === f ? 'active' : ''}`}
                  style={{ background: shade.color }}
                  title={f}
                  aria-label={`Open ${f}`}
                  onClick={() => openAt(f)}
                />
              ))}
            </div>

            <div className="album-body" id="album-body" aria-hidden={!open}>
              <div className="album-body-inner">
                <div className="family-tabs" role="tablist" aria-label="Filter shades by colour family">
                  {FAMILY_LIST.map((f) => (
                    <button
                      key={f}
                      type="button"
                      role="tab"
                      aria-selected={family === f}
                      tabIndex={open ? 0 : -1}
                      className={`family-tab ${family === f ? 'active' : ''}`}
                      onClick={() => pickFamily(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="album-scroll" ref={scrollRef}>
                  <div className="shade-grid">
                    {list.slice(0, limit).map((x) => (
                      <div className="shade-card" key={x.code}>
                        <div className="shade-swatch" style={{ background: x.color }} />
                        <div className="shade-info">
                          <div className="shade-name">{x.name}</div>
                          <div className="shade-code">{x.code} · {x.color.toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {limit < list.length && (
                    <div className="album-more">
                      <button type="button" className="btn-ghost" onClick={() => setLimit(limit + PAGE)}>
                        Show more ({list.length - limit} left)
                      </button>
                    </div>
                  )}
                </div>

                <div className="album-foot">
                  <span>{list.length} shades in {family}</span>
                  <button type="button" className="album-close" tabIndex={open ? 0 : -1} onClick={closeAlbum}>
                    Close album ▴
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}