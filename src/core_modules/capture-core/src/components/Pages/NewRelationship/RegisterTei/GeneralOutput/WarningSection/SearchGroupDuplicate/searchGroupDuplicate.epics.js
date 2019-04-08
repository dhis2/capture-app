// @flow
import { pipe } from 'capture-core-utils';
import { getApi } from '../../../../../../../d2/d2Instance';
import {
    actionTypes,
    duplicatesForReviewRetrievalSuccess,
    duplicatesForReviewRetrievalFailed,
} from './searchGroupDuplicate.actions';
import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    dataElementTypes,
} from '../../../../../../../metaData';
import getDataEntryKey from '../../../../../../DataEntry/common/getDataEntryKey';
import { convertFormToClient, convertClientToServer, convertServerToClient } from '../../../../../../../converters';

const getProgramSearchGroup = (programId: string) => {
    const program = getTrackerProgramThrowIfNotFound(programId);
    return program.enrollment.inputSearchGroups[0];
};

const getTETSearchGroup = (tetId: string) => {
    const tet = getTrackedEntityTypeThrowIfNotFound(tetId);
    return tet.teiRegistration.inputSearchGroups[0];
};

const getSearchGroup = (programId: ?string, tetId: string) =>
    (programId ? getProgramSearchGroup(programId) : getTETSearchGroup(tetId));

const getEnrollmentForm = (programId: string) => {
    const program = getTrackerProgramThrowIfNotFound(programId);
    return program.enrollment.enrollmentForm;
};

const getTETForm = (tetId: string) => {
    const tet = getTrackedEntityTypeThrowIfNotFound(tetId);
    return tet.teiRegistration.form;
};

const getFormMetadata = (programId: ?string, tetId: string) =>
    (programId ? getEnrollmentForm(programId) : getTETForm(tetId));

export const loadSearchGroupDuplicatesForReviewEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.DUPLICATES_REVIEW, actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE)
        .switchMap((action) => {
            const isChangePage = action.type === actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE;
            const requestPage = isChangePage ? action.payload.page : 1;

            const dataEntryId = 'relationship';
            const state = store.getState();
            const { programId, orgUnit } = state.newRelationshipRegisterTei;
            const tetId = state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;
            const dataEntryKey = getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId);
            const formValues = state.formsValues[dataEntryKey];

            let searchGroup;
            try {
                searchGroup = getSearchGroup(programId, tetId);
            } catch (error) {
                return Promise.resolve(duplicatesForReviewRetrievalFailed());
            }

            const groupElements = searchGroup.searchFoundation.getElements();
            const filters = groupElements
                .map((element) => {
                    const value = formValues[element.id];
                    if (!value && value !== 0 && value !== false) {
                        return null;
                    }

                    const serverValue = element.convertValue(value, pipe(convertFormToClient, convertClientToServer));
                    return `${element.id}:LIKE:${serverValue}`;
                })
                .filter(f => f);

            const queryParams = {
                ou: orgUnit.id,
                ouMode: 'ACCESSIBLE',
                program: programId,
                pageSize: 5,
                page: requestPage,
                totalPages: !isChangePage,
                filter: filters,
            };

            return getApi()
                .get('trackedEntityInstances', queryParams)
                .then((response) => {
                    const formFoundation = getFormMetadata(programId, tetId);
                    const pager = (response && response.pager) || {};
                    const paginationData = !isChangePage ? {
                        rowsCount: pager.total,
                        rowsPerPage: pager.pageSize,
                        currentPage: pager.page,
                    } : null;

                    const teInstances = (response && response.trackedEntityInstances) || [];
                    const convertedInstances = teInstances
                        .map((instance) => {
                            const attributes = instance.attributes || [];

                            const values = attributes
                                .reduce((acc, container) => {
                                    acc[container.attribute] = container.value;
                                    return acc;
                                }, {});

                            const convertedValues = formFoundation.convertValues(values, convertServerToClient);

                            return {
                                id: instance.trackedEntityInstance,
                                values: {
                                    ...convertedValues,
                                    registrationDate: convertServerToClient(instance.created, dataElementTypes.DATETIME),
                                    registrationUnit: convertServerToClient(instance.orgUnit, dataElementTypes.TEXT),
                                    inactive: convertServerToClient(instance.inactive, dataElementTypes.BOOLEAN),
                                },
                            };
                        });

                    return duplicatesForReviewRetrievalSuccess(
                        convertedInstances,
                        paginationData,
                    );
                })
                .catch(() =>
                    duplicatesForReviewRetrievalFailed());
        });
