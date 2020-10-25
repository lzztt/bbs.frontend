import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const WIDTH = 128;
const HEIGHT = 128;

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
      width: WIDTH,
      height: HEIGHT,
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
        style={{ maxHeight: 640, width: "100%" }}
        // Cropper.js options
        aspectRatio={1}
        viewMode={1}
        minCropBoxHeight={HEIGHT}
        minCropBoxWidth={WIDTH}
        guides={false}
        cropend={crop}
        ready={crop}
        ref={cropperRef}
      />
      <div ref={resultRef}></div>
      <button onClick={() => onClose(resultRef.current.firstChild.src)}>
        保存
      </button>
      <button onClick={() => onClose(null)}>取消</button>
    </>
  );
}

export default AvatarEditor;
