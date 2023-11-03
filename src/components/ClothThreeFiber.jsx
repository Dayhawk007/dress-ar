import { Canvas } from "react-three-fiber";
import { OrbitControls} from "@react-three/drei";
import { Suspense } from "react";
import { Vector3 } from "three";
import { Model } from "../Jacket";
import { useEffect,useState } from "react";

const ClothThreeFiber = (props) => {
    const [yOffSet, setYOffset] = useState(0);
    const [xOffSet, setXOffset] = useState(0);

    const [offsetVector, setOffsetVector] = useState(new Vector3(0,0,0));
    useEffect(() => {
        if(props.rightShoulder && props.leftShoulder){
            const x=(((props.leftShoulder.x+props.rightShoulder.x)/2)-280)/106.66;
            const y=(((props.leftShoulder.y+props.rightShoulder.y)/2)-240)/80.0;
            setXOffset(x);
            setYOffset(y);
            console.log(x,y);
        }
    }, [props]);
    return (
        <Canvas>
        <Suspense fallback={null}>
            <ambientLight intensity={5} position={[0,-20,0]} />
            <Model position={[xOffSet,-13.5+yOffSet,-7+(props.eyeDistance/25.0)]} scale={8}   />
        </Suspense>
        </Canvas>
    );
    };

export default ClothThreeFiber;