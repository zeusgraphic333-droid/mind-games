// Riso inks per district for the illustrated experience: [fill ink, text-safe ink on paper].
// (The immersive experience keeps the glowing colours in zones.js.)
export const RISO = {
  mind: ['#2F47E8', '#2F47E8'],
  shape: ['#FF6A3D', '#D23F18'],
  space: ['#00A6A1', '#00746F'],
  color: ['#FF4DAA', '#C8197A'],
  type: ['#FFE24A', '#8A6A00'],
  express: ['#121535', '#121535'],
  gestalt: ['#6B4CFF', '#4E31E0'],
  boss: ['#EE3440', '#C21F2C'],
  old: ['#16A05D', '#0E7A45']
};
export const riso = id => RISO[id] || RISO.mind;
