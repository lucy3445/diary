import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const ic = (children: React.ReactNode, size: number, color: string, sw: number) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </Svg>
);

export const IcHome = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9" />, size, color, strokeWidth);

export const IcCheck = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Path d="M3.5 11.5 4 18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2l.5-6.5"/>
    <Path d="M2.5 8.5 12 3l9.5 5.5L12 14 2.5 8.5Z"/>
  </>, size, color, strokeWidth);

export const IcBook = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15.5H5.5A1.5 1.5 0 0 1 4 18V5.5Z"/>
    <Path d="M20 5.5C20 4.7 19.3 4 18.5 4H13v15.5h5.5A1.5 1.5 0 0 0 20 18V5.5Z"/>
  </>, size, color, strokeWidth);

export const IcMic = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Rect x="9" y="2.5" width="6" height="11" rx="3" stroke={color} strokeWidth={strokeWidth} fill="none"/>
    <Path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>
  </>, size, color, strokeWidth);

export const IcClose = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M6 6l12 12M18 6 6 18" />, size, color, strokeWidth);

export const IcChevR = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M9 5l7 7-7 7" />, size, color, strokeWidth);

export const IcChevL = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M15 5l-7 7 7 7" />, size, color, strokeWidth);

export const IcPlus = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M12 5v14M5 12h14" />, size, color, strokeWidth);

export const IcSpark = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>
    <Path d="M12 7.5 13.4 10.6 16.5 12 13.4 13.4 12 16.5 10.6 13.4 7.5 12 10.6 10.6 12 7.5Z"/>
  </>, size, color, strokeWidth);

export const IcSeed = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Path d="M12 21c-4-1-7-4.5-7-9 4 0 7 3 7 7"/>
    <Path d="M12 21c4-1 7-4.5 7-9-4 0-7 3-7 7"/>
    <Path d="M12 21v-7"/>
  </>, size, color, strokeWidth);

export const IcLeaf = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Path d="M20 4C9 4 4 9.5 4 16c0 1.6.4 3 .4 3s7.6.6 12.2-4S20 4 20 4Z"/>
    <Path d="M4.5 19.5C8 14 11 11.5 16 9"/>
  </>, size, color, strokeWidth);

export const IcTool = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M14.7 6.3a3.5 3.5 0 0 0-4.6 4.6l-6.1 6.1a1.5 1.5 0 0 0 0 2.1l.9.9a1.5 1.5 0 0 0 2.1 0l6.1-6.1a3.5 3.5 0 0 0 4.6-4.6l-2.3 2.3-2-2 2.3-2.3Z"/>, size, color, strokeWidth);

export const IcHeart = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M12 20s-7-4.3-9.2-8.3C1.2 8.5 2.8 5 6.3 5c2 0 3.2 1.3 3.7 2.3C10.5 6.3 11.7 5 13.7 5c3.5 0 5.1 3.5 3.5 6.7C19 15.7 12 20 12 20Z" />, size, color, strokeWidth);

export const IcCal = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke={color} strokeWidth={strokeWidth} fill="none"/>
    <Path d="M3.5 9.5h17M8 3v3M16 3v3"/>
  </>, size, color, strokeWidth);

export const IcArrowU = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M12 19V5M6 11l6-6 6 6" />, size, color, strokeWidth);

export const IcSun = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={strokeWidth} fill="none"/>
    <Path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>
  </>, size, color, strokeWidth);

export const IcMoon = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />, size, color, strokeWidth);

export const IcFlame = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M12 3c.5 3-2 4-2 6.5a2 2 0 0 0 4 0c0-.6-.2-1 0-1.5 1.5 1 3 3 3 5.5a5 5 0 0 1-10 0C7 9.5 11 7 12 3Z"/>, size, color, strokeWidth);

export const IcQuote = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<Path d="M9 7H5.5A1.5 1.5 0 0 0 4 8.5V12a1.5 1.5 0 0 0 1.5 1.5H8V16a3 3 0 0 1-3 3M19 7h-3.5A1.5 1.5 0 0 0 14 8.5V12a1.5 1.5 0 0 0 1.5 1.5H18V16a3 3 0 0 1-3 3"/>, size, color, strokeWidth);

export const IcKeyb = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: IconProps) =>
  ic(<>
    <Rect x="3" y="6" width="18" height="12" rx="2.5" stroke={color} strokeWidth={strokeWidth} fill="none"/>
    <Path d="M7 10h.01M11 10h.01M15 10h.01M9 14h6"/>
  </>, size, color, strokeWidth);
