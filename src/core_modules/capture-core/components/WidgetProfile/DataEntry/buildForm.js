// @flow
import { EnrollmentFactory } from './factory';

const objToMap = (object: any) => {
    const map = new Map<string, any>();
    Object.entries(object).forEach((item: any) => {
        map.set(item[1].id, item[1]);
    });
    return map;
};

const asyncForEach = async function (callback) {
    for (let index = 0; index < this.length; index++) {
        // eslint-disable-next-line no-await-in-loop
        await callback(this[index], index, this);
    }
};

const convertProgramForEnrollmentFactory = (program) => {
    const { programTrackedEntityAttributes, programStages } = program;
    let convertedProgramTrackedEntityAttributes = programTrackedEntityAttributes.map(programAttribute => ({
        allowFutureDate: programAttribute.allowFutureDate,
        displayInList: programAttribute.displayInList,
        mandatory: programAttribute.mandatory,
        renderOptionsAsRadio: programAttribute.renderOptionsAsRadio,
        searchable: programAttribute.searchable,
        trackedEntityAttributeId: programAttribute.trackedEntityAttribute && programAttribute.trackedEntityAttribute.id,
    }));
    let convertedProgramStages = programStages;

    if (!convertedProgramTrackedEntityAttributes.asyncForEach) {
        convertedProgramTrackedEntityAttributes = [...convertedProgramTrackedEntityAttributes, asyncForEach];
    }

    if (!convertedProgramStages.asyncForEach) {
        convertedProgramStages = programStages.map(programStage => ({
            ...programStage,
            programStageDataElements: { ...programStage.programStageDataElements, asyncForEach },
        }));
        convertedProgramStages = [...convertedProgramStages, asyncForEach];
    }

    return {
        ...program,
        programTrackedEntityAttributes: convertedProgramTrackedEntityAttributes,
        programStages: convertedProgramStages,
    };
};

export const buildForm = async (programAPI: any, setEnrollment: (enrollment: any) => void) => {
    const trackedEntityTypes = [programAPI.trackedEntityType];
    const trackedEntityAttributes = programAPI.programTrackedEntityAttributes.reduce(
        (acc, currentValue) => [...acc, currentValue.trackedEntityAttribute],
        [],
    );
    const optionSets = trackedEntityAttributes.reduce(
        (acc, currentValue) => (currentValue.optionSet ? [...acc, currentValue.optionSet] : acc),
        [],
    );

    const cachedTrackedEntityAttributes: Map<string, any> = objToMap(trackedEntityAttributes);
    const cachedOptionSets: Map<string, any> = objToMap(optionSets);
    const cachedTrackedEntityTypes: Map<string, any> = objToMap(trackedEntityTypes);
    const trackedEntityTypeCollection: Map<string, any> = objToMap(trackedEntityTypes);

    const enrollmentFactory = new EnrollmentFactory({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        cachedTrackedEntityTypes,
        trackedEntityTypeCollection,
    });
    const cachedProgram = convertProgramForEnrollmentFactory(programAPI);
    const enrollment = await enrollmentFactory.build(cachedProgram);
    setEnrollment(enrollment);
};
