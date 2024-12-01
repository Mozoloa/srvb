import React, { useState, useEffect } from 'react';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import Knob from './Knob.jsx';
import manifest from '../public/manifest.json';
import * as gfx from './graphics.jsx';

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
  const colorProps = {
    meterColor: '#bb832d',
    knobColor: '#050505',
  };

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
    const formattedValue = formatValueFromButton(newValue, param.paramId, param.min, param.max, param.log);
    setParamValues({ ...paramValues, [param.paramId]: formattedValue });
    props.requestParamValueUpdate(param.paramId, formattedValue);
  };


  const formatValueForButton = (value, name, min, max, log) => {
    let newValue = value;
    if (log) {
      newValue = Math.log(value / min) / Math.log(max / min);
    } else {
      newValue = (value - min) / (max - min);
    }
    /* console.log(`formatted ${name}: ${value} into ${newValue}`); */
    return newValue;
  }

  const formatValueFromButton = (value, paramId, min, max, log) => {
    let newValue = value;
    if (log) {
      newValue = min * Math.pow(max / min, value);
    } else {
      newValue = value * (max - min) + min;
    };
    if (paramId.includes('order')) {
      newValue = parseInt(newValue);
    }
    return newValue; // Ensure the function returns the converted value
  }

  const formatValueForDisplay = (value, paramId) => {
    value = Math.round(value * 100) / 100;
    // Check if it's a frequency parameter and above 1KHz
    if (paramId.includes('freq')) {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return `${Math.round(value)}`;
    }
    if (paramId.includes('order')) {
      if (value > 0) {
        return parseInt(value) * 12;
      }
      return "OFF"
    }
    if (paramId.includes('env')) {
      return `${Math.round(value * 10) / 10}ms`
    }

    // For other cases, round to one decimal place
    return Math.round(value * 10) / 10;
  };

  return (
    <div id='main'>
      {props.error && (<ErrorAlert message={props.error.message} reset={props.resetErrorState} />)}
      <div id='controls'>
        {/* Create a container for each parameter group */}
        {['comp', 'env', 'out'].map(groupKey => {
          // Determine the SVG component key (strip numbers if 'peak')
          const svgKey = groupKey.includes('peak') ? 'peak' : groupKey;
          return (
            <div key={groupKey} id={groupKey} className="group-container">
              {gfx[svgKey] ? React.createElement(gfx[svgKey], { className: "group-gfx" }) : groupKey.split("_")[0].toUpperCase()}
              <div className="group-params">
                {/* Filter and map parameters that belong to the current group */}
                {manifest.parameters.filter(param => param.paramId.startsWith(groupKey)).map(param => {
                  const isOffset = param.paramId.includes('_ratio') || param.paramId.includes('_atk') || param.paramId.includes('_mix');
                  const buttonValue = formatValueForButton(paramValues[param.paramId], param.paramId, param.min, param.max, param.log);
                  return (
                    <div key={param.paramId} id={param.paramId} className={`group-param ${isOffset ? 'self-end' : ''}`}>
                      <Knob
                        value={buttonValue}
                        onChange={(newValue) => handleValueChange(param, newValue)}
                        name={param.name}
                        paramId={param.paramId}
                        {...colorProps}
                      />
                      <div className="param-value">
                        {`${formatValueForDisplay(paramValues[param.paramId], param.paramId)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

}