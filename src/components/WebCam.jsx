// WebcamComponent.js
import React from "react";
import Webcam from "react-webcam";

const WebcamComponent = ({ webcamRef }) => {
  return (
    <Webcam
      ref={webcamRef}
      style={{
        position: "absolute",
        marginLeft: "25%",
        marginTop: "5%",
        left: 0,
        textAlign: "center",
        zIndex: 9,
        width: 640,
        height: 480
      }}
    />
  );
};

export default WebcamComponent;
