import { variableSourceTypes } from '@dhis2/rules-engine-javascript';
import {
    TrackerProgram,
    ProgramStage,
    RenderFoundation,
    Section,
    DataElement,
    dataElementTypes,
    OptionSet,
    Option,
} from '../../metaData';
import { getApplicableRuleEffectsForTrackerProgram } from '..';

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

describe('getApplicableRuleEffectsForTrackerProgram', () => {
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

    const otherEvents = [
        {
            da1Id: 'otherEventText',
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
        },
    ];

    const orgUnit = { id: 'DiszpKrYNg8', code: 'Ngelehun CHC' };

    const enrollmentData = {
        enrolledAt: '2021-05-31T00:00:00.000',
        enrollmentId: 'vVtmDlsu3me',
        occurredAt: '2021-05-31T00:00:00.000',
    };

    const programStage = new ProgramStage((stage) => {
        stage.id = 'st1Id';
        stage.name = 'stage1';
        stage.programRules = [
            {
                id: 'rule1Id',
                name: 'rule1',
                displayName: 'rule1',
                priority: 1,
                condition: 'true',
                programId: 'IpHINAT79UW',
                programStageId: 'st1Id',
                programRuleActions: [],
            },
        ];

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

    const program = new TrackerProgram((initProgram) => {
        initProgram.id = 'IpHINAT79UW';
        initProgram.attributes = [
            new DataElement((element1) => {
                element1.id = 'zDhUuAYrxNC';
                element1.name = 'SomeText';
                element1.type = dataElementTypes.TEXT;
            }),
            new DataElement((element2) => {
                element2.id = 'lZGmxYbs97q';
                element2.name = 'someNumber';
                element2.type = dataElementTypes.NUMBER;
            }),
            new DataElement((element3) => {
                element3.id = 'lZGmxYbs96q';
                element3.name = 'SomeDate';
                element3.type = dataElementTypes.DATE;
                element3.optionSet = { id: 'optionSet', name: 'optionSet', code: 'optionSet' };
            }),
            new DataElement((element4) => {
                element4.id = 'w75KJ2mc4zz';
                element4.name = 'SomeOrganinsationUnit';
                element4.type = dataElementTypes.ORGANISATION_UNIT;
            }),
        ];
        initProgram.addStage(programStage);
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

    const attributeValues = {
        zDhUuAYrxNC: 'someTextValue',
        lZGmxYbs97q: 5,
        lZGmxYbs96q: '1995-12-17T03:24:00',
    };

    test('RulesEngine called with computed arguments from getApplicableRuleEffectsForTrackerProgram', () => {
        getApplicableRuleEffectsForTrackerProgram({
            program,
            stage: programStage,
            orgUnit,
            currentEvent,
            otherEvents,
            attributeValues,
            enrollmentData,
        });

        const rulesEngineInput = mockGetProgramRuleEffects.mock.calls[0][0];

        const { optionSets, dataElements, trackedEntityAttributes } = rulesEngineInput;
        expect(Object.keys(optionSets).length).toBe(1);
        expect(Object.keys(dataElements).length).toBe(1);
        expect(Object.keys(trackedEntityAttributes).length).toBe(4);

        const { programRules, constants } = rulesEngineInput.programRulesContainer;
        expect(programRules.length).toBe(2);
        expect(constants.length).toBe(1);

        expect(rulesEngineInput).toMatchSnapshot();
    });

    test('Hierarchical result', () => {
        const effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage: programStage,
            orgUnit,
            currentEvent,
            otherEvents,
            attributeValues,
            enrollmentData,
        });

        expect(effects.DISPLAYTEXT).toBeDefined();
    });

    test('Flat result', () => {
        const effects = getApplicableRuleEffectsForTrackerProgram(
            {
                program,
                stage: programStage,
                orgUnit,
                currentEvent,
                otherEvents,
                attributeValues,
                enrollmentData,
            },
            true,
        );

        expect(Array.isArray(effects)).toBe(true);
    });

    test('RulesEngine called without programRules', () => {
        const effects = getApplicableRuleEffectsForTrackerProgram({
            program: new TrackerProgram((initProgram) => {
                initProgram.programRules = [];
            }),
            stage: new ProgramStage((stage) => {
                stage.programRules = [];
            }),
            orgUnit,
            currentEvent,
            otherEvents,
            attributeValues,
            enrollmentData,
        });

        expect(effects).toStrictEqual([]);
    });

    test('currentEvent without a programStageId', () => {
        const effects = getApplicableRuleEffectsForTrackerProgram({
            program,
            stage: programStage,
            orgUnit,
            currentEvent: {},
            otherEvents,
            attributeValues,
            enrollmentData,
        });

        expect(effects.DISPLAYTEXT).toBeDefined();
    });
});
