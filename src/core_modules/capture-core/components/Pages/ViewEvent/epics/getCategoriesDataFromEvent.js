// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../../../../d2/d2Instance';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';

function getCategoryOptionsAsync(optionIds: string) {
    return getApi()
        .get('categoryOptions', {
            fields: 'id,displayName,categories~pluck,access',
            filter: `id:in:[${optionIds}]`,
        })
        .then(response => response && response.categoryOptions);
}


export async function getCategoriesDataFromEventAsync(event: CaptureClientEvent): Promise<?Array<Object>> {
    const optionIdsFromEvent = event.attributeCategoryOptions;
    if (!optionIdsFromEvent) {
        return null;
    }

    const program = getProgramFromProgramIdThrowIfNotFound(event.programId);

    const {categoryCombination} = program;
    if (!categoryCombination) {
        return null;
    }

    const programCategories = [...categoryCombination.categories.values()];

    let categoryOptions = await getCategoryOptionsAsync(optionIdsFromEvent);
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
