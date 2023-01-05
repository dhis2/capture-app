// @flow
import { pageKeys } from '../components/App/withAppUrlSync';
import { getLocationQuery } from './routing';

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
    } = getLocationQuery();

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


export const pageFetchesOrgUnitUsingTheOldWay = (page: string, pages: Object = pageKeys): boolean =>
    Object.values(pages).includes(page);
