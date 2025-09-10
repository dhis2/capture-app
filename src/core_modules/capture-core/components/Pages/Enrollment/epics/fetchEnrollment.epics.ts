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

const sortByDate = (enrollments: any[] = []) => enrollments.sort((a: any, b: any) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));

const enrollmentsQuery = (teiId: string, programId: string) => ({
    resource: 'tracker/trackedEntities',
    id: teiId,
    params: {
        program: programId,
        fields: ['enrollments[enrollment,program,trackedEntity,status,enrolledAt]'],
    },
});

const makeCheckIsOwnerInScope = (querySingleResource: any, programOwnerId: string) => async (scope: string[]) => {
    const ownerPath = [
        ...await getAncestorIds(programOwnerId, querySingleResource),
        programOwnerId,
    ];

    return ownerPath.some((orgUnitId: string) => scope.includes(orgUnitId));
};

const handleOpenAndAuditedAccessLevel = async (checkIsOwnerInScope: any, action: any) => {
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

const handleClosedAccessLevel = async (checkIsOwnerInScope: any, action: any) => {
    const { captureScope } = systemSettingsStore.get();
    if (await checkIsOwnerInScope(captureScope)) {
        return action;
    }

    return fetchEnrollmentsError({ accessLevel: enrollmentAccessLevels.NO_ACCESS });
};

const handleProtectedAccessLevel = async (checkIsOwnerInScope: any, action: any, breakTheGlassAccessUntil: number) => {
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

const handleNotFoundError = async ({ programOwnerId, programId, breakTheGlassAccessUntil, querySingleResource }: any) => {
    if (!programOwnerId) {
        return saveEnrollments({ enrollments: [], programOwnerId });
    }

    const programAccessLevel = await getUserMetadataStorageController().get(USER_METADATA_STORES.PROGRAMS, programId, {
        project: ({ accessLevel }: any) => accessLevel,
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
}: any) => {
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

const handleErrorsFromOlderBackends = (error: any) => {
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

export const fetchEnrollmentsEpic = (action$: any, store: any, { querySingleResource }: any) =>
    action$.pipe(
        ofType(enrollmentPageActionTypes.FETCH_ENROLLMENTS),
        concatMap(() => {
            const { teiId, programId } = store.value.enrollmentPage;
            return from(querySingleResource(enrollmentsQuery(teiId, programId)))
                .pipe(
                    map(({ enrollments }: any) => {
                        const enrollmentsSortedByDate = sortByDate(enrollments
                            .filter((enrollment: any) => enrollment.program === programId));
                        return saveEnrollments({
                            enrollments: enrollmentsSortedByDate,
                            programOwnerId: store.value.enrollmentPage.programOwners[programId],
                        });
                    }),
                    catchError((error: any) => {
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
                    map((action: any) => verifyFetchedEnrollments({ teiId, programId, action })),
                );
        }),
    );
