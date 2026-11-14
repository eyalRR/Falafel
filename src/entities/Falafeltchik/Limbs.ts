import * as THREE from 'three';

export class FalafelLimbs {
  public leftArm: THREE.Group;
  public rightArm: THREE.Group;
  public leftLeg: THREE.Group;
  public rightLeg: THREE.Group;

  constructor() {
    const limbMat = new THREE.MeshStandardMaterial({ color: '#d97724', roughness: 0.92 });
    const sweatbandMat = new THREE.MeshStandardMaterial({ color: '#881337', roughness: 0.75 });
    const sockMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.8 });
    const shoeBlueMat = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.55 });
    const soleMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.7 });

    const createArm = (side: number) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.56, -0.04, 0.04);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.34, 12), limbMat);
      arm.rotation.z = side * Math.PI * 0.36;
      arm.position.set(side * 0.14, -0.06, 0.04);
      arm.castShadow = true;
      pivot.add(arm);

      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.07, 12), sweatbandMat);
      band.rotation.z = side * Math.PI * 0.36;
      band.position.set(side * 0.25, -0.11, 0.06);
      pivot.add(band);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.088, 14, 12), limbMat);
      hand.position.set(side * 0.32, -0.14, 0.08);
      hand.castShadow = true;
      pivot.add(hand);

      return pivot;
    };

    const createLeg = (side: number) => {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(side * 0.22, -0.50, 0.02);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.070, 0.36, 12), limbMat);
      thigh.position.set(0, -0.18, 0);
      thigh.castShadow = true;
      hipPivot.add(thigh);

      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.078, 0.09, 12), sockMat);
      sock.position.set(0, -0.35, 0);
      hipPivot.add(sock);

      const footGroup = new THREE.Group();
      footGroup.position.set(0, -0.43, 0.05);

      const shoeUpper = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), shoeBlueMat);
      shoeUpper.scale.set(0.95, 0.72, 1.45);
      shoeUpper.castShadow = true;
      footGroup.add(shoeUpper);

      const shoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.055, 0.32), soleMat);
      shoeSole.position.set(0, -0.065, 0.01);
      shoeSole.castShadow = true;
      footGroup.add(shoeSole);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.14), soleMat);
      stripe.position.set(0, -0.01, -0.01);
      footGroup.add(stripe);

      hipPivot.add(footGroup);
      return hipPivot;
    };

    this.leftArm = createArm(-1);
    this.rightArm = createArm(1);
    this.leftLeg = createLeg(-1);
    this.rightLeg = createLeg(1);
  }

  public animateRun(elapsed: number, speed = 10): void {
    const sin1 = Math.sin(elapsed * speed);
    const cos1 = Math.cos(elapsed * speed);

    this.leftArm.rotation.x = sin1 * 0.65;
    this.rightArm.rotation.x = -sin1 * 0.65;

    this.leftLeg.rotation.x = -sin1 * 0.75;
    this.rightLeg.rotation.x = sin1 * 0.75;

    this.leftLeg.position.y = -0.50 + Math.max(0, cos1) * 0.08;
    this.rightLeg.position.y = -0.50 + Math.max(0, -cos1) * 0.08;
  }

  public animateSit(): void {
    this.leftArm.rotation.set(0, 0, -0.2);
    this.rightArm.rotation.set(0, 0, 0.2);
    this.leftLeg.rotation.set(-Math.PI * 0.42, 0.25, 0);
    this.rightLeg.rotation.set(-Math.PI * 0.42, -0.25, 0);
    this.leftLeg.position.y = -0.32;
    this.rightLeg.position.y = -0.32;
  }

  public animateRoll(rotAngle: number): void {
    this.leftArm.rotation.set(0, 0, -0.5);
    this.rightArm.rotation.set(0, 0, 0.5);
    this.leftLeg.rotation.set(0, 0, 0);
    this.rightLeg.rotation.set(0, 0, 0);
    this.leftLeg.position.y = -0.45;
    this.rightLeg.position.y = -0.45;
  }
}
