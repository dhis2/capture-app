import { runRulesForEnrollmentPage } from '../actionsCreator/runRulesForEnrollmentPage';

describe('Enrollment Page Rule Engines', () => {
    const allEvents = { all: [
        {
            UXz7xuGCEhU: 1222,
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
    ],
    byStage: {},
    };
    const orgUnit = { id: 'DiszpKrYNg8', code: 'Ngelehun CHC' };
    const enrollmentData = {
        enrollmentDate: '2021-05-31T00:00:00.000',
        enrollmentId: 'vVtmDlsu3me',
        incidentDate: '2021-05-31T00:00:00.000',
    };

    describe.each([
        [
            {
                program: {
                    programRules: [{
                        condition: 'true',
                        displayName: 'TestRule',
                        id: 'JJDQxgHuuL2',
                        programId: 'IpHINAT79UW',
                        programRuleActions: [{
                            data: '#{Test}',
                            id: 'CQaifjkoFEU',
                            location: 'feedback',
                            programRuleActionType: 'DISPLAYTEXT',
                        }],
                    }],
                    programRuleVariables: [
                        {
                            dataElementId: 'UXz7xuGCEhU',
                            displayName: 'Test',
                            id: 'PUQZWgmQ0jx',
                            programId: 'IpHINAT79UW',
                            programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
                            useNameForOptionSet: true,
                        },
                        {
                            dataElementId: 'H6uSAMO5WLD',
                            displayName: 'apgarcomment',
                            id: 'aKpfPKSRQnv',
                            programId: 'IpHINAT79UW',
                            programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
                            useNameForOptionSet: true,
                        },
                        { dataElementId: 'a3kGcGDCuk6',
                            displayName: 'apgarscore',
                            id: 'g2GooOydipB',
                            programId: 'IpHINAT79UW',
                            programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
                            useNameForOptionSet: true,
                        },
                    ],
                    id: 'IpHINAT79UW',
                },
                dataElementsInProgram: {
                    UXz7xuGCEhU: {
                        id: 'UXz7xuGCEhU',
                        value: 1222,
                        valueType: 'NUMBER',
                    },
                },
                teiValues: {
                    lZGmxYbs97q: '7471393',
                    w75KJ2mc4zz: 'FirstNameTest',
                    zDhUuAYrxNC: 'LastNameTest',
                },
                trackedEntityAttributes: [
                    {
                        id: 'zDhUuAYrxNC',
                        valueType: 'TEXT',
                    }, {
                        id: 'lZGmxYbs97q',
                        valueType: 'TEXT',
                    }, {
                        id: 'w75KJ2mc4zz',
                        valueType: 'TEXT',
                    },
                ],
            },
            [{ id: 'feedback',
                type: 'DISPLAYTEXT',
                displayText: {
                    id: 'CQaifjkoFEU',
                    message: 'undefined 1222',
                } }],
        ],
        [
            {
                program: null,
            },
            null,
        ],
    ])('where the default values', ({
        program,
        dataElementsInProgram,
        teiValues,
        trackedEntityAttributes,
    }, expected) => {
        test('Tests on runRulesForEnrollmentPage function', () => {
            const rulesEffects = runRulesForEnrollmentPage({
                program,
                orgUnit,
                allEventsData: allEvents,
                dataElementsInProgram,
                teiValues,
                trackedEntityAttributes,
                enrollmentData,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });
});
