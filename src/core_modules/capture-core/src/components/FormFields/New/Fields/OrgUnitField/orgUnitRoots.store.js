// @flow
// Temporary container for org unit tree roots
const rootsContainer = {};

export function set(id: string, roots: ?Array<any>) {
    rootsContainer[id] = roots;
}

export function get(id: string): ?Array<any> {
    return rootsContainer[id];
}
