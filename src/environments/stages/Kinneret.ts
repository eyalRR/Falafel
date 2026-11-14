import * as THREE from 'three';
import { WaterSurface } from '../WaterSurface';
import { buildPalmTree } from '../props/PalmTree';
import { buildTrailMarker } from '../props/ScrubTuft';

export class KinneretStage {
  public group: THREE.Group;
  public interactiveObjects: THREE.Object3D[] = [];
  public scrollingProps: THREE.Object3D[] = [];
  public waterSurface: WaterSurface;
  public boatGroup: THREE.Group;
  public duckGroup: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.waterSurface = new WaterSurface('#0c4a6e', '#0284c7', 45, 80);
    this.boatGroup = new THREE.Group();
    this.duckGroup = new THREE.Group();
    this.build();
  }

  private build(): void {
    // Water
    this.waterSurface.mesh.position.set(24.5, 0.08, 0);
    this.waterSurface.mesh.userData = { interactType: 'water' };
    this.group.add(this.waterSurface.mesh);
    this.interactiveObjects.push(this.waterSurface.mesh);

    // Wet sand strip
    const wetSandK = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 45),
      new THREE.MeshStandardMaterial({ color: '#8c6d46', roughness: 0.25, metalness: 0.1 })
    );
    wetSandK.rotation.x = -Math.PI / 2;
    wetSandK.position.set(2.05, 0.03, 0);
    this.group.add(wetSandK);

    // Basalt stones
    const basaltMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.85 });
    for (let bs = 0; bs < 10; bs++) {
      const bStone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14 + Math.random() * 0.12, 0), basaltMat);
      bStone.position.set(1.65 + Math.random() * 0.55, 0.06, -6 + bs * 1.4);
      bStone.scale.set(1.2, 0.55, 1.0);
      bStone.userData = { interactType: 'pebble', baseY: 0.06, vy: 0, rotVel: 0 };
      this.group.add(bStone);
      this.interactiveObjects.push(bStone);
    }

    // Wooden Pier
    const woodMat = new THREE.MeshStandardMaterial({ color: '#7c4d2b', roughness: 0.88 });
    const pier = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 1.1), woodMat);
    pier.position.set(3.2, 0.25, -4.5);
    pier.castShadow = true;
    this.group.add(pier);

    for (let pl = 0; pl < 6; pl++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 1.15), woodMat);
      plank.position.set(1.9 + pl * 0.5, 0.33, -4.5 + (pl % 2) * 0.03);
      plank.rotation.y = (pl % 3 - 1) * 0.025;
      this.group.add(plank);
    }
    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.42, 8), woodMat);
    bollard.position.set(4.5, 0.42, -4.1);
    this.group.add(bollard);

    // Galilee Fishing Boat
    this.boatGroup.position.set(6.2, 0.18, -5.2);
    this.boatGroup.rotation.y = 0.35;
    this.boatGroup.userData = { interactType: 'boat', swayAngle: 0, swayVel: 0 };

    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.95), woodMat);
    hull.castShadow = true;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.7, 8), woodMat);
    mast.position.y = 0.9;
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.2), new THREE.MeshStandardMaterial({ color: '#fef9ef', side: THREE.DoubleSide }));
    sail.position.set(0.45, 1.0, 0);
    const oar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), woodMat);
    oar.rotation.z = Math.PI * 0.42;
    oar.position.set(0.2, 0.25, 0.35);
    this.boatGroup.add(hull, mast, sail, oar);
    this.group.add(this.boatGroup);
    this.interactiveObjects.push(this.boatGroup);

    // Mischievous Duck
    this.duckGroup.position.set(3.2, 0.12, -1.8);
    this.duckGroup.userData = { interactType: 'duck', swayAngle: 0, swayVel: 0 };
    const dBody = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 }));
    dBody.scale.set(1.0, 0.85, 1.35);
    dBody.position.y = 0.12;
    const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.10, 10, 8), new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.5 }));
    dHead.position.set(0, 0.28, 0.14);
    const dBeak = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 6), new THREE.MeshStandardMaterial({ color: '#f59e0b' }));
    dBeak.rotation.x = Math.PI / 2;
    dBeak.position.set(0, 0.26, 0.25);
    this.duckGroup.add(dBody, dHead, dBeak);
    this.group.add(this.duckGroup);
    this.interactiveObjects.push(this.duckGroup);

    // Rolling Galilee hills & Mt. Arbel
    const hillMat = new THREE.MeshStandardMaterial({ color: '#7b9c49', roughness: 0.92 });
    for (let h = 0; h < 4; h++) {
      const hill = new THREE.Mesh(new THREE.SphereGeometry(9 + h * 1.5, 16, 12), hillMat);
      hill.scale.set(1.8, 0.45, 1.2);
      hill.position.set(-14 + h * 9, -0.8, -28 - (h % 2) * 4);
      this.group.add(hill);
    }
    const arbel = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 5.2, 6.2, 6), new THREE.MeshStandardMaterial({ color: '#8c7a5b', roughness: 0.92 }));
    arbel.position.set(-9.5, 3.0, -22);
    this.group.add(arbel);

    // Shoreline reeds
    const reedMat = new THREE.MeshStandardMaterial({ color: '#4d7c0f', roughness: 0.8 });
    for (let rd = -8; rd <= 6; rd += 3.5) {
      const reedCluster = new THREE.Group();
      reedCluster.position.set(1.9, 0, rd);
      reedCluster.userData = { interactType: 'shrub', swayAngle: 0, swayVel: 0 };
      for (let rSub = 0; rSub < 4; rSub++) {
        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.9 + Math.random() * 0.4, 6), reedMat);
        stalk.position.set((Math.random() - 0.5) * 0.25, 0.45, (Math.random() - 0.5) * 0.25);
        stalk.rotation.z = (Math.random() - 0.5) * 0.2;
        reedCluster.add(stalk);
      }
      this.group.add(reedCluster);
      this.interactiveObjects.push(reedCluster);
    }

    const kMarker = buildTrailMarker(-1.8, -2.5, '#7c3aed');
    this.group.add(kMarker);
    this.interactiveObjects.push(kMarker);

    for (let p = -12; p <= 12; p += 8) {
      const palm = buildPalmTree(-2.9, p, 0.9 + Math.random() * 0.25);
      this.group.add(palm);
      this.scrollingProps.push(palm);
      this.interactiveObjects.push(palm);
    }
  }

  public update(dt: number, elapsed: number): void {
    this.waterSurface.update(dt);
    this.boatGroup.position.y = 0.18 + Math.sin(elapsed * 1.8) * 0.05;
    this.boatGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.06;
    this.duckGroup.position.y = 0.12 + Math.sin(elapsed * 2.2) * 0.03;
  }
}
