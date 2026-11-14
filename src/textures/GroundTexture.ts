import * as THREE from 'three';
import { TextureBundle } from './FalafelTexture';

export function makeSandTrackTexture(): TextureBundle {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#d9b382';
  ctx.fillRect(0, 0, size, size);

  // Trail ruts along Z (vertical in UV)
  const grad = ctx.createLinearGradient(0, 0, size, 0);
  grad.addColorStop(0, '#c69b66');
  grad.addColorStop(0.22, '#e3c396');
  grad.addColorStop(0.5, '#d5ab77');
  grad.addColorStop(0.78, '#e3c396');
  grad.addColorStop(1, '#c69b66');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 6500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.7 + Math.random() * 2.2;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(130, 88, 42, 0.25)' : 'rgba(255, 244, 218, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const bc = document.createElement('canvas');
  bc.width = size;
  bc.height = size;
  const bctx = bc.getContext('2d')!;
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Wind ripples & track ruts in bump map
  for (let ry = 0; ry < size; ry += 12) {
    bctx.fillStyle = 'rgba(210,210,210,0.22)';
    bctx.fillRect(0, ry, size, 4);
  }
  bctx.fillStyle = 'rgba(50,50,50,0.35)';
  bctx.fillRect(size * 0.2, 0, size * 0.12, size);
  bctx.fillRect(size * 0.68, 0, size * 0.12, size);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  tex.colorSpace = THREE.SRGBColorSpace;

  const bump = new THREE.CanvasTexture(bc);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(1, 6);

  return { map: tex, bumpMap: bump };
}

export function makeStoneTexture(baseHex = '#e7d5b4', lineHex = '#b09872'): TextureBundle {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  const rows = 6;
  const rowH = size / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const cols = 3 + (r % 2);
    const colW = size / cols;
    const shift = (r % 2) * (colW * 0.45);
    for (let col = -1; col <= cols; col++) {
      const x = col * colW + shift;
      const shade = (Math.random() - 0.5) * 18;
      ctx.fillStyle = `rgba(${232 + shade},${212 + shade},${176 + shade}, 0.9)`;
      ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
      ctx.strokeStyle = lineHex;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, colW, rowH);
    }
  }

  // Subtle grain
  for (let g = 0; g < 1800; g++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(110,90,65,0.12)' : 'rgba(255,250,240,0.14)';
    ctx.fillRect(Math.random() * size, Math.random() * size, 3, 3);
  }

  const bc = document.createElement('canvas');
  bc.width = size;
  bc.height = size;
  const bctx = bc.getContext('2d')!;
  bctx.fillStyle = '#c8c8c8';
  bctx.fillRect(0, 0, size, size);
  for (let r2 = 0; r2 < rows; r2++) {
    const y2 = r2 * rowH;
    const cols2 = 3 + (r2 % 2);
    const colW2 = size / cols2;
    const shift2 = (r2 % 2) * (colW2 * 0.45);
    bctx.strokeStyle = '#303030';
    bctx.lineWidth = 6;
    for (let col2 = -1; col2 <= cols2; col2++) {
      bctx.strokeRect(col2 * colW2 + shift2, y2, colW2, rowH);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const bump = new THREE.CanvasTexture(bc);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;

  return { map: tex, bumpMap: bump };
}

export function makePitaTexture(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#edd29f';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 650; i++) {
    ctx.fillStyle = Math.random() > 0.7 ? 'rgba(168, 112, 52, 0.25)' : 'rgba(255, 245, 224, 0.35)';
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, 1 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
