import * as THREE from 'three';

export class Hummuson {
  public group: THREE.Group;
  public chickpeaBody: THREE.Group;
  public cpHappyGroup: THREE.Group;
  public cpMouth: THREE.Mesh;
  public isHappy = false;

  constructor() {
    this.group = new THREE.Group();

    this.chickpeaBody = new THREE.Group();
    this.chickpeaBody.position.set(0, 0.28, 0);
    this.group.add(this.chickpeaBody);

    const cpSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.165, 22, 18),
      new THREE.MeshStandardMaterial({ color: '#e8d2a6', roughness: 0.72 })
    );
    cpSphere.castShadow = true;
    this.chickpeaBody.add(cpSphere);

    // Big shiny cartoon eyes
    [-0.058, 0.058].forEach((ex) => {
      const ew = new THREE.Mesh(
        new THREE.SphereGeometry(0.064, 16, 14),
        new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.08, metalness: 0.05 })
      );
      ew.scale.set(0.95, 1.08, 0.75);
      ew.position.set(ex, 0.032, 0.135);

      const ep = new THREE.Mesh(
        new THREE.SphereGeometry(0.036, 12, 10),
        new THREE.MeshStandardMaterial({ color: '#1e1b18', roughness: 0.05 })
      );
      ep.position.set(ex, 0.028, 0.172);

      const shine = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 8, 8),
        new THREE.MeshBasicMaterial({ color: '#ffffff' })
      );
      shine.position.set(ex + 0.014, 0.048, 0.195);
      this.chickpeaBody.add(ew, ep, shine);
    });

    this.cpMouth = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 10, 8),
      new THREE.MeshBasicMaterial({ color: '#450a0a' })
    );
    this.cpMouth.position.set(0, -0.055, 0.152);
    this.chickpeaBody.add(this.cpMouth);

    this.cpHappyGroup = new THREE.Group();
    this.cpHappyGroup.visible = false;
    const cpSmile = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.012, 8, 14, Math.PI),
      new THREE.MeshBasicMaterial({ color: '#450a0a' })
    );
    cpSmile.rotation.z = Math.PI;
    cpSmile.position.set(0, -0.04, 0.155);
    this.cpHappyGroup.add(cpSmile);

    [-0.095, 0.095].forEach((cx) => {
      const cheek = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 8, 8),
        new THREE.MeshBasicMaterial({ color: '#fb7185' })
      );
      cheek.scale.set(1.2, 0.7, 0.4);
      cheek.position.set(cx, -0.025, 0.145);
      this.cpHappyGroup.add(cheek);
    });
    this.chickpeaBody.add(this.cpHappyGroup);

    const cpFootMat = new THREE.MeshStandardMaterial({ color: '#d4b886', roughness: 0.8 });
    const cpLeftFoot = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), cpFootMat);
    cpLeftFoot.scale.set(0.85, 0.65, 1.35);
    cpLeftFoot.position.set(-0.065, -0.17, 0.03);

    const cpRightFoot = cpLeftFoot.clone();
    cpRightFoot.position.set(0.065, -0.17, 0.03);
    this.chickpeaBody.add(cpLeftFoot, cpRightFoot);
  }

  public setHappy(happy: boolean): void {
    this.isHappy = happy;
    this.cpHappyGroup.visible = happy;
    this.cpMouth.visible = !happy;
  }

  public reactionTimer = 0;

  public triggerStarReaction(duration = 1.4): void {
    this.reactionTimer = duration;
    this.setHappy(true);
  }

  public update(dt: number, elapsed: number, isRescued: boolean): void {
    if (isRescued) {
      this.chickpeaBody.position.y = 0.28 + Math.abs(Math.sin(elapsed * 6)) * 0.18;
      this.chickpeaBody.rotation.y = elapsed * 3;
    } else if (this.reactionTimer > 0) {
      this.reactionTimer -= dt;
      // Happy excited bounce & spin when a star is collected!
      this.chickpeaBody.position.y = 0.24 + Math.abs(Math.sin(elapsed * 14)) * 0.28;
      this.chickpeaBody.rotation.y += dt * 10;
      if (this.reactionTimer <= 0) {
        this.setHappy(false);
      }
    } else {
      this.chickpeaBody.position.y = 0.28 + Math.sin(elapsed * 3) * 0.025;
      this.chickpeaBody.rotation.y = Math.sin(elapsed * 1.5) * 0.12;
    }
  }
}
