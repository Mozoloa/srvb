import { el } from '@elemaudio/core';


function eqSignal(bands, xn) {
    return bands.reduce((acc, band) => {
        let args = [band.freq, band.q];

        if (band.hasOwnProperty('gain'))
            args.push(band.gain);

        return band.type.call(null, ...args, acc);
    }, xn);
}




function FourthOderBF(type, cutoffFrequency, xn) {
    // Calculate Q values for a 4th-order Butterworth filter
    const n = 4;
    const qValues = [];
    for (let k = 0; k < n / 2; k++) {
        const theta = (Math.PI / 2) + ((2 * k + 1) * Math.PI) / (2 * n);
        const q = 1 / (2 * Math.abs(Math.cos(theta)));
        qValues.push(q);
    }

    // Build the filter bands based on the specified type (lowpass or highpass)
    const bands = qValues.map(q => ({
        type: type === 'lowpass' ? el.lowpass : el.highpass,
        freq: cutoffFrequency,
        q: q,
    }));

    // Apply the filter sections iteratively
    let filteredSignal = eqSignal(bands, xn);

    // Cascaded for 4th-order
    filteredSignal = eqSignal(bands, filteredSignal);

    return filteredSignal;
}

export default function bandpass(lowFreq, highFreq, slope, gain, xn) {
    let EQed;

    console.log('bandpass lowFreq:', lowFreq, 'highFreq:', highFreq, 'slope:', slope);

    if (slope === 0) {
        const bands = [];
        // Add highpass only if lowFreq is provided
        if (lowFreq != null) {
            bands.push({ type: el.highpass, freq: lowFreq, q: 0.707 });
        }
        // Add lowpass only if highFreq is provided
        if (highFreq != null) {
            bands.push({ type: el.lowpass, freq: highFreq, q: 0.707 });
        }

        // Apply the filters sequentially for 24 dB/oct slope
        EQed = eqSignal(bands, xn);
        EQed = eqSignal(bands, EQed);
    } else if (slope === 1) {
        // Handle 4th-order Butterworth
        if (lowFreq != null) {
            EQed = FourthOderBF('highpass', lowFreq, xn);
        }
        if (highFreq != null) {
            EQed = FourthOderBF('lowpass', highFreq, EQed || xn);
        }
    }

    return el.mul(EQed, gain);
}
