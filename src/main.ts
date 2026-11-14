import * as THREE from 'three';
import './styles/main.css';
import './styles/hud.css';
import './styles/modal.css';

import { EventBus } from './core/EventBus';
import { Engine } from './core/Engine';
import { CameraManager } from './core/CameraManager';
import { Lighting } from './core/Lighting';
import { GameLoop } from './core/GameLoop';

import { EnvironmentManager } from './environments/EnvironmentManager';
import { Falafeltchik } from './entities/Falafeltchik/Falafeltchik';
import { Hummuson } from './entities/Hummuson/Hummuson';
import { ShadowCage } from './entities/Hummuson/Cage';
import { KingCrumbs } from './entities/KingCrumbs/KingCrumbs';

import { PhysicsState } from './physics/PhysicsState';
import { JellyDeformation } from './physics/JellyDeformation';
import { DragDropThrow } from './physics/DragDropThrow';
import { TrajectoryArc } from './physics/TrajectoryArc';
import { TrackCollectibles } from './systems/TrackCollectibles';
import { Haptics } from './core/Haptics';

import { ParticleSystem } from './systems/ParticleSystem';
import { RippleSystem } from './systems/RippleSystem';
import { StageManager, STORY_STAGES } from './systems/StageManager';

import { AudioEngine } from './audio/AudioEngine';
import { UIManager } from './ui/UIManager';
import { MotionMode, StageKey } from './types/game';

class Game {
  public eventBus: EventBus;
  public engine: Engine;
  public cameraManager: CameraManager;
  public lighting: Lighting;
  public gameLoop: GameLoop;

  public envManager: EnvironmentManager;
  public falafeltchik: Falafeltchik;
  public hummuson: Hummuson;
  public shadowCage: ShadowCage;
  public king: KingCrumbs;

  public physicsState: PhysicsState;
  public jelly: JellyDeformation;
  public dragDrop: DragDropThrow;
  public trajectoryArc: TrajectoryArc;

  public particles: ParticleSystem;
  public ripples: RippleSystem;
  public stageManager: StageManager;
  public trackCollectibles: TrackCollectibles;

  public audio: AudioEngine;
  public ui: UIManager;

  // Track pebbles & interactivity
  public trackPebbles: THREE.Mesh[] = [];
  public windBoost = 0;
  public lookTargetX = 0;
  public lookTimer = 0;

  constructor() {
    this.eventBus = new EventBus();
    this.engine = new Engine('canvas-container');
    this.cameraManager = new CameraManager(this.engine.renderer.domElement);
    this.lighting = new Lighting();
    this.engine.scene.add(this.lighting.group);

    this.gameLoop = new GameLoop();
    this.audio = new AudioEngine();

    // World & Environments
    this.envManager = new EnvironmentManager(this.engine.scene);

    // Characters
    this.falafeltchik = new Falafeltchik();
    this.engine.scene.add(this.falafeltchik.root);

    this.hummuson = new Hummuson();
    this.engine.scene.add(this.hummuson.group);

    this.shadowCage = new ShadowCage();
    this.hummuson.group.add(this.shadowCage.group);

    this.king = new KingCrumbs();
    this.engine.scene.add(this.king.group);

    // Physics
    this.physicsState = new PhysicsState();
    this.jelly = new JellyDeformation();
    this.particles = new ParticleSystem(this.engine.scene);
    this.ripples = new RippleSystem(this.engine.scene);

    this.dragDrop = new DragDropThrow(
      this.cameraManager.camera,
      this.engine.renderer.domElement,
      this.falafeltchik.root,
      this.physicsState,
      this.jelly,
      this.eventBus
    );
    this.trajectoryArc = new TrajectoryArc(this.engine.scene);
    this.dragDrop.trajectoryArc = this.trajectoryArc;

    this.trackCollectibles = new TrackCollectibles(
      this.engine.scene,
      this.particles,
      this.audio,
      this.eventBus
    );

    this.dragDrop.onControlsToggle = (enabled) => {
      this.cameraManager.controls.enabled = enabled;
    };

    this.dragDrop.onWorldTap = (raycaster) => {
      this.handleWorldTap(raycaster);
    };

    // Stage Manager
    this.stageManager = new StageManager(
      this.engine.scene,
      this.envManager,
      this.hummuson,
      this.shadowCage,
      this.king,
      this.particles,
      this.eventBus
    );

    // UI
    this.ui = new UIManager(this.eventBus);

    this.buildTrackPebbles();
    this.bindBusEvents();
    this.initWindowListeners();

    // Start Stage 1 (Jaffa)
    this.stageManager.loadStage(0, true);

    // Bind game loop
    this.gameLoop.subscribe((dt, elapsed) => this.tick(dt, elapsed));
    this.gameLoop.start();
  }

  private buildTrackPebbles(): void {
    const pebbleGeo = new THREE.DodecahedronGeometry(0.065, 0);
    const pebbleMat = new THREE.MeshStandardMaterial({ color: '#cfb997', roughness: 0.95 });
    for (let i = 0; i < 28; i++) {
      const peb = new THREE.Mesh(pebbleGeo, pebbleMat);
      peb.position.set(
        (Math.random() - 0.5) * 2.8,
        0.03,
        (Math.random() - 0.5) * 32
      );
      peb.scale.set(1.2, 0.45, 1.0);
      peb.userData = { baseY: 0.03, vy: 0, rotVel: 0 };
      this.engine.scene.add(peb);
      this.trackPebbles.push(peb);
    }
  }

  private handleWorldTap(raycaster: THREE.Raycaster): void {
    const interactables = [
      ...this.trackPebbles,
      ...this.envManager.getInteractiveObjects(),
      this.king.group
    ];

    const hits = raycaster.intersectObjects(interactables, true);
    if (hits.length > 0) {
      let root: THREE.Object3D | null = hits[0].object;
      while (root && (!root.userData || !root.userData.interactType)) {
        root = root.parent;
      }
      if (root && root.userData) {
        const type = root.userData.interactType;
        if (type === 'pebble') {
          root.userData.vy = 2.6 + Math.random() * 1.2;
          root.userData.rotVel = (Math.random() - 0.5) * 14;
          this.particles.spawnDust(root.position.x, 0.08, root.position.z, 5, 0.3);
          this.audio.playBoing(360);
        } else if (type === 'cat') {
          root.userData.swayVel = 7.0;
          this.audio.playMeow();
        } else if (type === 'duck') {
          root.userData.swayVel = 6.5;
          this.audio.playQuack();
        } else if (type === 'water') {
          this.ripples.spawnWaterRipple(hits[0].point.x, hits[0].point.y, hits[0].point.z);
          this.audio.playBoing(440);
        } else if (type === 'king') {
          root.userData.wobbleVel = 12.0;
          this.audio.playBoing(200);
        } else if (type === 'shrub' || type === 'palm') {
          root.userData.swayVel = 5.0;
          this.audio.playWhoosh();
        }
      }
    }
  }

  private bindBusEvents(): void {
    this.eventBus.on('ui:setMode', (mode: MotionMode) => {
      this.audio.ensureAudio();
      this.physicsState.motionMode = mode;
      if (mode === 'sit') {
        this.jelly.velY = -2.2;
      } else if (mode === 'roll') {
        this.jelly.velY = 2.0;
      }
      this.audio.playBoing(260);
    });

    this.eventBus.on('ui:jump', () => {
      this.audio.ensureAudio();
      if (this.physicsState.triggerJump()) {
        this.jelly.velY = 3.2;
        this.audio.playBoing(310);
        this.particles.spawnDust(0, 0.08, 0, 8, 0.55);
        Haptics.bounce();
      }
    });

    this.eventBus.on('ui:switchEnv', (env: StageKey) => {
      this.audio.ensureAudio();
      this.envManager.buildEnv(env);
      this.audio.startStageSoundscape(env);
      this.jelly.triggerImpulse(2.4, 0, 0.4);
    });

    this.eventBus.on('ui:toggleSound', () => {
      this.audio.ensureAudio();
      const next = !this.audio.soundEnabled;
      this.audio.setSoundEnabled(next);
      this.eventBus.emit('sound:state', next);
      if (next) this.audio.playBoing(340);
    });

    this.eventBus.on('ui:resetCamera', () => {
      this.cameraManager.applyResponsive(true);
    });

    this.eventBus.on('ui:storyGo', () => {
      this.audio.ensureAudio();
      if (this.stageManager.pendingStageAdvance) {
        this.stageManager.advanceStage();
      }
    });

    this.eventBus.on('ui:storyInfo', () => {
      this.audio.ensureAudio();
      if (this.stageManager.storyCompleted) {
        this.ui.openStoryModal(
          'חומוסון חולץ!',
          'פלאפלוצ׳יק הציל את המצב!',
          'ניפצתם את כלוב הצללים ושחררתם את חומוסון! אור הבוקר חזר לזרוח מעל ירושלים!'
        );
      } else {
        const st = STORY_STAGES[this.stageManager.stageIndex];
        this.ui.openStoryModal(st.badge, st.title, st.story);
      }
    });

    this.eventBus.on('ui:storyReplay', () => {
      this.audio.ensureAudio();
      this.trackCollectibles.reset();
      this.stageManager.loadStage(0, true);
    });

    this.eventBus.on('stage:changed', (data: { config: any }) => {
      this.audio.startStageSoundscape(data.config.env);
    });

    this.eventBus.on('stage:complete', (data: { isFinale: boolean }) => {
      if (data.isFinale) {
        this.audio.startStageSoundscape('dawn');
      }
    });

    this.eventBus.on('sound:boing', (pitch: number) => this.audio.playBoing(pitch));
    this.eventBus.on('sound:bell', (freq: number) => this.audio.playBell(freq));
    this.eventBus.on('sound:whoosh', () => this.audio.playWhoosh());
    this.eventBus.on('sound:spooky', () => this.audio.playSpooky());
    this.eventBus.on('sound:rescueFanfare', (isFinale: boolean) => this.audio.playRescueFanfare(isFinale));

    this.eventBus.on('fx:land', (data: { pos: THREE.Vector3 }) => {
      this.particles.spawnDust(data.pos.x, 0.08, data.pos.z, 7, 0.5);
      this.audio.playBoing(220);
      Haptics.tap();
    });
  }

  private initWindowListeners(): void {
    window.addEventListener('resize', () => {
      this.engine.resize();
      this.cameraManager.applyResponsive(false);
    });

    // Audio unlock on first user interaction anywhere
    const unlockEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
    const unlock = () => {
      this.audio.ensureAudio();
      if (this.audio.soundEnabled && !this.audio.isPlaying) {
        const stageEnv = STORY_STAGES[this.stageManager.stageIndex]?.env || 'jaffa';
        this.audio.startStageSoundscape(stageEnv);
      }
      unlockEvents.forEach((ev) => {
        window.removeEventListener(ev, unlock, true);
      });
    };
    unlockEvents.forEach((ev) => {
      window.addEventListener(ev, unlock, { capture: true });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.eventBus.emit('ui:jump');
      } else if (e.code === 'Digit1') {
        this.stageManager.loadStage(0, true);
      } else if (e.code === 'Digit2') {
        this.stageManager.loadStage(1, true);
      } else if (e.code === 'Digit3') {
        this.stageManager.loadStage(2, true);
      } else if (e.code === 'Digit4') {
        this.stageManager.loadStage(3, true);
      } else if (e.code === 'KeyR') {
        this.stageManager.loadStage(this.stageManager.stageIndex, true);
      } else if (e.code === 'KeyS') {
        this.eventBus.emit('ui:toggleSound');
      } else if (e.code === 'KeyM') {
        const modes: MotionMode[] = ['run', 'roll', 'sit'];
        const currentIdx = modes.indexOf(this.physicsState.motionMode);
        const nextMode = modes[(currentIdx + 1) % modes.length];
        this.eventBus.emit('ui:setMode', nextMode);
        this.ui.setModeActive(nextMode);
      }
    });
  }

  private tick(dt: number, elapsed: number): void {
    // 1. Drag & throw physics
    this.dragDrop.update(dt);

    // 2. Track & scenery scrolling
    const scrollSpeed =
      this.physicsState.motionMode === 'run'
        ? 5.2
        : this.physicsState.motionMode === 'roll'
        ? 6.4
        : 0.0;

    if (scrollSpeed > 0) {
      if (this.envManager.groundMat.bumpMap) {
        this.envManager.groundMat.bumpMap.offset.y -= scrollSpeed * dt * 0.11;
      }
      for (let pi = 0; pi < this.trackPebbles.length; pi++) {
        const peb = this.trackPebbles[pi];
        peb.position.z -= scrollSpeed * dt;
        if (peb.position.z < -18) peb.position.z += 36;
      }
      const scrollingProps = this.envManager.getScrollingProps();
      for (let si = 0; si < scrollingProps.length; si++) {
        const prop = scrollingProps[si];
        prop.position.z -= scrollSpeed * dt;
        if (prop.position.z < -18) prop.position.z += 32;
      }
    }

    // 3. Jump physics
    if (!this.physicsState.isGrounded) {
      this.physicsState.jumpVel -= 15.5 * dt;
      this.physicsState.jumpY += this.physicsState.jumpVel * dt;
      if (this.physicsState.jumpY <= 0) {
        this.physicsState.jumpY = 0;
        this.physicsState.jumpVel = 0;
        this.physicsState.isGrounded = true;
        this.jelly.triggerImpulse(4.2);
        this.particles.spawnDust(0, 0.1, 0, 9, 0.65);
        this.audio.playBoing(240);
      }
    }

    // 4. Mode animations
    if (this.physicsState.motionMode === 'run') {
      this.physicsState.runPhase += dt * 11.5;
      this.physicsState.rollAngle = THREE.MathUtils.lerp(this.physicsState.rollAngle, 0, dt * 10);
      this.falafeltchik.bodyCenter.rotation.x = THREE.MathUtils.lerp(
        this.falafeltchik.bodyCenter.rotation.x,
        0.12,
        dt * 8
      );

      const bob = Math.abs(Math.sin(this.physicsState.runPhase)) * 0.13;
      this.falafeltchik.bodyCenter.position.y = THREE.MathUtils.lerp(
        this.falafeltchik.bodyCenter.position.y,
        1.05 + bob + this.physicsState.jumpY,
        dt * 14
      );

      this.falafeltchik.limbs.animateRun(this.physicsState.runPhase, 1.0);

      const stepSign = Math.sin(this.physicsState.runPhase) >= 0 ? 1 : -1;
      if (stepSign !== this.physicsState.lastStepSign && this.physicsState.isGrounded) {
        this.physicsState.lastStepSign = stepSign;
        this.particles.spawnDust(stepSign * 0.2, 0.06, -0.25, 2, 0.25);
      }
    } else if (this.physicsState.motionMode === 'sit') {
      this.physicsState.rollAngle = THREE.MathUtils.lerp(this.physicsState.rollAngle, 0, dt * 8);
      this.falafeltchik.bodyCenter.rotation.x = THREE.MathUtils.lerp(
        this.falafeltchik.bodyCenter.rotation.x,
        -0.05,
        dt * 8
      );
      const sitBob = Math.sin(elapsed * 2.4) * 0.015;
      this.falafeltchik.bodyCenter.position.y = THREE.MathUtils.lerp(
        this.falafeltchik.bodyCenter.position.y,
        0.68 + sitBob + this.physicsState.jumpY,
        dt * 8
      );
      this.falafeltchik.limbs.animateSit();
    } else if (this.physicsState.motionMode === 'roll') {
      this.physicsState.rollAngle += dt * 7.8;
      this.falafeltchik.bodyCenter.rotation.x = this.physicsState.rollAngle;
      const rollBounce = Math.abs(Math.sin(this.physicsState.rollAngle * 2)) * 0.06;
      this.falafeltchik.bodyCenter.position.y = THREE.MathUtils.lerp(
        this.falafeltchik.bodyCenter.position.y,
        0.66 + rollBounce + this.physicsState.jumpY,
        dt * 12
      );
      this.falafeltchik.limbs.animateRoll(this.physicsState.rollAngle);
      if (Math.random() < 0.32 && this.physicsState.isGrounded) {
        this.particles.spawnDust(0, 0.06, -0.35, 1, 0.35);
      }
    }

    // 5. Jelly squash/stretch
    this.jelly.update(dt, this.falafeltchik.physicsGroup);

    // 6. Character components update
    this.falafeltchik.update(dt, elapsed, this.physicsState.motionMode === 'sit', this.windBoost);

    // 7. Companion Hummuson & Cage update
    this.hummuson.update(elapsed, this.stageManager.storyCompleted);
    this.shadowCage.update(elapsed);

    // 8. King Crumb update
    this.king.update(dt, elapsed);

    // 9. Environment & Stages update
    this.envManager.update(dt, elapsed);

    // 10. Star collecting & stage progression
    this.stageManager.update(elapsed);
    const charWorldPos = new THREE.Vector3();
    this.falafeltchik.bodyCenter.getWorldPosition(charWorldPos);
    this.stageManager.checkStarCollection(charWorldPos);

    // 11. Treadmill Collectibles (Sesame Seeds)
    this.trackCollectibles.update(dt, elapsed, scrollSpeed, charWorldPos);

    // 12. Particles & Ripples
    this.particles.update(dt);
    this.ripples.update(dt);

    // 13. Camera and render
    this.cameraManager.update();
    this.engine.render(this.cameraManager.camera);
  }
}

// Bootstrap on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
