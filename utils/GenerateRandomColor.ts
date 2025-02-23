export function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export function generateRedOrangeHexColor() {
  // Red: High R, lower G and B (e.g., #FF****)
  // Orange: High R and G, lower B (e.g., #FFA500)
  const r = 129; // Always max red
  const g = Math.floor(Math.random() * 128); // Random green (0 to 127)
  const b = Math.floor(Math.random() * 64);  // Random blue (0 to 63)

  // Convert RGB to hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
