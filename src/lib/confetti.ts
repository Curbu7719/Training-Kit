// ---------------------------------------------------------------------------
// Confetti burst — dependency-free canvas animation.
// Spawns colorful particles with gravity and fade-out; cleans up after ~3s.
// ---------------------------------------------------------------------------

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  spin: number;
  angle: number;
}

const COLORS = [
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

const PARTICLE_COUNT = 160;
const GRAVITY = 0.35;
const FADE_PER_FRAME = 0.012;

export function burstConfetti(): void {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  // Origin: centre of the viewport
  const ox = canvas.width / 2;
  const oy = canvas.height * 0.4;

  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 10;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6, // slight upward bias
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      radius: 4 + Math.random() * 5,
      spin: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
    };
  });

  let rafId: number;

  function draw() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;
    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive = true;

      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.alpha -= FADE_PER_FRAME;

      ctx!.save();
      ctx!.globalAlpha = Math.max(0, p.alpha);
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.angle);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.radius / 2, -p.radius / 2, p.radius, p.radius * 0.6);
      ctx!.restore();
    }

    if (alive) {
      rafId = requestAnimationFrame(draw);
    } else {
      document.body.removeChild(canvas);
    }
  }

  rafId = requestAnimationFrame(draw);

  // Hard cap: remove canvas after 3.5 s even if particles are still visible
  setTimeout(() => {
    cancelAnimationFrame(rafId);
    if (canvas.parentNode) document.body.removeChild(canvas);
  }, 3500);
}
