import * as THREE from 'three';
import { StageKey } from '../types/game';
import { SkyDome } from './SkyDome';
import { KotelStage } from './stages/Kotel';
import { MasadaStage } from './stages/Masada';
import { KinneretStage } from './stages/Kinneret';
import { JaffaStage } from './stages/Jaffa';
import { makeSandTrackTexture } from '../textures/GroundTexture';

export class EnvironmentManager {
  public scene: THREE.Scene;
  public envGroup: THREE.Group;
  public skyDome: SkyDome;
  public groundPlane: THREE.Mesh;
  public groundMat: THREE.MeshStandardMaterial;

  public activeEnvName: StageKey = 'kotel';
  public currentStageInstance: KotelStage | MasadaStage | KinneretStage | JaffaStage | null = null;

  public ambientMotes: THREE.Mesh[] = [];
  public mistMeshes: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.envGroup = new THREE.Group();
    this.scene.add(this.envGroup);

    this.skyDome = new SkyDome();
    this.scene.add(this.skyDome.mesh);

    // Ground plane
    const sandBundle = makeSandTrackTexture();
    this.groundMat = new THREE.MeshStandardMaterial({
      color: '#dfc092',
      bumpMap: sandBundle.bumpMap,
      bumpScale: 0.04,
      roughness: 0.94,
      metalness: 0.0
    });

    const groundGeo = new THREE.PlaneGeometry(140, 140, 64, 64);
    const gPos = groundGeo.attributes.position;
    for (let gi = 0; gi < gPos.count; gi++) {
      const gx = gPos.getX(gi);
      const gy = gPos.getY(gi);
      const distFromTrack = Math.max(0, Math.abs(gx) - 2.1);
      const dune = Math.sin(gx * 0.18 + gy * 0.12) * Math.cos(gy * 0.15) * Math.min(distFromTrack * 0.22, 1.35);
      gPos.setZ(gi, dune);
    }
    groundGeo.computeVertexNormals();

    this.groundPlane = new THREE.Mesh(groundGeo, this.groundMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);

    this.initAmbientMotes();
    this.buildEnv('kotel');
  }

  private initAmbientMotes(): void {
    const moteGeo = new THREE.SphereGeometry(0.024, 6, 6);
    const moteMat = new THREE.MeshBasicMaterial({ color: '#fef08a', transparent: true, opacity: 0.55 });
    for (let am = 0; am < 28; am++) {
      const mote = new THREE.Mesh(moteGeo, moteMat);
      mote.position.set((Math.random() - 0.5) * 9, 0.4 + Math.random() * 2.8, (Math.random() - 0.5) * 9);
      mote.userData = { baseX: mote.position.x, baseY: mote.position.y, phase: Math.random() * 6.28 };
      this.scene.add(mote);
      this.ambientMotes.push(mote);
    }
  }

  public clearEnv(): void {
    while (this.envGroup.children.length > 0) {
      const child = this.envGroup.children[0];
      this.envGroup.remove(child);
      // Recursively dispose geometry and material to prevent GPU leaks
      child.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    }
    this.mistMeshes = [];
    this.currentStageInstance = null;
  }

  public buildEnv(name: StageKey): void {
    this.clearEnv();
    this.activeEnvName = name;

    // Drifting mist
    const mistMat = new THREE.MeshBasicMaterial({
      color: '#cbd5e1',
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    for (let m = 0; m < 4; m++) {
      const mist = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.4), mistMat);
      mist.position.set(-6 + m * 4, 1.3 + (m % 2) * 0.7, -5 - m * 2.5);
      this.envGroup.add(mist);
      this.mistMeshes.push(mist);
    }

    if (name === 'kotel') {
      this.skyDome.setColors('#2874c9', '#f8e4c1');
      this.scene.background = new THREE.Color('#74b2eb');
      if (this.scene.fog) this.scene.fog.color.set('#e8d9c0');
      this.groundMat.color.set('#d8c19e');

      const stage = new KotelStage();
      this.envGroup.add(stage.group);
      this.currentStageInstance = stage;
    } else if (name === 'masada') {
      this.skyDome.setColors('#1e69c4', '#fcd9a8');
      this.scene.background = new THREE.Color('#78b4eb');
      if (this.scene.fog) this.scene.fog.color.set('#eed4b2');
      this.groundMat.color.set('#cfa06b');

      const stage = new MasadaStage();
      this.envGroup.add(stage.group);
      this.currentStageInstance = stage;
    } else if (name === 'kinneret') {
      this.skyDome.setColors('#2589e6', '#d9f0ff');
      this.scene.background = new THREE.Color('#6cb9f5');
      if (this.scene.fog) this.scene.fog.color.set('#d4ecfc');
      this.groundMat.color.set('#c4b47c');

      const stage = new KinneretStage();
      this.envGroup.add(stage.group);
      this.currentStageInstance = stage;
    } else if (name === 'jaffa') {
      this.skyDome.setColors('#f97316', '#fde68a');
      this.scene.background = new THREE.Color('#fb923c');
      if (this.scene.fog) this.scene.fog.color.set('#fed7aa');
      this.groundMat.color.set('#e6c999');

      const stage = new JaffaStage();
      this.envGroup.add(stage.group);
      this.currentStageInstance = stage;
    }
  }

  public getInteractiveObjects(): THREE.Object3D[] {
    return this.currentStageInstance ? this.currentStageInstance.interactiveObjects : [];
  }

  public getScrollingProps(): THREE.Object3D[] {
    return this.currentStageInstance ? this.currentStageInstance.scrollingProps : [];
  }

  public update(dt: number, elapsed: number, dovesTriggered = false): void {
    // Ambient dust motes
    for (let i = 0; i < this.ambientMotes.length; i++) {
      const m = this.ambientMotes[i];
      const ud = m.userData;
      m.position.y = ud.baseY + Math.sin(elapsed * 1.2 + ud.phase) * 0.28;
      m.position.x = ud.baseX + Math.cos(elapsed * 0.8 + ud.phase) * 0.35;
    }

    // Drifting mist
    for (let j = 0; j < this.mistMeshes.length; j++) {
      const mist = this.mistMeshes[j];
      mist.position.x += dt * 0.35;
      if (mist.position.x > 12) mist.position.x = -12;
    }

    // Active stage update
    if (this.currentStageInstance instanceof KotelStage) {
      this.currentStageInstance.updateDoves(dt, elapsed, dovesTriggered);
    } else if (this.currentStageInstance instanceof MasadaStage) {
      this.currentStageInstance.updateBirds(dt);
    } else if (this.currentStageInstance instanceof KinneretStage) {
      this.currentStageInstance.update(dt, elapsed);
    } else if (this.currentStageInstance instanceof JaffaStage) {
      this.currentStageInstance.update(dt, elapsed);
    }
  }
}
