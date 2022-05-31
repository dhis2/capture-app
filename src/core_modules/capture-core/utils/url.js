// @flow
import { pageKeys } from '../components/App/withAppUrlSync';
import { deriveURLParamsFromLocation } from './routing';

export type Url = {
    programId?: string,
    orgUnitId?: string,
    trackedEntityTypeId?: string,
    teiId?: string,
    enrollmentId?: string,
    stageId?: string,
    eventId?: string,
    tab?: string,
    viewEventId?: string,
    selectedTemplateId?: string,
}

export const deriveUrlQueries = (state: Object) => {
    const {
        currentSelections: {
            programId: selectedProgramId,
            orgUnitId: selectedOrgUnitId,
            trackedEntityTypeId: selectedTet,
        },
    } = state;
    const {
        programId: routerProgramId,
        orgUnitId: routerOrgUnitId,
        trackedEntityTypeId: routerTet,
        teiId,
        enrollmentId,
    } = deriveURLParamsFromLocation();

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

export const getLocationPathname = () => {
    const pathname = window.location.href.split('#')[1];
    try {
        return pathname.split('?')[0];
    } catch {
        return pathname;
    }
};

// TODO - This will be removed when the link to tracker capture is removed
export const getLocationSearch = () => window.location.search;

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
