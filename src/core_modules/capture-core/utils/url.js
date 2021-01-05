// @flow
type Url = {programId?: string, orgUnitId?: string, trackedEntityTypeId?: string, enrollmentId?: string}

export const urlArguments = ({ programId, orgUnitId, trackedEntityTypeId, enrollmentId }: Url): string => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    } else if (trackedEntityTypeId) {
        argArray.push(`trackedEntityTypeId=${trackedEntityTypeId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }
    if (enrollmentId) {
        argArray.push(`enrollmentId=${enrollmentId}`);
    }

    return argArray.join('&');
};
