'use client';

import { useCallback, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const visitChildren = (object, fn) => {
  if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      visitChildren(child, fn);
    }
  } else {
    fn(object);
  }
};

const initThreeJsScene = (node) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = -3;
  camera.position.z = 8;
  camera.position.y = 2;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  node.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, node);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const gui = new dat.GUI();

  const loader = new GLTFLoader();
  loader.load('./assets/sea_house/scene.gltf', function (gltf) {
    const model = gltf.scene;
    model.scale.setScalar(0.2, 0.2, 0.2);
    visitChildren(model, (child) => {
      if (child.material) {
        child.material.depthWrite = true;
      }
    });
    scene.add(model);

    // debug position, scale and rotation
    const folder = gui.addFolder('Model Transformation');
    folder.add(model.position, 'x', -10, 10);
    folder.add(model.position, 'y', -10, 10);
    folder.add(model.position, 'z', -10, 10);
    folder.add(model.scale, 'x', 0, 2);
    folder.add(model.scale, 'y', 0, 2);
    folder.add(model.scale, 'z', 0, 2);
    folder.add(model.rotation, 'x', 0, Math.PI * 2);
    folder.add(model.rotation, 'y', 0, Math.PI * 2);
    folder.add(model.rotation, 'z', 0, Math.PI * 2);
    folder.open();
  });

  window.addEventListener(
    'resize',
    function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};

export const ThreeCanvas = () => {
  const [initialized, setInitialized] = useState(false);

  const threeDivRef = useCallback(
    (node) => {
      if (node !== null && !initialized) {
        initThreeJsScene(node);
        setInitialized(true);
      }
    },
    [initialized]
  );

  return <div ref={threeDivRef}></div>;
};
