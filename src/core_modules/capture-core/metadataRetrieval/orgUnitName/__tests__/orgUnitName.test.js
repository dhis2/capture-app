import {
    getAncestorIds,
    getCachedOrgUnitName,
    getOrgUnitNames,
} from '../orgUnitName';

describe('organisation unit name retrieval', () => {
    it('returns subvalues and caches names and ancestors from the API response', async () => {
        const rootId = 'org-unit-name-test-root';
        const childId = 'org-unit-name-test-child';
        const querySingleResource = jest.fn().mockResolvedValue({
            organisationUnits: [
                {
                    id: childId,
                    displayName: 'Child organisation unit',
                    ancestors: [
                        {
                            id: rootId,
                            displayName: 'Root organisation unit',
                        },
                    ],
                },
            ],
        });

        await expect(getOrgUnitNames([childId], querySingleResource)).resolves.toEqual({
            [childId]: {
                id: childId,
                name: 'Child organisation unit',
            },
        });
        expect(querySingleResource).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'organisationUnits' }),
            { filter: childId },
        );
        expect(getCachedOrgUnitName(childId)).toBe('Child organisation unit');
        expect(getCachedOrgUnitName(rootId)).toBe('Root organisation unit');

        await expect(getAncestorIds(childId, querySingleResource)).resolves.toEqual([rootId]);
        expect(querySingleResource).toHaveBeenCalledTimes(1);
    });
});
