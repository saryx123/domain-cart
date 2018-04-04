module.exports = {
  parsePrice
}

function parsePrice (value) {
  value = String(value || '')
  if (!/[0-9]/.test(value.charAt(0))) {
    value = value.substring(1)
  }
  value = Math.floor(parseFloat(value) * 100)
  return value || 0
}
