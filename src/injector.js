const injectLifecycle = (lifecycle, fn) => options => {
  const originFn = options[lifecycle];
  options[lifecycle] = function () {
    fn.call(this);
    originFn?.call(this);
  };
  return options;
};

const injectData = (injectData) => options => {
  const data = options.data;
  options.data = () => {
    return {
      ...injectData,
      ...data?.(),
    };
  };
  return options;
};

const injectMethods = (injectMethods) => options => {
  const methods = options.methods;
  const newOptions = Object.keys(injectMethods).reduce((options, key) => {
    const injectFn = injectMethods[key];
    options[key] = methods[key] ? function (...args) {
      injectFn.call(this, ...args);
      methods[key].call(this, ...args);
    } : injectFn;
    return options;
  }, {});

  options.methods = {
    ...methods,
    ...newOptions,
  };
  return options;
};

const injectProps = (injectProps) => options => {
  const props = options.props;
  options.props = {
    ...injectProps,
    ...props,
  };
  return options;
};


const injectWatch = (injectWatch) => options => {
  const watch = options.watch
  options.watch = {
    ...injectWatch,
    ...watch,
  };
  return options;
}
