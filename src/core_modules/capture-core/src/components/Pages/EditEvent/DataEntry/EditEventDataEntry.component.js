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

import D2TextField from '../../../../components/FormFields/Generic/D2TextField.component';
import withDefaultFieldContainer from '../../../D2Form/field/withDefaultFieldContainer';
import { withInternalChangeHandler, withLabel, withFocusSaver, DateField, TrueOnlyField, withCalculateMessages, withDisplayMessages } from '../../../FormFields/New';
import withDefaultShouldUpdateInterface from
    '../../../D2Form/field/withDefaultShouldUpdateInterface';
import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withNotes from '../../../DataEntry/withNotes';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withFeedbackOutput from '../../../DataEntry/dataEntryOutput/withFeedbackOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import labelTypeClasses from './dataEntryFieldLabels.mod.css';

const getStyles = (theme: Theme) => ({
    dataEntryContainer: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: theme.typography.pxToRem(2),
        padding: theme.typography.pxToRem(20),
    },
});

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};


const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const getSaveOptions = () => ({
    color: 'primary',
});

const getCancelOptions = () => ({
    color: 'primary',
});

const buildNoteFieldSettingsFn = () => {
    const getNoteComponent = (props: Object) =>
        withCalculateMessages()(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: () => props.formHorizontal,
                            onGetCustomFieldLabeClass: () =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.noteLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(D2TextField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    let component = null;
    const noteFieldSettings = (props: Object) => {
        component = component || getNoteComponent(props);
        return {
            component,
            componentProps: {
                label: props.formFoundation.getLabel('New comment'),
                styles: baseComponentStyles,
            },
            propName: 'note',
        };
    };

    return noteFieldSettings;
};

const buildReportDateSettingsFn = () => {
    const getReportDateComponent = (props: Object) =>
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: () => props.formHorizontal,
                            onGetCustomFieldLabeClass: () =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(DateField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    let component = null;
    const reportDateSettings = (props: Object) => {
        component = component || getReportDateComponent(props);
        return {
            component,
            componentProps: {
                width: 350,
                label: props.formFoundation.getLabel('eventDate'),
                required: true,
                styles: baseComponentStyles,
            },
            propName: 'eventDate',
            validatorContainers: getEventDateValidatorContainers(),
        };
    };

    return reportDateSettings;
};

const buildCompleteFieldSettingsFn = () => {
    const getCompleteComponent = (props: Object) =>
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: () => props.formHorizontal,
                            onGetCustomFieldLabeClass: () =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(TrueOnlyField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    let component = null;
    const completeSettings = (props: Object) => {
        component = component || getCompleteComponent(props);
        return {
            component,
            componentProps: {
                label: 'Complete event',
                styles: baseComponentStyles,
            },
            propName: 'complete',
            validatorContainers: [
            ],
            meta: {
                placement: placements.BOTTOM,
            },
        };
    };

    return completeSettings;
};

const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(DataEntry);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
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
    classes: {
        dataEntryContainer: string,
    },
};

class EditEventDataEntry extends Component<Props> {
    fieldOptions: { theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
    }
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
            classes,
        } = this.props;
        return (
            <div className={classes.dataEntryContainer}>
                <CancelableDataEntry
                    id={'singleEvent'}
                    formFoundation={formFoundation}
                    onUpdateFormField={onUpdateField}
                    onUpdateFormFieldAsync={onStartAsyncUpdateField}
                    onCancel={onCancel}
                    onSave={onSave}
                    onAddNote={onAddNote}
                    fieldOptions={this.fieldOptions}
                />
            </div>
        );
    }
}


export default withStyles(getStyles)(EditEventDataEntry);
