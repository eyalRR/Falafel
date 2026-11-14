import * as THREE from 'three';

export interface TextureBundle {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

export function makeFalafelTextures(): TextureBundle {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  // Base golden-brown fried chickpea crust
  ctx.fillStyle = '#9c4e18';
  ctx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  const tones = ['#7a380d', '#b8621e', '#c97528', '#5e2908', '#d48735'];
  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1.2 + Math.random() * 4.5;
    ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
    ctx.globalAlpha = 0.45 + Math.random() * 0.45;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    const v = Math.floor(85 + Math.random() * 170);
    bctx.fillStyle = `rgb(${v},${v},${v})`;
    bctx.globalAlpha = 0.6;
    bctx.beginPath();
    bctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
    bctx.fill();
  }

  // Parsley flecks
  ctx.globalAlpha = 0.88;
  for (let p = 0; p < 220; p++) {
    ctx.fillStyle = Math.random() > 0.4 ? '#2d6a1e' : '#4a8f29';
    ctx.save();
    ctx.translate(Math.random() * size, Math.random() * size);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillRect(-3, -1.5, 6, 3);
    ctx.restore();
  }

  // Tiny sesame seeds baked into surface
  ctx.fillStyle = '#f5e6c4';
  for (let s = 0; s < 140; s++) {
    ctx.save();
    ctx.translate(Math.random() * size, Math.random() * size);
    ctx.rotate(Math.random() * Math.PI);
    ctx.beginPath();
    ctx.ellipse(0, 0, 3.2, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

export function makeFlagHeadbandTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 128;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;

  // Crisp woven white fabric
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // Subtle fabric weave
  ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
  for (let x = 0; x < w; x += 4) {
    ctx.fillRect(x, 0, 1, h);
  }
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }

  // Top and bottom Israeli blue stripes
  ctx.fillStyle = '#0038b8';
  ctx.fillRect(0, 14, w, 16);
  ctx.fillRect(0, h - 30, w, 16);

  // Star of David (Magen David) centered at front
  function drawStar(cx: number, cy: number, r: number) {
    ctx.strokeStyle = '#0038b8';
    ctx.lineWidth = 4.2;
    ctx.lineJoin = 'miter';
    for (let t = 0; t < 2; t++) {
      ctx.beginPath();
      const offset = t === 0 ? -Math.PI / 2 : Math.PI / 2;
      for (let k = 0; k < 3; k++) {
        const ang = offset + (k * Math.PI * 2) / 3;
        const px = cx + Math.cos(ang) * r;
        const py = cy + Math.sin(ang) * r;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  drawStar(w * 0.5, h * 0.5, 22);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
