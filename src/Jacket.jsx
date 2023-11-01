/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 ./src/components/jacket.glb --transform 
Files: ./src/components/jacket.glb [9.04MB] > jacket-transformed.glb [3.06MB] (66%)
*/

import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Vector3, Matrix4 } from 'three';

export function Model(props) {
  const { scene,nodes, materials } = useGLTF('jacket1.glb')

  const jacketRef = useRef();

//  console.log("nodes",nodes);
  return (
    <group ref={jacketRef} {...props} dispose={null}>
        <primitive object={nodes.Hips}  />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
    </group>
    
  )
}

useGLTF.preload('jacket1.glb')
