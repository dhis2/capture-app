const rootsContainer: Record<string, Array<any> | null> = {};

export function set(id: string, roots: Array<any> | null) {
    rootsContainer[id] = roots;
}

export function get(id: string): Array<any> | null {
    return rootsContainer[id];
}
