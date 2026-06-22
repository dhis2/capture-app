import log from 'loglevel';
import { buildProgramMetadata } from '../useProgramMetadata';

// Mock the cached-data hooks so importing the module under test does not pull the react-query /
// IndexedDB module graph (untransformed node_modules ESM). buildProgramMetadata uses none of them.
jest.mock('../../../../../../utils/cachedDataHooks/useProgramFromIndexedDB', () => ({}));
jest.mock('../../../../../../utils/cachedDataHooks/useDataElementsFromIndexedDB', () => ({}));
jest.mock('../../../../../../utils/cachedDataHooks/useOptionSetsFromIndexedDB', () => ({}));
jest.mock('capture-core-utils', () => ({
    errorCreator: message => detail => ({ message, ...detail }),
}));
jest.mock('loglevel');

const createStage = (programStageDataElements, id = 'stageA') => ({
    id,
    access: { data: { read: true, write: true } },
    repeatable: false,
    hideDueDate: false,
    enableUserAssignment: false,
    programStageDataElements,
});

const accessibleDe = {
    id: 'deAccessible',
    valueType: 'TEXT',
    displayName: 'Accessible DE',
    displayFormName: 'Accessible DE',
    optionSetValue: false,
};

describe('buildProgramMetadata', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Regression for DHIS2-21669: a non-superuser without metadata access to a data element used by
    // a program stage crashed the enrollment dashboard. The program keeps the reference, but the
    // data element query filters it out by sharing, so it is absent from the dictionary. Previously
    // the build dereferenced the undefined data element (`dataElement.id`) and threw.
    it('omits a program stage data element whose data element is inaccessible, without throwing', () => {
        const program = {
            programStages: [createStage([
                { displayInReports: true, dataElementId: 'deAccessible' },
                { displayInReports: true, dataElementId: 'deInaccessible' },
            ])],
        };
        const dataElementDictionary = { deAccessible: accessibleDe };

        let result;
        expect(() => {
            result = buildProgramMetadata(program, dataElementDictionary, {});
        }).not.toThrow();

        const psdes = result.programStages[0].programStageDataElements;
        expect(psdes).toHaveLength(1);
        expect(psdes[0].dataElement.id).toBe('deAccessible');
        expect(psdes.some(psde => psde.dataElement.id === 'deInaccessible')).toBe(false);
    });

    it('logs an error identifying the omitted (inaccessible) data element', () => {
        const program = {
            programStages: [createStage([
                { displayInReports: true, dataElementId: 'deInaccessible' },
            ])],
        };

        buildProgramMetadata(program, {}, {});

        expect(log.error).toHaveBeenCalledTimes(1);
        expect(log.error).toHaveBeenCalledWith(
            expect.objectContaining({ dataElementId: 'deInaccessible' }),
        );
    });

    it('maps accessible data elements, resolving the option set from the dictionary', () => {
        const program = {
            programStages: [createStage([
                { displayInReports: true, dataElementId: 'deAccessible' },
                { displayInReports: false, dataElementId: 'deWithOptionSet' },
            ])],
        };
        const dataElementDictionary = {
            deAccessible: accessibleDe,
            deWithOptionSet: {
                id: 'deWithOptionSet',
                valueType: 'TEXT',
                displayName: 'With option set',
                displayFormName: 'With option set',
                optionSetValue: true,
                optionSet: { id: 'os1' },
            },
        };
        const optionSetDictionary = { os1: { options: [{ name: 'A', code: 'a' }] } };

        const result = buildProgramMetadata(program, dataElementDictionary, optionSetDictionary);
        const psdes = result.programStages[0].programStageDataElements;

        expect(log.error).not.toHaveBeenCalled();
        expect(psdes).toHaveLength(2);
        expect(psdes[0]).toEqual({
            displayInReports: true,
            dataElement: {
                id: 'deAccessible',
                valueType: 'TEXT',
                displayName: 'Accessible DE',
                displayFormName: 'Accessible DE',
                optionSet: {},
            },
        });
        expect(psdes[1].dataElement.optionSet).toEqual({ options: [{ name: 'A', code: 'a' }] });
    });
});
