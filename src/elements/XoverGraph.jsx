import React from 'react';

export default function XoverGraph({ lowlowmid, lowmidmid, midhighmid, highmidhigh }) {
    const minFrequency = 20; // Lowest frequency
    const maxFrequency = 20000; // Highest frequency

    // Helper to calculate the log-scaled position
    const logPosition = (freq) => Math.log10(freq / minFrequency) / Math.log10(maxFrequency / minFrequency);

    // Calculate the relative log-scaled widths of each band
    const bandWidths = [
        logPosition(lowlowmid) - logPosition(minFrequency),
        logPosition(lowmidmid) - logPosition(lowlowmid),
        logPosition(midhighmid) - logPosition(lowmidmid),
        logPosition(highmidhigh) - logPosition(midhighmid),
        logPosition(maxFrequency) - logPosition(highmidhigh),
    ].map(width => width * 100); // Convert to percentages

    // Frequency markers
    const markers = [20, 50, 100, 250, 500, 1000, 2000, 3000, 5000, 10000, 20000];

    return (
        <div id="xoversGraph" style={{ position: 'relative' }}>
            {/* Graph Bands */}
            <div id='xoverGraphBG'>
                {bandWidths.map((width, index) => (
                    <div
                        key={index}
                        className={index % 2 === 0 ? 'oddBand' : 'evenBand'} // Alternate between oddBand and evenBand
                        style={{
                            width: `${width}%`,
                            height: '100%',
                        }}
                    />
                ))}
            </div>

            {/* Frequency Markers with Dots */}
            <div id="xoverMarkerZone">
                {markers.map((freq) => {
                    const position = logPosition(freq) * 100; // Calculate position in percentage
                    return (
                        <div className='xoverMarker'
                            key={freq}
                            style={{

                                left: `${position}%`,

                            }}
                        >
                            {/* Dot */}
                            <div className='xoverDot' />
                            {/* Frequency Label */}
                            {freq < 1000 ? freq : `${freq / 1000}k`} {/* Format frequency */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
