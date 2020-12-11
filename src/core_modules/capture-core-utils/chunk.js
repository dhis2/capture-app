// @flow
function sliceArrayIntoGroups(chunks: number, array: Array<any>, size: number) {
  const groups = [];

  for (let i = 0, j = 0; i < chunks; i += 1, j += size) {
    // $FlowFixMe[missing-annot] automated comment
    groups[i] = array.slice(j, j + size);
  }

  return groups;
}

export default function chunk(array: ?Array<any>, size: number) {
  if (!array || array.length === 0) {
    return [];
  }

  if (!size || size < 1) {
    return [array];
  }

  const chunks = Math.ceil(array.length / size);
  return sliceArrayIntoGroups(chunks, array, size);
}
