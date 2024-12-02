import invariant from 'invariant';
import { el } from '@elemaudio/core';
/* import expand from './expand'; */
import comp from './comp';
/* import bandSplit from './bandSplit'; */

function eqSignal(bands, xn) {
    return bands.reduce((acc, band) => {
        let args = [band.freq, band.q];

        if (band.hasOwnProperty('gain'))
            args.push(band.gain);

        return band.type.call(null, ...args, acc);
    }, xn);
}

function bandpass(lowFreq, highFreq, slope, xn) {
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

    return EQed;
}




function FourthOderBF(type, cutoffFrequency, xn) {
    // Calculate Q values for a 4th-order Butterworth filter
    // Reference values derived from Butterworth pole locations
    const qValues = [0.541, 1.306]; // Typical Q values for 4th-order Butterworth

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
function bandSplit(LF, HF, slope, gain, left, right) {
    console.log('bandSplit LF:', LF, 'HF:', HF, 'Gain:', gain);

    const outputL = el.mul(bandpass(LF, HF, slope, left), gain);
    const outputR = el.mul(bandpass(LF, HF, slope, right), gain);
    return {
        left: outputL,
        right: outputR,
    };
}


export default function channelStrip(props, left, right) {
    invariant(typeof props === 'object', 'Unexpected props object');
    const input = {
        left: el.meter({ name: "main_inputL" }, left),
        right: el.meter({ name: "main_inputR" }, right)
    }

    /*    const lowGain = el.sm(props.bands_low_gain)
       const lowMidGain = el.sm(props.bands_lowmid_gain)
       const midGain = el.sm(props.bands_mid_gain)
       const highMid = el.sm(props.bands_highmid_gain)
       const highGain = el.sm(props.bands_high_gain)
   
       const LowThresh = el.sm(props.bands_low_threshold)
       const lowMidThresh = el.sm(props.bands_lowmid_threshold)
       const midThresh = el.sm(props.bands_mid_threshold)
       const highMidThresh = el.sm(props.bands_highmid_threshold)
       const highThresh = el.sm(props.bands_high_threshold)
   
       const lowXover = el.sm(props.bands_lowlowmid_xover)
       const lowMidXover = el.sm(props.bands_lowmidmid_xover)
       const midHighXover = el.sm(props.bands_midhighmid_xover)
       const highXover = el.sm(props.bands_highmidhigh_xover)
       const hardSlope = el.sm(props.bands_hardSlope) */



    const xOver = 150
    const slope = 0
    const LowGain = el.db2gain(el.sm(props.bands_low_gain));
    const LLMXover = el.sm(props.bands_lowlowmid_xover);

    /* const lowBand = bandSplit(props, "Low", slope, LowGain, input.left, input.right); */
    const bands = [];


    /* const lowBand = bandpass(null, 500, 0, input.left); */
    const lowBand = bandSplit(null, 500, slope, LowGain, input.left, input.right);


    /* const outputL = el.mul(input.left, 0.7); */

    /* 
     const lowMidBand = bandSplit(xOver, 20000, slope, input.left, input.right);
 
     const outputL = el.add(lowBand.left, lowMidBand.left);
     const outputR = el.add(lowBand.right, lowMidBand.right); */

    /*  const output = comp(props, lowBand, lowBand); */
    return {
        left: el.meter({ name: "main_outputL" }, lowBand),
        right: el.meter({ name: "main_outputR" }, lowBand)
    }
}