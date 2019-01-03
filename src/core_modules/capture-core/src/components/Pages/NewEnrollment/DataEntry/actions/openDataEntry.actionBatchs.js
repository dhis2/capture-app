// @flow
import { batchActions } from 'redux-batched-actions';
import {
    getRulesActionsForTEI,
} from '../../../../../rulesEngineActionsCreator';
import { RenderFoundation, TrackerProgram } from '../../../../../metaData';
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
    (program: ?TrackerProgram, foundation: ?RenderFoundation, orgUnit: Object) => {
        const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

        let rulesActions;
        if (program && foundation) {
            rulesActions = getRulesActionsForTEI(
                program,
                foundation,
                formId,
                orgUnit,
            );
        } else {
            rulesActions = [];
        }

        return batchActions([
            ...dataEntryActions,
            ...rulesActions,
            openDataEntryForNewEnrollment(),
        ]);
    };
