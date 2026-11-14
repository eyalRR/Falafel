import * as THREE from 'three';

export class ShadowCage {
  public group: THREE.Group;
  public cageMesh: THREE.Mesh;
  public cageRing: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.34, 0);

    const cageMat = new THREE.MeshStandardMaterial({
      color: '#312e81',
      emissive: '#4c1d95',
      emissiveIntensity: 0.45,
      wireframe: true
    });

    this.cageMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), cageMat);

    this.cageRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.026, 8, 24),
      new THREE.MeshBasicMaterial({ color: '#a855f7', transparent: true, opacity: 0.75 })
    );
    this.cageRing.rotation.x = Math.PI / 2;

    this.group.add(this.cageMesh, this.cageRing);
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public update(elapsed: number): void {
    this.cageMesh.rotation.y = elapsed * 0.5;
    this.cageRing.rotation.z = -elapsed * 0.8;
  }
}
