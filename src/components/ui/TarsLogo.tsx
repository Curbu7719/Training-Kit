import React from 'react';

/**
 * TARS wordmark / logo — self-contained React components (red-lit brand).
 *
 *   <TarsWordmark theme="light" size={64} />            // grooved slab
 *   <TarsLockup   theme="dark"  size={56} />            // 3-bar icon + wordmark
 *
 * props (both):
 *   theme:       "light" (dark ink, for white bg) | "dark" (light ink, for dark bg)
 *   size:        number px — the wordmark cap height; everything scales from this
 *   tagline:     line under the mark, or null/"" to hide. default "SDLC AI PLATFORM"
 *   style:       extra style on the wrapper
 * TarsLockup also:
 *   subtagline:  second line under the tagline. default "Training Suite"
 *   underline:   red power-strip under the wordmark. default true
 *
 * Fonts (Chakra Petch + JetBrains Mono) load from Google Fonts on first mount.
 */

const ACCENT = '#e60000'; // Vodafone red

function ensureFonts(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('tars-fonts')) return;
  const l = document.createElement('link');
  l.id = 'tars-fonts';
  l.rel = 'stylesheet';
  l.href =
    'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';
  document.head.appendChild(l);
}

interface TaglineProps {
  text?: string | null;
  size: number;
  dark: boolean;
}

function Tagline({ text, size, dark }: TaglineProps): React.ReactElement | null {
  if (!text) return null;
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size * 0.19,
        letterSpacing: '0.34em',
        color: dark ? '#8b9698' : '#7a8284',
        paddingLeft: '0.34em',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

export interface TarsWordmarkProps {
  theme?: 'light' | 'dark';
  size?: number;
  tagline?: string | null;
  style?: React.CSSProperties;
}

/* ---- grooved slab wordmark ---- */
export function TarsWordmark({
  theme = 'light',
  size = 64,
  tagline = 'SDLC AI PLATFORM',
  style,
}: TarsWordmarkProps): React.ReactElement {
  React.useEffect(ensureFonts, []);
  const dark = theme === 'dark';
  const grad = dark
    ? 'repeating-linear-gradient(180deg,#e8ecec 0 0.085em,#a9b1b2 0.085em 0.125em)'
    : 'repeating-linear-gradient(180deg,#242a2c 0 0.10em,#0d0f10 0.10em 0.135em)';
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.2em',
        fontFamily: "'Chakra Petch', sans-serif",
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.03em', fontSize: size }}>
        <span
          style={{
            fontWeight: 700,
            letterSpacing: '0.015em',
            lineHeight: 0.9,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            backgroundImage: grad,
          }}
        >
          TARS
        </span>
        <span
          style={{
            width: '0.16em',
            height: '0.16em',
            borderRadius: '0.045em',
            background: ACCENT,
            boxShadow: `0 0 0.16em ${ACCENT}99`,
            marginBottom: '0.17em',
          }}
        />
      </div>
      <Tagline text={tagline} size={size} dark={dark} />
    </div>
  );
}

/* ---- mini monolith glyph (3 bars, center red light) ---- */
function MonolithMark({ size }: { size: number }): React.ReactElement {
  const bar = 'linear-gradient(180deg,#3b4245,#20262a)';
  const barDark = 'linear-gradient(180deg,#454d50,#22282b)';
  return (
    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '0.045em', height: '1em', fontSize: size }}>
      <span style={{ width: '0.23em', height: '0.8em', background: bar, borderRadius: '0.045em' }} />
      <span
        style={{
          position: 'relative',
          width: '0.26em',
          height: '1em',
          background: barDark,
          borderRadius: '0.045em',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '0.12em',
        }}
      >
        <span
          style={{
            width: '0.15em',
            height: '0.18em',
            borderRadius: '0.03em',
            background: ACCENT,
            boxShadow: `0 0 0.12em ${ACCENT}`,
          }}
        />
      </span>
      <span style={{ width: '0.23em', height: '0.8em', background: bar, borderRadius: '0.045em' }} />
    </span>
  );
}

export interface TarsLockupProps {
  theme?: 'light' | 'dark';
  size?: number;
  tagline?: string | null;
  subtagline?: string | null;
  underline?: boolean;
  style?: React.CSSProperties;
}

/* ---- icon lockup: 3-bar mark + TARS + red underline + taglines ---- */
export function TarsLockup({
  theme = 'light',
  size = 64,
  tagline = 'SDLC AI PLATFORM',
  subtagline = 'Training Suite',
  underline = true,
  style,
}: TarsLockupProps): React.ReactElement {
  React.useEffect(ensureFonts, []);
  const dark = theme === 'dark';
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.2em',
        fontFamily: "'Chakra Petch', sans-serif",
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25em', fontSize: size }}>
        <MonolithMark size={size} />
        <span style={{ fontWeight: 700, letterSpacing: '0.015em', lineHeight: 0.9, color: dark ? '#eef1f1' : '#14181a' }}>
          TARS
        </span>
      </div>
      {underline && (
        <span
          style={{
            width: '3.35em',
            height: '0.08em',
            borderRadius: '0.05em',
            background: ACCENT,
            boxShadow: `0 0 0.16em ${ACCENT}99`,
            fontSize: size,
          }}
        />
      )}
      <Tagline text={tagline} size={size} dark={dark} />
      {subtagline ? (
        <span
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: size * 0.2,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          {subtagline}
        </span>
      ) : null}
    </div>
  );
}

export default { TarsWordmark, TarsLockup };
