import React, { useEffect, useRef,useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import WebcamComponent from "./components/WebCam";
import CanvasComponent from "./components/PoseNet";
import { drawKeypoints, drawSkeleton } from "./utility/utilities";
import jsQR from "jsqr";
import QrCanvas from "./components/QrCanvas";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);

  const [scannedQRs, setScannedQRs] = useState([]);
  const [lastScannedQR, setLastScannedQR] = useState(null);

  const [poseState,setPoseState] = useState(null);

  const [dressMap,setDressMap] = useState(new Map());

  const [poseIdMap,setPoseIdMap] = useState(new Map());

  const [distanceBetweenShoulders,setDistanceBetweenShoulders] = useState(0);

  const [rightShoulder,setRightShoulder] = useState(null);

  const [leftShoulder,setLeftShoulder] = useState(null);

  const [leftWaist,setLeftWaist] = useState(null);

  const [rightWaist,setRightWaist] = useState(null);

  const detectWebcamFeed = async (posenet_model,scene) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      

      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      video.width = videoWidth;
      video.height = videoHeight;
      const poses = await posenet_model.estimateMultiplePoses(video);

      if(poses!=null){

        const canvas=canvasRef.current;

        const context=canvas.getContext('2d');

        canvas.width=videoWidth;
        canvas.height=videoHeight;

        context.drawImage(video,0,0,videoWidth,videoHeight);


        const imageData = context.getImageData(0, 0, videoWidth, videoHeight)

          // Now you have the Uint8ClampedArray for further processing.

          const code = jsQR(imageData.data, video.videoWidth, video.videoHeight);

          if(poses!=null){
            
            setPoseIdMap(new Map());

            for(var i=0;i<poses.length;i++){

              setPoseIdMap(poseIdMap.set(i,poses[i]));

              const poseToTest=poses[i];

              if(poseToTest["keypoints"][5]["score"]>0.7 && poseToTest["keypoints"][6]["score"]>0.7){
                  const distanceBetweenShoulders=poseToTest["keypoints"][5]["position"]["x"]-poseToTest["keypoints"][6]["position"]["x"];                  
                  console.log(distanceBetweenShoulders);
                  setDistanceBetweenShoulders(distanceBetweenShoulders);
                  const rightShoulder=poseToTest["keypoints"][6]["position"];
                  setRightShoulder(rightShoulder);
                  const leftShoulder=poseToTest["keypoints"][5]["position"];
                  setLeftShoulder(leftShoulder);
              }

              if(poseToTest["keypoints"][11]["score"]>0.7 && poseToTest["keypoints"][12]["score"]>0.7){
                const leftWaist=poseToTest["keypoints"][11]["position"];
                setLeftWaist(leftWaist);
                const rightWaist=poseToTest["keypoints"][12]["position"];
                setRightWaist(rightWaist);
              }

              setPoseState(poses);
              
              if(code && poses[i]["keypoints"][5]["score"]>0.7 && poses[i]["keypoints"][6]["score"]>0.7 && scannedQRs.includes(code.data)==false){
              
                setScannedQRs([...scannedQRs,code.data]);

                setDressMap(dressMap.set(i,code.data));

                const qrCodeCanvas = qrCanvasRef.current;
                const context = qrCodeCanvas.getContext("2d");

                qrCodeCanvas.width = videoWidth;
                qrCodeCanvas.height = videoHeight;

                context.strokeStyle = 'green';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
                context.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
                context.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
                context.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
                context.closePath();
                context.stroke();

              context.font = "16px Arial";
              context.fillStyle = 'green';
              context.fillText(code.data, code.location.topRightCorner.x, code.location.topRightCorner.y - 5);
            }
            else if(code==null || code==undefined){
              const qrCodeCanvas = qrCanvasRef.current;
              const context = qrCodeCanvas.getContext("2d");
              qrCodeCanvas.width = 0;
              qrCodeCanvas.height = 0;
            }
            if(dressMap.has(i) && !poseIdMap.has(i)){
              dressMap.delete(i);
            }
          }
        }

        if(dressMap.has(i)){
          const loader = new GLTFLoader();
          loader.load(dressMap.get(i), function(gltf){
            gltf.scene.scale.set(0.5,0.5,0.5);
            scene.add(gltf.scene);
          });
        }
        
      }
      for(const pose of poses){
        drawResult(pose, videoWidth, videoHeight);
      }
    }
  };





  const drawResult = (pose, videoWidth, videoHeight) => {

    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  useEffect(() => {

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


    // Position the camera
    camera.position.z = 5;

    const runPosenet = async () => {
      const posenet_model = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8
      });

      setInterval(() => {
        detectWebcamFeed(posenet_model,scene);
      }, 10);
    };
    runPosenet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold z-10 text-white text-center">Dress AR Demo</h1>
        <div className="flex flex-col items-center justify-center">
          <div className=" flex flex-col w-screen h-screen">
            <WebcamComponent className="absolute ml-[25%] mt-[5%] left-0 text-center z-9 w-[640px] h-[480px]" webcamRef={webcamRef} />
            <CanvasComponent className="absolute ml-[25%] mt-[5%] left-0 text-center z-9 w-[640px] h-[480px]" canvasRef={canvasRef} />
            <QrCanvas className="absolute ml-[25%] mt-[5%] left-0 text-center z-9 w-[640px] h-[480px]" qrCanvasRef={qrCanvasRef}/>
          </div>
          <div className="flex flex-row items-end w-full">
            <div className="flex flex-col w-full">
              <p className="text-white text-right w-full ml-auto"> Scanned Poses</p>
              {poseState?poseState.map((pose,index) => {

                return <p className="text-white text-right w-full ml-auto">{index+1}. {pose["keypoints"][5]["position"]["x"]},{pose["keypoints"][5]["position"]["y"]}</p>

              }
              ):null}
              <p className="text-white text-right w-full ml-auto">Scanned Qrs</p>
              {scannedQRs.map((qr,index) => {
                return <p className="text-white text-right w-full ml-auto">{index+1}. {qr}</p>
              })}
              </div>
          </div>
        </div>
        
        
      </header>
    </div>
  );
}
