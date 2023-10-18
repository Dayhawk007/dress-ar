import React, { useState, useRef, useImperativeHandle } from 'react';
import QrReader from 'react-qr-scanner';

const QrScanner = React.forwardRef((props, ref) => {
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');
  const qrReaderRef = useRef(null);

  const handleScan = (data) => {
    setResult(data);
  }

  const handleError = (err) => {
    console.error(err);
  }

  const previewStyle = {
    position: "absolute",
    marginLeft: "25%",
    marginTop: "5%",
    left: 0,
    textAlign: "center",
    zIndex: 9,
    width: 640,
    height: 480
  }

  // Forwarding the reference to the parent component
  useImperativeHandle(ref, () => ({
    clear: () => {
      setResult('No result');
      // You can also add other methods or properties to be exposed via the ref
    }
  }));

  return (
    <div>
      <QrReader
        ref={qrReaderRef} // Pass the ref to the QrReader component
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p style={
        {
            zIndex: 10,
        }
      }>{result}</p>
    </div>
  );
});

export default QrScanner;
