import { programCollection } from '../programCollection';

jest.mock('d2-utilizr/src/isFunction', () => ({ default: () => null }));
jest.mock('d2-utilizr/src/isDefined', () => ({ default: () => null }));

it('programCollection', () => {
    expect(programCollection).toBeDefined();
    expect(programCollection).toBeInstanceOf(Map);
});
