import { queryRecursively } from '../../../IOUtils';
import { queryProgramsOutline } from '../queryProgramsOutline';

jest.mock('../../../IOUtils', () => ({
    queryRecursively: jest.fn(),
}));

describe('queryProgramsOutline', () => {
    beforeEach(() => {
        queryRecursively.mockReset();
    });

    it('only requests programs explicitly enabled for the Capture app', async () => {
        queryRecursively.mockResolvedValue([
            { programs: [{ id: 'enabledProgram' }] },
            { programs: [{ id: 'anotherEnabledProgram' }] },
        ]);

        await expect(queryProgramsOutline()).resolves.toEqual([
            { id: 'enabledProgram' },
            { id: 'anotherEnabledProgram' },
        ]);

        expect(queryRecursively).toHaveBeenCalledWith({
            resource: 'programs',
            params: {
                fields: 'id,version,programTrackedEntityAttributes[trackedEntityAttribute[id,optionSet[id,version]]],' +
                    'programStages[id,programStageDataElements[dataElement[id,optionSet[id,version]]]]',
                filter: [
                    'attributeValues.attribute.id:eq:RyYftsGAmfF',
                    'attributeValues.value:eq:true',
                ],
            },
        }, { pageSize: 1000 });
    });
});
