import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';

const QRGenerator = () => {
  const qrRef = useRef(null);
  const [url, setUrl] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [qrStyle, setQrStyle] = useState('dots');
  const [startColor, setStartColor] = useState('#007CF0');
  const [endColor, setEndColor] = useState('#7928CA');

  const [logoImage, setLogoImage] = useState(null);
  const [logoSizePercent, setLogoSizePercent] = useState(20); // % of QR size
  const [logoBorderRadius, setLogoBorderRadius] = useState(0); // user controlled border-radius %

  const qrCode = useRef(
    new QRCodeStyling({
      width: size,
      height: size,
      data: url,
      type: 'canvas',
      dotsOptions: {
        type: qrStyle,
        gradient: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor }
          ]
        }
      },
      backgroundOptions: {
        color: '#ffffff'
      },
      // no logo here, logo overlay handled separately
    })
  );

  useEffect(() => {
    qrCode.current.update({
      data: url,
      width: size,
      height: size,
      dotsOptions: {
        type: qrStyle,
        gradient: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor }
          ]
        }
      }
    });

    qrCode.current.append(qrRef.current);
  }, [url, size, qrStyle, startColor, endColor]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setLogoImage(imageURL);
    }
  };

  // Download QR code + logo combined (basic version)
  const download = (ext) => {
    qrCode.current.download({ extension: ext });
  };

  return (
    <div>
      {/* URL input, style pickers etc same as before */}

      <div className="mb-3">
        <label>Enter URL:</label>
        <input
          className="form-control"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Select QR Style:</label>
        <select
          className="form-select"
          value={qrStyle}
          onChange={(e) => setQrStyle(e.target.value)}
        >
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Pick Gradient Colors for QR:</label>
        <div className="d-flex gap-2">
          <div>
            <small>Start:</small>
            <input
              type="color"
              className="form-control form-control-color"
              value={startColor}
              onChange={(e) => setStartColor(e.target.value)}
              title="Start Color"
            />
          </div>
          <div>
            <small>End:</small>
            <input
              type="color"
              className="form-control form-control-color"
              value={endColor}
              onChange={(e) => setEndColor(e.target.value)}
              title="End Color"
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label>QR Code Size (px): {size}</label>
        <input
          type="range"
          min="150"
          max="500"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="form-range"
        />
      </div>

      <div className="mb-3">
        <label>Upload Logo (optional):</label>
        <input className="form-control" type="file" onChange={handleLogoUpload} />
      </div>

      {logoImage && (
        <>
          <div className="mb-3">
            <label>Logo Size (% of QR): {logoSizePercent}</label>
            <input
              type="range"
              min="5"
              max="100"
              value={logoSizePercent}
              onChange={(e) => setLogoSizePercent(Number(e.target.value))}
              className="form-range"
            />
          </div>

          <div className="mb-3">
            <label>Round Logo Corners (%): {logoBorderRadius}</label>
            <input
              type="range"
              min="0"
              max="50"
              value={logoBorderRadius}
              onChange={(e) => setLogoBorderRadius(Number(e.target.value))}
              className="form-range"
            />
          </div>
        </>
      )}

      <div
        className="my-4 position-relative mx-auto"
        style={{ width: size, height: size }}
      >
        <div ref={qrRef} />
        {logoImage && (
          <img
            src={logoImage}
            alt="Logo"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${logoSizePercent}%`,
              height: `${logoSizePercent}%`,
              transform: 'translate(-50%, -50%)',
              borderRadius: `${logoBorderRadius}%`,
              objectFit: 'contain',
              backgroundColor: 'white',
              padding: '4px',
              boxSizing: 'border-box',
              // fixed circular frame:
              clipPath: 'circle(50% at 50% 50%)',
            }}
          />
        )}
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => download('png')}>
          Download PNG
        </button>
        <button className="btn btn-success" onClick={() => download('jpg')}>
          Download JPG
        </button>
        <button className="btn btn-dark" onClick={() => download('svg')}>
          Download SVG
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
