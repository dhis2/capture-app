// @flow
import { ofType } from 'redux-observable';
import { catchError, concatMap, map } from 'rxjs/operators';
import { from, of } from 'rxjs';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import { FEATURES, featureAvailable } from 'capture-core-utils';
import { systemSettingsStore } from '../../../../metaDataMemoryStores';
import {
    enrollmentPageActionTypes,
    verifyFetchedEnrollments,
    saveEnrollments,
    fetchEnrollmentsError,
    showErrorViewOnEnrollmentPage,
} from '../EnrollmentPage.actions';
import { enrollmentAccessLevels, serverErrorMessages } from '../EnrollmentPage.constants';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../storageControllers';
import { getAncestorIds } from '../../../../metadataRetrieval/orgUnitName';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const enrollmentsQuery = (teiId, programId) => ({
    resource: 'tracker/trackedEntities',
    id: teiId,
    params: {
        program: programId,
        fields: ['enrollments[enrollment,program,trackedEntity,status,enrolledAt]'],
    },
});

const makeCheckIsOwnerInScope = (querySingleResource, programOwnerId) => async (scope) => {
    const ownerPath = [
        ...await getAncestorIds(programOwnerId, querySingleResource),
        programOwnerId,
    ];

    return ownerPath.some(orgUnitId => scope.includes(orgUnitId));
};

const handleOpenAndAuditedAccessLevel = async (checkIsOwnerInScope, action) => {
    const { captureScope, searchScope } = systemSettingsStore.get();
    const extendedSearchScope = [
        ...captureScope,
        ...searchScope,
    ];

    if (await checkIsOwnerInScope(extendedSearchScope)) {
        return action;
    }

    return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
};

const handleClosedAccessLevel = async (checkIsOwnerInScope, action) => {
    const { captureScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(captureScope)) {
        return action;
    }

    return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
};

const handleProtectedAccessLevel = async (checkIsOwnerInScope, action, breakTheGlassAccessUntil) => {
    const { captureScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(captureScope)) {
        return action;
    }

    const { searchScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(searchScope)) {
        if (breakTheGlassAccessUntil >= new Date().getTime()) {
            return action;
        }
        return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS });
    }

    return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
};

const accessLevelHandlers = {
    OPEN: handleOpenAndAuditedAccessLevel,
    AUDITED: handleOpenAndAuditedAccessLevel,
    CLOSED: handleClosedAccessLevel,
    PROTECTED: handleProtectedAccessLevel,
};

const handleNotFoundError = async ({ programOwnerId, programId, breakTheGlassAccessUntil, querySingleResource }) => {
    if (!programOwnerId) {
        return saveEnrollments({ enrollments: [], programOwnerId });
    }

    const programAccessLevel = await getUserMetadataStorageController().get(USER_METADATA_STORES.PROGRAMS, programId, {
        project: ({ accessLevel }) => accessLevel,
    });

    const checkIsOwnerInScope = makeCheckIsOwnerInScope(querySingleResource, programOwnerId);

    return accessLevelHandlers[programAccessLevel](
        checkIsOwnerInScope,
        saveEnrollments({ enrollments: [], programOwnerId }),
        breakTheGlassAccessUntil,
    );
};

const handleErrorsFromNewerBackends = ({
    error,
    programOwnerId,
    programId,
    breakTheGlassAccessUntil,
    querySingleResource,
}) => {
    const { httpStatusCode } = error?.details || {};
    if (httpStatusCode === 404) {
        return from(handleNotFoundError({
            programOwnerId,
            programId,
            breakTheGlassAccessUntil,
            querySingleResource,
        }));
    }
    const errorMessage =
        i18n.t('An error occurred while fetching enrollments. Please enter a valid url.');
    return of(showErrorViewOnEnrollmentPage({ error: errorMessage }));
};

const handleErrorsFromOlderBackends = (error) => {
    const { message } = error || {};
    if (message) {
        if (message.includes(serverErrorMessages.OWNERSHIP_ACCESS_PARTIALLY_DENIED)) {
            return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS });
        } else if (message.includes(serverErrorMessages.OWNERSHIP_ACCESS_DENIED)) {
            return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.LIMITED_ACCESS });
        } else if (message.includes(serverErrorMessages.PROGRAM_ACCESS_CLOSED)) {
            return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
        } else if (message.includes(serverErrorMessages.ORGUNIT_OUT_OF_SCOPE)) {
            return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
        }
    }
    const errorMessage = i18n.t('An error occurred while fetching enrollments. Please enter a valid url.');
    return showErrorViewOnEnrollmentPage({ error: errorMessage });
};

export const fetchEnrollmentsEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        concatMap(() => {
            const { teiId, programId } = store.value.enrollmentPage;
            return from(querySingleResource(enrollmentsQuery(teiId, programId)))
                .pipe(
                    map(({ enrollments }) => {
                        const enrollmentsSortedByDate = sortByDate(enrollments
                            .filter(enrollment => enrollment.program === programId));
                        return saveEnrollments({
                            enrollments: enrollmentsSortedByDate,
                            programOwnerId: store.value.enrollmentPage.programOwners[programId],
                        });
                    }),
                    catchError((error) => {
                        if (featureAvailable(FEATURES.moreGenericErrorMessages)) {
                            return handleErrorsFromNewerBackends({
                                error,
                                programOwnerId: store.value.enrollmentPage.programOwners[programId],
                                breakTheGlassAccessUntil: store.value.breakTheGlassAccess[teiId]?.[programId],
                                programId,
                                querySingleResource,
                            });
                        }
                        return of(handleErrorsFromOlderBackends(error));
                    }),
                    map(action => verifyFetchedEnrollments({ teiId, programId, action })),
                );
        }),
    );
