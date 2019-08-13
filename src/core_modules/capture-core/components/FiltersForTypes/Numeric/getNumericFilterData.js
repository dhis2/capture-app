// @flow
import i18n from '@dhis2/d2-i18n';

type Value = {
    min?: ?string,
    max?: ?string,
}

const getRequestData = (value: Value) => {
    const requestData = [];

    if (value.min) {
        requestData.push(`ge:${value.min}`);
    }
    if (value.max) {
        requestData.push(`le:${value.max}`);
    }

    if (requestData.length === 2) {
        return requestData.join(':');
    }

    return requestData[0];
};

const getAppliedText = (value: Value) => {
    let appliedText = '';

    if (value.min && value.max) {
        if (Number(value.min) === Number(value.max)) {
            appliedText = value.min;
        } else {
            // $FlowSuppress
            appliedText = `${value.min} ${i18n.t('to')} ${value.max}`;
        }
    } else if (value.min) {
        // $FlowSuppress
        appliedText = `${i18n.t('greater than or equal to')} ${value.min}`;
    } else {
        // $FlowSuppress
        appliedText = `${i18n.t('less than or equal to')} ${value.max}`;
    }

    return appliedText;
};

export default function (value: Value) {
    return {
        requestData: getRequestData(value),
        appliedText: getAppliedText(value),
    };
}
