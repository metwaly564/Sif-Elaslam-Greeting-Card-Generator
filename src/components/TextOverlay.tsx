import React, { useRef, useEffect, useState } from "react";

interface TextOverlayProps {
  text: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  color,
  fontSize,
  position,
  setPosition,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !textRef.current) return;
      
      const parentElement = textRef.current.parentElement;
      if (!parentElement) return;
      
      const bounds = parentElement.getBoundingClientRect();
      
      // Calculate position as percentage of parent dimensions
      const x = ((event.clientX - bounds.left - dragOffset.x) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top - dragOffset.y) / bounds.height) * 100;
      
      // Keep text within bounds (0-100%)
      const constrainedX = Math.max(0, Math.min(100, x));
      const constrainedY = Math.max(0, Math.min(100, y));
      
      setPosition({ x: constrainedX, y: constrainedY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, setPosition]);
  
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!textRef.current) return;
    
    // Calculate offset from the top-left corner of the text element
    const textRect = textRef.current.getBoundingClientRect();
    const offsetX = event.clientX - textRect.left;
    const offsetY = event.clientY - textRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };
  
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!textRef.current) return;
    
    // Calculate offset from the top-left corner of the text element
    const textRect = textRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    const offsetX = touch.clientX - textRect.left;
    const offsetY = touch.clientY - textRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };
  
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !textRef.current) return;
    
    const parentElement = textRef.current.parentElement;
    if (!parentElement) return;
    
    const bounds = parentElement.getBoundingClientRect();
    const touch = event.touches[0];
    
    // Calculate position as percentage of parent dimensions
    const x = ((touch.clientX - bounds.left - dragOffset.x) / bounds.width) * 100;
    const y = ((touch.clientY - bounds.top - dragOffset.y) / bounds.height) * 100;
    
    // Keep text within bounds (0-100%)
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div
      ref={textRef}
      className="draggable-text"
      style={{
        color,
        fontSize: `${fontSize}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        fontFamily: "Arial, sans-serif",
        textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
        fontWeight: "bold",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {text}
    </div>
  );
};

export default TextOverlay;
