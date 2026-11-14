import * as THREE from 'three';
import { makeFlagHeadbandTexture } from '../../textures/FalafelTexture';

export class FalafelHeadband {
  public group: THREE.Group;
  public tail1: THREE.Mesh;
  public tail2: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.24, 0);
    this.group.rotation.x = -0.18;

    const bandTex = makeFlagHeadbandTexture();
    const bandMat = new THREE.MeshStandardMaterial({
      map: bandTex,
      roughness: 0.65,
      side: THREE.DoubleSide
    });

    const bandGeo = new THREE.CylinderGeometry(0.585, 0.605, 0.15, 42, 1, true);
    // Rotate so center of texture (Star of David) faces +Z
    bandGeo.rotateY(-Math.PI / 2);
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.castShadow = true;
    this.group.add(bandMesh);

    // Flowing headband tails in back-left
    const tailGeo = new THREE.PlaneGeometry(0.42, 0.13, 8, 2);
    tailGeo.translate(0.21, 0, 0);
    const tailMat = new THREE.MeshStandardMaterial({
      map: bandTex,
      roughness: 0.65,
      side: THREE.DoubleSide
    });

    this.tail1 = new THREE.Mesh(tailGeo, tailMat);
    this.tail1.position.set(-0.52, 0.01, -0.25);
    this.tail1.rotation.y = Math.PI * 0.78;

    this.tail2 = new THREE.Mesh(tailGeo, tailMat);
    this.tail2.position.set(-0.50, -0.04, -0.28);
    this.tail2.rotation.y = Math.PI * 0.86;
    this.tail2.rotation.z = -0.22;

    this.group.add(this.tail1, this.tail2);
  }

  public update(elapsed: number, isSitting: boolean, windBoost: number): void {
    const wind = (isSitting ? 1.5 : 8.5) + windBoost * 5.0;
    this.tail1.rotation.y = Math.PI * 0.78 + Math.sin(elapsed * wind) * 0.18;
    this.tail2.rotation.y = Math.PI * 0.86 + Math.cos(elapsed * wind * 1.15) * 0.22;
  }
}
