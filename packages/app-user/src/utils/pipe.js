export default (...fns) => x => fns.reduce((x, f) => f(x), x);
