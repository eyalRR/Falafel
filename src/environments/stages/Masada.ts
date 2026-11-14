import * as THREE from 'three';
import { buildScrubTuft, buildTrailMarker } from '../props/ScrubTuft';

export class MasadaStage {
  public group: THREE.Group;
  public interactiveObjects: THREE.Object3D[] = [];
  public scrollingProps: THREE.Object3D[] = [];
  public circlingBirds: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.build();
  }

  private build(): void {
    const cliffMat = new THREE.MeshStandardMaterial({ color: '#b57242', roughness: 0.94 });
    const mesaGroup = new THREE.Group();
    mesaGroup.position.set(-4.2, -0.4, -11.0);
    mesaGroup.userData = { interactType: 'stone', swayAngle: 0, swayVel: 0 };

    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 5.8, 3.6, 8), cliffMat);
    mesa.position.y = 1.8;
    mesa.castShadow = true;
    mesaGroup.add(mesa);

    // Sedimentary rock strata bands
    [0.9, 1.85, 2.75].forEach((sy, idx) => {
      const strata = new THREE.Mesh(
        new THREE.CylinderGeometry(4.9 - idx * 0.55, 5.1 - idx * 0.55, 0.22, 8),
        new THREE.MeshStandardMaterial({ color: idx % 2 === 0 ? '#9a5b32' : '#c98856', roughness: 0.95 })
      );
      strata.position.y = sy;
      mesaGroup.add(strata);
    });

    // Herodian Casemate Fortress Wall atop plateau
    const ruinMat = new THREE.MeshStandardMaterial({ color: '#e3c398', roughness: 0.85 });
    const wallRing = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.65, 8, 1, true), ruinMat);
    wallRing.position.y = 3.92;
    mesaGroup.add(wallRing);

    // Northern Palace
    const palaceTier = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 1.4), ruinMat);
    palaceTier.position.set(0.3, 3.85, 3.2);
    mesaGroup.add(palaceTier);
    for (let col = 0; col < 5; col++) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.95, 8), ruinMat);
      pillar.position.set(-0.7 + col * 0.5, 4.4, 3.4);
      mesaGroup.add(pillar);
    }

    // Snake Path
    const pathMat = new THREE.MeshStandardMaterial({ color: '#f3d9ad', roughness: 0.95 });
    for (let sp = 0; sp < 4; sp++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.42), pathMat);
      seg.position.set(0.4, 0.65 + sp * 0.78, 4.9 - sp * 0.44);
      seg.rotation.z = sp % 2 === 0 ? 0.22 : -0.22;
      mesaGroup.add(seg);
    }
    this.group.add(mesaGroup);
    this.interactiveObjects.push(mesaGroup);

    // Dead Sea shimmering strip
    const deadSea = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 14),
      new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 0.18, metalness: 0.25 })
    );
    deadSea.rotation.x = -Math.PI / 2;
    deadSea.position.set(12, 0.03, -24);
    deadSea.userData = { interactType: 'water' };
    this.group.add(deadSea);
    this.interactiveObjects.push(deadSea);

    // Salt formations
    const saltMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.35 });
    for (let sl = 0; sl < 5; sl++) {
      const salt = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.3, 0.32, 7), saltMat);
      salt.position.set(4.5 + sl * 2.2, 0.16, -16.5 - (sl % 2) * 1.2);
      salt.userData = { interactType: 'pebble', baseY: 0.16, vy: 0, rotVel: 0 };
      this.group.add(salt);
      this.interactiveObjects.push(salt);
    }

    // Rubble scree rocks
    for (let tr = 0; tr < 9; tr++) {
      const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.55, 0), cliffMat);
      const angR = (tr / 9) * Math.PI * 1.4 - 0.5;
      rubble.position.set(-4.2 + Math.cos(angR) * 5.6, 0.25, -11.0 + Math.sin(angR) * 5.6);
      rubble.scale.set(1.3, 0.65, 1.1);
      this.group.add(rubble);
    }

    // Broken column
    const brokenCol = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.7, 8), ruinMat);
    brokenCol.rotation.z = Math.PI * 0.44;
    brokenCol.position.set(-3.2, 3.72, -7.8);
    this.group.add(brokenCol);

    // Stone Cairns
    for (let cn = 0; cn < 2; cn++) {
      const cairn = new THREE.Group();
      cairn.position.set(cn === 0 ? -1.75 : 1.85, 0, cn === 0 ? -3.8 : 1.5);
      cairn.userData = { interactType: 'stone', swayAngle: 0, swayVel: 0 };
      for (let cs = 0; cs < 4; cs++) {
        const stn = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 - cs * 0.03, 0), cliffMat);
        stn.position.y = 0.1 + cs * 0.16;
        stn.scale.set(1.2, 0.65, 1.1);
        cairn.add(stn);
      }
      this.group.add(cairn);
      this.interactiveObjects.push(cairn);
    }

    // Desert scrub
    for (let ms = 0; ms < 5; ms++) {
      const mScrub = buildScrubTuft((ms % 2 === 0 ? -1 : 1) * (1.9 + Math.random() * 1.4), -6 + ms * 3.1);
      this.group.add(mScrub);
      this.interactiveObjects.push(mScrub);
    }

    // Circling birds
    const birdMat = new THREE.MeshBasicMaterial({ color: '#1e293b', side: THREE.DoubleSide });
    for (let bd = 0; bd < 3; bd++) {
      const bird = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.14), birdMat);
      bird.rotation.x = Math.PI / 2;
      bird.userData = { angle: bd * 2.1, radius: 3.4 + bd * 0.9, height: 5.8 + bd * 0.5 };
      this.group.add(bird);
      this.circlingBirds.push(bird);
    }

    // Desert Ibex
    const ibexGroup = new THREE.Group();
    ibexGroup.position.set(-2.3, 0.35, -1.6);
    ibexGroup.userData = { interactType: 'ibex', swayAngle: 0, swayVel: 0 };
    const ibexMat = new THREE.MeshStandardMaterial({ color: '#a16207', roughness: 0.85 });
    const iBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.45), ibexMat);
    iBody.position.y = 0.26;
    const iHead = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.22), ibexMat);
    iHead.position.set(0, 0.44, 0.22);
    [-0.05, 0.05].forEach((hx) => {
      const horn = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 6, 12, Math.PI * 0.85), new THREE.MeshStandardMaterial({ color: '#451a03' }));
      horn.rotation.y = Math.PI / 2;
      horn.position.set(hx, 0.55, 0.10);
      ibexGroup.add(horn);
    });
    ibexGroup.add(iBody, iHead);
    this.group.add(ibexGroup);
    this.interactiveObjects.push(ibexGroup);

    // Trail marker
    const marker = buildTrailMarker(1.75, -2.6, '#dc2626');
    this.group.add(marker);
    this.interactiveObjects.push(marker);

    // Desert boulders
    for (let b = -14; b <= 14; b += 7) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.4, 0), cliffMat);
      rock.position.set((b % 14 === 0 ? 1 : -1) * (2.6 + Math.random() * 1.5), 0.35, b);
      rock.scale.set(1.2, 0.75, 1.1);
      rock.castShadow = true;
      rock.userData = { interactType: 'pebble', baseY: 0.35, vy: 0, rotVel: 0 };
      this.group.add(rock);
      this.scrollingProps.push(rock);
      this.interactiveObjects.push(rock);
    }
  }

  public updateBirds(dt: number): void {
    for (let bd = 0; bd < this.circlingBirds.length; bd++) {
      const bird = this.circlingBirds[bd];
      const ud = bird.userData;
      ud.angle += (0.45 + bd * 0.1) * dt;
      bird.position.set(-4.2 + Math.cos(ud.angle) * ud.radius, ud.height + Math.sin(ud.angle * 2) * 0.3, -11.0 + Math.sin(ud.angle) * ud.radius);
      bird.rotation.z = -ud.angle + Math.PI / 2;
    }
  }
}
