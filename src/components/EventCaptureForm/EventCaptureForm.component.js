// @flow
import React, { Component } from 'react';
import { wordToValidatorMap } from 'd2-ui/lib/forms/Validators';
import DataEntry from 'capture-core/components/DataEntry/DataEntry.container';
import withCompleteButton from 'capture-core/components/DataEntry/withCompleteButton';
import withSaveButton from 'capture-core/components/DataEntry/withSaveButton';

import withEventField from 'capture-core/components/DataEntry/eventField/withEventField';

import D2Date from 'capture-core/components/FormFields/DateAndTime/D2Date/D2Date.component';
import withDefaultMessages from 'capture-core/components/DataEntry/eventField/withDefaultMessages';
import withDefaultFieldContainer from 'capture-core/components/DataEntry/eventField/withDefaultFieldContainer';
import withDefaultChangeHandler from 'capture-core/components/DataEntry/eventField/withDefaultChangeHandler';
import withDefaultShouldUpdateInterface from 'capture-core/components/DataEntry/eventField/withDefaultShouldUpdateInterface';
import isValidDate from 'capture-core/utils/validators/date.validator';
import { getTranslation } from 'capture-core/d2/d2Instance';
import { formatterOptions } from 'capture-core/utils/string/format.const';

const getCompleteOptions = () => ({
    color: 'primary',
});

const getSaveOptions = () => ({
    color: 'accent',
});

function preValidateDate(value?: ?string) {
    if (!value) {
        return true;
    }

    return isValidDate(value);
}

const comp = withDefaultFieldContainer()(withDefaultShouldUpdateInterface()(withDefaultMessages()(withDefaultChangeHandler()(D2Date))));
const eventDateSettings = props => ({
    component: comp,
    componentProps: {
        width: 350,
        label: 'Report date',
        required: true,
    },
    propName: 'eventDate',
    validatorContainers: [
        {
            validator: wordToValidatorMap.get('required'),
            message: getTranslation(wordToValidatorMap.get('required').message, formatterOptions.CAPITALIZE_FIRST_LETTER),
        },
        {
            validator: preValidateDate,
            message: getTranslation('value_should_be_a_valid_date', formatterOptions.CAPITALIZE_FIRST_LETTER),
        },
    ],
});

const DataEntryWithEventDate = withEventField(eventDateSettings)(DataEntry);
const CompletableDataEntry = withCompleteButton(getCompleteOptions)(DataEntryWithEventDate);
const SaveableAndCompletableDataEntry = withSaveButton(getSaveOptions)(CompletableDataEntry);

export default props => (
    <div>
        <SaveableAndCompletableDataEntry
            id={'main'}
        />
    </div>
);
