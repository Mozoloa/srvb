import React from 'react';
import ScaledMeter from '../elements/ScaledMeter.jsx';
import * as Util from '../Utilities.js';
import ValueCtrl from '../elements/ValueCtrl.jsx';
import XoverGraph from '../elements/XoverGraph.jsx';

function BandsBlock({ props, manifest, paramValues, handleValueChange }) {
    return (
        <div id="bandsBlock">
            <div id="bandsBox">
                {["Low", "LowMid", "Mid", "HighMid", "High"].map((bandKey, index) => {
                    return (
                        <div key={bandKey} id={bandKey} className={`band group-container`}>
                            <div className="band-meter-block">

                            </div>
                            <div className="band-ctrls">
                                {manifest.parameters.filter(param => (param.paramId.startsWith("bands") && param.paramId.includes("_" + bandKey.toLowerCase() + "_"))).map(param => {
                                    const buttonValue = Util.formatValueForButton(paramValues[param.paramId], param.paramId, param.min, param.max, param.log);
                                    const buttonDefaultValue = Util.formatValueForButton(param.defaultValue, param.paramId, param.min, param.max, param.log);
                                    const accentColor = param.hue ? `hsl(${param.hue},100%, 60%)` : '#ccc';
                                    return (
                                        <div key={param.paramId} id={param.paramId} className={`group-param`}>
                                            <ValueCtrl
                                                value={buttonValue}
                                                actualValue={paramValues[param.paramId]}
                                                defaultValue={buttonDefaultValue}
                                                onChange={(newValue) => handleValueChange(param, newValue)}
                                                name={param.name}
                                                paramId={param.paramId}
                                                accentColor={accentColor}
                                            />
                                            <div className='knob-name'>{param.paramId.endsWith("threshold") ? "Tresh." : "Gain"}</div>
                                        </div>

                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div id="xovers">
                {["lowlowmid", "lowmidmid", "midhighmid", "highmidhigh"].map(xoverKey => {
                    return (
                        <div key={xoverKey}>
                            {manifest.parameters.filter(param => (param.paramId.startsWith("bands") && param.paramId.includes(xoverKey))).map(param => {
                                const buttonValue = Util.formatValueForButton(paramValues[param.paramId], param.paramId, param.min, param.max, param.log);
                                const buttonDefaultValue = Util.formatValueForButton(param.defaultValue, param.paramId, param.min, param.max, param.log);
                                const accentColor = param.hue ? `hsl(${param.hue},100%, 60%)` : '#ccc';
                                return (
                                    <div key={param.paramId} id={param.paramId} className={`group-param`}>
                                        <ValueCtrl
                                            value={buttonValue}
                                            actualValue={paramValues[param.paramId]}
                                            defaultValue={buttonDefaultValue}
                                            onChange={(newValue) => handleValueChange(param, newValue)}
                                            name={param.name}
                                            paramId={param.paramId}
                                            accentColor={accentColor}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
                )}
            </div>
            <XoverGraph
                lowlowmid={paramValues['bands_lowlowmid_xover']}
                lowmidmid={paramValues['bands_lowmidmid_xover']}
                midhighmid={paramValues['bands_midhighmid_xover']}
                highmidhigh={paramValues['bands_highmidhigh_xover']}
            />
        </div>

    )
}


export default React.memo(BandsBlock);