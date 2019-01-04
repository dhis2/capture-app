import metaPrograms from '../metaPrograms.apiSpecification';
import optionSets from '../optionSets.apiSpecification';
import programIndicators from '../programIndicators.apiSpecification';
import programRules from '../programRules.apiSpecification';
import programRulesVariables from '../programRulesVariables.apiSpecification';
import trackedEntityAttributes from '../trackedEntityAttributes.apiSpecification';

it('metaPrograms converter', () => {
    const id = '1';
    const ids = [{ id }];
    const convertedData = metaPrograms.converter(ids);
    expect(convertedData[0].id).toEqual(id);
});

it('optionSets converter', () => {
    const emptyConvertedData = optionSets.converter();
    expect(emptyConvertedData).toBeDefined();
    expect(emptyConvertedData).toHaveLength(0);

    const testOptionSet = {
        id: '1',
        options: {
            values: () => [
                {
                    id: 'o1',
                },
            ],
        },
    };

    const convertedOptionSet = optionSets.converter([testOptionSet]);
    expect(convertedOptionSet[0].id).toEqual(testOptionSet.id);
});

it('programIndicators converter', () => {
    const id = '1';
    const ids = [{ id }];
    const convertedData = programIndicators.converter(ids);
    expect(convertedData[0].id).toEqual(id);
});

it('programRules converter', () => {
    const id = '1';
    const ids = [
        {
            id,
            program: {
                id,
                programRuleActions: [],
            },
        },
    ];
    const convertedData = programRules.converter(ids);
    expect(convertedData[0].id).toEqual(id);
});

it('programRulesVariables converter', () => {
    const id = '1';
    const ids = [{ id }];
    const convertedData = programRulesVariables.converter(ids);
    expect(convertedData[0].id).toEqual(id);
});

it('trackedEntityAttributes converter', () => {
    const id = '1';
    const ids = [{ id }];
    const convertedData = trackedEntityAttributes.converter(ids);
    expect(convertedData[0].id).toEqual(id);
});
