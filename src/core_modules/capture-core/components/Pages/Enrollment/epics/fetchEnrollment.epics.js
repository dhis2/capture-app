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
    autoSwitchOrgUnit,
} from '../EnrollmentPage.actions';
import { enrollmentAccessLevels, serverErrorMessages } from '../EnrollmentPage.constants';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import { getAncestorIds } from '../../../../metadataRetrieval/orgUnitName';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const enrollmentsQuery = (teiId, programId) => ({
    resource: 'tracker/trackedEntities',
    id: teiId,
    params: {
        program: programId,
        fields: ['enrollments[enrollment,program,trackedEntity,status,enrolledAt]', 'programOwners[program,orgUnit]'],
    },
});

const makeCheckIsOwnerInScope = (querySingleResource, ownerId) => async (scope) => {
    const ownerPath = [
        ...await getAncestorIds(ownerId, querySingleResource),
        ownerId,
    ];

    return ownerPath.some(orgUnitId => scope.includes(orgUnitId));
};

const handleOpenAndAuditedAccessLevel = async (checkIsOwnerInScope) => {
    const { captureScope, searchScope } = systemSettingsStore.get();
    const extendedSearchScope = [
        ...captureScope,
        ...searchScope,
    ];

    if (await checkIsOwnerInScope(extendedSearchScope)) {
        return saveEnrollments({ enrollments: [] });
    }

    return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
};

const handleClosedAccessLevel = async (checkIsOwnerInScope) => {
    const { captureScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(captureScope)) {
        return saveEnrollments({ enrollments: [] });
    }

    return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
};

const handleProtectedAccessLevel = async (checkIsOwnerInScope, breakTheGlassAccessUntil) => {
    const { captureScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(captureScope)) {
        return saveEnrollments({ enrollments: [] });
    }

    const { searchScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(searchScope)) {
        if (breakTheGlassAccessUntil >= new Date().getTime()) {
            return saveEnrollments({ enrollments: [] });
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

const handleNotFoundError = async ({ ownerId, programId, breakTheGlassAccessUntil, querySingleResource }) => {
    if (!ownerId) {
        return saveEnrollments({ enrollments: [] });
    }

    const programAccessLevel = await getUserStorageController().get(userStores.PROGRAMS, programId, {
        project: ({ accessLevel }) => accessLevel,
    });

    const checkIsOwnerInScope = makeCheckIsOwnerInScope(querySingleResource, ownerId);

    return accessLevelHandlers[programAccessLevel](checkIsOwnerInScope, breakTheGlassAccessUntil);
};

const handleErrorsFromNewerBackends = ({
    error,
    ownerId,
    programId,
    breakTheGlassAccessUntil,
    querySingleResource,
}) => {
    const { httpStatusCode } = error?.details || {};
    if (httpStatusCode === 404) {
        return from(handleNotFoundError({
            ownerId,
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
                    concatMap(({ enrollments, programOwners }) => {
                        const enrollmentsSortedByDate = sortByDate(enrollments
                            .filter(enrollment => enrollment.program === programId));
                        return of(
                            saveEnrollments({ enrollments: enrollmentsSortedByDate }),
                            autoSwitchOrgUnit({ programId, programOwners }),
                        );
                    }),
                    catchError((error) => {
                        if (featureAvailable(FEATURES.moreGenericErrorMessages)) {
                            return handleErrorsFromNewerBackends({
                                error,
                                ownerId: store.value.enrollmentPage.programOwners[programId],
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
