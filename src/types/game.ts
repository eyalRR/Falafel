import * as THREE from 'three';

export type StageKey = 'jaffa' | 'kinneret' | 'masada' | 'kotel';
export type MotionMode = 'run' | 'sit' | 'roll';

export interface StageConfig {
  env: StageKey;
  badge: string;
  title: string;
  story: string;
  transitionTitle: string;
  transitionStory: string;
  text: string;
  color: string;
  stars: THREE.Vector3[];
  cagePos: THREE.Vector3;
  kingPos: THREE.Vector3;
  skyTopDim: string;
  skyTopBright: string;
  skyBotDim: string;
  skyBotBright: string;
  fogDim: string;
  fogBright: string;
}

export interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

export interface Ripple {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
}

export interface StarItem {
  group: THREE.Group;
  collected: boolean;
  baseY: number;
  targetPos: THREE.Vector3;
}
