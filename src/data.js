import { hslToRgb } from './paint.js'

const hex = (h, s, l) => {
  const { r, g, b } = hslToRgb(h, s, l)
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

// 18 colour families x 8 depths x 7 intensities = 1,008 shades, plus 120 neutrals.
const HUES = [
  ['Reds', 0], ['Terracottas', 14], ['Oranges', 26], ['Golds', 40], ['Yellows', 52], ['Limes', 78],
  ['Greens', 118], ['Mints', 150], ['Teals', 175], ['Aquas', 190], ['Sky Blues', 204], ['Blues', 222],
  ['Indigos', 244], ['Violets', 268], ['Purples', 288], ['Magentas', 316], ['Pinks', 338], ['Roses', 350],
]
const DEPTH = [['Whisper', 0.92], ['Mist', 0.85], ['Soft', 0.76], ['Light', 0.67], ['Classic', 0.58], ['Bold', 0.49], ['Deep', 0.39], ['Shadow', 0.29]]
const INTENSITY = [['Ash', 0.14], ['Dusty', 0.26], ['Muted', 0.4], ['Soft', 0.55], ['Clear', 0.7], ['Vivid', 0.85], ['Electric', 1]]

// Within a family, show the true, paint-shop version of the colour first
// (mid lightness, high saturation) and fan out to pale tints / deep shades /
// muted tones after it — instead of dumping every near-white "Whisper" shade
// first just because the loop happened to start there.
const DEPTH_IDEAL = 4   // 'Classic'
const INTENSITY_IDEAL = 5 // 'Vivid'
const ORDER = []
DEPTH.forEach((d, di) => {
  INTENSITY.forEach((it, ii) => {
    const score = (di - DEPTH_IDEAL) ** 2 + (ii - INTENSITY_IDEAL) ** 2
    ORDER.push({ di, ii, score })
  })
})
ORDER.sort((a, b) => a.score - b.score)

const generated = []
let n = 1001
HUES.forEach(([fam, h]) => {
  ORDER.forEach(({ di, ii }) => {
    const [dn, l] = DEPTH[di]
    const [iname, s] = INTENSITY[ii]
    generated.push({ name: `${iname} ${fam.replace(/s$/, '')} ${dn}`, code: `CP ${n++}`, color: hex(h, s, l), family: fam })
  })
})
;[['Warm Stone', 34, 0.22], ['Sand & Cream', 42, 0.3], ['Cool Slate', 210, 0.12], ['Earth Brown', 24, 0.32]].forEach(([nm, h, s]) => {
  for (let i = 0; i < 30; i++) {
    generated.push({ name: `${nm} ${String(i + 1).padStart(2, '0')}`, code: `CP ${n++}`, color: hex(h, s * (0.4 + 0.6 * (1 - i / 30)), 0.97 - i * 0.03), family: 'Neutrals' })
  }
})

export const SIGNATURE_LABEL = 'Signature'
export const ALL_SHADES = (curated) => [...curated.map((c) => ({ ...c, family: SIGNATURE_LABEL })), ...generated]
export const FAMILY_LIST = [SIGNATURE_LABEL, ...HUES.map((h) => h[0]), 'Neutrals']

// Every texture = an SVG lighting filter (for the sample scenes) + a canvas
// rule in paint.js (for uploaded photos). f = grain size, s = relief, sheen = gloss overlay.
export const TEXTURES = [
  { id: 'matte', name: 'Smooth Matte', f: 0, s: 0, sheen: 0 },
  { id: 'satin', name: 'Satin', f: 0, s: 0, sheen: 0.16 },
  { id: 'silk', name: 'Silk Sheen', f: 0, s: 0, sheen: 0.26 },
  { id: 'semigloss', name: 'Semi-Gloss', f: 0, s: 0, sheen: 0.38 },
  { id: 'highgloss', name: 'High Gloss', f: 0, s: 0, sheen: 0.6 },
  { id: 'suede', name: 'Suede Touch', f: 1.2, s: 0.6, sheen: 0.06 },
  { id: 'sand', name: 'Sand Textured', f: 0.9, s: 2.2, sheen: 0 },
  { id: 'stucco', name: 'Stucco', f: 0.08, s: 5, sheen: 0 },
  { id: 'roller', name: 'Roller Texture', f: 0.35, s: 2.4, sheen: 0, stretch: true },
  { id: 'concrete', name: 'Concrete Look', f: 0.22, s: 3.2, sheen: 0 },
  { id: 'limewash', name: 'Lime Wash', f: 0.012, s: 2.6, sheen: 0 },
  { id: 'metallic', name: 'Metallic Shimmer', f: 0.6, s: 1.4, sheen: 0.5, sparkle: true },
  { id: 'pearl', name: 'Pearl Finish', f: 0.5, s: 1, sheen: 0.32, sparkle: true },
]