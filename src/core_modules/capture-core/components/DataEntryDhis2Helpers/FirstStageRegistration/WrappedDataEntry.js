// @flow
import i18n from '@dhis2/d2-i18n';
import { DataEntry } from '../../DataEntry/DataEntry.container';
import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    DateField,
    PolygonField,
    CoordinateField,
    withCalculateMessages,
    withDisplayMessages,
    withFilterProps,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    TrueOnlyField,
    orientations,
} from '../../FormFields/New';
import { placements } from '../../DataEntry/constants/placements.const';
import { withDataEntryFieldIfApplicable } from '../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import { sectionKeysForFirstStageDataEntry } from './FirstStageRegistration.constants';
import labelTypeClasses from './fieldLabels.module.css';
import { withCleanUp } from './withCleanUp';

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

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

const getOrientation = (formHorizontal: ?boolean) => (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
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
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
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

const getStageGeometrySettings = () => ({
    isApplicable: (props: Object) => {
        const featureType = props.firstStageMetaData?.stage?.stageForm?.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: Object) => {
        const featureType = props.firstStageMetaData?.stage?.stageForm?.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }
        return pointComponent;
    },
    getComponentProps: (props: Object) => {
        const featureType = props.firstStageMetaData?.stage?.stageForm?.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
        });
    },
    getPropName: () => 'stageGeometry',
    getValidatorContainers: () => [],
    getMeta: () => ({
        placement: placements.TOP,
        section: sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO,
    }),
});

const getCompleteFieldSettingsFn = () => {
    const completeComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
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
        isApplicable: (props: Object) => props.firstStageMetaData && props.firstStageMetaData.stage?.stageForm,
        getComponent: () => completeComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: i18n.t('Complete event'),
            id: 'complete',
        }),
        getPropName: () => 'stageComplete',
        getValidatorContainers: () => [],
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: sectionKeysForFirstStageDataEntry.STATUS,
        }),
        getPassOnFieldData: () => true,
    };

    return completeSettings;
};

const getReportDateSettingsFn = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
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
        isApplicable: (props: Object) => props.firstStageMetaData?.stage?.stageForm,
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.firstStageMetaData?.stage?.stageForm?.getLabel('occurredAt'),
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
        }),
        getPropName: () => 'stageOccurredAt',
        getValidatorContainers: () => [],
        getMeta: () => ({
            placement: placements.TOP,
            section: sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO,
        }),
    };

    return reportDateSettings;
};


const StageLocationHOC = withCleanUp()(withDataEntryFieldIfApplicable(getStageGeometrySettings())(DataEntry));
const CompleteHOC = withCleanUp()(withDataEntryFieldIfApplicable(getCompleteFieldSettingsFn())(StageLocationHOC));
export const WrappedDataEntry = withDataEntryFieldIfApplicable(getReportDateSettingsFn())(CompleteHOC);
