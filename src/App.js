import React, { useEffect, useRef,useState } from "react";
import * as posenet from "@tensorflow-models/posenet";
import * as THREE from "three";
import WebcamComponent from "./components/WebCam";
import CanvasComponent from "./components/PoseNet";
import { drawKeypoints, drawSkeleton } from "./utility/utilities";
import jsQR from "jsqr";


export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [resultData,setResultData] = useState(null);

  const [poseState,setPoseState] = useState(null);

  const [isJacket,setIsJacket] = useState(false);
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
      const pose = await posenet_model.estimateSinglePose(video);
      if(pose!=null){
        const imageData = webcamRef.current.getScreenshot();


        jpegToUint8ClampedArray(imageData).then((uint8ClampedArray) => {
          // Now you have the Uint8ClampedArray for further processing.

          const code = jsQR(uint8ClampedArray, video.videoWidth, video.videoHeight);
    
          if(code && code.data!=resultData && code.data!=null){
            console.log(code.data);
            console.log(code);
            setResultData(code.data);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            // Draw the QR code overlay
            const location = code.location;
            canvas.width = webcamRef.current.video.videoWidth;
            canvas.height = webcamRef.current.video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw a red rectangle around the QR code
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
            ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
            ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
            ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
            ctx.closePath();
            ctx.stroke();

            // Draw QR code data text
            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`QR Code Data: ${code.data}`, location.topLeftCorner.x, location.topLeftCorner.y);
          }
        });
      }
      setPoseState(pose);
      drawResult(pose, videoWidth, videoHeight);
    }
  };

  function jpegToUint8ClampedArray(jpegImageData) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData.data);
      };
      img.src = jpegImageData;
    });
  }


  const drawResult = (pose, videoWidth, videoHeight) => {

    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  useEffect(() => {

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    const renderer=new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);



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
        <h1 className="text-4xl font-bold z-10 text-black text-center">Dress AR Demo</h1>
        <div className="flex flex-row items-center justify-center">
          <div className="w-[640px] h-[480px]">
            <WebcamComponent webcamRef={webcamRef} />
            <CanvasComponent canvasRef={canvasRef} />
          </div>
        </div>
      </header>
    </div>
  );
}
