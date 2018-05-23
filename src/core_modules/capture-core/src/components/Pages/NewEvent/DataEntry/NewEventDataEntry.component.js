// @flow
import React, { Component } from 'react';
import { Validators } from '@dhis2/d2-ui-core';
import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withSaveButton from '../../../../components/DataEntry/withSaveButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import { placements } from '../../../../components/DataEntry/dataEntryField/dataEntryField.const';
import isValidDate from '../../../../utils/validators/date.validator';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

import D2Date from '../../../../components/FormFields/DateAndTime/D2Date/D2Date.component';
import D2TrueOnly from '../../../../components/FormFields/Generic/D2TrueOnly.component';
import withDefaultMessages from '../../../../components/DataEntry/dataEntryField/withDefaultMessages';
import withDefaultFieldContainer from '../../../../components/DataEntry/dataEntryField/withDefaultFieldContainer';
import withDefaultChangeHandler from '../../../../components/DataEntry/dataEntryField/withDefaultChangeHandler';
import withDefaultShouldUpdateInterface from
    '../../../../components/DataEntry/dataEntryField/withDefaultShouldUpdateInterface';

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
                    getTranslation(
                        Validators.wordToValidatorMap.get('required').message,
                        formatterOptions.CAPITALIZE_FIRST_LETTER),
            },
            {
                validator: preValidateDate,
                message: getTranslation('value_should_be_a_valid_date', formatterOptions.CAPITALIZE_FIRST_LETTER),
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

const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(DataEntry);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
const SaveableDataEntry = withSaveButton(getSaveOptions)(CompleteField);

type Props = {
    formFoundation: ?RenderFoundation,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
};

class NewEventDataEntry extends Component<Props> {
    render() {
        const { formFoundation, onUpdateField, onSave } = this.props;
        return (
            <div>
                <SaveableDataEntry
                    id={'singleEvent'}
                    formFoundation={formFoundation}
                    onUpdateField={onUpdateField}
                    onSave={onSave}
                />
            </div>
        );
    }
}


export default NewEventDataEntry;
