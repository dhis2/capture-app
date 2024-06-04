import { rulesEngineEffectTargetDataTypes, variableSourceTypes } from '@dhis2/rules-engine-javascript';
import { rulesEngine } from '../rulesEngine';
import { systemSettingsStore } from '../../metaDataMemoryStores';

describe('Event Event rules engine', () => {
    // these variables are shared between each test
    const constants = [
        { id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 },
        { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 },
    ];
    const dataElementsInProgram = {
        sWoqcoByYmD: { id: 'sWoqcoByYmD', valueType: 'BOOLEAN' },
        Ok9OQpitjQr: { id: 'Ok9OQpitjQr', valueType: 'BOOLEAN' },
        vANAXwtLwcT: { id: 'vANAXwtLwcT', valueType: 'NUMBER' },
    };
    const programRules = [
        {
            id: 'GC4gpdoSD4r',
            condition: '#{hemoglobin} < 9',
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
        {
            id: 'dahuKlP7jR2',
            condition: '#{hemoglobin} > 99',
            description: 'Show error for hemoglobin value higher than 99',
            displayName: 'Show error for high hemoglobin value',
            programId: 'lxAQ7Zs9VYR',
            programRuleActions: [
                {
                    id: 'UUwZWS8uirn',
                    content: 'The hemoglobin value cannot be above 99',
                    displayContent: 'The hemoglobin value cannot be above 99',
                    dataElementId: 'vANAXwtLwcT',
                    programRuleActionType: 'SHOWERROR',
                },
            ],
        },
        {
            id: 'xOe5qCzRS0Y',
            condition: '!#{womanSmoking} ',
            description: 'Hide smoking cessation councelling dataelement unless patient is smoking',
            displayName: 'Hide smoking cessation councelling',
            programId: 'lxAQ7Zs9VYR',
            programRuleActions: [
                { id: 'hwgyO59SSxu', dataElementId: 'Ok9OQpitjQr', programRuleActionType: 'HIDEFIELD' },
            ],
        },
    ];
    const programRuleVariables = [
        {
            id: 'Z92dJO9gIje',
            dataElementId: 'sWoqcoByYmD',
            displayName: 'womanSmoking',
            programId: 'lxAQ7Zs9VYR',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
            useNameForOptionSet: true,
        },
        {
            id: 'omrL0gtPpDL',
            dataElementId: 'vANAXwtLwcT',
            displayName: 'hemoglobin',
            programId: 'lxAQ7Zs9VYR',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
            useNameForOptionSet: true,
        },
    ];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {};

    describe.each([
        [
            { vANAXwtLwcT: 0 },
            [
                {
                    id: 'vANAXwtLwcT',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    message: 'Hemoglobin value lower than normal ',
                    type: 'SHOWWARNING',
                },
                { id: 'Ok9OQpitjQr', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT, type: 'HIDEFIELD' },
            ],
        ],
        [
            { vANAXwtLwcT: 9 },
            [{ id: 'Ok9OQpitjQr', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT, type: 'HIDEFIELD' }],
        ],
        [
            { vANAXwtLwcT: 99 },
            [{ id: 'Ok9OQpitjQr', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT, type: 'HIDEFIELD' }],
        ],
        [
            { vANAXwtLwcT: 100 },
            [
                {
                    id: 'vANAXwtLwcT',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    message: 'The hemoglobin value cannot be above 99 ',
                    type: 'SHOWERROR',
                },
                { id: 'Ok9OQpitjQr', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT, type: 'HIDEFIELD' },
            ],
        ],
    ])('where value needs to >= 9 and <= 99', (currentEvent, expected) => {
        test(`and given value(s): ${JSON.stringify(currentEvent)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });

    describe.each([
        [
            { sWoqcoByYmD: true },
            [
                {
                    id: 'vANAXwtLwcT',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    message: 'Hemoglobin value lower than normal ',
                    type: 'SHOWWARNING',
                },
            ],
        ],
        [
            { sWoqcoByYmD: false },
            [
                {
                    id: 'vANAXwtLwcT',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    message: 'Hemoglobin value lower than normal ',
                    type: 'SHOWWARNING',
                },
                { id: 'Ok9OQpitjQr', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT, type: 'HIDEFIELD' },
            ],
        ],
    ])('where field is hidden regarding a boolean value', (currentEvent, expected) => {
        test(`and given value(s): ${JSON.stringify(currentEvent)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });
});

describe('Event rules engine', () => {
    // these variables are shared between each test
    const constants = [
        { id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 },
        { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 },
    ];
    const dataElementsInProgram = {
        oZg33kd9taw: { id: 'oZg33kd9taw', valueType: 'TEXT', optionSetId: 'pC3N9N77UmT' },
        SWfdB5lX0fk: { id: 'SWfdB5lX0fk', valueType: 'TRUE_ONLY', optionSetId: undefined },
        qrur9Dvnyt5: { id: 'qrur9Dvnyt5', valueType: 'INTEGER', optionSetId: undefined },
        GieVkTxp4HH: { id: 'GieVkTxp4HH', valueType: 'NUMBER', optionSetId: undefined },
        vV9UWAZohSf: { id: 'vV9UWAZohSf', valueType: 'INTEGER_POSITIVE', optionSetId: undefined },
        eMyVanycQSC: { id: 'eMyVanycQSC', valueType: 'DATE', optionSetId: undefined },
        K6uUAvq500H: { id: 'K6uUAvq500H', valueType: 'TEXT', optionSetId: 'eUZ79clX7y1' },
        msodh3rEMJa: { id: 'msodh3rEMJa', valueType: 'DATE', optionSetId: undefined },
        S33cRBsnXPo: { id: 'S33cRBsnXPo', valueType: 'ORGANISATION_UNIT', optionSetId: undefined },
        fWIAEtYVEGk: { id: 'fWIAEtYVEGk', valueType: 'TEXT', optionSetId: 'iDFPKpFTiVw' },
        ulD2zW0TIy2: { id: 'ulD2zW0TIy2', valueType: 'FILE_RESOURCE' },
    };
    const programRules = [
        {
            id: 'fd3wL1quxGb',
            condition: "#{gender} == 'Male'",
            description: 'Hide pregnant if gender is male',
            displayName: 'Hide pregnant if gender is male',
            programId: 'eBAyeGv0exc',
            programRuleActions: [
                {
                    id: 'IrmpncBsypT',
                    dataElementId: 'SWfdB5lX0fk',
                    programRuleActionType: 'HIDEFIELD',
                    programStageSectionId: 'd7ZILSbPgYh',
                },
            ],
        },
        {
            id: 'x7PaHGvgWY2',
            condition: 'true',
            description: 'Body Mass Index. Weight in kg / height in m square.',
            displayName: 'BMI',
            programId: 'eBAyeGv0exc',
            programRuleActions: [
                {
                    id: 'x7PaHGvgWY2',
                    content: 'BMI',
                    displayContent: 'BMI',
                    data: '#{Zj7UnCAulEk.vV9UWAZohSf}/((#{Zj7UnCAulEk.GieVkTxp4HH}/100)*(#{Zj7UnCAulEk.GieVkTxp4HH}/100))',
                    programRuleActionType: 'DISPLAYKEYVALUEPAIR',
                    location: 'indicators',
                },
            ],
        },
    ];
    const programRuleVariables = [
        {
            id: 'RycV5uDi66i',
            dataElementId: 'qrur9Dvnyt5',
            displayName: 'age',
            programId: 'eBAyeGv0exc',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
            useNameForOptionSet: true,
        },
        {
            id: 'zINGRka3g9N',
            dataElementId: 'oZg33kd9taw',
            displayName: 'gender',
            programId: 'eBAyeGv0exc',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
            useNameForOptionSet: true,
        },
        {
            id: 'Zj7UnCAulEk.vV9UWAZohSf',
            displayName: 'Zj7UnCAulEk.vV9UWAZohSf',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            dataElementId: 'vV9UWAZohSf',
            programId: 'eBAyeGv0exc',
        },
        {
            id: 'Zj7UnCAulEk.GieVkTxp4HH',
            displayName: 'Zj7UnCAulEk.GieVkTxp4HH',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            dataElementId: 'GieVkTxp4HH',
            programId: 'eBAyeGv0exc',
        },
        {
            id: 'Zj7UnCAulEk.GieVkTxp4HH',
            displayName: 'Zj7UnCAulEk.GieVkTxp4HH',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            dataElementId: 'GieVkTxp4HH',
            programId: 'eBAyeGv0exc',
        },
    ];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {
        pC3N9N77UmT: {
            id: 'pC3N9N77UmT',
            displayName: 'Gender',
            version: 0,
            valueType: 'TEXT',
            options: undefined,
        },
    };

    describe.each([
        [
            { oZg33kd9taw: 'Female', SWfdB5lX0fk: null },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { oZg33kd9taw: 'Male', SWfdB5lX0fk: null },
            [
                { id: 'SWfdB5lX0fk', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT, type: 'HIDEFIELD' },
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { oZg33kd9taw: null, SWfdB5lX0fk: null },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
    ])('where field is hidden regarding the gender of the event', (currentEvent, expected) => {
        test(`and given value(s): ${JSON.stringify(currentEvent)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });

    describe.each([
        [
            { qrur9Dvnyt5: null, GieVkTxp4HH: null, vV9UWAZohSf: null },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: null, GieVkTxp4HH: null, vV9UWAZohSf: 85 },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: null, GieVkTxp4HH: 180, vV9UWAZohSf: null },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '0' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: null, GieVkTxp4HH: 180, vV9UWAZohSf: 85 },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '26.234567901234566' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: 40, GieVkTxp4HH: null, vV9UWAZohSf: null },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: 40, GieVkTxp4HH: null, vV9UWAZohSf: 85 },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: 40, GieVkTxp4HH: 180, vV9UWAZohSf: null },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '0' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
        [
            { qrur9Dvnyt5: 40, GieVkTxp4HH: 180, vV9UWAZohSf: 85 },
            [
                {
                    displayKeyValuePair: { id: 'x7PaHGvgWY2', key: 'BMI', value: '26.234567901234566' },
                    id: 'indicators',
                    type: 'DISPLAYKEYVALUEPAIR',
                },
            ],
        ],
    ])('where BMI is calculated', (currentEvent, expected) => {
        test(`and given value(s): ${JSON.stringify(currentEvent)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });
});

describe('Event rules engine', () => {
    // these variables are shared between each test
    const constants = [
        { id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 },
        { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 },
    ];
    const dataElementsInProgram = {
        dyfYIsTFTjG: { id: 'dyfYIsTFTjG', valueType: 'TEXT' },
        XOaXLWuhKzV: { id: 'XOaXLWuhKzV', valueType: 'TEXT', optionSetId: 'WDUwjiW2rGH' },
        AtFlciXnstG: { id: 'AtFlciXnstG', valueType: 'INTEGER_ZERO_OR_POSITIVE' },
        JGnHr6WI3AY: { id: 'JGnHr6WI3AY', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' },
        s3eoonJ8OJb: { id: 's3eoonJ8OJb', valueType: 'DATE' },
        gktroFPckdr: { id: 'gktroFPckdr', valueType: 'TEXT', optionSetId: 'UYDsNdpo2BU' },
        QQLXTXVidW2: { id: 'QQLXTXVidW2', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' },
        ovY6E8BSdto: { id: 'ovY6E8BSdto', valueType: 'TEXT', optionSetId: 'dsgBmIZ0Yrq' },
        Z5z8vFQy0w0: { id: 'Z5z8vFQy0w0', valueType: 'TEXT' },
        TzqawmlPkI5: { id: 'TzqawmlPkI5', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' },
        leqawmlPkI5: { id: 'leqawmlPkI5', valueType: 'MULTI_TEXT', optionSetId: 'Jy0pZDJkCwX' },
        f8j4XDEozvj: { id: 'f8j4XDEozvj', valueType: 'TEXT', optionSetId: 'xD9QOIvNAjw' },
        jBBkFuPKctq: { id: 'jBBkFuPKctq', valueType: 'TEXT', optionSetId: 'T9zjyaIkRqH' },
        A4Fg6jgWauf: { id: 'A4Fg6jgWauf', valueType: 'TEXT', optionSetId: 'w1vUkxq8IOl' },
        CUbZcLm9LyN: { id: 'CUbZcLm9LyN', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' },
        p8htbyJHydl: { id: 'p8htbyJHydl', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' },
        SbXES4EPgqP: { id: 'SbXES4EPgqP', valueType: 'NUMBER' },
        bOYWVEBaWy6: { id: 'bOYWVEBaWy6', valueType: 'TEXT', optionSetId: 'qI4cs9ocBwn' },
        PFXeJV8d7ja: { id: 'PFXeJV8d7ja', valueType: 'DATE' },
    };
    const programRules = [
        {
            id: 'DOz4wl8ErDD',
            condition: 'true',
            description: 'Hide Irrelevant Test Result Options',
            displayName: 'Hide Test Result Options',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'XuM1JizlcF1',
                    dataElementId: 'ovY6E8BSdto',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    id: 'FRfTFXSwKDU',
                    dataElementId: 'ovY6E8BSdto',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'fPV0gQ8ds6D',
                },
            ],
        },
        {
            id: 'DtfaG1TgyZk',
            condition:
                "(d2:hasValue( #{LAB_TEST} )  && #{LAB_TEST} == 'No') ||\n(d2:hasValue( #{LAB_TEST} )  && #{LAB_TEST} == 'Yes'  && #{TEST_RESULT} == 'Inconclusive')",
            description: "Automation: Assign 'Probable Case' to Case Classification",
            displayName: "Assign 'Probable Case' to Case Classification",
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'NPvy6sF6axT',
                    data: "'Probable Case'",
                    dataElementId: 'Z5z8vFQy0w0',
                    programRuleActionType: 'ASSIGN',
                },
            ],
            priority: 4,
        },
        {
            id: 'E9ghdhg6ABQ',
            condition: "#{SYMPTOMS}  != 'Yes'",
            description: 'Hide Onset of Symptoms Date if no symptoms',
            displayName: 'Hide Onset of Symptoms Date',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'VcnnsBPtzlW', dataElementId: 's3eoonJ8OJb', programRuleActionType: 'HIDEFIELD' },
            ],
        },
        {
            id: 'FnSVDp8v0H9',
            condition: 'true',
            description: 'Hide Irrelevant Unknown Options',
            displayName: 'Hide Unknown Options',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'UqDEcMuF5DF',
                    dataElementId: 'JGnHr6WI3AY',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    id: 'GrFjkYTT07o',
                    dataElementId: 'p8htbyJHydl',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    id: 'HlyTQaTz00f',
                    dataElementId: 'CUbZcLm9LyN',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'pqxvAQU1z9W',
                },
            ],
        },
        {
            id: 'L8bP6GifQXL',
            condition:
                "!d2:hasValue( #{INFECTION_SOURCE} )  || #{INFECTION_SOURCE} == 'IMPORTED_CASE'  || #{INFECTION_SOURCE} == 'EXPOSURE_UNKNOWN'",
            description: 'Hide Case Type for Imported Cases',
            displayName: 'Hide Case Type',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'k05Owr8pwIn', dataElementId: 'A4Fg6jgWauf', programRuleActionType: 'HIDEFIELD' },
            ],
        },
        {
            id: 'MLS5vZLguQM',
            condition: "#{INFECTION_SOURCE} != 'LOCAL_TRANSMISSION'",
            description: "Hide 'Specify Local Infection Source' unless Local Transmission is selected",
            displayName: "Hide 'Specify Local Infection Source'",
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'ho7xRPUB0Gl', dataElementId: 'jBBkFuPKctq', programRuleActionType: 'HIDEFIELD' },
            ],
        },
        {
            id: 'NXWk8sq70OV',
            condition: "#{TRAVEL_HISTORY} == 'No'",
            description: "Hide 'Imported Case' if not traveled",
            displayName: "Hide 'Imported Case'",
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'fJIgmDK53Vp',
                    dataElementId: 'f8j4XDEozvj',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'PMGTqmVIF4T',
                },
            ],
        },
        {
            id: 'NZaVqr7dPfQ',
            condition: '!d2:hasValue( #{ONSET_DATE} ) && !d2:hasValue(V{event_date})',
            description: 'Automation: Assign Empty date if no Onset date and no event date is available',
            displayName: 'Assign Empty Date',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'q060xuOwQx3', data: "''", dataElementId: 'PFXeJV8d7ja', programRuleActionType: 'ASSIGN' },
            ],
            priority: 3,
        },
        {
            id: 'QrJx9LI9KRo',
            condition: "d2:hasValue( #{LAB_TEST} ) && #{LAB_TEST}  == 'Yes'  && !d2:hasValue( #{TEST_RESULT} )",
            description: 'Automation: Assign Empty Value to Class Classification',
            displayName: 'Assign Empty Value to Class Classification',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'rFaZAbOgMSz', data: "''", dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'ASSIGN' },
            ],
            priority: 2,
        },
        {
            id: 'R6oEX1xlQma',
            condition: 'true',
            description: 'Hide irrelevant Outcome Options',
            displayName: 'Hide Outcome Options',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'Ov7qHXf0Q2s',
                    dataElementId: 'bOYWVEBaWy6',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'dUeRcF2cApV',
                },
                {
                    id: 'V95rgvUlqY0',
                    dataElementId: 'bOYWVEBaWy6',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'bYt4why1tL3',
                },
                {
                    id: 'eZUUOjykbLv',
                    dataElementId: 'bOYWVEBaWy6',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    id: 'Zcs7rz5VEF7',
                    dataElementId: 'bOYWVEBaWy6',
                    programRuleActionType: 'HIDEOPTION',
                    optionId: 'RCT079wdeKT',
                },
            ],
        },
        {
            id: 'dZsTiQEUg5L',
            condition: '!d2:hasValue( #{ONSET_DATE} ) && d2:hasValue(V{event_date})',
            description: 'Automation: Assign Event date if no Onset date is available',
            displayName: 'Assign Event Date',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'sQKFBORp5P1',
                    data: 'V{event_date}',
                    dataElementId: 'PFXeJV8d7ja',
                    programRuleActionType: 'ASSIGN',
                },
            ],
            priority: 2,
        },
        {
            id: 'kVBrxwODyTj',
            condition: '!d2:hasValue( #{LAB_TEST} )',
            description: 'Hide Case Classification Field until Lab Test question is answered',
            displayName: 'Hide Case Classification Field',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'ZT8AexxBPl0', dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'HIDEFIELD' },
            ],
        },
        {
            id: 'q2QbEfeDlI9',
            condition: "!d2:hasValue( #{HOSPITALISED} ) || #{HOSPITALISED}  == 'No'",
            description: 'Hide ICU field unless Hospitalised',
            displayName: 'Hide ICU field',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'wwvxLCpuOCx', dataElementId: 'p8htbyJHydl', programRuleActionType: 'HIDEFIELD' },
            ],
        },
        {
            id: 'rZUpiMuJIKH',
            condition: "d2:hasValue( #{LAB_TEST} )  && #{LAB_TEST} == 'Yes'  && #{TEST_RESULT} == 'Positive'",
            description: "Automation: Assign 'Laboratory Confirmed Case' to Case Classification",
            displayName: "Assign 'Laboratory Confirmed Case' to Case Classification",
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'hcamYSDn00P',
                    data: "'Laboratory Confirmed Case'",
                    dataElementId: 'Z5z8vFQy0w0',
                    programRuleActionType: 'ASSIGN',
                },
            ],
            priority: 3,
        },
        {
            id: 'sEQsGGAQSJT',
            condition:
                "(d2:hasValue( #{LAB_TEST} )  && #{LAB_TEST} == 'Unknown') ||\n(d2:hasValue( #{LAB_TEST} )  && #{LAB_TEST} == 'Yes'  && (#{TEST_RESULT} == 'Negative' || #{TEST_RESULT} == 'Unknown'))",
            description: "Automation: Assign Suspected Case' to Case Classification",
            displayName: "Assign 'Suspected Case' to Case Classification",
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'zxb2XDboGAF',
                    data: "'Suspected Case'",
                    dataElementId: 'Z5z8vFQy0w0',
                    programRuleActionType: 'ASSIGN',
                },
            ],
            priority: 1,
        },
        {
            id: 'sKCZMuWwOKA',
            condition: 'd2:hasValue( #{ONSET_DATE} )',
            description: 'Automation: Assign Symptoms Onset Date if available',
            displayName: 'Assign Onset Date',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                {
                    id: 'lJOYxhjupxz',
                    data: '#{ONSET_DATE}',
                    dataElementId: 'PFXeJV8d7ja',
                    programRuleActionType: 'ASSIGN',
                },
            ],
            priority: 1,
        },
        {
            id: 'vj5GWKIrhKh',
            condition: "#{LAB_TEST} != 'Yes'",
            description: 'Hide Test Result Field until Lab Test question is answered with yes',
            displayName: 'Hide Test Result Field',
            programId: 'PNClHaZARtz',
            programRuleActions: [
                { id: 'VxxxIX2598r', dataElementId: 'ovY6E8BSdto', programRuleActionType: 'HIDEFIELD' },
            ],
        },
    ];
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
            id: 'EnpvdmYrwLb',
            dataElementId: 'TzqawmlPkI5',
            displayName: 'TRAVEL_HISTORY',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'rapvdmYrwLb',
            dataElementId: 'leqawmlPkI5',
            displayName: 'HISTORY',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'JPIyrAmJapV',
            dataElementId: 'CUbZcLm9LyN',
            displayName: 'HOSPITALISED',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'LAaPMTz69L7',
            displayName: 'CASE_CLASSIFICATION',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.CALCULATED_VALUE,
            useNameForOptionSet: true,
            valueType: 'TEXT',
        },
        {
            id: 'MpixycZvu0m',
            dataElementId: 'ovY6E8BSdto',
            displayName: 'TEST_RESULT',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'XcPYCpTOPwB',
            dataElementId: 'QQLXTXVidW2',
            displayName: 'LAB_TEST',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'cZSslcAEupI',
            dataElementId: 's3eoonJ8OJb',
            displayName: 'ONSET_DATE',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'eSq3nc1t2F6',
            dataElementId: 'dyfYIsTFTjG',
            displayName: 'PATIENT_ID',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: true,
        },
        {
            id: 'lY0yJGU1D4e',
            dataElementId: 'JGnHr6WI3AY',
            displayName: 'SYMPTOMS',
            programId: 'PNClHaZARtz',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_CURRENT_EVENT,
            useNameForOptionSet: false,
        },
    ];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {
        L6eMZDJkCwX: {
            id: 'L6eMZDJkCwX',
            displayName: 'Yes/No/Unknown',
            version: 3,
            valueType: 'TEXT',
            options: [
                {
                    id: 'x9yVKkv9koc',
                    displayName: 'Yes',
                    code: 'Yes',
                    translations: [
                        { property: 'NAME', locale: 'uz@Latn', value: 'Ha' },
                        { property: 'NAME', locale: 'fr', value: 'Oui' },
                        { property: 'NAME', locale: 'pt', value: 'Sim' },
                        { property: 'NAME', locale: 'uz@Cyrl', value: 'Ҳа' },
                        { property: 'NAME', locale: 'es', value: 'Sí' },
                        { property: 'NAME', locale: 'nb', value: 'Ja' },
                        { property: 'NAME', locale: 'ru', value: 'да' },
                    ],
                },
                {
                    id: 'R98tI2c6rF5',
                    displayName: 'No',
                    code: 'No',
                    translations: [
                        { property: 'NAME', locale: 'nb', value: 'Nei' },
                        { property: 'NAME', locale: 'es', value: 'No' },
                        { property: 'NAME', locale: 'uz@Latn', value: 'Yo`q' },
                        { property: 'NAME', locale: 'ru', value: 'нет' },
                        { property: 'NAME', locale: 'pt', value: 'Não' },
                        { property: 'NAME', locale: 'fr', value: 'Non' },
                        { property: 'NAME', locale: 'uz@Cyrl', value: 'Йўқ' },
                    ],
                },
                {
                    id: 'pqxvAQU1z9W',
                    code: 'Unknown',
                    translations: [
                        { property: 'NAME', locale: 'es', value: 'DEsconocido' },
                        { property: 'NAME', locale: 'nb', value: 'Ukjent' },
                        { property: 'NAME', locale: 'uz@Cyrl', value: 'Ноаниқ' },
                        { property: 'NAME', locale: 'fr', value: 'Inconnu' },
                        { property: 'NAME', locale: 'uz@Latn', value: 'Noaniq' },
                        { property: 'NAME', locale: 'pt', value: 'Desconhecido' },
                        { property: 'NAME', locale: 'ru', value: 'Неизвестно' },
                    ],
                },
            ],
        },
        Jy0pZDJkCwX: {
            id: 'Jy0pZDJkCwX',
            displayName: 'Yes/No/Unknown',
            version: 3,
            valueType: 'MULTI_TEXT',
            options: [
                {
                    id: 'x9yVKkv9koc',
                    displayName: 'Yes',
                    code: 'Yes',
                    translations: [],
                },
                {
                    id: 'R98tI2c6rF5',
                    displayName: 'No',
                    code: 'No',
                    translations: [],
                },
                {
                    id: 'pqxvAQU1z9W',
                    code: 'Unknown',
                    translations: [],
                },
            ],
        },
        dsgBmIZ0Yrq: {
            id: 'dsgBmIZ0Yrq',
            displayName: 'Test Result',
            version: 6,
            valueType: 'TEXT',
            options: [
                {
                    id: 'B44lkxTWbGO',
                    code: 'Inconclusive',
                    translations: [
                        { property: 'NAME', locale: 'fr', value: 'Non concluant' },
                        { property: 'NAME', locale: 'pt', value: 'Inconclusivo' },
                        { property: 'NAME', locale: 'nb', value: 'Mangelfull' },
                        { property: 'NAME', locale: 'es', value: 'No concluyente' },
                        { property: 'NAME', locale: 'ru', value: 'Неокончательный' },
                    ],
                },
                {
                    id: 'ljClr1z2aE7',
                    displayName: 'Negative',
                    code: 'Negative',
                    translations: [
                        { property: 'NAME', locale: 'fr', value: 'Négatif' },
                        { property: 'NAME', locale: 'nb', value: 'Negativ' },
                        { property: 'NAME', locale: 'es', value: 'Negativo' },
                        { property: 'NAME', locale: 'uz@Latn', value: 'Manfiy' },
                        { property: 'NAME', locale: 'pt', value: 'Negativo' },
                        { property: 'NAME', locale: 'ru', value: 'Отрицательный' },
                        { property: 'NAME', locale: 'uz@Cyrl', value: 'Манфий' },
                    ],
                },
                {
                    id: 'LKbwTJwocOk',
                    displayName: 'Positive',
                    code: 'Positive',
                    translations: [
                        { property: 'NAME', locale: 'ru', value: 'Положительный' },
                        { property: 'NAME', locale: 'es', value: 'Positivo' },
                        { property: 'NAME', locale: 'uz@Latn', value: 'Musbat' },
                        { property: 'NAME', locale: 'uz@Cyrl', value: 'Мусбат' },
                        { property: 'NAME', locale: 'nb', value: 'Positiv' },
                        { property: 'NAME', locale: 'fr', value: 'Positif' },
                        { property: 'NAME', locale: 'pt', value: 'Positivo' },
                    ],
                },
                {
                    id: 'MkeWrqeqZXL',
                    displayName: 'Not performed',
                    code: 'Not performed',
                    translations: [
                        { property: 'NAME', locale: 'ru', value: 'Не выполнен' },
                        { property: 'NAME', locale: 'pt', value: 'Não realizado' },
                        { property: 'NAME', locale: 'nb', value: 'Ikke utført' },
                        { property: 'NAME', locale: 'fr', value: 'Non réalisé' },
                        { property: 'NAME', locale: 'es', value: 'No realizado' },
                    ],
                },
                {
                    id: 'fPV0gQ8ds6D',
                    displayName: 'Invalid',
                    code: 'Invalid',
                    translations: [
                        { property: 'NAME', locale: 'es', value: 'Inválido' },
                        { property: 'NAME', locale: 'fr', value: 'Invalide' },
                        { property: 'NAME', locale: 'pt', value: 'Inválido' },
                        { property: 'NAME', locale: 'nb', value: 'Ugyldig' },
                        { property: 'NAME', locale: 'ru', value: 'Недействительный' },
                    ],
                },
                {
                    id: 'YV3jCZlvwZe',
                    displayName: 'Unknown',
                    code: 'Unknown',
                    translations: [
                        { property: 'NAME', locale: 'es', value: 'DEsconocido' },
                        { property: 'NAME', locale: 'nb', value: 'Ukjent' },
                        { property: 'NAME', locale: 'uz@Cyrl', value: 'Ноаниқ' },
                        { property: 'NAME', locale: 'fr', value: 'Inconnu' },
                        { property: 'NAME', locale: 'uz@Latn', value: 'Noaniq' },
                        { property: 'NAME', locale: 'pt', value: 'Desconhecido' },
                        { property: 'NAME', locale: 'ru', value: 'Неизвестно' },
                    ],
                },
            ],
        },
    };

    // NOTE: in this test we dont use toMatchSnapshot instead we test again hardcoded values. Since the effects are plenty
    // here each time this way we can avoid mistakes in comparing snapshots
    describe.each([
        [
            { JGnHr6WI3AY: 'Yes' },
            [
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'Z5z8vFQy0w0', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'ovY6E8BSdto', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'Yes', leqawmlPkI5: 'Yes,No' },
            [
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'No', leqawmlPkI5: 'Yes,No' },
            [
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: 'Probable Case',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'ovY6E8BSdto', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'Unknown' },
            [
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: 'Suspected Case',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'ovY6E8BSdto', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { CUbZcLm9LyN: 'Yes' },
            [
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'Z5z8vFQy0w0', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'ovY6E8BSdto', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Inconclusive' },
            [
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: 'Probable Case',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Positive' },
            [
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: 'Laboratory Confirmed Case',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Negative' },
            [
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: 'Suspected Case',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Unknown' },
            [
                {
                    type: 'ASSIGN',
                    id: 'Z5z8vFQy0w0',
                    value: 'Suspected Case',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'PFXeJV8d7ja',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'MkeWrqeqZXL',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'ovY6E8BSdto',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'fPV0gQ8ds6D',
                },
                { type: 'HIDEFIELD', id: 's3eoonJ8OJb', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'JGnHr6WI3AY',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'p8htbyJHydl',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'CUbZcLm9LyN',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'pqxvAQU1z9W',
                },
                { type: 'HIDEFIELD', id: 'A4Fg6jgWauf', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                { type: 'HIDEFIELD', id: 'jBBkFuPKctq', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'dUeRcF2cApV',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'bYt4why1tL3',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'xBoo6HyaYcd',
                },
                {
                    type: 'HIDEOPTION',
                    id: 'bOYWVEBaWy6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                    optionId: 'RCT079wdeKT',
                },
                { type: 'HIDEFIELD', id: 'p8htbyJHydl', targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT },
            ],
        ],
    ])('where different fields are hidden', (currentEvent, expected) => {
        test(`and given value(s): ${JSON.stringify(currentEvent)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });
});

describe('Event rules engine effects with functions and effects', () => {
    // these variables are shared between each test
    const constants = [
        { id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 },
        { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 },
    ];
    const dataElementsInProgram = {
        oZg33kd9taw: { id: 'oZg33kd9taw', valueType: 'TEXT', optionSetId: 'pC3N9N77UmT' },
        SWfdB5lX0fk: { id: 'SWfdB5lX0fk', valueType: 'BOOLEAN' },
        qrur9Dvnyt5: { id: 'qrur9Dvnyt5', valueType: 'INTEGER' },
        GieVkTxp4HH: { id: 'GieVkTxp4HH', valueType: 'NUMBER' },
        vV9UWAZohSf: { id: 'vV9UWAZohSf', valueType: 'INTEGER_POSITIVE' },
        eMyVanycQSC: { id: 'eMyVanycQSC', valueType: 'DATE' },
        K6uUAvq500H: { id: 'K6uUAvq500H', valueType: 'TEXT', optionSetId: 'eUZ79clX7y1' },
        msodh3rEMJa: { id: 'msodh3rEMJa', valueType: 'DATE' },
        S33cRBsnXPo: { id: 'S33cRBsnXPo', valueType: 'ORGANISATION_UNIT' },
        fWIAEtYVEGk: { id: 'fWIAEtYVEGk', valueType: 'TEXT', optionSetId: 'iDFPKpFTiVw' },
        ulD2zW0TIy2: { id: 'ulD2zW0TIy2', valueType: 'FILE_RESOURCE' },
    };
    const programRules = [
        {
            id: 'CTzRoPyvf8v',
            condition: 'true',
            displayName: 'Testing the functions!',
            programId: 'eBAyeGv0exc',
            programRuleActions: [
                {
                    id: 'isP0uvT24jf',
                    displayContent: "d2:yearsBetween( '2010-01-28', V{event_date}) =",
                    data: "d2:yearsBetween( '2010-01-28', V{event_date})",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'vQCRnX6w9pM',
                    displayContent: 'd2:oizp( -10000000 ) =',
                    data: 'd2:oizp( -10000000 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'SYAL0GIDnxI',
                    displayContent: 'display age = ',
                    data: 'd2:hasValue(#{age}) && #{age}',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'Xa0tKyNk5YE',
                    displayContent: 'org_unit = ',
                    data: 'V{orgunit_code}',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'JXssEpbJdO2',
                    displayContent: 'd2:right(#{age}, 3) = ',
                    data: 'd2:hasValue(#{age}) && d2:right(#{age}, 3)',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'o0LLNIYsliy',
                    displayContent: "d2:monthsBetween( '2020-01-28', V{event_date}) = ",
                    data: "d2:monthsBetween( '2020-01-28', V{event_date})",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'k07KnI11Sf4',
                    displayContent: 'd2:left(#{age}, 3) = ',
                    data: 'd2:hasValue(#{age}) && d2:left(#{age}, 3)',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'OITs4nPfMQ3',
                    displayContent: "d2:split('these-are-testing-values', '-', 2) = ",
                    data: "d2:split('these-are-testing-values', '-', 2)",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'EzkFLDtAxCR',
                    displayContent: 'd2:modulus( 12 , 100 ) = ',
                    data: 'd2:modulus( 12 , 100 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'RCYEyOly0Mi',
                    displayContent: "d2:countIfValue( #{gender}, 'Male' ) = ",
                    data: "d2:countIfValue( #{gender}, 'Male' )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'bRnjbxIwIRd',
                    displayContent: 'd2:round( 12.5 ) = ',
                    data: 'd2:round( 12.5 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'BuEcHNoD98P',
                    displayContent: 'd2:ceil(11.3) = ',
                    data: 'd2:ceil(11.3)',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'Foc3PhzoAVr',
                    displayContent: 'd2:count(#{age}) = ',
                    data: 'd2:count(#{age})',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'QpeF2WDjwIV',
                    displayContent: "d2:addDays( '2020-01-12', 5 ) = ",
                    data: "d2:addDays( '2020-01-12', 5 )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'WJTjezLR4cJ',
                    displayContent: "d2:weeksBetween('2020-01-28', V{event_date} ) = ",
                    data: "d2:weeksBetween('2020-01-28', V{event_date} )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'YnE4dNJVF2P',
                    displayContent: 'd2:zing( -2 ) = ',
                    data: 'd2:zing( -2 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'bZsv2cUkbB7',
                    displayContent: 'd2:floor( 11.5 ) =',
                    data: 'd2:floor( 11.5 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'J8RxAbHlnO3',
                    displayContent: 'd2:oizp( 10000000 ) = ',
                    data: 'd2:oizp( 10000000 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'NT1wojA2RdT',
                    displayContent: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking') = ",
                    data: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking')",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'NUGe7EUVouK',
                    displayContent: "d2:substring('hello dhis 2', 6, 10) = ",
                    data: "d2:substring('hello dhis 2', 6, 10)",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'Ma6nCIGrBrd',
                    displayContent: "d2:length( 'dhis2 rocks' ) = ",
                    data: "d2:length( 'dhis2 rocks' )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'RRSDsxWiUMc',
                    displayContent: 'd2:round( 0 ) = ',
                    data: 'd2:round( 0 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'QUe0Pks4ckc',
                    displayContent: 'd2:countIfValue( #{age}, 1 ) = ',
                    data: 'd2:countIfValue( #{age}, 1 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'sHaE1YI0ur2',
                    displayContent: 'd2:zing( 1000 ) = ',
                    data: 'd2:zing( 1000 )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'EojHcBMpW7q',
                    displayContent: 'd2:hasValue( #{age} ) = ',
                    data: 'd2:hasValue( #{age} )',
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'enZhulwjMED',
                    displayContent: "d2:condition('1 == 2', 'equal', 'not equal') = ",
                    data: "d2:condition('1 == 2', 'equal', 'not equal')",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'i2UOFxZJo4a',
                    displayContent: "d2:condition('2 == 2', 'equal', 'not equal') = ",
                    data: "d2:condition('2 == 2', 'equal', 'not equal')",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
            ],
        },
    ];
    const programRuleVariables = [
        {
            id: 'RycV5uDi66i',
            dataElementId: 'qrur9Dvnyt5',
            displayName: 'age',
            programId: 'eBAyeGv0exc',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
            useNameForOptionSet: true,
        },
        {
            id: 'zINGRka3g9N',
            dataElementId: 'oZg33kd9taw',
            displayName: 'gender',
            programId: 'eBAyeGv0exc',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
            useNameForOptionSet: true,
        },
        {
            id: 'Zj7UnCAulEk.vV9UWAZohSf',
            displayName: 'Zj7UnCAulEk.vV9UWAZohSf',
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT,
            dataElementId: 'vV9UWAZohSf',
            programId: 'eBAyeGv0exc',
        },
        {
            id: 'Zj7UnCAulEk.GieVkTxp4HH',
            displayName: 'Zj7UnCAulEk.GieVkTxp4HH',
            programRuleVariableSourceType: variableSourceTypes.TEI_ATTRIBUTE,
            dataElementId: 'GieVkTxp4HH',
            programId: 'eBAyeGv0exc',
        },
        {
            id: 'Zj7UnCAulEk.GieVkTxp4HH',
            displayName: 'Zj7UnCAulEk.GieVkTxp4HH',
            programRuleVariableSourceType: 'UNKNOWN',
            dataElementId: 'GieVkTxp4HH',
            programId: 'eBAyeGv0exc',
        },
    ];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC', code: 'OU_559' };
    const optionSets = {
        pC3N9N77UmT: {
            id: 'pC3N9N77UmT',
            displayName: 'Gender',
            version: 0,
            valueType: 'TEXT',
            options: [
                { id: 'rBvjJYbMCVx', displayName: 'Male', code: 'Male', translations: [] },
                { id: 'Mnp3oXrpAbK', displayName: 'Female', code: 'Female', translations: [] },
            ],
        },
    };

    // NOTE: in this test we dont use toMatchSnapshot instead we test again hardcoded values. Since the effects are plenty
    // here each time this way we can avoid mistakes in comparing snapshots
    describe.each([
        [
            {},
            [
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'isP0uvT24jf', message: "d2:yearsBetween( '2010-01-28', V{event_date}) = " },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'vQCRnX6w9pM', message: 'd2:oizp( -10000000 ) = 0' },
                },
                { type: 'DISPLAYTEXT', id: 'feedback', displayText: { id: 'SYAL0GIDnxI', message: 'display age =  ' } },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Xa0tKyNk5YE', message: 'org_unit =  OU_559' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'JXssEpbJdO2', message: 'd2:right(#{age}, 3) =  ' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'o0LLNIYsliy', message: "d2:monthsBetween( '2020-01-28', V{event_date}) =  " },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'k07KnI11Sf4', message: 'd2:left(#{age}, 3) =  ' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: {
                        id: 'OITs4nPfMQ3',
                        message: "d2:split('these-are-testing-values', '-', 2) =  testing",
                    },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'EzkFLDtAxCR', message: 'd2:modulus( 12 , 100 ) =  12' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'RCYEyOly0Mi', message: "d2:countIfValue( #{gender}, 'Male' ) =  0" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'bRnjbxIwIRd', message: 'd2:round( 12.5 ) =  13' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'BuEcHNoD98P', message: 'd2:ceil(11.3) =  12' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Foc3PhzoAVr', message: 'd2:count(#{age}) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QpeF2WDjwIV', message: "d2:addDays( '2020-01-12', 5 ) =  2020-01-17" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'WJTjezLR4cJ', message: "d2:weeksBetween('2020-01-28', V{event_date} ) =  " },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'YnE4dNJVF2P', message: 'd2:zing( -2 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'bZsv2cUkbB7', message: 'd2:floor( 11.5 ) = 11' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'J8RxAbHlnO3', message: 'd2:oizp( 10000000 ) =  1' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: {
                        id: 'NT1wojA2RdT',
                        message: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking') =  dhis2isrocking",
                    },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'NUGe7EUVouK', message: "d2:substring('hello dhis 2', 6, 10) =  dhis" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Ma6nCIGrBrd', message: "d2:length( 'dhis2 rocks' ) =  11" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'RRSDsxWiUMc', message: 'd2:round( 0 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QUe0Pks4ckc', message: 'd2:countIfValue( #{age}, 1 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'sHaE1YI0ur2', message: 'd2:zing( 1000 ) =  1000' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'EojHcBMpW7q', message: 'd2:hasValue( #{age} ) =  ' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'enZhulwjMED', message: "d2:condition('1 == 2', 'equal', 'not equal') =  not equal" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'i2UOFxZJo4a', message: "d2:condition('2 == 2', 'equal', 'not equal') =  equal" },
                },
            ],
        ],
        [
            {
                oZg33kd9taw: 'Male',
                qrur9Dvnyt5: 0,
                occurredAt: '2020-04-30T22:00:00.000Z',
            },
            [
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'isP0uvT24jf', message: "d2:yearsBetween( '2010-01-28', V{event_date}) = 10" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'vQCRnX6w9pM', message: 'd2:oizp( -10000000 ) = 0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'SYAL0GIDnxI', message: 'display age =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Xa0tKyNk5YE', message: 'org_unit =  OU_559' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'JXssEpbJdO2', message: 'd2:right(#{age}, 3) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'o0LLNIYsliy', message: "d2:monthsBetween( '2020-01-28', V{event_date}) =  3" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'k07KnI11Sf4', message: 'd2:left(#{age}, 3) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: {
                        id: 'OITs4nPfMQ3',
                        message: "d2:split('these-are-testing-values', '-', 2) =  testing",
                    },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'EzkFLDtAxCR', message: 'd2:modulus( 12 , 100 ) =  12' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'RCYEyOly0Mi', message: "d2:countIfValue( #{gender}, 'Male' ) =  1" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'bRnjbxIwIRd', message: 'd2:round( 12.5 ) =  13' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'BuEcHNoD98P', message: 'd2:ceil(11.3) =  12' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Foc3PhzoAVr', message: 'd2:count(#{age}) =  1' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QpeF2WDjwIV', message: "d2:addDays( '2020-01-12', 5 ) =  2020-01-17" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'WJTjezLR4cJ', message: "d2:weeksBetween('2020-01-28', V{event_date} ) =  13" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'YnE4dNJVF2P', message: 'd2:zing( -2 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'bZsv2cUkbB7', message: 'd2:floor( 11.5 ) = 11' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'J8RxAbHlnO3', message: 'd2:oizp( 10000000 ) =  1' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: {
                        id: 'NT1wojA2RdT',
                        message: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking') =  dhis2isrocking",
                    },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'NUGe7EUVouK', message: "d2:substring('hello dhis 2', 6, 10) =  dhis" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Ma6nCIGrBrd', message: "d2:length( 'dhis2 rocks' ) =  11" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'RRSDsxWiUMc', message: 'd2:round( 0 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QUe0Pks4ckc', message: 'd2:countIfValue( #{age}, 1 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'sHaE1YI0ur2', message: 'd2:zing( 1000 ) =  1000' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'EojHcBMpW7q', message: 'd2:hasValue( #{age} ) =  true' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'enZhulwjMED', message: "d2:condition('1 == 2', 'equal', 'not equal') =  not equal" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'i2UOFxZJo4a', message: "d2:condition('2 == 2', 'equal', 'not equal') =  equal" },
                },
            ],
        ],
        [
            {
                oZg33kd9taw: 'Male',
                qrur9Dvnyt5: 1000000000,
                occurredAt: '2020-04-30T22:00:00.000Z',
            },
            [
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'isP0uvT24jf', message: "d2:yearsBetween( '2010-01-28', V{event_date}) = 10" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'vQCRnX6w9pM', message: 'd2:oizp( -10000000 ) = 0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'SYAL0GIDnxI', message: 'display age =  1000000000' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Xa0tKyNk5YE', message: 'org_unit =  OU_559' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'JXssEpbJdO2', message: 'd2:right(#{age}, 3) =  000' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'o0LLNIYsliy', message: "d2:monthsBetween( '2020-01-28', V{event_date}) =  3" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'k07KnI11Sf4', message: 'd2:left(#{age}, 3) =  100' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: {
                        id: 'OITs4nPfMQ3',
                        message: "d2:split('these-are-testing-values', '-', 2) =  testing",
                    },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'EzkFLDtAxCR', message: 'd2:modulus( 12 , 100 ) =  12' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'RCYEyOly0Mi', message: "d2:countIfValue( #{gender}, 'Male' ) =  1" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'bRnjbxIwIRd', message: 'd2:round( 12.5 ) =  13' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'BuEcHNoD98P', message: 'd2:ceil(11.3) =  12' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Foc3PhzoAVr', message: 'd2:count(#{age}) =  1' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QpeF2WDjwIV', message: "d2:addDays( '2020-01-12', 5 ) =  2020-01-17" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'WJTjezLR4cJ', message: "d2:weeksBetween('2020-01-28', V{event_date} ) =  13" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'YnE4dNJVF2P', message: 'd2:zing( -2 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'bZsv2cUkbB7', message: 'd2:floor( 11.5 ) = 11' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'J8RxAbHlnO3', message: 'd2:oizp( 10000000 ) =  1' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: {
                        id: 'NT1wojA2RdT',
                        message: "d2:concatenate( 'dh', 'is', 2, 'is', 'rocking') =  dhis2isrocking",
                    },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'NUGe7EUVouK', message: "d2:substring('hello dhis 2', 6, 10) =  dhis" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'Ma6nCIGrBrd', message: "d2:length( 'dhis2 rocks' ) =  11" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'RRSDsxWiUMc', message: 'd2:round( 0 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QUe0Pks4ckc', message: 'd2:countIfValue( #{age}, 1 ) =  0' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'sHaE1YI0ur2', message: 'd2:zing( 1000 ) =  1000' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'EojHcBMpW7q', message: 'd2:hasValue( #{age} ) =  true' },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'enZhulwjMED', message: "d2:condition('1 == 2', 'equal', 'not equal') =  not equal" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'i2UOFxZJo4a', message: "d2:condition('2 == 2', 'equal', 'not equal') =  equal" },
                },
            ],
        ],
    ])('where functions take place', (currentEvent, expected) => {
        test(`and given value(s): ${JSON.stringify(currentEvent)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });
            expect(rulesEffects).toEqual(expected);
        });
    });
});

describe('Event rules engine effects with functions and effects', () => {
    // these variables are shared between each test
    const constants = [];
    const dataElementsInProgram = {
        oZg33kd9taw: { id: 'oZg33kd9taw', valueType: 'TEXT', optionSetId: 'pC3N9N77UmT' },
        SWfdB5lX0fk: { id: 'SWfdB5lX0fk', valueType: 'BOOLEAN' },
        qrur9Dvnyt5: { id: 'qrur9Dvnyt5', valueType: 'INTEGER' },
        GieVkTxp4HH: { id: 'GieVkTxp4HH', valueType: 'NUMBER' },
        vV9UWAZohSf: { id: 'vV9UWAZohSf', valueType: 'INTEGER_POSITIVE' },
        eMyVanycQSC: { id: 'eMyVanycQSC', valueType: 'DATE' },
        K6uUAvq500H: { id: 'K6uUAvq500H', valueType: 'TEXT', optionSetId: 'eUZ79clX7y1' },
        msodh3rEMJa: { id: 'msodh3rEMJa', valueType: 'DATE' },
        S33cRBsnXPo: { id: 'S33cRBsnXPo', valueType: 'ORGANISATION_UNIT' },
        fWIAEtYVEGk: { id: 'fWIAEtYVEGk', valueType: 'TEXT', optionSetId: 'iDFPKpFTiVw' },
        ulD2zW0TIy2: { id: 'ulD2zW0TIy2', valueType: 'FILE_RESOURCE' },
    };
    const programRules = [
        {
            id: 'cq1dwUY4lVU',
            condition: 'true',
            displayName: 'testing the z-scores',
            programId: 'eBAyeGv0exc',
            programRuleActions: [
                {
                    id: 'I6pDcSm2m0g',
                    displayContent: "d2:zScoreWFA( 20, 15, 'M' ) = ",
                    data: "d2:zScoreWFA( 20, 15, 'M' )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'No0T9TgN1Px',
                    displayContent: "d2:zScoreWFH( 100, 20, 'M' ) = ",
                    data: "d2:zScoreWFH( 100, 20, 'M' )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'n1GUxR8fShY',
                    displayContent: "d2:zScoreHFA( 15, 20, 'F' )  =",
                    data: "d2:zScoreHFA( 15, 20, 'F' ) ",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'QJlZHo0GoVK',
                    displayContent: "d2:zScoreWFH( 100, 20, 'F' )  = ",
                    data: "d2:zScoreWFH( 100, 20, 'F' ) ",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'ItuKGBUuJgK',
                    displayContent: "d2:zScoreWFA( 20, 15, 'F' ) = ",
                    data: "d2:zScoreWFA( 20, 15, 'F' )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
                {
                    id: 'uhyaCDzzivm',
                    displayContent: "d2:zScoreHFA( 15, 20, 'M' ) =",
                    data: "d2:zScoreHFA( 15, 20, 'M' )",
                    location: 'feedback',
                    programRuleActionType: 'DISPLAYTEXT',
                },
            ],
        },
    ];
    const programRuleVariables = [];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {};
    const currentEvent = {};

    describe('where z-score take place', () => {
        test('with given values', () => {
            // when
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
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'I6pDcSm2m0g', message: "d2:zScoreWFA( 20, 15, 'M' ) =  2.47" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'No0T9TgN1Px', message: "d2:zScoreWFH( 100, 20, 'M' ) =  3.5" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'n1GUxR8fShY', message: "d2:zScoreHFA( 15, 20, 'F' )  = -3.5" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'QJlZHo0GoVK', message: "d2:zScoreWFH( 100, 20, 'F' )  =  2.84" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'ItuKGBUuJgK', message: "d2:zScoreWFA( 20, 15, 'F' ) =  2.65" },
                },
                {
                    type: 'DISPLAYTEXT',
                    id: 'feedback',
                    displayText: { id: 'uhyaCDzzivm', message: "d2:zScoreHFA( 15, 20, 'M' ) = -3.5" },
                },
            ]);
        });
    });
});

describe('Event rules engine', () => {
    // these variables are shared between each test
    const constants = [];
    const dataElementsInProgram = {
        oZg33kd9taw: { id: 'oZg33kd9taw', valueType: 'BOOLEAN' },
        SWfdB5lX0fk: { id: 'SWfdB5lX0fk', valueType: 'TRUE_ONLY' },
        qrur9Dvnyt5: { id: 'qrur9Dvnyt5', valueType: 'NUMBER' },
    };
    const programRuleVariables = [];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {};
    const currentEvent = {};

    describe.each([
        [
            [
                {
                    id: 'cq1dwUY4lVU',
                    condition: 'true',
                    displayName: 'testing assign actions',
                    programId: 'eBAyeGv0exc',
                    programRuleActions: [
                        {
                            id: 'lJOYxhjupxz',
                            data: 'true',
                            dataElementId: 'oZg33kd9taw',
                            programRuleActionType: 'ASSIGN',
                        },
                        {
                            id: 'lJOYxhjupx1',
                            data: 'true',
                            dataElementId: 'SWfdB5lX0fk',
                            programRuleActionType: 'ASSIGN',
                        },
                        { id: 'lJOYxhjupx2', data: '6', dataElementId: 'qrur9Dvnyt5', programRuleActionType: 'ASSIGN' },
                    ],
                },
            ],
            [
                {
                    type: 'ASSIGN',
                    id: 'oZg33kd9taw',
                    value: 'true',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'SWfdB5lX0fk',
                    value: 'true',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'qrur9Dvnyt5',
                    value: '6',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
            ],
        ],
        [
            [
                {
                    id: 'cq1dwUY4lVU',
                    condition: 'true',
                    displayName: 'testing assign actions',
                    programId: 'eBAyeGv0exc',
                    programRuleActions: [
                        { id: 'lJOYxhjupxz', data: '', dataElementId: 'oZg33kd9taw', programRuleActionType: 'ASSIGN' },
                        { id: 'lJOYxhjupx1', data: '', dataElementId: 'SWfdB5lX0fk', programRuleActionType: 'ASSIGN' },
                        { id: 'lJOYxhjupx2', data: '', dataElementId: 'qrur9Dvnyt5', programRuleActionType: 'ASSIGN' },
                    ],
                },
            ],
            [
                {
                    type: 'ASSIGN',
                    id: 'oZg33kd9taw',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'SWfdB5lX0fk',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
                {
                    type: 'ASSIGN',
                    id: 'qrur9Dvnyt5',
                    value: null,
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
            ],
        ],
        [
            [
                {
                    id: 'cq1dwUY4lVU',
                    condition: 'true',
                    displayName: 'testing assign actions',
                    programId: 'eBAyeGv0exc',
                    programRuleActions: [
                        {
                            id: 'lJOYxhjupxz',
                            data: 'false',
                            dataElementId: 'oZg33kd9taw',
                            programRuleActionType: 'ASSIGN',
                        },
                    ],
                },
            ],
            [
                {
                    type: 'ASSIGN',
                    id: 'oZg33kd9taw',
                    value: 'false',
                    targetDataType: rulesEngineEffectTargetDataTypes.DATA_ELEMENT,
                },
            ],
        ],
    ])('where assign actions are triggered', (programRules, expected) => {
        test(`with given value(s): ${JSON.stringify(programRules)}`, () => {
            const rulesEffects = rulesEngine.getProgramRuleEffects({
                programRulesContainer: { programRuleVariables, programRules, constants },
                currentEvent,
                dataElements: dataElementsInProgram,
                selectedOrgUnit: orgUnit,
                optionSets,
            });

            expect(rulesEffects).toEqual(expected);
        });
    });
});

describe('Assign effects', () => {
    // these variables are shared between each test
    const constants = [];
    const dataElementsInProgram = {
        qrur9Dvnyt5: { id: 'qrur9Dvnyt5', valueType: 'NUMBER' },
        hrur9Dvnyt5: { id: 'hrur9Dvnyt5', valueType: 'TRUE_ONLY' },
        g67r9Dvnyt5: { id: 'g67r9Dvnyt5', valueType: 'TRUE_ONLY' },
        sfer9Dvnyt5: { id: 'sfer9Dvnyt5', valueType: 'LONG_TEXT' },
        oZg33kd9taw: { id: 'oZg33kd9taw', valueType: 'BOOLEAN' },
        hjrr9Dvnyt5: { id: 'hjrr9Dvnyt5', valueType: 'LETTER' },
        lowr9Dvnyt5: { id: 'lowr9Dvnyt5', valueType: 'PHONE_NUMBER' },
        kht29Dvnyt5: { id: 'kht29Dvnyt5', valueType: 'EMAIL' },
        hyrt9Dvnyt5: { id: 'hyrt9Dvnyt5', valueType: 'DATE' },
        loir9Dvnyt5: { id: 'loir9Dvnyt5', valueType: 'DATETIME' },
        sldkjfjfjfe: { id: 'sldkjfjfjfe', valueType: 'TIME' },
        kyt49Dvnyt5: { id: 'kyt49Dvnyt5', valueType: 'PERCENTAGE' },
        kiyu9Dvnyt5: { id: 'kiyu9Dvnyt5', valueType: 'INTEGER' },
        frt59Dvnyt5: { id: 'frt59Dvnyt5', valueType: 'INTEGER_POSITIVE' },
        jhty9Dvnyt5: { id: 'jhty9Dvnyt5', valueType: 'INTEGER_NEGATIVE' },
        jhrr9Dvnyt5: { id: 'jhrr9Dvnyt5', valueType: 'INTEGER_ZERO_OR_POSITIVE' },
        plor9Dvnyt5: { id: 'plor9Dvnyt5', valueType: 'USERNAME' },
        frg39Dvnyt5: { id: 'frg39Dvnyt5', valueType: 'COORDINATE' },
        kjyu9Dvnyt5: { id: 'kjyu9Dvnyt5', valueType: 'ORGANISATION_UNIT' },
        kjfr9Dvnyt5: { id: 'kjfr9Dvnyt5', valueType: 'AGE' },
        lqwr9Dvnyt5: { id: 'lqwr9Dvnyt5', valueType: 'URL' },
        mjus9Dvnyt5: { id: 'mjus9Dvnyt5', valueType: 'FILE_RESOURCE' },
        fgrr9Dvnyt5: { id: 'fgrr9Dvnyt5', valueType: 'IMAGE' },
        oZ3fhkd9taw: { id: 'oZ3fhkd9taw', valueType: 'UNKNOWN' },
        hyur9Dvnyt5: { id: 'hyur9Dvnyt5', valueType: 'MULTI_TEXT', optionSetId: 'pC3N9N77UmT' },
        ght5r9Dnyt5: { id: 'ght5r9Dnyt5', valueType: 'MULTI_TEXT', optionSetId: 'pC3N9N77UmT' },
    };
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSets = {
        pC3N9N77UmT: {
            id: 'pC3N9N77UmT',
            displayName: 'Gender',
            version: 0,
            valueType: 'MULTI_TEXT',
            options: [
                { id: 'rBvjJYbMCVx', displayName: 'Male', code: 'Male', translations: [] },
                { id: 'Mnp3oXrpAbK', displayName: 'Female', code: 'Female', translations: [] },
            ],
            dataElement: { type: 'MULTI_TEXT' },
        } };
    const currentEvent = {};

    test('Assign effect corner cases', () => {
        const programRules = [
            {
                id: 'cq1dwUY4lVU',
                condition: 'true',
                displayName: 'testing assign actions',
                programId: 'eBAyeGv0exc',
                programRuleActions: [
                    {
                        id: 'lJOYxhjupx2',
                        data: "'string'",
                        dataElementId: 'qrur9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    { id: 'lJOYxkjupx2', data: "'10'", dataElementId: 'qrur9Dvnyt5', programRuleActionType: 'ASSIGN' },
                    {
                        id: 'lJhYxhjupxz',
                        data: "'string'",
                        dataElementId: 'oZg33kd9taw',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'lJfYxhjupxz',
                        data: "'string'",
                        dataElementId: 'oZ3fhkd9taw',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'sdfsd34567h',
                        data: 'value',
                        dataElementId: 'hrur9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'g67rgyvnyt5',
                        data: null,
                        dataElementId: 'g67r9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'fsafYxhjux2',
                        data: "'LONG_TEXT'",
                        dataElementId: 'sfer9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'o8rr9Dvnyt5',
                        data: "'LETTER'",
                        dataElementId: 'hjrr9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'lsdjlks4ffs',
                        data: '34535353',
                        dataElementId: 'lowr9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'hsjd7574jfj',
                        data: 'test@test.com',
                        dataElementId: 'kht29Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'sdf57549jco',
                        data: '11-11-2013',
                        dataElementId: 'hyrt9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'gtir9Dvnyt5',
                        data: '2021-05-31',
                        dataElementId: 'loir9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 's678jfjfjfe',
                        data: '11:11',
                        dataElementId: 'sldkjfjfjfe',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'sdhsfjks35f',
                        data: '30',
                        dataElementId: 'kyt49Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'kjosfjks35f',
                        data: '30',
                        dataElementId: 'kiyu9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'kjyofjks35f',
                        data: '30',
                        dataElementId: 'frt59Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'jhkj9Dvnyt5',
                        data: '-30',
                        dataElementId: 'jhty9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'hjyur9Dvnyt5',
                        data: '-30',
                        dataElementId: 'jhrr9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'juyur9Dvnyt5',
                        data: "'Male,Female'",
                        dataElementId: 'hyur9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'gty5r9Dvnyt5',
                        data: "'Female,Male,Female'",
                        dataElementId: 'ght5r9Dnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'lopr9Dvnyt5',
                        data: 'username',
                        dataElementId: 'plor9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'kjy39Dvnyt5',
                        data: "'12,4343'",
                        dataElementId: 'frg39Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'loiu9Dvnyt5',
                        data: 'ORGANISATION_UNIT',
                        dataElementId: 'kjyu9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'kjfr9Dvnyt5',
                        data: 'Invalid date',
                        dataElementId: 'kjfr9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'hywr9Dvnyt5',
                        data: 'urlPath',
                        dataElementId: 'lqwr9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'gt769Dvnyt5',
                        data: 'FILE_RESOURCE',
                        dataElementId: 'mjus9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                    {
                        id: 'gt659Dvnyt5',
                        data: 'IMAGE',
                        dataElementId: 'fgrr9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                    },
                ],
            },
        ];
        const programRuleVariables = [];
        systemSettingsStore.set({ dateFormat: 'YYYY-MM-DD' });
        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([
            { type: 'ASSIGN', id: 'qrur9Dvnyt5', value: null, targetDataType: 'dataElement' },
            { type: 'ASSIGN', id: 'qrur9Dvnyt5', value: '10', targetDataType: 'dataElement' },
            { type: 'ASSIGN', id: 'oZg33kd9taw', value: 'false', targetDataType: 'dataElement' },
            { type: 'ASSIGN', id: 'oZ3fhkd9taw', value: '', targetDataType: 'dataElement' },
            {
                id: 'hrur9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: 'false',
            },
            {
                id: 'g67r9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: null,
            },
            {
                id: 'sfer9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: 'LONG_TEXT',
            },
            {
                id: 'hjrr9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: 'LETTER',
            },
            {
                id: 'lowr9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: 34535353,
            },
            {
                id: 'kht29Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: false,
            },
            {
                id: 'hyrt9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '2013-01-01',
            },
            {
                id: 'loir9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: {
                    date: 'Invalid date',
                    time: 'Invalid date',
                },
            },
            {
                id: 'sldkjfjfjfe',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: false,
            },
            {
                id: 'kyt49Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '30',
            },
            {
                id: 'kiyu9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '30',
            },
            {
                id: 'frt59Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '30',
            },
            {
                id: 'jhty9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '-30',
            },
            {
                id: 'jhrr9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '-30',
            },
            {
                id: 'hyur9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: 'Male,Female',
            },
            {
                id: 'ght5r9Dnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: 'Female,Male',
            },
            {
                id: 'plor9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '',
            },
            {
                id: 'frg39Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: {
                    latitude: 2,
                    longitude: 434,
                },
            },
            {
                id: 'kjyu9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '',
            },
            {
                id: 'kjfr9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: {
                    date: 'Invalid date',
                    days: 'NaN',
                    months: 'NaN',
                    years: 'NaN',
                },
            },
            {
                id: 'lqwr9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: false,
            },
            {
                id: 'mjus9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '',
            },
            {
                id: 'fgrr9Dvnyt5',
                targetDataType: 'dataElement',
                type: 'ASSIGN',
                value: '',
            },
        ]);
    });

    test('Assign effect with the program rule variable id found in the content key', () => {
        const programRules = [
            {
                id: 'cq1dwUY4lVU',
                condition: 'true',
                displayName: 'testing assign actions',
                programId: 'eBAyeGv0exc',
                programRuleActions: [
                    {
                        id: 'lJOYxhjupx2',
                        data: 'rowExpresion',
                        dataElementId: 'qrur9Dvnyt5',
                        programRuleActionType: 'ASSIGN',
                        content: 'Hemoglobin value lower than normal RycV5uDi66i',
                    },
                ],
            },
        ];
        const programRuleVariables = [
            {
                id: 'RycV5uDi66i',
                dataElementId: 'qrur9Dvnyt5',
                displayName: 'age',
                programId: 'eBAyeGv0exc',
                programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM,
                useNameForOptionSet: true,
            },
        ];
        // when
        const rulesEffects = rulesEngine.getProgramRuleEffects({
            programRulesContainer: { programRuleVariables, programRules, constants },
            currentEvent,
            dataElements: dataElementsInProgram,
            selectedOrgUnit: orgUnit,
            optionSets,
        });

        // then
        expect(rulesEffects).toEqual([
            { type: 'ASSIGN', id: 'qrur9Dvnyt5', value: 'false', targetDataType: 'dataElement' },
        ]);
    });
});
