export const pipe = (...fns) => x => fns.reduce((x, f) => typeof f === "function" ? f(x) : x, x);
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

export const injectWatch = (injectWatch) => pipe(
  injectLifecycle("created", function () {
    Object.keys(injectWatch).forEach((key) => {
      const watch = injectWatch[key]
      if (typeof watch === "function") {
        this.$watch(key, watch)
      } else {
        this.$watch(key, watch.handler, watch)
      }
    })
  })
)

export const injectComponents = (injectComponents) => options => {
  const components = options.components
  options.components = {
    ...injectComponents,
    ...components,
  };
  return options;
}

export const usePager = ({ name, onChange } = {}) => {
  console.log(name);
  return pipe(
    injectData({
      pageSize: 10,
      pageNum: 1,
      total: 0
    }),
    injectMethods({
      handleCurrentChange (val) {
        this.pageNum = val;
        if (typeof onChange === "string") {
          this[onChange]()
        } else {
          onChange.call(this, val)
        }
      },
      handleSizeChange (val) {
        this.pageSize = val;
        if (typeof onChange === "string") {
          this[onChange]()
        } else {
          onChange.call(this, val)
        }
      }
    })
  )
};

export const useSearch = ({ getTableData, immediate } = {}) => {
  return pipe(
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
    immediate && injectLifecycle("created", function () {
      this.handleSearch();
    })
  );
};

export const useSelectOptions = ({ options: selectOptions, getOptions, namespace, dep }) => {
  const methodName = makeCamelCase("get", namespace, "options")
  return pipe(
    injectData({
      [makeCamelCase(namespace, "options")]: selectOptions
    }),
    getOptions && injectMethods({
      [methodName]: getOptions
    }),
    !dep && getOptions && injectLifecycle("created", function () {
      this[methodName]();
    }),
    dep && getOptions && injectWatch({
      [dep]: {
        handler (value) {
          value && this[methodName]();
        },
        immediate: true
      }
    })
  )
}

export const useModalCtrl = ({ name, title } = {}) => {
  return pipe(
    injectData({
      [makeCamelCase(name, "visible")]: false,
      [makeCamelCase(name, "title")]: title,
    })
  );
};

export const useModal = (modalOptions = {}) => {
  const { onShow } = modalOptions;
  return pipe(
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
  );
};

export const useFormCtrl = (formOptions = {}) => {
  const { name } = formOptions;
  return injectData({
    [makeCamelCase(name, "form")]: {}
  });
};

export const useModalFormCtrl = ({ name, title, afterHandler } = {}) => {
  return pipe(
    useModalCtrl({ name, title }),
    useFormCtrl({ name }),
    injectMethods({
      [makeCamelCase("handle", name)](row, ...args) {
        this[makeCamelCase(name, "visible")] = true
        this[makeCamelCase(name, "form")] = row.constructor === Object ? row : {}
        afterHandler?.call(this, row, ...args)
      }
    })
  )
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
