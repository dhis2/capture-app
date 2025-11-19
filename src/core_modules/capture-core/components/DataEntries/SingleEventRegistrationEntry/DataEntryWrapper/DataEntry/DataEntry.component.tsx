import React, { Component } from 'react';
import { withStyles, WithStyles, withTheme } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { type OrgUnit } from '@dhis2/rules-engine-javascript';
import { DataEntry as DataEntryContainer } from '../../../../DataEntry/DataEntry.container';
import { withCancelButton } from '../../../../DataEntry/withCancelButton';
import { withDataEntryField } from '../../../../DataEntry/dataEntryField/withDataEntryField';
import { withDataEntryNotesHandler } from '../../../../DataEntry/dataEntryNotes/withDataEntryNotesHandler';
import { Notes } from '../../../../Notes/Notes.component';
import { withDataEntryRelationshipsHandler } from
    '../../../../DataEntry/dataEntryRelationships/withDataEntryRelationshipsHandler';
import { Relationships } from '../../../../Relationships/Relationships.component';
import { getEventDateValidatorContainers, getOrgUnitValidatorContainers } from './fieldValidators';
import { type RenderFoundation } from '../../../../../metaData';
import { withMainButton } from './withMainButton';
import { getNoteValidatorContainers } from './fieldValidators/note.validatorContainersGetter';
import {
    withSaveHandler,
    placements,
    withCleanUp,
} from '../../../../DataEntry';
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
    withFilterProps,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    orientations,
    SingleSelectField,
    SingleOrgUnitSelectField,
} from '../../../../FormFields/New';
import { Assignee } from './Assignee';

import { withFeedbackOutput } from '../../../../DataEntry/dataEntryOutput/withFeedbackOutput';
import { inMemoryFileStore } from '../../../../DataEntry/file/inMemoryFileStore';
import { withIndicatorOutput } from '../../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import { withErrorOutput } from '../../../../DataEntry/dataEntryOutput/withErrorOutput';
import { withWarningOutput } from '../../../../DataEntry/dataEntryOutput/withWarningOutput';
import { newEventSaveTypes } from './newEventSaveTypes';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { withDataEntryFieldIfApplicable } from '../../../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import { makeWritableRelationshipTypesSelector } from './dataEntry.selectors';
import { withTransformPropName } from '../../../../../HOC';
import { InfoIconText } from '../../../../InfoIconText';
import {
    AOCsectionKey,
    attributeOptionsKey,
    getCategoryOptionsValidatorContainers, withAOCFieldBuilder, withDataEntryFields,
} from '../../../../DataEntryDhis2Helpers';
import { systemSettingsStore } from '../../../../../metaDataMemoryStores';
import type { ReduxAction } from '../../../../../../capture-core-utils/types';

const getStyles: any = (theme: any) => ({
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
    NOTES: 'NOTES',
    RELATIONSHIPS: 'RELATIONSHIPS',
    ASSIGNEE: 'ASSIGNEE',
};

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const getCancelOptions = () => ({
    color: 'primary',
});

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

const getOrientation = (formHorizontal: boolean | null) =>
    (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => (formHorizontal ? 'center' : 'left');
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
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
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
                orgUnitId: props.orgUnit?.id,
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
            orgUnitId: props.orgUnit?.id,
        });
    },
    getPropName: () => 'geometry',
    getValidatorContainers: () => [],
    getMeta: () => ({
        placement: placements.TOP,
        section: dataEntrySectionNames.BASICINFO,
    }),
});

const buildCompleteFieldSettingsFn = () => {
    const completeComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(TrueOnlyField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const completeSettings = {
        getComponent: () => completeComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            label: i18n.t('Complete event'),
            id: 'complete',
        }),
        getPropName: () => 'complete',
        getValidatorContainers: () => [
        ],
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.STATUS,
        }),
        getPassOnFieldData: () => true,
    };

    return completeSettings;
};

const buildCategoryOptionsFieldSettingsFn = () => {
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
                                    withFilterProps(defaultFilterProps)(SingleSelectField),
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
            ...props.categories?.find(category => category.id === fieldId) ?? {},
            required: true,
        }),
        getPropName: (props: any, fieldId?: string) => (fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey),
        getFieldIds: (props: any) => props.categories?.map(category => category.id),
        getValidatorContainers: (props: any, fieldId?: string) => getCategoryOptionsValidatorContainers(props, fieldId),
        getMeta: (props: any) => {
            const { programCategory } = props;
            return {
                section: AOCsectionKey,
                placement: placements.TOP,
                sectionName: programCategory?.displayName,
            };
        },
    };

    return categoryOptionsSettings;
};

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
                    const defaultFiltred = defaultFilterProps(props);
                    const { validationAttempted, touched, ...passOnProps } = defaultFiltred;
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

const buildRelationshipsSettingsFn = () => {
    const writableRelationshipTypesSelector = makeWritableRelationshipTypesSelector();
    const relationshipsComponent =
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withFilterProps(defaultFilterProps)(
                    withDataEntryRelationshipsHandler()(Relationships),
                ),
            ),
        );
    const relationshipsSettings = {
        isApplicable: (props: any) => {
            const hasRelationships =
                props.stage && props.stage.relationshipTypesWhereStageIsFrom.length > 0;
            return hasRelationships;
        },
        getComponent: () => relationshipsComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            id: 'relationship',
            dataEntryId: props.id,
            highlightRelationshipId: props.recentlyAddedRelationshipId,
            relationshipsRef: props.relationshipsRef,
            onOpenAddRelationship: props.onOpenAddRelationship,
            writableRelationshipTypes: writableRelationshipTypesSelector(props),
            fromEntity: 'PROGRAM_STAGE_INSTANCE',
            currentEntityId: 'newEvent',
        }),
        getValidatorContainers: () => [],
        getPropName: () => 'relationship',
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.RELATIONSHIPS,
        }),
    };

    return relationshipsSettings;
};

const saveHandlerConfig = {
    onIsCompleting: (props: any) => props.completeDataEntryFieldValue,
    onFilterProps: (props: any) => {
        const { completeDataEntryFieldValue, ...passOnProps } = props;
        return passOnProps;
    },
};

const dataEntryFilterProps = (props: any) => {
    const { stage, onScrollToRelationships, recentlyAddedRelationshipId, relationshipsRef, ...passOnProps } = props;
    return passOnProps;
};


const CleanUpHOC = withCleanUp()(withFilterProps(dataEntryFilterProps)(DataEntryContainer));
const AssigneeField = withDataEntryFieldIfApplicable(buildAssigneeSettingsFn())(CleanUpHOC);
const AOCField = withAOCFieldBuilder({})(
    withDataEntryFields(buildCategoryOptionsFieldSettingsFn())(AssigneeField),
);
const RelationshipField = withDataEntryFieldIfApplicable(buildRelationshipsSettingsFn())(AOCField);
const NoteField = withDataEntryField(buildNotesSettingsFn())(RelationshipField);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(NoteField);
const OrgUnitField = withDataEntryField(buildOrgUnitSettingsFn())(GeometryField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(OrgUnitField);
const FeedbackOutput = withFeedbackOutput()(ReportDateField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const CancelableDataEntry = withCancelButton(getCancelOptions)(ErrorOutput);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(CancelableDataEntry));
const WrappedDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(SaveableDataEntry) as any;


type Props = {
    formFoundation: RenderFoundation,
    programName: string,
    orgUnitId: string,
    orgUnit: OrgUnit,
    orgUnitName: string,
    stageName: string,
    onUpdateDataEntryField: (orgUnit: OrgUnit) => (innerAction: ReduxAction<any, any>) => void,
    onUpdateField: (orgUnit: OrgUnit) => (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: (orgUnit: OrgUnit) => any,
    onSetSaveTypes: (saveTypes: Array<typeof newEventSaveTypes[keyof typeof newEventSaveTypes]> | null) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onSaveEventInStage: (
        eventId: string,
        dataEntryId: string,
        formFoundation: RenderFoundation,
        completed?: boolean
    ) => void,
    onSaveAndAddAnother: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    onCancel: () => void,
    theme: any,
    formHorizontal: boolean | null,
    recentlyAddedRelationshipId?: string | null,
    onScrollToRelationships: () => void;
};
type DataEntrySection = {
    placement: typeof placements[keyof typeof placements],
    name?: string,
};

const dataEntrySectionDefinitions = {
    [dataEntrySectionNames.BASICINFO]: {
        placement: placements.TOP,
        name: i18n.t('Basic info'),
    },
    [AOCsectionKey]: {
        placement: placements.TOP,
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
};

class NewEventDataEntry extends Component<Props & WithStyles<typeof getStyles>> {
    fieldOptions: { theme: any };
    dataEntrySections: { [key: string]: DataEntrySection };
    constructor(props: Props & WithStyles<typeof getStyles>) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
    }

    UNSAFE_componentWillMount() {
        this.props.onSetSaveTypes(null);
    }

    componentDidMount() {
        if (this.relationshipsInstance && this.props.recentlyAddedRelationshipId) {
            this.relationshipsInstance.scrollIntoView();
            this.props.onScrollToRelationships();
        }
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }
    relationshipsInstance: HTMLDivElement | null = null;

    setRelationshipsInstance = (instance: HTMLDivElement | null) => {
        this.relationshipsInstance = instance;
    }

    handleSave = (itemId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: string | null) => {
        if (saveType === newEventSaveTypes.SAVEANDADDANOTHER) {
            if (!this.props.formHorizontal) {
                this.props.onSetSaveTypes([newEventSaveTypes.SAVEANDADDANOTHER, newEventSaveTypes.SAVEANDEXIT]);
            }
            this.props.onSaveAndAddAnother(itemId, dataEntryId, formFoundation);
        } else if (saveType === newEventSaveTypes.SAVEANDEXIT) {
            this.props.onSave(itemId, dataEntryId, formFoundation);
        } else if (saveType === newEventSaveTypes.SAVEWITHOUTCOMPLETING) {
            this.props.onSaveEventInStage(itemId, dataEntryId, formFoundation);
        } else if (saveType === newEventSaveTypes.SAVEANDCOMPLETE) {
            this.props.onSaveEventInStage(itemId, dataEntryId, formFoundation, true);
        }
    }

    getSavingText() {
        const { orgUnitName, programName } = this.props;

        return (
            <span>
                {orgUnitName
                    ? i18n.t('Saving to {{programName}} in {{orgUnitName}}',
                        { orgUnitName, programName, interpolation: { escapeValue: false } })
                    : i18n.t('Saving to {{programName}}',
                        { programName, interpolation: { escapeValue: false } })}
            </span>
        );
    }

    renderHorizontal = () => {
        const classes = this.props.classes;
        return (
            <div
                className={classes.horizontal}
            >
                {this.renderContent()}
            </div>
        );
    }

    renderVertical = () => (<div>{this.renderContent()}</div>);

    renderContent = () => {
        const {
            onUpdateDataEntryField,
            onUpdateField,
            onStartAsyncUpdateField,
            programName, // eslint-disable-line
            orgUnit,
            orgUnitName, // eslint-disable-line
            classes,
            onSave,
            onSetSaveTypes,
            onSaveAndAddAnother,
            theme,
            ...passOnProps
        } = this.props;
        return (
            <div>
                <div data-test="data-entry-container">
                    <WrappedDataEntry
                        id={'singleEvent'}
                        onUpdateDataEntryField={onUpdateDataEntryField(orgUnit)}
                        onUpdateFormField={onUpdateField(orgUnit)}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField(orgUnit)}
                        selectedOrgUnitId={orgUnit?.id}
                        onSave={this.handleSave}
                        fieldOptions={this.fieldOptions}
                        dataEntrySections={this.dataEntrySections}
                        relationshipsRef={this.setRelationshipsInstance}
                        orgUnit={orgUnit}
                        // @ts-expect-error - keeping original functionality as before ts rewrite
                        orgUnitId={orgUnit?.id}
                        {...passOnProps}
                    />
                </div>
                <InfoIconText>
                    {this.getSavingText()}
                </InfoIconText>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical()}
            </div>
        );
    }
}


export const DataEntryComponent = withStyles(getStyles)(withTheme()(NewEventDataEntry));
