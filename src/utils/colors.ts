export const MEMO_COLORS = [
  '#FFE4E1', // Light Pink
  '#E1F5FE', // Light Blue
  '#F3E5F5', // Light Purple
  '#E8F5E8', // Light Green
  '#FFF3E0', // Light Orange
  '#F5F5F5', // Light Gray
  '#FFECB3', // Light Yellow
  '#E0F2F1', // Light Teal
];

export const getRandomColor = () => {
  return MEMO_COLORS[Math.floor(Math.random() * MEMO_COLORS.length)];
};

export const getContrastColor = (backgroundColor: string) => {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};
