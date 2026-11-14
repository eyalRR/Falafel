import * as THREE from 'three';

export function buildPalmTree(x: number, z: number, scale = 1): THREE.Group {
  const palm = new THREE.Group();
  palm.position.set(x, 0, z);
  palm.scale.setScalar(scale);
  palm.userData = { interactType: 'palm', swayAngle: 0, swayVel: 0 };

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.18, 3.0, 10),
    new THREE.MeshStandardMaterial({ color: '#78553a', roughness: 0.92 })
  );
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  palm.add(trunk);

  const frondMat = new THREE.MeshStandardMaterial({ color: '#3f7d20', roughness: 0.7, side: THREE.DoubleSide });
  for (let f = 0; f < 7; f++) {
    const frond = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.55, 5), frondMat);
    frond.rotation.z = Math.PI * 0.42;
    frond.rotation.y = (f / 7) * Math.PI * 2;
    frond.position.set(Math.cos((f / 7) * Math.PI * 2) * 0.65, 2.95, Math.sin((f / 7) * Math.PI * 2) * 0.65);
    frond.castShadow = true;
    palm.add(frond);
  }
  return palm;
}
