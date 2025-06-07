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
  const [logoSizePercent, setLogoSizePercent] = useState(20);
  const [logoBorderColor, setLogoBorderColor] = useState('#ffffff');
  const [logoShape, setLogoShape] = useState('circle'); // 'circle' or 'square'
  const [logoPadding, setLogoPadding] = useState(true);

  // QRCodeStyling instance without image property (logo)
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
            { offset: 1, color: endColor },
          ],
        },
      },
      backgroundOptions: {
        color: '#ffffff',
      },
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
            { offset: 1, color: endColor },
          ],
        },
      },
    });

    // Clear previous QR before appending again to avoid duplicates
    if (qrRef.current.firstChild) {
      qrRef.current.firstChild.remove();
    }
    qrCode.current.append(qrRef.current);
  }, [url, size, qrStyle, startColor, endColor]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setLogoImage(imageURL);
    }
  };

  // Custom download: merge QR canvas and styled logo overlay into one canvas
  const downloadWithLogo = (ext) => {
    // Get the QR canvas element
    const qrCanvas = qrRef.current.querySelector('canvas');
    if (!qrCanvas) {
      alert('QR code not ready yet!');
      return;
    }

    // Create a new canvas for combined image
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = qrCanvas.width;
    combinedCanvas.height = qrCanvas.height;
    const ctx = combinedCanvas.getContext('2d');

    // Draw the QR code first
    ctx.drawImage(qrCanvas, 0, 0);

    if (logoImage) {
      // Draw the styled logo with border and padding manually

      // Calculate logo size in pixels relative to QR size
      const logoSizePx = (logoSizePercent / 100) * combinedCanvas.width;

      // Position logo at center
      const x = (combinedCanvas.width - logoSizePx) / 2;
      const y = (combinedCanvas.height - logoSizePx) / 2;

      // Draw white background rectangle with padding if enabled
      const paddingPx = logoPadding ? 8 : 0;
      const bgSize = logoSizePx + 2 * paddingPx;

      // Draw background (white box behind logo)
      ctx.fillStyle = '#fff';
      if (logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, bgSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // square background
        ctx.fillRect(x - paddingPx, y - paddingPx, bgSize, bgSize);
      }

      // Draw border
      if (logoBorderColor) {
        ctx.strokeStyle = logoBorderColor;
        ctx.lineWidth = 2;
        if (logoShape === 'circle') {
          ctx.beginPath();
          ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, bgSize / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeRect(x - paddingPx, y - paddingPx, bgSize, bgSize);
        }
      }

      // Draw the logo image clipped if circle shape
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous'; // To avoid CORS issues on some browsers
      logoImg.src = logoImage;
      logoImg.onload = () => {
        ctx.save();
        if (logoShape === 'circle') {
          ctx.beginPath();
          ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, logoSizePx / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        }
        ctx.drawImage(logoImg, x, y, logoSizePx, logoSizePx);
        ctx.restore();

        // After drawing everything, trigger download
        const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' ? 'image/jpeg' : 'image/svg+xml';

        // For SVG, fallback to PNG since canvas is raster only
        if (ext === 'svg') {
          alert('SVG download with logo is not supported. Downloading PNG instead.');
          combinedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qr-code.png';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }, 'image/png');
          return;
        }

        combinedCanvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-code.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, mimeType);
      };
      logoImg.onerror = () => alert('Failed to load logo image for download.');
    } else {
      // No logo, just download QR directly
      qrCode.current.download({ extension: ext });
    }
  };

  return (
    <div>
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
            <label>Logo Border Color:</label>
            <input
              type="color"
              value={logoBorderColor}
              onChange={(e) => setLogoBorderColor(e.target.value)}
              className="form-control form-control-color"
            />
          </div>

          <div className="mb-3">
            <label>Logo Shape:</label>
            <select
              className="form-select"
              value={logoShape}
              onChange={(e) => setLogoShape(e.target.value)}
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={logoPadding}
              onChange={(e) => setLogoPadding(e.target.checked)}
              id="logoPadding"
            />
            <label className="form-check-label" htmlFor="logoPadding">
              Enable Logo Padding
            </label>
          </div>
        </>
      )}

      <div
        className="qr-wrapper my-4 position-relative mx-auto"
        style={{ width: size, height: size }}
      >
        <div ref={qrRef} className="qr-canvas" />
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
              borderRadius: logoShape === 'circle' ? '50%' : '0%',
              objectFit: 'contain',
              backgroundColor: 'white',
              padding: logoPadding ? '4px' : '0px',
              boxSizing: 'border-box',
              border: `2px solid ${logoBorderColor}`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        )}
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => downloadWithLogo('png')}>
          Download PNG
        </button>
        <button className="btn btn-success" onClick={() => downloadWithLogo('jpg')}>
          Download JPG
        </button>
        <button className="btn btn-dark" onClick={() => downloadWithLogo('svg')}>
          Download SVG
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
