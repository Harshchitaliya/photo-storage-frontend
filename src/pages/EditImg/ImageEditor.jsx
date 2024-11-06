import React, { useState, useRef, useEffect } from "react";
import { Button, RangeSlider } from "flowbite-react";
import {
    ZoomInIcon,
    ZoomOutIcon,
    RotateIcon,
    FlipIcon
} from "../../components/Icons";
import { Tabs } from "flowbite-react";

const ImageEditor = ({ imageUrl, onSave }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [sepia, setSepia] = useState(0);
    const [hueRotate, setHueRotate] = useState(0);
    const [opacity, setOpacity] = useState(100);
    const [sharpen, setSharpen] = useState(0);

    const [activeFilter, setActiveFilter] = useState("none");

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
        },
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
        setActiveFilter("none");
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
                sharpen > 0 ? `url(#sharpen)` : "",
            ];

            imageRef.current.style.transform = transforms.join(" ");
            imageRef.current.style.filter = filters.join(" ");
        }
    };

    useEffect(() => {
        applyFilters();
    }, [
        brightness,
        contrast,
        saturation,
        blur,
        sepia,
        hueRotate,
        opacity,
        sharpen,
        scale,
        rotation,
        position,
        flipH,
        flipV,
    ]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
    const handleRotateRight = () => setRotation((prev) => prev + 90);
    const handleFlipHorizontal = () =>
        (imageRef.current.style.transform += " scaleX(-1)");

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
            <div className="flex flex-col gap-2 items-center justify-between">
                <Button
                    onClick={handleBgRemove}
                    disabled={isProcessing}
                    isProcessing={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Remove Background"}
                </Button>
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

    const imageControls = [
        {
            onClick: handleZoomOut,
            title: "Zoom Out",
            Icon: ZoomOutIcon,
        },
        {
            onClick: handleZoomIn,
            title: "Zoom In",
            Icon: ZoomInIcon,
        },
        {
            onClick: handleRotateRight,
            title: "Rotate",
            Icon: RotateIcon,
        },
        {
            onClick: handleFlipHorizontal,
            title: "Flip",
            Icon: FlipIcon,
        },
    ];
    const adjustmentControls = [
        {
            label: "Brightness",
            value: brightness,
            setValue: setBrightness,
            min: 0,
            max: 200,
        },
        {
            label: "Contrast",
            value: contrast,
            setValue: setContrast,
            min: 0,
            max: 200,
        },
        {
            label: "Saturation",
            value: saturation,
            setValue: setSaturation,
            min: 0,
            max: 200,
        },
        {
            label: "Opacity",
            value: opacity,
            setValue: setOpacity,
            min: 0,
            max: 100,
        },
    ];
    const effectControls = [
        {
            label: "Blur",
            value: blur,
            setValue: setBlur,
            min: 0,
            max: 10,
            step: 0.1,
        },
        {
            label: "Sepia",
            value: sepia,
            setValue: setSepia,
            min: 0,
            max: 100,
        },
        {
            label: "Hue Rotate",
            value: hueRotate,
            setValue: setHueRotate,
            min: -180,
            max: 180,
        },
        {
            label: "Sharpen",
            value: sharpen,
            setValue: setSharpen,
            min: 0,
            max: 1,
            step: 0.1,
        },
    ];

    const getImageDataUri = async (url) => {
        const response = await fetch(`http://localhost:5001/fetch-image?url=${encodeURIComponent(url)}`);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const captureEditedImage = async () => {
        try {
            const dataUri = await getImageDataUri(imageUrl);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = dataUri;
            });
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.filter = imageRef.current.style.filter;
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate((rotation * Math.PI) / 180);
            
            ctx.scale(
                scale * (flipH ? -1 : 1),
                scale * (flipV ? -1 : 1)
            );
            
            ctx.drawImage(
                img,
                -img.naturalWidth/2,
                -img.naturalHeight/2,
                img.naturalWidth,
                img.naturalHeight
            );
            
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error capturing edited image:', error);
            throw error;
        }
    };

    const handleSaveClick = async () => {
        try {
            const editedImageData = await captureEditedImage();
            onSave(editedImageData);
            window.history.back();
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };

    return (
        <div className="mx-auto bg-white rounded-xl shadow-lg overflow-auto">
            <div
                className="grid md:grid-cols-[2fr,1fr]"
                
            >
                <div className="relative bg-gray-900 h-[calc(100vh-2rem)]">
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
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            {imageControls.map(({ onClick, title, Icon }) => (
                                <Button key={title} onClick={onClick} size="xs" title={title}>
                                    <Icon />
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white flex flex-col justify-between">
                    <Tabs
                        aria-label="tabs with underline"
                        variant="underline"
                        className="savani mm"
                    >
                        <Tabs.Item active title="Basic">
                            <div className="space-y-6">
                                {adjustmentControls.map((control) => (
                                    <div key={control.label} className="space-y-2">
                                        <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                                            {control.label}
                                            <span className="text-gray-500">{control.value}%</span>
                                        </label>
                                        <RangeSlider
                                            min={control.min}
                                            max={control.max}
                                            value={control.value}
                                            onChange={(e) => control.setValue(Number(e.target.value))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Tabs.Item>

                        <Tabs.Item title="Filters">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(filters).map((filterName) => (
                                    <Button
                                        key={filterName}
                                        onClick={() => applyPresetFilter(filterName)}
                                        className={
                                            activeFilter === filterName ? "!bg-gray-900" : ""
                                        }
                                    >
                                        {filterName.replace(/([A-Z])/g, " $1").trim()}
                                    </Button>
                                ))}
                            </div>
                        </Tabs.Item>

                        <Tabs.Item title="Effects">
                            <div className="space-y-6">
                                {effectControls.map((control) => (
                                    <div key={control.label} className="space-y-2">
                                        <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                                            {control.label}
                                            <span className="text-gray-500">{control.value}</span>
                                        </label>
                                        <RangeSlider
                                            id="default-range"
                                            type="range"
                                            min={control.min}
                                            max={control.max}
                                            step={control.step || 1}
                                            value={control.value}
                                            onChange={(e) => control.setValue(Number(e.target.value))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Tabs.Item>

                        <Tabs.Item title="Background">
                            {renderBackgroundRemoval()}
                        </Tabs.Item>
                    </Tabs>

                    <div className="flex gap-4 mt-8">
                        <Button onClick={()=> window.history.back()} className="w-full">
                            Back
                        </Button>
                        <Button onClick={resetAdjustments} className="w-full">
                            Reset
                        </Button>
                        <Button onClick={handleSaveClick} className="w-full">
                            Save 
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
