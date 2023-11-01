import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const ClothTest = ({modelUri}) => {
  const containerRef = useRef();


  const loadModel = async(modelUri,scene) => { 
    const loader = new GLTFLoader();
    loader.load(modelUri, function(gltf){
      const model = gltf.scene;
      model.scale.set(10,10,10);
      model.position.set(100,100,100);
      scene.add(model);
      console.log("model loaded");
    });
  };

  useEffect(() => {
    // Create a scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});

    // Set the renderer size
    renderer.setSize(640, 480);

    // Set the canvas style
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.marginLeft = "25%";
    renderer.domElement.style.marginTop = "5%";
    renderer.domElement.style.left = 0;
    renderer.domElement.style.textAlign = "center";
    renderer.domElement.style.zIndex = 9;

    renderer.setClearColor(0x000000, 0);

    // Append the renderer's canvas to the container
    containerRef.current.appendChild(renderer.domElement);

    // Position the camera
    camera.position.z = 20;

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    loadModel('/jacket.glb',scene);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

  }, []);

  return <div ref={containerRef} >
    
  </div>;
};

export default ClothTest;
