import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';

const getCategoryOptionsAsync = async (optionIds: string, querySingleResource: any) =>
    querySingleResource({
        resource: 'categoryOptions',
        params: {
            fields: 'id,displayName,categories~pluck,access',
            filter: `id:in:[${optionIds}]`,
        },
    }).then((response: any) => response?.categoryOptions);


export async function getCategoriesDataFromEventAsync(
    event: any,
    querySingleResource: any,
): Promise<Array<any> | null> {
    const optionIdsFromEvent = event.attributeCategoryOptions?.replace(/;/g, ',');
    if (!optionIdsFromEvent) {
        return null;
    }

    const program = getProgramFromProgramIdThrowIfNotFound(event.programId);

    const categoryCombination = program?.categoryCombination;
    if (!categoryCombination) {
        return null;
    }

    const programCategories = [...categoryCombination.categories.values()];

    let categoryOptions = await getCategoryOptionsAsync(optionIdsFromEvent, querySingleResource);
    if (!categoryOptions) {
        return null;
    }

    return programCategories
        .map((c: any) => {
            const option = categoryOptions
                .find((co: any) => co.categories.includes(c.id));

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
                .filter((co: any) => co !== option);

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
