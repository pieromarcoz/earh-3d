"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text, Environment } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Model from './Model'

// Componente para mostrar texto de carga mientras carga el modelo 3D
function LoadingText() {
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={0.8}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Loading Earth...
    </Text>
  )
}

// Componente de fondo espacial mejorado
function SpaceBackground() {
  return (
    <>
      {/* Campo de estrellas denso y realista */}
      <Stars 
        radius={300} 
        depth={200} 
        count={8000} 
        factor={6} 
        saturation={0.1} 
        fade={true} 
        speed={0.3} 
      />
      
      {/* Campo de estrellas lejanas */}
      <Stars 
        radius={500} 
        depth={300} 
        count={3000} 
        factor={2} 
        saturation={0} 
        fade={true} 
        speed={0.1} 
      />
    </>
  )
}

// Componente de iluminación dinámica
function DynamicLighting() {
  const lightGroupRef = useRef()
  const mainLightRef = useRef()
  const fillLightRef = useRef()

  useFrame((state) => {
    if (mainLightRef.current && fillLightRef.current) {
      // Ajustar intensidad basado en la distancia de la cámara
      const distance = state.camera.position.length()
      const intensityFactor = Math.min(1, Math.max(0.3, 8 / distance))
      
      // Luz principal sigue sutilmente la posición de la cámara
      const cameraDirection = state.camera.position.clone().normalize()
      mainLightRef.current.position.copy(cameraDirection.multiplyScalar(10))
      mainLightRef.current.intensity = 1.2 * intensityFactor
      
      // Luz de relleno del lado opuesto
      fillLightRef.current.position.copy(cameraDirection.multiplyScalar(-8))
      fillLightRef.current.intensity = 0.4 * intensityFactor
    }
  })

  return (
    <group ref={lightGroupRef}>
      {/* Luz ambiente muy sutil */}
      <ambientLight intensity={0.15} color="#404040" />

      {/* Sol principal dinámico */}
      <directionalLight
        ref={mainLightRef}
        position={[10, 2, 8]}
        intensity={1.2}
        color="#fff5dc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Luz de relleno dinámica */}
      <directionalLight
        ref={fillLightRef}
        position={[-8, 5, -3]}
        intensity={0.4}
        color="#ffebb5"
      />

      {/* Luces puntuales fijas mais suaves */}
      <pointLight position={[-10, 0, 0]} intensity={0.2} color="#6bb6ff" distance={15} decay={2} />
      <pointLight position={[0, 10, 0]} intensity={0.15} color="#ffffff" distance={20} decay={2} />
      <pointLight position={[0, -8, 5]} intensity={0.1} color="#4a90e2" distance={15} decay={2} />
    </group>
  )
}

export default function FuturisticScene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ 
        antialias: true, 
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8 
      }}
    >
      {/* Fondo negro del espacio */}
      <color attach="background" args={['#000000']} />

      {/* Sistema de iluminación dinámica */}
      <DynamicLighting />

      {/* Fondo espacial con estrellas */}
      <SpaceBackground />

      {/* Modelo 3D de la Tierra con suspensión de carga */}
      <Suspense fallback={<LoadingText />}>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <Model scale={[1,1,1]} />
        </Float>
      </Suspense>


      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        autoRotate={false}
      />
    </Canvas>
  )
}
