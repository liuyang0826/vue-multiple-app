export const pipe = (...fns) => x => fns.reduce((x, f) => typeof f === "function" ? f(x) : x, x);
const makeCamelCase = (first, ...args) => `${first}${args.map(str => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)).join("")}`

export const useLifecycle = (lifecycle, fn) => options => {
  const originFn = options[lifecycle];
  options[lifecycle] = function () {
    fn.call(this);
    originFn?.call(this);
  };
  return options;
};

export const useData = (data) => options => {
  const origin = options.data;
  options.data = () => {
    return {
      ...data,
      ...origin?.(),
    };
  };
  return options;
};

export const useMethods = (methods) => options => {
  const origin = options.methods || {};
  const newOptions = Object.keys(methods).reduce((options, key) => {
    const injectFn = methods[key];
    options[key] = origin[key] ? function (...args) {
      injectFn.call(this, ...args);
      origin[key].call(this, ...args);
    } : injectFn;
    return options;
  }, {});

  options.methods = {
    ...origin,
    ...newOptions,
  };
  return options;
};

export const useProps = (props) => options => {
  const origin = options.props;
  options.props = {
    ...props,
    ...origin,
  };
  return options;
};

export const useWatch = (watch) => pipe(
  useLifecycle("created", function () {
    Object.keys(watch).forEach((key) => {
      const watch = watch[key]
      if (typeof watch === "function") {
        this.$watch(key, watch)
      } else {
        this.$watch(key, watch.handler, watch)
      }
    })
  })
)

export const useComponents = (components) => options => {
  const origin = options.components
  options.components = {
    ...origin,
    ...components,
  };
  return options;
}

export const usePager = ({ onChange } = {}) => {
  return pipe(
    useData({
      pageSize: 10,
      pageNum: 1,
      total: 0
    }),
    useMethods({
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

export const useSearch = ({ getTableData, immediate, selections } = {}) => {
  return pipe(
    useData({
      query: {},
      searchLoading: false,
      tableData: []
    }),
    selections && useData({

    }),
    useMethods({
      async handleSearch () {
        this.searchLoading = true;
        getTableData.call(this)
        .finally(() => {
          this.searchLoading = false;
        });
      }
    }),
    immediate && useLifecycle("created", function () {
      this.handleSearch();
    })
  );
};

export const useSelectOptions = ({ options: selectOptions, getOptions, namespace, dep }) => {
  const methodName = makeCamelCase("get", namespace, "options")
  return pipe(
    useData({
      [makeCamelCase(namespace, "options")]: selectOptions
    }),
    getOptions && useMethods({
      [methodName]: getOptions
    }),
    !dep && getOptions && useLifecycle("created", function () {
      this[methodName]();
    }),
    dep && getOptions && useWatch({
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
    useData({
      [makeCamelCase(name, "visible")]: false,
      [makeCamelCase(name, "title")]: title,
    })
  );
};

export const useModal = (modalOptions = {}) => {
  const { onShow } = modalOptions;
  return pipe(
    useProps({
      visible: Boolean,
      data: Object,
      title: String
    }),
    useWatch({
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
  return useData({
    [makeCamelCase(name, "data")]: {}
  });
};

export const useModalFormCtrl = ({ name, title, afterHandler } = {}) => {
  return pipe(
    useModalCtrl({ name, title }),
    useFormCtrl({ name }),
    useMethods({
      [makeCamelCase("handle", name)](row, ...args) {
        this[makeCamelCase(name, "visible")] = true
        this[makeCamelCase(name, "data")] = row.constructor === Object ? row : {}
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
    useData({
      formLoading: false,
      form: {},
      formRules,
    }),
    useMethods({
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
