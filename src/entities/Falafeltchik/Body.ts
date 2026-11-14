import * as THREE from 'three';
import { makeFalafelTextures } from '../../textures/FalafelTexture';

export class FalafelBody {
  public mesh: THREE.Mesh;
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();

    const falafelTex = makeFalafelTextures();
    const falafelGeo = new THREE.SphereGeometry(0.62, 40, 32);
    const posAttr = falafelGeo.attributes.position;

    // Organic bumpy surface deformation
    for (let vi = 0; vi < posAttr.count; vi++) {
      const vx = posAttr.getX(vi);
      const vy = posAttr.getY(vi);
      const vz = posAttr.getZ(vi);
      const n = Math.sin(vx * 18) * Math.cos(vy * 18) * Math.sin(vz * 18) * 0.025 +
                Math.sin(vx * 35 + vz * 29) * 0.012;
      const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
      const scale = (len + n) / len;
      posAttr.setXYZ(vi, vx * scale, vy * scale, vz * scale);
    }
    falafelGeo.computeVertexNormals();

    const falafelMat = new THREE.MeshStandardMaterial({
      map: falafelTex.map,
      bumpMap: falafelTex.bumpMap,
      bumpScale: 0.035,
      roughness: 0.85,
      metalness: 0.02
    });

    this.mesh = new THREE.Mesh(falafelGeo, falafelMat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.group.add(this.mesh);

    // 3D sesame seeds & herbs embedded on the front/sides
    const sesameGeo = new THREE.SphereGeometry(0.024, 8, 6);
    sesameGeo.scale(1.6, 0.75, 0.9);
    const sesameMat = new THREE.MeshStandardMaterial({ color: '#f7ebc8', roughness: 0.55 });
    const herbGeo = new THREE.BoxGeometry(0.035, 0.015, 0.028);
    const herbMat = new THREE.MeshStandardMaterial({ color: '#3b8222', roughness: 0.8 });

    for (let si = 0; si < 48; si++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const sx = Math.sin(phi) * Math.cos(theta);
      const sy = Math.cos(phi);
      const sz = Math.sin(phi) * Math.sin(theta);

      // Avoid covering eyes/mouth front patch
      if (sz > 0.35 && sy > -0.35 && sy < 0.35 && Math.abs(sx) < 0.48) continue;

      const isHerb = si % 3 === 0;
      const speck = new THREE.Mesh(isHerb ? herbGeo : sesameGeo, isHerb ? herbMat : sesameMat);
      speck.position.set(sx * 0.615, sy * 0.615, sz * 0.615);
      speck.lookAt(sx * 2, sy * 2, sz * 2);
      speck.rotateZ(Math.random() * Math.PI);
      this.group.add(speck);
    }
  }
}
