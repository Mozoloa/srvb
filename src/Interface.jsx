import React, { useState, useEffect } from 'react';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import CompBlock from './channelStrip/CompBlock.jsx';
import BandsBlock from './channelStrip/bandsBlocks.jsx';
import ExpBlock from './channelStrip/ExpBlock.jsx';
import Knob from './elements/Knob.jsx';
import ScaledMeter from './elements/ScaledMeter.jsx';
import manifest from '../public/manifest.json';
import * as gfx from './graphics.jsx';
import * as Util from './Utilities.js';

function ErrorAlert({ message, reset }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={reset}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Interface(props) {

  // Initialize paramValues state with default values from the manifest
  const [paramValues, setParamValues] = useState(() => {
    const initialParams = {};
    manifest.parameters.forEach(param => {
      initialParams[param.paramId] = props[param.paramId] ?? param.defaultValue;
    });
    return initialParams;
  });

  useEffect(() => {
    manifest.parameters.forEach(param => {
      const paramId = param.paramId;
      if (props[paramId] !== undefined && props[paramId] !== paramValues[paramId]) {
/*         console.log(`Updating param ${paramId}: ${props[paramId]}`);
 */        setParamValues(currentValues => ({
        ...currentValues,
        [paramId]: props[paramId]
      }));
      }
    });
  }, [props, paramValues]);

  const handleValueChange = (param, newValue) => {
    const formattedValue = Util.formatValueFromButton(newValue, param.paramId, param.min, param.max, param.log);
    setParamValues({ ...paramValues, [param.paramId]: formattedValue });
    props.requestParamValueUpdate(param.paramId, formattedValue);
  };

/*   if (!props.events) {
    console.log('No events received');
    return null;
  } */
  return (
    <div id='main'>
      {props.error && (<ErrorAlert message={props.error.message} reset={props.resetErrorState} />)}
      <div id='header'></div>
      <div id='mainBlock'>
      <div id='inputMeter'>
          {/* <ScaledMeter
            event={{
              left: props.events.main_inputL,
              right: props.events.main_inputR
            }}
            type={'input'}
            direction={'vertical'}
            girth={15}
            subdivisions={16}
            range={80}
          /> */}
        </div>
      <div id='controls'>
        
  {/*       <ExpBlock
          props={props}
          manifest={manifest}
          paramValues={paramValues}
          handleValueChange={handleValueChange}
        /> */}
        <BandsBlock
          props={props}
          manifest={manifest}
          paramValues={paramValues}
          handleValueChange={handleValueChange}
        />
        <CompBlock
          props={props}
          manifest={manifest}
          paramValues={paramValues}
          handleValueChange={handleValueChange}
        />
      
      </div>
      <div id='inputMeter'>
         {/*  <ScaledMeter
            event={{
              left: props.events.main_outputL,
              right: props.events.main_outputR
            }}
            type={'output'}
            direction={'vertical'}
            girth={15}
            subdivisions={12}
            range={60}
          /> */}
        </div>
      </div>
    </div >
  );

}