import React, { useEffect, useRef } from 'react';

function drawCompressorGraph(ctx, divWidth, divHeight, threshold, ratio, knee, events) {
    const size = Math.min(divWidth, divHeight); // selects the smaller of the two dimensions
    // Clear the canvas
    ctx.clearRect(0, 0, size, size);

    const padding = 2;
    const lowerBound = -60; // Lower bound for threshold in db
    // normalize knee (1 to 24) to be between 0 and 1 compared to graph range
    const normalizedKnee = knee / (-lowerBound);
    const halfKnee = normalizedKnee / 2;
    const kneeOffset = halfKnee * (size - padding * 2);
    const curveRange = size - padding * 2;
    // normalize threshold( -inf to 0) to be between 0 and 1
    const normalizedThreshold = (threshold - lowerBound) / -lowerBound
    const lowerThreshold = normalizedThreshold - halfKnee;
    const upperThreshold = normalizedThreshold + halfKnee;

    // Constants for graph

    const origin = {
        x: padding,
        y: size - padding
    };
    const limit = size - padding;
    const threshPoint = {
        x: padding + normalizedThreshold * curveRange,
        y: size - padding - normalizedThreshold * curveRange
    };
    const lowerThresholdPoint = {
        x: padding + lowerThreshold * curveRange,
        y: size - padding - lowerThreshold * curveRange
    };
    const upperThresholdPoint = {
        x: padding + upperThreshold * curveRange,
        y: size - padding - upperThreshold * curveRange
    }

    // Draw knee area
    ctx.strokeStyle = `hsla(200, 0%, 50%, ${normalizedKnee / 3})`;
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lowerThresholdPoint.x, limit);
    ctx.lineTo(lowerThresholdPoint.x, origin.x);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(upperThresholdPoint.x, limit);
    ctx.lineTo(upperThresholdPoint.x, origin.x);
    ctx.stroke();

    // Draw background line

    ctx.strokeStyle = "hsla(0, 0%, 0%, 0.2)";
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(size - padding, origin.x);
    ctx.stroke();

    // Draw Initial Line
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(Math.min(origin.x, lowerThresholdPoint.x), Math.max(origin.y, lowerThresholdPoint.y));
    ctx.lineTo(lowerThresholdPoint.x, lowerThresholdPoint.y);
    ctx.stroke();

    // Ratio info
    const ratioAngle = Math.atan(1 / ratio);
    const startX = threshPoint.x + kneeOffset;
    const startY = threshPoint.y - (startX - threshPoint.x) * Math.tan(ratioAngle);
    const endX = Math.max(limit, startX);
    const endY = threshPoint.y - (endX - threshPoint.x) * Math.tan(ratioAngle);


    // Draw Knee Line
    ctx.beginPath();
    ctx.moveTo(lowerThresholdPoint.x, lowerThresholdPoint.y);
    ctx.quadraticCurveTo(lowerThresholdPoint.x + kneeOffset, lowerThresholdPoint.y - kneeOffset, startX, startY);
    ctx.stroke();

    // Draw Ratio Line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function CompGraph({ threshold, ratio, knee, events }) {
    const canvasRef = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        drawCompressorGraph(ctx, canvas.width, canvas.height, threshold, ratio, knee, events);
    }, [threshold, ratio, knee, events]);
    return (
        <div id='graph-container' >
            <canvas ref={canvasRef} width="170" height="170" />
        </div>
    );
}

export default React.memo(CompGraph);
