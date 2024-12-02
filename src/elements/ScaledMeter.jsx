import React from 'react';
import DecibelMeter from './DecibelMeter';

import './ScaledMeter.css';

function ScaledMeter({ direction, event, type, girth, range, subdivisions, invert, decay }) {
    !girth && (girth = 14);
    !range && (range = 60);
    !subdivisions && (subdivisions = 6);
    !decay && (decay = 0);
    const subdivisionValue = Math.round(range / subdivisions * 10) / 10;
    const girthPx = `${girth}px`;
    // stereo is true if event has a key name left and right
    const stereo = event.hasOwnProperty('left') && event.hasOwnProperty('right');

    const horizontal = {
        flexDirection: 'row',
    };
    const vertical = {
        flexDirection: 'column-reverse',
    };
    let elementStyle = vertical;
    let elementsStyle = horizontal
    let containerStyle = {
        margin: '1px auto',
        width: "100%",
        height: girthPx,
    }
    if (direction === 'vertical') {
        elementStyle = horizontal;
        elementsStyle = vertical;
        containerStyle = {
            margin: 'auto 1px',
            width: girthPx,
            height: "100%",
        }
    }
    return (
        <div id="scaled-meter" style={containerStyle}>
            {stereo ? (
                <div className="stereo-meter-container">
                    <DecibelMeter
                        event={event.left}
                        type={type}
                        direction={direction}
                        range={range}
                        girth={girth / 2.4}
                        invert={invert}
                        decay={decay}
                    />
                    <DecibelMeter
                        event={event.right}
                        type={type}
                        direction={direction}
                        range={range}
                        girth={girth / 2.4}
                        invert={invert}
                        decay={decay}
                    />
                </div>
            ) : (
                <DecibelMeter
                    event={event}
                    type={type}
                    direction={direction}
                    range={range}
                    girth={girth}
                    invert={invert}
                    decay={decay}
                />
            )}
            <div id='decibel-scale' style={elementsStyle}>
                {Array.from(Array(subdivisions + 1).keys()).map((i) => {
                    if (i === 0 || i === subdivisions) {
                        return (
                            <div key={i} className='scale-element-container'> {/* key moved here */}
                            </div>
                        )
                    } else {
                        return (
                            <div key={i} className='scale-element-container'>
                                <div className='scale-element' style={elementStyle}>
                                    <div className='scale-dot' ></div>
                                    <div className='scale-mark'>{range - i * subdivisionValue}</div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    );

}

export default React.memo(ScaledMeter);
