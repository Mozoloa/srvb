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
    if (paramId.includes('freq') || paramId.includes('xover')) {

        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return `${Math.round(value)}`;
    }
    if (paramId.includes('order')) {
        if (value > 0) {
            return parseInt(value) * 24;
        }
        return "OFF"
    }
    if (paramId.includes('env')) {
        return `${Math.round(value * 10) / 10}ms`
    }
    if (paramId.includes('drywet')) {
        return `${Math.round(value * 100)}%`
    }
    if (paramId.includes('ratio')) {
        return `${Math.round(value * 10) / 10}:1`
    }
    if (paramId.includes('Gain') || paramId.includes('gain') || paramId.includes('knee') || paramId.includes('threshold')) {
        return `${Math.round(value * 10) / 10}dB`
    }

    // For other cases, round to one decimal place
    return Math.round(value * 10) / 10;
};

export { formatValueForButton, formatValueFromButton, formatValueForDisplay };