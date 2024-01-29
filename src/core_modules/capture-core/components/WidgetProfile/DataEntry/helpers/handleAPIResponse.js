// @flow

export const handleAPIResponse = (resourceName: string, apiResponse: any) => {
    if (!apiResponse) {
        return [];
    }
    return apiResponse[resourceName] || apiResponse.instances || [];
};
