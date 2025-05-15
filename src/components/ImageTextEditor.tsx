
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Type, Images } from "lucide-react";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Define our available static images
const staticImages = [
  { id: "placeholder", src: "/placeholder.svg", label: "Placeholder" },
  { id: "laptop", src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", label: "Laptop" },
  { id: "code", src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", label: "Code" },
  { id: "robot", src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e", label: "Robot" },
  { id: "matrix", src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", label: "Matrix" },
];

const ImageTextEditor = () => {
  const [text, setText] = useState("Your text here");
  const [selectedImage, setSelectedImage] = useState(staticImages[0]);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Static values
  const textColor = "#ffffff";
  const fontSize = 32;
  
  const handleImageChange = (imageId: string) => {
    const newImage = staticImages.find(img => img.id === imageId) || staticImages[0];
    setSelectedImage(newImage);
  };
  
  const handleDownload = () => {
    if (!canvasRef.current) {
      toast.error("Cannot generate image");
      return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for external images
    
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
      
      // Fixed position - center of the image
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      
      ctx.fillText(text, x, y);
      
      // Convert to data URL and download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `text-on-${selectedImage.id}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success("Image downloaded successfully!");
    };
    
    img.onerror = () => {
      toast.error("Failed to load the selected image");
    };
    
    img.src = selectedImage.src;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Image Text Editor</h1>
      
      <div className="flex flex-col gap-6">
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
        
        {/* Image Selection */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="image-select" className="font-medium flex items-center gap-2">
            <Images size={16} /> Choose Background Image
          </Label>
          <Select 
            value={selectedImage.id} 
            onValueChange={handleImageChange}
          >
            <SelectTrigger id="image-select">
              <SelectValue placeholder="Select an image" />
            </SelectTrigger>
            <SelectContent>
              {staticImages.map((image) => (
                <SelectItem key={image.id} value={image.id}>
                  {image.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Canvas Preview */}
        <div 
          ref={canvasRef}
          className="relative w-full border rounded-lg overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center"
        >
          <img
            src={selectedImage.src}
            alt={`${selectedImage.label} background`}
            className="max-w-full max-h-[500px] object-contain"
          />
          <div
            className="draggable-text"
            style={{
              color: textColor,
              fontSize: `${fontSize}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "Arial, sans-serif",
              textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
              fontWeight: "bold",
              position: "absolute",
              pointerEvents: "none"
            }}
          >
            {text}
          </div>
        </div>
        
        {/* Download Button */}
        <Button
          onClick={handleDownload}
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
