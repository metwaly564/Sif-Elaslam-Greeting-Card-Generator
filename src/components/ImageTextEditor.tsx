
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Upload,
  Download,
  Type,
  MoveHorizontal
} from "lucide-react";
import { toast } from "sonner";
import TextOverlay from "./TextOverlay";

const ImageTextEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("Your text here");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(32);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      toast.success("Image uploaded successfully!");
      // Reset text position when new image is loaded
      setPosition({ x: 50, y: 50 });
    };
    reader.readAsDataURL(file);
  };
  
  const handleDownload = () => {
    if (!canvasRef.current || !image) {
      toast.error("No image to download");
      return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Draw text on canvas
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      
      // Calculate position as percentage of canvas dimensions
      const x = (position.x / 100) * canvas.width;
      const y = (position.y / 100) * canvas.height;
      
      ctx.fillText(text, x, y);
      
      // Convert to data URL and download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "text-image.png";
      link.href = dataUrl;
      link.click();
      
      toast.success("Image downloaded successfully!");
    };
    img.src = image;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Image Text Editor</h1>
      
      <div className="flex flex-col gap-6">
        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="image-upload" className="font-medium">Upload Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <Button size="icon" variant="outline" asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload size={16} />
              </label>
            </Button>
          </div>
        </div>
        
        {/* Text Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="text-input" className="font-medium flex items-center gap-2">
            <Type size={16} /> Text Content
          </Label>
          <Input
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Color */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="color-input" className="font-medium">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color-input"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Font Size */}
          <div className="flex flex-col gap-2">
            <Label className="font-medium">Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              min={10}
              max={100}
              step={1}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
        </div>
        
        {/* Canvas Preview */}
        <div 
          ref={canvasRef}
          className="relative w-full border rounded-lg overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center"
        >
          {image ? (
            <>
              <img
                src={image}
                alt="Uploaded"
                className="max-w-full max-h-[500px] object-contain"
              />
              <TextOverlay
                text={text}
                color={textColor}
                fontSize={fontSize}
                position={position}
                setPosition={setPosition}
              />
            </>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Upload size={48} />
              <p>Upload an image to get started</p>
            </div>
          )}
        </div>
        
        {/* Position Instructions */}
        {image && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MoveHorizontal size={16} />
            <p className="text-sm">Drag the text to position it on the image</p>
          </div>
        )}
        
        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={!image}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download Image with Text
        </Button>
      </div>
    </div>
  );
};

export default ImageTextEditor;
