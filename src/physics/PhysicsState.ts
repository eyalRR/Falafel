import * as THREE from 'three';
import { MotionMode } from '../types/game';

export class PhysicsState {
  public motionMode: MotionMode = 'run';
  public jumpVel = 0;
  public jumpY = 0;
  public isGrounded = true;
  public rollAngle = 0;
  public runPhase = 0;
  public lastStepSign = 1;
  public charVel = new THREE.Vector3(0, 0, 0);
  public isThrown = false;
  public isGrabbing = false;

  public triggerJump(): boolean {
    if (this.motionMode === 'sit') {
      this.motionMode = 'run';
    }
    if (this.isGrounded) {
      this.jumpVel = 5.4;
      this.isGrounded = false;
      return true;
    }
    return false;
  }
}
