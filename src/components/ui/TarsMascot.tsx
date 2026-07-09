import React from 'react';

/**
 * TARS mascot — self-contained, asset-free React component.
 *
 * A dark-gray monolith robot with a teal screen face, rendered entirely with
 * divs + CSS 3D transforms. No images, no external files. Drop it anywhere in
 * the app; pass `animated` for the walking/talking version or leave it static
 * ("just a picture") for calmer spots like the header.
 *
 * <TarsMascot expression="thinking" animated size={160} />
 */

export type TarsExpression =
  | 'idle'
  | 'thinking'
  | 'working'
  | 'success'
  | 'error'
  | 'talking';

export interface TarsMascotProps {
  /** Face + posture. Default "idle". */
  expression?: TarsExpression;
  /** Walking legs + animated face. Default true. */
  animated?: boolean;
  /** Square box size in px. Default 200. */
  size?: number;
  /** Extra style on the wrapper. */
  style?: React.CSSProperties;
  /** Extra class on the wrapper. */
  className?: string;
}

const h = React.createElement;

const KEYFRAMES = `
@keyframes tars-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes tars-sway{0%{transform:rotateX(-20deg) rotateY(-34deg)}100%{transform:rotateX(-20deg) rotateY(-22deg)}}
@keyframes tars-stepL{0%,100%{transform:translate(-50%,-50%) translateX(-60px) rotateX(0deg)}25%{transform:translate(-50%,-50%) translateX(-60px) rotateX(22deg)}75%{transform:translate(-50%,-50%) translateX(-60px) rotateX(-22deg)}}
@keyframes tars-stepR{0%,100%{transform:translate(-50%,-50%) translateX(60px) rotateX(0deg)}25%{transform:translate(-50%,-50%) translateX(60px) rotateX(-22deg)}75%{transform:translate(-50%,-50%) translateX(60px) rotateX(22deg)}}
@keyframes tars-dots{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
@keyframes tars-wave{0%,100%{transform:scaleY(.28)}50%{transform:scaleY(1)}}
@keyframes tars-scan{0%{left:-32%}100%{left:100%}}
@keyframes tars-blink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(.12)}}
@keyframes tars-prog{0%{width:16%}100%{width:86%}}
@keyframes tars-shadow{0%,100%{opacity:.42;transform:translateX(-50%) scale(1)}50%{opacity:.26;transform:translateX(-50%) scale(.85)}}
`;

function injectKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('tars-keyframes')) return;
  const el = document.createElement('style');
  el.id = 'tars-keyframes';
  el.textContent = KEYFRAMES;
  document.head.appendChild(el);
}

const G = { f: '#2a2f32', fL: '#3b4245', fD: '#191d1f', edge: '#454d50', gr: '#111416' };

interface BoxOpts {
  key?: React.Key;
  place?: string;
  origin?: string;
  animName?: string | null;
  front?: string;
  right?: string;
  top?: string;
  children?: React.ReactNode;
}

function box(w: number, hh: number, d: number, o: BoxOpts): React.ReactElement {
  const c = (t: string): string => `translate(-50%,-50%) ${t}`;
  const base: React.CSSProperties = { position: 'absolute', top: '50%', left: '50%', boxSizing: 'border-box' };
  const front = h('div', {
    key: 'fr',
    style: {
      ...base,
      width: w,
      height: hh,
      transform: c(`translateZ(${d / 2}px)`),
      background: o.front || G.f,
      border: `1px solid ${G.edge}`,
      overflow: 'hidden',
      boxShadow: 'inset 0 46px 44px -34px rgba(255,255,255,.09), inset 0 -34px 34px -22px rgba(0,0,0,.55)',
    },
  }, o.children || null);
  const right = h('div', {
    key: 'rt',
    style: {
      ...base,
      width: d,
      height: hh,
      transform: c(`rotateY(90deg) translateZ(${w / 2}px)`),
      background: o.right || G.fD,
      border: `1px solid ${G.edge}`,
      boxShadow: 'inset 0 0 40px rgba(0,0,0,.4)',
    },
  });
  const top = h('div', {
    key: 'tp',
    style: {
      ...base,
      width: w,
      height: d,
      transform: c(`rotateX(90deg) translateZ(${hh / 2}px)`),
      background: o.top || G.fL,
      border: `1px solid ${G.edge}`,
    },
  });
  return h('div', {
    key: o.key,
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: w,
      height: hh,
      transformStyle: 'preserve-3d',
      transformOrigin: o.origin || 'center',
      transform: `translate(-50%,-50%) ${o.place || ''}`,
      animation: o.animName ? `${o.animName} 1.5s ease-in-out infinite` : 'none',
    },
  }, [front, right, top]);
}

const powerStrip = (): React.ReactElement =>
  h('div', {
    key: 'pwr',
    style: {
      position: 'absolute',
      left: '50%',
      bottom: '7%',
      transform: 'translateX(-50%)',
      width: '42%',
      height: 4,
      borderRadius: 2,
      background: '#2de1c2',
      boxShadow: '0 0 9px #2de1c2cc',
    },
  });

const groove = (t: string): React.ReactElement =>
  h('div', {
    key: 'g' + t,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: t,
      height: 3,
      background: G.gr,
      boxShadow: '0 1px 0 rgba(255,255,255,.05)',
    },
  });

function screenLayer(
  faceEl: React.ReactNode,
  opts?: { extra?: React.ReactNode[]; top?: string },
): React.ReactElement {
  const o = opts || {};
  return h('div', { style: { position: 'absolute', inset: 0 } }, [
    ...(o.extra || []),
    h('div', {
      key: 'scr',
      style: { position: 'absolute', left: '50%', top: o.top || '46%', transform: 'translate(-50%,-50%)' },
    }, faceEl),
  ]);
}

function face(fw: number, fh: number, expr: TarsExpression, anim: boolean): React.ReactElement {
  const col = expr === 'error' ? '#ff5a52' : '#2de1c2';
  const glow = `0 0 8px ${col}bb`;
  const eyeRect = (k: string): React.ReactElement =>
    h('div', { key: k, style: { width: 14, height: 16, borderRadius: 4, background: col, boxShadow: glow } });
  const eyeBar = (k: string): React.ReactElement =>
    h('div', { key: k, style: { width: 14, height: 5, borderRadius: 3, background: col, boxShadow: glow } });
  const eyeHappy = (k: string): React.ReactElement =>
    h('div', { key: k, style: { width: 18, height: 9, borderBottom: `3px solid ${col}`, borderRadius: '0 0 18px 18px', filter: `drop-shadow(${glow})` } });
  const xbar = (r: number): React.ReactElement =>
    h('div', { key: 'x' + r, style: { position: 'absolute', top: '50%', left: '50%', width: 16, height: 3, borderRadius: 2, background: col, boxShadow: glow, transform: `translate(-50%,-50%) rotate(${r}deg)` } });
  const xeye = (k: string): React.ReactElement =>
    h('div', { key: k, style: { position: 'relative', width: 16, height: 16 } }, [xbar(45), xbar(-45)]);
  const dot = (i: number): React.ReactElement =>
    h('div', { key: 'd' + i, style: { width: 7, height: 7, borderRadius: '50%', background: col, boxShadow: glow, animation: anim ? `tars-dots 1.2s ${i * 0.2}s infinite` : 'none', opacity: anim ? undefined : 0.85 } });
  const wb = (i: number): React.ReactElement =>
    h('div', { key: 'w' + i, style: { width: 5, height: 22, borderRadius: 3, background: col, boxShadow: glow, transformOrigin: 'center', animation: anim ? `tars-wave .7s ${i * 0.1}s infinite ease-in-out` : 'none', transform: anim ? undefined : 'scaleY(.55)' } });
  const eyesRow = (kids: React.ReactNode[], blink: boolean): React.ReactElement =>
    h('div', { style: { display: 'flex', gap: fw * 0.2, animation: anim && blink ? 'tars-blink 4.4s infinite' : 'none', transformOrigin: 'center' } }, kids);
  const col2 = (kids: React.ReactNode[]): React.ReactElement =>
    h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 } }, kids);

  let content: React.ReactElement;
  const extra: React.ReactNode[] = [];
  if (expr === 'idle') {
    content = col2([
      eyesRow([eyeRect('l'), eyeRect('r')], true),
      h('div', { key: 'm', style: { width: fw * 0.26, height: 4, borderRadius: 3, background: col, boxShadow: glow } }),
    ]);
  } else if (expr === 'thinking') {
    content = col2([
      eyesRow([eyeBar('l'), eyeBar('r')], false),
      h('div', { key: 'dots', style: { display: 'flex', gap: 8 } }, [dot(0), dot(1), dot(2)]),
    ]);
  } else if (expr === 'working') {
    content = col2([
      eyesRow([eyeRect('l'), eyeRect('r')], true),
      h('div', { key: 'tr', style: { width: fw * 0.6, height: 7, borderRadius: 4, background: '#0c211d', overflow: 'hidden', border: `1px solid ${col}44` } },
        h('div', { style: { height: '100%', background: col, boxShadow: glow, borderRadius: 4, width: anim ? '50%' : '62%', animation: anim ? 'tars-prog 1.7s ease-in-out infinite alternate' : 'none' } })),
    ]);
    extra.push(h('div', { key: 'scan', style: { position: 'absolute', top: 0, bottom: 0, width: '32%', left: '-32%', background: `linear-gradient(90deg,transparent,${col}26,transparent)`, animation: anim ? 'tars-scan 2.2s linear infinite' : 'none', display: anim ? 'block' : 'none' } }));
  } else if (expr === 'success') {
    content = col2([
      h('div', { key: 'e', style: { display: 'flex', gap: fw * 0.2 } }, [eyeHappy('l'), eyeHappy('r')]),
      h('div', { key: 'sm', style: { width: fw * 0.38, height: fw * 0.19, borderBottom: `3px solid ${col}`, borderRadius: '0 0 60px 60px', filter: `drop-shadow(${glow})` } }),
    ]);
  } else if (expr === 'error') {
    content = col2([
      h('div', { key: 'e', style: { display: 'flex', gap: fw * 0.2 } }, [xeye('l'), xeye('r')]),
      h('div', { key: 'm', style: { width: fw * 0.3, height: 4, borderRadius: 3, background: col, boxShadow: glow } }),
    ]);
  } else {
    content = col2([
      eyesRow([eyeRect('l'), eyeRect('r')], false),
      h('div', { key: 'wv', style: { display: 'flex', gap: 5, alignItems: 'center', height: 24 } }, [wb(0), wb(1), wb(2), wb(3), wb(4)]),
    ]);
  }

  return h('div', {
    style: {
      width: fw,
      height: fh,
      background: '#07100f',
      border: `2px solid ${col}55`,
      borderRadius: 9,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `inset 0 0 22px #000, 0 0 14px ${col}30`,
    },
  }, [...extra, content]);
}

function mascot(expr: TarsExpression, anim: boolean): React.ReactElement {
  const slab = (x: number, k: string, animName: string | null): React.ReactElement =>
    box(50, 212, 72, {
      key: 'sl' + k,
      place: `translateX(${x}px)`,
      origin: 'center top',
      animName,
      front: G.f,
      top: G.fL,
      right: G.fD,
      children: screenLayer(null, { extra: [groove('30%'), groove('58%'), groove('80%')] }),
    });
  const boxes = [
    slab(-60, 'l', anim ? 'tars-stepL' : null),
    slab(60, 'r', anim ? 'tars-stepR' : null),
    box(62, 212, 72, {
      key: 'm',
      front: G.f,
      top: G.fL,
      right: G.fD,
      children: screenLayer(face(50, 78, expr, anim), { top: '30%', extra: [groove('60%'), groove('82%'), powerStrip()] }),
    }),
  ];
  const scene = h('div', {
    style: {
      position: 'relative',
      width: 0,
      height: 0,
      transformStyle: 'preserve-3d',
      transform: 'rotateX(-20deg) rotateY(-30deg)',
      animation: anim ? 'tars-sway 5s ease-in-out infinite alternate' : 'none',
    },
  }, boxes);
  const bob = h('div', { style: { animation: anim ? 'tars-bob 3.6s ease-in-out infinite' : 'none' } }, scene);
  const posWrap = h('div', {
    style: { position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)', perspective: '1300px' },
  }, bob);
  const shadow = h('div', {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: '6%',
      width: 214,
      height: 26,
      transform: 'translateX(-50%)',
      borderRadius: '50%',
      background: 'radial-gradient(closest-side,rgba(0,0,0,.5),transparent)',
      filter: 'blur(3px)',
      animation: anim ? 'tars-shadow 3.6s ease-in-out infinite' : 'none',
      opacity: 0.4,
    },
  });
  return h('div', { style: { position: 'absolute', inset: 0 } }, [shadow, posWrap]);
}

export function TarsMascot({
  expression = 'idle',
  animated = true,
  size = 200,
  style,
  className,
}: TarsMascotProps): React.ReactElement {
  React.useEffect(injectKeyframes, []);
  const scale = size / 300; // natural mascot ~300px tall
  return h(
    'div',
    { className, style: { width: size, height: size, position: 'relative', ...style } },
    h('div', { style: { position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: 'center' } }, mascot(expression, animated)),
  );
}

export default TarsMascot;
