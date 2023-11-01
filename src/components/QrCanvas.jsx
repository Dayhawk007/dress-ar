import React from 'react'

const QrCanvas = ({qrCanvasRef,className}) => {
  return (
    <canvas
    ref={qrCanvasRef}
    className={className}
    >

    </canvas>
  )
}

export default QrCanvas