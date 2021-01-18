import { actionCreator } from '../../actions/actions.utils';

export const trackedEntityTypeSelectorActionTypes = {
    TRACKED_ENTITY_TYPE_ID_ON_URL_SET: 'OnUrlSetTrackedEntityTypeId',
};

export const setTrackedEntityTypeIdOnUrl = ({ trackedEntityTypeId }) =>
    actionCreator(trackedEntityTypeSelectorActionTypes.TRACKED_ENTITY_TYPE_ID_ON_URL_SET)({ trackedEntityTypeId });
