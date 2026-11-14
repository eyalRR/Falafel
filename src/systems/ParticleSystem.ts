import * as THREE from 'three';
import { Particle } from '../types/game';

export class ParticleSystem {
  public particles: Particle[] = [];
  private scene: THREE.Scene;
  private dustGeo: THREE.SphereGeometry;
  private dustMat: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.dustGeo = new THREE.SphereGeometry(0.065, 8, 6);
    this.dustMat = new THREE.MeshStandardMaterial({
      color: '#e5c69b',
      roughness: 0.95,
      transparent: true,
      opacity: 0.72
    });
  }

  public spawnDust(x: number, y: number, z: number, count = 6, spread = 0.5): void {
    for (let i = 0; i < count; i++) {
      const mat = this.dustMat.clone();
      const m = new THREE.Mesh(this.dustGeo, mat);
      m.position.set(
        x + (Math.random() - 0.5) * spread,
        y + Math.random() * 0.08,
        z + (Math.random() - 0.5) * spread
      );
      const s = 0.5 + Math.random() * 0.9;
      m.scale.setScalar(s);
      this.scene.add(m);
      this.particles.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 0.4 + Math.random() * 0.9,
        vz: -1.4 - Math.random() * 1.2,
        life: 0.55 + Math.random() * 0.35,
        maxLife: 0.9
      });
    }
  }

  public spawnSparkles(x: number, y: number, z: number, colorHex = '#fde047'): void {
    for (let i = 0; i < 8; i++) {
      const sp = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.06, 0),
        new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9 })
      );
      sp.position.set(
        x + (Math.random() - 0.5) * 0.6,
        y + (Math.random() - 0.5) * 0.4,
        z + (Math.random() - 0.5) * 0.4
      );
      this.scene.add(sp);
      this.particles.push({
        mesh: sp,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.9 + Math.random() * 1.2,
        vz: (Math.random() - 0.5) * 0.8,
        life: 0.85,
        maxLife: 0.85
      });
    }
  }

  public update(dt: number): void {
    for (let k = this.particles.length - 1; k >= 0; k--) {
      const p = this.particles[k];
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        if (p.mesh.geometry && p.mesh.geometry !== this.dustGeo) p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach((m) => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
        this.particles.splice(k, 1);
      } else {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.vy -= 1.8 * dt;
        (p.mesh.material as THREE.Material & { opacity: number }).opacity = (p.life / p.maxLife) * 0.72;
        p.mesh.scale.multiplyScalar(1 + dt * 0.9);
      }
    }
  }
}
