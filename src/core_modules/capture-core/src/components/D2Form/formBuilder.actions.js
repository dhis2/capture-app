// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    CACHE_FORMBUILDER_STATE: 'CacheFormBuilderState',
};

export const cacheFormBuilderState = (formState: Object, id: string) => actionCreator(actionTypes.CACHE_FORMBUILDER_STATE)({ formState, id });
