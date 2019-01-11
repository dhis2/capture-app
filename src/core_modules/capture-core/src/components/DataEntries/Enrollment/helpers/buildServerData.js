// @flow
import { pipe } from 'capture-core-utils';
import { Enrollment, RenderFoundation } from '../../../../metaData';
import { convertValue as convertFormToClient } from '../../../../converters/formToClient';
import { convertValue as convertClientToServer } from '../../../../converters/clientToServer';
import convertDataEntryValuesToClientValues from '../../../DataEntry/common/convertDataEntryValuesToClientValues';
import { convertEnrollmentClientToServerWithKeysMap } from '../../../../enrollment';

type Selections = {
    programId: string,
    orgUnitId: string,
};

function getFormServerValues(
    formValues: Object,
    formFoundation: RenderFoundation,
) {
    const formServerValues = formFoundation.convertValues(
        formValues,
        pipe(
            convertFormToClient,
            convertClientToServer,
        ),
    );
    return formServerValues;
}

function getEnrollmentServerValues(
    dataEntryKey: string,
    dataEntryValues: Object,
    dataEntryValuesMeta: Object,
    prevEnrollmentData: Object,
    formFoundation: RenderFoundation,
) {
    const enrollmentClientValues = convertDataEntryValuesToClientValues(
        dataEntryValues,
        dataEntryValuesMeta,
        prevEnrollmentData,
        formFoundation,
    ) || {};

    const enrollmentServerValues =
        enrollmentClientValues && convertEnrollmentClientToServerWithKeysMap(enrollmentClientValues);
    return enrollmentServerValues;
}

function getTEIServerData(
    enrollment: Enrollment,
    selections: Selections,
    formServerValues: Object,
) {
    const trackedEntityType = enrollment.trackedEntityType.id;
    return {
        orgUnit: selections.orgUnitId,
        trackedEntityType,
        // $FlowFixMe
        attributes: Object
            .keys(formServerValues)
            .map(key => ({
                attribute: key,
                value: formServerValues[key],
            })),
    };
}

function getEnrollmentServerData(
    selections: Selections,
    enrollmentServerValues: Object,
) {
    return {
        orgUnit: selections.orgUnitId,
        program: selections.programId,
        status: 'ACTIVE',
        ...enrollmentServerValues,
    };
}

export default function buildServerData(
    dataEntryKey: string,
    selections: Selections,
    enrollment: Enrollment,
    formValues: Object = {},
    dataEntryValues: Object = {},
    dataEntryValuesMeta: Object = {},
    prevEnrollmentData: Object = {},
) {
    const formFoundation = enrollment.enrollmentForm;
    const formServerValues = getFormServerValues(formValues, formFoundation);
    const enrollmentServerValues = getEnrollmentServerValues(
        dataEntryKey,
        dataEntryValues,
        dataEntryValuesMeta,
        prevEnrollmentData,
        formFoundation,
    );

    const teiServerData = getTEIServerData(
        enrollment,
        selections,
        formServerValues,
    );
    const enrollmentServerData = getEnrollmentServerData(
        selections,
        enrollmentServerValues,
    );

    return {
        ...teiServerData,
        //enrollments: [
        //    enrollmentServerData,
        //],
    };
}
