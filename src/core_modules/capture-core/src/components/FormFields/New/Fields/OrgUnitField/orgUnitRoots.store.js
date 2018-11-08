// @flow
// Temporary container for org unit tree roots
const rootsContainer = {};

export function set(id: string, roots: Object) {
    const currentRoots = rootsContainer[id];
    rootsContainer[id] = {
        ...currentRoots,
        ...roots,
    };
}

export function get(id: string) {
    return rootsContainer[id];
}
