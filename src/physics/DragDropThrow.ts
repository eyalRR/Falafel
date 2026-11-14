import * as THREE from 'three';
import { PhysicsState } from './PhysicsState';
import { JellyDeformation } from './JellyDeformation';
import { EventBus } from '../core/EventBus';

export interface ThrowHistoryPoint {
  pos: THREE.Vector3;
  t: number;
}

export class DragDropThrow {
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  private characterRoot: THREE.Group;
  private physicsState: PhysicsState;
  private jelly: JellyDeformation;
  private eventBus: EventBus;

  private raycaster = new THREE.Raycaster();
  private grabPlane = new THREE.Plane();
  private grabOffset = new THREE.Vector3();
  private grabIntersect = new THREE.Vector3();
  private throwHistory: ThrowHistoryPoint[] = [];

  private pointerDownPos = { x: 0, y: 0 };
  private pointerDownTime = 0;
  public onControlsToggle?: (enabled: boolean) => void;
  public onWorldTap?: (raycaster: THREE.Raycaster) => void;

  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement,
    characterRoot: THREE.Group,
    physicsState: PhysicsState,
    jelly: JellyDeformation,
    eventBus: EventBus
  ) {
    this.camera = camera;
    this.domElement = domElement;
    this.characterRoot = characterRoot;
    this.physicsState = physicsState;
    this.jelly = jelly;
    this.eventBus = eventBus;

    this.bindEvents();
  }

  private getNDC(clientX: number, clientY: number): THREE.Vector2 {
    return new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
  }

  private bindEvents(): void {
    this.domElement.addEventListener('pointerdown', (e) => {
      this.pointerDownPos.x = e.clientX;
      this.pointerDownPos.y = e.clientY;
      this.pointerDownTime = performance.now();

      this.raycaster.setFromCamera(this.getNDC(e.clientX, e.clientY), this.camera);
      const hits = this.raycaster.intersectObject(this.characterRoot, true);
      if (hits.length > 0) {
        this.physicsState.isGrabbing = true;
        this.physicsState.isThrown = false;
        this.physicsState.charVel.set(0, 0, 0);
        if (this.onControlsToggle) this.onControlsToggle(false);

        const camDir = new THREE.Vector3();
        this.camera.getWorldDirection(camDir);
        this.grabPlane.setFromNormalAndCoplanarPoint(camDir.negate(), hits[0].point);
        this.grabOffset.copy(this.characterRoot.position).sub(hits[0].point);
        this.throwHistory = [{ pos: this.characterRoot.position.clone(), t: performance.now() }];
        this.jelly.velY = 2.8;
        this.eventBus.emit('sound:boing', 280);
      }
    });

    this.domElement.addEventListener('pointermove', (e) => {
      if (!this.physicsState.isGrabbing) return;
      this.raycaster.setFromCamera(this.getNDC(e.clientX, e.clientY), this.camera);
      if (this.raycaster.ray.intersectPlane(this.grabPlane, this.grabIntersect)) {
        const nextPos = this.grabIntersect.add(this.grabOffset);
        nextPos.x = THREE.MathUtils.clamp(nextPos.x, -3.2, 3.2);
        nextPos.y = THREE.MathUtils.clamp(nextPos.y, 0.25, 3.8);
        nextPos.z = THREE.MathUtils.clamp(nextPos.z, -3.2, 3.2);
        this.characterRoot.position.copy(nextPos);
        const now = performance.now();
        this.throwHistory.push({ pos: nextPos.clone(), t: now });
        if (this.throwHistory.length > 5) this.throwHistory.shift();
      }
    });

    this.domElement.addEventListener('pointerup', (e) => {
      if (this.physicsState.isGrabbing) {
        this.physicsState.isGrabbing = false;
        if (this.onControlsToggle) this.onControlsToggle(true);

        if (this.throwHistory.length >= 2) {
          const first = this.throwHistory[0];
          const last = this.throwHistory[this.throwHistory.length - 1];
          const dtSec = Math.max((last.t - first.t) / 1000, 0.016);
          const vx = (last.pos.x - first.pos.x) / dtSec;
          const vy = (last.pos.y - first.pos.y) / dtSec;
          const vz = (last.pos.z - first.pos.z) / dtSec;
          const speed = Math.hypot(vx, vy, vz);
          if (speed > 0.7 || this.characterRoot.position.y > 0.15) {
            this.physicsState.charVel.set(vx, vy, vz).clampLength(0, 14);
            this.physicsState.isThrown = true;
            if (speed > 2.2) this.eventBus.emit('sound:whoosh');
            return;
          }
        }
        this.jelly.triggerImpulse(4.0, 0.2, 0.2);
        return;
      }

      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      const dist = Math.hypot(dx, dy);
      const dt = performance.now() - this.pointerDownTime;
      if (dist < 14 && dt < 300) {
        this.raycaster.setFromCamera(this.getNDC(e.clientX, e.clientY), this.camera);
        const hitsChar = this.raycaster.intersectObject(this.characterRoot, true);
        if (hitsChar.length > 0) return;

        if (this.onWorldTap) {
          this.onWorldTap(this.raycaster);
        }
      }
    });
  }

  public update(dt: number): void {
    if (this.physicsState.isThrown) {
      this.physicsState.charVel.y -= 14.5 * dt;
      this.physicsState.charVel.x *= 0.985;
      this.physicsState.charVel.z *= 0.985;

      this.characterRoot.position.x += this.physicsState.charVel.x * dt;
      this.characterRoot.position.y += this.physicsState.charVel.y * dt;
      this.characterRoot.position.z += this.physicsState.charVel.z * dt;

      // Ground bounce
      if (this.characterRoot.position.y <= 0) {
        this.characterRoot.position.y = 0;
        if (Math.abs(this.physicsState.charVel.y) > 1.2) {
          this.physicsState.charVel.y = -this.physicsState.charVel.y * 0.48;
          this.jelly.triggerImpulse(2.4, 0.1, 0.1);
          this.eventBus.emit('fx:land', { pos: this.characterRoot.position });
        } else {
          this.physicsState.charVel.set(0, 0, 0);
          this.physicsState.isThrown = false;
        }
      }

      // Air / wall bounds
      if (Math.abs(this.characterRoot.position.x) > 3.2) {
        this.characterRoot.position.x = Math.sign(this.characterRoot.position.x) * 3.2;
        this.physicsState.charVel.x *= -0.5;
      }
      if (Math.abs(this.characterRoot.position.z) > 3.2) {
        this.characterRoot.position.z = Math.sign(this.characterRoot.position.z) * 3.2;
        this.physicsState.charVel.z *= -0.5;
      }
    }
  }
}
