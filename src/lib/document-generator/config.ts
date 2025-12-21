/**
 * Protectron Document Generator Configuration
 * 
 * Brand colors and styling configuration for all generated documents.
 * Based on Protectron's design system.
 */

import { BorderStyle, ShadingType } from "docx";

/**
 * Protectron Brand Colors (hex without #)
 * Derived from the app's theme.css
 */
export const COLORS = {
  // Primary brand colors (purple)
  primary: "7F56D9",      // brand-600 - Main brand color
  secondary: "9E77ED",    // brand-500 - Secondary brand color
  dark: "53389E",         // brand-800 - Dark variant (footer, headers)
  light: "F9F5FF",        // brand-50 - Light variant (alternating rows)
  
  // Neutral colors
  white: "FFFFFF",
  black: "000000",
  gray: "667085",         // gray-500
  lightGray: "E4E7EC",    // gray-200
  darkGray: "344054",     // gray-700
  
  // Status colors
  success: "17B26A",      // success-600
  error: "F04438",        // error-600
  warning: "F79009",      // warning-600
  
  // Additional
  brand25: "FCFAFF",      // brand-25 - Very light background
  brand100: "F4EBFF",     // brand-100
  brand200: "E9D7FE",     // brand-200
  brand700: "6941C6",     // brand-700
  brand900: "42307D",     // brand-900
};

/**
 * Company Information
 */
export const COMPANY = {
  name: "Protectron Inc.",
  tagline: "EU AI Act Compliance Platform",
  website: "https://protectron.ai",
};

/**
 * Table border styling
 */
export const tableBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: COLORS.lightGray,
};

export const cellBorders = {
  top: tableBorder,
  bottom: tableBorder,
  left: tableBorder,
  right: tableBorder,
};

/**
 * Shading presets for tables
 */
export const headerShading = {
  fill: COLORS.primary,
  type: ShadingType.CLEAR,
};

export const altRowShading = {
  fill: COLORS.light,
  type: ShadingType.CLEAR,
};

/**
 * Page measurements (in twips - 1 inch = 1440 twips)
 */
export const PAGE = {
  margin: {
    top: 1440,    // 1 inch
    right: 1440,
    bottom: 1440,
    left: 1440,
  },
  width: 12240,   // Letter width
  usableWidth: 9360, // With 1" margins
};

/**
 * Font sizes (in half-points)
 */
export const FONT_SIZES = {
  body: 22,       // 11pt
  small: 20,      // 10pt
  heading1: 32,   // 16pt
  heading2: 26,   // 13pt
  heading3: 24,   // 12pt
  title: 48,      // 24pt
  subtitle: 28,   // 14pt
};

/**
 * Column width presets (in twips)
 */
export const COLUMN_WIDTHS = {
  twoColumn: {
    narrow: 2808,  // 30%
    wide: 6552,    // 70%
  },
  threeColumn: {
    equal: 3120,   // 33.3%
  },
  fourColumn: {
    equal: 2340,   // 25%
  },
};
