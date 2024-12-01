import invariant from 'invariant';
import { el } from '@elemaudio/core';


export default function out(props, xl, xr) {
  invariant(typeof props === 'object', 'Unexpected props object');

  const key = props.key;
  const sampleRate = props.sampleRate;
  const outGain = el.sm(props.outGain);
  // Wet dry mixing
  return [
    el.mul(el.db2gain(outGain), xl),
    el.mul(el.db2gain(outGain), xr),
  ];
}
