import * as THREE from 'three';
import { StageKey } from '../../types/game';

export class KingCrumbs {
  public group: THREE.Group;
  public kingDiveGear: THREE.Group;
  public kingFishGear: THREE.Group;
  public kingTembel: THREE.Mesh;
  public kingHat: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.userData = { interactType: 'king', wobbleVel: 0, wobble: 0 };

    const kingBody = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.32, 1),
      new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.9 })
    );
    kingBody.position.y = 0.45;
    kingBody.castShadow = true;
    this.group.add(kingBody);

    const kingCape = new THREE.Mesh(
      new THREE.ConeGeometry(0.36, 0.55, 8, 1, true),
      new THREE.MeshStandardMaterial({ color: '#7e22ce', roughness: 0.7, side: THREE.DoubleSide })
    );
    kingCape.position.set(0, 0.34, -0.12);
    this.group.add(kingCape);

    // Goofy oversized tilted hat/crown
    this.kingHat = new THREE.Group();
    this.kingHat.position.set(0, 0.80, 0);
    this.kingHat.rotation.z = 0.18;
    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.48, 0.05, 14),
      new THREE.MeshStandardMaterial({ color: '#581c87', roughness: 0.6 })
    );
    const hatTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.24, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.4, metalness: 0.4 })
    );
    hatTop.position.y = 0.22;
    this.kingHat.add(hatBrim, hatTop);
    this.group.add(this.kingHat);

    // Goofy eyes + mustache
    [-0.09, 0.09].forEach((kx) => {
      const ke = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
      ke.position.set(kx, 0.54, 0.26);
      const kp = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), new THREE.MeshBasicMaterial({ color: '#0f172a' }));
      kp.position.set(kx, 0.54, 0.31);
      this.group.add(ke, kp);
    });

    const kingStache = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.045, 0.06),
      new THREE.MeshStandardMaterial({ color: '#451a03' })
    );
    kingStache.position.set(0, 0.43, 0.30);
    this.group.add(kingStache);

    // Disguises
    this.kingDiveGear = new THREE.Group();
    const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.08), new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.2 }));
    goggles.position.set(0, 0.54, 0.30);
    const snorkel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.35, 8), new THREE.MeshStandardMaterial({ color: '#facc15' }));
    snorkel.position.set(0.18, 0.65, 0.24);
    this.kingDiveGear.add(goggles, snorkel);
    this.group.add(this.kingDiveGear);

    this.kingFishGear = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.95, 6), new THREE.MeshStandardMaterial({ color: '#78350f' }));
    rod.position.set(0.32, 0.72, 0.22);
    rod.rotation.z = -0.55;
    rod.rotation.x = 0.4;
    this.kingFishGear.add(rod);
    this.group.add(this.kingFishGear);

    this.kingTembel = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.8 })
    );
    this.kingTembel.position.set(0, 0.72, 0);
    this.group.add(this.kingTembel);

    this.setCostume('kotel');
  }

  public setCostume(envName: StageKey): void {
    this.kingDiveGear.visible = (envName === 'jaffa');
    this.kingFishGear.visible = (envName === 'kinneret');
    this.kingTembel.visible = (envName === 'masada');
    this.kingHat.visible = (envName === 'kotel');
  }

  public update(dt: number, elapsed: number): void {
    // Gentle hovering wobble
    this.group.position.y = Math.sin(elapsed * 2.5) * 0.04;
  }
}
