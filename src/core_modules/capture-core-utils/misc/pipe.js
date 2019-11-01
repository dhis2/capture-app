const pipe = (...fns) => (x, ...args) => fns.reduce((v, fn) => fn(v, ...args), x);
export default pipe;
