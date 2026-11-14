import * as THREE from 'three';

export class Lighting {
  public group: THREE.Group;
  public hemiLight: THREE.HemisphereLight;
  public sunLight: THREE.DirectionalLight;
  public rimLight: THREE.DirectionalLight;

  constructor() {
    this.group = new THREE.Group();

    this.hemiLight = new THREE.HemisphereLight('#fff8e8', '#b88a58', 0.95);
    this.group.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight('#fff3d6', 1.35);
    this.sunLight.position.set(5, 9, 6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 26;
    const d = 5;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.group.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight('#b7dcff', 0.45);
    this.rimLight.position.set(-4, 4, -5);
    this.group.add(this.rimLight);
  }

  public setDim(dimRatio: number): void {
    // dimRatio from 0 (bright) to 1 (dimmed)
    this.sunLight.intensity = THREE.MathUtils.lerp(1.35, 0.45, dimRatio);
    this.hemiLight.intensity = THREE.MathUtils.lerp(0.95, 0.55, dimRatio);
  }
}
