import { Renderer, el } from '@elemaudio/core';
import { RefMap } from './RefMap';
import channelStrip from './channelStrip';

// This project demonstrates writing a small FDN reverb effect in Elementary.
//
// First, we initialize a custom Renderer instance that marshals our instruction
// batches through the __postNativeMessage__ function to direct the underlying native
// engine.
let core = new Renderer((batch) => {
  __postNativeMessage__(JSON.stringify(batch));
});

// Next, a RefMap for coordinating our refs
let refs = new RefMap(core);

// Holding onto the previous state allows us a quick way to differentiate
// when we need to fully re-render versus when we can just update refs
let prevState = null;

function shouldRender(prevState, nextState) {
  if (prevState === null || prevState.sampleRate !== nextState.sampleRate) {
    console.log('Full render');
    return true;
  }
}
// This function takes the incoming state and prepares it for rendering. It only creates refs if the param is going to be used in a dsp (aka mounted), so order which is just an integer is not a dsp param and doesn't need a ref. Same with sampleRate.
function prepProps(state, key) {
  let newProps = {
    key: key,
  }
  for (let [k, v] of Object.entries(state)) {
    if (k === 'sampleRate' || k.includes("order")) {
      newProps[k] = v;
    } else {
      newProps[k] = refs.getOrCreate(k, 'const', { value: v }, []);
    }
  }
  return newProps;
}

function updateProps(state) {
  for (let [k, v] of Object.entries(state)) {
    if (k === 'sampleRate' || k.includes("order")) {
      continue;
    }
    try {
      refs.update(k, { value: v });
      /*   console.log(`Updatied ref '${k}' with value`, v); */
    } catch (error) {
      console.log(`Error updating ref '${k}': '${error}'`);
    }
  }
}

// The important piece: here we register a state change callback with the native
// side. This callback will be hit with the current processor state any time that
// state changes.
//
// Given the new state, we simply update our refs or perform a full render depending
// on the result of our `shouldRender` check.
globalThis.__receiveStateChange__ = (serializedState) => {
  const state = JSON.parse(serializedState);
  if (shouldRender(prevState, state)) {
    const props = prepProps(state, 'channelStrip');
    console.log('Starting rendering with props:', props);

    const strip = channelStrip(props, el.in({ channel: 0 }), el.in({ channel: 1 }));
    let stats = core.render(
      strip.left,
      strip.right
    );
    console.log("rendering", stats);
  } else {
    /* console.log('Updating refs with new state', state); */
    updateProps(state);
  }

  prevState = state;
};
// NOTE: This is highly experimental and should not yet be relied on
// as a consistent feature.
//
// This hook allows the native side to inject serialized graph state from
// the running elem::Runtime instance so that we can throw away and reinitialize
// the JavaScript engine and then inject necessary state for coordinating with
// the underlying engine.
globalThis.__receiveHydrationData__ = (data) => {
  const payload = JSON.parse(data);
  const nodeMap = core._delegate.nodeMap;

  for (let [k, v] of Object.entries(payload)) {
    nodeMap.set(parseInt(k, 16), {
      symbol: '__ELEM_NODE__',
      kind: '__HYDRATED__',
      hash: parseInt(k, 16),
      props: v,
      generation: {
        current: 0,
      },
    });
  }
};

// Finally, an error callback which just logs back to native
globalThis.__receiveError__ = (err) => {
  console.log(`[Error: ${err.name}] ${err.message}`);
};
