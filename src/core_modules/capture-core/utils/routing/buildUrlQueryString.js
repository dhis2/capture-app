// @flow
const idTypes = Object.freeze({
    programId: 'programId',
    orgUnitId: 'orgUnitId',
    trackedEntityTypeId: 'trackedEntityTypeId',
    teiId: 'teiId',
    enrollmentId: 'enrollmentId',
    stageId: 'stageId',
    eventId: 'eventId',
});

const urlTemplate = [
    idTypes.programId,
    idTypes.orgUnitId,
    idTypes.trackedEntityTypeId,
    idTypes.teiId,
    idTypes.enrollmentId,
    idTypes.stageId,
    idTypes.eventId,
];

export const buildUrlQueryString = (queryArgs: { [id: string]: ?string }) =>
    Object
        .entries(queryArgs)
        .sort((a, b) => {
            if (b && (urlTemplate.indexOf(b[0]) === -1)) return -1;
            if (a && (urlTemplate.indexOf(a[0]) === -1)) return 1;
            return urlTemplate.indexOf(a[0]) - urlTemplate.indexOf(b[0]);
        })
        .reduce((searchParams, [key, value]) => {
            // $FlowFixMe
            value && searchParams.append(key, value);
            return searchParams;
        }, new URLSearchParams())
        .toString();
