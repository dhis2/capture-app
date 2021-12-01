// @flow
import i18n from '@dhis2/d2-i18n';
import { getFeedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescriptionGetter';
import { getMainStorageController } from 'capture-core/storageControllers';
import { appStartActionTypes } from '../../components/AppStart';

export const feedbackDesc = getFeedbackDesc({
    [appStartActionTypes.APP_LOAD_SUCESS]: (state) => {
        const storageController = getMainStorageController();
        if (storageController.Adapters[0] !== storageController.adapterType) {
            return [
                ...state, {
                    message: {
                        title: i18n.t('Compatibility mode'),
                        content: i18n.t('This app is currently running in compatibility mode due to browser restrictions. ' +
                            'For better performance, use another browser or exit private mode if this is currently in use.'),
                    },
                    feedbackType: 'ERROR',
                    displayType: 'dialog',
                },
            ];
        }
        return state;
    },
});
