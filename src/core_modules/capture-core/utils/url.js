// @flow
export const urlArguments = (programId: string, orgUnitId: string): string => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

type Url = {programId?: string, orgUnitId?: string, trackedEntityTypeId?: string}

export const urlThreeArguments = ({ programId, orgUnitId, trackedEntityTypeId }: Url): string => {
    const argArray = [];

    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    if (programId) {
        argArray.push(`programId=${programId}`);
    } else if (trackedEntityTypeId) {
        argArray.push(`trackedEntityTypeId=${trackedEntityTypeId}`);
    }

    return argArray.join('&');
};
