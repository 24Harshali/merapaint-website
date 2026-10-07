// --- colour maths: replicate the canvas "hue" blend mode by hand, per-pixel,
// so we can restrict it to a selected mask instead of the whole photo ---
export function hexToRgb(hex) {
  const v = hex.replace('#', '')
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  }
}
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r: h = ((g - b) / d) % 6; break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s, l }
}
export function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
}

// Flood-fill from the clicked pixel across similar colours (a "magic wand"
// wall selector), returning a 1-per-pixel mask of the selected region.
export function floodFillMask(data, width, height, startX, startY, tolerance = 34) {
  const mask = new Uint8Array(width * height)
  const visited = new Uint8Array(width * height)
  const startIdx = (startY * width + startX) * 4
  const sr = data[startIdx], sg = data[startIdx + 1], sb = data[startIdx + 2]
  const tol2 = tolerance * tolerance * 3
  const stack = [startY * width + startX]
  visited[startY * width + startX] = 1
  while (stack.length) {
    const p = stack.pop()
    const px = p % width, py = (p / width) | 0
    const idx = p * 4
    const dr = data[idx] - sr, dg = data[idx + 1] - sg, db = data[idx + 2] - sb
    if (dr * dr + dg * dg + db * db > tol2) continue
    mask[p] = 1
    const neighbours = []
    if (px > 0) neighbours.push(p - 1)
    if (px < width - 1) neighbours.push(p + 1)
    if (py > 0) neighbours.push(p - width)
    if (py < height - 1) neighbours.push(p + width)
    for (const n of neighbours) {
      if (!visited[n]) { visited[n] = 1; stack.push(n) }
    }
  }
  return mask
}

// Adds a deterministic per-pixel grain/sheen delta so each finish reads
// differently on the same wall — same trick real texture-preview tools use.
export function hashNoise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}
export function finishDelta(x, y, finish) {
  switch (finish) {
    case 'sand':
      return (hashNoise(x, y) - 0.5) * 0.14
    case 'stucco': {
      const nx = Math.floor(x / 6), ny = Math.floor(y / 6)
      return (hashNoise(nx, ny) - 0.5) * 0.24
    }
    case 'suede':
      return (hashNoise(x, y) - 0.5) * 0.07
    case 'roller':
      return Math.sin(x * 0.6) * 0.05 + (hashNoise(x, y) - 0.5) * 0.04
    case 'satin':
      return Math.sin((x + y) * 0.01) * 0.045
    case 'silk':
      return Math.sin((x + y) * 0.018) * 0.07
    case 'semigloss':
      return Math.sin((x + y) * 0.022) * 0.11
    case 'highgloss':
      return Math.sin((x - y) * 0.05) * 0.2 + Math.sin((x + y) * 0.1) * 0.08
    case 'metallic':
      return Math.sin((x - y) * 0.045) * 0.14 + Math.sin((x + y) * 0.12) * 0.05
    case 'pearl': {
      const sparkle = hashNoise(x, y) > 0.965 ? 0.35 : 0
      return Math.sin((x + y) * 0.02) * 0.05 + sparkle
    }
    case 'concrete':
      return (hashNoise(Math.floor(x/2),Math.floor(y/2))-0.5)*0.16+(hashNoise(Math.floor(x/9),Math.floor(y/9))-0.5)*0.12
    case 'limewash':
      return (hashNoise(Math.floor(x/22),Math.floor(y/22))-0.5)*0.16+(hashNoise(Math.floor(x/7),Math.floor(y/7))-0.5)*0.05
    default:
      return 0
  }
}

// Repaint only the masked pixels. Blend most of the way to the chosen
// shade's own lightness/vibrancy (rather than leaving the photo's original
// brightness almost untouched) so the result reads as that actual paint
// colour, while still keeping a little of the original shadow/highlight
// and texture so it looks like a real coat on the wall, not a flat sticker.
export function paintMasked(baseData, mask, width, height, hex, finish = 'matte') {
  const out = new Uint8ClampedArray(baseData)
  const target = hexToRgb(hex)
  const { h: targetH, s: targetS, l: targetL } = rgbToHsl(target.r, target.g, target.b)
  const shiny = finish === 'metallic' || finish === 'highgloss' || finish === 'pearl'
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p]) continue
    const idx = p * 4
    const x = p % width, y = (p / width) | 0
    const { s, l } = rgbToHsl(out[idx], out[idx + 1], out[idx + 2])
    let boostedS = Math.max(targetS, s, 0.55)
    if (shiny) boostedS = Math.min(1, boostedS * 1.18)
    // Keep only a light touch (18%) of the original pixel's brightness for
    // shading, so the shade itself dominates instead of looking washed out.
    const blendedL = l * 0.18 + targetL * 0.82
    const newL = Math.min(0.94, Math.max(0.05, blendedL + finishDelta(x, y, finish)))
    const rgb = hslToRgb(targetH, boostedS, newL)
    out[idx] = rgb.r; out[idx + 1] = rgb.g; out[idx + 2] = rgb.b
  }
  return out
}

