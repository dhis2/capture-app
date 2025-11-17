import React, { type ComponentType, Component } from 'react';
import { compose } from 'redux';
import type { WithStyles } from 'capture-core-utils/styles';
import { withStyles, withTheme } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { DataEntry as DataEntryContainer } from '../../DataEntry/DataEntry.container';
import { withDataEntryField } from '../../DataEntry/dataEntryField/withDataEntryField';
import { withDataEntryNotesHandler } from '../../DataEntry/dataEntryNotes/withDataEntryNotesHandler';
import { Notes } from '../../Notes/Notes.component';
import {
    getEventDateValidatorContainers,
    getOrgUnitValidatorContainers,
    getNoteValidatorContainers,
} from './fieldValidators';
import { type RenderFoundation, type ProgramStage } from '../../../metaData';
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
    SingleOrgUnitSelectField,
} from '../../FormFields/New';
import { Assignee } from './Assignee';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { SavingText } from '../SavingText';
import type { AddEventSaveType } from './addEventSaveTypes';
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
import { systemSettingsStore } from '../../../metaDataMemoryStores';

const getStyles = (theme: any) => ({
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
        '@media (max-width: 523px)': {
            paddingTop: '0px !important',
        },
    },
}) as const;

const dataEntrySectionNames = {
    BASICINFO: 'BASICINFO',
    STATUS: 'STATUS',
    NOTES: 'NOTES',
    RELATIONSHIPS: 'RELATIONSHIPS',
    ASSIGNEE: 'ASSIGNEE',
} as const;

const overrideMessagePropNames = {
    errorMessage: 'validationError',
} as const;

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
} as const;
const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
} as const;

function defaultFilterProps(props: any) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getBaseComponentProps = (props: any) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: any, componentProps: any) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const getCalendarAnchorPosition = (formHorizontal?: boolean) => (formHorizontal ? 'center' : 'left');
const getOrientation = (formHorizontal?: boolean) => (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);

const buildReportDateSettingsFn = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
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
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.formFoundation.getLabel('occurredAt'),
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            orientation: getOrientation(props.formHorizontal),
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarType: systemSettingsStore.get().calendar,
            dateFormat: systemSettingsStore.get().dateFormat,
        }),
        getPropName: () => 'occurredAt',
        getValidatorContainers: (props: any) => getEventDateValidatorContainers(props),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
};

const buildOrgUnitSettingsFn = () => {
    const orgUnitComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.orgUnitLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(SingleOrgUnitSelectField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );

    const orgUnitSettings = {
        getComponent: () => orgUnitComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Organisation unit'),
            required: true,
        }),
        getPropName: () => 'orgUnit',
        getValidatorContainers: () => getOrgUnitValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return orgUnitSettings;
};


const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: any) =>
                        `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
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
                    onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: any) =>
                        `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
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

const buildGeometrySettingsFn = () => ({
    isApplicable: (props: any) => {
        const featureType = props.formFoundation.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: any) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }
        return pointComponent;
    },
    getComponentProps: (props: any) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
                orgUnitId: props.orgUnitIdFieldValue,
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
            orgUnitId: props.orgUnitIdFieldValue,
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
        getComponentProps: (props: any) => createComponentProps(props, {
            label: i18n.t('Notes'),
            onAddNote: props.onAddNote,
            id: 'notes',
            dataEntryId: props.id,
        }),
        getPropName: () => 'note',
        getValidatorContainers: () => getNoteValidatorContainers(),
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.NOTES,
        }),
    };

    return notesSettings;
};

const buildAssigneeSettingsFn = () => {
    const assigneeComponent =
        withTransformPropName(['onBlur', 'onSet'])(
            withFocusSaver()(
                withFilterProps((props: any) => {
                    const defaultfiltered = defaultFilterProps(props);
                    const { validationAttempted, touched, ...passOnProps } = defaultfiltered;
                    return passOnProps;
                })(Assignee),
            ),
        );

    return {
        isApplicable: (props: any) => {
            const enableUserAssignment = props.stage && props.stage.enableUserAssignment;
            return !!enableUserAssignment;
        },
        getComponent: () => assigneeComponent,
        getComponentProps: (props: any) => createComponentProps({}, {
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
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
                                `${props.fieldOptions &&
                                    props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.selectLabel}`,
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
        getComponentProps: (props: any, fieldId: string) => createComponentProps(props, {
            ...props.categories?.find((category: any) => category.id === fieldId) ?? {},
            required: true,
        }),
        getPropName: (props: any, fieldId?: string) => (fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey),
        getFieldIds: (props: any) => props.categories?.map((category: any) => category.id),
        getValidatorContainers: (props: any, fieldId?: string) => getCategoryOptionsValidatorContainers(props, fieldId),
        getMeta: (props: any) => ({
            section: AOCsectionKey,
            placement: placements.TOP,
            sectionName: props.programCategory?.displayName,
        }),
    };

    return categoryOptionsSettings;
};


const dataEntryFilterProps = (props: any) => {
    const {
        stage,
        onScrollToRelationships,
        recentlyAddedRelationshipId,
        relationshipsRef,
        orgUnitIdFieldValue,
        ...passOnProps
    } = props;
    return passOnProps;
};

const WrappedDataEntry = compose(
    withAOCFieldBuilder({}),
    withDataEntryFields(getCategoryOptionsSettingsFn()),
    withDataEntryField(buildReportDateSettingsFn()),
    withDataEntryField(buildOrgUnitSettingsFn()),
    withDataEntryFieldIfApplicable(buildGeometrySettingsFn()),
    withDataEntryField(buildNotesSettingsFn()),
    withDataEntryFieldIfApplicable(buildAssigneeSettingsFn()),
    withCleanUp(),
    withFilterProps(dataEntryFilterProps),
)(DataEntryContainer) as ComponentType<any>;

type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

type Props = {
    id: string;
    orgUnitId: string;
    programId: string;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    onUpdateField: (innerAction: any) => void;
    onStartAsyncUpdateField: any;
    onSetSaveTypes: (saveTypes: AddEventSaveType[] | null) => void;
    onSave?: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, completed?: boolean) => void;
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void;
    onScrollToRelationships?: () => void;
    theme: any;
    formHorizontal?: boolean;
    recentlyAddedRelationshipId?: string | null;
    placementDomNodeForSavingText?: HTMLElement;
    programName: string;
    orgUnitFieldValue?: OrgUnit | null;
};

type DataEntrySection = {
    placement: string,
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
    [dataEntrySectionNames.NOTES]: {
        placement: placements.BOTTOM,
        name: i18n.t('Notes'),
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
class DataEntryPlain extends Component<Props & WithStyles<typeof getStyles>> {
    relationshipsInstance?: HTMLDivElement | null;
    dataEntrySections: { [key: string]: DataEntrySection };
    fieldOptions: { theme: any; fieldLabelMediaBasedClass?: string };
    constructor(props: Props & WithStyles<typeof getStyles>) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
    }

    componentDidMount() {
        this.props.onSetSaveTypes(null);
        if (this.relationshipsInstance && this.props.recentlyAddedRelationshipId) {
            this.relationshipsInstance.scrollIntoView();
            this.props.onScrollToRelationships?.();
        }
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    setRelationshipsInstance = (instance?: HTMLDivElement | null) => {
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
            placementDomNodeForSavingText,
            programName,
            stage,
            orgUnitFieldValue,
            ...passOnProps
        } = this.props;

        return (
            <div data-test="new-enrollment-event-form">
                {/* the props orgUnit, orgUnitId and selectedOrgUnitId should all be removed from here. See DHIS2-18869 */}
                <WrappedDataEntry
                    id={id}
                    onUpdateFormField={onUpdateField}
                    onUpdateFormFieldAsync={onStartAsyncUpdateField}
                    fieldOptions={this.fieldOptions}
                    dataEntrySections={this.dataEntrySections}
                    relationshipsRef={this.setRelationshipsInstance}
                    stage={stage}
                    orgUnitIdFieldValue={orgUnitFieldValue?.id}
                    orgUnit={orgUnitFieldValue}
                    // @ts-expect-error - See DHIS2-18869
                    orgUnitId={orgUnitFieldValue?.id}
                    selectedOrgUnitId={orgUnitFieldValue?.id}
                    {...passOnProps}
                />
                <SavingText
                    programName={programName}
                    stageName={stage.name}
                    orgUnitName={orgUnitFieldValue?.name}
                    placementDomNode={placementDomNodeForSavingText}
                />
            </div>
        );
    }
}


export const DataEntryComponent =
    withStyles(getStyles)(withTheme()(DataEntryPlain));
