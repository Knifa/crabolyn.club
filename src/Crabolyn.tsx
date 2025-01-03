import { css } from "@emotion/css";
import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

import { useEffect, useRef } from "react";
import { useHue } from "./HueProvider";

async function loadModel() {
  const loader = new STLLoader();

  const geometry = await loader.loadAsync("public/crabolyn/crabolyn.stl");
  geometry.center();
  geometry.rotateX(-Math.PI * 0.5);

  const mesh = new THREE.Mesh(geometry);
  return mesh;
}

export function Crabolyn() {
  const { hueRef } = useHue();
  const ref = useRef<HTMLCanvasElement>(null);

  const classNames = css({
    width: "70%",
  });

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

    const camera = new THREE.PerspectiveCamera(10, 1, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.33);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(5, 5, 5);
    scene.add(light);

    let crabolyn: THREE.Mesh;
    loadModel().then((mesh) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xbb55ff,
        roughness: 0.3,
        metalness: 0.5,
      });
      mesh.material = material;
      scene.add(mesh);

      crabolyn = mesh;
      render();
    });

    let running = true;
    let lastTimestamp = 0;

    function render(timestamp: number = 0) {
      if (!running) {
        return;
      }

      requestAnimationFrame(render);

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      const deltaSecs = delta / 1000;

      (crabolyn.material as THREE.MeshPhysicalMaterial).color.setHSL(
        hueRef.current / 360,
        0.5,
        0.5
      );

      crabolyn.rotation.y += 0.2 * deltaSecs;
      crabolyn.rotation.x += 0.3 * deltaSecs;
      crabolyn.rotation.z += 0.5 * deltaSecs;

      renderer.render(scene, camera);
    }

    return () => {
      running = false;
      renderer.dispose();
    };
  }, [hueRef, ref]);

  return <canvas className={classNames} ref={ref} width={512} height={512} />;
}

export default Crabolyn;
