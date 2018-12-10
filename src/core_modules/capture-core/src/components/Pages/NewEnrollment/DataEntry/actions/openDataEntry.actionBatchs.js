// @flow
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { loadNewDataEntry } from '../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { openDataEntryForNewEnrollment } from '../actions/openDataEntry.actions';

const dataEntryId = 'enrollment';
const itemId = 'newEnrollment';
const formId = getDataEntryKey(dataEntryId, itemId);

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'eventDate',
        type: 'DATE',
        validatorContainers: [],
    },
];

export const openDataEntryForNewEnrollmentBatch =
    () => {
        const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

        return [
            ...dataEntryActions,
            openDataEntryForNewEnrollment(),
        ];

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
