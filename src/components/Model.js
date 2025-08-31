import React, { useRef, useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from "three"

export default function Model(props) {
  const groupRef = useRef()
  const earthRef = useRef()
  const cloudsRef = useRef()
  
  // Cargar texturas para capas separadas
  const earthTexture = useTexture("/textures/earth albedo.jpg")
  const bumpTexture = useTexture("/textures/earth bump.jpg")
  const cloudsTexture = useTexture("/textures/clouds earth.png")
  const nightLightsTexture = useTexture("/textures/earth night_lights_modified.png")
  const landOceanMask = useTexture("/textures/earth land ocean mask.png")

  // Crear geometría de esfera perfecta con UV estándar
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 64, 32), [])

  useEffect(() => {
    // Configurar texturas correctamente para mapeo de esfera estándar
    earthTexture.colorSpace = THREE.SRGBColorSpace
    earthTexture.mapping = THREE.UVMapping
    earthTexture.wrapS = THREE.ClampToEdgeWrapping
    earthTexture.wrapT = THREE.ClampToEdgeWrapping
    earthTexture.flipY = false

    bumpTexture.mapping = THREE.UVMapping
    bumpTexture.wrapS = THREE.ClampToEdgeWrapping
    bumpTexture.wrapT = THREE.ClampToEdgeWrapping
    bumpTexture.flipY = false

    cloudsTexture.mapping = THREE.UVMapping
    cloudsTexture.wrapS = THREE.ClampToEdgeWrapping
    cloudsTexture.wrapT = THREE.ClampToEdgeWrapping
    cloudsTexture.flipY = false

    nightLightsTexture.colorSpace = THREE.SRGBColorSpace
    nightLightsTexture.mapping = THREE.UVMapping
    nightLightsTexture.wrapS = THREE.ClampToEdgeWrapping
    nightLightsTexture.wrapT = THREE.ClampToEdgeWrapping
    nightLightsTexture.flipY = false

    landOceanMask.mapping = THREE.UVMapping
    landOceanMask.wrapS = THREE.ClampToEdgeWrapping
    landOceanMask.wrapT = THREE.ClampToEdgeWrapping
    landOceanMask.flipY = false

    console.log("🌍 Todas las texturas configuradas correctamente")
  }, [earthTexture, bumpTexture, cloudsTexture, nightLightsTexture, landOceanMask])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
    
    // Rotar nubes ligeramente más rápido para efecto realista
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.12
    }
  })

  // Material optimizado que combina día y noche
  const earthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      // Texturas principales
      map: earthTexture,
      normalMap: bumpTexture,
      normalScale: new THREE.Vector2(0.3, 0.3),
      
      // Luces nocturnas mejoradas
      emissiveMap: nightLightsTexture,
      emissive: new THREE.Color(0xffaa00),
      emissiveIntensity: 0.8,
      
      // Propiedades físicas optimizadas
      roughness: 0.4,
      metalness: 0.05,
      
      // Máscara océano/tierra para efectos diferentes
      roughnessMap: landOceanMask,
      
      // Configuración avanzada
      transparent: false,
      side: THREE.FrontSide,
    })
  }, [earthTexture, bumpTexture, nightLightsTexture, landOceanMask])

  return (
    <group ref={groupRef} {...props}>
      {/* Tierra base con todas las texturas */}
      <mesh ref={earthRef} geometry={sphereGeometry} material={earthMaterial} />
      
      {/* Capa de nubes mejorada */}
      <mesh ref={cloudsRef} geometry={sphereGeometry} scale={[1.01, 1.01, 1.01]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent={true}
          opacity={0.5}
          alphaTest={0.1}
          depthWrite={false}
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      
      {/* Atmósfera exterior sutil */}
      <mesh geometry={sphereGeometry} scale={[1.02, 1.02, 1.02]}>
        <meshBasicMaterial
          color={0x88ccff}
          transparent={true}
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
