// @flow
import { batchActions } from 'redux-batched-actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from '../actions/openDataEntry.actions';
import { getEnrollmentDateValidatorContainer, getIncidentDateValidatorContainer } from '../fieldValidators';
import { convertGeometryOut } from '../../../crossPage/converters';

const dataEntryId = 'enrollment';
const itemId = 'newEnrollment';
const formId = getDataEntryKey(dataEntryId, itemId);

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'enrollmentDate',
        type: 'DATE',
        validatorContainers: getEnrollmentDateValidatorContainer(),
    },
    {
        id: 'incidentDate',
        type: 'DATE',
        validatorContainers: getIncidentDateValidatorContainer(),
    },
    {
        id: 'geometry',
        onConvertOut: convertGeometryOut,
    },
];

export const openDataEntryForNewEnrollmentBatch =
    () => {
        const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

        return batchActions([
            ...dataEntryActions,
            openDataEntryForNewEnrollment(),
        ]);

        /*
        const rulesActions = getRulesActionsForEvent(
            program,
            foundation,
            formId,
            orgUnit,
        );

        return [
            ...dataEntryActions,
            ...rulesActions,
            actionCreator(actionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY)(),
        ];
        */
    };
