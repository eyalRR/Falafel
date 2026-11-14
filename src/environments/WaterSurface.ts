import * as THREE from 'three';

export class WaterSurface {
  public mesh: THREE.Mesh;
  public uniforms: {
    uTime: { value: number };
    uDeepColor: { value: THREE.Color };
    uShallowColor: { value: THREE.Color };
    uFoamColor: { value: THREE.Color };
  };

  constructor(deepHex = '#0369a1', shallowHex = '#38bdf8', width = 140, height = 40) {
    this.uniforms = {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color(deepHex) },
      uShallowColor: { value: new THREE.Color(shallowHex) },
      uFoamColor: { value: new THREE.Color('#e0f2fe') }
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vUv = uv;
          vec3 p = position;
          float w = sin(p.x * 1.4 + uTime * 2.2) * 0.06 + cos(p.y * 1.1 - uTime * 1.7) * 0.05;
          p.z += w;
          vWave = w;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        uniform vec3 uFoamColor;
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          float shore = smoothstep(0.0, 0.16, vUv.x) * (1.0 - smoothstep(0.84, 1.0, vUv.x));
          vec3 col = mix(uShallowColor, uDeepColor, shore);
          float shimmer = smoothstep(0.03, 0.09, vWave);
          col = mix(col, uFoamColor, shimmer * 0.38);
          float foamEdge = 1.0 - smoothstep(0.0, 0.035, abs(vUv.x - 0.015));
          col = mix(col, uFoamColor, foamEdge * (0.5 + 0.5 * sin(uTime * 3.0 + vUv.y * 40.0)) * 0.55);
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    const geo = new THREE.PlaneGeometry(width, height, 48, 24);
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.rotation.x = -Math.PI / 2;
  }

  public update(dt: number): void {
    this.uniforms.uTime.value += dt;
  }
}
