export const getCategoriesDataFromEvent = (event: any) => {
    const categoriesData = event.attributeCategoryOptions || {};
    return categoriesData;
};

export const getCategoriesDataFromEventAsync = (event: any) =>
    Promise.resolve(getCategoriesDataFromEvent(event));
