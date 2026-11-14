import * as THREE from 'three';

export class SkyDome {
  public mesh: THREE.Mesh;
  public uniforms: {
    topColor: { value: THREE.Color };
    bottomColor: { value: THREE.Color };
    sunColor: { value: THREE.Color };
    sunDir: { value: THREE.Vector3 };
  };

  constructor() {
    this.uniforms = {
      topColor: { value: new THREE.Color('#2b82d9') },
      bottomColor: { value: new THREE.Color('#f7e2bc') },
      sunColor: { value: new THREE.Color('#fff5d6') },
      sunDir: { value: new THREE.Vector3(0.5, 0.45, -0.7).normalize() }
    };

    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 sunColor;
        uniform vec3 sunDir;
        varying vec3 vWorldPos;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = clamp(dir.y * 0.9 + 0.12, 0.0, 1.0);
          vec3 col = mix(bottomColor, topColor, pow(h, 0.65));
          float sunAmt = max(dot(dir, sunDir), 0.0);
          col += sunColor * pow(sunAmt, 24.0) * 0.42;
          col += sunColor * pow(sunAmt, 180.0) * 0.55;
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(75, 32, 20), skyMat);
  }

  public setColors(topHex: string, botHex: string, lerpFactor = 1): void {
    const targetTop = new THREE.Color(topHex);
    const targetBot = new THREE.Color(botHex);
    if (lerpFactor >= 1) {
      this.uniforms.topColor.value.copy(targetTop);
      this.uniforms.bottomColor.value.copy(targetBot);
    } else {
      this.uniforms.topColor.value.lerp(targetTop, lerpFactor);
      this.uniforms.bottomColor.value.lerp(targetBot, lerpFactor);
    }
  }
}
