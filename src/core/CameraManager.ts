import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraManager {
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  constructor(domElement: HTMLElement) {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 160);

    this.controls = new OrbitControls(this.camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 2.4;
    this.controls.maxDistance = 8.5;
    this.controls.minPolarAngle = 0.25;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.target.set(0, 0.95, 0);

    this.applyResponsive(true);
  }

  public applyResponsive(resetPosition = false): void {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;

    if (aspect < 0.75) {
      this.camera.fov = 48;
    } else if (aspect < 1.1) {
      this.camera.fov = 44;
    } else {
      this.camera.fov = 38;
    }
    this.camera.updateProjectionMatrix();

    if (resetPosition) {
      this.resetPosition();
    }
  }

  public resetPosition(): void {
    const maxDist = this.controls.maxDistance || 8.5;
    const dir = new THREE.Vector3(0.46, 0.28, 0.84).normalize();
    this.controls.target.set(0, 0.98, 0);
    this.camera.position.copy(this.controls.target).addScaledVector(dir, maxDist);
    this.controls.update();
  }

  public update(): void {
    this.controls.update();
  }
}
