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
            const x=(((props.leftShoulder.x+props.rightShoulder.x)/2)-320)/106.66;
            setXOffset(x);
        }
    }, [props]);
    return (
        <Canvas>
        <Suspense fallback={null}>
            <ambientLight intensity={5} position={[0,-20,0]} />
            <Model position={[xOffSet,-12,0]} scale={props.eyeDistance/25.0}   />
        </Suspense>
        </Canvas>
    );
    };

export default ClothThreeFiber;