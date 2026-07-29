import { useRef, useState, useEffect } from 'react';
import { colors, buttonStyle, buttonSecondaryStyle } from '../utils/styles';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [capturedPreview, setCapturedPreview] = useState(null);
  const [error, setError] = useState('');
  const [cameraOn, setCameraOn] = useState(false);

  // List available video input devices (so Camo/Iriun shows up as a choice)
  const loadDevices = async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = all.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (videoInputs.length && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      setError('Could not list camera devices.');
    }
  };

  const startCamera = async () => {
    setError('');
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
      await loadDevices(); // refresh labels now that permission is granted
    } catch (err) {
      setError('Could not access camera. Check permissions or that Camo/Iriun is running.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const capture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setCapturedPreview(URL.createObjectURL(blob));
      onCapture(blob);
    }, 'image/jpeg', 0.9);
  };

  const retake = () => {
    setCapturedPreview(null);
    onCapture(null);
  };

  useEffect(() => {
    loadDevices();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {error && <div style={{ color: colors.danger, fontSize: '13px', marginBottom: '10px' }}>{error}</div>}

      {devices.length > 1 && (
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '6px',
            background: colors.surfaceLight,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            width: '100%',
          }}
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || 'Camera'}
            </option>
          ))}
        </select>
      )}

      <div style={{
        width: '100%',
        aspectRatio: '4 / 3',
        background: '#000',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid ${colors.border}`,
      }}>
        {capturedPreview ? (
          <img src={capturedPreview} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraOn ? 'block' : 'none' }}
          />
        )}
        {!cameraOn && !capturedPreview && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: colors.textMuted, fontSize: '14px',
          }}>
            Camera not started
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        {!cameraOn && !capturedPreview && (
          <button type="button" style={buttonStyle} onClick={startCamera}>Start Camera</button>
        )}
        {cameraOn && !capturedPreview && (
          <>
            <button type="button" style={buttonStyle} onClick={capture}>Capture Iris Image</button>
            <button type="button" style={buttonSecondaryStyle} onClick={stopCamera}>Stop Camera</button>
          </>
        )}
        {capturedPreview && (
          <button type="button" style={buttonSecondaryStyle} onClick={retake}>Retake</button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;