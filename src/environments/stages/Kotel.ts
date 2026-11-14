import * as THREE from 'three';
import { makeStoneTexture } from '../../textures/GroundTexture';
import { buildMenorah } from '../props/Menorah';
import { buildScrubTuft } from '../props/ScrubTuft';
import { buildOliveTree } from '../props/OliveTree';

export class KotelStage {
  public group: THREE.Group;
  public interactiveObjects: THREE.Object3D[] = [];
  public scrollingProps: THREE.Object3D[] = [];
  public doves: THREE.Group[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.build();
  }

  private build(): void {
    const stoneBundle = makeStoneTexture('#e8d5b5', '#b09872');
    const stoneMat = new THREE.MeshStandardMaterial({
      map: stoneBundle.map,
      bumpMap: stoneBundle.bumpMap,
      bumpScale: 0.06,
      roughness: 0.86
    });

    // Iconic Western Wall
    const kotelGroup = new THREE.Group();
    kotelGroup.position.set(5.4, 0, -7.2);
    kotelGroup.rotation.y = -0.35;
    kotelGroup.userData = { interactType: 'kotel' };

    const kotelWall = new THREE.Mesh(new THREE.BoxGeometry(16, 7.6, 1.5), stoneMat);
    kotelWall.position.y = 3.8;
    kotelWall.castShadow = true;
    kotelWall.receiveShadow = true;
    kotelGroup.add(kotelWall);

    // Kvitlach (prayer notes)
    const noteMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 });
    for (let n = 0; n < 24; n++) {
      const note = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.16), noteMat);
      note.position.set(-5.5 + (n % 8) * 1.5 + (Math.random() - 0.5) * 0.4, 0.9 + Math.floor(n / 8) * 0.95, 0.78);
      note.rotation.z = (Math.random() - 0.5) * 0.4;
      kotelGroup.add(note);
    }

    const darkStain = new THREE.Mesh(
      new THREE.BoxGeometry(16.05, 0.55, 1.54),
      new THREE.MeshStandardMaterial({ color: '#6b6352', roughness: 0.96 })
    );
    darkStain.position.y = 0.27;
    kotelGroup.add(darkStain);

    for (let kb = 0; kb < 10; kb++) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.62, 0.14), stoneMat);
      block.position.set(-5.8 + kb * 1.32, 0.9 + (kb % 3) * 1.15, 0.76 + (kb % 2) * 0.04);
      kotelGroup.add(block);
    }
    this.group.add(kotelGroup);
    this.interactiveObjects.push(kotelGroup);

    // Uplights
    [-2.0, 2.5].forEach((lx) => {
      const uplight = new THREE.PointLight('#fbbf24', 0.9, 9);
      uplight.position.set(4.5 + lx, 0.9, -5.8 - lx * 0.35);
      this.group.add(uplight);
    });

    // Perched white doves
    const doveMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 });
    for (let dv = 0; dv < 4; dv++) {
      const dove = new THREE.Group();
      const dBody = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), doveMat);
      dBody.scale.set(1.3, 0.8, 0.8);
      const wL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.22), doveMat);
      wL.position.set(0, 0.04, 0.12);
      const wR = wL.clone();
      wR.position.set(0, 0.04, -0.12);
      dove.add(dBody, wL, wR);
      dove.position.set(2.8 + dv * 1.4, 5.2 + (dv % 2) * 0.9, -5.9 - dv * 0.45);
      dove.userData = { baseY: dove.position.y, vy: 0, phase: dv * 1.4, wL, wR };
      this.group.add(dove);
      this.doves.push(dove);
    }

    // Balustrade & Scrubs
    const bal = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.75, 7.5), stoneMat);
    bal.position.set(-1.9, 0.37, -3.5);
    bal.castShadow = true;
    this.group.add(bal);

    for (let sc = 0; sc < 4; sc++) {
      const scrub = buildScrubTuft(-2.4 + (sc % 2) * 4.9, -4 + sc * 3.2);
      this.group.add(scrub);
      this.interactiveObjects.push(scrub);
    }

    const menorah = buildMenorah(2.5, 0, -4.6);
    this.group.add(menorah);
    this.interactiveObjects.push(menorah);

    // Caper plants
    const caperMat = new THREE.MeshStandardMaterial({ color: '#4d8a2a', roughness: 0.8 });
    for (let c = 0; c < 10; c++) {
      const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.20, 0), caperMat);
      shrub.position.set(2.2 + c * 0.8, 2.5 + (c % 3) * 1.4, -5.6 - c * 0.28);
      shrub.userData = { interactType: 'shrub', swayAngle: 0, swayVel: 0 };
      this.group.add(shrub);
      this.interactiveObjects.push(shrub);
    }

    // Golden Dome & Drum in distance
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.25, metalness: 0.6 })
    );
    dome.position.set(7.5, 8.2, -16);
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 2.2, 16), stoneMat);
    drum.position.set(7.5, 7.1, -16);
    this.group.add(dome, drum);

    // Stone Arches
    for (let a = -12; a <= 12; a += 8) {
      const archGroup = new THREE.Group();
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.9, 0.75), stoneMat);
      p1.position.set(-3.6, 1.45, a);
      p1.castShadow = true;
      archGroup.add(p1);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.42, 1.15), stoneMat);
      cap.position.set(-3.6, 3.0, a);
      archGroup.add(cap);
      archGroup.userData = { interactType: 'stone', swayAngle: 0, swayVel: 0 };
      this.group.add(archGroup);
      this.scrollingProps.push(archGroup);
      this.interactiveObjects.push(archGroup);
    }

    const olive = buildOliveTree(-2.7, -3.5, 0.95);
    this.group.add(olive);
    this.interactiveObjects.push(olive);
  }

  public updateDoves(dt: number, elapsed: number, dovesTriggered: boolean): void {
    for (let dv = 0; dv < this.doves.length; dv++) {
      const d = this.doves[dv];
      const ud = d.userData;
      if (dovesTriggered) {
        ud.vy += 8.5 * dt;
        d.position.y += ud.vy * dt;
        d.position.x += Math.sin(ud.phase + elapsed * 3) * 1.8 * dt;
        d.position.z += Math.cos(ud.phase + elapsed * 3) * 1.8 * dt;
        const flap = Math.sin(elapsed * 28 + ud.phase) * 0.9;
        ud.wL.rotation.z = flap;
        ud.wR.rotation.z = -flap;
        if (d.position.y > 14) {
          d.position.y = ud.baseY;
          ud.vy = 0;
        }
      } else {
        d.position.y = ud.baseY + Math.sin(elapsed * 2 + ud.phase) * 0.05;
        ud.wL.rotation.z = 0;
        ud.wR.rotation.z = 0;
      }
    }
  }
}
