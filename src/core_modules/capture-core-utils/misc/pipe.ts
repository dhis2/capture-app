export const pipe = (...fns: Array<(arg: any, ...args: any[]) => any>) =>
    (x?: any, ...args: any[]): any => fns.reduce((v, fn) => fn(v, ...args), x);
