import * as THREE from 'three';

export function buildScrubTuft(x: number, z: number): THREE.Group {
  const tuft = new THREE.Group();
  tuft.position.set(x, 0, z);
  tuft.userData = { interactType: 'shrub', swayAngle: 0, swayVel: 0 };
  const mat = new THREE.MeshStandardMaterial({ color: '#787148', roughness: 0.92 });

  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.24 + Math.random() * 0.14, 5), mat);
    blade.position.set((Math.random() - 0.5) * 0.14, 0.11, (Math.random() - 0.5) * 0.14);
    blade.rotation.set((Math.random() - 0.5) * 0.5, Math.random() * 3, (Math.random() - 0.5) * 0.5);
    tuft.add(blade);
  }
  return tuft;
}

export function buildTrailMarker(x: number, z: number, stripeColor = '#2563eb'): THREE.Group {
  const post = new THREE.Group();
  post.position.set(x, 0, z);
  post.userData = { interactType: 'stone', swayAngle: 0, swayVel: 0 };

  const rock = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.62, 0.18),
    new THREE.MeshStandardMaterial({ color: '#d6c2a3', roughness: 0.9 })
  );
  rock.position.y = 0.31;
  rock.castShadow = true;
  post.add(rock);

  const whiteBand = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.24, 0.19),
    new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 })
  );
  whiteBand.position.y = 0.44;

  const colorBand = new THREE.Mesh(
    new THREE.BoxGeometry(0.235, 0.08, 0.195),
    new THREE.MeshStandardMaterial({ color: stripeColor, roughness: 0.5 })
  );
  colorBand.position.y = 0.44;

  post.add(whiteBand, colorBand);
  return post;
}
