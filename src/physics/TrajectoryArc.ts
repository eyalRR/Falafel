import * as THREE from 'three';

export class TrajectoryArc {
  public group: THREE.Group;
  private instancedMesh: THREE.InstancedMesh;
  private count = 18;
  private dummy = new THREE.Object3D();
  private isVisible = false;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.name = 'TrajectoryArc';

    const geo = new THREE.SphereGeometry(0.045, 12, 10);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0.85
    });

    this.instancedMesh = new THREE.InstancedMesh(geo, mat, this.count);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMesh.visible = false;
    this.group.add(this.instancedMesh);
    scene.add(this.group);
  }

  public show(): void {
    this.isVisible = true;
    this.instancedMesh.visible = true;
  }

  public hide(): void {
    this.isVisible = false;
    this.instancedMesh.visible = false;
  }

  public update(
    origin: THREE.Vector3,
    velocity: THREE.Vector3,
    gravity = -14.5,
    drag = 0.985
  ): void {
    if (!this.isVisible) this.show();

    const simPos = origin.clone();
    const simVel = velocity.clone();
    const dt = 0.042;

    for (let i = 0; i < this.count; i++) {
      // Step simulation
      simVel.y += gravity * dt;
      simVel.x *= drag;
      simVel.z *= drag;

      simPos.x += simVel.x * dt;
      simPos.y += simVel.y * dt;
      simPos.z += simVel.z * dt;

      // Ground limit
      if (simPos.y < 0.05) {
        simPos.y = 0.05;
        simVel.y = -simVel.y * 0.4;
      }

      this.dummy.position.copy(simPos);
      // Soft tapering scale along the arc
      const scaleFactor = Math.max(0.35, 1.0 - (i / this.count) * 0.55);
      this.dummy.scale.set(scaleFactor, scaleFactor, scaleFactor);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  public destroy(): void {
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}
