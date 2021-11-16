const pipe = (...fns) => x => fns.reduce((x, f) => typeof f === "function" ? f(x) : x, x);

export default pipe