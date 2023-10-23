import React, { useEffect, useRef,useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import * as THREE from "three";
import WebcamComponent from "./components/WebCam";
import CanvasComponent from "./components/PoseNet";
import { drawKeypoints, drawSkeleton } from "./utility/utilities";
import jsQR from "jsqr";
import QrCanvas from "./components/QrCanvas";


export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);

  const [scannedQRs, setScannedQRs] = useState([]);
  const [lastScannedQR, setLastScannedQR] = useState(null);

  const [poseState,setPoseState] = useState(null);

  const [dressMap,setDressMap] = useState(new Map());

  const [rightShoulders,setRightShoulders]=useState(null)
  const [leftShoulders,setLeftShoulders]= useState(null)
  const [leftHips,setLeftHips]=useState(null)
  const [rightHips,setRightHips]=useState(null)


  const detectWebcamFeed = async (posenet_model) => {
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

          const codePositionTopRightCorner = code ? code.location.topRightCorner : null;

          const codePositionBottomRightCorner = code ? code.location.bottomRightCorner : null;

          const codePositionBottomLeftCorner = code ? code.location.bottomLeftCorner : null;

          const codePositionTopLeftCorner = code ? code.location.topLeftCorner : null;


          if(poseState && poseState!=null){
            for(var i=0;i<poseState.length;i++){

              
            

            if(code && code.data!="" && code.data!=null && poseState[i]["keypoints"][5]["position"]["x"]>=codePositionTopLeftCorner.x && poseState[i]["keypoints"][6]["position"]["x"]<=codePositionTopRightCorner.x ){
              
              console.log("CHECK")
              setDressMap(dressMap.set(code.data,poseState[i]));
              setLastScannedQR(code.data);

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
            else{
              const qrCodeCanvas = qrCanvasRef.current;
              const context = qrCodeCanvas.getContext("2d");
              qrCodeCanvas.width = 0;
              qrCodeCanvas.height = 0;
            }
          }
        }
        
      }
      const validPoses=[];
      for(const pose of poses){
        if(pose["keypoints"][5]["score"]>0.7 && pose["keypoints"][6]["score"]>0.7){
          validPoses.push(pose);
        }
      }
      if(validPoses.length>0){
        setPoseState(validPoses);
        setRightShoulders(validPoses.map((pose)=>pose["keypoints"][6]["position"]));
        setLeftShoulders(validPoses.map((pose)=>pose["keypoints"][5]["position"]));
        setLeftHips(validPoses.map((pose)=>pose["keypoints"][11]["position"]));
        setRightHips(validPoses.map((pose)=>pose["keypoints"][12]["position"]));
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

    const runPosenet = async () => {
      const posenet_model = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8
      });

      setInterval(() => {
        detectWebcamFeed(posenet_model);
      }, 100);
    };
    runPosenet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold z-10 text-white text-center">Dress AR Demo</h1>
        <div className="flex flex-row items-center justify-center">
          <div className="w-[640px] h-[480px]">
            <WebcamComponent webcamRef={webcamRef} />
            <CanvasComponent canvasRef={canvasRef} />
            <QrCanvas qrCanvasRef={qrCanvasRef}/>
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
