import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Box3, Raycaster, Vector2, Vector3 } from 'three';

// Read-only diagnostics, opt-in with ?qa=1. Never controls app state or selection.
export default function SceneDiagnostics() {
  const { scene, camera, gl } = useThree();
  useEffect(() => {
    if (new URLSearchParams(location.search).get('qa') !== '1') return;
    window.__cityAudit = () => {
      scene.updateMatrixWorld(true);
      const rect = gl.domElement.getBoundingClientRect();
      const raycaster = new Raycaster();
      const records = {};
      scene.children.filter((node) => node.name.startsWith('zone-')).forEach((zone) => {
        let triangles = 0;
        const materials = new Set();
        const candidates = [];
        zone.traverse((mesh) => {
          if (!mesh.isMesh) return;
          triangles += (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) / 3;
          materials.add(mesh.material.uuid);
          const point = new Box3().setFromObject(mesh).getCenter(new Vector3()).project(camera);
          raycaster.setFromCamera(new Vector2(point.x, point.y), camera);
          const hit = raycaster.intersectObjects(scene.children, true)[0];
          let ancestor = hit?.object;
          while (ancestor && ancestor !== zone) ancestor = ancestor.parent;
          if (ancestor === zone && Math.abs(point.x) < 1 && Math.abs(point.y) < 1) candidates.push({ x: rect.left + (point.x + 1) * rect.width / 2, y: rect.top + (1 - point.y) * rect.height / 2 });
        });
        records[zone.name.replace('zone-', '')] = { triangles, materials: materials.size, target: candidates[candidates.length - 1], bounds: new Box3().setFromObject(zone).getSize(new Vector3()).toArray() };
      });
      return { zones: records, drawCalls: gl.info.render.calls, triangles: gl.info.render.triangles, dpr: gl.getPixelRatio() };
    };
    return () => { delete window.__cityAudit; };
  }, [scene, camera, gl]);
  return null;
}
