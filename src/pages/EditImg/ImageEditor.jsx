import React, { useState, useRef, useEffect } from "react";
import "./imageEditor.css";

// Custom SVG Icons as components
const Icons = {
  ZoomIn: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
    </svg>
  ),
  ZoomOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
    </svg>
  ),
  Rotate: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Flip: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  Blur: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
    </svg>
  ),
  Reset: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
  ),
  RemoveBG: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-3-4h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  ),
};

const ImageEditor = ({ imageUrl, onSave, onCancel }) => {
  // Basic transformations
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Image adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [sharpen, setSharpen] = useState(0);

  // Active tab state
  const [activeTab, setActiveTab] = useState('basic');

  // Preset filters
  const [activeFilter, setActiveFilter] = useState('none');
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const filters = {
    none: {},
    vintage: {
      sepia: 50,
      contrast: 120,
      brightness: 90,
      saturation: 85,
      hueRotate: 15,
    },
    blackAndWhite: {
      saturation: 0,
      contrast: 120,
      brightness: 110,
    },
    dramatic: {
      contrast: 150,
      brightness: 90,
      saturation: 120,
      hueRotate: -10,
    },
    warm: {
      hueRotate: 30,
      saturation: 110,
      brightness: 105,
    },
    cool: {
      hueRotate: -30,
      saturation: 110,
      brightness: 105,
    }
  };

  const applyPresetFilter = (filterName) => {
    const filter = filters[filterName];
    setActiveFilter(filterName);
    if (filter) {
      setBrightness(filter.brightness || 100);
      setContrast(filter.contrast || 100);
      setSaturation(filter.saturation || 100);
      setHueRotate(filter.hueRotate || 0);
      setSepia(filter.sepia || 0);
    }
  };

  const resetAdjustments = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setSepia(0);
    setHueRotate(0);
    setOpacity(100);
    setSharpen(0);
    setActiveFilter('none');
  };

  const applyFilters = () => {
    if (imageRef.current) {
      const transforms = [
        `translate(${position.x}px, ${position.y}px)`,
        `scale(${scale * (flipH ? -1 : 1)}, ${scale * (flipV ? -1 : 1)})`,
        `rotate(${rotation}deg)`,
      ];

      const filters = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `saturate(${saturation}%)`,
        `blur(${blur}px)`,
        `sepia(${sepia}%)`,
        `hue-rotate(${hueRotate}deg)`,
        `opacity(${opacity}%)`,
        sharpen > 0 ? `url(#sharpen)` : '',
      ];

      imageRef.current.style.transform = transforms.join(' ');
      imageRef.current.style.filter = filters.join(' ');
    }
  };

  useEffect(() => {
    applyFilters();
  }, [brightness, contrast, saturation, blur, sepia, hueRotate, opacity, sharpen, scale, rotation, position, flipH, flipV]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotateRight = () => setRotation(prev => prev + 90);
  const handleFlipHorizontal = () => imageRef.current.style.transform += ' scaleX(-1)';

  // Replace the existing background removal states with:
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgRemovedImage, setBgRemovedImage] = useState(null);

  const handleBgRemove = async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:5001/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Background removal failed");
      }

      const rbgResultData = await response.blob();
      const newImageUrl = URL.createObjectURL(rbgResultData);
      
      // Update the image reference with the new background-removed image
      if (imageRef.current) {
        imageRef.current.src = newImageUrl;
      }
      setBgRemovedImage(newImageUrl);
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Update the renderBackgroundRemoval function
  const renderBackgroundRemoval = () => (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Background Removal</h3>
        <button
          onClick={handleBgRemove}
          disabled={isProcessing}
          className={`px-4 py-2 rounded-lg font-medium ${
            isProcessing 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Remove Background'}
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Best results with clear subjects</li>
          <li>Processing may take a few moments</li>
          <li>Make sure the image is well-lit</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-[2fr,1fr]">
          {/* Image Preview Section */}
          <div className="relative h-[600px] bg-gray-900">
            <div 
              ref={containerRef}
              className="relative h-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Edit preview"
                className="absolute transition-all duration-200"
                draggable="false"
              />

              {/* SVG Filters */}
              <svg className="hidden">
                <filter id="sharpen">
                  <feConvolveMatrix
                    order="3"
                    preserveAlpha="true"
                    kernelMatrix={`
                      0 -${sharpen} 0
                      -${sharpen} ${1 + 4 * sharpen} -${sharpen}
                      0 -${sharpen} 0
                    `}
                  />
                </filter>
              </svg>
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleZoomOut}
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Zoom Out"
                >
                  <Icons.ZoomOut />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Zoom In"
                >
                  <Icons.ZoomIn />
                </button>
                <button
                  onClick={handleRotateRight}
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Rotate"
                >
                  <Icons.Rotate />
                </button>
                <button
                  onClick={handleFlipHorizontal}
                  className="text-white hover:text-blue-400 transition-colors"
                  title="Flip"
                >
                  <Icons.Flip />
                </button>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Image</h2>

            {/* Tabs */}
            <div className="flex mb-6 border-b">
              {['basic', 'filters', 'effects', 'background'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {[
                  { label: 'Brightness', value: brightness, setValue: setBrightness, min: 0, max: 200 },
                  { label: 'Contrast', value: contrast, setValue: setContrast, min: 0, max: 200 },
                  { label: 'Saturation', value: saturation, setValue: setSaturation, min: 0, max: 200 },
                  { label: 'Opacity', value: opacity, setValue: setOpacity, min: 0, max: 100 },
                ].map((control) => (
                  <div key={control.label} className="space-y-2">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      {control.label}
                      <span className="text-gray-500">{control.value}%</span>
                    </label>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      value={control.value}
                      onChange={(e) => control.setValue(Number(e.target.value))}
                      className="slider-input"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(filters).map((filterName) => (
                  <button
                    key={filterName}
                    onClick={() => applyPresetFilter(filterName)}
                    className={`p-3 rounded-lg text-sm font-medium ${
                      activeFilter === filterName
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterName.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-6">
                {[
                  { label: 'Blur', value: blur, setValue: setBlur, min: 0, max: 10, step: 0.1 },
                  { label: 'Sepia', value: sepia, setValue: setSepia, min: 0, max: 100 },
                  { label: 'Hue Rotate', value: hueRotate, setValue: setHueRotate, min: -180, max: 180 },
                  { label: 'Sharpen', value: sharpen, setValue: setSharpen, min: 0, max: 1, step: 0.1 },
                ].map((control) => (
                  <div key={control.label} className="space-y-2">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      {control.label}
                      <span className="text-gray-500">{control.value}</span>
                    </label>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step || 1}
                      value={control.value}
                      onChange={(e) => control.setValue(Number(e.target.value))}
                      className="slider-input"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'background' && renderBackgroundRemoval()}

            {/* Reset and Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={resetAdjustments}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Icons.Reset />
                Reset
              </button>
              <button
                onClick={onSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor; 