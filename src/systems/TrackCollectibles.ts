import * as THREE from 'three';
import { EventBus } from '../core/EventBus';
import { ParticleSystem } from './ParticleSystem';
import { AudioEngine } from '../audio/AudioEngine';
import { Haptics } from '../core/Haptics';

export interface SesameSeedItem {
  mesh: THREE.Mesh;
  baseY: number;
  phase: number;
}

export class TrackCollectibles {
  private scene: THREE.Scene;
  private particles: ParticleSystem;
  private audio: AudioEngine;
  private eventBus: EventBus;

  public group: THREE.Group;
  public seeds: SesameSeedItem[] = [];
  public totalCollected = 0;

  constructor(
    scene: THREE.Scene,
    particles: ParticleSystem,
    audio: AudioEngine,
    eventBus: EventBus
  ) {
    this.scene = scene;
    this.particles = particles;
    this.audio = audio;
    this.eventBus = eventBus;

    this.group = new THREE.Group();
    this.group.name = 'TrackCollectibles';
    this.scene.add(this.group);

    this.buildSeeds();
  }

  private buildSeeds(): void {
    const geo = new THREE.SphereGeometry(0.075, 10, 8);
    geo.scale(1.0, 1.7, 0.9);

    const mat = new THREE.MeshStandardMaterial({
      color: '#fef08a',
      emissive: '#eab308',
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.1
    });

    const count = 14;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      const x = (Math.random() - 0.5) * 2.6;
      const z = (i / count) * 32 - 16;
      const baseY = 0.32 + Math.random() * 0.28;

      mesh.position.set(x, baseY, z);
      mesh.rotation.z = Math.random() * Math.PI;
      this.group.add(mesh);

      this.seeds.push({
        mesh,
        baseY,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  public update(dt: number, elapsed: number, scrollSpeed: number, charPos: THREE.Vector3): void {
    for (let i = 0; i < this.seeds.length; i++) {
      const item = this.seeds[i];
      const mesh = item.mesh;

      // Treadmill scroll
      mesh.position.z += scrollSpeed * dt;
      if (mesh.position.z > 14) {
        mesh.position.z -= 32;
        mesh.position.x = (Math.random() - 0.5) * 2.6;
      }

      // Gentle floating bob & spin
      mesh.position.y = item.baseY + Math.sin(elapsed * 4.2 + item.phase) * 0.04;
      mesh.rotation.y += dt * 2.8;

      // Collision check with Falafeltchik
      if (mesh.position.distanceTo(charPos) < 0.58) {
        this.totalCollected++;
        this.particles.spawnSparkles(mesh.position.x, mesh.position.y, mesh.position.z, '#fde047');
        this.audio.playCrunch();
        Haptics.collect();

        this.eventBus.emit('track:sesameCollected', {
          count: this.totalCollected
        });

        // Respawn further up the track
        mesh.position.z -= 28;
        mesh.position.x = (Math.random() - 0.5) * 2.6;
      }
    }
  }

  public reset(): void {
    this.totalCollected = 0;
    this.seeds.forEach((item, i) => {
      item.mesh.position.z = (i / this.seeds.length) * 32 - 16;
      item.mesh.position.x = (Math.random() - 0.5) * 2.6;
    });
    this.eventBus.emit('track:sesameCollected', { count: 0 });
  }

  public destroy(): void {
    this.scene.remove(this.group);
  }
}
