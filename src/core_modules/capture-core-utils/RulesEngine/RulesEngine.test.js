import RulesEngine from '../RulesEngine/RulesEngine';
import runRulesForSingleEvent from '../../capture-core/rulesEngineActionsCreator/runRulesForSingleEvent';

describe('rules engine', () => {
    const allEventsData = null;
    const currentEvent = null;
    describe.each([
        {
            program: {
                programRules: [{ id: 'GC4gpdoSD4r', condition: '#{hemoglobin} < 9', description: 'Show warning if hemoglobin is dangerously low', displayName: 'Hemoglobin warning', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'suS9GnraCx1', content: 'Hemoglobin value lower than normal', dataElementId: 'vANAXwtLwcT', programRuleActionType: 'SHOWWARNING' }] }, { id: 'dahuKlP7jR2', condition: '#{hemoglobin} > 99', description: 'Show error for hemoglobin value higher than 99', displayName: 'Show error for high hemoglobin value', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'UUwZWS8uirn', content: 'The hemoglobin value cannot be above 99', dataElementId: 'vANAXwtLwcT', programRuleActionType: 'SHOWERROR' }] }, { id: 'hk30qiUJYUR', condition: '#{Christos } == true', displayName: 'Christos Rules', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'eotNEY9CWxU', content: 'SAY YES', dataElementId: 'Ok9OQpitjQr', programRuleActionType: 'SHOWERROR' }] }, { id: 'xOe5qCzRS0Y', condition: '!#{womanSmoking} ', description: 'Hide smoking cessation councelling dataelement unless patient is smoking', displayName: 'Hide smoking cessation councelling', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'hwgyO59SSxu', dataElementId: 'Ok9OQpitjQr', programRuleActionType: 'HIDEFIELD' }] }],
                programRuleVariables: [{ id: 'DINatbKMS71', dataElementId: 'Ok9OQpitjQr', displayName: 'Christos ', programId: 'lxAQ7Zs9VYR', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'Z92dJO9gIje', dataElementId: 'sWoqcoByYmD', displayName: 'womanSmoking', programId: 'lxAQ7Zs9VYR', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }, { id: 'omrL0gtPpDL', dataElementId: 'vANAXwtLwcT', displayName: 'hemoglobin', programId: 'lxAQ7Zs9VYR', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }],
                id: 'lxAQ7Zs9VYR',
            },
            foundation: { programRules: [] },
            orgUnit: { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' },
        },
        {
            program: {
                programRules: [{ id: 'fd3wL1quxGb', condition: "#{gender} == 'Male'", description: 'Hide pregnant if gender is male', displayName: 'Hide pregnant if gender is male', programId: 'eBAyeGv0exc', programRuleActions: [{ id: 'IrmpncBsypT', dataElementId: 'SWfdB5lX0fk', programRuleActionType: 'HIDEFIELD', programStageSectionId: 'd7ZILSbPgYh' }] }, { id: 'x7PaHGvgWY2', condition: 'true', description: 'Body Mass Index. Weight in kg / height in m square.', displayName: 'BMI', programId: 'eBAyeGv0exc', programRuleActions: [{ id: 'x7PaHGvgWY2', content: 'BMI', data: '#{Zj7UnCAulEk.vV9UWAZohSf}/((#{Zj7UnCAulEk.GieVkTxp4HH}/100)*(#{Zj7UnCAulEk.GieVkTxp4HH}/100))', programRuleActionType: 'DISPLAYKEYVALUEPAIR', location: 'indicators' }] }],
                programRuleVariables: [{ id: 'RycV5uDi66i', dataElementId: 'qrur9Dvnyt5', displayName: 'age', programId: 'eBAyeGv0exc', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }, { id: 'zINGRka3g9N', dataElementId: 'oZg33kd9taw', displayName: 'gender', programId: 'eBAyeGv0exc', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }, { id: 'Zj7UnCAulEk.vV9UWAZohSf', displayName: 'Zj7UnCAulEk.vV9UWAZohSf', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', dataElementId: 'vV9UWAZohSf', programId: 'eBAyeGv0exc' }, { id: 'Zj7UnCAulEk.GieVkTxp4HH', displayName: 'Zj7UnCAulEk.GieVkTxp4HH', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', dataElementId: 'GieVkTxp4HH', programId: 'eBAyeGv0exc' }, { id: 'Zj7UnCAulEk.GieVkTxp4HH', displayName: 'Zj7UnCAulEk.GieVkTxp4HH', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', dataElementId: 'GieVkTxp4HH', programId: 'eBAyeGv0exc' }],
                id: 'lxAQ7Zs9VYR',
            },
            foundation: { programRules: [] },
            orgUnit: { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' },
        },
        {
            program: {
                programRules: [{ id: 'OIaW5H2KNNp', condition: "#{Diagnosis_Method}!='Microscope'", description: 'If Diagnosis Method == Microscope or Null —> hide section “RDT                Results”', displayName: 'XX MAL RDT - DIAGNOSIS METHOD - Microscopy', programId: 'MoUd5BTQ3lY', programRuleActions: [{ id: 'JkIaHCPIYHO', programRuleActionType: 'HIDESECTION', programStageSectionId: 'PAvRSZQyYjR' }], priority: 1 }, { id: 'V2rfYrFFDAn', condition: "(#{Diagnosis_Method}=='Microscopy' && #{Diagnosis_M_Result}!= 'Pv')                || (#{Diagnosis_Method}=='RDT' && #{Diagnosis_RDT_Result} !=                'Pv')", description: 'If Diagnosis Result == Pv or Negative or Null —> hide sections Treatment                Pf, Mixed', displayName: 'XX MAL RDT - DIAGNOSIS RESULT - Pv', programId: 'MoUd5BTQ3lY', programRuleActions: [{ id: 'x8WTOVMnE0g', programRuleActionType: 'HIDESECTION', programStageSectionId: 'yEPpF2nQ2bZ' }] }, { id: 'WMsEkeKwb18', condition: "(#{Diagnosis_Method}=='Microscopy' && #{Diagnosis_M_Result}!=                'Mixed') || (#{Diagnosis_Method}=='RDT' && #{Diagnosis_RDT_Result}!=                'Mixed')", description: 'If Diagnosis Result == Mixed or Negative or Null —> hide sections Treatment                Pf, Pv', displayName: 'XX MAL RDT - DIAGNOSIS RESULT - Mixed', programId: 'MoUd5BTQ3lY', programRuleActions: [{ id: 'ZxA4tbBK7y6', programRuleActionType: 'HIDESECTION', programStageSectionId: 'OzoUDRCtylB' }], priority: 2 }, { id: 'glMKQLqV6hN', condition: "(#{Diagnosis_Method} =='Microscopy' && #{Diagnosis_M_Result} != 'Pf')                || (#{Diagnosis_Method} == 'RDT' && #{Diagnosis_RDT_Result} !=                'Pf')", description: 'f Diagnosis Result == Pf or or Negative or Null —> hide sections Treatment                Pv, Mixed', displayName: 'XX MAL RDT - DIAGNOSIS RESULT - Pf', programId: 'MoUd5BTQ3lY', programRuleActions: [{ id: 'd9dB4tQWZka', programRuleActionType: 'HIDESECTION', programStageSectionId: 'PYgwzV0eQWs' }], priority: 2 }, { id: 'tQP5ArcLjXP', condition: "#{Diagnosis_Method} !='RDT'", description: 'If Diagnosis Method == RDT or Null —> hide section                “Microscopy”', displayName: 'XX MAL RDT - DIAGNOSIS METHOD - RDT', programId: 'MoUd5BTQ3lY', programRuleActions: [{ id: 'aSKg6HVXBMP', programRuleActionType: 'HIDESECTION', programStageSectionId: 'TIpDZhpNkmS' }], priority: 1 }, { id: 'zgwtr9dSVRA', condition: "#{Diagnosis_Method} !='Not Tested'", description: 'If Diagnosis Method == Not Tested or Null —> hide section “Reason for not                testing”', displayName: 'XX MAL RDT - DIAGNOSIS METHOD - Not Tested', programId: 'MoUd5BTQ3lY', programRuleActions: [{ id: 'TNL5nLGT2Jv', programRuleActionType: 'HIDESECTION', programStageSectionId: 'YpzV7H2BA6C' }] }],
                programRuleVariables: [{ id: 'Bn9GkaU8ayh', dataElementId: 'lWLkpWMHqEq', displayName: 'Diagnosis_Method', programId: 'MoUd5BTQ3lY', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: false }, { id: 'Q2zYkzn2fu7', dataElementId: 'XEuy83qbOvM', displayName: 'Diagnosis_M_Result', programId: 'MoUd5BTQ3lY', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: false }, { id: 'i47jDXmfVOC', dataElementId: 'diH9IbKTpHj', displayName: 'Diagnosis_RDT_Result', programId: 'MoUd5BTQ3lY', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: false }],
                id: 'MoUd5BTQ3lY',
            },
            foundation: { programRules: [] },
            orgUnit: { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' },
        },
        {
            program: null,
            foundation: null,
            orgUnit: { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' },
        },
    ])('where the default values', ({ program, foundation, orgUnit }) => {
        test('Tests on runRulesForSingleEvent function', () => {
            const rulesEngine = new RulesEngine();

            const rulesEffects = runRulesForSingleEvent(rulesEngine, program, foundation, orgUnit, currentEvent, allEventsData);

            expect(rulesEffects).toMatchSnapshot();
        });
    });
});


describe('rules engine', () => {
    // these variables are shared between each test
    const constants = [{ id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 }, { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 }];
    const dataElementsInProgram = { sWoqcoByYmD: { id: 'sWoqcoByYmD', valueType: 'BOOLEAN' }, Ok9OQpitjQr: { id: 'Ok9OQpitjQr', valueType: 'BOOLEAN' }, vANAXwtLwcT: { id: 'vANAXwtLwcT', valueType: 'NUMBER' } };
    const programRules = [{ id: 'GC4gpdoSD4r', condition: '#{hemoglobin} < 9', description: 'Show warning if hemoglobin is dangerously low', displayName: 'Hemoglobin warning', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'suS9GnraCx1', content: 'Hemoglobin value lower than normal', dataElementId: 'vANAXwtLwcT', programRuleActionType: 'SHOWWARNING' }] }, { id: 'dahuKlP7jR2', condition: '#{hemoglobin} > 99', description: 'Show error for hemoglobin value higher than 99', displayName: 'Show error for high hemoglobin value', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'UUwZWS8uirn', content: 'The hemoglobin value cannot be above 99', dataElementId: 'vANAXwtLwcT', programRuleActionType: 'SHOWERROR' }] }, { id: 'hk30qiUJYUR', condition: '#{Christos } == true', displayName: 'Christos Rules', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'eotNEY9CWxU', content: 'SAY YES', dataElementId: 'Ok9OQpitjQr', programRuleActionType: 'SHOWERROR' }] }, { id: 'xOe5qCzRS0Y', condition: '!#{womanSmoking} ', description: 'Hide smoking cessation councelling dataelement unless patient is smoking', displayName: 'Hide smoking cessation councelling', programId: 'lxAQ7Zs9VYR', programRuleActions: [{ id: 'hwgyO59SSxu', dataElementId: 'Ok9OQpitjQr', programRuleActionType: 'HIDEFIELD' }] }];
    const programRulesVariables = [{ id: 'DINatbKMS71', dataElementId: 'Ok9OQpitjQr', displayName: 'Christos ', programId: 'lxAQ7Zs9VYR', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'Z92dJO9gIje', dataElementId: 'sWoqcoByYmD', displayName: 'womanSmoking', programId: 'lxAQ7Zs9VYR', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }, { id: 'omrL0gtPpDL', dataElementId: 'vANAXwtLwcT', displayName: 'hemoglobin', programId: 'lxAQ7Zs9VYR', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSet = {};

    describe.each([
        { vANAXwtLwcT: 0 },
        { vANAXwtLwcT: 9 },
        { vANAXwtLwcT: 99 },
        { vANAXwtLwcT: 100 },
    ])('where value needs to >= 9 and <= 99', (value) => {
        test(`and given value is ${JSON.stringify(value)}`, () => {
            // given
            const { currentEvent, allEvents } = {
                currentEvent: value,
                allEvents: { all: [value], byStage: {} },
            };
            const rulesEngine = new RulesEngine();

            // when
            const rulesEffects = rulesEngine.executeEventRules(
              { programRulesVariables, programRules, constants },
              { currentEvent, allEvents },
              dataElementsInProgram,
              orgUnit,
              optionSet,
            );

            // then
            expect(rulesEffects).toMatchSnapshot();
        });
    });

    describe.each([
        { sWoqcoByYmD: true },
        { sWoqcoByYmD: false },
    ])('area is hidden', (value) => {
        test(`and given value is ${JSON.stringify(value)}`, () => {
            // given
            const { currentEvent, allEvents } = {
                currentEvent: value,
                allEvents: { all: [value], byStage: {} },
            };
            const rulesEngine = new RulesEngine();

            // when
            const rulesEffects = rulesEngine.executeEventRules(
              { programRulesVariables, programRules, constants },
              { currentEvent, allEvents },
              dataElementsInProgram,
              orgUnit,
              optionSet,
            );

            // then
            expect(rulesEffects).toMatchSnapshot();
        });
    });
});

describe('rules engine', () => {
    // these variables are shared between each test
    const constants = [{ id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 }, { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 }];
    const dataElementsInProgram = { oZg33kd9taw: { id: 'oZg33kd9taw', valueType: 'TEXT', optionSetId: 'pC3N9N77UmT' }, SWfdB5lX0fk: { id: 'SWfdB5lX0fk', valueType: 'BOOLEAN', optionSetId: undefined }, qrur9Dvnyt5: { id: 'qrur9Dvnyt5', valueType: 'INTEGER', optionSetId: undefined }, GieVkTxp4HH: { id: 'GieVkTxp4HH', valueType: 'NUMBER', optionSetId: undefined }, vV9UWAZohSf: { id: 'vV9UWAZohSf', valueType: 'INTEGER_POSITIVE', optionSetId: undefined }, eMyVanycQSC: { id: 'eMyVanycQSC', valueType: 'DATE', optionSetId: undefined }, K6uUAvq500H: { id: 'K6uUAvq500H', valueType: 'TEXT', optionSetId: 'eUZ79clX7y1' }, msodh3rEMJa: { id: 'msodh3rEMJa', valueType: 'DATE', optionSetId: undefined }, S33cRBsnXPo: { id: 'S33cRBsnXPo', valueType: 'ORGANISATION_UNIT', optionSetId: undefined }, fWIAEtYVEGk: { id: 'fWIAEtYVEGk', valueType: 'TEXT', optionSetId: 'iDFPKpFTiVw' }, ulD2zW0TIy2: { id: 'ulD2zW0TIy2', valueType: 'FILE_RESOURCE' } };
    const programRules = [{ id: 'fd3wL1quxGb', condition: "#{gender} == 'Male'", description: 'Hide pregnant if gender is male', displayName: 'Hide pregnant if gender is male', programId: 'eBAyeGv0exc', programRuleActions: [{ id: 'IrmpncBsypT', dataElementId: 'SWfdB5lX0fk', programRuleActionType: 'HIDEFIELD', programStageSectionId: 'd7ZILSbPgYh' }] }, { id: 'x7PaHGvgWY2', condition: 'true', description: 'Body Mass Index. Weight in kg / height in m square.', displayName: 'BMI', programId: 'eBAyeGv0exc', programRuleActions: [{ id: 'x7PaHGvgWY2', content: 'BMI', data: '#{Zj7UnCAulEk.vV9UWAZohSf}/((#{Zj7UnCAulEk.GieVkTxp4HH}/100)*(#{Zj7UnCAulEk.GieVkTxp4HH}/100))', programRuleActionType: 'DISPLAYKEYVALUEPAIR', location: 'indicators' }] }];
    const programRulesVariables = [{ id: 'RycV5uDi66i', dataElementId: 'qrur9Dvnyt5', displayName: 'age', programId: 'eBAyeGv0exc', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }, { id: 'zINGRka3g9N', dataElementId: 'oZg33kd9taw', displayName: 'gender', programId: 'eBAyeGv0exc', programRuleVariableSourceType: 'DATAELEMENT_NEWEST_EVENT_PROGRAM', useNameForOptionSet: true }, { id: 'Zj7UnCAulEk.vV9UWAZohSf', displayName: 'Zj7UnCAulEk.vV9UWAZohSf', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', dataElementId: 'vV9UWAZohSf', programId: 'eBAyeGv0exc' }, { id: 'Zj7UnCAulEk.GieVkTxp4HH', displayName: 'Zj7UnCAulEk.GieVkTxp4HH', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', dataElementId: 'GieVkTxp4HH', programId: 'eBAyeGv0exc' }, { id: 'Zj7UnCAulEk.GieVkTxp4HH', displayName: 'Zj7UnCAulEk.GieVkTxp4HH', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', dataElementId: 'GieVkTxp4HH', programId: 'eBAyeGv0exc' }];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSet = { pC3N9N77UmT: { id: 'pC3N9N77UmT', displayName: 'Gender', version: 0, valueType: 'TEXT', options: [{ id: 'rBvjJYbMCVx', displayName: 'Male', code: 'Male', translations: [] }, { id: 'Mnp3oXrpAbK', displayName: 'Female', code: 'Female', translations: [] }] } };

    describe.each([
        { oZg33kd9taw: 'Female', SWfdB5lX0fk: null },
        { oZg33kd9taw: 'Male', SWfdB5lX0fk: null },
        { oZg33kd9taw: null, SWfdB5lX0fk: null },
    ])('field will be hidden', (value) => {
        test(`and given value is ${JSON.stringify(value)}`, () => {
            // given
            const { currentEvent, allEvents } = {
                currentEvent: value,
                allEvents: { all: [value], byStage: {} },
            };
            const rulesEngine = new RulesEngine();

            // when
            const rulesEffects = rulesEngine.executeEventRules(
              { programRulesVariables, programRules, constants },
              { currentEvent, allEvents },
              dataElementsInProgram,
              orgUnit,
              optionSet,
            );

            // then
            expect(rulesEffects).toMatchSnapshot();
        });
    });

    describe.each([
        { qrur9Dvnyt5: null, GieVkTxp4HH: null, vV9UWAZohSf: null },
        { qrur9Dvnyt5: null, GieVkTxp4HH: null, vV9UWAZohSf: 85 },
        { qrur9Dvnyt5: null, GieVkTxp4HH: 180, vV9UWAZohSf: null },
        { qrur9Dvnyt5: null, GieVkTxp4HH: 180, vV9UWAZohSf: 85 },
        { qrur9Dvnyt5: 40, GieVkTxp4HH: null, vV9UWAZohSf: null },
        { qrur9Dvnyt5: 40, GieVkTxp4HH: null, vV9UWAZohSf: 85 },
        { qrur9Dvnyt5: 40, GieVkTxp4HH: 180, vV9UWAZohSf: null },
        { qrur9Dvnyt5: 40, GieVkTxp4HH: 180, vV9UWAZohSf: 85 },
    ])('where BMI is calculated', (value) => {
        test(`and given value is ${JSON.stringify(value)}`, () => {
            // given
            const { currentEvent, allEvents } = {
                currentEvent: value,
                allEvents: { all: [value], byStage: {} },
            };
            const rulesEngine = new RulesEngine();

            // when
            const rulesEffects = rulesEngine.executeEventRules(
              { programRulesVariables, programRules, constants },
              { currentEvent, allEvents },
              dataElementsInProgram,
              orgUnit,
              optionSet,
            );

            // then
            expect(rulesEffects).toMatchSnapshot();
        });
    });
});

describe('rules engine', () => {
    // these variables are shared between each test
    const constants = [{ id: 'Gfd3ppDfq8E', displayName: 'Commodity ordering overhead', value: 5 }, { id: 'bCqvfPR02Im', displayName: 'Pi', value: 3.14 }];
    const dataElementsInProgram = { dyfYIsTFTjG: { id: 'dyfYIsTFTjG', valueType: 'TEXT' }, XOaXLWuhKzV: { id: 'XOaXLWuhKzV', valueType: 'TEXT', optionSetId: 'WDUwjiW2rGH' }, AtFlciXnstG: { id: 'AtFlciXnstG', valueType: 'INTEGER_ZERO_OR_POSITIVE' }, JGnHr6WI3AY: { id: 'JGnHr6WI3AY', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' }, s3eoonJ8OJb: { id: 's3eoonJ8OJb', valueType: 'DATE' }, gktroFPckdr: { id: 'gktroFPckdr', valueType: 'TEXT', optionSetId: 'UYDsNdpo2BU' }, QQLXTXVidW2: { id: 'QQLXTXVidW2', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' }, ovY6E8BSdto: { id: 'ovY6E8BSdto', valueType: 'TEXT', optionSetId: 'dsgBmIZ0Yrq' }, Z5z8vFQy0w0: { id: 'Z5z8vFQy0w0', valueType: 'TEXT' }, TzqawmlPkI5: { id: 'TzqawmlPkI5', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' }, f8j4XDEozvj: { id: 'f8j4XDEozvj', valueType: 'TEXT', optionSetId: 'xD9QOIvNAjw' }, jBBkFuPKctq: { id: 'jBBkFuPKctq', valueType: 'TEXT', optionSetId: 'T9zjyaIkRqH' }, A4Fg6jgWauf: { id: 'A4Fg6jgWauf', valueType: 'TEXT', optionSetId: 'w1vUkxq8IOl' }, CUbZcLm9LyN: { id: 'CUbZcLm9LyN', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' }, p8htbyJHydl: { id: 'p8htbyJHydl', valueType: 'TEXT', optionSetId: 'L6eMZDJkCwX' }, SbXES4EPgqP: { id: 'SbXES4EPgqP', valueType: 'NUMBER' }, bOYWVEBaWy6: { id: 'bOYWVEBaWy6', valueType: 'TEXT', optionSetId: 'qI4cs9ocBwn' }, PFXeJV8d7ja: { id: 'PFXeJV8d7ja', valueType: 'DATE' } };
    const programRules = [{ id: 'DOz4wl8ErDD', condition: 'true', description: 'Hide Irrelevant Test Result Options', displayName: 'Hide Test Result Options', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'XuM1JizlcF1', dataElementId: 'ovY6E8BSdto', programRuleActionType: 'HIDEOPTION', optionId: 'MkeWrqeqZXL' }, { id: 'FRfTFXSwKDU', dataElementId: 'ovY6E8BSdto', programRuleActionType: 'HIDEOPTION', optionId: 'fPV0gQ8ds6D' }] }, { id: 'DtfaG1TgyZk', condition: "(d2:hasValue( 'LAB_TEST' )  && #{LAB_TEST} == 'No') ||\n(d2:hasValue( 'LAB_TEST' )  && #{LAB_TEST} == 'Yes'  && #{TEST_RESULT} == 'Inconclusive')", description: "Automation: Assign 'Probable Case' to Case Classification", displayName: "Assign 'Probable Case' to Case Classification", programId: 'PNClHaZARtz', programRuleActions: [{ id: 'NPvy6sF6axT', data: "'Probable Case'", dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'ASSIGN' }], priority: 4 }, { id: 'E9ghdhg6ABQ', condition: "#{SYMPTOMS}  != 'Yes'", description: 'Hide Onset of Symptoms Date if no symptoms', displayName: 'Hide Onset of Symptoms Date', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'VcnnsBPtzlW', dataElementId: 's3eoonJ8OJb', programRuleActionType: 'HIDEFIELD' }] }, { id: 'FnSVDp8v0H9', condition: 'true', description: 'Hide Irrelevant Unknown Options', displayName: 'Hide Unknown Options', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'UqDEcMuF5DF', dataElementId: 'JGnHr6WI3AY', programRuleActionType: 'HIDEOPTION', optionId: 'pqxvAQU1z9W' }, { id: 'GrFjkYTT07o', dataElementId: 'p8htbyJHydl', programRuleActionType: 'HIDEOPTION', optionId: 'pqxvAQU1z9W' }, { id: 'HlyTQaTz00f', dataElementId: 'CUbZcLm9LyN', programRuleActionType: 'HIDEOPTION', optionId: 'pqxvAQU1z9W' }] }, { id: 'L8bP6GifQXL', condition: "!d2:hasValue( 'INFECTION_SOURCE' )  || #{INFECTION_SOURCE} == 'IMPORTED_CASE'  || #{INFECTION_SOURCE} == 'EXPOSURE_UNKNOWN'", description: 'Hide Case Type for Imported Cases', displayName: 'Hide Case Type', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'k05Owr8pwIn', dataElementId: 'A4Fg6jgWauf', programRuleActionType: 'HIDEFIELD' }] }, { id: 'MLS5vZLguQM', condition: "#{INFECTION_SOURCE} != 'LOCAL_TRANSMISSION'", description: "Hide 'Specify Local Infection Source' unless Local Transmission is selected", displayName: "Hide 'Specify Local Infection Source'", programId: 'PNClHaZARtz', programRuleActions: [{ id: 'ho7xRPUB0Gl', dataElementId: 'jBBkFuPKctq', programRuleActionType: 'HIDEFIELD' }] }, { id: 'NXWk8sq70OV', condition: "#{TRAVEL_HISTORY} == 'No'", description: "Hide 'Imported Case' if not traveled", displayName: "Hide 'Imported Case'", programId: 'PNClHaZARtz', programRuleActions: [{ id: 'fJIgmDK53Vp', dataElementId: 'f8j4XDEozvj', programRuleActionType: 'HIDEOPTION', optionId: 'PMGTqmVIF4T' }] }, { id: 'NZaVqr7dPfQ', condition: "!d2:hasValue( 'ONSET_DATE' ) && !d2:hasValue('event_date')", description: 'Automation: Assign Empty date if no Onset date and no event date is available', displayName: 'Assign Empty Date', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'q060xuOwQx3', data: "''", dataElementId: 'PFXeJV8d7ja', programRuleActionType: 'ASSIGN' }], priority: 3 }, { id: 'QrJx9LI9KRo', condition: "d2:hasValue( 'LAB_TEST' ) && #{LAB_TEST}  == 'Yes'  && !d2:hasValue( 'TEST_RESULT' )", description: 'Automation: Assign Empty Value to Class Classification', displayName: 'Assign Empty Value to Class Classification', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'rFaZAbOgMSz', data: "''", dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'ASSIGN' }], priority: 2 }, { id: 'R6oEX1xlQma', condition: 'true', description: 'Hide irrelevant Outcome Options', displayName: 'Hide Outcome Options', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'Ov7qHXf0Q2s', dataElementId: 'bOYWVEBaWy6', programRuleActionType: 'HIDEOPTION', optionId: 'dUeRcF2cApV' }, { id: 'V95rgvUlqY0', dataElementId: 'bOYWVEBaWy6', programRuleActionType: 'HIDEOPTION', optionId: 'bYt4why1tL3' }, { id: 'eZUUOjykbLv', dataElementId: 'bOYWVEBaWy6', programRuleActionType: 'HIDEOPTION', optionId: 'xBoo6HyaYcd' }, { id: 'Zcs7rz5VEF7', dataElementId: 'bOYWVEBaWy6', programRuleActionType: 'HIDEOPTION', optionId: 'RCT079wdeKT' }] }, { id: 'dZsTiQEUg5L', condition: "!d2:hasValue( 'ONSET_DATE' ) && d2:hasValue('event_date')", description: 'Automation: Assign Event date if no Onset date is available', displayName: 'Assign Event Date', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'sQKFBORp5P1', data: 'V{event_date}', dataElementId: 'PFXeJV8d7ja', programRuleActionType: 'ASSIGN' }], priority: 2 }, { id: 'kVBrxwODyTj', condition: "!d2:hasValue( 'LAB_TEST' )", description: 'Hide Case Classification Field until Lab Test question is answered', displayName: 'Hide Case Classification Field', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'ZT8AexxBPl0', dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'HIDEFIELD' }] }, { id: 'q2QbEfeDlI9', condition: "!d2:hasValue( 'HOSPITALISED' ) || #{HOSPITALISED}  == 'No'", description: 'Hide ICU field unless Hospitalised', displayName: 'Hide ICU field', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'wwvxLCpuOCx', dataElementId: 'p8htbyJHydl', programRuleActionType: 'HIDEFIELD' }] }, { id: 'rZUpiMuJIKH', condition: "d2:hasValue( 'LAB_TEST' )  && #{LAB_TEST} == 'Yes'  && #{TEST_RESULT} == 'Positive'", description: "Automation: Assign 'Laboratory Confirmed Case' to Case Classification", displayName: "Assign 'Laboratory Confirmed Case' to Case Classification", programId: 'PNClHaZARtz', programRuleActions: [{ id: 'hcamYSDn00P', data: "'Laboratory Confirmed Case'", dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'ASSIGN' }], priority: 3 }, { id: 'sEQsGGAQSJT', condition: "(d2:hasValue( 'LAB_TEST' )  && #{LAB_TEST} == 'Unknown') ||\n(d2:hasValue( 'LAB_TEST' )  && #{LAB_TEST} == 'Yes'  && (#{TEST_RESULT} == 'Negative' || #{TEST_RESULT} == 'Unknown'))", description: "Automation: Assign Suspected Case' to Case Classification", displayName: "Assign 'Suspected Case' to Case Classification", programId: 'PNClHaZARtz', programRuleActions: [{ id: 'zxb2XDboGAF', data: "'Suspected Case'", dataElementId: 'Z5z8vFQy0w0', programRuleActionType: 'ASSIGN' }], priority: 1 }, { id: 'sKCZMuWwOKA', condition: "d2:hasValue( 'ONSET_DATE' )", description: 'Automation: Assign Symptoms Onset Date if available', displayName: 'Assign Onset Date', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'lJOYxhjupxz', data: '#{ONSET_DATE}', dataElementId: 'PFXeJV8d7ja', programRuleActionType: 'ASSIGN' }], priority: 1 }, { id: 'vj5GWKIrhKh', condition: "#{LAB_TEST} != 'Yes'", description: 'Hide Test Result Field until Lab Test question is answered with yes', displayName: 'Hide Test Result Field', programId: 'PNClHaZARtz', programRuleActions: [{ id: 'VxxxIX2598r', dataElementId: 'ovY6E8BSdto', programRuleActionType: 'HIDEFIELD' }] }];
    const programRulesVariables = [{ id: 'DoRHHfNPccb', dataElementId: 'f8j4XDEozvj', displayName: 'INFECTION_SOURCE', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: false }, { id: 'EnpvdmYrwLb', dataElementId: 'TzqawmlPkI5', displayName: 'TRAVEL_HISTORY', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'JPIyrAmJapV', dataElementId: 'CUbZcLm9LyN', displayName: 'HOSPITALISED', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'LAaPMTz69L7', displayName: 'CASE_CLASSIFICATION', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'CALCULATED_VALUE', useNameForOptionSet: true }, { id: 'MpixycZvu0m', dataElementId: 'ovY6E8BSdto', displayName: 'TEST_RESULT', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'XcPYCpTOPwB', dataElementId: 'QQLXTXVidW2', displayName: 'LAB_TEST', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'cZSslcAEupI', dataElementId: 's3eoonJ8OJb', displayName: 'ONSET_DATE', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'eSq3nc1t2F6', dataElementId: 'dyfYIsTFTjG', displayName: 'PATIENT_ID', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: true }, { id: 'lY0yJGU1D4e', dataElementId: 'JGnHr6WI3AY', displayName: 'SYMPTOMS', programId: 'PNClHaZARtz', programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT', useNameForOptionSet: false }];
    const orgUnit = { id: 'DiszpKrYNg8', name: 'Ngelehun CHC' };
    const optionSet = {
        L6eMZDJkCwX: { id: 'L6eMZDJkCwX', displayName: 'Yes/No/Unknown', version: 3, valueType: 'TEXT', options: [{ id: 'x9yVKkv9koc', displayName: 'Yes', code: 'Yes', translations: [{ property: 'NAME', locale: 'uz@Latn', value: 'Ha' }, { property: 'NAME', locale: 'fr', value: 'Oui' }, { property: 'NAME', locale: 'pt', value: 'Sim' }, { property: 'NAME', locale: 'uz@Cyrl', value: 'Ҳа' }, { property: 'NAME', locale: 'es', value: 'Sí' }, { property: 'NAME', locale: 'nb', value: 'Ja' }, { property: 'NAME', locale: 'ru', value: 'да' }] }, { id: 'R98tI2c6rF5', displayName: 'No', code: 'No', translations: [{ property: 'NAME', locale: 'nb', value: 'Nei' }, { property: 'NAME', locale: 'es', value: 'No' }, { property: 'NAME', locale: 'uz@Latn', value: 'Yo`q' }, { property: 'NAME', locale: 'ru', value: 'нет' }, { property: 'NAME', locale: 'pt', value: 'Não' }, { property: 'NAME', locale: 'fr', value: 'Non' }, { property: 'NAME', locale: 'uz@Cyrl', value: 'Йўқ' }] }, { id: 'pqxvAQU1z9W', displayName: 'Unknown', code: 'Unknown', translations: [{ property: 'NAME', locale: 'es', value: 'DEsconocido' }, { property: 'NAME', locale: 'nb', value: 'Ukjent' }, { property: 'NAME', locale: 'uz@Cyrl', value: 'Ноаниқ' }, { property: 'NAME', locale: 'fr', value: 'Inconnu' }, { property: 'NAME', locale: 'uz@Latn', value: 'Noaniq' }, { property: 'NAME', locale: 'pt', value: 'Desconhecido' }, { property: 'NAME', locale: 'ru', value: 'Неизвестно' }] }] },
        dsgBmIZ0Yrq: { id: 'dsgBmIZ0Yrq', displayName: 'Test Result', version: 6, valueType: 'TEXT', options: [{ id: 'B44lkxTWbGO', displayName: 'Inconclusive', code: 'Inconclusive', translations: [{ property: 'NAME', locale: 'fr', value: 'Non concluant' }, { property: 'NAME', locale: 'pt', value: 'Inconclusivo' }, { property: 'NAME', locale: 'nb', value: 'Mangelfull' }, { property: 'NAME', locale: 'es', value: 'No concluyente' }, { property: 'NAME', locale: 'ru', value: 'Неокончательный' }] }, { id: 'ljClr1z2aE7', displayName: 'Negative', code: 'Negative', translations: [{ property: 'NAME', locale: 'fr', value: 'Négatif' }, { property: 'NAME', locale: 'nb', value: 'Negativ' }, { property: 'NAME', locale: 'es', value: 'Negativo' }, { property: 'NAME', locale: 'uz@Latn', value: 'Manfiy' }, { property: 'NAME', locale: 'pt', value: 'Negativo' }, { property: 'NAME', locale: 'ru', value: 'Отрицательный' }, { property: 'NAME', locale: 'uz@Cyrl', value: 'Манфий' }] }, { id: 'LKbwTJwocOk', displayName: 'Positive', code: 'Positive', translations: [{ property: 'NAME', locale: 'ru', value: 'Положительный' }, { property: 'NAME', locale: 'es', value: 'Positivo' }, { property: 'NAME', locale: 'uz@Latn', value: 'Musbat' }, { property: 'NAME', locale: 'uz@Cyrl', value: 'Мусбат' }, { property: 'NAME', locale: 'nb', value: 'Positiv' }, { property: 'NAME', locale: 'fr', value: 'Positif' }, { property: 'NAME', locale: 'pt', value: 'Positivo' }] }, { id: 'MkeWrqeqZXL', displayName: 'Not performed', code: 'Not performed', translations: [{ property: 'NAME', locale: 'ru', value: 'Не выполнен' }, { property: 'NAME', locale: 'pt', value: 'Não realizado' }, { property: 'NAME', locale: 'nb', value: 'Ikke utført' }, { property: 'NAME', locale: 'fr', value: 'Non réalisé' }, { property: 'NAME', locale: 'es', value: 'No realizado' }] }, { id: 'fPV0gQ8ds6D', displayName: 'Invalid', code: 'Invalid', translations: [{ property: 'NAME', locale: 'es', value: 'Inválido' }, { property: 'NAME', locale: 'fr', value: 'Invalide' }, { property: 'NAME', locale: 'pt', value: 'Inválido' }, { property: 'NAME', locale: 'nb', value: 'Ugyldig' }, { property: 'NAME', locale: 'ru', value: 'Недействительный' }] }, { id: 'YV3jCZlvwZe', displayName: 'Unknown', code: 'Unknown', translations: [{ property: 'NAME', locale: 'es', value: 'DEsconocido' }, { property: 'NAME', locale: 'nb', value: 'Ukjent' }, { property: 'NAME', locale: 'uz@Cyrl', value: 'Ноаниқ' }, { property: 'NAME', locale: 'fr', value: 'Inconnu' }, { property: 'NAME', locale: 'uz@Latn', value: 'Noaniq' }, { property: 'NAME', locale: 'pt', value: 'Desconhecido' }, { property: 'NAME', locale: 'ru', value: 'Неизвестно' }] }] },
    };

    // NOTE: in this test we dont use toMatchSnapshot instead we test again hardcoded values. Since the effects are plenty
    // here each time this way we can avoid mistakes in comparing snapshots
    describe.each([
        [
            { JGnHr6WI3AY: 'Yes' },
            [{ type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'Z5z8vFQy0w0' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }, { type: 'HIDEFIELD', id: 'ovY6E8BSdto' }],
        ],
        [
            { QQLXTXVidW2: 'Yes' },
            [{ type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: null }, { type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }],
        ],
        [
            { QQLXTXVidW2: 'No' },
            [{ type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: 'Probable Case' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }, { type: 'HIDEFIELD', id: 'ovY6E8BSdto' }],
        ],
        [
            { QQLXTXVidW2: 'Unknown' },
            [{ type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: 'Suspected Case' }, { type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }, { type: 'HIDEFIELD', id: 'ovY6E8BSdto' }],
        ],
        [
            { CUbZcLm9LyN: 'Yes' },
            [{ type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'Z5z8vFQy0w0' }, { type: 'HIDEFIELD', id: 'ovY6E8BSdto' }],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Inconclusive' },
            [{ type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: 'Probable Case' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Positive' },
            [{ type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: 'Laboratory Confirmed Case' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Negative' },
            [{ type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: 'Suspected Case' }, { type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }],
        ],
        [
            { QQLXTXVidW2: 'Yes', ovY6E8BSdto: 'Unknown' },
            [{ type: 'ASSIGN', id: 'Z5z8vFQy0w0', value: 'Suspected Case' }, { type: 'ASSIGN', id: 'PFXeJV8d7ja', value: null }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'MkeWrqeqZXL' }, { type: 'HIDEOPTION', id: 'ovY6E8BSdto', optionId: 'fPV0gQ8ds6D' }, { type: 'HIDEFIELD', id: 's3eoonJ8OJb' }, { type: 'HIDEOPTION', id: 'JGnHr6WI3AY', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'p8htbyJHydl', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEOPTION', id: 'CUbZcLm9LyN', optionId: 'pqxvAQU1z9W' }, { type: 'HIDEFIELD', id: 'A4Fg6jgWauf' }, { type: 'HIDEFIELD', id: 'jBBkFuPKctq' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'dUeRcF2cApV' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'bYt4why1tL3' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'xBoo6HyaYcd' }, { type: 'HIDEOPTION', id: 'bOYWVEBaWy6', optionId: 'RCT079wdeKT' }, { type: 'HIDEFIELD', id: 'p8htbyJHydl' }],
        ],
    ])('field will be hidden', (value, expected) => {
        test(`and given value is ${JSON.stringify(value)}`, () => {
            // given
            const { currentEvent, allEvents } = {
                currentEvent: value,
                allEvents: { all: [value], byStage: {} },
            };
            const rulesEngine = new RulesEngine();

            // when
            const rulesEffects = rulesEngine.executeEventRules(
              { programRulesVariables, programRules, constants },
              { currentEvent, allEvents },
              dataElementsInProgram,
              orgUnit,
              optionSet,
            );

            // then
            expect(rulesEffects).toEqual(expected);
        });
    });
});

