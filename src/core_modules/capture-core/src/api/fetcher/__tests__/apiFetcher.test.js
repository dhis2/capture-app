// @flow
import getData from '../../fetcher/apiFetchers';
import getterTypes from '../getterTypes.const';

import getD2 from '../../../d2/d2Instance';

jest.mock('../../../d2/d2Instance');
getD2.mockImplementation(() => ({
    models: {
        programs: {
            [getterTypes.LIST]: async () => ({
                values: () => [
                    {
                        id: '1',
                    },
                ],
            }),
            [getterTypes.GET]: async () => ({
                id: '1',
            }),
        },
    },
}));

it('get list data', async () => {
    const programs = await getData('programs', getterTypes.LIST, null, convertValue => convertValue);
    expect(programs[0].id).toEqual('1');
});

it('get item data', async () => {
    const program = await getData('programs', getterTypes.GET, { id: '1' }, convertValue => convertValue);
    expect(program.id).toEqual('1');
});

it('try to get item data with no queryParams object specified', async () => {
    const program = await getData('programs', getterTypes.GET, null, convertValue => convertValue);
    expect(program).toBeNull();
});

it('try to get item data with no id in queryParams', async () => {
    const program = await getData('programs', getterTypes.GET, { id: null }, convertValue => convertValue);
    expect(program).toBeNull();
});
