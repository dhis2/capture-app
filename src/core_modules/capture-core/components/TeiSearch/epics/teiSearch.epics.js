// @flow
import isArray from 'd2-utilizr/lib/isArray';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { batchActions } from 'redux-batched-actions';
import { convertValue as convertToClient } from '../../../converters/formToClient';
import { convertValue as convertToServer } from '../../../converters/clientToServer';
import {
    convertValue as convertToFilters,
    convertValueToEqual as convertToUniqueFilters,
} from '../serverToFilters';
import {
    actionTypes,
    batchActionTypes,
    searchTeiResultRetrieved,
    searchTeiFailed,
    setProgramAndTrackedEntityType,
} from '../actions/teiSearch.actions';
import {
    actionTypes as programSelectorActionTypes,
} from '../SearchProgramSelector/searchProgramSelector.actions';
import getSearchGroups from '../getSearchGroups';
import { getTrackedEntityInstances } from '../../../trackedEntityInstances/trackedEntityInstanceRequests';
