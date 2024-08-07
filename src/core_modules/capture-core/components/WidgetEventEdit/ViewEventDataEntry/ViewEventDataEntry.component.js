// @flow
import React, { Component } from 'react';
import { pipe } from 'capture-core-utils';
import { withStyles } from '@material-ui/core/';
import { dataEntryIds } from 'capture-core/constants';
import i18n from '@dhis2/d2-i18n';
import {
    placements,
    withCleanUp,
    DataEntry,
    withDataEntryField,
    withDataEntryFieldIfApplicable,
    withBrowserBackWarning,
} from '../../../components/DataEntry';

import { type RenderFoundation, DataElement, dataElementTypes } from '../../../metaData';
import { convertFormToClient, convertClientToView } from '../../../converters';

import {
    withLabel,
    withDefaultFieldContainer,
    ViewModeField,
    withFilterProps,
} from '../../FormFields/New';
import labelTypeClasses from './viewEventDataEntryFieldLabels.module.css';
import { EventLabelsByStatus } from './viewEventDataEntry.const';
import {
    withAOCFieldBuilder,
    withDataEntryFields,
    attributeOptionsKey,
    getCategoryOptionsValidatorContainers,
    AOCsectionKey,
} from '../../DataEntryDhis2Helpers';

const valueConvertFn = pipe(convertFormToClient, convertClientToView);

const getStyles = (theme: Theme) => ({
    header: {
        ...theme.typography.title,
        fontSize: 18,
        padding: theme.typography.pxToRem(10),
        borderBottom: `1px solid ${theme.palette.grey.blueGrey}`,
    },
    paper: {
        maxWidth: theme.typography.pxToRem(1070),
    },
    container: {
        flexGrow: 3,
    },
    content: {
        display: 'flex',
    },
    dataEntryContainer: {
        flexGrow: 1,
        padding: theme.typography.pxToRem(10),
    },
    dataEntryActionsContainer: {
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(30),
    },
    button: {
        whiteSpace: 'nowrap',
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

const viewModeComponent = withDefaultFieldContainer()(
    withLabel({
        onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
        onGetCustomFieldLabeClass: (props: Object) =>
            `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.defaultViewLabel}`,
    })(
        withFilterProps(defaultFilterProps)(ViewModeField),
    ),
);

const buildReportDateSettingsFn = () => {
    const dataElement = new DataElement((o) => {
        o.type = dataElementTypes.DATE;
    });

    const reportDateSettings = {
        getComponent: () => viewModeComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: props.formFoundation.getLabel(EventLabelsByStatus[props.eventStatus]),
            valueConverter: value => dataElement.convertValue(value, valueConvertFn),
        }),
        getPropName: (props: Object) => EventLabelsByStatus[props.eventStatus],
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
};

const buildScheduleDateSettingsFn = () => {
    const dataElement = new DataElement((o) => {
        o.type = dataElementTypes.DATE;
    });

    const scheduleDateSettings = {
        getComponent: () => viewModeComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: `${props.formFoundation.getLabel('scheduledAt')}`,
            valueConverter: value => dataElement.convertValue(value, valueConvertFn),
        }),
        getIsHidden: (props: Object) => props.id !== dataEntryIds.ENROLLMENT_EVENT || props.hideDueDate,
        getPropName: () => 'scheduledAt',
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return scheduleDateSettings;
};

const buildGeometrySettingsFn = () => ({
    isApplicable: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: () => viewModeComponent,
    getComponentProps: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                label: i18n.t('Area'),
                valueConverter: value => (value ? 'Polygon captured' : 'No polygon captured'),
            });
        }
        const pointDataElement = new DataElement((o) => {
            o.id = 'geometry';
            o.type = dataElementTypes.COORDINATE;
        });

        return createComponentProps(props, {
            label: 'Coordinate',
            valueConverter: value => pointDataElement.convertValue(value, valueConvertFn),
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
    const dataElement = new DataElement((o) => {
        o.id = 'complete';
        o.type = dataElementTypes.BOOLEAN;
    });

    const completeSettings = {
        getComponent: () => viewModeComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: i18n.t('Event completed'),
            id: dataElement.id,
            valueConverter: value => dataElement.convertValue(value, valueConvertFn),
        }),
        getPropName: () => dataElement.id,
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.STATUS,
        }),
        passOnFieldData: true,
    };
    return completeSettings;
};

const getCategoryOptionsSettingsFn = () => {
    const categoryOptionsSettings = {
        getComponent: () => viewModeComponent,
        getComponentProps: (props: Object, fieldId?: string) => createComponentProps(props, {
            ...props.categories?.find(category => category.id === fieldId) ?? {},
            valueConverter: value => props.categories
                ?.find(category => category.id === fieldId)
                ?.options?.find(option => option.value === value)
                ?.label,
        }),
        getPropName: (props: Object, fieldId?: string) => (
            fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey
        ),
        getFieldIds: (props: Object) => props.categories?.map(category => category.id),
        getValidatorContainers: () => getCategoryOptionsValidatorContainers(),
        getMeta: (props: Object) => ({
            section: AOCsectionKey,
            placement: placements.BOTTOM,
            sectionName: props.programCategory?.displayName,
        }),
    };

    return categoryOptionsSettings;
};

const AOCFieldBuilderHOC = withAOCFieldBuilder({})(withDataEntryFields(getCategoryOptionsSettingsFn())(DataEntry));
const CleanUpHOC = withCleanUp()(AOCFieldBuilderHOC);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CleanUpHOC);
const ScheduleDateField = withDataEntryField(buildScheduleDateSettingsFn())(GeometryField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(ScheduleDateField);
const CompletableDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
const DataEntryWrapper = withBrowserBackWarning()(CompletableDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onCancel: () => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    classes: Object,
    theme: Theme,
    onOpenEditEvent: () => void,
    dataEntryId: string,
    programId: string,
    itemId: string,
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
    [dataEntrySectionNames.NOTES]: {
        placement: placements.BOTTOM,
        name: i18n.t('Notes'),
    },
    [AOCsectionKey]: {
        placement: placements.TOP,
        name: '',
    },
};

class ViewEventDataEntryPlain extends Component<Props> {
    fieldOptions: { theme: Theme };
    dataEntrySections: { [$Values<typeof dataEntrySectionNames>]: DataEntrySection };
    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
    }

    render() {
        const {
            classes,
            dataEntryId,
            itemId,
            ...passOnProps
        } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DataEntryWrapper
                id={dataEntryId}
                viewMode
                fieldOptions={this.fieldOptions}
                dataEntrySections={this.dataEntrySections}
                {...passOnProps}
            />
        );
    }
}

export const ViewEventDataEntryComponent = withStyles(getStyles)(ViewEventDataEntryPlain);
