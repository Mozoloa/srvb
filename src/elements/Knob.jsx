import React, { useEffect, useRef } from 'react';
import DragBehavior from '../DragBehavior';

import './Knob.css';

function drawKnob(ctx, width, height, value, accentColor, knobColor) {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the knob
  const hw = width * 0.5;
  const hh = height * 0.5;
  const radius = Math.min(hw, hh) * 0.5;
  const lineWidth = 7;

  // Define the button linear gradient
  const BTNgradient = ctx.createLinearGradient(0, 0, width, height); // x0, y0, x1, y1
  BTNgradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
  BTNgradient.addColorStop(0.7, 'rgba(0, 0, 0, 1)');

  // invert the gradient for the button
  const invGradient = ctx.createLinearGradient(0, 0, width, height); // x0, y0, x1, y1
  invGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  invGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');

  // Draw circle with linear gradient fill
  ctx.fillStyle = BTNgradient;
  ctx.strokeStyle = invGradient; // Set to desired stroke color
  ctx.beginPath();
  ctx.arc(hw, hh, radius * 3, 0, 2 * Math.PI, false); // x, y, radius, startAngle, endAngle, anticlockwise
  ctx.fill();

  // Create radial gradient for masking
  const radialGradient = ctx.createRadialGradient(hw, hh, radius * 1.3, hw, hh, radius * 2.5); // x, y, radius, x, y, radius
  radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  radialGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
  radialGradient.addColorStop(0.5, 'rgba(255, 255, 255,0)');

  // Apply radial gradient as mask
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  ctx.arc(hw, hh, radius * 3, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle, anticlockwise
  ctx.fill();

  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';

  // Container
  ctx.strokeStyle = invGradient; // Set to desired stroke color
  ctx.lineWidth = lineWidth * 0.2;
  ctx.fillStyle = knobColor;
  ctx.beginPath();
  ctx.arc(hw, hh, radius + lineWidth, 0, 2 * Math.PI, false);
  ctx.fill()
  ctx.stroke();

  // Button
  ctx.strokeStyle = knobColor; // or any other color in hex
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.arc(hw, hh, radius * 0.90, 0, 2 * Math.PI, false);
  ctx.closePath();

  ctx.fillStyle = BTNgradient; // Use the radial gradient as the fill style
  ctx.fill();

  // Top of button
  // Define the button radial gradient
  const topGradient = ctx.createRadialGradient(hw, hh, 0, hw, hh, radius);
  topGradient.addColorStop(0.8, 'hsla(0, 0%, 75%, 0.1)');
  topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.beginPath();
  ctx.arc(hw, hh, radius, 0, 2 * Math.PI, false);
  ctx.closePath();

  ctx.fillStyle = topGradient; // Use the radial gradient as the fill style
  ctx.fill();

  // Meter
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = Math.round(lineWidth * 0.7);
  ctx.lineCap = 'round';

  const KnobStart = 0.75 * Math.PI;
  const KnobEnd = KnobStart + (1.5 * value * Math.PI);
  ctx.beginPath();
  ctx.arc(hw, hh, radius * 1.1, KnobStart, KnobEnd, false);
  ctx.stroke();

  // Value Line
  const pointerStartX = hw + 0.4 * radius * Math.cos(KnobEnd);
  const pointerStartY = hh + 0.4 * radius * Math.sin(KnobEnd);
  const pointerEndX = hw + 0.80 * radius * Math.cos(KnobEnd);
  const pointerEndY = hh + 0.80 * radius * Math.sin(KnobEnd);

  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = lineWidth * 0.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(pointerStartX, pointerStartY);
  ctx.lineTo(pointerEndX, pointerEndY);

  ctx.stroke();
}

function Knob({ name, paramId, onChange, value, defaultValue, accentColor, knobColor }) {
  const canvasRef = useRef();

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  // Double click handler
  const handleDoubleClick = () => {
    handleChange(defaultValue);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawKnob(ctx, canvas.width, canvas.height, value, accentColor, knobColor);
    canvas.addEventListener('dblclick', handleDoubleClick);
    return () => {
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [value, accentColor, knobColor]);
  return (
    <DragBehavior onChange={handleChange} value={value} name={paramId}>
      <div id='knob-container' >
        <canvas ref={canvasRef} width="80" height="80" />
      </div>
    </DragBehavior>
  );
}

export default React.memo(Knob);
