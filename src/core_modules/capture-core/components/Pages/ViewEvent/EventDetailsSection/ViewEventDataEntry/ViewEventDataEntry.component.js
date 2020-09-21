// @flow
import React, { Component } from 'react';
import { pipe } from 'capture-core-utils';
import { withStyles } from '@material-ui/core/';
import i18n from '@dhis2/d2-i18n';
import {
    placements,
    withCleanUpHOC,
    DataEntry,
    withDataEntryField,
    withDataEntryFieldIfApplicable,
    withBrowserBackWarning,
} from '../../../../../components/DataEntry';

import { RenderFoundation, DataElement, dataElementTypes } from '../../../../../metaData';
import { convertFormToClient, convertClientToView } from '../../../../../converters';

import {
    withLabel,
    withDefaultFieldContainer,
    ViewModeField,
    withFilterProps,
} from '../../../../FormFields/New';
import labelTypeClasses from './viewEventDataEntryFieldLabels.module.css';

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
    COMMENTS: 'COMMENTS',
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
        o.id = 'eventDate';
        o.type = dataElementTypes.DATE;
    });

    const reportDateSettings = {
        getComponent: () => viewModeComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: props.formFoundation.getLabel(dataElement.id),
            valueConverter: value => dataElement.convertValue(value, valueConvertFn),
        }),
        getPropName: () => dataElement.id,
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
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
            label: 'Event completed',
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

const CleanUpHOC = withCleanUpHOC()(DataEntry);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CleanUpHOC);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(GeometryField);
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
};

class ViewEventDataEntry extends Component<Props> {
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
            ...passOnProps
        } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DataEntryWrapper
                id={'singleEvent'}
                viewMode
                fieldOptions={this.fieldOptions}
                dataEntrySections={this.dataEntrySections}
                {...passOnProps}
            />
        );
    }
}


export default withStyles(getStyles)(ViewEventDataEntry);
