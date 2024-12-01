import React, { useEffect, useRef } from 'react';
import DragBehavior from './DragBehavior';

function drawKnob(ctx, width, height, value, meterColor, knobColor) {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Draw the knob
  const hw = width * 0.5;
  const hh = height * 0.5;
  const radius = Math.min(hw, hh) * 0.8;

  // Container
  ctx.strokeStyle = knobColor;
  ctx.lineWidth = Math.round(width * 0.05);
  ctx.lineCap = 'round';

  const fillStart = 0.75 * Math.PI;
  const fillEnd = fillStart + (1.5 * Math.PI);

  ctx.beginPath();
  ctx.arc(hw, hh, radius, fillStart, fillEnd, false);
  ctx.stroke();

  // Fill
  ctx.strokeStyle = meterColor;
  ctx.lineWidth = Math.round(width * 0.05);
  ctx.lineCap = 'round';


  const KnobStart = 0.75 * Math.PI;
  const KnobEnd = fillStart + (1.5 * value * Math.PI);

  ctx.beginPath();
  ctx.arc(hw, hh, radius, KnobStart, KnobEnd, false);
  ctx.stroke();
}

function Knob({ name, paramId, onChange, value, meterColor, knobColor }) {
  const canvasRef = useRef();
  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawKnob(ctx, canvas.width, canvas.height, value, meterColor, knobColor);
  }, [value, meterColor, knobColor]);
  return (
    <DragBehavior onChange={handleChange} value={value} name={paramId}>
      <div id='knob-container' >
        <canvas ref={canvasRef} width="60" height="60" />
        <div id='knob-name'>{name}</div>
      </div>
    </DragBehavior>
  );
}

export default React.memo(Knob);
