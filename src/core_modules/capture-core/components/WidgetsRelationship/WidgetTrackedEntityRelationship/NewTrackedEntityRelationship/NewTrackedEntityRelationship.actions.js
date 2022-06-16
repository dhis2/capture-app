/*
import { actionCreator } from '../../../actions/actions.utils';
import { effectMethods } from '../../../trackerOffline';

export const NewTrackedEntityRelationshipActionTypes = {
    BATCH_OPEN_TEI_SEARCH: 'BatchOpenTeiSearch',
    INIT_TEI_SEARCH_FOR_WIDGET: 'InitTeiSearchForWidget',
    REQUEST_SAVE_RELATIONSHIP_FOR_TEI: 'RequestSaveRelationshipForTei',
};

export const startTeiSearchForWidget = ({ selectedRelationshipType }) =>
    actionCreator(NewTrackedEntityRelationshipActionTypes.INIT_TEI_SEARCH_FOR_WIDGET)({ selectedRelationshipType });

export const requestSaveRelationshipForTei = ({ serverData }) =>
    actionCreator(NewTrackedEntityRelationshipActionTypes.REQUEST_SAVE_RELATIONSHIP_FOR_TEI)({ serverData }, {
        offline: {
            effect: {
                url: 'tracker?async=false&importStrategy=UPDATE',
                method: effectMethods.POST,
                data: serverData,
            },
        },
    });
*/
