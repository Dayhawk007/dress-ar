import { Canvas } from "react-three-fiber";
import { OrbitControls} from "@react-three/drei";
import { Suspense } from "react";
import { Vector3 } from "three";
import { Model } from "../Jacket";
import { useEffect,useState } from "react";

const ClothThreeFiber = (props) => {
    const [yOffSet, setYOffset] = useState(0);
    const [xOffSet, setXOffset] = useState(0);
    
    useEffect(() => {
        if(props.rightShoulder && props.leftShoulder && props.rightWaist && props.leftWaist){
            const x=(((props.leftWaist.x+props.rightWaist.x)/2)-320)/106;
            const y=(((props.leftWaist.y+props.rightWaist.y)/2)-240)/(480/(props.eyeDistance/32.0));
            setXOffset(x);
            setYOffset(y);
        }
    }, [props]);
    return (
        <Canvas>
        <Suspense fallback={null}>
            <ambientLight intensity={5} position={[0,-20,0]} />
            <Model pose={props.pose} scale={[props.eyeDistance/22.0,props.eyeDistance/22.0,1]} position={[xOffSet,-props.eyeDistance/25.0+yOffSet,0]} /> {/* Have to replace the values with waist and offsets as soon as I get light*/ }
        </Suspense>
        </Canvas>
    );
    };

export default ClothThreeFiber;