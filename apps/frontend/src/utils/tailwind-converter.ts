import { twj } from 'tw-to-css';

export const convertCodeToInline = (code: string): string => {
  return code.replace(/className=["']([^"']+)["']/g, (match, classes) => {
    try {
      // Use twj to get JSON object instead of CSS string
      const styleObject = twj(classes);
      
      // Convert to inline style format
      const styleString = Object.entries(styleObject)
        .map(([key, value]) => `${key}: '${value}'`)
        .join(', ');
      
      return `style={{${styleString}}}`;
    } catch (error) {
      console.warn('Failed to convert Tailwind classes:', classes, error);
      return match;
    }
  });
};