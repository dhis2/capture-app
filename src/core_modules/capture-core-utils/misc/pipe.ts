export const pipe = <T, R>(...fns: ((value: T, ...args: unknown[]) => T)[]) => 
    (x: T, ...args: unknown[]): R => 
        fns.reduce((v, fn) => fn(v, ...args), x);
