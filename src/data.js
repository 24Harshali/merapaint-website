// Self-contained: no imports needed, so this one file holds every shade.
const hslToRgb = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c } else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c } else if (h < 300) { r = x; b = c } else { r = c; b = x }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
}

export const SHADES = [
  { name: 'Sindoor', code: 'MP 108', color: '#D93B2B', family: 'Terracottas & Reds' },
  { name: 'Brick Red', code: 'MP 109', color: '#B23A2E', family: 'Terracottas & Reds' },
  { name: 'Chili Pepper', code: 'MP 111', color: '#C1272D', family: 'Terracottas & Reds' },
  { name: 'Maharani Maroon', code: 'MP 114', color: '#6B1E2A', family: 'Terracottas & Reds' },
  { name: 'Rustic Terracotta', code: 'MP 118', color: '#B15533', family: 'Terracottas & Reds' },
  { name: 'Adobe Clay', code: 'MP 121', color: '#C97A54', family: 'Terracottas & Reds' },
  { name: 'Coral Sunset', code: 'MP 124', color: '#E8735A', family: 'Terracottas & Reds' },
  { name: 'Salmon Blush', code: 'MP 126', color: '#F0A08A', family: 'Terracottas & Reds' },
  { name: 'Peach Fizz', code: 'MP 129', color: '#F7C9B6', family: 'Terracottas & Reds' },
  { name: 'Haldi Gold', code: 'MP 176', color: '#F2B705', family: 'Yellows & Golds' },
  { name: 'Marigold Morning', code: 'MP 214', color: '#FFB627', family: 'Yellows & Golds' },
  { name: 'Mustard Seed', code: 'MP 182', color: '#D9A441', family: 'Yellows & Golds' },
  { name: 'Golden Wheat', code: 'MP 186', color: '#E8C468', family: 'Yellows & Golds' },
  { name: 'Butter Cream', code: 'MP 189', color: '#F5DFA0', family: 'Yellows & Golds' },
  { name: 'Lemon Zest', code: 'MP 191', color: '#F4E04D', family: 'Yellows & Golds' },
  { name: 'Amber Glow', code: 'MP 196', color: '#E6A817', family: 'Yellows & Golds' },
  { name: 'Antique Brass', code: 'MP 199', color: '#B8860B', family: 'Yellows & Golds' },
  { name: 'Sunflower', code: 'MP 201', color: '#FFD23F', family: 'Yellows & Golds' },
  { name: 'Neem Leaf', code: 'MP 298', color: '#5B8A3A', family: 'Fresh Greens' },
  { name: 'Mint Fresh', code: 'MP 302', color: '#8FD4A0', family: 'Fresh Greens' },
  { name: 'Bottle Green', code: 'MP 306', color: '#1F5C2E', family: 'Fresh Greens' },
  { name: 'Olive Branch', code: 'MP 309', color: '#6B8E4E', family: 'Fresh Greens' },
  { name: 'Basil', code: 'MP 311', color: '#4C7A3D', family: 'Fresh Greens' },
  { name: 'Pista Green', code: 'MP 314', color: '#A8C97F', family: 'Fresh Greens' },
  { name: 'Forest Canopy', code: 'MP 317', color: '#2E5233', family: 'Fresh Greens' },
  { name: 'Lime Twist', code: 'MP 319', color: '#B7D96A', family: 'Fresh Greens' },
  { name: 'Sage Whisper', code: 'MP 322', color: '#B4C7A9', family: 'Fresh Greens' },
  { name: 'Peacock Teal', code: 'MP 331', color: '#0E6E5D', family: 'Blues & Teals' },
  { name: 'Dusk Indigo', code: 'MP 452', color: '#3A3179', family: 'Blues & Teals' },
  { name: 'Sky Blue', code: 'MP 336', color: '#6EC1E4', family: 'Blues & Teals' },
  { name: 'Cobalt Blue', code: 'MP 339', color: '#1E5FA8', family: 'Blues & Teals' },
  { name: 'Navy Depth', code: 'MP 341', color: '#12294B', family: 'Blues & Teals' },
  { name: 'Turquoise Bay', code: 'MP 344', color: '#1FA6A0', family: 'Blues & Teals' },
  { name: 'Steel Blue', code: 'MP 347', color: '#4A7A96', family: 'Blues & Teals' },
  { name: 'Powder Blue', code: 'MP 349', color: '#C7E4F0', family: 'Blues & Teals' },
  { name: 'Aqua Mist', code: 'MP 351', color: '#A9DDD6', family: 'Blues & Teals' },
  { name: 'Denim Wash', code: 'MP 354', color: '#45607D', family: 'Blues & Teals' },
  { name: 'Blush Rose', code: 'MP 402', color: '#E8A0BA', family: 'Pinks & Purples' },
  { name: 'Fuchsia Pop', code: 'MP 404', color: '#E91E63', family: 'Pinks & Purples' },
  { name: 'Mauve Dream', code: 'MP 407', color: '#9C6B8E', family: 'Pinks & Purples' },
  { name: 'Lavender Fields', code: 'MP 409', color: '#B497D6', family: 'Pinks & Purples' },
  { name: 'Orchid Bloom', code: 'MP 412', color: '#A64CA6', family: 'Pinks & Purples' },
  { name: 'Wine Berry', code: 'MP 415', color: '#7A2048', family: 'Pinks & Purples' },
  { name: 'Dusty Plum', code: 'MP 417', color: '#6D4C6B', family: 'Pinks & Purples' },
  { name: 'Candy Pink', code: 'MP 419', color: '#F48FB1', family: 'Pinks & Purples' },
  { name: 'Royal Violet', code: 'MP 421', color: '#5E3B8C', family: 'Pinks & Purples' },
  { name: 'Chai Latte', code: 'MP 019', color: '#C9A27A', family: 'Neutrals & Greys' },
  { name: 'Monsoon Grey', code: 'MP 507', color: '#7C8790', family: 'Neutrals & Greys' },
  { name: 'Coffee Bean', code: 'MP 511', color: '#4E342E', family: 'Neutrals & Greys' },
  { name: 'Sandstone', code: 'MP 514', color: '#D8C4A0', family: 'Neutrals & Greys' },
  { name: 'Charcoal Slate', code: 'MP 517', color: '#3A3A3C', family: 'Neutrals & Greys' },
  { name: 'Warm Taupe', code: 'MP 519', color: '#A98F76', family: 'Neutrals & Greys' },
  { name: 'Dove Grey', code: 'MP 522', color: '#B7B7B2', family: 'Neutrals & Greys' },
  { name: 'Ivory Cream', code: 'MP 524', color: '#F1E9DA', family: 'Neutrals & Greys' },
  { name: 'Pure White', code: 'MP 526', color: '#FAFAF7', family: 'Neutrals & Greys' },
  { name: 'Graphite', code: 'MP 529', color: '#55565B', family: 'Neutrals & Greys' },
]

const hex = (h, s, l) => {
  const { r, g, b } = hslToRgb(h, s, l)
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

const HUES = [
  ['Reds', 0], ['Terracottas', 14], ['Oranges', 26], ['Golds', 40], ['Yellows', 52], ['Limes', 78],
  ['Greens', 118], ['Mints', 150], ['Teals', 175], ['Aquas', 190], ['Sky Blues', 204], ['Blues', 222],
  ['Indigos', 244], ['Violets', 268], ['Purples', 288], ['Magentas', 316], ['Pinks', 338], ['Roses', 350],
]
const DEPTH = [['Whisper', 0.92], ['Mist', 0.85], ['Soft', 0.76], ['Light', 0.67], ['Classic', 0.58], ['Bold', 0.49], ['Deep', 0.39], ['Shadow', 0.29]]
const INTENSITY = [['Ash', 0.10], ['Dusty', 0.20], ['Muted', 0.32], ['Soft', 0.44], ['Clear', 0.56], ['Vivid', 0.68], ['Electric', 0.80]]

const DEPTH_IDEAL = 4
const INTENSITY_IDEAL = 5
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
export const ALL_SHADES = (curated = SHADES) => [...curated.map((c) => ({ ...c, family: SIGNATURE_LABEL })), ...generated]
export const FAMILY_LIST = [SIGNATURE_LABEL, ...HUES.map((h) => h[0]), 'Neutrals']

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