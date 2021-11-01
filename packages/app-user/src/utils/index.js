export const pipe = (...fns) => x => fns.reduce((x, f) => f(x), x);
const makeCamelCase = (first, ...args) => `${first}${args.map(str => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)).join("")}`

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

export const injectComponents = (injectComponents) => options => {
  const components = options.components
  options.components = {
    ...injectComponents,
    ...components,
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

export const useSearch = ({ getTableData, immediate } = {}) => {
  return options => pipe(
  injectData({
    query: {},
    searchLoading: false,
    tableData: []
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

export const useModalCtrl = ({ name, title } = {}) => {
  return options => pipe(
    injectData({
      [makeCamelCase(name, "visible")]: false,
      [makeCamelCase(name, "title")]: title,
    })
  )(options);
};

export const useModal = (modalOptions = {}) => {
  const { onShow } = modalOptions;
  return options => pipe(
  injectProps({
    visible: Boolean
  }),
  injectWatch({
    visible: {
      handler(visible) {
        if (visible) {
          onShow?.call(this)
        }
      },
      immediate: true
    }
  })
  )(options);
};

export const useFormCtrl = (formOptions = {}) => {
  const { name } = formOptions;
  return options => injectData({
    [makeCamelCase(name, "form")]: {}
  })(options);
};

export const useModalFormCtrl = ({ name, title, afterHandler } = {}) => {
  return options => pipe(
      useModalCtrl({ name, title }),
      useFormCtrl({ name }),
      injectMethods({
        [makeCamelCase("handle", name)](row, ...args) {
          console.log(row);
          this[makeCamelCase(name, "visible")] = true
          this[makeCamelCase(name, "form")] = row.constructor === Object ? row : {}
          afterHandler?.call(this, row, ...args)
        }
      })
  )(options)
}

export const useModalForm = ({ doSubmit, onShow, formRules = {} } = {} ) => {
  return pipe(
      useModal({
        onShow() {
          this.formLoading = false
          this.form = JSON.parse(JSON.stringify(this.data))
          onShow?.()
        }
      }),
      injectProps({
        data: Object,
        title: String
      }),
      injectData({
        formLoading: false,
        form: {},
        formRules,
      }),
      injectMethods({
        handleSubmit() {
          this.$refs.form.validate((flag) => {
            if (flag) {
              this.formLoading = true
              doSubmit.call(this)
                  .finally(() => {
                    this.formLoading = false
                  })
            }
          })
        }
      })
  )
};
