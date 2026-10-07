import { useState, useRef, useEffect, useMemo } from 'react'
import { SHADES } from './shades.js'
import { ALL_SHADES, FAMILY_LIST, TEXTURES } from './data.js'
import { floodFillMask, paintMasked } from './paint.js'

const SHADE_LIST = ALL_SHADES(SHADES)

// Each scene = paintable regions (SVG paths) + fixed decor drawn on top.
const SCENES = {
  living: {
    label: 'Living room',
    regions: [
      { id: 'back', name: 'Feature wall', d: 'M100 60H700V330H100Z', color: '#E8735A' },
      { id: 'side', name: 'Side walls', d: 'M0 0L100 60V330L0 460ZM800 0L700 60V330L800 460Z', color: '#F1E9DA' },
      { id: 'ceiling', name: 'Ceiling', d: 'M0 0H800L700 60H100Z', color: '#FAFAF7' },
    ],
    decor: (
      <g>
        <path d="M0 460L100 330H700L800 460Z" fill="#8a6a4a" /><path d="M0 460L100 330H700L800 460Z" fill="url(#light)" opacity=".25" />
        <rect x="490" y="100" width="150" height="150" fill="#bfe3f5" stroke="#fff" strokeWidth="8" /><path d="M565 100V250M490 175H640" stroke="#fff" strokeWidth="5" />
        <rect x="180" y="110" width="90" height="80" fill="#fff" stroke="#3a2a22" strokeWidth="6" /><path d="M195 180l25-40 20 25 15-15 15 30z" fill="#c9a27a" />
        <rect x="150" y="255" width="300" height="80" rx="14" fill="#12294B" /><rect x="130" y="290" width="40" height="70" rx="12" fill="#1c3a68" /><rect x="430" y="290" width="40" height="70" rx="12" fill="#1c3a68" /><rect x="165" y="300" width="270" height="55" rx="10" fill="#1c3a68" />
        <rect x="520" y="300" width="130" height="14" rx="4" fill="#4E342E" /><rect x="535" y="314" width="8" height="40" fill="#4E342E" /><rect x="627" y="314" width="8" height="40" fill="#4E342E" />
        <ellipse cx="90" cy="380" rx="40" ry="10" fill="#000" opacity=".15" /><rect x="72" y="345" width="36" height="36" rx="6" fill="#7C5A3A" /><path d="M90 345c-30-40-20-70 0-90 20 20 30 50 0 90z" fill="#3CB44B" />
      </g>
    ),
  },
  house: {
    label: 'Whole house',
    regions: [
      { id: 'upper', name: 'Upper floor', d: 'M220 132H580V236H220Z', color: '#F2B705' },
      { id: 'lower', name: 'Ground floor', d: 'M180 250H620V362H180Z', color: '#E8C4A0' },
      { id: 'trim', name: 'Bands & trim', d: 'M200 108H600V132H200ZM190 236H610V250H190Z', color: '#FAFAF7' },
      { id: 'compound', name: 'Compound wall', d: 'M0 362H800V430H0Z', color: '#B15533' },
      { id: 'door', name: 'Main door', d: 'M372 290H428V362H372Z', color: '#4E342E' },
    ],
    decor: (
      <g>
        {[250, 370, 490].map((x) => <g key={x}><rect x={x} y="158" width="60" height="58" fill="#bfe3f5" stroke="#fff" strokeWidth="5" /><path d={`M${x + 30} 158V216`} stroke="#fff" strokeWidth="3" /></g>)}
        {[220, 500].map((x) => <rect key={x} x={x} y="272" width="80" height="60" fill="#bfe3f5" stroke="#fff" strokeWidth="5" />)}
        <rect x="150" y="362" width="500" height="6" fill="#000" opacity=".12" />
        <rect x="360" y="380" width="80" height="50" fill="#2a2a2a" opacity=".85" />
        <circle cx="70" cy="250" r="55" fill="#3CB44B" /><circle cx="105" cy="230" r="40" fill="#2f9a3d" /><rect x="66" y="290" width="10" height="72" fill="#5a3a22" />
        <circle cx="735" cy="270" r="45" fill="#3CB44B" /><rect x="731" y="300" width="9" height="62" fill="#5a3a22" />
      </g>
    ),
  },
}

function Filters() {
  return (
    <defs>
      <linearGradient id="light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" /></linearGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".35" stopColor="#fff" stopOpacity=".9" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset=".8" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0f5" /><stop offset="1" stopColor="#eaf7ff" /></linearGradient>
      {TEXTURES.filter((t) => t.f).map((t) => (
        <filter key={t.id} id={`tx-${t.id}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={t.stretch ? `${t.f * 0.15} ${t.f}` : t.f} numOctaves="3" seed="4" result="n" />
          <feDiffuseLighting in="n" surfaceScale={t.s} lightingColor="#fff" result="l"><feDistantLight azimuth="235" elevation="72" /></feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="in" result="lc" />
          <feBlend in="SourceGraphic" in2="lc" mode="multiply" result="m" />
          {t.sparkle ? (<>
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="9" result="sp" />
            <feColorMatrix in="sp" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 14 -10.6" result="spk" />
            <feComposite in="spk" in2="SourceGraphic" operator="in" result="spk2" />
            <feBlend in="spk2" in2="m" mode="screen" />
          </>) : null}
        </filter>
      ))}
    </defs>
  )
}

function SceneView({ scene, paint, active, setActive }) {
  const sc = SCENES[scene]
  return (
    <svg className="viz-svg" viewBox="0 0 800 460" role="img" aria-label={`${sc.label} — click a surface to paint it`}>
      <Filters />
      <rect width="800" height="460" fill={scene === 'house' ? 'url(#sky)' : '#ddd'} />
      {scene === 'house' && <rect y="362" width="800" height="98" fill="#9aa48f" />}
      {sc.regions.map((r) => {
        const p = paint[r.id]
        const t = TEXTURES.find((x) => x.id === p.tex)
        return (
          <g key={r.id} onClick={() => setActive(r.id)} style={{ cursor: 'pointer' }}>
            <path d={r.d} fill={p.color} filter={t.f ? `url(#tx-${t.id})` : undefined} style={{ transition: 'fill .45s ease' }} />
            <path d={r.d} fill="url(#light)" opacity=".16" pointerEvents="none" />
            {t.sheen > 0 && <path d={r.d} fill="url(#sheen)" opacity={t.sheen} pointerEvents="none" />}
            {active === r.id && <path d={r.d} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="8 6" pointerEvents="none" className="viz-marching" />}
          </g>
        )
      })}
      {sc.decor}
    </svg>
  )
}

function PhotoPaint({ shade, tex }) {
  const canvasRef = useRef(null)
  const base = useRef(null), mask = useRef(null), dims = useRef({ w: 0, h: 0 })
  const [has, setHas] = useState(false), [sel, setSel] = useState(false)
  const [tol, setTol] = useState(34), [add, setAdd] = useState(false)
  const fileRef = useRef(null)

  const draw = (data) => {
    const { w, h } = dims.current, c = canvasRef.current
    if (!c) return
    c.width = w; c.height = h
    c.getContext('2d').putImageData(new ImageData(data, w, h), 0, 0)
  }
  const repaint = () => base.current && (mask.current ? draw(paintMasked(base.current, mask.current, dims.current.w, dims.current.h, shade.color, tex)) : draw(new Uint8ClampedArray(base.current)))
  useEffect(() => { if (has) repaint() }, [shade, tex, has]) // eslint-disable-line

  const upload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const img = new Image()
    img.onload = () => {
      const s = Math.min(1, 900 / img.naturalWidth), w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s)
      const o = document.createElement('canvas'); o.width = w; o.height = h
      const cx = o.getContext('2d'); cx.drawImage(img, 0, 0, w, h)
      base.current = cx.getImageData(0, 0, w, h).data; dims.current = { w, h }; mask.current = null
      setSel(false); setHas(true)
    }
    img.src = URL.createObjectURL(f)
  }
  const click = (e) => {
    const c = canvasRef.current, r = c.getBoundingClientRect(), { w, h } = dims.current
    const x = Math.min(w - 1, Math.max(0, Math.round((e.clientX - r.left) * (w / r.width))))
    const y = Math.min(h - 1, Math.max(0, Math.round((e.clientY - r.top) * (h / r.height))))
    const m = floodFillMask(base.current, w, h, x, y, tol)
    if (add && mask.current) for (let i = 0; i < m.length; i++) if (mask.current[i]) m[i] = 1
    mask.current = m; setSel(true); repaint()
  }
  const clear = () => { mask.current = null; setSel(false); repaint() }
  const save = () => { const a = document.createElement('a'); a.download = 'cp-paint-preview.png'; a.href = canvasRef.current.toDataURL(); a.click() }

  return (
    <div className="viz-photo">
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} />
      {!has ? (
        <button className="viz-drop" onClick={() => fileRef.current.click()}>
          <strong>Upload a photo of your house or room</strong>
          <span>Then tap a wall to paint it. Works best with a straight-on, well-lit photo.</span>
        </button>
      ) : (
        <>
          <canvas ref={canvasRef} className="viz-canvas" onClick={click} />
          <div className="viz-tools">
            <label>Wall edge sensitivity <input type="range" min="12" max="80" value={tol} onChange={(e) => setTol(+e.target.value)} /></label>
            <label><input type="checkbox" checked={add} onChange={(e) => setAdd(e.target.checked)} /> Add to selection</label>
            <button onClick={clear} disabled={!sel}>Clear</button>
            <button onClick={() => fileRef.current.click()}>New photo</button>
            <button onClick={save}>Save image</button>
          </div>
          {!sel && <p className="viz-hint2">Tap a wall in the photo to select it.</p>}
        </>
      )}
    </div>
  )
}

export default function Visualiser() {
  const [scene, setScene] = useState('house')
  const [paint, setPaint] = useState(() => Object.fromEntries(Object.entries(SCENES).map(([k, s]) => [k, Object.fromEntries(s.regions.map((r) => [r.id, { color: r.color, tex: 'matte', name: '' }]))])))
  const [active, setActive] = useState({ house: 'upper', living: 'back' })
  const [photoShade, setPhotoShade] = useState(SHADE_LIST[0])
  const [photoTex, setPhotoTex] = useState('matte')
  const [fam, setFam] = useState(FAMILY_LIST[0])
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return SHADE_LIST.filter((s) => (t ? s.name.toLowerCase().includes(t) || s.code.toLowerCase().includes(t.replace(/^cp\s*/, 'cp ')) : s.family === fam))
  }, [fam, q])

  const isPhoto = scene === 'photo'
  const reg = !isPhoto && active[scene]
  const cur = isPhoto ? { color: photoShade.color, tex: photoTex, name: photoShade.name, code: photoShade.code } : paint[scene][reg]
  const pickShade = (s) => isPhoto ? setPhotoShade(s) : setPaint((p) => ({ ...p, [scene]: { ...p[scene], [reg]: { ...p[scene][reg], color: s.color, name: s.name, code: s.code } } }))
  const pickTex = (id) => isPhoto ? setPhotoTex(id) : setPaint((p) => ({ ...p, [scene]: { ...p[scene], [reg]: { ...p[scene][reg], tex: id } } }))

  return (
    <section className="section viz" id="visualiser">
      <div className="wrap">
        <div className="section-head"><h2>Paint your whole house before you buy a single litre</h2><p>Pick a surface, choose from 1,100+ shades and 13 textures, and see it change instantly. Or upload a photo of your own home.</p></div>
        <div className="viz-tabs" role="tablist">
          {[...Object.entries(SCENES).map(([k, s]) => [k, s.label]), ['photo', 'Your own photo']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={scene === k} className={scene === k ? 'on' : ''} onClick={() => setScene(k)}>{l}</button>
          ))}
        </div>
        <div className="viz-grid">
          <div className="viz-stage">
            {isPhoto ? <PhotoPaint shade={photoShade} tex={photoTex} /> : <SceneView scene={scene} paint={paint[scene]} active={reg} setActive={(r) => setActive((a) => ({ ...a, [scene]: r }))} />}
            {!isPhoto && (
              <div className="viz-regions">
                <span>Painting:</span>
                {SCENES[scene].regions.map((r) => (
                  <button key={r.id} className={reg === r.id ? 'on' : ''} onClick={() => setActive((a) => ({ ...a, [scene]: r.id }))}>
                    <i style={{ background: paint[scene][r.id].color }} />{r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <aside className="viz-panel">
            <div className="viz-now"><i style={{ background: cur.color }} /><div><strong>{cur.name || 'Starting shade'}</strong><small>{cur.code || cur.color.toUpperCase()} · {TEXTURES.find((t) => t.id === cur.tex).name}</small></div></div>
            <input className="viz-search" type="search" placeholder="Search 1,100+ shades by name or code" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search shades" />
            {!q && <div className="viz-fams">{FAMILY_LIST.map((f) => <button key={f} className={fam === f ? 'on' : ''} onClick={() => setFam(f)}>{f}</button>)}</div>}
            <div className="viz-swatches" role="list">
              {list.map((s) => <button key={s.code} role="listitem" className={cur.color === s.color ? 'on' : ''} style={{ background: s.color }} title={`${s.name} · ${s.code}`} aria-label={s.name} onClick={() => pickShade(s)} />)}
              {!list.length && <p className="viz-none">No shade matches “{q}”.</p>}
            </div>
            <h4>Texture &amp; finish</h4>
            <div className="viz-tex">{TEXTURES.map((t) => <button key={t.id} className={cur.tex === t.id ? 'on' : ''} onClick={() => pickTex(t.id)}>{t.name}</button>)}</div>
          </aside>
        </div>
      </div>
    </section>
  )
}
