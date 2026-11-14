import * as THREE from 'three';

export class JellyDeformation {
  public scaleY = 1.0;
  public velY = 0.0;
  public tiltX = 0;
  public tiltVelX = 0;
  public tiltZ = 0;
  public tiltVelZ = 0;

  public triggerImpulse(strength: number, dirX = 0, dirZ = 0): void {
    this.velY -= strength;
    this.tiltVelX += dirZ * strength * 0.45;
    this.tiltVelZ -= dirX * strength * 0.45;
  }

  public update(dt: number, bodyCenter: THREE.Group): void {
    // Harmonic spring on Y scale (squash/stretch)
    this.velY += (1.0 - this.scaleY) * 110 * dt;
    this.velY *= Math.exp(-9.5 * dt);
    this.scaleY += this.velY * dt;

    // Volume-preserving squash: invXZ = 1 / sqrt(scaleY)
    const invXZ = Math.max(0.65, Math.min(1.45, 1 / Math.sqrt(Math.max(0.45, this.scaleY))));
    const clampedY = Math.max(0.55, Math.min(1.55, this.scaleY));
    bodyCenter.scale.set(invXZ, clampedY, invXZ);

    // Tilt springs
    this.tiltVelX += (-this.tiltX) * 90 * dt;
    this.tiltVelX *= Math.exp(-9.0 * dt);
    this.tiltX += this.tiltVelX * dt;

    this.tiltVelZ += (-this.tiltZ) * 90 * dt;
    this.tiltVelZ *= Math.exp(-9.0 * dt);
    this.tiltZ += this.tiltVelZ * dt;

    bodyCenter.rotation.x = this.tiltX;
    bodyCenter.rotation.z = this.tiltZ;
  }
}
