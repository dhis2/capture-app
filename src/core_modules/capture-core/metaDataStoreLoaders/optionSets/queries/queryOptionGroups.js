// @flow
import { query } from '../../IOUtils';

type Attributes = {
    page: number,
    pageSize: number,
    ids: Array<string>,
};

const querySpecification = {
    resource: 'optionGroups',
    params: (attributes: Attributes) => ({
        fields: 'id,displayName,options[id],optionSet[id]',
        filter: `optionSet.id:in:[${attributes.ids.join(',')}]`,
        page: attributes.page,
        pageSize: attributes.pageSize,
    }),
};
export const queryOptionGroups = async (ids: Array<string>, page: number, pageSize: number) => {
    const response = await query(querySpecification, { ids, page, pageSize });
    return {
        optionGroups: (response && response.optionGroups) || [],
        hasNextPage: !!(response && response.pager && response.pager.nextPage),
    };
};
