import * as THREE from 'three';

export function buildMenorah(x: number, y: number, z: number): THREE.Group {
  const mGroup = new THREE.Group();
  mGroup.position.set(x, y, z);
  mGroup.userData = { interactType: 'kotel' };

  const goldMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.28, metalness: 0.75 });
  const baseMat = new THREE.MeshStandardMaterial({ color: '#e7d5b4', roughness: 0.85 });

  const ped = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.9), baseMat);
  ped.position.y = 0.325;
  ped.castShadow = true;
  mGroup.add(ped);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 1.15, 10), goldMat);
  stem.position.y = 1.2;
  mGroup.add(stem);

  for (let b = 1; b <= 3; b++) {
    const arm = new THREE.Mesh(new THREE.TorusGeometry(0.18 * b, 0.025, 8, 18, Math.PI), goldMat);
    arm.rotation.z = Math.PI;
    arm.position.y = 1.68;
    mGroup.add(arm);
  }

  for (let f = -3; f <= 3; f++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.025, 0.08, 8), goldMat);
    cup.position.set(f * 0.18, 1.72, 0);

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 8, 6),
      new THREE.MeshBasicMaterial({ color: '#fef08a' })
    );
    flame.position.set(f * 0.18, 1.80, 0);
    mGroup.add(cup, flame);
  }

  return mGroup;
}
