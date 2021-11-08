const useLifecycle = (lifecycle, fn) => options => {
  const originFn = options[lifecycle];
  options[lifecycle] = function () {
    fn.call(this);
    originFn?.call(this);
  };
  return options;
};

const useData = (useData) => options => {
  const data = options.data;
  options.data = () => {
    return {
      ...useData,
      ...data?.(),
    };
  };
  return options;
};

const useMethods = (useMethods) => options => {
  const methods = options.methods;
  const newOptions = Object.keys(useMethods).reduce((options, key) => {
    const injectFn = useMethods[key];
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

const useProps = (useProps) => options => {
  const props = options.props;
  options.props = {
    ...useProps,
    ...props,
  };
  return options;
};


const useWatch = (useWatch) => options => {
  const watch = options.watch
  options.watch = {
    ...useWatch,
    ...watch,
  };
  return options;
}
