export function generateFavicon(circleColor) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')
  const cx = 32, cy = 32

  // Circle
  ctx.beginPath()
  ctx.arc(cx, cy - 2, 26, 0, Math.PI * 2)
  ctx.fillStyle = circleColor
  ctx.fill()

  // "T" letter
  const textColor = circleColor === '#ffffff' ? '#000000' : '#ffffff'
  ctx.fillStyle = textColor
  const shrink = textColor === '#ffffff' ? 2 : 0
  const barW = 36 - shrink * 2
  const barH = 11 - shrink
  const stemW = 11 - shrink
  const startY = 17 + shrink / 2

  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(cx - barW / 2, startY, barW, barH, 2)
  } else {
    ctx.rect(cx - barW / 2, startY, barW, barH)
  }
  ctx.fill()

  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(cx - stemW / 2, startY + barH - 2, stemW, 36, 2)
  } else {
    ctx.rect(cx - stemW / 2, startY + barH - 2, stemW, 36)
  }
  ctx.fill()

  return canvas.toDataURL('image/png')
}
