const presetOptions = [
  {
    id: 'full-library',
    label: 'Full Library',
    description: 'All available components',
    components: ['Button', 'Card', 'Badge', 'Input', 'Modal', 'Textarea'],
  },
  {
    id: 'core',
    label: 'Core',
    description: 'Essential components',
    components: ['Button', 'Input', 'Card'],
  },
];

const componentOptions = [
  { id: 'Button', label: 'Button' },
  { id: 'Card', label: 'Card' },
  { id: 'Badge', label: 'Badge' },
  { id: 'Input', label: 'Input' },
  { id: 'Textarea', label: 'Textarea' },
  { id: 'Modal', label: 'Modal' },
];

const colorOptions = [
  { id: 'blue', label: 'Blue' },
  { id: 'emerald', label: 'Green' },
  { id: 'violet', label: 'Purple' },
  { id: 'rose', label: 'Pink' },
];

export { presetOptions, componentOptions, colorOptions };