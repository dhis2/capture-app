// @flow
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getApplicableRuleEffectsForTrackerProgram, updateRulesEffects } from '../../../../rules';
import type { ProgramStage, TrackerProgram, RenderFoundation } from '../../../../metaData';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from './open.actions';
import {
    getEnrollmentDateValidatorContainer,
    getIncidentDateValidatorContainer,
    getCategoryOptionsValidatorContainers,
} from '../fieldValidators';
import { convertGeometryOut } from '../../converters';
import { convertDateObjectToDateFormatString } from '../../../../utils/converters/date';
import { addFormData } from '../../../D2Form/actions/form.actions';
import type { ProgramCategory } from '../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';
import { getDataEntryPropsToInclude } from '../EnrollmentWithFirstStageDataEntry';

const itemId = 'newEnrollment';

type DataEntryPropsToInclude = Array<Object>;

const enrollmentDataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'enrolledAt',
        type: 'DATE',
        // $FlowFixMe[incompatible-call] automated comment
        validatorContainers: getEnrollmentDateValidatorContainer(),
    },
    {
        id: 'occurredAt',
        type: 'DATE',
        // $FlowFixMe[incompatible-call] automated comment
        validatorContainers: getIncidentDateValidatorContainer(),
    },
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
];

export const batchActionTypes = {
    OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT_BATCH: 'OpenDataEntryForNewEnrollmentBatch',
};

export const openDataEntryForNewEnrollmentBatchAsync = async ({
    program,
    orgUnit,
    dataEntryId,
    extraActions = [],
    extraDataEntryProps = [],
    formValues,
    clientValues,
    firstStage,
    programCategory,
    formFoundation,
}: {
    program: TrackerProgram,
    orgUnit: OrgUnit,
    dataEntryId: string,
    extraActions?: Array<ReduxAction<any, any>>,
    extraDataEntryProps?: Array<Object>,
    formValues: { [key: string]: any },
    clientValues: { [key: string]: any },
    firstStage?: ProgramStage,
    programCategory?: ProgramCategory,
    formFoundation: RenderFoundation,
}) => {
    const formId = getDataEntryKey(dataEntryId, itemId);
    const addFormDataActions = addFormData(`${dataEntryId}-${itemId}`, formValues);
    const firstStageDataEntryPropsToInclude = firstStage && getDataEntryPropsToInclude(firstStage.stageForm);
    const defaultDataEntryValues = { enrolledAt: convertDateObjectToDateFormatString(new Date()) };
    const dataEntryPropsToInclude = [
        ...enrollmentDataEntryPropsToInclude,
        ...extraDataEntryProps,
        ...(firstStageDataEntryPropsToInclude || []),
        ...(programCategory && programCategory.categories ? programCategory.categories.map(category => ({
            id: `attributeCategoryOptions-${category.id}`,
            type: 'TEXT',
            validatorContainers:
                getCategoryOptionsValidatorContainers({ categories: programCategory.categories }, category.id),
        })) : []),
    ];

    const dataEntryActions =
            loadNewDataEntry(
                dataEntryId,
                itemId,
                dataEntryPropsToInclude,
                defaultDataEntryValues,
            );

    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        orgUnit,
        stage: firstStage,
        attributeValues: clientValues,
        enrollmentData: defaultDataEntryValues,
        formFoundation,
    });

    return batchActions([
        openDataEntryForNewEnrollment(
            dataEntryId,
        ),
        ...dataEntryActions,
        addFormDataActions,
        updateRulesEffects(effects, formId),
        ...extraActions,
    ], batchActionTypes.OPEN_DATA_ENTRY_FOR_NEW_ENROLLMENT_BATCH);
};
