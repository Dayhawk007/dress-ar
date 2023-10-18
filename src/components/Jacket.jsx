import React, { Suspense, useEffect } from 'react'
import { useGLTF,Stage,PresentationControls, OrbitControls } from '@react-three/drei';
import { Canvas } from 'react-three-fiber';


const Model= (props) => {
  const { scene ,nodes,materials} = useGLTF('/jacket.glb')
  useEffect(() => {
    console.log(nodes)
  }, []) 
  return (
    <group {...props} dispose={null}>
        <primitive object={scene} scale={2}  />
    </group>
  )
}

const Jacket = (props) => {

  useEffect(() => {
    console.log(props.rightEyePosition.x)
  })

  return (
    <Canvas className='mt-32'
    camera={{ position: [30, 0, 0], fov: 15 }}
    >
        <Stage intensity={0.5} contactShadowOpacity={1} shadows adjustCamera={false} preset="rembrandt"/>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
        <Model className="w-full h-full" rotation={[0,props.rightEyePosition.x/100 +4.5,0]} />
        </Suspense>
        
    </Canvas>
  )
}

export default Jacket

