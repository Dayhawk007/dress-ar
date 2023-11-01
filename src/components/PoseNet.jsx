// CanvasComponent.js
import React from "react";

const CanvasComponent = ({ canvasRef,className }) => {
  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
};

export default CanvasComponent;
