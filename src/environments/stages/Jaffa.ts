import * as THREE from 'three';
import { WaterSurface } from '../WaterSurface';
import { makeStoneTexture } from '../../textures/GroundTexture';
import { buildOliveTree } from '../props/OliveTree';
import { buildPalmTree } from '../props/PalmTree';

export class JaffaStage {
  public group: THREE.Group;
  public interactiveObjects: THREE.Object3D[] = [];
  public scrollingProps: THREE.Object3D[] = [];
  public waterSurface: WaterSurface;
  public distantSailboats: THREE.Group[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.waterSurface = new WaterSurface('#0f766e', '#14b8a6', 45, 80);
    this.build();
  }

  private build(): void {
    const stoneBundle = makeStoneTexture('#e8d5b5', '#b09872');
    const jaffaMat = new THREE.MeshStandardMaterial({
      map: stoneBundle.map,
      bumpMap: stoneBundle.bumpMap,
      bumpScale: 0.055,
      color: '#f3d5a5',
      roughness: 0.85
    });

    // Mediterranean Sea on left
    this.waterSurface.mesh.position.set(-24.5, 0.08, 0);
    this.waterSurface.mesh.userData = { interactType: 'water' };
    this.group.add(this.waterSurface.mesh);
    this.interactiveObjects.push(this.waterSurface.mesh);

    // Wet sand strip
    const wetSandJ = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 45),
      new THREE.MeshStandardMaterial({ color: '#9c7c4e', roughness: 0.22, metalness: 0.12 })
    );
    wetSandJ.rotation.x = -Math.PI / 2;
    wetSandJ.position.set(-2.05, 0.03, 0);
    this.group.add(wetSandJ);

    // Fishing crates & rope
    const crateMat = new THREE.MeshStandardMaterial({ color: '#926239', roughness: 0.9 });
    const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), crateMat);
    crate1.position.set(-1.75, 0.18, -3.2);
    crate1.rotation.y = 0.22;
    crate1.castShadow = true;
    const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.36), crateMat);
    crate2.position.set(-1.72, 0.50, -3.22);
    crate2.rotation.y = -0.35;
    const ropeCoil = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.04, 8, 16),
      new THREE.MeshStandardMaterial({ color: '#d6b88d', roughness: 0.95 })
    );
    ropeCoil.rotation.x = Math.PI / 2;
    ropeCoil.position.set(-1.55, 0.05, -2.6);
    this.group.add(crate1, crate2, ropeCoil);

    // Suspicious street cat
    const catGroup = new THREE.Group();
    catGroup.position.set(-1.35, 0, -2.0);
    catGroup.userData = { interactType: 'cat', swayAngle: 0, swayVel: 0 };
    const catMat = new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.8 });
    const cBody = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), catMat);
    cBody.scale.set(0.9, 1.1, 1.3);
    cBody.position.y = 0.20;
    const cHead = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), catMat);
    cHead.position.set(0, 0.40, 0.12);
    [-0.06, 0.06].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.10, 4), catMat);
      ear.position.set(ex, 0.52, 0.12);
      catGroup.add(ear);
    });
    const cTail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 6), catMat);
    cTail.position.set(0, 0.30, -0.20);
    cTail.rotation.x = -0.6;
    catGroup.add(cBody, cHead, cTail);
    this.group.add(catGroup);
    this.interactiveObjects.push(catGroup);

    // Streetlamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(2.1, 0, -4.2);
    lampGroup.rotation.z = 0.04;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.4, 8), new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6 }));
    pole.position.y = 1.2;
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: '#fef08a' }));
    lantern.position.y = 2.45;
    const lampLight = new THREE.PointLight('#fbbf24', 0.85, 7);
    lampLight.position.y = 2.4;
    lampGroup.add(pole, lantern, lampLight);
    this.group.add(lampGroup);

    // Distant sailboats
    for (let sb = 0; sb < 2; sb++) {
      const sBoat = new THREE.Group();
      sBoat.position.set(-13 - sb * 5, 0.15, -14 - sb * 4);
      const sHull = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.28, 0.55), crateMat);
      const sSail = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.4, 3), new THREE.MeshStandardMaterial({ color: '#f8fafc', side: THREE.DoubleSide }));
      sSail.position.y = 0.85;
      sBoat.add(sHull, sSail);
      this.group.add(sBoat);
      this.distantSailboats.push(sBoat);
    }

    const andromeda = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 0), new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.9 }));
    andromeda.position.set(-6.5, 0.3, -9.5);
    andromeda.scale.set(1.4, 0.7, 1.1);
    andromeda.userData = { interactType: 'pebble', baseY: 0.3, vy: 0, rotVel: 0 };
    this.group.add(andromeda);
    this.interactiveObjects.push(andromeda);

    // Jaffa Clock Tower
    const towerGroup = new THREE.Group();
    towerGroup.position.set(6.2, 0, -10.5);
    towerGroup.userData = { interactType: 'clocktower', swayAngle: 0, swayVel: 0 };

    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.6, 5.8, 2.6), jaffaMat);
    tower.position.y = 2.9;
    tower.castShadow = true;
    towerGroup.add(tower);

    const clockDial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.12, 20),
      new THREE.MeshBasicMaterial({ color: '#fffbeb' })
    );
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 4.6, 1.32);
    towerGroup.add(clockDial);

    const handH = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, 0.04), new THREE.MeshBasicMaterial({ color: '#1e293b' }));
    handH.position.set(0.06, 4.7, 1.38);
    handH.rotation.z = -0.5;
    const handM = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.04), new THREE.MeshBasicMaterial({ color: '#1e293b' }));
    handM.position.set(-0.08, 4.68, 1.39);
    handM.rotation.z = 0.9;
    const clockGlow = new THREE.PointLight('#fde68a', 0.75, 10);
    clockGlow.position.set(0, 4.6, 2.2);
    towerGroup.add(handH, handM, clockGlow);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.1, 4), new THREE.MeshStandardMaterial({ color: '#0f766e', roughness: 0.6 }));
    spire.position.y = 6.85;
    spire.rotation.y = Math.PI / 4;
    towerGroup.add(spire);
    this.group.add(towerGroup);
    this.interactiveObjects.push(towerGroup);

    // Sandstone house with blue shutters
    const house = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.4, 2.2), jaffaMat);
    house.position.set(3.4, 1.2, -5.8);
    house.castShadow = true;
    const shutterMat = new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.6 });
    const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.12), shutterMat);
    shutter.position.set(3.4, 1.4, -4.68);
    this.group.add(house, shutter);

    // Orange tree
    const orangeTree = buildOliveTree(2.4, -3.2, 0.85);
    for (let og = 0; og < 6; og++) {
      const orange = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.4 }));
      orange.position.set((Math.random() - 0.5) * 0.9, 1.55 + Math.random() * 0.4, (Math.random() - 0.5) * 0.7);
      orangeTree.add(orange);
    }
    this.group.add(orangeTree);
    this.interactiveObjects.push(orangeTree);

    for (let jp = -12; jp <= 12; jp += 8) {
      const jPalm = buildPalmTree(2.8, jp, 0.95);
      this.group.add(jPalm);
      this.scrollingProps.push(jPalm);
      this.interactiveObjects.push(jPalm);
    }
  }

  public update(dt: number, elapsed: number): void {
    this.waterSurface.update(dt);
    for (let sb = 0; sb < this.distantSailboats.length; sb++) {
      const sBoat = this.distantSailboats[sb];
      sBoat.position.y = 0.15 + Math.sin(elapsed * 1.4 + sb) * 0.04;
      sBoat.rotation.z = Math.sin(elapsed * 1.1 + sb) * 0.05;
    }
  }
}
