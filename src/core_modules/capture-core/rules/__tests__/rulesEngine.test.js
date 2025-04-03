import { variableSourceTypes } from '@dhis2/rules-engine-javascript';
import { rulesEngine } from '../rulesEngine';

describe('Rules engine', () => {
    const constants = [];
    const dataElementsInProgram = {};
    const programRuleVariables = [];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {};
    const currentEvent = {};

    test('Rules engine without programRules', () => {
        // when
        const programRules = undefined;
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([]);
    });

    test('Program rule without an condition', () => {
        // when
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: undefined,
                description: 'Show warning if hemoglobin is dangerously low',
                displayName: 'Hemoglobin warning',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'suS9GnraCx1',
                        content: 'Hemoglobin value lower than normal',
                        displayContent: 'Hemoglobin value lower than normal',
                        dataElementId: 'vANAXwtLwcT',
                        programRuleActionType: 'SHOWWARNING',
                    },
                ],
            },
        ];
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([]);
    });

    test('Program rule condition error handeling', () => {
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: 'i am a condition with error',
                description: 'Show warning if hemoglobin is dangerously low',
                displayName: 'Hemoglobin warning',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'suS9GnraCx1',
                        content: 'Hemoglobin value lower than normal',
                        displayContent: 'Hemoglobin value lower than normal',
                        dataElementId: 'vANAXwtLwcT',
                        programRuleActionType: 'SHOWWARNING',
                    },
                ],
            },
        ];
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([]);
    });

    test('user roles', () => {
        rulesEngine.setSelectedUserRoles(['ADMIN']);
        expect(rulesEngine.userRoles).toEqual(['ADMIN']);
    });

    test('SHOW_WARNING program rule effect with a general target', () => {
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: 'true',
                description: 'Show warning if hemoglobin is dangerously low',
                displayName: 'Hemoglobin warning',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'SWfdB5lX0fk',
                        content: 'Hemoglobin value lower than normal',
                        displayContent: 'Hemoglobin value lower than normal',
                        programRuleActionType: 'SHOWWARNING',
                    },
                ],
            },
        ];
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                id: 'general',
                type: 'SHOWWARNING',
                warning: {
                    id: 'SWfdB5lX0fk',
                    message: 'Hemoglobin value lower than normal ',
                },
            },
        ]);
    });

    test('SHOW_ERROR program rule effect with a general target', () => {
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: 'true',
                description: 'Show error if hemoglobin is dangerously low',
                displayName: 'Hemoglobin error',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'SWfdB5lX0fk',
                        content: 'Hemoglobin value lower than normal',
                        displayContent: 'Hemoglobin value lower than normal',
                        programRuleActionType: 'SHOWERROR',
                    },
                ],
            },
        ];
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                id: 'general',
                type: 'SHOWERROR',
                error: {
                    id: 'SWfdB5lX0fk',
                    message: 'Hemoglobin value lower than normal ',
                },
            },
        ]);
    });

    test('HIDE_PROGRAM_STAGE program rule effect corner case. The action does not have a program stage id', () => {
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: 'true',
                description: 'Show warning if hemoglobin is dangerously low',
                displayName: 'Hemoglobin warning',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'nKNmayYigcy',
                        programRuleActionType: 'HIDEPROGRAMSTAGE',
                    },
                ],
            },
        ];
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([]);
    });

    test('HIDE_SECTION program rule effect corner case. The action does not have a program stage section id', () => {
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: 'true',
                description: 'Show warning if hemoglobin is dangerously low',
                displayName: 'Hemoglobin warning',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'nKNmayYigcy',
                        programRuleActionType: 'HIDESECTION',
                    },
                ],
            },
        ];
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([]);
    });

    test('The rules engine can enable verbose logging', () => {
        // When
        rulesEngine.setFlags({ verbose: true });

        // Then
        expect(rulesEngine.getFlags()).toEqual({ verbose: true });
    });

    test('Rules are calculated when verbose is set', () => {
        const programRules = [
            {
                id: 'GC4gpdoSD4r',
                condition: 'true',
                description: 'Show error if hemoglobin is dangerously low',
                displayName: 'Hemoglobin error',
                programId: 'lxAQ7Zs9VYR',
                programRuleActions: [
                    {
                        id: 'SWfdB5lX0fk',
                        content: 'Hemoglobin value lower than normal',
                        displayContent: 'Hemoglobin value lower than normal',
                        programRuleActionType: 'SHOWERROR',
                    },
                ],
            },
        ];

        // When
        rulesEngine.setFlags({ verbose: true });
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                id: 'general',
                type: 'SHOWERROR',
                error: {
                    id: 'SWfdB5lX0fk',
                    message: 'Hemoglobin value lower than normal ',
                },
            },
        ]);
    });
});

describe('Program Rule Variables corner cases', () => {
    const constants = [];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {};

    test('without currentEvent and without otherEvents', () => {
        // given
        const programRules = [
            {
                id: 'g82J3xsNer9',
                condition: 'true',
                displayName: 'Testing the variables source type',
                programId: 'PNClHaZARtz',
                programRuleActions: [
                    {
                        id: 'Eeb7Ixr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        location: 'feedback',
                        programRuleActionType: 'DISPLAYTEXT',
                    },
                    {
                        id: 'ElktIxr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        content: 'event_status',
                        programRuleActionType: 'ASSIGN',
                    },
                ],
            },
        ];
        const dataElementsInProgram = {
            f8j4XDEozvj: { id: 'f8j4XDEozvj', valueType: 'INTEGER', optionSetId: undefined },
        };
        const currentEvent = undefined;
        const programRuleVariables = [
            {
                id: 'DoRHHfNPccb',
                dataElementId: 'f8j4XDEozvj',
                displayName: 'INFECTION_SOURCE',
                programId: 'PNClHaZARtz',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
                useNameForOptionSet: false,
            },
            {
                id: 'lokHHfNPccb',
                dataElementId: 'f8j4XDEozvj',
                displayName: 'INFECTION_SOURCE',
                programId: 'PNClHaZARtz',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT,
                useNameForOptionSet: false,
            },
            {
                id: 'DolgHfNPccb',
                dataElementId: 'f8j4XDEozvj',
                displayName: 'INFECTION_SOURCE',
                programId: 'PNClHaZARtz',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
                useNameForOptionSet: false,
            },
        ];

        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            selectedOrgUnit: orgUnit,
            optionSets,
            currentEvent,
            dataElements: dataElementsInProgram,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                type: 'DISPLAYTEXT',
                id: 'feedback',
                displayText: { id: 'Eeb7Ixr4Pvx', message: "d2:left('dhis', 3) =  dhi" },
            },
        ]);
    });

    test('without currentEvent and with otherEvents', () => {
        // given
        const programRules = [
            {
                id: 'g82J3xsNer9',
                condition: 'true',
                displayName: 'Testing the variables source type',
                programId: 'PNClHaZARtz',
                programRuleActions: [
                    {
                        id: 'Eeb7Ixr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        location: 'feedback',
                        programRuleActionType: 'DISPLAYTEXT',
                    },
                    {
                        id: 'ElktIxr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        content: 'event_status',
                        programRuleActionType: 'ASSIGN',
                    },
                ],
            },
        ];
        const dataElementsInProgram = {
            f8j4XDEozvj: { id: 'f8j4XDEozvj', valueType: 'INTEGER', optionSetId: undefined },
        };
        const currentEvent = undefined;
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
                occurredAt: '2021-05-31T00:00:00.000',
            },
        ];
        const programRuleVariables = [
            {
                id: 'lokHHfNPccb',
                dataElementId: 'f8j4XDEozvj',
                displayName: 'INFECTION_SOURCE',
                programId: 'PNClHaZARtz',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT,
                useNameForOptionSet: false,
            },
        ];

        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            selectedOrgUnit: orgUnit,
            optionSets,
            currentEvent,
            dataElements: dataElementsInProgram,
            otherEvents,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                type: 'DISPLAYTEXT',
                id: 'feedback',
                displayText: { id: 'Eeb7Ixr4Pvx', message: "d2:left('dhis', 3) =  dhi" },
            },
        ]);
    });

    test('with currentEvent and with otherEvents', () => {
        // given
        const programRules = [
            {
                id: 'g82J3xsNer9',
                condition: 'true',
                displayName: 'Testing the variables source type',
                programId: 'PNClHaZARtz',
                programRuleActions: [
                    {
                        id: 'Eeb7Ixr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        location: 'feedback',
                        programRuleActionType: 'DISPLAYTEXT',
                    },
                    {
                        id: 'ElktIxr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        content: 'event_status',
                        programRuleActionType: 'ASSIGN',
                    },
                ],
            },
        ];
        const dataElementsInProgram = {
            f8j4XDEozvj: { id: 'f8j4XDEozvj', valueType: 'INTEGER', optionSetId: undefined },
            GieVkTxp4HH: { id: 'GieVkTxp4HH', valueType: 'NUMBER', optionSetId: undefined },
        };
        const currentEvent = {
            occurredAt: '2020-07-14T22:00:00.000Z',
            da1Id: 'currentEventText',
            dueDate: '2021-05-31T09:51:38.134',
            enrollmentId: 'vVtmDlsu3me',
            enrollmentStatus: 'ACTIVE',
            eventDate: '2021-05-31T00:00:00.000',
            eventId: 'BlgrDJK3JqN',
            orgUnitId: 'DiszpKrYNg8',
            orgUnitName: 'Ngelehun CHC',
            programId: 'IpHINAT79UW',
            programStageId: 'A03MvHHogjR',
            status: 'ACTIVE',
            trackedEntityInstanceId: 'vCsfsAWG17I',
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
                occurredAt: '2021-05-31T00:00:00.000',
            },
        ];
        const programRuleVariables = [
            {
                id: 'lokHHfNPccb',
                dataElementId: 'f8j4XDEozvj',
                displayName: 'INFECTION_SOURCE',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT,
                useNameForOptionSet: false,
            },
            {
                id: 'ZghUnCAulEk.GieVkTxp4HH',
                displayName: 'ZghUnCAulEk.GieVkTxp4HH',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                programStageId: 'A03MvHHogjR',
                dataElementId: 'GieVkTxp4HH',
                programId: 'IpHINAT79UW',
            },
            {
                id: 'Zj7UnsdhlEk.GieVkTxp4HH',
                displayName: 'Zj7UnsdhlEk.GieVkTxp4HH',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                dataElementId: 'GieVkTxp4HH',
                programId: 'IpHINAT79UW',
            },
            {
                id: 'Zj7luCAulEk.GieVkTxp4HH',
                displayName: 'Zj7luCAulEk.GieVkTxp4HH',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                programStageId: 'AsdfMvHHgjR',
                dataElementId: 'GieVkTxp4HH',
                programId: 'IpHINAT79UW',
            },
        ];

        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            selectedOrgUnit: orgUnit,
            optionSets,
            currentEvent,
            dataElements: dataElementsInProgram,
            otherEvents,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                type: 'DISPLAYTEXT',
                id: 'feedback',
                displayText: { id: 'Eeb7Ixr4Pvx', message: "d2:left('dhis', 3) =  dhi" },
            },
        ]);
    });

    test('currentEvent without occurredAt date', () => {
        // given
        const programRules = [
            {
                id: 'g82J3xsNer9',
                condition: 'true',
                displayName: 'Testing the variables source type',
                programId: 'PNClHaZARtz',
                programRuleActions: [
                    {
                        id: 'Eeb7Ixr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        location: 'feedback',
                        programRuleActionType: 'DISPLAYTEXT',
                    },
                    {
                        id: 'ElktIxr4Pvx',
                        displayContent: "d2:left('dhis', 3) = ",
                        data: "d2:left('dhis', 3)",
                        content: 'event_status',
                        programRuleActionType: 'ASSIGN',
                    },
                ],
            },
        ];
        const dataElementsInProgram = {
            f8j4XDEozvj: { id: 'f8j4XDEozvj', valueType: 'INTEGER', optionSetId: undefined },
            GieVkTxp4HH: { id: 'GieVkTxp4HH', valueType: 'NUMBER', optionSetId: undefined },
        };
        const currentEvent = {
            da1Id: 'currentEventText',
            dueDate: '2021-05-31T09:51:38.134',
            enrollmentId: 'vVtmDlsu3me',
            enrollmentStatus: 'ACTIVE',
            eventDate: '2021-05-31T00:00:00.000',
            eventId: 'BlgrDJK3JqN',
            orgUnitId: 'DiszpKrYNg8',
            orgUnitName: 'Ngelehun CHC',
            programId: 'IpHINAT79UW',
            programStageId: 'A03MvHHogjR',
            status: 'ACTIVE',
            trackedEntityInstanceId: 'vCsfsAWG17I',
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
                occurredAt: '2021-05-31T00:00:00.000',
            },
        ];
        const programRuleVariables = [
            {
                id: 'lokHHfNPccb',
                dataElementId: 'f8j4XDEozvj',
                displayName: 'INFECTION_SOURCE',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT,
                useNameForOptionSet: false,
            },
            {
                id: 'ZghUnCAulEk.GieVkTxp4HH',
                displayName: 'ZghUnCAulEk.GieVkTxp4HH',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                programStageId: 'A03MvHHogjR',
                dataElementId: 'GieVkTxp4HH',
                programId: 'IpHINAT79UW',
            },
            {
                id: 'Zj7UnsdhlEk.GieVkTxp4HH',
                displayName: 'Zj7UnsdhlEk.GieVkTxp4HH',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                dataElementId: 'GieVkTxp4HH',
                programId: 'IpHINAT79UW',
            },
            {
                id: 'Zj7luCAulEk.GieVkTxp4HH',
                displayName: 'Zj7luCAulEk.GieVkTxp4HH',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
                programStageId: 'AsdfMvHHgjR',
                dataElementId: 'GieVkTxp4HH',
                programId: 'IpHINAT79UW',
            },
        ];

        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            selectedOrgUnit: orgUnit,
            optionSets,
            currentEvent,
            dataElements: dataElementsInProgram,
            otherEvents,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                type: 'DISPLAYTEXT',
                id: 'feedback',
                displayText: { id: 'Eeb7Ixr4Pvx', message: "d2:left('dhis', 3) =  dhi" },
            },
        ]);
    });

    test('programRuleVariable with a value type not supported', () => {
        // given
        const trackedEntityAttributes = {
            w75KJ2mc4zz: { id: 'w75KJ2mc4zz', valueType: 'UNKNOWN' },
        };
        const programRules = [];
        const currentEvent = {};
        const programRuleVariables = [
            {
                id: 'DoRHHfNPccb',
                displayName: 'INFECTION_SOURCE',
                trackedEntityAttributeId: 'w75KJ2mc4zz',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.TEI_ATTRIBUTE,
                useNameForOptionSet: false,
            },
        ];

        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            selectedOrgUnit: orgUnit,
            optionSets,
            currentEvent,
            trackedEntityAttributes,
        });

        // then
        expect(rulesEffects).toEqual([]);
    });

    test('HIDEFIELD effect when the form values are empty', () => {
        // given
        const programRules = [
            {
                id: 'g82J3xsNer9',
                condition: 'true',
                displayName: 'Testing the variables source type',
                programId: 'PNClHaZARtz',
                programRuleActions: [
                    { id: 'hwgyO59SSxu', trackedEntityAttributeId: 'zDhUuAYrxNC', programRuleActionType: 'HIDEFIELD' },
                ],
            },
        ];
        const trackedEntityAttributes = {
            zDhUuAYrxNC: { id: 'zDhUuAYrxNC', valueType: 'TEXT' },
        };
        const programRuleVariables = [
            {
                id: 'DoRHHfNPccb',
                trackedEntityAttributeId: 'w75KJ2mc4zz',
                displayName: 'INFECTION_SOURCE',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
                useNameForOptionSet: false,
            },
            {
                id: 'lokHHfNPccb',
                trackedEntityAttributeId: 'w75KJ2mc4zz',
                displayName: 'INFECTION_SOURCE',
                programId: 'IpHINAT79UW',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
                useNameForOptionSet: false,
            },
            {
                id: 'Zj7UnCAulEk',
                displayName: 'Zj7UnCAulEk',
                programRuleVariableSourceType: variableSourceTypes.TEI_ATTRIBUTE,
                trackedEntityAttributeId: 'w75KJ2mc4zz',
                programId: 'IpHINAT79UW',
            },
        ];
        const teiValues = {};
        const enrollmentData = { enrolledAt: '2020-05-14T22:00:00.000Z' };
        const currentEvent = undefined;

        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            trackedEntityAttributes,
            selectedEntity: teiValues,
            selectedEnrollment: enrollmentData,
            selectedOrgUnit: orgUnit,
            optionSets,
            currentEvent,
        });

        // then
        expect(rulesEffects).toEqual([
            {
                content: undefined,
                id: 'zDhUuAYrxNC',
                targetDataType: 'trackedEntityAttribute',
                type: 'HIDEFIELD',
            },
        ]);
    });
});
