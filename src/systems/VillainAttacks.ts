import * as THREE from 'three';
import { KingCrumbs } from '../entities/KingCrumbs/KingCrumbs';
import { ParticleSystem } from './ParticleSystem';
import { AudioEngine } from '../audio/AudioEngine';
import { JellyDeformation } from '../physics/JellyDeformation';
import { PhysicsState } from '../physics/PhysicsState';
import { Haptics } from '../core/Haptics';

export type FoodType = 'crumb' | 'pickle' | 'chili' | 'crouton';

export interface FlyingFood {
  mesh: THREE.Object3D;
  vel: THREE.Vector3;
  life: number;
  color: string;
  foodType: FoodType;
}

export class VillainAttacks {
  private scene: THREE.Scene;
  private king: KingCrumbs;
  private particles: ParticleSystem;
  private audio: AudioEngine;
  private jelly: JellyDeformation;
  private physicsState: PhysicsState;

  public projectiles: FlyingFood[] = [];
  public throwTimer = 0;
  private foodCycle: FoodType[] = ['crumb', 'pickle', 'chili', 'crouton'];
  private cycleIndex = 0;

  constructor(
    scene: THREE.Scene,
    king: KingCrumbs,
    particles: ParticleSystem,
    audio: AudioEngine,
    jelly: JellyDeformation,
    physicsState: PhysicsState
  ) {
    this.scene = scene;
    this.king = king;
    this.particles = particles;
    this.audio = audio;
    this.jelly = jelly;
    this.physicsState = physicsState;
  }

  private createFoodMesh(type: FoodType): { mesh: THREE.Object3D; color: string } {
    let mesh: THREE.Object3D;
    let color: string;

    switch (type) {
      case 'pickle': {
        color = '#65a30d';
        const geo = new THREE.CylinderGeometry(0.12, 0.12, 0.045, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: '#65a30d',
          roughness: 0.35,
          metalness: 0.1
        });
        mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI * 0.5;
        break;
      }
      case 'chili': {
        color = '#ef4444';
        const geo = new THREE.ConeGeometry(0.075, 0.22, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: '#dc2626',
          roughness: 0.3,
          metalness: 0.2
        });
        mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.z = Math.PI * 0.35;
        break;
      }
      case 'crouton': {
        color = '#f59e0b';
        const geo = new THREE.BoxGeometry(0.13, 0.13, 0.13);
        const mat = new THREE.MeshStandardMaterial({
          color: '#d97706',
          roughness: 0.85
        });
        mesh = new THREE.Mesh(geo, mat);
        break;
      }
      case 'crumb':
      default: {
        color = '#fbbf24';
        const geo = new THREE.DodecahedronGeometry(0.13, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: '#f59e0b',
          roughness: 0.8
        });
        mesh = new THREE.Mesh(geo, mat);
        break;
      }
    }

    mesh.castShadow = true;
    return { mesh, color };
  }

  public throwFood(charWorldPos: THREE.Vector3): void {
    const type = this.foodCycle[this.cycleIndex % this.foodCycle.length];
    this.cycleIndex++;

    const { mesh, color } = this.createFoodMesh(type);

    // Launch origin: King's hand/torso level
    const startPos = this.king.group.position.clone().add(new THREE.Vector3(0, 0.72, 0.1));
    mesh.position.copy(startPos);

    // Ballistic trajectory towards Falafeltchik's body center
    const dirToHero = charWorldPos.clone().sub(startPos).normalize();
    const vel = dirToHero.multiplyScalar(3.5).add(new THREE.Vector3(0, 1.85, 0));

    this.scene.add(mesh);
    this.projectiles.push({
      mesh,
      vel,
      life: 2.6,
      color,
      foodType: type
    });

    // Goofy king windup wobble
    if (this.king.group.userData) {
      this.king.group.userData.wobbleVel = 14.0;
    }

    this.audio.playWhoosh();
  }

  public update(
    dt: number,
    stageIndex: number,
    storyCompleted: boolean,
    charWorldPos: THREE.Vector3
  ): void {
    // Stage 4 (Kotel, index 3): King Crumbs hurls comedic food
    if (stageIndex === 3 && !storyCompleted) {
      this.throwTimer += dt;
      if (this.throwTimer >= 2.5) {
        this.throwTimer = 0;
        this.throwFood(charWorldPos);
      }
    } else {
      if (this.projectiles.length > 0) {
        this.clear();
      }
      this.throwTimer = 0;
    }

    // Update active projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const item = this.projectiles[i];
      item.life -= dt;
      item.vel.y -= 4.4 * dt; // Gravity arc
      item.mesh.position.addScaledVector(item.vel, dt);
      item.mesh.rotation.x += dt * 5.2;
      item.mesh.rotation.y += dt * 4.1;

      // Hit check against Falafeltchik body
      const dist = item.mesh.position.distanceTo(charWorldPos);
      if (dist < 0.70) {
        // "PUNCH" Gamefeel: Jelly deformation impulse & directional recoil
        this.jelly.triggerImpulse(4.5, item.vel.x * 0.25, item.vel.z * 0.25);
        this.physicsState.charVel.x += item.vel.x * 0.35;
        this.physicsState.charVel.z += item.vel.z * 0.35;

        this.particles.spawnSparkles(
          item.mesh.position.x,
          item.mesh.position.y,
          item.mesh.position.z,
          item.color
        );
        this.audio.playBoing(170);
        Haptics.bounce();

        this.scene.remove(item.mesh);
        this.projectiles.splice(i, 1);
      } else if (item.life <= 0 || item.mesh.position.y <= 0.02) {
        this.particles.spawnDust(item.mesh.position.x, 0.05, item.mesh.position.z, 3, 0.2);
        this.scene.remove(item.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  public clear(): void {
    this.projectiles.forEach((p) => {
      this.scene.remove(p.mesh);
    });
    this.projectiles = [];
  }
}
