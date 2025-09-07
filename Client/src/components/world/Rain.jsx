import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'

// ---- Shader ----
const RainMaterial = shaderMaterial(
  // Uniforms
  { uTime: 0, uColor: new THREE.Color('#88ccee'), uEnabled: 1.0 },

  // Vertex Shader
  `
  attribute float aOffset;
  attribute float aSpeed;

  uniform float uTime;
  uniform float uEnabled;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    if (uEnabled > 0.5) {
      // Rain is active
      float fall = mod(uTime * aSpeed + aOffset, 100.0);
      pos.y -= fall;

      vAlpha = 1.0 - fract(fall / 100.0);
    } else {
      // Rain disabled → hide particles
      vAlpha = 0.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0;
  }
  `,

  // Fragment Shader
  `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.0) discard;

    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard; // circular drop shape

    gl_FragColor = vec4(uColor, vAlpha);
  }
  `
)

extend({ RainMaterial })

// ---- Component ----
export function Rain({ count = 10000, enabled = true }) {
  const ref = useRef()

  // Create random positions and attributes
  const positions = new Float32Array(count * 3)
  const offsets = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200   // X spread
    positions[i * 3 + 1] = Math.random() * 100       // Y height
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200 // Z spread

    offsets[i] = Math.random() * 100.0              // start offset
    speeds[i] = 10.0 + Math.random() * 20.0         // fall speed
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime = state.clock.elapsedTime
      ref.current.uEnabled = enabled ? 1.0 : 0.0
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length}
          array={offsets}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speeds.length}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <rainMaterial ref={ref} transparent depthWrite={false} />
    </points>
  )
}
