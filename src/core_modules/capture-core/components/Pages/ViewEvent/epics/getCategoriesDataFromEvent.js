// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const getCategoryOptionsAsync = async (optionIds: string, querySingleResource: QuerySingleResource) =>
    querySingleResource({
        resource: 'categoryOptions',
        params: {
            fields: 'id,displayName,categories~pluck,access',
            filter: `id:in:[${optionIds}]`,
        },
    }).then(response => response?.categoryOptions);


export async function getCategoriesDataFromEventAsync(
    event: CaptureClientEvent,
    querySingleResource: QuerySingleResource,
): Promise<?Array<Object>> {
    const optionIdsFromEvent = event.attributeCategoryOptions?.replace(/;/g, ',');
    if (!optionIdsFromEvent) {
        return null;
    }

    const program = getProgramFromProgramIdThrowIfNotFound(event.programId);

    const categoryCombination = program.categoryCombination;
    if (!categoryCombination) {
        return null;
    }

    const programCategories = [...categoryCombination.categories.values()];

    let categoryOptions = await getCategoryOptionsAsync(optionIdsFromEvent, querySingleResource);
    if (!categoryOptions) {
        return null;
    }

    return programCategories
        .map((c) => {
            const option = categoryOptions
                .find(co => co.categories.includes(c.id));

            if (!option) {
                log.error(errorCreator('option not found for category')({ category: c }));
                return {
                    categoryId: c.id,
                    categoryOption: {
                        id: undefined,
                        name: undefined,
                        writeAccess: undefined,
                    },
                };
            }

            categoryOptions = categoryOptions
                .filter(co => co !== option);

            return {
                categoryId: c.id,
                categoryOption: {
                    id: option.id,
                    name: option.displayName,
                    writeAccess: option.access.data.write,
                },
            };
        });
}
