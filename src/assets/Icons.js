// src/assets/Icons.jsx
import React from 'react';
import Svg, { Line, Path, Rect, Circle, G, Polyline } from 'react-native-svg';

// -------- Home Icon --------
export const HomeIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const CheckIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13l4 4L19 7"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const DashedBorder = ({ width = 24, height = 24, color = 'black', strokeWidth = 2 }) => (
  <Svg height="1" width="100%">
    <Line
      x1="0"
      y1="0"
      x2="100%"
      y2="0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray="4 4"
    />
  </Svg>
);
export const CrossIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6l12 12M18 6L6 18"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const InfoIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 8h.01M11 12h1v4h1"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);
// -------- Login History Icon --------
export const LoginHistoryIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Clock circle */}
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Clock hands */}
    <Path
      d="M12 7v5l3 3"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Circular arrow to indicate history */}
    <Path
      d="M16.5 3.5a9 9 0 1 0 0 17"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 3v4h-4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const UserIcon = ({ width = 26, height = 26, color = '#4f46e5' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Head */}
    <Path
      d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
      fill={color}
    />

    {/* Body */}
    <Path
      d="M4 19.5C4 16.4624 7.13401 14.5 12 14.5C16.866 14.5 20 16.4624 20 19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z"
      fill={color}
    />

  </Svg>
);







// -------- Profile Icon --------
export const ProfileIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Head */}
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.5} />
    {/* Body */}
    <Path
      d="M4 21c0-4 4-7 8-7s8 3 8 7"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// -------- Logout Icon --------
export const LogoutIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    {/* Arrow */}
    <Path
      d="M17 16l4-4m0 0l-4-4m4 4H7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Door / Box */}
    <Path
      d="M13 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


// -------- Menu / Hamburger Icon --------
export const MenuIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1="3"
      y1="12"
      x2="15"
      y2="12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
// -------- Hamburger / Menu Icon --------
export const HamburgerIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6H20M4 12H20M4 18H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
// -------- Back / ArrowLeft Icon --------
export const BackIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// -------- Upload Icon --------
export const UploadIcon = ({ width = 24, height = 24, color = themes.purple }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3V15M12 3L8 7M12 3L16 7M4 17H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
// -------- Attach Icon (IoIosAttach) --------
export const AttachIcon = ({ width = 28, height = 28, color = themes.purple }) => (
  <Svg width={width} height={height} viewBox="0 0 512 512" fill="none">
    <Path
      d="M279.4 144.6L136.1 287.9c-28.3 28.3-28.3 74.3 0 102.6s74.3 28.3 102.6 0l144.8-144.8c19.5-19.5 19.5-51.1 0-70.6-19.5-19.5-51.1-19.5-70.6 0L172.1 334.1c-10.2 10.2-10.2 26.7 0 36.9s26.7 10.2 36.9 0l137.7-137.7"
      stroke={color}
      strokeWidth={32}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// -------- Attachment Remove Icon --------
export const AttachmentRemoveIcon = ({
  width = 28,
  height = 28,
  color = "red",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Outer Circle */}
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="1.8"
    />

    {/* Cross Line 1 */}
    <Path
      d="M8.5 8.5L15.5 15.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Cross Line 2 */}
    <Path
      d="M15.5 8.5L8.5 15.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />

  </Svg>
);
// -------- Forward / ArrowLeft Icon --------
export const ForwardIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18l6-6-6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// -------- Search Icon --------
export const SearchIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.5817 15.4183 3 11 3C6.5817 3 3 6.5817 3 11C3 15.4183 6.5817 19 11 19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// -------- Add / Plus Icon --------
export const AddIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 12H19" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// -------- Close Icon --------
export const CloseIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6L18 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 6L6 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
// -------- Edit / Pencil Icon --------
export const EditIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M12 20H21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43744 20.1213 5C20.1213 5.56256 19.8978 6.10218 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// -------- Delete / Trash Icon --------
export const DeleteIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6M9 10V17M15 10V17M10 6V4C10 3.44772 10.4477 3 11 3H13C13.5523 3 14 3.44772 14 4V6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// -------- Settings / Gear Icon --------
export const SettingsIcon = ({
  width = 24,
  height = 24,
  color = "black",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Outer gear shape */}
    <Path
      d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Gear teeth */}
    <Path
      d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 0 1 7.6 4.4l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const DashboardIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Top-left square */}
    <Path
      d="M4 4H10V10H4V4Z"
      fill={color}
    />
    {/* Top-right square */}
    <Path
      d="M14 4H20V10H14V4Z"
      fill={color}
    />
    {/* Bottom-left rectangle */}
    <Path
      d="M4 14H10V20H4V14Z"
      fill={color}
    />
    {/* Bottom-right rectangle */}
    <Path
      d="M14 14H20V20H14V14Z"
      fill={color}
    />
  </Svg>
);
export const FingerprintIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Fingerprint ridges paths */}
    <Path
      d="M12 2C9.24 2 7 4.24 7 7V8M17 7C17 4.24 14.76 2 12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 10V14M8 12V10M16 12V10M12 18V22M8 20V18M16 20V18M12 6C11.45 6 11 6.45 11 7V9C11 9.55 11.45 10 12 10M12 10C12.55 10 13 9.55 13 9V7C13 6.45 12.55 6 12 6Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.12 15.55C19.7 14.5 20 13.3 20 12M4.88 15.55C4.3 14.5 4 13.3 4 12M12 16C13.66 16 15 14.66 15 13V11M12 16C10.34 16 9 14.66 9 13V11M12 12C11.45 12 11 11.55 11 11M12 12C12.55 12 13 11.55 13 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const HouseIcon = ({ width = 24, height = 24, color = 'black', otherColor = "#fff" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Roof */}
    <Path
      d="M2.5 10.5L12 3L21.5 10.5V20C21.5 20.8284 20.8284 21.5 20 21.5H4C3.17157 21.5 2.5 20.8284 2.5 20V10.5Z"
      fill={color}
    />

    {/* Door cut */}
    <Path
      d="M10 21.5V14C10 13.4477 10.4477 13 11 13H13C13.5523 13 14 13.4477 14 14V21.5"
      fill={otherColor}
      opacity={0.9}
    />

  </Svg>
);
export const AttendanceIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Clipboard / calendar */}
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />

    {/* Top header (clipboard top) */}
    <Rect
      x="3"
      y="3"
      width="18"
      height="4"
      rx="1"
      fill={color}
    />

    {/* Checkmark */}
    <Polyline
      points="7,12 10,15 17,8"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

  </Svg>
);
export const ChangePasswordIcon = ({
  width = 24,
  height = 24,
  color = "black",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Lock body */}
    <Path
      d="M7 11V9a5 5 0 0 1 10 0v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Lock box */}
    <Path
      d="M6 11h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Key / change arrow */}
    <Path
      d="M16 15l3 3m0 0l-3 3m3-3H12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Key dot */}
    <Circle
      cx="12"
      cy="16"
      r="1"
      fill={color}
    />
  </Svg>
);
export const CheckInIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Box */}
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />

    {/* Arrow (pointing inside →) */}
    <Polyline
      points="10,8 14,12 10,16"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Line
      x1="5"
      y1="12"
      x2="14"
      y2="12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

  </Svg>
);
export const HomeworkIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Paper / notebook */}
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />

    {/* Horizontal lines inside paper */}
    <Line x1="6" y1="8" x2="18" y2="8" stroke={color} strokeWidth={1.5} />
    <Line x1="6" y1="12" x2="18" y2="12" stroke={color} strokeWidth={1.5} />
    <Line x1="6" y1="16" x2="14" y2="16" stroke={color} strokeWidth={1.5} />

    {/* Pencil on top right */}
    <Path
      d="M15 3L21 9L17 13L11 7L15 3Z"
      fill={color}
    />

  </Svg>
);
// -------- Lock Icon --------
export const LockIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Lock Body */}
    <Path
      d="M5 11.5C5 10.12 6.12 9 7.5 9H16.5C17.88 9 19 10.12 19 11.5V18.5C19 19.88 17.88 21 16.5 21H7.5C6.12 21 5 19.88 5 18.5V11.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Lock Shackle */}
    <Path
      d="M8 9V6.5C8 4.57 9.57 3 11.5 3H12.5C14.43 3 16 4.57 16 6.5V9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Key Hole */}
    <Path
      d="M12 14.5V16.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// -------- Eye Icon (Show Password) --------
export const EyeIcon = ({ width = 24, height = 24, color = 'black', stroke = 2 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
// -------- File Icon --------

export const FileIcon = ({ type = 'default', width = 24, height = 24, color = 'black' }) => {
  // Assign color based on type
  let fillColor = color;
  switch (type) {
    case 'pdf':
      fillColor = '#E53E3E'; // red
      break;
    case 'image':
      fillColor = '#ED8936'; // orange
      break;
    case 'word':
      fillColor = '#2B579A'; // blue
      break;
    case 'excel':
      fillColor = '#217346'; // green
      break;
    case 'ppt':
      fillColor = '#D24726'; // orange-red
      break;
    case 'txt':
      fillColor = '#555555'; // gray
      break;
    default:
      fillColor = '#888888'; // generic gray
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      {/* File outline */}
      <Path
        d="M6 2H14L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z"
        stroke={fillColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Folded corner */}
      <Path
        d="M14 2V8H20"
        stroke={fillColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Optional type text inside file */}
      {type === 'pdf' && (
        <Path
          d="M8 16H16"
          stroke={fillColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};


// -------- Calendar Icon --------
export const CalendarIcon = ({ width = 24, height = 24, color = 'black', strokeWidth = 3 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Calendar body */}
    <Rect
      x="3"
      y="5"
      width={width}
      height={height}
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Top rings / date lines */}
    <Line x1="16" y1="3" x2="16" y2="7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Optional grid lines for dates */}
    <Line x1="3" y1="11" x2="21" y2="11" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// 🕒 Leave Icon (Clock)
export const LeaveIcon = ({ width = 24, height = 24, color = 'orange', strokeWidth = 2 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
// -------- Calendar Icon --------
export const CalendarIcon1 = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    {/* Calendar body */}
    <Rect
      x={3}
      y={5}
      width={18}
      height={16}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    {/* Calendar header lines */}
    <Line x1={3} y1={9} x2={21} y2={9} stroke={color} strokeWidth={2} />
    {/* Calendar rings/loops */}
    <Line x1={8} y1={1} x2={8} y2={5} stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1={16} y1={1} x2={16} y2={5} stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
// -------- EyeOff Icon (Hide Password) --------
export const EyeOffIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94C16.28 19.09 14.21 19.84 12 19.84C5 19.84 1 12 1 12C2.315 9.995 4.14 8.33 6.3 7.17"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22.54 12C22.54 12 18.54 4 12 4C9.79 4 7.72 4.75 6.06 5.91"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1 1L23 23"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
// -------- Adjustments Icon (Filter) --------
export const AdjustmentsIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">

    {/* Top slider line */}
    <Path
      d="M4 7H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

    {/* Top knob */}
    <Circle
      cx="9"
      cy="7"
      r="2"
      fill={color}
    />

    {/* Middle slider line */}
    <Path
      d="M4 12H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

    {/* Middle knob */}
    <Circle
      cx="15"
      cy="12"
      r="2"
      fill={color}
    />

    {/* Bottom slider line */}
    <Path
      d="M4 17H20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />

    {/* Bottom knob */}
    <Circle
      cx="11"
      cy="17"
      r="2"
      fill={color}
    />
  </Svg>
);