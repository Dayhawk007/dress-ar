// WebcamComponent.js
import React from "react";
import Webcam from "react-webcam";

const WebcamComponent = ({ webcamRef,className }) => {
  return (
    <Webcam
      ref={webcamRef}
      className={className}
    />
  );
};

export default WebcamComponent;
