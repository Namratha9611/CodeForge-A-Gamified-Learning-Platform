import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useMemo } from 'react'

const personaColors = {
  Novice: '#ef4444',
  Explorer: '#f59e0b',
  Prodigy: '#3b82f6',
  Master: '#8b5cf6',
}

export default function PersonaAvatar({ persona = 'Novice' }) {
  const color = personaColors[persona] || personaColors.Novice

  return (
    <div className="w-32 h-32">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color={color} />
        </Sphere>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  )
}

