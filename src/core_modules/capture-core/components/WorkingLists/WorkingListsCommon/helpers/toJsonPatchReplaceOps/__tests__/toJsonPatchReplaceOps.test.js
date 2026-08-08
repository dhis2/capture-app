import { toJsonPatchReplaceOps } from '../toJsonPatchReplaceOps';

describe('toJsonPatchReplaceOps', () => {
    it('builds a replace op per field, preserving order and value', () => {
        const criteria = { order: 'createdAt:desc', displayColumnOrder: ['occurredAt'] };

        expect(toJsonPatchReplaceOps({ name: 'My view', eventQueryCriteria: criteria })).toEqual([
            { op: 'replace', path: '/name', value: 'My view' },
            { op: 'replace', path: '/eventQueryCriteria', value: criteria },
        ]);
    });

    it('returns an empty patch for an empty object', () => {
        expect(toJsonPatchReplaceOps({})).toEqual([]);
    });

    it('emits ops only for the fields passed in, never sharing or ownership fields', () => {
        const ops = toJsonPatchReplaceOps({ name: 'x', entityQueryCriteria: {} });
        const paths = ops.map(op => op.path);

        expect(paths).toEqual(['/name', '/entityQueryCriteria']);
        expect(paths).not.toContain('/publicAccess');
        expect(paths).not.toContain('/userGroupAccesses');
        expect(paths).not.toContain('/userAccesses');
        expect(paths).not.toContain('/externalAccess');
        expect(paths).not.toContain('/user');
    });
});
