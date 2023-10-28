import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ClothTest = ({modelUri}) => {
  const containerRef = useRef();


  const loadModel = async (scene,modelUri) => {

    const loader=new GLTFLoader();

    if(modelUri){
      loader.load(modelUri,(gltf) => {
        const model=gltf.scene;

        model.position.set(0,0,0);
        model.scale.set(0.1,0.1,0.1);
        model.rotation.set(0,0,0);

        scene.add(model);
      });
  }
    
  }


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
    camera.position.z = 5;

    loadModel(scene,modelUri);
  }, []);

  return <div ref={containerRef} />;
};

export default ClothTest;
