import * as THREE from 'three';
import { Ripple } from '../types/game';

export class RippleSystem {
  public ripples: Ripple[] = [];
  private scene: THREE.Scene;
  private ringGeo: THREE.RingGeometry;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.ringGeo = new THREE.RingGeometry(0.12, 0.22, 24);
  }

  public spawnWaterRipple(x: number, y: number, z: number): void {
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#e0f2fe',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(this.ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, y + 0.04, z);
    this.scene.add(ring);
    this.ripples.push({ mesh: ring, life: 0.7, maxLife: 0.7 });
  }

  public update(dt: number): void {
    for (let ri = this.ripples.length - 1; ri >= 0; ri--) {
      const rp = this.ripples[ri];
      rp.life -= dt;
      if (rp.life <= 0) {
        this.scene.remove(rp.mesh);
        (rp.mesh.material as THREE.Material).dispose();
        this.ripples.splice(ri, 1);
      } else {
        const prog = 1 - rp.life / rp.maxLife;
        rp.mesh.scale.setScalar(1 + prog * 4.5);
        (rp.mesh.material as THREE.Material & { opacity: number }).opacity = (1 - prog) * 0.85;
      }
    }
  }
}
