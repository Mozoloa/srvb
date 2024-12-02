import React, { useState, useEffect, useRef } from 'react';

function DecibelMeter({ event, type, direction, range, invert, girth }) {
    const [meterValue, setMeterValue] = useState(0); // Current meter value
    const [overload, setOverload] = useState(false); // Overload state
    const prevValueRef = useRef(0); // Ref to store previous meter value
    let decay = 0;
    !range && (range = 60);

    switch (type) {
        case 'gr':
            decay = 1;
            invert = true;
            break;
        case 'output':
            decay = 1;
            break;
        case 'input':
            decay = 1;
            break;
        default:
            break;
    }

    useEffect(() => {
        if (!event?.event) {
            console.log('No event received');
            return;
        }

        let max = event.event.max;
        let isOverloaded = false;
        if (max > 1) {
            max = 1;
            isOverloaded = true;
        }

        const logMax = Math.max(20 * Math.log10(max), range * -1);
        let normalizedMax = (logMax + range) / range;
        if (max > 0) {
            // If there's some signal then set a minimum value of 1%, akin to a "sig" diode
            normalizedMax = Math.max(normalizedMax, 0.01);
        }
        if (invert) {
            normalizedMax = 1 - normalizedMax;
        }
        if (normalizedMax < prevValueRef.current && decay > 0) {
            // Apply decay
            const decayedValue = prevValueRef.current * decay;
            setMeterValue(decayedValue);
        } else {
            setMeterValue(normalizedMax);
        }
        setOverload(isOverloaded);
        prevValueRef.current = normalizedMax;
    }, [event]);

    let roundedMax = Math.round(meterValue * 1000) / 10;
    /* const roundedMax = 50; */
    let meterContainerStyle = {
        width: `${girth}px`,
        height: '100%',
    };
    let meterValueStyle = {
        height: `${roundedMax}%`,
        width: '100%',
        bottom: invert ? 'auto' : '0',
    };
    if (direction === 'horizontal') {
        meterValueStyle = {
            width: `${roundedMax}%`,
            height: '100%',
            right: invert ? '0' : 'auto',
        };
        meterContainerStyle = {
            width: '100%',
            height: `${girth}px`,
        };
    }

    const overlayClass = `${type}-signal`
    const overloadClass = overload ? 'overload' : 'overload-safe';

    return (
        <div id='meter-container' style={meterContainerStyle} >
            <div id='meter-value' style={meterValueStyle}></div>
            <div id='meter-overlay' className={overlayClass}></div>
            <div id='meter-overload' className={overloadClass}></div>
        </div >
    );
}

export default React.memo(DecibelMeter);
