import { variableSourceTypes } from '@dhis2/rules-engine-javascript';
import {
    EventProgram,
    ProgramStage,
    RenderFoundation,
    Section,
    DataElement,
    dataElementTypes,
    OptionSet,
    Option,
} from '../../metaData';
import { getApplicableRuleEffectsForEventProgram } from '..';

const mockGetProgramRuleEffects = jest.fn().mockImplementation(() => [
    {
        id: 'effectId',
        type: 'DISPLAYTEXT',
        message: 'display effect',
    },
]);

const mockOptionSet = new OptionSet('optionSet1', [new Option('option1', 'opt1')]);
jest.mock('@dhis2/rules-engine-javascript/build/cjs/RulesEngine', () => ({
    RulesEngine: jest
        .fn()
        .mockImplementation(() => ({ getProgramRuleEffects: (...args) => mockGetProgramRuleEffects(...args) })),
}));

jest.mock('../../metaDataMemoryStores/constants/constants.store', () => ({
    constantsStore: { get: () => [{ id: 'constantId1', value: '1' }] },
}));

jest.mock('../../metaDataMemoryStores/optionSets/optionSets.store', () => ({
    optionSetStore: { get: () => [mockOptionSet] },
}));

describe('getApplicableRuleEffectsForEventProgram', () => {
    const currentEvent = {
        da1Id: 'currentEventText',
        dueDate: '2021-05-31T09:51:38.134',
        enrollmentId: 'vVtmDlsu3me',
        enrollmentStatus: 'ACTIVE',
        eventDate: '2021-05-31T00:00:00.000',
        eventId: 'BxGzDJK3JqN',
        orgUnitId: 'DiszpKrYNg8',
        orgUnitName: 'Ngelehun CHC',
        programId: 'IpHINAT79UW',
        programStageId: 'A03MvHHogjR',
        status: 'ACTIVE',
        trackedEntityInstanceId: 'vCGpQAWG17I',
    };

    const orgUnit = { id: 'DiszpKrYNg8', code: 'Ngelehun CHC' };

    const programStage = new ProgramStage((stage) => {
        stage.id = 'EventProgramStage';
        stage.name = 'stage1';
        stage.stageForm = new RenderFoundation((foundation) => {
            const section = new Section((initSection) => {
                initSection.id = 's1Id';
                initSection.name = 'section1';
                const dataElement = new DataElement((initDataElement) => {
                    initDataElement.id = 'da1Id';
                    initDataElement.name = 'dataElement1';
                    initDataElement.type = dataElementTypes.TEXT;
                });
                initSection.addElement(dataElement);
            });
            foundation.addSection(section);
        });
    });

    const program = new EventProgram((initProgram) => {
        initProgram.id = 'IpHINAT79UW';
        initProgram.stage = programStage;
        initProgram.programRuleVariables = [
            {
                dataElementId: 'UXz7xuGCEhU',
                displayName: 'Test',
                id: 'PUQZWgmQ0jx',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
                useNameForOptionSet: true,
            },
            {
                dataElementId: 'H6uSAMO5WLD',
                displayName: 'apgarcomment',
                id: 'aKpfPKSRQnv',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
                useNameForOptionSet: true,
            },
            {
                dataElementId: 'a3kGcGDCuk6',
                displayName: 'apgarscore',
                id: 'g2GooOydipB',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
                useNameForOptionSet: true,
            },
        ];

        initProgram.programRules = [
            {
                condition: 'true',
                displayName: 'TestRule',
                id: 'JJDQxgHuuL2',
                programId: 'IpHINAT79UW',
                programRuleActions: [
                    {
                        data: '#{Test}',
                        id: 'CQaifjkoFEU',
                        location: 'feedback',
                        programRuleActionType: 'DISPLAYTEXT',
                    },
                ],
            },
        ];
    });

    test('RulesEngine called with computed arguments from getApplicableRuleEffectsForEventProgram', () => {
        getApplicableRuleEffectsForEventProgram({
            program,
            orgUnit,
            currentEvent,
        });

        const rulesEngineInput = mockGetProgramRuleEffects.mock.calls[0][0];

        const { optionSets, dataElements } = rulesEngineInput;
        expect(Object.keys(optionSets).length).toBe(1);
        expect(Object.keys(dataElements).length).toBe(1);

        const { programRules, constants } = rulesEngineInput.programRulesContainer;
        expect(programRules.length).toBe(1);
        expect(constants.length).toBe(1);

        expect(rulesEngineInput).toMatchSnapshot();
    });

    test('Hierarchical result', () => {
        const effects = getApplicableRuleEffectsForEventProgram({
            program,
            orgUnit,
            currentEvent,
        });

        expect(effects.DISPLAYTEXT).toBeDefined();
    });

    test('RulesEngine called without programRules', () => {
        const effects = getApplicableRuleEffectsForEventProgram({
            program: new EventProgram((initProgram) => {
                initProgram.programRules = [];
            }),
            orgUnit,
            currentEvent,
        });

        expect(effects).toStrictEqual([]);
    });
});
