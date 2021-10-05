// @flow
import { ProgramFactory } from '../../../metaDataMemoryStoreBuilders/programs/factory/program/ProgramFactory';

const objToMap = (object: any) => {
    const map = new Map<string, any>();
    Object.entries(object).forEach((item: any) => {
        map.set(item[1].id, item[1]);
    });
    return map;
};

const convertProgramForEnrollmentFactory = (program) => {
    const { programTrackedEntityAttributes } = program;
    const convertedProgramTrackedEntityAttributes = programTrackedEntityAttributes.map(programAttribute => ({
        allowFutureDate: programAttribute.allowFutureDate,
        displayInList: programAttribute.displayInList,
        mandatory: programAttribute.mandatory,
        renderOptionsAsRadio: programAttribute.renderOptionsAsRadio,
        searchable: programAttribute.searchable,
        trackedEntityAttributeId: programAttribute.trackedEntityAttribute && programAttribute.trackedEntityAttribute.id,
    }));

    return { ...program, programTrackedEntityAttributes: convertedProgramTrackedEntityAttributes };
};

export const buildForm = async (
    trackedEntityAttributes: any,
    optionSets: any,
    trackedEntityTypes: any,
    programAPI: any,
    setProgram: (program: any) => void,
) => {
    const cachedTrackedEntityAttributes: Map<string, any> = objToMap(trackedEntityAttributes);
    const cachedOptionSets: Map<string, any> = objToMap(optionSets);
    const cachedTrackedEntityTypes: Map<string, any> = objToMap(trackedEntityTypes);
    const trackedEntityTypeCollection: Map<string, any> = objToMap(trackedEntityTypes);
    const cachedRelationshipTypes = [];
    const cachedCategories = {};

    const programFactory = new ProgramFactory(
        cachedOptionSets,
        cachedRelationshipTypes,
        cachedTrackedEntityAttributes,
        cachedTrackedEntityTypes,
        cachedCategories,
        trackedEntityTypeCollection,
    );

    const programBuilt = await programFactory.build(convertProgramForEnrollmentFactory(programAPI));
    setProgram(programBuilt);
};
