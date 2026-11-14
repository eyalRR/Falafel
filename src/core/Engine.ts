import * as THREE from 'three';

export class Engine {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public container: HTMLElement;

  constructor(containerId = 'canvas-container') {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Container #${containerId} not found in DOM.`);
    }
    this.container = el;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#6db8f2');
    this.scene.fog = new THREE.Fog('#d8ecfa', 18, 65);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  public resize(): { width: number; height: number; aspect: number } {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    return { width, height, aspect: width / height };
  }

  public render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }

  public dispose(): void {
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
