export function pipe<A, B>(fn1: () => A, fn2: (x: A) => B): () => B;
export function pipe<A, B, C>(fn1: () => A, fn2: (x: A) => B, fn3: (x: B) => C): () => C;
export function pipe<A, B>(fn1: (x: A, ...args: any[]) => B): (x: A, ...args: any[]) => B;
export function pipe<A, B, C>(fn1: (x: A, ...args: any[]) => B, fn2: (x: B, ...args: any[]) => C): (x: A, ...args: any[]) => C;
export function pipe<A, B, C, D>(fn1: (x: A, ...args: any[]) => B, fn2: (x: B, ...args: any[]) => C, fn3: (x: C, ...args: any[]) => D): (x: A, ...args: any[]) => D;
export function pipe<A, B, C, D, E>(fn1: (x: A, ...args: any[]) => B, fn2: (x: B, ...args: any[]) => C, fn3: (x: C, ...args: any[]) => D, fn4: (x: D, ...args: any[]) => E): (x: A, ...args: any[]) => E;
export function pipe<A, B, C, D, E, F>(fn1: (x: A, ...args: any[]) => B, fn2: (x: B, ...args: any[]) => C, fn3: (x: C, ...args: any[]) => D, fn4: (x: D, ...args: any[]) => E, fn5: (x: E, ...args: any[]) => F): (x: A, ...args: any[]) => F;
export function pipe<T>(...fns: Array<() => T>): () => T;
export function pipe<T>(...fns: Array<(arg: T, ...args: any[]) => T>): (x: T, ...args: any[]) => T;
export function pipe<T>(...fns: Array<any>): any {
    if (fns.length > 0 && fns[0].length === 0) {
        return () => fns.reduce((result, fn, index) => (index === 0 ? fn() : fn(result)), undefined);
    }
    return (x: T, ...args: any[]): T => fns.reduce((v, fn) => fn(v, ...args), x);
}
