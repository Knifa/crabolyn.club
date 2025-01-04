import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

import { useEffect, useRef } from "react";

async function loadModel() {
  const loader = new STLLoader();

  const geometry = await loader.loadAsync("/crabolyn/crabolyn.stl");
  geometry.center();
  geometry.rotateX(-Math.PI * 0.5);

  const mesh = new THREE.Mesh(geometry);
  return mesh;
}

export function Crabolyn() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: ref.current,
    });

    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(5, 1, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.33);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(5, 5, 5);
    scene.add(light);

    let crabolyn: THREE.Mesh;
    loadModel().then((mesh) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("hsl(270, 80%, 60%)"),
        roughness: 0.2,
        metalness: 0.1,
      });
      mesh.material = material;
      scene.add(mesh);

      crabolyn = mesh;
      render();
    });

    let handle: number | null = null;
    let lastTimestamp = 0;

    function render(timestamp: number = 0) {
      handle = requestAnimationFrame(render);

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      const deltaSecs = delta / 1000;

      const hue = Number(
        document.documentElement.style.getPropertyValue("--hue"),
      );
      (crabolyn.material as THREE.MeshPhysicalMaterial).color.setHSL(
        hue / 360,
        1.0,
        0.6,
      );

      crabolyn.rotation.y += 0.2 * deltaSecs;
      crabolyn.rotation.x += 0.3 * deltaSecs;
      crabolyn.rotation.z += 0.5 * deltaSecs;

      renderer.render(scene, camera);
    }

    return () => {
      if (handle !== null) {
        cancelAnimationFrame(handle);
      }

      renderer.dispose();
    };
  }, [ref]);

  return (
    <canvas
      css={{
        backgroundColor: "var(--primary)",
        borderRadius: "16px",
        filter: "drop-shadow(8px 8px 0 var(--shadow))",
        width: "80%",
        margin: "auto",
      }}
      ref={ref}
      width={256}
      height={256}
    />
  );
}

export default Crabolyn;
