import * as THREE from 'three';
import { makePitaTexture } from '../../textures/GroundTexture';

export class FalafelToppings {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0.44, -0.03);

    // Folded Pita bread rim framing the top/back
    const pitaTex = makePitaTexture();
    const pitaMat = new THREE.MeshStandardMaterial({ map: pitaTex, roughness: 0.85, side: THREE.DoubleSide });
    const pitaArc = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.11, 14, 28, Math.PI * 1.15),
      pitaMat
    );
    pitaArc.rotation.x = Math.PI * 0.36;
    pitaArc.rotation.z = -Math.PI * 0.075;
    pitaArc.position.set(0, 0.04, -0.06);
    pitaArc.castShadow = true;
    this.group.add(pitaArc);

    // Crisp green lettuce leaves
    const lettuceMat = new THREE.MeshStandardMaterial({ color: '#58b431', roughness: 0.55, side: THREE.DoubleSide });
    for (let li = 0; li < 9; li++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), lettuceMat);
      const ang = (li / 9) * Math.PI * 1.6 - Math.PI * 0.8;
      leaf.scale.set(1.25, 0.45, 0.9);
      leaf.position.set(Math.sin(ang) * 0.26, 0.11 + (li % 2) * 0.04, Math.cos(ang) * 0.22 - 0.02);
      leaf.rotation.set(0.3, ang, (Math.random() - 0.5) * 0.5);
      leaf.castShadow = true;
      this.group.add(leaf);
    }

    // Diced red tomatoes
    const tomatoMat = new THREE.MeshStandardMaterial({ color: '#e12d2d', roughness: 0.22, metalness: 0.05 });
    const tomatoPositions = [
      [-0.16, 0.19, 0.06], [0.02, 0.22, 0.08], [0.18, 0.18, 0.03],
      [-0.08, 0.21, -0.06], [0.11, 0.20, -0.05]
    ];
    tomatoPositions.forEach((tp) => {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.11), tomatoMat);
      cube.position.set(tp[0], tp[1], tp[2]);
      cube.rotation.set(Math.random(), Math.random(), Math.random());
      cube.castShadow = true;
      this.group.add(cube);
    });

    // Diced cucumbers
    const cukeMat = new THREE.MeshStandardMaterial({ color: '#4d9c2a', roughness: 0.3 });
    const cukePositions = [[-0.22, 0.15, -0.02], [0.22, 0.15, 0.08], [-0.02, 0.18, 0.14]];
    cukePositions.forEach((cp) => {
      const ck = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.09), cukeMat);
      ck.position.set(cp[0], cp[1], cp[2]);
      ck.rotation.set(Math.random(), Math.random(), Math.random());
      this.group.add(ck);
    });

    // Red onion slices
    const onionMat = new THREE.MeshStandardMaterial({ color: '#9d4edd', roughness: 0.35, side: THREE.DoubleSide });
    for (let oi = 0; oi < 2; oi++) {
      const onion = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 16, Math.PI * 1.4), onionMat);
      onion.position.set(oi === 0 ? -0.10 : 0.09, 0.24, 0.02);
      onion.rotation.set(0.7, oi * 1.2, 0.4);
      this.group.add(onion);
    }

    // Creamy dripping tahini sauce
    const tahiniMat = new THREE.MeshStandardMaterial({ color: '#f3deb3', roughness: 0.22, metalness: 0.02 });
    const tahiniCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), tahiniMat);
    tahiniCap.position.set(0, 0.08, 0.12);
    tahiniCap.scale.set(1.15, 0.35, 0.9);
    this.group.add(tahiniCap);

    const dripCoords = [
      { x: -0.26, y: 0.0, z: 0.43, len: 0.17 },
      { x: -0.08, y: 0.04, z: 0.48, len: 0.12 },
      { x: 0.19, y: 0.02, z: 0.45, len: 0.15 },
      { x: 0.32, y: 0.05, z: 0.34, len: 0.11 }
    ];
    dripCoords.forEach((d) => {
      const drip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.016, d.len, 10), tahiniMat);
      drip.position.set(d.x, d.y - d.len * 0.4, d.z);
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), tahiniMat);
      drop.position.set(d.x, d.y - d.len * 0.9, d.z);
      this.group.add(drip, drop);
    });
  }
}
