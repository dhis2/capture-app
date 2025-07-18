import { actionCreator } from '../../actions/actions.utils';

export const trackedEntityTypeSelectorActionTypes = {
    TRACKED_ENTITY_TYPE_ID_ON_URL_SET: 'OnUrlSetTrackedEntityTypeId',
};

export const setTrackedEntityTypeIdOnUrl = ({ trackedEntityTypeId }: { trackedEntityTypeId: string }) =>
    actionCreator(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET)({ trackedEntityTypeId });
