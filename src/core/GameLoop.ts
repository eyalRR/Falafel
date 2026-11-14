import * as THREE from 'three';

export type TickCallback = (dt: number, elapsed: number) => void;

export class GameLoop {
  private clock: THREE.Clock;
  private running = false;
  private subscribers: Set<TickCallback> = new Set();
  private rafId: number | null = null;

  constructor() {
    this.clock = new THREE.Clock();
  }

  public subscribe(cb: TickCallback): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.start();

    const loop = () => {
      if (!this.running) return;
      let dt = this.clock.getDelta();
      // Clamp dt to avoid huge jumps on frame drops or background tab switches
      dt = Math.min(dt, 0.05);
      const elapsed = this.clock.getElapsedTime();

      this.subscribers.forEach((cb) => {
        try {
          cb(dt, elapsed);
        } catch (e) {
          console.error('Error in GameLoop subscriber:', e);
        }
      });

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
