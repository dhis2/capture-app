// @flow
import { pageKeys } from '../components/App/withAppUrlSync';

type Url = {programId?: string, orgUnitId?: string, trackedEntityTypeId?: string}

export const urlArguments = ({ programId, orgUnitId, trackedEntityTypeId }: Url): string => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    } else if (trackedEntityTypeId) {
        argArray.push(`trackedEntityTypeId=${trackedEntityTypeId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

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
                },
            } },
    } = state;
    const programId = routerProgramId || selectedProgramId;
    const orgUnitId = routerOrgUnitId || selectedOrgUnitId;
    const trackedEntityTypeId = routerTet || selectedTet;

    return { programId, orgUnitId, trackedEntityTypeId };
};

export const pageFetchesOrgUnitUsingTheOldWay = (page: string, pages: Object = pageKeys): boolean =>
    Object.values(pages).includes(page);
