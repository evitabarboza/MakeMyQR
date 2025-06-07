// import React, { useEffect, useRef, useState } from 'react';
// import QRCodeStyling from 'qr-code-styling';

// const QRGenerator = () => {
//   const qrRef = useRef(null);
//   const [url, setUrl] = useState('https://example.com');
//   const [size, setSize] = useState(300);
//   const [qrStyle, setQrStyle] = useState('dots');
//   const [startColor, setStartColor] = useState('#007CF0');
//   const [endColor, setEndColor] = useState('#7928CA');

//   const [logoImage, setLogoImage] = useState(null);
//   const [logoSizePercent, setLogoSizePercent] = useState(20);
//   const [logoBorderColor, setLogoBorderColor] = useState('#ffffff');
//   const [logoShape, setLogoShape] = useState('circle'); // 'circle' or 'square'
//   const [logoPadding, setLogoPadding] = useState(true);

//   // QRCodeStyling instance without image property (logo)
//   const qrCode = useRef(
//     new QRCodeStyling({
//       width: size,
//       height: size,
//       data: url,
//       type: 'canvas',
//       dotsOptions: {
//         type: qrStyle,
//         gradient: {
//           type: 'linear',
//           colorStops: [
//             { offset: 0, color: startColor },
//             { offset: 1, color: endColor },
//           ],
//         },
//       },
//       backgroundOptions: {
//         color: '#ffffff',
//       },
//     })
//   );

//   useEffect(() => {
//     qrCode.current.update({
//       data: url,
//       width: size,
//       height: size,
//       dotsOptions: {
//         type: qrStyle,
//         gradient: {
//           type: 'linear',
//           colorStops: [
//             { offset: 0, color: startColor },
//             { offset: 1, color: endColor },
//           ],
//         },
//       },
//     });

//     // Clear previous QR before appending again to avoid duplicates
//     if (qrRef.current.firstChild) {
//       qrRef.current.firstChild.remove();
//     }
//     qrCode.current.append(qrRef.current);
//   }, [url, size, qrStyle, startColor, endColor]);

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageURL = URL.createObjectURL(file);
//       setLogoImage(imageURL);
//     }
//   };

//   // Custom download: merge QR canvas and styled logo overlay into one canvas
//   const downloadWithLogo = (ext) => {
//     // Get the QR canvas element
//     const qrCanvas = qrRef.current.querySelector('canvas');
//     if (!qrCanvas) {
//       alert('QR code not ready yet!');
//       return;
//     }

//     // Create a new canvas for combined image
//     const combinedCanvas = document.createElement('canvas');
//     combinedCanvas.width = qrCanvas.width;
//     combinedCanvas.height = qrCanvas.height;
//     const ctx = combinedCanvas.getContext('2d');

//     // Draw the QR code first
//     ctx.drawImage(qrCanvas, 0, 0);

//     if (logoImage) {
//       // Draw the styled logo with border and padding manually

//       // Calculate logo size in pixels relative to QR size
//       const logoSizePx = (logoSizePercent / 100) * combinedCanvas.width;

//       // Position logo at center
//       const x = (combinedCanvas.width - logoSizePx) / 2;
//       const y = (combinedCanvas.height - logoSizePx) / 2;

//       // Draw white background rectangle with padding if enabled
//       const paddingPx = logoPadding ? 8 : 0;
//       const bgSize = logoSizePx + 2 * paddingPx;

//       // Draw background (white box behind logo)
//       ctx.fillStyle = '#fff';
//       if (logoShape === 'circle') {
//         ctx.beginPath();
//         ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, bgSize / 2, 0, Math.PI * 2);
//         ctx.fill();
//       } else {
//         // square background
//         ctx.fillRect(x - paddingPx, y - paddingPx, bgSize, bgSize);
//       }

//       // Draw border
//       if (logoBorderColor) {
//         ctx.strokeStyle = logoBorderColor;
//         ctx.lineWidth = 2;
//         if (logoShape === 'circle') {
//           ctx.beginPath();
//           ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, bgSize / 2, 0, Math.PI * 2);
//           ctx.stroke();
//         } else {
//           ctx.strokeRect(x - paddingPx, y - paddingPx, bgSize, bgSize);
//         }
//       }

//       // Draw the logo image clipped if circle shape
//       const logoImg = new Image();
//       logoImg.crossOrigin = 'anonymous'; // To avoid CORS issues on some browsers
//       logoImg.src = logoImage;
//       logoImg.onload = () => {
//         ctx.save();
//         if (logoShape === 'circle') {
//           ctx.beginPath();
//           ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, logoSizePx / 2, 0, Math.PI * 2);
//           ctx.closePath();
//           ctx.clip();
//         }
//         ctx.drawImage(logoImg, x, y, logoSizePx, logoSizePx);
//         ctx.restore();

//         // After drawing everything, trigger download
//         const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' ? 'image/jpeg' : 'image/svg+xml';

//         // For SVG, fallback to PNG since canvas is raster only
//         if (ext === 'svg') {
//           alert('SVG download with logo is not supported. Downloading PNG instead.');
//           combinedCanvas.toBlob((blob) => {
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = 'qr-code.png';
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             URL.revokeObjectURL(url);
//           }, 'image/png');
//           return;
//         }

//         combinedCanvas.toBlob((blob) => {
//           const url = URL.createObjectURL(blob);
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = `qr-code.${ext}`;
//           document.body.appendChild(a);
//           a.click();
//           a.remove();
//           URL.revokeObjectURL(url);
//         }, mimeType);
//       };
//       logoImg.onerror = () => alert('Failed to load logo image for download.');
//     } else {
//       // No logo, just download QR directly
//       qrCode.current.download({ extension: ext });
//     }
//   };

//   return (
//     <div>
//       <div className="mb-3">
//         <label>Enter URL:</label>
//         <input
//           className="form-control"
//           type="text"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <label>Select QR Style:</label>
//         <select
//           className="form-select"
//           value={qrStyle}
//           onChange={(e) => setQrStyle(e.target.value)}
//         >
//           <option value="dots">Dots</option>
//           <option value="rounded">Rounded</option>
//           <option value="square">Square</option>
//           <option value="extra-rounded">Extra Rounded</option>
//           <option value="classy">Classy</option>
//           <option value="classy-rounded">Classy Rounded</option>
//         </select>
//       </div>

//       <div className="mb-3">
//         <label>Pick Gradient Colors for QR:</label>
//         <div className="d-flex gap-2">
//           <div>
//             <small>Start:</small>
//             <input
//               type="color"
//               className="form-control form-control-color"
//               value={startColor}
//               onChange={(e) => setStartColor(e.target.value)}
//               title="Start Color"
//             />
//           </div>
//           <div>
//             <small>End:</small>
//             <input
//               type="color"
//               className="form-control form-control-color"
//               value={endColor}
//               onChange={(e) => setEndColor(e.target.value)}
//               title="End Color"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mb-3">
//         <label>QR Code Size (px): {size}</label>
//         <input
//           type="range"
//           min="150"
//           max="500"
//           value={size}
//           onChange={(e) => setSize(Number(e.target.value))}
//           className="form-range"
//         />
//       </div>

//       <div className="mb-3">
//         <label>Upload Logo (optional):</label>
//         <input className="form-control" type="file" onChange={handleLogoUpload} />
//       </div>

//       {logoImage && (
//         <>
//           <div className="mb-3">
//             <label>Logo Size (% of QR): {logoSizePercent}</label>
//             <input
//               type="range"
//               min="5"
//               max="100"
//               value={logoSizePercent}
//               onChange={(e) => setLogoSizePercent(Number(e.target.value))}
//               className="form-range"
//             />
//           </div>

//           <div className="mb-3">
//             <label>Logo Border Color:</label>
//             <input
//               type="color"
//               value={logoBorderColor}
//               onChange={(e) => setLogoBorderColor(e.target.value)}
//               className="form-control form-control-color"
//             />
//           </div>

//           <div className="mb-3">
//             <label>Logo Shape:</label>
//             <select
//               className="form-select"
//               value={logoShape}
//               onChange={(e) => setLogoShape(e.target.value)}
//             >
//               <option value="circle">Circle</option>
//               <option value="square">Square</option>
//             </select>
//           </div>

//           <div className="mb-3 form-check">
//             <input
//               type="checkbox"
//               className="form-check-input"
//               checked={logoPadding}
//               onChange={(e) => setLogoPadding(e.target.checked)}
//               id="logoPadding"
//             />
//             <label className="form-check-label" htmlFor="logoPadding">
//               Enable Logo Padding
//             </label>
//           </div>
//         </>
//       )}

//       <div
//         className="qr-wrapper my-4 position-relative mx-auto"
//         style={{ width: size, height: size }}
//       >
//         <div ref={qrRef} className="qr-canvas" />
//         {logoImage && (
//           <img
//             src={logoImage}
//             alt="Logo"
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               width: `${logoSizePercent}%`,
//               height: `${logoSizePercent}%`,
//               transform: 'translate(-50%, -50%)',
//               borderRadius: logoShape === 'circle' ? '50%' : '0%',
//               objectFit: 'contain',
//               backgroundColor: 'white',
//               padding: logoPadding ? '4px' : '0px',
//               boxSizing: 'border-box',
//               border: `2px solid ${logoBorderColor}`,
//               boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
//               pointerEvents: 'none',
//               userSelect: 'none',
//             }}
//           />
//         )}
//       </div>

//       <div className="d-flex justify-content-center gap-3">
//         <button className="btn btn-primary" onClick={() => downloadWithLogo('png')}>
//           Download PNG
//         </button>
//         <button className="btn btn-success" onClick={() => downloadWithLogo('jpg')}>
//           Download JPG
//         </button>
//         <button className="btn btn-dark" onClick={() => downloadWithLogo('svg')}>
//           Download SVG
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QRGenerator;


// import React, { useEffect, useRef, useState } from 'react';
// import QRCodeStyling from 'qr-code-styling';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../App.css';

// const QRGenerator = () => {
//   const qrRef = useRef(null);
//   const [url, setUrl] = useState('https://example.com');
//   const [qrStyle, setQrStyle] = useState('dots');
//   const [colorPalette, setColorPalette] = useState('purple');
//   const [logoImage, setLogoImage] = useState(null);

//   const colorOptions = {
//     purple: ['#7928CA', '#2E1A47'],
//     blue: ['#007CF0', '#00DFD8'],
//     green: ['#00C853', '#64DD17'],
//   };

//   // Initialize QRCodeStyling with logoImage if available
//   const qrCode = useRef(
//     new QRCodeStyling({
//       width: 300,
//       height: 300,
//       data: url,
//       type: 'canvas',
//       dotsOptions: {
//         type: qrStyle,
//         gradient: {
//           type: 'linear',
//           colorStops: [
//             { offset: 0, color: colorOptions[colorPalette][0] },
//             { offset: 1, color: colorOptions[colorPalette][1] },
//           ],
//         },
//       },
//       backgroundOptions: {
//         color: '#ffffff',
//       },
//       image: logoImage || undefined,
//       imageOptions: {
//         crossOrigin: 'anonymous',
//         margin: 5,
//       },
//     })
//   );

//   useEffect(() => {
//     // Update QR code config on changes
//     qrCode.current.update({
//       data: url,
//       dotsOptions: {
//         type: qrStyle,
//         gradient: {
//           type: 'linear',
//           colorStops: [
//             { offset: 0, color: colorOptions[colorPalette][0] },
//             { offset: 1, color: colorOptions[colorPalette][1] },
//           ],
//         },
//       },
//       image: logoImage || undefined, // Update logo on QR
//       imageOptions: {
//         crossOrigin: 'anonymous',
//         margin: 5,
//       },
//     });

//     // Remove old QR code canvas and append new
//     if (qrRef.current.firstChild) qrRef.current.firstChild.remove();
//     qrCode.current.append(qrRef.current);
//   }, [url, qrStyle, colorPalette, logoImage]);

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setLogoImage(URL.createObjectURL(file));
//   };

//   const download = (ext) => {
//     qrCode.current.download({ extension: ext });
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="container text-center py-5">
//         <p className="text-muted">Hey, there! 👋</p>
//         <h1 className="main-title display-5">MakeMyQR</h1>
//         <h2 className="fw-light mb-3">SCAN MADE SIMPLE</h2>
//         <p className="sub-heading mb-4">
//           Make every interaction smarter with custom QR Codes in seconds. Beautiful, customizable, and ready to download.
//         </p>
//         <button className="btn btn-purple mb-5">Create QR Code</button>

//         <div className="row g-4 justify-content-center mb-5">
//           <div className="col-md-4">
//             <div className="feature-box">
//               <div className="feature-icon mb-3">🔳</div>
//               <h5>QR Code Generation</h5>
//               <p className="text-muted">Create QR codes instantly from any URL with customizable styling options</p>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="feature-box">
//               <div className="feature-icon mb-3">🎨</div>
//               <h5>Custom Styling</h5>
//               <p className="text-muted">Personalize with colors, gradients, logos, and various design patterns</p>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="feature-box">
//               <div className="feature-icon mb-3">⬇️</div>
//               <h5>Multiple Formats</h5>
//               <p className="text-muted">Download in PNG, JPG, or SVG format for any use case</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* QR Generator */}
//       <div className="container py-5">
//         <div className="row g-4 justify-content-center">
//           {/* Customize QR Panel */}
//           <div className="col-md-5">
//             <div className="card p-4">
//               <h5 className="fw-bold text-purple mb-3">Customize Your QR Code</h5>
//               <div className="mb-3">
//                 <label className="form-label">URL or Text</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   placeholder="https://example.com"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Color Palette</label>
//                 <select className="form-select" value={colorPalette} onChange={(e) => setColorPalette(e.target.value)}>
//                   <option value="purple">Purple Gradient</option>
//                   <option value="blue">Blue Gradient</option>
//                   <option value="green">Green Shades</option>
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">QR Code Style</label>
//                 <select className="form-select" value={qrStyle} onChange={(e) => setQrStyle(e.target.value)}>
//                   <option value="dots">Dots</option>
//                   <option value="square">Squares</option>
//                   <option value="rounded">Rounded</option>
//                 </select>
//               </div>

//               <div className="mb-2">
//                 <label className="form-label">Logo (Optional)</label>
//                 <label className="upload-box text-center d-block p-3 border border-secondary rounded" style={{ cursor: 'pointer' }}>
//                   <i className="bi bi-upload" style={{ fontSize: 24 }}></i>
//                   <br />
//                   Click to upload logo<br />
//                   <small>Max 5MB</small>
//                   <input type="file" className="d-none" onChange={handleLogoUpload} />
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* QR Preview Panel */}
//           <div className="col-md-5">
//             <div className="card p-4 text-center">
//               <h5 className="fw-bold text-purple mb-3">QR Code Preview</h5>
//               <div ref={qrRef} className="mb-4" />
//               <div className="d-flex justify-content-around">
//                 <button className="btn btn-png px-4" onClick={() => download('png')}>PNG</button>
//                 <button className="btn btn-jpg px-4" onClick={() => download('jpg')}>JPG</button>
//                 <button className="btn btn-svg px-4" onClick={() => download('svg')}>SVG</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Testimonials Section */}
//       <section className="py-5" style={{ background: 'linear-gradient(to right, #f4f0ff, #eaf3ff)' }}>
//         <div className="container text-center">
//           <h4 className="fw-bold mb-1" style={{ color: '#8b5cf6' }}>Trusted by Thousands of</h4>
//           <h2 className="fw-bold mb-3">Happy Customers</h2>
//           <p className="text-muted mb-5">Here's what some of our customers say:</p>

//           <div className="row g-4 justify-content-center">
//             {[
//               {
//                 initials: 'AP',
//                 name: 'Aaron Peters',
//                 role: 'Developer',
//                 feedback:
//                   'The MakeMyQR service is top-notch. It\'s fast, simple, and beautifully styled! The customization options are fantastic.',
//               },
//               {
//                 initials: 'BS',
//                 name: 'Bhavya S',
//                 role: 'Designer',
//                 feedback:
//                   'This platform has a smooth and clean UI. I love customizing and generating cool QR codes with different gradients!',
//               },
//               {
//                 initials: 'SJ',
//                 name: 'Sarah Johnson',
//                 role: 'Marketing Manager',
//                 feedback:
//                   'Perfect for our marketing campaigns. The ability to add logos and customize colors makes our QR codes stand out.',
//               },
//             ].map((t, idx) => (
//               <div className="col-md-4" key={idx}>
//                 <div className="card p-4 shadow-sm border-0 rounded-4">
//                   <div className="mb-3">
//                     <div
//                       className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{
//                         width: '60px',
//                         height: '60px',
//                         background: 'linear-gradient(45deg, #6d28d9, #3b82f6)',
//                         color: 'white',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {t.initials}
//                     </div>
//                   </div>
//                   <h5 className="fw-bold mb-0">{t.name}</h5>
//                   <p className="text-purple mb-2">{t.role}</p>
//                   <p className="fst-italic text-muted small">"{t.feedback}"</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white shadow-sm rounded-4 mx-auto my-5 py-4 text-center" style={{ maxWidth: '900px' }}>
//         <h5 className="fw-bold" style={{ color: '#7c3aed' }}>MakeMyQR</h5>
//         <div className="mb-2">
//           <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">Instagram</a>
//           <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">Twitter</a>
//           <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">LinkedIn</a>
//         </div>
//         <small className="text-muted">
//           Made with <span style={{ color: '#e11d48' }}>❤️</span> by Evita Sharon Barboza
//         </small>
//       </footer>
//     </>
//   );
// };

// export default QRGenerator;




// import React, { useEffect, useRef, useState } from 'react';
// import QRCodeStyling from 'qr-code-styling';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../App.css';

// const QRGenerator = () => {
//   const qrRef = useRef(null);
//   const [url, setUrl] = useState('https://example.com');

//   // Replace colorPalette with startColor and endColor for gradient
//   const [startColor, setStartColor] = useState('#7928CA');
//   const [endColor, setEndColor] = useState('#2E1A47');

//   const [qrStyle, setQrStyle] = useState('dots');
//   const [logoImage, setLogoImage] = useState(null);

//   // New states for logo styling
//   const [logoShape, setLogoShape] = useState('circle'); // circle or square
//   const [logoBorderColor, setLogoBorderColor] = useState('#000000');
//   const [logoPaddingEnabled, setLogoPaddingEnabled] = useState(false);
//   const [logoPadding, setLogoPadding] = useState(5);

//   // Extended QR styles
//   const qrStylesOptions = [
//     { value: 'dots', label: 'Dots' },
//     { value: 'square', label: 'Squares' },
//     { value: 'rounded', label: 'Rounded' },
//     { value: 'classy', label: 'Classy' },
//     { value: 'classy-rounded', label: 'Classy Rounded' },
//   ];

//   // Initialize QRCodeStyling
//   const qrCode = useRef(
//     new QRCodeStyling({
//       width: 300,
//       height: 300,
//       data: url,
//       type: 'canvas',
//       dotsOptions: {
//         type: qrStyle,
//         gradient: {
//           type: 'linear',
//           colorStops: [
//             { offset: 0, color: startColor },
//             { offset: 1, color: endColor },
//           ],
//         },
//       },
//       backgroundOptions: {
//         color: '#ffffff',
//       },
//       // Remove embedded image from QR code config, will overlay manually
//       image: undefined,
//       imageOptions: {
//         crossOrigin: 'anonymous',
//         margin: 0,
//       },
//     })
//   );

//   useEffect(() => {
//     // Update QR code
//     qrCode.current.update({
//       data: url,
//       dotsOptions: {
//         type: qrStyle,
//         gradient: {
//           type: 'linear',
//           colorStops: [
//             { offset: 0, color: startColor },
//             { offset: 1, color: endColor },
//           ],
//         },
//       },
//       image: undefined, // no embedded image
//     });

//     // Clear old QR code and append new
//     if (qrRef.current.firstChild) qrRef.current.firstChild.remove();
//     qrCode.current.append(qrRef.current);
//   }, [url, qrStyle, startColor, endColor]);

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setLogoImage(URL.createObjectURL(file));
//     else setLogoImage(null);
//   };

//   const download = (ext) => {
//     qrCode.current.download({ extension: ext });
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="container text-center py-5">
//         <p className="text-muted">Hey, there! 👋</p>
//         <h1 className="main-title display-5">MakeMyQR</h1>
//         <h2 className="fw-light mb-3">SCAN MADE SIMPLE</h2>
//         <p className="sub-heading mb-4">
//           Make every interaction smarter with custom QR Codes in seconds. Beautiful, customizable, and ready to download.
//         </p>
//         <button className="btn btn-purple mb-5">Create QR Code</button>

//         <div className="row g-4 justify-content-center mb-5">
//           <div className="col-md-4">
//             <div className="feature-box">
//               <div className="feature-icon mb-3">🔳</div>
//               <h5>QR Code Generation</h5>
//               <p className="text-muted">Create QR codes instantly from any URL with customizable styling options</p>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="feature-box">
//               <div className="feature-icon mb-3">🎨</div>
//               <h5>Custom Styling</h5>
//               <p className="text-muted">Personalize with colors, gradients, logos, and various design patterns</p>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="feature-box">
//               <div className="feature-icon mb-3">⬇️</div>
//               <h5>Multiple Formats</h5>
//               <p className="text-muted">Download in PNG, JPG, or SVG format for any use case</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* QR Generator */}
//       <div className="container py-5">
//         <div className="row g-4 justify-content-center">
//           {/* Customize QR Panel */}
//           <div className="col-md-5">
//             <div className="card p-4">
//               <h5 className="fw-bold text-purple mb-3">Customize Your QR Code</h5>
//               <div className="mb-3">
//                 <label className="form-label">URL or Text</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   placeholder="https://example.com"
//                 />
//               </div>

//               {/* Gradient colors - placed in one row */}
//               <div className="mb-3 d-flex align-items-center gap-3">
//                 <div className="flex-grow-1">
//                   <label className="form-label">Gradient Start Color</label>
//                   <input
//                     type="color"
//                     className="form-control form-control-color"
//                     value={startColor}
//                     onChange={(e) => setStartColor(e.target.value)}
//                     title="Choose start color"
//                   />
//                 </div>
//                 <div className="flex-grow-1">
//                   <label className="form-label">Gradient End Color</label>
//                   <input
//                     type="color"
//                     className="form-control form-control-color"
//                     value={endColor}
//                     onChange={(e) => setEndColor(e.target.value)}
//                     title="Choose end color"
//                   />
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">QR Code Style</label>
//                 <select className="form-select" value={qrStyle} onChange={(e) => setQrStyle(e.target.value)}>
//                   {qrStylesOptions.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-2">
//                 <label className="form-label">Logo (Optional)</label>
//                 <label className="upload-box text-center d-block p-3 border border-secondary rounded" style={{ cursor: 'pointer' }}>
//                   <i className="bi bi-upload" style={{ fontSize: 24 }}></i>
//                   <br />
//                   Click to upload logo<br />
//                   <small>Max 5MB</small>
//                   <input type="file" className="d-none" onChange={handleLogoUpload} />
//                 </label>
//               </div>

//               {/* Logo options only show if logo is uploaded */}
//               {logoImage && (
//                 <>
//                   <div className="mb-3 d-flex align-items-center gap-3">
//                     <div className="flex-grow-1">
//                       <label className="form-label">Logo Shape</label>
//                       <select
//                         className="form-select"
//                         value={logoShape}
//                         onChange={(e) => setLogoShape(e.target.value)}
//                       >
//                         <option value="circle">Circle</option>
//                         <option value="square">Square</option>
//                       </select>
//                     </div>

//                     <div className="flex-grow-1">
//                       <label className="form-label">Logo Border Color</label>
//                       <input
//                         type="color"
//                         className="form-control form-control-color"
//                         value={logoBorderColor}
//                         onChange={(e) => setLogoBorderColor(e.target.value)}
//                         title="Choose border color"
//                       />
//                     </div>

//                     <div className="d-flex align-items-center mt-4">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         checked={logoPaddingEnabled}
//                         onChange={() => setLogoPaddingEnabled(!logoPaddingEnabled)}
//                         id="logoPaddingToggle"
//                       />
//                       <label className="form-check-label ms-2" htmlFor="logoPaddingToggle">
//                         Enable Logo Padding
//                       </label>
//                     </div>
//                   </div>

//                   {logoPaddingEnabled && (
//                     <div className="mb-3">
//                       <label className="form-label">Logo Padding (px)</label>
//                       <input
//                         type="number"
//                         min="0"
//                         max="50"
//                         className="form-control"
//                         value={logoPadding}
//                         onChange={(e) => setLogoPadding(Number(e.target.value))}
//                       />
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* QR Preview Panel */}
//           <div className="col-md-5">
//             <div className="card p-4 text-center" style={{ position: 'relative' }}>
//               <h5 className="fw-bold text-purple mb-3">QR Code Preview</h5>
//               <div ref={qrRef} className="mb-4" />
//               {/* Overlay logo if available */}
//               {logoImage && (
//                 <img
//                   src={logoImage}
//                   alt="Logo"
//                   style={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 80,
//                     height: 80,
//                     borderRadius: logoShape === 'circle' ? '50%' : '0%',
//                     border: `3px solid ${logoBorderColor}`,
//                     padding: logoPaddingEnabled ? logoPadding : 0,
//                     background: '#fff', // To keep border visible
//                     objectFit: 'contain',
//                     pointerEvents: 'none',
//                   }}
//                 />
//               )}
//               <div className="d-flex justify-content-around mt-4">
//                 <button className="btn btn-png px-4" onClick={() => download('png')}>
//                   PNG
//                 </button>
//                 <button className="btn btn-jpg px-4" onClick={() => download('jpg')}>
//                   JPG
//                 </button>
//                 <button className="btn btn-svg px-4" onClick={() => download('svg')}>
//                   SVG
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Testimonials Section */}
//       <section className="py-5" style={{ background: 'linear-gradient(to right, #f4f0ff, #eaf3ff)' }}>
//         <div className="container text-center">
//           <h4 className="fw-bold mb-1" style={{ color: '#8b5cf6' }}>Trusted by Thousands of</h4>
//           <h2 className="fw-bold mb-3">Happy Customers</h2>
//           <p className="text-muted mb-5">Here's what some of our customers say:</p>

//           <div className="row g-4 justify-content-center">
//             {[
//               {
//                 initials: 'AP',
//                 name: 'Aaron Peters',
//                 role: 'Developer',
//                 feedback:
//                   "The MakeMyQR service is top-notch. It's fast, simple, and beautifully styled! The customization options are fantastic.",
//               },
//               {
//                 initials: 'BS',
//                 name: 'Bhavya S',
//                 role: 'Designer',
//                 feedback:
//                   'This platform has a smooth and clean UI. I love customizing and generating cool QR codes with different gradients!',
//               },
//               {
//                 initials: 'SJ',
//                 name: 'Sarah Johnson',
//                 role: 'Marketing Manager',
//                 feedback:
//                   'Perfect for our marketing campaigns. The ability to add logos and customize colors makes our QR codes stand out.',
//               },
//             ].map((t, idx) => (
//               <div className="col-md-4" key={idx}>
//                 <div className="card p-4 shadow-sm border-0 rounded-4">
//                   <div
//                     className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                     style={{
//                       width: '60px',
//                       height: '60px',
//                       background: 'linear-gradient(45deg, #6d28d9, #3b82f6)',
//                       color: 'white',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     {t.initials}
//                   </div>
//                   <h5 className="fw-bold mb-0">{t.name}</h5>
//                   <p className="text-purple mb-2">{t.role}</p>
//                   <p className="fst-italic text-muted small">"{t.feedback}"</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white shadow-sm rounded-4 mx-auto my-5 py-4 text-center" style={{ maxWidth: '900px' }}>
//         <h5 className="fw-bold" style={{ color: '#7c3aed' }}>MakeMyQR</h5>
//         <div className="mb-2">
//           <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">Instagram</a>
//           <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">Twitter</a>
//           <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">LinkedIn</a>
//         </div>
//         <small className="text-muted">
//           Made with <span style={{ color: '#e11d48' }}>❤️</span> by Evita Sharon Barboza
//         </small>
//       </footer>
//     </>
//   );
// };

// export default QRGenerator;




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

  // Function to center logo on QR code
  const centerLogo = () => {
    if (logoOverlayRef.current && qrRef.current) {
      const qrContainer = qrRef.current;
      const logoElement = logoOverlayRef.current;
      
      // Get QR container dimensions
      const qrRect = qrContainer.getBoundingClientRect();
      const qrCanvas = qrContainer.querySelector('canvas');
      
      if (qrCanvas) {
        const canvasRect = qrCanvas.getBoundingClientRect();
        
        // Calculate center position relative to canvas
        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;
        
        // Position logo at center
        logoElement.style.left = `${centerX}px`;
        logoElement.style.top = `${centerY}px`;
      }
    }
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
    
    // Center logo after QR code is rendered
    setTimeout(centerLogo, 100);
  }, [url, qrStyle, startColor, endColor]);

  // Re-center logo when logo settings change
  useEffect(() => {
    setTimeout(centerLogo, 50);
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

  if (!logoImage) {
    // No logo, just download QR directly
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
      ctx.fillRect(x - padding, y - padding, logoSize + 2 * padding, logoSize + 2 * padding);
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
        <p className="text-muted">Hey, there! 👋</p>
        <h1 className="main-title display-5">MakeMyQR</h1>
        <h2 className="fw-light mb-3">SCAN MADE SIMPLE</h2>
        <p className="sub-heading mb-4">
          Make every interaction smarter with custom QR Codes in seconds. Beautiful, customizable, and ready to download.
        </p>
        <button className="btn btn-purple mb-5">Create QR Code</button>

        <div className="row g-4 justify-content-center mb-5">
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon mb-3">🔳</div>
              <h5>QR Code Generation</h5>
              <p className="text-muted">Create QR codes instantly from any URL with customizable styling options</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon mb-3">🎨</div>
              <h5>Custom Styling</h5>
              <p className="text-muted">Personalize with colors, gradients, logos, and various design patterns</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <div className="feature-icon mb-3">⬇️</div>
              <h5>Multiple Formats</h5>
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
            <div className="card p-4 text-center">
              <h5 className="fw-bold text-purple mb-4">QR Code Preview</h5>
              <div 
                style={{ 
                  position: 'relative', 
                  display: 'inline-block',
                  margin: '0 auto 2rem auto'
                }}
              >
                <div ref={qrRef} />
                {/* Properly centered logo overlay with dynamic scaling */}
                {logoImage && (
                  <img
                    ref={logoOverlayRef}
                    src={logoImage}
                    alt="Logo"
                    style={{
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)',
                      width: `${logoScale}px`,
                      height: `${logoScale}px`,
                      borderRadius: logoShape === 'circle' ? '50%' : '8px',
                      border: `3px solid ${logoBorderColor}`,
                      padding: logoPaddingEnabled ? `${logoPadding}px` : '0',
                      background: '#fff',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />
                )}
              </div>
              
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-png px-4" onClick={() => download('png')}>
                  PNG
                </button>
                <button className="btn btn-jpg px-4" onClick={() => download('jpg')}>
                  JPG
                </button>
                <button className="btn btn-svg px-4" onClick={() => download('svg')}>
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
          <h2 className="fw-bold mb-3">Happy Customers</h2>
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
        <div className="mb-2">
          <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">Instagram</a>
          <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">Twitter</a>
          <a href="#" className="text-dark mx-2 fw-semibold text-decoration-none">LinkedIn</a>
        </div>
        <small className="text-muted">
          Made with <span style={{ color: '#e11d48' }}>❤️</span> by Evita Sharon Barboza
        </small>
      </footer>
    </>
  );
};

export default QRGenerator;
