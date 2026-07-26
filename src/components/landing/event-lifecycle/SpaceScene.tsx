import { useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars, Float } from "@react-three/drei"
import * as THREE from "three"
import { PLANETS, CAMERA_START_Z, type PlanetDef } from "./planetData"

/* ─── Shared state: GSAP writes cameraZ, useFrame reads it ─── */
export const cameraState = { z: CAMERA_START_Z, lookAtY: 0 }

/* ─── Shooting star ─── */
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null!)
  const speed = useRef(0)
  const direction = useRef(new THREE.Vector3())
  const active = useRef(false)
  const timer = useRef(0)

  const reset = useCallback(() => {
    const angle = Math.random() * Math.PI * 2
    const dist = 20 + Math.random() * 40
    ref.current.position.set(
      Math.cos(angle) * dist,
      5 + Math.random() * 15,
      cameraState.z - 10 - Math.random() * 30
    )
    direction.current
      .set(-0.3 - Math.random() * 0.5, -0.1 - Math.random() * 0.2, -1)
      .normalize()
    speed.current = 30 + Math.random() * 40
    active.current = true
    timer.current = 0.3 + Math.random() * 0.4
    ref.current.visible = true
  }, [])

  useFrame((_, delta) => {
    if (!active.current) {
      timer.current -= delta
      if (timer.current <= 0) reset()
      return
    }
    ref.current.position.addScaledVector(direction.current, speed.current * delta)
    timer.current -= delta
    if (timer.current <= 0) {
      active.current = false
      ref.current.visible = false
      timer.current = 2 + Math.random() * 6
    }
  })

  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.06, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </mesh>
  )
}

/* ─── Dust particles ─── */
function DustParticles() {
  const ref = useRef<THREE.Points>(null!)
  const count = 600

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = -Math.random() * 100
      sz[i] = 0.3 + Math.random() * 1.2
    }
    return [pos, sz]
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const posAttr = ref.current.geometry.getAttribute("position")
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(Date.now() * 0.0003 + i) * delta * 0.15
      arr[i * 3] += Math.cos(Date.now() * 0.0002 + i * 0.5) * delta * 0.08
    }
    posAttr.needsUpdate = true
    ref.current.position.z = cameraState.z
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#CCA300"
        size={0.12}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ─── Nebula fog ─── */
function NebulaFog() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = cameraState.z - 5
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[120, 60]} />
      <meshBasicMaterial
        color="#1a0f00"
        transparent
        opacity={0.08}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ─── Orbit ring for a planet ─── */
function OrbitRing({
  radius,
  color,
  speed,
  planetZ,
}: {
  radius: number
  color: string
  speed: number
  planetZ: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.05
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.15
    ref.current.position.z = planetZ
  })

  return (
    <mesh ref={ref} position={[0, 0, planetZ]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 8, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ─── Second orbit ring ─── */
function OrbitRing2({
  radius,
  color,
  speed,
  planetZ,
}: {
  radius: number
  color: string
  speed: number
  planetZ: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.08
    ref.current.rotation.z = -state.clock.elapsedTime * speed * 0.1 + 1.2
    ref.current.position.z = planetZ
  })

  return (
    <mesh ref={ref} position={[0, 0, planetZ]} rotation={[Math.PI / 3, 0.3, 0]}>
      <torusGeometry args={[radius * 1.2, 0.008, 8, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ─── Planet glow sphere ─── */
function PlanetGlow({
  color,
  intensity,
  planetZ,
  scale,
}: {
  color: string
  intensity: number
  planetZ: number
  scale: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08
    ref.current.scale.setScalar(scale * pulse)
    ref.current.position.z = planetZ
  })

  return (
    <mesh ref={ref} position={[0, 0, planetZ]}>
      <sphereGeometry args={[0.8, 24, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity * 0.15}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ─── Discovery: glowing search ring ─── */
function DiscoveryRing({ planetZ }: { planetZ: number }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.PI / 6
    ref.current.rotation.z = state.clock.elapsedTime * 0.5
    ref.current.position.z = planetZ
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={[0, 0, planetZ]}>
        <torusGeometry args={[1.1, 0.04, 16, 64]} />
        <meshBasicMaterial
          color="#FFD54A"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </Float>
  )
}

/* ─── Registration: floating ticket cards ─── */
function RegistrationTickets({ planetZ }: { planetZ: number }) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!group.current) return
    group.current.position.z = planetZ
    group.current.rotation.y = state.clock.elapsedTime * 0.15
  })

  const tickets = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      angle: (i / 4) * Math.PI * 2,
      offset: i * 0.5,
      delay: i * 1,
    }))
  }, [])

  return (
    <group ref={group} position={[0, 0, planetZ]}>
      {tickets.map((t, i) => (
        <TicketCard key={i} t={t} />
      ))}
    </group>
  )
}

function TicketCard({ t }: { t: { angle: number; offset: number; delay: number } }) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!mesh.current) return
    const elapsed = state.clock.elapsedTime
    const fade = Math.min(1, Math.max(0, (elapsed - t.delay) * 1))
    mesh.current.visible = fade > 0.01
    if (mesh.current.material) {
      ;(mesh.current.material as THREE.MeshStandardMaterial).opacity = fade * 0.7
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh
        ref={mesh}
        position={[
          Math.cos(t.angle) * 1.2,
          Math.sin(t.angle) * 0.6,
          t.offset * 0.3,
        ]}
        rotation={[0.2, t.angle, 0.1]}
      >
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial
          color="#4ADE80"
          emissive="#4ADE80"
          emissiveIntensity={0.3}
          transparent
          opacity={0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}

/* ─── QR Check-in: holographic cubes ─── */
function QRCubes({ planetZ }: { planetZ: number }) {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!group.current) return
    group.current.position.z = planetZ
    group.current.rotation.y = state.clock.elapsedTime * 0.2
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1
  })

  const cubes = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1,
      ] as [number, number, number],
      size: 0.15 + Math.random() * 0.2,
      speed: 0.5 + Math.random() * 1.5,
    }))
  }, [])

  return (
    <group ref={group} position={[0, 0, planetZ]}>
      {cubes.map((c, i) => (
        <Float key={i} speed={c.speed} rotationIntensity={0.8} floatIntensity={0.6}>
          <mesh position={c.pos}>
            <boxGeometry args={[c.size, c.size, c.size]} />
            <meshStandardMaterial
              color="#60A5FA"
              emissive="#60A5FA"
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
              wireframe
              metalness={1}
              roughness={0}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/* ─── Certificate: golden particles ─── */
function CertificateParticles({ planetZ }: { planetZ: number }) {
  const ref = useRef<THREE.Points>(null!)
  const count = 120

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.8 + Math.random() * 0.8
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.z = planetZ
    ref.current.rotation.y = state.clock.elapsedTime * 0.2
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <points ref={ref} position={[0, 0, planetZ]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F59E0B"
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ─── Community: glowing network ─── */
function CommunityNetwork({ planetZ }: { planetZ: number }) {
  const group = useRef<THREE.Group>(null!)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null!)

  const { nodes, edges } = useMemo(() => {
    const pts: [number, number, number][] = Array.from({ length: 8 }, () => [
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 1.2,
    ])
    const e: [number, number][] = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i][0] - pts[j][0]
        const dy = pts[i][1] - pts[j][1]
        const dz = pts[i][2] - pts[j][2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2) {
          e.push([i, j])
        }
      }
    }
    return { nodes: pts, edges: e }
  }, [])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(edges.length * 6)
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [edges])

  useFrame((state) => {
    if (!group.current) return
    group.current.position.z = planetZ
    group.current.rotation.y = state.clock.elapsedTime * 0.15

    if (lineRef.current) {
      const posAttr = lineRef.current.geometry.getAttribute("position")
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i]
        arr[i * 6] = nodes[a][0]
        arr[i * 6 + 1] = nodes[a][1]
        arr[i * 6 + 2] = nodes[a][2]
        arr[i * 6 + 3] = nodes[b][0]
        arr[i * 6 + 4] = nodes[b][1]
        arr[i * 6 + 5] = nodes[b][2]
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <group ref={group} position={[0, 0, planetZ]}>
      {nodes.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0} floatIntensity={0.4}>
          <mesh position={pos}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color="#C084FC"
              transparent
              opacity={0.9}
            />
          </mesh>
        </Float>
      ))}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#C084FC"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

/* ─── Connection path between planets ─── */
function ConnectionPath({
  from,
  to,
  color,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
}) {
  const ref = useRef<THREE.Line>(null!)

  const curve = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(from, to)
      .multiplyScalar(0.5)
    mid.y += 2
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])

  const points = useMemo(() => curve.getPoints(60), [curve])
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  )

  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.LineBasicMaterial
    mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04
  })

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        depthWrite={false}
      />
    </line>
  )
}

/* ─── Individual planet ─── */
function Planet({
  planet,
  index,
}: {
  planet: PlanetDef
  index: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.set(...planet.position)
    if (innerRef.current) {
      innerRef.current.rotation.y = state.clock.elapsedTime * 0.15 * planet.orbitSpeed
      innerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const UniqueVisual = useMemo(() => {
    switch (planet.key) {
      case "discovery":
        return DiscoveryRing
      case "registration":
        return RegistrationTickets
      case "checkin":
        return QRCubes
      case "certificate":
        return CertificateParticles
      case "community":
        return CommunityNetwork
      default:
        return () => null
    }
  }, [planet.key])

  return (
    <group ref={groupRef} position={planet.position}>
      {/* Planet core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.5 * planet.planetScale, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[0.5 * planet.planetScale, 24, 24]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <PlanetGlow
        color={planet.color}
        intensity={1}
        planetZ={0}
        scale={2.5}
      />

      {/* Orbit rings */}
      <OrbitRing
        radius={planet.orbitRadius}
        color={planet.color}
        speed={planet.orbitSpeed}
        planetZ={0}
      />
      <OrbitRing2
        radius={planet.orbitRadius}
        color={planet.accentColor}
        speed={planet.orbitSpeed * 0.7}
        planetZ={0}
      />

      {/* Unique visual element */}
      <UniqueVisual planetZ={0} />
    </group>
  )
}

/* ─── Camera rig ─── */
function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.z = cameraState.z
    camera.position.y = cameraState.lookAtY + Math.sin(cameraState.z * 0.05) * 0.3
    camera.position.x = Math.sin(cameraState.z * 0.03) * 0.8
    camera.lookAt(
      camera.position.x * 0.5,
      cameraState.lookAtY,
      cameraState.z - 15
    )
  })

  return null
}

/* ─── Main scene ─── */
function Scene() {
  const planetPositions = useMemo(
    () => PLANETS.map((p) => new THREE.Vector3(...p.position)),
    []
  )

  return (
    <>
      <CameraRig />

      {/* Lighting */}
      <ambientLight intensity={0.08} color="#1a1a2e" />
      <pointLight
        position={[5, 5, CAMERA_START_Z + 5]}
        intensity={0.6}
        color="#FFD54A"
        distance={50}
      />
      <pointLight
        position={[-5, -3, -30]}
        intensity={0.3}
        color="#60A5FA"
        distance={40}
      />
      <pointLight
        position={[3, 4, -60]}
        intensity={0.4}
        color="#C084FC"
        distance={40}
      />

      {/* Background */}
      <Stars
        radius={80}
        depth={60}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />
      <DustParticles />
      <NebulaFog />

      {/* Shooting stars */}
      {Array.from({ length: 5 }, (_, i) => (
        <ShootingStar key={i} />
      ))}

      {/* Planets */}
      {PLANETS.map((planet, i) => (
        <Planet key={planet.id} planet={planet} index={i} />
      ))}

      {/* Connection paths between planets */}
      {planetPositions.slice(0, -1).map((from, i) => (
        <ConnectionPath
          key={i}
          from={from}
          to={planetPositions[i + 1]}
          color={PLANETS[i].color}
        />
      ))}
    </>
  )
}

/* ─── Exported Canvas wrapper ─── */
export default function SpaceScene() {
  return (
    <Canvas
      camera={{
        fov: 55,
        near: 0.1,
        far: 200,
        position: [0, 0, CAMERA_START_Z],
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background: "#050505",
      }}
    >
      <Scene />
    </Canvas>
  )
}
