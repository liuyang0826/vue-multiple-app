export const pipe = (...fns) => x => fns.reduce((x, f) => f(x), x);

export const injectLifecycle = (lifecycle, fn) => options => {
  const originFn = options[lifecycle];
  options[lifecycle] = function () {
    fn.call(this);
    originFn?.call(this);
  };
  return options;
};

export const injectData = (injectData) => options => {
  const data = options.data;
  options.data = () => {
    return {
      ...injectData,
      ...data?.(),
    };
  };
  return options;
};

export const injectMethods = (injectMethods) => options => {
  const methods = options.methods || {};
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

export const injectProps = (injectProps) => options => {
  const props = options.props;
  options.props = {
    ...injectProps,
    ...props,
  };
  return options;
};

export const injectWatch = (injectWatch) => options => {
  const watch = options.watch
  options.watch = {
    ...injectWatch,
    ...watch,
  };
  return options;
}

export const usePager = (pagerOptions = {}) => {
  const { name } = pagerOptions
  console.log(name);
  return options => pipe(
  injectData({
    pageSize: 10,
    pageNum: 1,
    total: 0
  }),
  injectMethods({
    handleCurrentChange (val) {
      this.pageNum = val;
    },
    handleSizeChange (val) {
      this.pageSize = val;
    }
  })
  )(options)
};

export const useSearch = (searchOptions = {}) => {
  const { getTableData, immediate } = searchOptions;
  return options => pipe(
  injectData({
    query: {},
    searchLoading: false
  }),
  injectMethods({
    async handleSearch () {
      this.searchLoading = true;
      getTableData.call(this)
      .finally(() => {
        this.searchLoading = false;
      });
    }
  }),
  (options) => immediate ? injectLifecycle("created", function () {
    this.handleSearch();
  })(options) : options
  )(options);
};

export const useModalCtrl = (modalCtrlOptions = {}) => {
  const { name } = modalCtrlOptions;
  const visible = name ? `${name}Visible` : "visible"
  return options => pipe(
    injectData({
      [visible]: false
    }),
    injectMethods({
      handleAdd() {
        this[visible] = true
      }
    })
  )(options);
};

export const useModal = (modalOptions = {}) => {
  const { name, onShow } = modalOptions;
  return options => pipe(
  injectProps({
    [name ? `${name}Visible` : "visible"]: Boolean
  }),
  injectWatch({
    visible(visible) {
      if (visible) {
        onShow?.call(this)
      }
    }
  })
  )(options);
};

export const useFormCtrl = (formOptions = {}) => {
  const { name } = formOptions;
  return options => injectData({
    [name ? `${name}Form` : "form"]: {}
  })(options);
};

export const useForm = (formOptions = {}) => {
  const { name, doSubmit } = formOptions
  return options => pipe(
  injectProps({
    [name ? `${name}Form` : "form"]: Object
  }),
  injectData({
    formLoading: false
  }),
  injectMethods({
    handleSubmit() {
      this.formLoading = true
      doSubmit.call(this)
      .finally(() => {
        this.formLoading = false
      })
    }
  })
  )(options)
};
