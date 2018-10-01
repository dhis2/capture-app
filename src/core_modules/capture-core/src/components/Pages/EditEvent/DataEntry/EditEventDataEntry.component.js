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

import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    DateField,
    TrueOnlyField,
    CoordinateField,
    PolygonField,
    withCalculateMessages,
    withDisplayMessages,
} from '../../../FormFields/New';

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

const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
};

const getSaveOptions = () => ({
    color: 'primary',
});

const getCancelOptions = () => ({
    color: 'primary',
});

const getBaseComponentProps = (props: Object) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const buildNoteFieldSettingsFn = () => {
    const noteComponent =
        withCalculateMessages()(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
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
    const noteFieldSettings = (props: Object) => ({
        component: noteComponent,
        componentProps: createComponentProps(props, {
            label: props.formFoundation.getLabel('New comment'),
        }),
        propName: 'note',
    });

    return noteFieldSettings;
};

const buildReportDateSettingsFn = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
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
    const reportDateSettings = (props: Object) => ({
        component: reportDateComponent,
        componentProps: createComponentProps(props, {
            width: 350,
            label: props.formFoundation.getLabel('eventDate'),
            required: true,
        }),
        propName: 'eventDate',
        validatorContainers: getEventDateValidatorContainers(),
    });

    return reportDateSettings;
};

const buildGeometrySettingsFn = () => {
    const getComponentByFeatureType = {
        Point: () =>
            withCalculateMessages(overrideMessagePropNames)(
                withFocusSaver()(
                    withDefaultFieldContainer()(
                        withDefaultShouldUpdateInterface()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                            })(
                                withDisplayMessages()(
                                    withInternalChangeHandler()(CoordinateField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        Polygon: () =>
            withCalculateMessages(overrideMessagePropNames)(
                withFocusSaver()(
                    withDefaultFieldContainer()(
                        withDefaultShouldUpdateInterface()(
                            withLabel({
                                onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
                            })(
                                withDisplayMessages()(
                                    withInternalChangeHandler()(PolygonField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
    };
    let selectedComponent = null;
    const geometrySettings = (props: Object) => {
        selectedComponent = selectedComponent || getComponentByFeatureType[props.formFoundation.featureType]();
        const label = props.formFoundation.featureType === 'Point' ? 'Coordinate' : 'Location';
        return {
            component: selectedComponent,
            componentProps: createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label,
                required: false,
            }),
            propName: 'geometry',
            validatorContainers: [
            ],
            meta: {
                placement: placements.TOP,
            },
        };
    };
    return geometrySettings;
};

const buildCompleteFieldSettingsFn = () => {
    const completeComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
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
    const completeSettings = (props: Object) => ({
        component: completeComponent,
        componentProps: createComponentProps(props, {
            label: 'Complete event',
        }),
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
const GeometryField = withDataEntryField(buildGeometrySettingsFn())(ReportDateField);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(GeometryField);
const FeedbackOutput = withFeedbackOutput()(CompleteField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const SaveableDataEntry = withSaveButton(getSaveOptions)(ErrorOutput);
const NotesDataEntry = withNotes()(SaveableDataEntry);
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
        fieldLabelMediaBased?: ?string,
    },
    theme: any,
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
