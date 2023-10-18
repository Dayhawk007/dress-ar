// CanvasComponent.js
import React from "react";

const CanvasComponent = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
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

export default CanvasComponent;
