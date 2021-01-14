// @flow
type Url = {|
    programId?: string,
    orgUnitId?: string,
    trackedEntityTypeId?: string,
    teiId?: string,
    enrollmentId?: string,
|}

export const urlArguments = ({
    programId,
    orgUnitId,
    trackedEntityTypeId,
    teiId,
    enrollmentId,
}: Url): string => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    } else if (trackedEntityTypeId) {
        argArray.push(`trackedEntityTypeId=${trackedEntityTypeId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }
    if (teiId) {
        argArray.push(`teiId=${teiId}`);
    }
    if (enrollmentId) {
        argArray.push(`enrollmentId=${enrollmentId}`);
    }

    return argArray.join('&');
};
