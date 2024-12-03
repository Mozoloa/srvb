import React, { useEffect, useRef } from 'react';
import DragBehavior from '../DragBehavior';
import * as Util from '../Utilities.js';

function ValueCTRL({ name, paramId, onChange, value, actualValue, defaultValue, accentColor }) {
  const divRef = useRef(); // Reference for the div element

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleDoubleClick = () => {
    handleChange(defaultValue);
  };

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener('dblclick', handleDoubleClick);
    }
    return () => {
      if (div) {
        div.removeEventListener('dblclick', handleDoubleClick);
      }
    };
  }, [defaultValue]); // Dependencies include only `defaultValue` since the listener logic depends on it

  return (
    <DragBehavior onChange={handleChange} value={value} name={paramId}>
      <div
        ref={divRef}
        className="param-value"
        style={{ color: accentColor, cursor: 'pointer' }} // Added cursor style for better UX
      >
        {Util.formatValueForDisplay(actualValue, paramId)}
      </div>
    </DragBehavior>
  );
}

export default React.memo(ValueCTRL);
