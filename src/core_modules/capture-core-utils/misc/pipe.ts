export const pipe = <T>(...fns: Array<(arg: T, ...args: any[]) => T>) => (x: T, ...args: any[]): T => fns.reduce((v, fn) => fn(v, ...args), x);
