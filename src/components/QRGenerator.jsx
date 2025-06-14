import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const QRGenerator = () => {
  const qrRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const [url, setUrl] = useState('https://example.com');

  // Replace colorPalette with startColor and endColor for gradient
  const [startColor, setStartColor] = useState('#7928CA');
  const [endColor, setEndColor] = useState('#2E1A47');

  const [qrStyle, setQrStyle] = useState('dots');
  const [logoImage, setLogoImage] = useState(null);

  // New states for logo styling
  const [logoShape, setLogoShape] = useState('circle'); // circle or square
  const [logoBorderColor, setLogoBorderColor] = useState('#000000');
  const [logoPaddingEnabled, setLogoPaddingEnabled] = useState(false);
  const [logoPadding, setLogoPadding] = useState(5);
  const [logoScale, setLogoScale] = useState(80); // New state for logo size scale

  // Extended QR styles
  const qrStylesOptions = [
    { value: 'dots', label: 'Dots' },
    { value: 'square', label: 'Squares' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'classy', label: 'Classy' },
    { value: 'classy-rounded', label: 'Classy Rounded' },
  ];

  // Initialize QRCodeStyling
  const qrCode = useRef(
    new QRCodeStyling({
      width: 300,
      height: 300,
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
      // Remove embedded image from QR code config, will overlay manually
      image: undefined,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 0,
      },
    })
  );

  // Simplified function to center logo on QR code
  const centerLogo = () => {
    // The logo will be centered using CSS - no JavaScript positioning needed
    // This function is kept for compatibility but doesn't need to do anything
  };

  useEffect(() => {
    // Update QR code
    qrCode.current.update({
      data: url,
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
      image: undefined, // no embedded image
    });

    // Clear old QR code and append new
    if (qrRef.current.firstChild) qrRef.current.firstChild.remove();
    qrCode.current.append(qrRef.current);
    
    // Center logo after QR code is rendered - simplified
    setTimeout(centerLogo, 50);
  }, [url, qrStyle, startColor, endColor]);

  // Re-center logo when logo settings change - no longer needed
  useEffect(() => {
    // Logo is now centered using CSS flexbox
  }, [logoImage, logoShape, logoBorderColor, logoPaddingEnabled, logoPadding, logoScale]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogoImage(URL.createObjectURL(file));
    else setLogoImage(null);
  };

  const download = (ext) => {
  if (!qrRef.current) return;
  const qrCanvas = qrRef.current.querySelector('canvas');
  if (!qrCanvas) return;

  // Check if trying to download SVG with logo
  if (ext === 'svg' && logoImage) {
    alert('QR code with logo cannot be downloaded in SVG format. Please try JPG or PNG format instead.');
    return;
  }

  if (!logoImage) {
    // No logo, just download QR directly
    qrCode.current.download({ extension: ext });
    return;
  }

  // For PNG and JPG with logo
  if (ext === 'svg') {
    // This shouldn't happen due to the check above, but just in case
    qrCode.current.download({ extension: ext });
    return;
  }

  // Create offscreen canvas same size as QR
  const canvas = document.createElement('canvas');
  const size = qrCanvas.width; // assuming square canvas
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Draw QR code
  ctx.drawImage(qrCanvas, 0, 0);

  // Draw logo image on center
  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.src = logoImage;

  logoImg.onload = () => {
    // Calculate position and size for logo on QR
    const logoSize = logoScale; // same as user's setting
    const x = (size - logoSize) / 2;
    const y = (size - logoSize) / 2;

    // Draw white background behind logo to simulate padding if enabled
    if (logoPaddingEnabled) {
      const padding = logoPadding;
      ctx.fillStyle = '#fff';
      
      if (logoShape === 'circle') {
        // Draw circular white background
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, (logoSize / 2) + padding, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Draw rectangular white background
        ctx.fillRect(x - padding, y - padding, logoSize + 2 * padding, logoSize + 2 * padding);
      }
    }

    // Draw logo with border if specified
    if (logoBorderColor) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = logoBorderColor;

      if (logoShape === 'circle') {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = logoSize / 2 + (logoPaddingEnabled ? logoPadding : 0);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        // square with rounded corners 8px radius
        const borderRadius = 8;
        const rectX = x - (logoPaddingEnabled ? logoPadding : 0);
        const rectY = y - (logoPaddingEnabled ? logoPadding : 0);
        const rectSize = logoSize + (logoPaddingEnabled ? logoPadding * 2 : 0);

        ctx.beginPath();
        ctx.moveTo(rectX + borderRadius, rectY);
        ctx.lineTo(rectX + rectSize - borderRadius, rectY);
        ctx.quadraticCurveTo(rectX + rectSize, rectY, rectX + rectSize, rectY + borderRadius);
        ctx.lineTo(rectX + rectSize, rectY + rectSize - borderRadius);
        ctx.quadraticCurveTo(rectX + rectSize, rectY + rectSize, rectX + rectSize - borderRadius, rectY + rectSize);
        ctx.lineTo(rectX + borderRadius, rectY + rectSize);
        ctx.quadraticCurveTo(rectX, rectY + rectSize, rectX, rectY + rectSize - borderRadius);
        ctx.lineTo(rectX, rectY + borderRadius);
        ctx.quadraticCurveTo(rectX, rectY, rectX + borderRadius, rectY);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Draw the logo image itself
    if (logoShape === 'circle') {
      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);
      ctx.restore();
    } else {
      // square
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);
    }

    // Now download combined image
    const mimeType = ext === 'jpg' ? 'image/jpeg' : 'image/png';
    const link = document.createElement('a');
    link.download = `qr-code.${ext}`;
    link.href = canvas.toDataURL(mimeType);
    link.click();
  };

  logoImg.onerror = () => {
    // If logo fails to load, fallback to default QR download
    qrCode.current.download({ extension: ext });
  };
};

  return (
    <>
      {/* Hero Section */}
      <div className="container text-center py-5">
        <p className="jumping-popjumping-pop">Hey, there! 👋</p>
        <h1 className="main-title display-5">MakeMyQR</h1>
        <h2 className="scan-made-simple mb-3">SCAN MADE SIMPLE</h2>
        <p className="scan-subtitle mb-4">
          Make every interaction smarter with custom QR Codes in seconds. Beautiful, customizable, and ready to download.
        </p>
        <button
          className="btn btn-purple mb-5"
          onClick={() => {
           const element = document.querySelector("#qr-preview");
          element?.scrollIntoView({ behavior: "smooth" });
        }}
        >
          Create QR Code
        </button>

        <div className="row g-4 justify-content-center mb-5">
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon mb-3">🔳</div>
              <h5 className='text-black'>QR Code Generation</h5>
              <p className="text-muted">Create QR codes instantly from any URL with customizable styling options</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon mb-3">🎨</div>
              <h5 className='text-black'>Custom Styling</h5>
              <p className="text-muted">Personalize with colors, gradients, logos, and various design patterns</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon mb-3">⬇️</div>
              <h5 className='text-black'>Multiple Formats</h5>
              <p className="text-muted">Download in PNG, JPG, or SVG format for any use case</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Generator */}
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          {/* Customize QR Panel */}
          <div className="col-md-5">
            <div className="card p-4">
              <h5 className="fw-bold text-purple mb-4 text-center">Customize Your QR Code</h5>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">URL or Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              {/* Gradient colors - properly aligned in row */}
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Gradient Start Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={startColor}
                    onChange={(e) => setStartColor(e.target.value)}
                    title="Choose start color"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Gradient End Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={endColor}
                    onChange={(e) => setEndColor(e.target.value)}
                    title="Choose end color"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">QR Code Style</label>
                <select className="form-select" value={qrStyle} onChange={(e) => setQrStyle(e.target.value)}>
                  {qrStylesOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Logo (Optional)</label>
                <label className="upload-box text-center d-block p-3 border border-secondary rounded" style={{ cursor: 'pointer' }}>
                  <i className="bi bi-upload" style={{ fontSize: 24 }}></i>
                  <br />
                  Click to upload logo<br />
                  <small>Max 5MB</small>
                  <input type="file" className="d-none" onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>

              {/* Logo options only show if logo is uploaded */}
              {logoImage && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Logo Size</label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min="40"
                        max="150"
                        value={logoScale}
                        onChange={(e) => setLogoScale(Number(e.target.value))}
                        id="logoScale"
                      />
                      <span className="badge bg-light text-dark fw-normal">{logoScale}px</span>
                    </div>
                    <div className="form-text">Adjust logo size from 40px to 150px</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Logo Shape</label>
                      <select
                        className="form-select"
                        value={logoShape}
                        onChange={(e) => setLogoShape(e.target.value)}
                      >
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Logo Border Color</label>
                      <input
                        type="color"
                        className="form-control form-control-color w-100"
                        value={logoBorderColor}
                        onChange={(e) => setLogoBorderColor(e.target.value)}
                        title="Choose border color"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={logoPaddingEnabled}
                        onChange={() => setLogoPaddingEnabled(!logoPaddingEnabled)}
                        id="logoPaddingToggle"
                      />
                      <label className="form-check-label fw-semibold" htmlFor="logoPaddingToggle">
                        Enable Logo Padding
                      </label>
                    </div>
                  </div>

                  {logoPaddingEnabled && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Logo Padding (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        className="form-control"
                        value={logoPadding}
                        onChange={(e) => setLogoPadding(Number(e.target.value))}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* QR Preview Panel */}
          <div className="col-md-5">
            <div id="qr-preview" className="card p-4 text-center">
              <h5 className="fw-bold text-purple mb-4">QR Code Preview</h5>
              <div 
                style={{ 
                  position: 'relative', 
                  display: 'inline-block',
                  margin: '0 auto 2rem auto'
                }}
              >
                <div ref={qrRef} style={{ display: 'block' }} />
                {/* Properly centered logo overlay using CSS positioning */}
                {logoImage && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    <img
                      ref={logoOverlayRef}
                      src={logoImage}
                      alt="Logo"
                      style={{
                        width: `${logoScale}px`,
                        height: `${logoScale}px`,
                        borderRadius: logoShape === 'circle' ? '50%' : '8px',
                        border: `3px solid ${logoBorderColor}`,
                        padding: logoPaddingEnabled ? `${logoPadding}px` : '0',
                        background: logoPaddingEnabled ? '#fff' : 'transparent',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-png btn-png-color px-4" onClick={() => download('png')}>
                  PNG
                </button>
                <button className="btn btn-jpg btn-jpg-color px-4" onClick={() => download('jpg')}>
                  JPG
                </button>
                <button className="btn btn-svg-color btn btn-svg px-4" onClick={() => download('svg')}>
                  SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="py-5" style={{ background: 'linear-gradient(to right, #f4f0ff, #eaf3ff)' }}>
        <div className="container text-center">
          <h4 className="fw-bold mb-1" style={{ color: '#8b5cf6' }}>Trusted by Thousands of</h4>
          <h2 className="fw-bold mb-3 text-black">Happy Customers</h2>
          <p className="text-muted mb-5">Here's what some of our customers say:</p>

          <div className="row g-4 justify-content-center">
            {[
              {
                initials: 'AP',
                name: 'Aaron Peters',
                role: 'Developer',
                feedback:
                  "The MakeMyQR service is top-notch. It's fast, simple, and beautifully styled! The customization options are fantastic.",
              },
              {
                initials: 'BS',
                name: 'Bhavya S',
                role: 'Designer',
                feedback:
                  'This platform has a smooth and clean UI. I love customizing and generating cool QR codes with different gradients!',
              },
              {
                initials: 'SJ',
                name: 'Sarah Johnson',
                role: 'Marketing Manager',
                feedback:
                  'Perfect for our marketing campaigns. The ability to add logos and customize colors makes our QR codes stand out.',
              },
            ].map((t, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card p-4 shadow-sm border-0 rounded-4">
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(45deg, #6d28d9, #3b82f6)',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {t.initials}
                  </div>
                  <h5 className="fw-bold mb-0">{t.name}</h5>
                  <p className="text-purple mb-2">{t.role}</p>
                  <p className="fst-italic text-muted small">"{t.feedback}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-sm rounded-4 mx-auto my-5 py-4 text-center" style={{ maxWidth: '900px' }}>
        <h5 className="fw-bold" style={{ color: '#7c3aed' }}>MakeMyQR</h5>

        <p className="fw-semibold mb-2">Follow for more</p>
        <div className="mb-3">
          <a href="https://www.instagram.com/evitabarboza?utm_source=qr&igsh=YW0xOHJzOHo0cDRn" target='_blank' className="text-dark mx-3 fs-4" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://x.com/barbozaevita?t=kc-ofyPPEnriQakfCblqHg&s=09" target='_blank' className="text-dark mx-3 fs-4" aria-label="X" title="X (formerly Twitter)">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/in/evita-barboza-b40899256/" target='_blank' className="text-dark mx-3 fs-4" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com/evitabarboza" target='_blank' className="text-dark mx-3 fs-4" aria-label="Github">
            <i className="fab fa-github"></i>
          </a>
        </div>

        <small className="text-muted">
          Made with <span style={{ color: '#e11d48' }}>❤️</span> by Evita Sharon Barboza
        </small>
      </footer>

    </>
  );
};

export default QRGenerator;