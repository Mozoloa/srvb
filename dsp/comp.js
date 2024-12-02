import invariant from 'invariant';
import { el } from '@elemaudio/core';

function eqSignal(bands, xn) {
    return bands.reduce((acc, band) => {
        let args = [band.freq, band.q];

        if (band.hasOwnProperty('gain'))
            args.push(band.gain);

        return band.type.call(null, ...args, acc);
    }, xn);
}

function skcompress(atkMs, relMs, threshold, ratio, kneeWidth, sidechain, xn) {
    const env = el.env(
        el.tau2pole(el.mul(0.001, atkMs)),
        el.tau2pole(el.mul(0.001, relMs)),
        sidechain,
    );

    const envDecibels = el.gain2db(env);

    // Calculate the soft knee bounds around the threshold
    const lowerKneeBound = el.sub(threshold, el.div(kneeWidth, 2)); // threshold - kneeWidth/2
    const upperKneeBound = el.add(threshold, el.div(kneeWidth, 2)); // threshold + kneeWidth/2

    // Check if the envelope is in the soft knee range
    const isInSoftKneeRange = el.and(
        el.geq(envDecibels, lowerKneeBound), // envDecibels >= lowerKneeBound
        el.leq(envDecibels, upperKneeBound), // envDecibels <= upperKneeBound
    );

    // Calculate gain multiplier from the ratio (1 - 1/ratio)
    const adjustedRatio = el.sub(1, el.div(1, ratio));

    // Gain calculation
    // When in soft knee range, do:
    //   0.5 * adjustedRatio * ((envDecibels - lowerKneeBound) / kneeWidth) * (lowerKneeBound - envDecibels)
    // Else do:
    //   adjustedRatio * (threshold - envDecibels)
    //
    const gain = el.select(
        isInSoftKneeRange,
        el.mul(
            el.div(adjustedRatio, 2),
            el.mul(
                el.div(el.sub(envDecibels, lowerKneeBound), kneeWidth),
                el.sub(lowerKneeBound, envDecibels)
            )
        ),
        el.mul(
            adjustedRatio,
            el.sub(threshold, envDecibels)
        )
    );

    // Ensuring gain is not positive
    const cleanGain = el.min(0, gain);

    // Convert the gain reduction in dB to a gain factor
    const compressedGain = el.meter({ name: "comp_gr" }, el.db2gain(cleanGain));
    const input = el.meter({ name: "comp_input" }, xn);

    return el.mul(input, compressedGain);
}

export default function comp(props, left, right) {
    invariant(typeof props === 'object', 'Unexpected props object');

    // Sidechain
    /*  const sc_hpf = el.sm(props.env_hpf_freq); */
    const sc_hpf = el.sm(20);

    const bands = [
        { type: el.highpass, freq: sc_hpf, q: 0.707 },
    ]
    // Applies input gain to the sidechain and left/right channels
    const in_gain = el.sm(props.mix_inGain);
    const leftAmped = el.mul(el.db2gain(in_gain), left);
    const rightAmped = el.mul(el.db2gain(in_gain), right);
    const leftSC = el.meter({ name: "comp_envL" }, eqSignal(bands, leftAmped));
    const rightSC = el.meter({ name: "comp_envR" }, eqSignal(bands, rightAmped));
    const threshold = el.sm(props.comp_main_threshold);
    const ratio = el.sm(props.comp_main_ratio);
    const kneeWidth = el.sm(props.comp_main_knee);
    const atkMs = el.sm(props.env_atk);
    const relMs = el.sm(props.env_rel);
    const out_gain = el.sm(props.mix_outGain);
    const mix = el.sm(props.mix_drywet);
    const compL = skcompress(atkMs, relMs, threshold, ratio, kneeWidth, leftSC, leftAmped);
    const compR = skcompress(atkMs, relMs, threshold, ratio, kneeWidth, rightSC, rightAmped);
    const outputL = el.mul(el.db2gain(out_gain), compL);
    const outputR = el.mul(el.db2gain(out_gain), compR);
    const mixedOutputL = el.select(mix, outputL, left);
    const mixedOutputR = el.select(mix, outputR, right)
    // Wet dry mixing
    return {
        left: mixedOutputL,
        right: mixedOutputR,
    };
}
