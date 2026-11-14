import * as THREE from 'three';

export function buildOliveTree(x: number, z: number, scale = 1): THREE.Group {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  tree.userData = { interactType: 'palm', swayAngle: 0, swayVel: 0 };

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.22, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: '#6b4f35', roughness: 0.95 })
  );
  trunk.position.y = 0.75;
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  tree.add(trunk);

  const canopyMat = new THREE.MeshStandardMaterial({ color: '#7a9461', roughness: 0.85 });
  const clusters = [
    [0, 1.75, 0, 0.85],
    [-0.45, 1.55, 0.2, 0.62],
    [0.48, 1.6, -0.15, 0.65]
  ];

  clusters.forEach(([cx, cy, cz, cr]) => {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 1), canopyMat);
    puff.position.set(cx, cy, cz);
    puff.scale.set(1.15, 0.78, 1.05);
    puff.castShadow = true;
    tree.add(puff);
  });

  return tree;
}
