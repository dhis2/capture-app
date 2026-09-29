import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ResourceQuery, QueryVariables } from 'capture-core-utils/types/app-runtime';

type QuerySingleResource = (resourceQuery: ResourceQuery, variables?: QueryVariables) => Promise<any>;

type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

// Enrollment import requires a resolved attributeOptionCombo UID. Scoping by
// categoryCombo prevents cross-combo option-set collisions: the API returns
// every COC in the given combo that shares any of the picked options, and we
// pick the one whose option set is identical.
export const makeResolveAttributeOptionCombo = (querySingleResource: QuerySingleResource) =>
    async (
        categoryComboId: string,
        categoryOptionUids: ReadonlyArray<string>,
    ): Promise<string | undefined> => {
        if (categoryOptionUids.length === 0) return undefined;

        const response = await querySingleResource({
            resource: 'categoryOptionCombos',
            params: {
                filter: [
                    `categoryCombo.id:eq:${categoryComboId}`,
                    `categoryOptions.id:in:[${categoryOptionUids.join(',')}]`,
                ],
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
                    categoryComboId,
                    matches: matches.map(({ id }) => id),
                    categoryOptionUids,
                }),
            );
            return undefined;
        }

        return matches[0]?.id;
    };
