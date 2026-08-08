export type JsonPatchReplaceOp = Readonly<{
    op: 'replace';
    path: string;
    value: unknown;
}>;

export const toJsonPatchReplaceOps = (
    fields: Readonly<Record<string, unknown>>,
): ReadonlyArray<JsonPatchReplaceOp> =>
    Object.entries(fields).map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }));
