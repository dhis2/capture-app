// @flow
import React from 'react';
import { Validators } from '@dhis2/d2-ui-forms';
import DataEntry from 'capture-core/components/DataEntry/DataEntry.container';
// import withCompleteButton from 'capture-core/components/DataEntry/withCompleteButton';
import withSaveButton from 'capture-core/components/DataEntry/withSaveButton';

import withEventField from 'capture-core/components/DataEntry/eventField/withEventField';

import D2Date from 'capture-core/components/FormFields/DateAndTime/D2Date/D2Date.component';
import D2TrueOnly from 'capture-core/components/FormFields/Generic/D2TrueOnly.component';
import withDefaultMessages from 'capture-core/components/DataEntry/eventField/withDefaultMessages';
import withDefaultFieldContainer from 'capture-core/components/DataEntry/eventField/withDefaultFieldContainer';
import withDefaultChangeHandler from 'capture-core/components/DataEntry/eventField/withDefaultChangeHandler';
import QuickSelector from 'capture-core/components/QuickSelector/QuickSelector.component';
import withDefaultShouldUpdateInterface from
    'capture-core/components/DataEntry/eventField/withDefaultShouldUpdateInterface';
import isValidDate from 'capture-core/utils/validators/date.validator';
import { placements } from 'capture-core/components/DataEntry/eventField/eventField.const';

import i18n from '@dhis2/d2-i18n';

const getSaveOptions = () => ({
    color: 'primary',
});

const preValidateDate = (value?: ?string) => {
    if (!value) {
        return true;
    }

    return isValidDate(value);
};

const buildReportDateSettingsFn = () => {
    const reportDateComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(D2Date),
            ),
        ),
    );

    const reportDateSettings = () => ({
        component: reportDateComponent,
        componentProps: {
            width: 350,
            label: 'Report date',
            required: true,
        },
        propName: 'eventDate',
        validatorContainers: [
            {
                validator: Validators.wordToValidatorMap.get('required'),
                message:
                    i18n.t(Validators.wordToValidatorMap.get('required').message),
            },
            {
                validator: preValidateDate,
                message: i18n.t('Please provide a valid date'),
            },
        ],
    });

    return reportDateSettings;
};

const buildCompleteFieldSettingsFn = () => {
    const completeComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(D2TrueOnly),
            ),
        ),
    );

    const completeSettings = () => ({
        component: completeComponent,
        componentProps: {
            label: 'Complete event',
        },
        propName: 'complete',
        validatorContainers: [
        ],
        meta: {
            placement: placements.BOTTOM,
        },
    });

    return completeSettings;
};

const DataEntryWithReportDate = withEventField(buildReportDateSettingsFn())(DataEntry);
const DataEntryWithReportDateAndCompleteField = withEventField(buildCompleteFieldSettingsFn())(DataEntryWithReportDate);
const SaveableDataEntry = withSaveButton(getSaveOptions)(DataEntryWithReportDateAndCompleteField);


type Props = {
    onLoadEvent: (eventId: string) => void,
};

export default (props: Props) => (
    <div>
        <QuickSelector />
        <br />
        <button
            onClick={() => { props.onLoadEvent('dcDICb4mZ5x'); }}
        >
        program1 event1
        </button>
        <button
            onClick={() => { props.onLoadEvent('GLzj6nka7Ae'); }}
        >
        program1 event2
        </button>
        <button
            onClick={() => { props.onLoadEvent('TB1aevraoff'); }}
        >
        program2 event1
        </button>

        <SaveableDataEntry
            id={'main'}
        />
    </div>
);
