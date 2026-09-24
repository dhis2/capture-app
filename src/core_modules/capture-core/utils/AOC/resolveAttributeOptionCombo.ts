import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ResourceQuery, QueryVariables } from 'capture-core-utils/types/app-runtime';

type QuerySingleResource = (resourceQuery: ResourceQuery, variables?: QueryVariables) => Promise<any>;

type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

// Backend team keeps AOC resolution off the server for enrollments (see memory
// project_enrollment_aoc_client_resolves_coc); the tracker enrollment import
// accepts only a resolved attributeOptionCombo UID. This helper does that
// resolution: /api/categoryOptionCombos with a filter on the picked options
// returns every COC that shares any of those options, and we pick the one
// whose option set matches exactly.
export const makeResolveAttributeOptionCombo = (querySingleResource: QuerySingleResource) =>
    async (categoryOptionUids: ReadonlyArray<string>): Promise<string | undefined> => {
        if (!categoryOptionUids || categoryOptionUids.length === 0) {
            return undefined;
        }

        const response = await querySingleResource({
            resource: 'categoryOptionCombos',
            params: {
                filter: `categoryOptions.id:in:[${categoryOptionUids.join(',')}]`,
                fields: 'id,categoryOptions[id]',
                paging: false,
            },
        });

        const candidates: Array<CategoryOptionCombo> =
            (response as any)?.categoryOptionCombos ?? [];
        const target = new Set(categoryOptionUids);

        const matches = candidates.filter(coc =>
            coc.categoryOptions.length === target.size &&
            coc.categoryOptions.every(({ id }) => target.has(id)),
        );

        if (matches.length > 1) {
            log.warn(
                errorCreator('Multiple category option combos match the same option set')({
                    matches: matches.map(({ id }) => id),
                    categoryOptionUids,
                }),
            );
        }

        return matches[0]?.id;
    };
