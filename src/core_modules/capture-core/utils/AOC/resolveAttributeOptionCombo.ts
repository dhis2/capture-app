import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ResourceQuery, QueryVariables } from 'capture-core-utils/types/app-runtime';

type QuerySingleResource = (resourceQuery: ResourceQuery, variables?: QueryVariables) => Promise<any>;

type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

export const makeResolveAttributeOptionCombo = (querySingleResource: QuerySingleResource) =>
    async (categoryOptionUids: ReadonlyArray<string>): Promise<string | undefined> => {
        if (categoryOptionUids.length === 0) return undefined;

        const response = await querySingleResource({
            resource: 'categoryOptionCombos',
            params: {
                filter: `categoryOptions.id:in:[${categoryOptionUids.join(',')}]`,
                fields: 'id,categoryOptions[id]',
                paging: false,
            },
        });

        const { categoryOptionCombos = [] } =
            response as { categoryOptionCombos?: Array<CategoryOptionCombo> };
        const target = new Set(categoryOptionUids);

        const matches = categoryOptionCombos.filter(coc =>
            coc.categoryOptions.length === target.size &&
            coc.categoryOptions.every(({ id }) => target.has(id)),
        );

        if (matches.length > 1) {
            log.error(
                errorCreator('Multiple category option combos match the same option set')({
                    matches: matches.map(({ id }) => id),
                    categoryOptionUids,
                }),
            );
            return undefined;
        }

        return matches[0]?.id;
    };
