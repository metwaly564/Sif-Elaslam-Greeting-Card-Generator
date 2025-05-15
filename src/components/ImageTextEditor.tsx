import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Type, Images, User } from "lucide-react";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

const designs = [
  { id: 1, label: "تصميم 1" },
  { id: 2, label: "تصميم 2" },
  { id: 3, label: "تصميم 3" },
  { id: 4, label: "تصميم 4" },
  { id: 5, label: "تصميم 5" },
  // ...add more as needed
];

const greetingMessages = [
  "تهانينا القلبية",
  "ألف مبروك",
  "كل عام وأنتم بخير",
  "أجمل التهاني",
  "أطيب الأمنيات",
  "أحلى التهاني"
];

const fontMap = {
  amiri: "'Amiri', serif"
};

const textColor = "#ffffff";
const fontSize = 32;
const selectedFont = "amiri";

const getImageSrc = (type: "V" | "H", designId: number) =>
  `/معايدة/GreetingCards - Create Card_files/${type}${designId}.jpg`;

const handleDownload = (
  orientation: "vertical" | "horizontal",
  designId: number,
  selectedGreeting: string,
  name: string
) => {
  const imgSrc = getImageSrc(orientation === "vertical" ? "V" : "H", designId);
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.src = imgSrc;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    document.fonts.ready.then(() => {
      ctx.font = `${fontSize}px ${fontMap[selectedFont]}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.direction = "rtl";
      const greetingX = canvas.width / 2;
      const greetingY = canvas.height / 2 - 20;
      ctx.fillText(selectedGreeting, greetingX, greetingY);
      const nameX = canvas.width / 2;
      const nameY = canvas.height / 2 + 20;
      ctx.fillText(name, nameX, nameY);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `بطاقة-تهنئة-${orientation}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("تم تحميل البطاقة بنجاح!");
    });
  };
  img.onerror = () => {
    toast.error("فشل تحميل الصورة المختارة");
  };
};

const ImageTextEditor = () => {
  const [selectedDesign, setSelectedDesign] = useState(designs[0].id);
  const [selectedGreeting, setSelectedGreeting] = useState(greetingMessages[0]);
  const [name, setName] = useState("");

  return (
    <div className="con w-full max-w-4xl mx-auto p-4" dir="rtl" style={{ textAlign: "right" }}>
      <div className="title_sec">
        <h1 className="text-3xl font-bold">منشئ بطاقة التهنئة</h1>
      </div>
      <div className="flex flex-col gap-6">
        {/* Design Selection */}
        <div className="flex flex-col gap-2">
          <Label className="font-medium flex items-center gap-2">
            <Images size={16} /> اختر التصميم
          </Label>
          <div className="grid grid-cols-3 gap-4">
            {designs.map((design) => (
              <div
                key={design.id}
                className={`card-one cursor-pointer border-2 text-center  ${
                  selectedDesign === design.id ? "border-green-600 rounded-lg" : "border-transparent"
                }`}
                onClick={() => setSelectedDesign(design.id)}
                style={{ padding: 0 }}
              >
                <img
                  src={getImageSrc("H", design.id)}
                  alt={design.label}
                  className="w-full object-contain rounded-t bg-white"
                  
                />
              </div>
            ))}
          </div>
        </div>
        {/* Greeting Selection */}
        <div className="flex flex-col gap-2">
          <Label className="font-medium flex items-center gap-2">
            <Type size={16} /> اختر عبارة التهنئة
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {greetingMessages.map((greeting) => (
              <div
                key={greeting}
                className={`cursor-pointer p-3 rounded-lg text-center transition ${
                  selectedGreeting === greeting
                    ? "border-2 border-green-600 bg-white font-bold text-green-700"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedGreeting(greeting)}
                style={{ minHeight: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {greeting}
              </div>
            ))}
          </div>
        </div>
        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name-input" className="font-medium flex items-center gap-2">
            <User size={16} /> اكتب اسمك
          </Label>
          <Input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك"
            className="b-t"
            style={{ textAlign: "right" }}
          />
        </div>
        {/* Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vertical Preview */}
          <div className="flex flex-col items-center">
            <div
              className="card-one relative border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
              style={{ width: "100%", maxWidth: "250px", margin: "0 auto", padding: 0 }}
            >
              <img
                src={getImageSrc("V", selectedDesign)}
                alt="تصميم رأسي"
                className="w-full h-auto"
                style={{ display: "block" }}
              />
              <div
                className="draggable-text"
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontWeight: "bold",
                  position: "absolute",
                  pointerEvents: "none",
                  textAlign: "center",
                  direction: "rtl",
                  fontFamily: fontMap[selectedFont]
                }}
              >
                <div>{selectedGreeting}</div>
                <div>{name}</div>
              </div>
            </div>
            <Button
              onClick={() => handleDownload("vertical", selectedDesign, selectedGreeting, name)}
              className="b-t flex items-center gap-2 w-full mt-2"
              style={{ maxWidth: "250px" }}
            >
              <Download size={16} />
              تحميل البطاقة الرأسية
            </Button>
          </div>
          {/* Horizontal Preview */}
          <div>
            <div
              className="card-one relative w-full border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
              style={{ padding: 0 }}
            >
              <img
                src={getImageSrc("H", selectedDesign)}
                alt="تصميم أفقي"
                className="w-full h-auto"
                style={{ display: "block" }}
              />
              <div
                className="draggable-text"
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                  fontWeight: "bold",
                  position: "absolute",
                  pointerEvents: "none",
                  textAlign: "center",
                  direction: "rtl",
                  fontFamily: fontMap[selectedFont]
                }}
              >
                <div>{selectedGreeting}</div>
                <div>{name}</div>
              </div>
            </div>
            <Button
              onClick={() => handleDownload("horizontal", selectedDesign, selectedGreeting, name)}
              className="b-t flex items-center gap-2 w-full mt-2"
            >
              <Download size={16} />
              تحميل البطاقة الأفقية
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTextEditor;
