'use client';
import * as THREE from 'three';
import { useTerraStore } from '@/stores/terra-store';

export function Atmosphere() {
  const { earthState } = useTerraStore();

  const vertexShader = `
    varying vec3 vNormal;
    void main(){
      vNormal=normalize(normalMatrix*normal);
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    uniform float uHealth;
    void main(){
      float intensity=pow(0.7-dot(vNormal,vec3(0,0,1.0)),2.0);
      vec3 healthyColor=vec3(0.3,0.6,1.0);
      vec3 pollutedColor=vec3(0.5,0.3,0.1);
      vec3 color=mix(pollutedColor,healthyColor,uHealth);
      gl_FragColor=vec4(color,intensity*0.6);
    }
  `;

  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[2, 24, 24]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uHealth: { value: earthState.health / 100 } }}
        transparent
        side={THREE.BackSide}
      />
    </mesh>
  );
}
