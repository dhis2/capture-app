export const getCategoriesDataFromEvent = (event: any) => {
    const categoriesData = event.attributeCategoryOptions || {};
    return categoriesData;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCategoriesDataFromEventAsync = (event: any, querySingleResource: any) =>
    Promise.resolve(getCategoriesDataFromEvent(event));
