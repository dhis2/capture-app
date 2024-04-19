// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { withStyles, withTheme } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { DataEntry as DataEntryContainer } from '../../DataEntry/DataEntry.container';
import { withDataEntryField } from '../../DataEntry/dataEntryField/withDataEntryField';
import { withDataEntryNotesHandler } from '../../DataEntry/dataEntryNotes/withDataEntryNotesHandler';
import { Notes } from '../../Notes/Notes.component';
import { getEventDateValidatorContainers } from './fieldValidators/eventDate.validatorContainersGetter';
import { type RenderFoundation, type ProgramStage } from '../../../metaData';
import { getNoteValidatorContainers } from './fieldValidators/note.validatorContainersGetter';
import {
    placements,
    withCleanUp,
} from '../../DataEntry';
import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    DateField,
    CoordinateField,
    PolygonField,
    withCalculateMessages,
    withDisplayMessages,
    withFilterProps,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    orientations,
    VirtualizedSelectField,
} from '../../FormFields/New';
import { Assignee } from './Assignee';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { addEventSaveTypes } from './addEventSaveTypes';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { withDataEntryFieldIfApplicable } from '../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import { withTransformPropName } from '../../../HOC';
import {
    AOCsectionKey,
    withAOCFieldBuilder,
    withDataEntryFields,
    attributeOptionsKey,
    getCategoryOptionsValidatorContainers,
} from '../../DataEntryDhis2Helpers';

const getStyles = theme => ({
    savingContextContainer: {
        paddingTop: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.grey.dark,
        fontSize: theme.typography.pxToRem(13),
    },
    savingContextText: {
        paddingLeft: theme.typography.pxToRem(10),
    },
    savingContextNames: {
        fontWeight: 'bold',
    },
    topButtonsContainer: {
        display: 'flex',
        flexFlow: 'row-reverse',
    },
    horizontal: {
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(20),
        paddingBottom: theme.typography.pxToRem(15),
    },
    fieldLabelMediaBased: {
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

const dataEntrySectionNames = {
    BASICINFO: 'BASICINFO',
    STATUS: 'STATUS',
    COMMENTS: 'COMMENTS',
    RELATIONSHIPS: 'RELATIONSHIPS',
    ASSIGNEE: 'ASSIGNEE',
};

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


function defaultFilterProps(props: Object) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getBaseComponentProps = (props: Object) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

const buildReportDateSettingsFn = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(DateField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const reportDateSettings = {
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.formFoundation.getLabel('occurredAt'),
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
        }),
        getPropName: () => 'occurredAt',
        getValidatorContainers: () => getEventDateValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
};

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(CoordinateField),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

const polygonComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(PolygonField),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

const getOrientation = (formHorizontal: ?boolean) => (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);


const buildGeometrySettingsFn = () => ({
    isApplicable: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }
        return pointComponent;
    },
    getComponentProps: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
                orgUnit: props.orgUnit,
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: 'Coordinate',
            dialogLabel: 'Coordinate',
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
            orgUnit: props.orgUnit,
        });
    },
    getPropName: () => 'geometry',
    getValidatorContainers: () => [],
    getMeta: () => ({
        placement: placements.TOP,
        section: dataEntrySectionNames.BASICINFO,
    }),
});

const buildNotesSettingsFn = () => {
    const noteComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(
                                withDataEntryNotesHandler()(Notes),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const notesSettings = {
        getComponent: () => noteComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: 'Comments',
            onAddNote: props.onAddNote,
            id: 'comments',
            dataEntryId: props.id,
        }),
        getPropName: () => 'note',
        getValidatorContainers: () => getNoteValidatorContainers(),
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.COMMENTS,
        }),
    };

    return notesSettings;
};

const buildAssigneeSettingsFn = () => {
    const assigneeComponent =
        withTransformPropName(['onBlur', 'onSet'])(
            withFocusSaver()(
                withFilterProps((props: Object) => {
                    const defaultFiltred = defaultFilterProps(props);
                    const { validationAttempted, touched, ...passOnProps } = defaultFiltred;
                    return passOnProps;
                })(Assignee),
            ),
        );

    return {
        isApplicable: (props: Object) => {
            const enableUserAssignment = props.stage && props.stage.enableUserAssignment;
            return !!enableUserAssignment;
        },
        getComponent: () => assigneeComponent,
        getComponentProps: (props: Object) => createComponentProps({}, {
            orientation: getOrientation(props.formHorizontal),
        }),
        getPropName: () => 'assignee',
        getValidatorContainers: () => [],
        getMeta: () => ({
            section: dataEntrySectionNames.ASSIGNEE,
        }),
    };
};

const getCategoryOptionsSettingsFn = () => {
    const categoryOptionsComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.selectLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(VirtualizedSelectField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const categoryOptionsSettings = {
        getComponent: () => categoryOptionsComponent,
        getComponentProps: (props: Object, fieldId: string) => createComponentProps(props, {
            ...props.categories?.find(category => category.id === fieldId) ?? {},
            required: true,
        }),
        getPropName: (props: Object, fieldId?: string) => (fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey),
        getFieldIds: (props: Object) => props.categories?.map(category => category.id),
        getValidatorContainers: (props: Object, fieldId?: string) => getCategoryOptionsValidatorContainers(props, fieldId),
        getMeta: (props: Object) => ({
            section: AOCsectionKey,
            placement: placements.TOP,
            sectionName: props.programCategory?.displayName,
        }),
    };

    return categoryOptionsSettings;
};


const dataEntryFilterProps = (props: Object) => {
    const { stage, onScrollToRelationships, recentlyAddedRelationshipId, relationshipsRef, ...passOnProps } = props;
    return passOnProps;
};

const WrappedDataEntry = compose(
    withAOCFieldBuilder({}),
    withDataEntryFields(getCategoryOptionsSettingsFn()),
    withDataEntryField(buildReportDateSettingsFn()),
    withDataEntryFieldIfApplicable(buildGeometrySettingsFn()),
    withDataEntryField(buildNotesSettingsFn()),
    withDataEntryFieldIfApplicable(buildAssigneeSettingsFn()),
    withCleanUp(),
    withFilterProps(dataEntryFilterProps),
)(DataEntryContainer);

type Props = {
    id: string,
    orgUnitId: string,
    programId: string,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSetSaveTypes: (saveTypes: ?Array<$Values<typeof addEventSaveTypes>>) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, completed?: boolean) => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    classes: {
        savingContextContainer: string,
        savingContextText: string,
        savingContextNames: string,
        topButtonsContainer: string,
        horizontalPaper: string,
        fieldLabelMediaBased: string,
        horizontal: string,
    },
    theme: Theme,
    formHorizontal: ?boolean,
    recentlyAddedRelationshipId?: ?string,
};
type DataEntrySection = {
    placement: $Values<typeof placements>,
    name: string,
};

const dataEntrySectionDefinitions = {
    [dataEntrySectionNames.BASICINFO]: {
        placement: placements.TOP,
        name: i18n.t('Basic info'),
    },
    [dataEntrySectionNames.STATUS]: {
        placement: placements.BOTTOM,
        name: i18n.t('Status'),
    },
    [dataEntrySectionNames.COMMENTS]: {
        placement: placements.BOTTOM,
        name: i18n.t('Comments'),
    },
    [dataEntrySectionNames.RELATIONSHIPS]: {
        placement: placements.BOTTOM,
        name: i18n.t('Relationships'),
    },
    [dataEntrySectionNames.ASSIGNEE]: {
        placement: placements.BOTTOM,
        name: i18n.t('Assignee'),
    },
    [AOCsectionKey]: {
        placement: placements.TOP,
        name: '',
    },
};
class DataEntryPlain extends Component<Props> {
    fieldOptions: { theme: Theme };
    dataEntrySections: { [$Values<typeof dataEntrySectionNames>]: DataEntrySection };
    relationshipsInstance: ?HTMLDivElement;

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
    }

    UNSAFE_componentWillMount() {
        this.props.onSetSaveTypes(null);
    }

    componentDidMount() {
        if (this.relationshipsInstance && this.props.recentlyAddedRelationshipId) {
            this.relationshipsInstance.scrollIntoView();
            // $FlowFixMe[prop-missing] automated comment
            this.props.onScrollToRelationships();
        }
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    setRelationshipsInstance = (instance: ?HTMLDivElement) => {
        this.relationshipsInstance = instance;
    }

    render() {
        const {
            onUpdateField,
            onStartAsyncUpdateField,
            classes,
            onSave,
            onSetSaveTypes,
            theme,
            id,
            ...passOnProps
        } = this.props;
        return (
            <div data-test="new-enrollment-event-form">
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <WrappedDataEntry
                    id={id}
                    onUpdateFormField={onUpdateField}
                    onUpdateFormFieldAsync={onStartAsyncUpdateField}
                    fieldOptions={this.fieldOptions}
                    dataEntrySections={this.dataEntrySections}
                    relationshipsRef={this.setRelationshipsInstance}
                    {...passOnProps}
                />
            </div>
        );
    }
}


export const DataEntryComponent =
    withStyles(getStyles)(withTheme()(DataEntryPlain));
