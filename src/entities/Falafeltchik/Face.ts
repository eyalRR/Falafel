import * as THREE from 'three';

export interface EyeElement {
  group: THREE.Group;
  eyelid: THREE.Mesh;
}

export class FalafelFace {
  public group: THREE.Group;
  public leftEye: EyeElement;
  public rightEye: EyeElement;
  public leftBrow: THREE.Group;
  public rightBrow: THREE.Group;
  public mouthGroup: THREE.Group;

  private blinkTimer = 0;
  private surpriseTimer = 0;

  constructor() {
    this.group = new THREE.Group();

    this.leftEye = this.createEye(-0.145);
    this.rightEye = this.createEye(0.145);
    this.group.add(this.leftEye.group, this.rightEye.group);

    this.leftBrow = this.createBrow(-0.15, 0.16);
    this.rightBrow = this.createBrow(0.15, -0.16);
    this.group.add(this.leftBrow, this.rightBrow);

    this.mouthGroup = this.createMouth();
    this.group.add(this.mouthGroup);
  }

  private createEye(xPos: number): EyeElement {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(xPos, 0.08, 0.53);

    const sclera = new THREE.Mesh(
      new THREE.SphereGeometry(0.145, 24, 20),
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.15, metalness: 0.05 })
    );
    sclera.scale.set(0.95, 1.08, 0.65);
    eyeGroup.add(sclera);

    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.068, 20, 16),
      new THREE.MeshStandardMaterial({ color: '#3b210e', roughness: 0.12 })
    );
    iris.position.set(xPos < 0 ? 0.015 : -0.015, -0.01, 0.065);
    iris.scale.set(1, 1.05, 0.65);
    eyeGroup.add(iris);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#09090b' })
    );
    pupil.position.set(iris.position.x, -0.01, 0.095);
    pupil.scale.set(1, 1, 0.5);
    eyeGroup.add(pupil);

    const highlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 10, 8),
      new THREE.MeshBasicMaterial({ color: '#ffffff' })
    );
    highlight.position.set(iris.position.x + 0.022, 0.022, 0.108);
    eyeGroup.add(highlight);

    const eyelid = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.52),
      new THREE.MeshStandardMaterial({ color: '#9c4e18', roughness: 0.85 })
    );
    eyelid.scale.set(0.97, 1.1, 0.68);
    eyelid.rotation.x = -Math.PI * 0.55; // open
    eyeGroup.add(eyelid);

    return { group: eyeGroup, eyelid };
  }

  private createBrow(xPos: number, tilt: number): THREE.Group {
    const browMat = new THREE.MeshStandardMaterial({ color: '#3b1e0a', roughness: 0.75 });
    const g = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.16, 10), browMat);
    bar.rotation.z = Math.PI / 2;
    g.add(bar);

    const cap1 = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), browMat);
    cap1.position.x = -0.08;
    const cap2 = cap1.clone();
    cap2.position.x = 0.08;
    g.add(cap1, cap2);

    g.position.set(xPos, 0.255, 0.55);
    g.rotation.z = tilt;
    return g;
  }

  private createMouth(): THREE.Group {
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.18, 0.54);

    const mouthCavity = new THREE.Mesh(
      new THREE.SphereGeometry(0.175, 24, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: '#450a0a', roughness: 0.7, side: THREE.DoubleSide })
    );
    mouthCavity.scale.set(1.15, 0.95, 0.55);
    mouthCavity.rotation.x = 0.2;
    mouthGroup.add(mouthCavity);

    const tongue = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 18, 12),
      new THREE.MeshStandardMaterial({ color: '#ef6a6e', roughness: 0.35 })
    );
    tongue.scale.set(1.05, 0.55, 0.85);
    tongue.position.set(0, -0.08, 0.035);
    mouthGroup.add(tongue);

    return mouthGroup;
  }

  public triggerSurprise(): void {
    this.surpriseTimer = 0.65;
  }

  public update(dt: number): void {
    this.blinkTimer += dt;
    const isBlinking = (this.blinkTimer % 3.6) > 3.45;
    const lidRot = isBlinking ? 0.05 : -Math.PI * 0.55;

    this.leftEye.eyelid.rotation.x = THREE.MathUtils.lerp(this.leftEye.eyelid.rotation.x, lidRot, dt * 24);
    this.rightEye.eyelid.rotation.x = THREE.MathUtils.lerp(this.rightEye.eyelid.rotation.x, lidRot, dt * 24);

    if (this.surpriseTimer > 0) {
      this.surpriseTimer -= dt;
      this.leftBrow.position.y = THREE.MathUtils.lerp(this.leftBrow.position.y, 0.30, dt * 18);
      this.rightBrow.position.y = THREE.MathUtils.lerp(this.rightBrow.position.y, 0.30, dt * 18);
    } else {
      this.leftBrow.position.y = THREE.MathUtils.lerp(this.leftBrow.position.y, 0.255, dt * 10);
      this.rightBrow.position.y = THREE.MathUtils.lerp(this.rightBrow.position.y, 0.255, dt * 10);
    }
  }
}
