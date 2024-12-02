import React from 'react';
import ScaledMeter from '../elements/ScaledMeter.jsx';
import Knob from '../elements/Knob.jsx';
import * as Util from '../Utilities.js';

function BandsBlock({ props, manifest, paramValues, handleValueChange }) {
    return (
        <div id="bandsBlock">
            <div id = "legend"></div>
            <div id = "bands">
                <div id = "xovers">
                    {["lowlowmid", "lowmidmid", "midhighmid", "highmidhigh"].map(xoverKey => {
                        return (
                            <div>
                                {manifest.parameters.filter(param => (param.paramId.startsWith("bands") &&param.paramId.includes(xoverKey))).map(param => {
                                const buttonValue = Util.formatValueForButton(paramValues[param.paramId], param.paramId, param.min, param.max, param.log);
                                const buttonDefaultValue = Util.formatValueForButton(param.defaultValue, param.paramId, param.min, param.max, param.log);
                                const accentColor = param.hue ? `hsl(${param.hue},100%, 60%)` : '#ccc';
                                return (
                                    <div key={param.paramId} id={param.paramId} className={`group-param`}>
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
                        )
                    }
                    )}
                </div>
                <div id="bandsBox">
                {["Low", "LowMid", "Mid", "HighMid", "High"].map(bandKey => {
                    return (
                        <div key={bandKey} id={bandKey} className="band group-container">
                            <div class = "band-meter" ></div>
                            <div className="band-offsets">
                            {manifest.parameters.filter(param => (param.paramId.startsWith("bands") &&param.paramId.includes("_"+bandKey.toLowerCase()+"_"))).map(param => {
                                    const buttonValue = Util.formatValueForButton(paramValues[param.paramId], param.paramId, param.min, param.max, param.log);
                                    const buttonDefaultValue = Util.formatValueForButton(param.defaultValue, param.paramId, param.min, param.max, param.log);
                                    const accentColor = param.hue ? `hsl(${param.hue},100%, 60%)` : '#ccc';
                                    return (
                                        <div key={param.paramId} id={param.paramId} className={`group-param`}>
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
                                {/* <div className="group-name">{bandKey}</div> */}
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
   /*  return (
        <div id="bandsBlock">
           {manifest.parameters.filter(param => param.paramId.startsWith("bands")).map(param => {
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
    ) */
}


export default React.memo(BandsBlock);