'use client';

import { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Object3D } from 'three';
import { zones } from './scene-data';
import SceneDiagnostics from './SceneDiagnostics';
import { EducationAsset, HealthAsset, IndustryAsset, Part, TransportAsset } from './assets/ZoneAssets';

const assetComponents = { health: HealthAsset, transport: TransportAsset, industry: IndustryAsset, education: EducationAsset };

export function ZoneAsset({ zone, explored, onSelect, onPointerOver, onPointerOut, reducedDetail, reducedMotion, labelPortal }) {
  const [hovered, setHovered] = useState(false);
  const Asset = assetComponents[zone.id];
  return <group name={`zone-${zone.id}`} position={zone.position} scale={zone.scale}
    onClick={(event) => { event.stopPropagation(); onSelect(zone); }}
    onPointerOver={(event) => { event.stopPropagation(); setHovered(true); onPointerOver?.(zone); }}
    onPointerOut={() => { setHovered(false); onPointerOut?.(zone); }}>
    <Part shape="cylinder" args={[1.95, 2.05, 0.24, reducedDetail ? 16 : 32]} position={[0, 0.12, 0]} color={zone.color} />
    <Part shape="cylinder" args={[1.84, 1.84, 0.1, 24]} position={[0, 0.28, 0]} color="#fff5e7" />
    <group position={[0, 0.34, 0]}><Asset hovered={hovered} reducedDetail={reducedDetail} reducedMotion={reducedMotion} /></group>
    <Html portal={labelPortal} position={[0, 3.05, 0]} center zIndexRange={[2, 1]} style={{ pointerEvents: 'none' }}>
      <div className={`scene-label ${hovered ? 'scene-label-active' : ''}`}><b>{zone.label}</b><span>{explored ? '✓ DIJELAJAHI' : 'JELAJAHI ZONA'}</span></div>
    </Html>
  </group>;
}

function Trees({ reducedDetail }) {
  const trunks = useRef();
  const crowns = useRef();
  const count = reducedDetail ? 8 : 16;
  useLayoutEffect(() => {
    const dummy = new Object3D();
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2;
      const x = Math.cos(angle) * 7.7;
      const z = Math.sin(angle) * 6.7;
      dummy.position.set(x, 0.42, z); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); trunks.current.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 1.05, z); dummy.scale.set(1, 1.25 + (i % 3) * 0.12, 1); dummy.updateMatrix(); crowns.current.setMatrixAt(i, dummy.matrix);
    }
    trunks.current.instanceMatrix.needsUpdate = true; crowns.current.instanceMatrix.needsUpdate = true;
  }, [count]);
  return <group>
    <instancedMesh ref={trunks} args={[null, null, count]} castShadow><cylinderGeometry args={[0.1, 0.14, 0.8, 6]} /><meshStandardMaterial color="#a98d70" roughness={1} /></instancedMesh>
    <instancedMesh ref={crowns} args={[null, null, count]} castShadow><icosahedronGeometry args={[0.48, 0]} /><meshStandardMaterial color="#8fbaa2" roughness={1} /></instancedMesh>
  </group>;
}

function CameraFit() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    // Frame the district by the limiting viewport dimension, including portrait phones.
    const distance = size.width < 500 ? 26 : 22;
    camera.position.set(distance * 0.25, distance * 0.73, distance * 0.85);
    camera.lookAt(0, 0.6, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('City canvas unavailable:', error); }
  render() { return this.state.failed ? <div className="scene-fallback" role="status">Peta 3D tidak tersedia. Kamu tetap bisa menjelajahi semua zona melalui City index.</div> : this.props.children; }
}

export default function CityScene({ exploredZones, onSelect }) {
  const labelPortal = useRef();
  const [mobile, setMobile] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  useEffect(() => {
    const narrow = matchMedia('(max-width: 800px)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setMobile(narrow.matches); setReducedMotion(motion.matches); };
    update(); narrow.addEventListener('change', update); motion.addEventListener('change', update);
    return () => { narrow.removeEventListener('change', update); motion.removeEventListener('change', update); };
  }, []);
  const reducedDetail = mobile || slow;
  return <>
    <div className="scene-labels" ref={labelPortal} />
    <SceneBoundary><Canvas shadows={!reducedDetail} dpr={reducedDetail ? 1 : [1, 1.5]} camera={{ position: [5.5, 16, 18.7], fov: 42, near: 0.1, far: 80 }} style={{ cursor: hoveredZone ? 'pointer' : 'grab' }} fallback={<div className="scene-fallback">Pilih zona melalui City index untuk mulai belajar.</div>}>
      <color attach="background" args={['#e9e9e0']} />
      <ambientLight intensity={1.3} /><hemisphereLight args={['#fff8eb', '#91afa3', 1]} />
      <directionalLight castShadow={!reducedDetail} position={[-5, 12, 8]} intensity={2} color="#fff3d4" shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-normalBias={0.04} />
      <PerformanceMonitor bounds={() => [30, 50]} onDecline={() => setSlow(true)} flipflops={1} onFallback={() => setSlow(true)} />
      <Part args={[18, 0.25, 15.5]} position={[0, -0.2, 0]} color="#b8cdbd" />
      <Part args={[15, 0.03, 1.2]} position={[0, -0.045, 0]} color="#8fa99c" />
      <Part args={[1.25, 0.035, 12]} position={[0, -0.04, 0]} color="#8fa99c" />
      <Trees reducedDetail={reducedDetail} />
      <group><Part shape="cylinder" args={[1.15, 1.3, 0.25, 24]} position={[0, 0.13, 0]} /><Part shape="ico" args={[0.48, 1]} position={[0, 0.92, 0]} color="#ee765f" /><Part shape="torus" args={[0.78, 0.035, 6, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.7, 0]} color="#fff5e7" /></group>
      {zones.map((zone) => <ZoneAsset key={zone.id} zone={zone} explored={exploredZones.includes(zone.id)} onSelect={onSelect} onPointerOver={setHoveredZone} onPointerOut={() => setHoveredZone(null)} reducedDetail={reducedDetail} reducedMotion={reducedMotion} labelPortal={labelPortal} />)}
      <CameraFit /><SceneDiagnostics /><OrbitControls enablePan={false} minDistance={15} maxDistance={34} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.8} target={[0, 0.6, 0]} />
    </Canvas></SceneBoundary>
    {hoveredZone && <div className="scene-tooltip" role="status"><b>{hoveredZone.assetName}</b><span>{hoveredZone.tooltip}</span></div>}
  </>;
}
