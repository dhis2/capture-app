// @flow
import i18n from '@dhis2/d2-i18n';

import RulesEngine from '../RulesEngine/RulesEngine';
import inputValueConverter from '../../capture-core/rulesEngineActionsCreator/converters/inputValueConverter';
import momentConverter from '../../capture-core/rulesEngineActionsCreator/converters/momentConverter';
import outputRulesEffectsValueConverter from '../../capture-core/rulesEngineActionsCreator/converters/rulesEffectsValueConverter';
import runRulesForSingleEvent from '../../capture-core/rulesEngineActionsCreator/runRulesForSingleEvent';

const programs = [
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
];

programs.forEach(({ program, foundation, orgUnit }) => {
    test('Tests on runRulesForSingleEvent function', () => {
        const rulesEngine = new RulesEngine(inputValueConverter, momentConverter, i18n.t, outputRulesEffectsValueConverter);

        const rulesEffects = runRulesForSingleEvent(rulesEngine, program, foundation, orgUnit);

        expect(rulesEffects).toMatchSnapshot();
    });
});
