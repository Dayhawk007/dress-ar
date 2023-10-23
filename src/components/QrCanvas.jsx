import React from 'react'

const QrCanvas = ({qrCanvasRef}) => {
  return (
    <canvas
    ref={qrCanvasRef}
    style={{
        position: "absolute",
        marginLeft: "25%",
        marginTop: "5%",
        left: 0,
        textAlign: "center",
        zIndex: 9,
        width: 640,
        height: 480
      }}>

    </canvas>
  )
}

export default QrCanvas