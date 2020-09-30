import React, { useState, useEffect, useRef } from "react";
import {
  rest,
  cache,
  session,
  validateResponse,
  toLocalDateString,
} from "../lib/common";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function AvatarEditor({ image, onClose }) {
  const cropperRef = useRef(null);
  const resultRef = useRef(null);

  const getRoundedCanvas = (sourceCanvas) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  };

  const crop = () => {
    // Crop
    const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
      width: 100,
      height: 100,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    // Round
    const roundedCanvas = getRoundedCanvas(croppedCanvas);

    // Show
    const roundedImage = document.createElement("img");
    roundedImage.src = roundedCanvas.toDataURL();
    resultRef.current.innerHTML = "";
    resultRef.current.appendChild(roundedImage);
  };

  return (
    <>
      <Cropper
        src={image}
        style={{ height: 400, width: "100%" }}
        // Cropper.js options
        aspectRatio={1}
        viewMode={1}
        minCropBoxHeight={100}
        minCropBoxWidth={100}
        guides={false}
        cropend={crop}
        ready={crop}
        ref={cropperRef}
      />
      <div ref={resultRef}></div>
      <button onClick={() => onClose(resultRef.current.firstChild.src)}>保存</button>
      <button onClick={() => onClose(null)}>取消</button>
    </>
  );
}

export default AvatarEditor;
