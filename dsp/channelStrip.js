import invariant from 'invariant';
import { el } from '@elemaudio/core';
/* import expand from './expand'; */
import comp from './comp';
import bandpass from './bandSplit';


export default function channelStrip(props, left, right) {
    invariant(typeof props === 'object', 'Unexpected props object');
    const input = {
        left: el.meter({ name: "main_inputL" }, left),
        right: el.meter({ name: "main_inputR" }, right)
    }

    const xOver = 150
    const slope = 0

    const LowGain = el.db2gain(el.sm(props.bands_low_gain));
    const LowMidGain = el.db2gain(el.sm(props.bands_lowmid_gain));
    const MidGain = el.db2gain(el.sm(props.bands_mid_gain));
    const HighMidGain = el.db2gain(el.sm(props.bands_highmid_gain));
    const HighGain = el.db2gain(el.sm(props.bands_high_gain));

    const LLMXover = el.sm(props.bands_lowlowmid_xover);
    const LMMXover = el.sm(props.bands_lowmidmid_xover);
    const MHMXover = el.sm(props.bands_midhighmid_xover);
    const HHMXover = el.sm(props.bands_highmidhigh_xover);

    const lowBand = {
        left: bandpass(null, LLMXover, slope, LowGain, input.left),
        right: bandpass(null, LLMXover, slope, LowGain, input.right)
    }

    const lowMidBand = {
        left: bandpass(LLMXover, LMMXover, slope, LowMidGain, input.left),
        right: bandpass(LLMXover, LMMXover, slope, LowMidGain, input.right)
    }

    const midBand = {
        left: bandpass(LMMXover, MHMXover, slope, MidGain, input.left),
        right: bandpass(LMMXover, MHMXover, slope, MidGain, input.right)
    }

    const highMidBand = {
        left: bandpass(MHMXover, HHMXover, slope, HighMidGain, input.left),
        right: bandpass(MHMXover, HHMXover, slope, HighMidGain, input.right)
    }

    const highBand = {
        left: bandpass(HHMXover, null, slope, HighGain, input.left),
        right: bandpass(HHMXover, null, slope, HighGain, input.right)
    }

    output = {
        left: el.add(lowBand.left, lowMidBand.left, midBand.left, highMidBand.left, highBand.left),
        right: el.add(lowBand.right, lowMidBand.right, midBand.right, highMidBand.right, highBand.right)
    }

    /* const lowBand = bandSplit(null, 500, slope, input.left, input.right); */

    return {
        left: el.meter({ name: "main_outputL" }, output.left),
        right: el.meter({ name: "main_outputR" }, output.right)
    }
}