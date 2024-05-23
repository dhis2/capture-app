// @flow
import { pipe } from 'capture-core-utils';
import { dataElementTypes, ProgramStage } from '../../../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../../../converters';
import { convertCategoryOptionsToServer } from '../../../../../converters/clientToServer';
import { convertStatusOut } from '../../../../DataEntries';
import { standardGeoJson } from './standardGeoJson';

const convertFn = pipe(convertFormToClient, convertClientToServer);

export const deriveFirstStageDuringRegistrationEvent = ({
    firstStageMetadata,
    programId,
    orgUnitId,
    currentEventValues,
    fieldsValue,
    attributeCategoryOptions,
    assignee,
    serverMinorVersion,
}: {
    firstStageMetadata: ?ProgramStage,
    programId: string,
    orgUnitId: string,
    currentEventValues?: { [id: string]: any },
    fieldsValue: { [id: string]: any },
    attributeCategoryOptions: { [categoryId: string]: string } | string,
    assignee?: ApiAssignedUser,
    serverMinorVersion: number,
}) => {
    if (!firstStageMetadata) {
        return null;
    }
    const { enrolledAt, stageComplete, stageOccurredAt, stageGeometry } = fieldsValue;

    const eventAttributeCategoryOptions = attributeCategoryOptions
        ? { attributeCategoryOptions: convertCategoryOptionsToServer(attributeCategoryOptions, serverMinorVersion) }
        : {};

    const event: any = {
        status: convertStatusOut(stageComplete),
        geometry: standardGeoJson(stageGeometry),
        occurredAt: convertFn(stageOccurredAt, dataElementTypes.DATE),
        scheduledAt: convertFn(enrolledAt, dataElementTypes.DATE),
        programStage: firstStageMetadata.id,
        program: programId,
        orgUnit: orgUnitId,
        ...eventAttributeCategoryOptions,
    };

    const dataValues = currentEventValues ? Object.keys(currentEventValues).reduce((acc, dataElement) => {
        acc.push({ dataElement, value: currentEventValues[dataElement] });
        return acc;
    }, []) : undefined;

    if (dataValues) {
        event.dataValues = dataValues;
    }

    if (assignee) {
        event.assignedUser = assignee;
    }
    return event;
};
