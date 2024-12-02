import React from 'react';
import ScaledMeter from '../elements/ScaledMeter.jsx';
import Knob from '../elements/Knob.jsx';
import CompGraph from './CompGraph.jsx';
import * as Util from '../Utilities.js';

function CompBlock({ props, manifest, paramValues, handleValueChange }) {
    // if props.events is undefined, return null
    return (
        <div id="compBlock">
            <div className='group-container'>
                <div className="group-params">
                    <ScaledMeter
                        event={
                            {
                                left: props.events.comp_envL,
                                right: props.events.comp_envR
                            }
                        }
                        type={'input'}
                        direction="vertical"
                        decay={1}
                    />
                    {/* Compression curve graph */}
                    <CompGraph
                        threshold={props.comp_main_threshold}
                        ratio={props.comp_main_ratio}
                        knee={props.comp_main_knee}
                        events={props.events}
                    />
                </div>
            </div>
            <ScaledMeter
                event={props.events.comp_gr}
                type={'gr'}
                direction="horizontal"
                range={36}
                subdivisions={12}
                invert={true}
            />
            {/* Create a container for each parameter group */}
            {['comp_main', 'env', 'mix'].map(groupKey => {
                // Determine the SVG component key (strip numbers if 'peak')
                return (
                    <div key={groupKey} id={groupKey} className="group-container">
                        <div className="group-params">
                            {/* Filter and map parameters that belong to the current group */}
                            {manifest.parameters.filter(param => param.paramId.startsWith(groupKey)).map(param => {
                                const buttonValue = Util.formatValueForButton(paramValues[param.paramId], param.paramId, param.min, param.max, param.log);
                                const buttonDefaultValue = Util.formatValueForButton(param.defaultValue, param.paramId, param.min, param.max, param.log);
                                const accentColor = param.hue ? `hsl(${param.hue},100%, 60%)` : '#ccc';
                                return (
                                    <div key={param.paramId} id={param.paramId} className={`group-param`}>
                                        <div id='knob-name'>{param.name}</div>
                                        <Knob
                                            value={buttonValue}
                                            defaultValue={buttonDefaultValue}
                                            onChange={(newValue) => handleValueChange(param, newValue)}
                                            name={param.name}
                                            paramId={param.paramId}
                                            accentColor={accentColor}
                                            knobColor="#050505"
                                        />
                                        <div className="param-value" style={{ color: accentColor }}>
                                            {`${Util.formatValueForDisplay(paramValues[param.paramId], param.paramId)}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}


export default React.memo(CompBlock);