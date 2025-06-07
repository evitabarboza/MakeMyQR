import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type DotType = 'dots' | 'rounded' | 'square' | 'extra-rounded' | 'classy' | 'classy-rounded';

const QRCodeSection = () => {
  const qrRef = useRef(null);
  const [url, setUrl] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [qrStyle, setQrStyle] = useState<DotType>('dots');
  const [palette, setPalette] = useState('purple');
  const [startColor, setStartColor] = useState('#007CF0');
  const [endColor, setEndColor] = useState('#7928CA');
  const [logoImage, setLogoImage] = useState(null);
  const [logoSizePercent, setLogoSizePercent] = useState([20]);
  const [logoBorderColor, setLogoBorderColor] = useState('#ffffff');
  const [logoShape, setLogoShape] = useState('circle');
  const [logoPadding, setLogoPadding] = useState(true);

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
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: {
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor },
          ],
        },
      },
      cornersDotOptions: {
        type: 'dot',
        gradient: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor },
          ],
        },
      },
    })
  );

  const colorPalettes = {
    purple: ['#007CF0', '#7928CA'],
    'green-blue': ['#00F260', '#0575E6'],
    sunset: ['#FF6B6B', '#FFE66D'],
    ocean: ['#667eea', '#764ba2'],
    mint: ['#00b09b', '#96c93d'],
  };

  useEffect(() => {
    const colors = colorPalettes[palette] || colorPalettes.purple;
    setStartColor(colors[0]);
    setEndColor(colors[1]);
  }, [palette]);

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
      cornersSquareOptions: {
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor },
          ],
        },
      },
      cornersDotOptions: {
        type: 'dot',
        gradient: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor },
          ],
        },
      },
    });

    if (qrRef.current?.firstChild) {
      qrRef.current.firstChild.remove();
    }
    qrCode.current.append(qrRef.current);
  }, [url, size, qrStyle, startColor, endColor]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setLogoImage(URL.createObjectURL(file));
      toast({
        title: "Logo uploaded",
        description: "Your logo has been added to the QR code",
      });
    }
  };

  const downloadWithLogo = (ext) => {
    const qrCanvas = qrRef.current?.querySelector('canvas');
    if (!qrCanvas) {
      toast({
        title: "Error",
        description: "QR code not ready yet!",
        variant: "destructive",
      });
      return;
    }

    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = qrCanvas.width;
    combinedCanvas.height = qrCanvas.height;
    const ctx = combinedCanvas.getContext('2d');
    ctx.drawImage(qrCanvas, 0, 0);

    if (logoImage) {
      const logoSizePx = (logoSizePercent[0] / 100) * combinedCanvas.width;
      const x = (combinedCanvas.width - logoSizePx) / 2;
      const y = (combinedCanvas.height - logoSizePx) / 2;
      const paddingPx = logoPadding ? 8 : 0;
      const bgSize = logoSizePx + 2 * paddingPx;

      ctx.fillStyle = '#fff';
      if (logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, bgSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x - paddingPx, y - paddingPx, bgSize, bgSize);
      }

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

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = logoImage;
      logoImg.onload = () => {
        ctx.save();
        if (logoShape === 'circle') {
          ctx.beginPath();
          ctx.arc(combinedCanvas.width / 2, combinedCanvas.height / 2, logoSizePx / 2, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.drawImage(logoImg, x, y, logoSizePx, logoSizePx);
        ctx.restore();

        if (ext === 'svg') {
          toast({
            title: "Format changed",
            description: "SVG download with logo not supported. Downloading PNG instead.",
          });
          ext = 'png';
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
          
          toast({
            title: "Download started",
            description: `Your QR code is downloading as ${ext.toUpperCase()}`,
          });
        }, ext === 'jpg' ? 'image/jpeg' : 'image/png');
      };
      logoImg.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load logo image.",
          variant: "destructive",
        });
      };
    } else {
      qrCode.current.download({ extension: ext });
      toast({
        title: "Download started",
        description: `Your QR code is downloading as ${ext.toUpperCase()}`,
      });
    }
  };

  return (
    <section id="qr-section" className="max-w-6xl mx-auto mb-16">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* QR Code Preview */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              QR Code Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div 
              ref={qrRef} 
              className="border-4 border-white rounded-2xl shadow-lg p-4 bg-white"
              style={{ width: size + 32, height: size + 32 }} 
            />
            
            <div className="grid grid-cols-3 gap-3 w-full">
              <Button 
                onClick={() => downloadWithLogo('png')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                PNG
              </Button>
              <Button 
                onClick={() => downloadWithLogo('jpg')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                JPG
              </Button>
              <Button 
                onClick={() => downloadWithLogo('svg')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                SVG
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Customize Your QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-semibold text-gray-700">URL or Text</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL or text"
                className="border-2 border-gray-200 focus:border-purple-500 rounded-lg"
              />
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Color Palette</Label>
              <Select value={palette} onValueChange={setPalette}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purple">Purple Gradient</SelectItem>
                  <SelectItem value="green-blue">Green to Blue</SelectItem>
                  <SelectItem value="sunset">Sunset</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="mint">Mint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* QR Style */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">QR Code Style</Label>
              <Select value={qrStyle} onValueChange={(value: DotType) => setQrStyle(value)}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">Logo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload logo</p>
                  <p className="text-xs text-gray-400">Max 5MB</p>
                </label>
              </div>

              {logoImage && (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Logo uploaded successfully</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Logo Size: {logoSizePercent[0]}%</Label>
                    <Slider
                      value={logoSizePercent}
                      onValueChange={setLogoSizePercent}
                      min={5}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Border Color</Label>
                      <Input
                        type="color"
                        value={logoBorderColor}
                        onChange={(e) => setLogoBorderColor(e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Shape</Label>
                      <Select value={logoShape} onValueChange={setLogoShape}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="logo-padding"
                      checked={logoPadding}
                      onCheckedChange={setLogoPadding}
                    />
                    <Label htmlFor="logo-padding" className="text-sm font-medium text-gray-700">
                      Enable Logo Padding
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QRCodeSection;