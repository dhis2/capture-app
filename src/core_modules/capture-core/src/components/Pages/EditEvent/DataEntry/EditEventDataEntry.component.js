// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withSaveButton from '../../../../components/DataEntry/withSaveButton';
import withCancelButton from '../../../../components/DataEntry/withCancelButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import { placements } from '../../../../components/DataEntry/dataEntryField/dataEntryField.const';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

import D2Date from '../../../../components/FormFields/DateAndTime/D2Date/D2Date.component';
import D2Coordinate from '../../../../components/FormFields/CoordinateField/CoordinateField.component';
import D2Polygon from '../../../../components/FormFields/PolygonField/PolygonField.component';
import D2TrueOnly from '../../../../components/FormFields/Generic/D2TrueOnly.component';
import D2TextField from '../../../../components/FormFields/Generic/D2TextField.component';
import withDefaultMessages from '../../../../components/DataEntry/dataEntryField/withDefaultMessages';
import withDefaultFieldContainer from '../../../../components/DataEntry/dataEntryField/withDefaultFieldContainer';
import withDefaultChangeHandler from '../../../../components/DataEntry/dataEntryField/withDefaultChangeHandler';
import withDefaultShouldUpdateInterface from
    '../../../../components/DataEntry/dataEntryField/withDefaultShouldUpdateInterface';
import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withNotes from '../../../DataEntry/withNotes';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withFeedbackOutput from '../../../DataEntry/dataEntryOutput/withFeedbackOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';

const getStyles = () => ({
});

const getSaveOptions = () => ({
    color: 'primary',
});

const getCancelOptions = () => ({
    color: 'primary',
});

const buildNoteFieldSettingsFn = () => {
    const noteFieldComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(D2TextField),
            ),
        ),
    );

    const noteFieldSettings = (props: Object) => ({
        component: noteFieldComponent,
        componentProps: {
            label: props.formFoundation.getLabel('New comment'),
        },
        propName: 'note',
    });

    return noteFieldSettings;
};

const buildReportDateSettingsFn = () => {
    const reportDateComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(D2Date),
            ),
        ),
    );

    const reportDateSettings = (props: Object) => ({
        component: reportDateComponent,
        componentProps: {
            width: 350,
            label: props.formFoundation.getLabel('eventDate'),
            required: true,
        },
        propName: 'eventDate',
        validatorContainers: getEventDateValidatorContainers(),
    });

    return reportDateSettings;
};

const buildCoordinateSettingsFn = () => (props: Object) => {
    const type = props.formFoundation.featureType;

    if (type === 'Point') {
        return {
            component: withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDefaultMessages()(
                        withDefaultChangeHandler()(D2Coordinate),
                    ),
                ),
            ),
            componentProps: {
                width: props && props.formHorizontal ? 150 : 350,
                label: 'Coordinate(s)',
                required: false,
            },
            propName: 'coordinate',
        };
    } else if (type === 'Polygon') {
        return {
            component: withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDefaultMessages()(
                        withDefaultChangeHandler()(D2Polygon),
                    ),
                ),
            ),
            componentProps: {
                width: props && props.formHorizontal ? 150 : 500,
                label: 'Location',
                required: false,
            },
            propName: 'coordinate',
        };
    }

    return null;
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
const CoordinateField = withDataEntryField(buildCoordinateSettingsFn())(ReportDateField);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(CoordinateField);
const FeedbackOutput = withFeedbackOutput()(CompleteField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const SaveableDataEntry = withSaveButton(getSaveOptions)(ErrorOutput);
const NotesDataEntry = withNotes(buildNoteFieldSettingsFn)(SaveableDataEntry);
const CancelableDataEntry = withCancelButton(getCancelOptions)(NotesDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onCancel: () => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
};

class NewEventDataEntry extends Component<Props> {
    componentWillUnmount() {
        inMemoryFileStore.clear();
    }
    render() {
        const {
            formFoundation,
            onUpdateField,
            onAddNote,
            onSave,
            onCancel,
            onStartAsyncUpdateField,
        } = this.props;
        return (
            <div>
                <div>
                    <CancelableDataEntry
                        id={'singleEvent'}
                        formFoundation={formFoundation}
                        onUpdateFormField={onUpdateField}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField}
                        onCancel={onCancel}
                        onSave={onSave}
                        onAddNote={onAddNote}
                    />
                </div>
            </div>
        );
    }
}


export default withStyles(getStyles)(NewEventDataEntry);
