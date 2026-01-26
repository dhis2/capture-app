import i18n from '@dhis2/d2-i18n';
import { isLangRtl } from 'capture-core/utils/rtl';
import { DataEntry } from '../../../DataEntry';
import { Assignee } from '../../SingleEventRegistrationEntry/DataEntryWrapper/DataEntry/Assignee';
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
    TrueOnlyField,
    orientations,
} from '../../../FormFields/New';
import { placements } from '../../../DataEntry/constants/placements.const';
import { withDataEntryFieldIfApplicable } from '../../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import { sectionKeysForFirstStageDataEntry } from './EnrollmentWithFirstStageDataEntry.constants';
import labelTypeClasses from './fieldLabels.module.css';
import { withCleanUp } from './withCleanUp';
import { getEventDateValidatorContainers } from './fieldValidators/eventDate.validatorContainersGetter';
import { stageMainDataIds } from './getDataEntryPropsToInclude';
import { withTransformPropName } from '../../../../HOC';
import { systemSettingsStore } from '../../../../metaDataMemoryStores';

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => {
    if (formHorizontal) {
        return 'center';
    }
    return isLangRtl() ? 'right' : 'left';
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

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withLabel({
                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                onGetCustomFieldLabeClass: (props: any) =>
                    `${props.fieldOptions &&
                        props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
            })(
                withDisplayMessages()(
                    withInternalChangeHandler()(
                        withFilterProps(defaultFilterProps)(CoordinateField),
                    ),
                ),
            ),
        ),
    ),
);

const polygonComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withLabel({
                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                onGetCustomFieldLabeClass: (props: any) =>
                    `${props.fieldOptions &&
                        props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
            })(
                withDisplayMessages()(
                    withInternalChangeHandler()(
                        withFilterProps(defaultFilterProps)(PolygonField),
                    ),
                ),
            ),
        ),
    ),
);

const getStageGeometrySettings = () => ({
    isApplicable: (props: any) => {
        const featureType = props.firstStageMetaData?.stage?.stageForm?.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: any) => {
        const featureType = props.firstStageMetaData?.stage?.stageForm?.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }
        return pointComponent;
    },
    getComponentProps: (props: any) => {
        const featureType = props.firstStageMetaData?.stage?.stageForm?.featureType;
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
    getPropName: () => stageMainDataIds.GEOMETRY,
    getValidatorContainers: () => [],
    getMeta: () => ({
        section: sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO,
    }),
});

const getCompleteFieldSettingsFn = () => {
    const completeComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withLabel({
                        onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: any) =>
                            `${props.fieldOptions &&
                                props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withFilterProps(defaultFilterProps)(TrueOnlyField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const completeSettings = {
        isApplicable: (props: any) => props.firstStageMetaData && props.firstStageMetaData.stage?.stageForm,
        getComponent: () => completeComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            label: i18n.t('Complete event'),
            id: 'complete',
        }),
        getPropName: () => stageMainDataIds.COMPLETE,
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
                    withLabel({
                        onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: any) =>
                            `${props.fieldOptions &&
                                props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withFilterProps(defaultFilterProps)(DateField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const reportDateSettings = {
        isApplicable: (props: any) => props.firstStageMetaData?.stage?.stageForm,
        getComponent: () => reportDateComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.firstStageMetaData?.stage?.stageForm?.getLabel('occurredAt'),
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarType: systemSettingsStore.get().calendar,
            dateFormat: systemSettingsStore.get().dateFormat,
        }),
        getPropName: () => stageMainDataIds.OCCURRED_AT,
        getValidatorContainers: (props: any) => getEventDateValidatorContainers(props),
        getMeta: () => ({
            section: sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO,
        }),
    };

    return reportDateSettings;
};

const getAssigneeSettingsFn = () => {
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
            const enableUserAssignment = props.firstStageMetaData && props.firstStageMetaData.stage.enableUserAssignment;
            return !!enableUserAssignment;
        },
        getComponent: () => assigneeComponent,
        getComponentProps: (props: any) => createComponentProps({}, {
            orientation: getOrientation(props.formHorizontal),
        }),
        getPropName: () => 'assignee',
        getValidatorContainers: () => [],
        getMeta: () => ({
            section: sectionKeysForFirstStageDataEntry.ASSIGNEE,
        }),
    };
};

const StageLocationHOC = withDataEntryFieldIfApplicable(getStageGeometrySettings())(withCleanUp()(DataEntry));
const CompleteHOC = withDataEntryFieldIfApplicable(getCompleteFieldSettingsFn())(StageLocationHOC);
const AssigneeHOC = withDataEntryFieldIfApplicable(getAssigneeSettingsFn())(CompleteHOC);
export const FirstStageDataEntry = withDataEntryFieldIfApplicable(getReportDateSettingsFn())(AssigneeHOC);
