import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

const cream = '#fff5e7';
const dark = '#345552';
export function Part({ shape = 'box', args = [1, 1, 1], color = cream, glow = 0, metalness = 0.05, ...props }) {
  return <mesh castShadow receiveShadow {...props}>
    {shape === 'box' && <boxGeometry args={args} />}
    {shape === 'cylinder' && <cylinderGeometry args={args} />}
    {shape === 'sphere' && <sphereGeometry args={args} />}
    {shape === 'torus' && <torusGeometry args={args} />}
    {shape === 'ico' && <icosahedronGeometry args={args} />}
    <meshStandardMaterial color={color} roughness={0.85} metalness={metalness} emissive={color} emissiveIntensity={glow} />
  </mesh>;
}

export function HealthAsset({ hovered, reducedDetail, reducedMotion }) {
  const scan = useRef();
  useFrame(({ clock }) => { if (scan.current) scan.current.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 2) * 0.08); });
  const segments = reducedDetail ? 16 : 32;
  return <group>
    <Part shape="cylinder" args={[1.35, 1.45, 0.2, 24]} position={[0, 0.12, 0]} color="#f4b7aa" />
    <Part args={[1.65, 0.4, 0.7]} position={[0, 0.42, -0.3]} />
    <Part shape="torus" args={[0.78, 0.27, 8, segments]} position={[0, 1.32, -0.35]} color="#f8d5cc" />
    <Part shape="torus" args={[0.77, 0.075, 6, segments]} position={[0, 1.32, -0.05]} color="#ee765f" glow={hovered ? 1 : 0.15} />
    <Part args={[0.62, 0.16, 1.95]} position={[0, 0.88, 0.5]} />
    <Part args={[0.4, 0.55, 0.75]} position={[0, 0.51, 0.85]} color="#edb5a9" />
    <Part args={[0.5, 0.1, 0.32]} position={[0, 1, 1.15]} color="#ee765f" />
    <Part args={[0.13, 0.8, 0.13]} position={[1.1, 0.64, 0.4]} color={dark} />
    <Part args={[0.65, 0.5, 0.14]} position={[1.1, 1.24, 0.4]} color={dark} />
    <Part args={[0.5, 0.34, 0.025]} position={[1.1, 1.24, 0.48]} color="#afd7d0" glow={0.25} />
    <group ref={scan} position={[1.1, 1.24, 0.5]}><Part args={[0.3, 0.045, 0.02]} color={cream} /><Part args={[0.045, 0.22, 0.02]} color={cream} /></group>
  </group>;
}

export function TransportAsset({ hovered, reducedDetail, reducedMotion }) {
  const sensor = useRef();
  useFrame((_, delta) => { if (sensor.current && !reducedMotion) sensor.current.rotation.y += delta * 0.7; });
  return <group rotation={[0, -0.2, 0]}>
    <Part args={[3.4, 0.08, 2.4]} position={[0, 0.07, 0]} color="#738e86" />
    {[-1, 0, 1].map((x) => <Part key={x} args={[0.5, 0.02, 0.08]} position={[x, 0.12, 1]} color={hovered ? '#dcffe5' : cream} glow={hovered ? 0.8 : 0} />)}
    <RoundedBox args={[2.8, 1.25, 1.35]} radius={0.22} smoothness={reducedDetail ? 1 : 2} position={[0, 1.02, 0]} castShadow receiveShadow><meshStandardMaterial color="#a9d8c2" roughness={0.9} /></RoundedBox>
    <Part args={[2.25, 0.55, 1.39]} position={[0, 1.28, 0]} color={dark} />
    {[-0.65, 0.2, 0.95].map((x) => <Part key={x} args={[0.08, 0.56, 1.41]} position={[x, 1.28, 0]} color="#a9d8c2" />)}
    <Part args={[0.025, 0.56, 0.98]} position={[1.405, 1.26, 0]} color={dark} />
    {[-0.88, 0.88].flatMap((x) => [-0.69, 0.69].map((z) => <group key={`${x}-${z}`} position={[x, 0.43, z]} rotation={[Math.PI / 2, 0, 0]}><Part shape="cylinder" args={[0.32, 0.32, 0.2, 12]} color={dark} /><Part shape="cylinder" args={[0.16, 0.16, 0.22, 12]} color={cream} /></group>))}
    {[-0.42, 0.42].map((z) => <Part key={z} args={[0.045, 0.16, 0.23]} position={[1.4, 0.83, z]} color="#fff0b6" glow={0.6} />)}
    <Part args={[0.65, 0.18, 0.035]} position={[0, 1.55, 0.71]} color="#f3cd70" />
    <group ref={sensor} position={[0, 1.82, 0]}><Part shape="cylinder" args={[0.3, 0.3, 0.18, 16]} color={dark} /><Part shape="torus" args={[0.32, 0.035, 6, 16]} rotation={[Math.PI / 2, 0, 0]} color="#d7ffdf" glow={hovered ? 0.9 : 0.2} /><Part args={[0.42, 0.06, 0.09]} position={[0.2, 0.1, 0]} color={cream} /></group>
  </group>;
}

export function IndustryAsset({ hovered, reducedMotion }) {
  const arm = useRef();
  useFrame(({ clock }, delta) => { if (arm.current) { const target = hovered && !reducedMotion ? Math.sin(clock.elapsedTime * 1.6) * 0.12 : 0; arm.current.rotation.y += (target - arm.current.rotation.y) * Math.min(delta * 8, 1); } });
  return <group>
    <Part shape="cylinder" args={[0.72, 0.92, 0.35, 16]} position={[0, 0.25, 0]} color={dark} />
    <Part shape="cylinder" args={[0.52, 0.65, 0.35, 16]} position={[0, 0.59, 0]} color="#9ac9d6" />
    <group ref={arm} position={[0, 0.78, 0]}>
      <Part shape="sphere" args={[0.3, 12, 8]} color={cream} metalness={0.25} />
      <group rotation={[0, 0, -0.35]}><Part args={[0.36, 1.1, 0.4]} position={[0, 0.55, 0]} color="#9ac9d6" />
        <group position={[0, 1.1, 0]} rotation={[0, 0, -1.4]}><Part shape="sphere" args={[0.28, 12, 8]} color={cream} metalness={0.25} /><Part args={[0.3, 0.85, 0.33]} position={[0, 0.43, 0]} color="#9ac9d6" />
          <group position={[0, 0.85, 0]} rotation={[0, 0, -1.2]}><Part shape="sphere" args={[0.2, 12, 8]} color={cream} metalness={0.25} /><Part args={[0.24, 0.45, 0.26]} position={[0, 0.23, 0]} color="#9ac9d6" /><Part args={[0.55, 0.12, 0.22]} position={[0, 0.5, 0]} color={dark} />{[-0.23, 0.23].map((x) => <Part key={x} args={[0.09, 0.28, 0.18]} position={[x, 0.64, 0]} color={dark} metalness={0.3} />)}</group>
        </group>
      </group>
    </group>
    <Part args={[0.42, 0.18, 0.05]} position={[0, 0.6, 0.61]} color="#baffcf" glow={hovered ? 0.8 : 0.2} />
    <Part args={[0.65, 0.45, 0.65]} position={[1.3, 0.3, 0]} color="#e5cba5" />
  </group>;
}

export function EducationAsset({ hovered, reducedDetail, reducedMotion }) {
  const tiles = useRef();
  const hologram = useRef();
  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    tiles.current?.children.forEach((tile, i) => { tile.position.y = 1.8 + Math.sin(clock.elapsedTime * 1.4 + i * 2) * 0.1; });
    if (hologram.current) hologram.current.rotation.y += delta * 0.3;
  });
  return <group>
    {[-0.9, 0.9].flatMap((x) => [-0.6, 0.6].map((z) => <Part key={`${x}-${z}`} args={[0.17, 0.75, 0.17]} position={[x, 0.45, z]} color="#c7a764" />))}
    <Part args={[2.35, 0.22, 1.85]} position={[0, 0.92, 0]} color="#f3cd70" />
    <Part shape="torus" args={[0.55, 0.08, 6, reducedDetail ? 16 : 24]} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.08, 0]} color={cream} glow={0.4} />
    <group ref={hologram} position={[0, 1.82, 0]}><Part shape="ico" args={[0.48, 0]} color="#f3cd70" glow={hovered ? 0.75 : 0.25} /><Part shape="torus" args={[0.66, 0.025, 4, 24]} rotation={[0.3, 0.2, 0]} color={cream} /></group>
    <group ref={tiles}>{[-1, 0, 1].map((i) => <group key={i} position={[i * 0.9, 1.8, i === 0 ? -0.8 : 0.45]} rotation={[0, i * -0.35, 0]}><Part args={[0.48, 0.62, 0.08]} color={cream} /><Part args={[0.3, 0.065, 0.02]} position={[0, 0.1, 0.055]} color="#ddad47" /><Part args={[0.22, 0.045, 0.02]} position={[-0.04, -0.07, 0.055]} color="#9ac9d6" /></group>)}</group>
    {[0, 1, 2, 3].map((i) => <Part key={i} args={[0.28, 0.055, 0.025]} position={[-0.6 + i * 0.4, 0.92, 0.94]} color={i < 3 ? '#6c9980' : cream} />)}
  </group>;
}
