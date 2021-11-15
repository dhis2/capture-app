// @flow
import { pageKeys } from '../components/App/withAppUrlSync';

type Url = {
    programId?: string,
    orgUnitId?: string,
    trackedEntityTypeId?: string,
    teiId?: string,
    enrollmentId?: string,
    stageId?: string,
    eventId?: string,
    tab?: string,
}

export const deriveUrlQueries = (state: Object) => {
    const {
        currentSelections: {
            programId: selectedProgramId,
            orgUnitId: selectedOrgUnitId,
            trackedEntityTypeId: selectedTet,
        },
        router: {
            location: {
                query: {
                    programId: routerProgramId,
                    orgUnitId: routerOrgUnitId,
                    trackedEntityTypeId: routerTet,
                    teiId,
                    enrollmentId,
                },
            } },
    } = state;
    const programId = routerProgramId || selectedProgramId;
    const orgUnitId = routerOrgUnitId || selectedOrgUnitId;
    const trackedEntityTypeId = routerTet || selectedTet;

    return {
        programId,
        orgUnitId,
        trackedEntityTypeId,
        teiId,
        enrollmentId,
    };
};

export const getUrlQueries = (): Url => {
    const split = window.location.href.split('?');
    const searchParams = new URLSearchParams(split && split[1]);
    let searchParamsObject: Url = {};

    for (const [key, value] of searchParams.entries()) {
        searchParamsObject = { ...searchParamsObject, [key]: value };
    }
    return searchParamsObject;
};

export const pageFetchesOrgUnitUsingTheOldWay = (page: string, pages: Object = pageKeys): boolean =>
    Object.values(pages).includes(page);
