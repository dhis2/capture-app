// @flow
import ApiSpecification from '../ApiSpecification';
import getterTypes from '../../fetcher/getterTypes.const';

// MOCK getData
import getData from '../../fetcher/apiFetchers';

jest.mock('../../fetcher/apiFetchers');
const mockGetData = jest.fn();
getData.mockImplementation(mockGetData);
// ---

const baseSpec = {
    modelName: 'programs',
    modelGetterType: getterTypes.LIST,
    queryParams: {
        base: 'base',
    },
    converter: d2Model => d2Model,
};

it('create', () => {
    const spec = new ApiSpecification((o) => {
        Object.assign(o, baseSpec);
    });
    expect(spec.modelName).toEqual(baseSpec.modelName);
    expect(spec.modelGetterType).toEqual(baseSpec.modelGetterType);
});

it('updateQuery params', () => {
    const spec = new ApiSpecification((o) => {
        Object.assign(o, baseSpec);
    });
    spec.updateQueryParams({ test: 'test' });
    expect(spec.queryParams.test).toEqual('test');
    expect(spec.queryParams.base).toEqual('base');
});

it('set filter', () => {
    const spec = new ApiSpecification((o) => {
        Object.assign(o, baseSpec);
    });
    spec.setFilter('filter');
    expect(spec.queryParams.filter[0]).toEqual('filter');
    expect(spec.queryParams.base).toEqual('base');
});

it('get data', () => {
    const spec = new ApiSpecification((o) => {
        Object.assign(o, baseSpec);
    });
    spec.get();
    expect(mockGetData).toBeCalled();
});
