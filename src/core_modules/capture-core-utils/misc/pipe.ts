export function pipe<T>(...fns: Array<(arg: T, ...args: any[]) => T>): (x: T, ...args: any[]) => T;
export function pipe<T>(...fns: Array<() => T>): () => T;
export function pipe<T>(...fns: Array<any>): any {
    if (fns.length > 0 && fns[0].length === 0) {
        return () => fns.reduce((result, fn, index) => (index === 0 ? fn() : fn(result)), undefined);
    }
    return (x: T, ...args: any[]): T => fns.reduce((v, fn) => fn(v, ...args), x);
}
