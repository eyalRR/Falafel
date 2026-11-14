import * as THREE from 'three';

export class FalafelBackpack {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.02, -0.58);

    const packMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.78 });
    const packBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.32), packMat);
    packBody.castShadow = true;
    this.group.add(packBody);

    const packPocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.30, 0.12),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 })
    );
    packPocket.position.set(0, -0.10, -0.18);
    this.group.add(packPocket);

    // Rolled blue sleeping mat on top
    const matRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.60, 18),
      new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.55 })
    );
    matRoll.rotation.z = Math.PI / 2;
    matRoll.position.set(0, 0.39, -0.02);
    matRoll.castShadow = true;
    this.group.add(matRoll);

    // Water bottle in side mesh pocket
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.24, 14),
      new THREE.MeshStandardMaterial({ color: '#bae6fd', roughness: 0.15, transparent: true, opacity: 0.78 })
    );
    bottle.position.set(-0.34, -0.05, -0.02);
    const bottleCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12),
      new THREE.MeshStandardMaterial({ color: '#0369a1', roughness: 0.4 })
    );
    bottleCap.position.set(-0.34, 0.09, -0.02);
    this.group.add(bottle, bottleCap);

    // Backpack shoulder straps
    const strapMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 });
    [-0.32, 0.32].forEach((sx) => {
      const strap = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 8, 18, Math.PI * 1.05), strapMat);
      strap.rotation.y = Math.PI / 2;
      strap.rotation.z = -Math.PI * 0.45;
      strap.position.set(sx, 0.02, 0.32);
      this.group.add(strap);
    });
  }
}
