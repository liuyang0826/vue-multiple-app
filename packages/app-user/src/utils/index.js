export const pipe = (...fns) => x => fns.reduce((x, f) => typeof f === "function" ? f(x) : x, x);
const makeCamelCase = (first, ...args) => `${first}${args.map(str => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)).join("")}`
const get = (obj, prop) => prop.split(".").reduce((obj, key) => obj?.[key], obj)

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

export const useWatch = (watchers) => pipe(
  useLifecycle("created", function () {
    Object.keys(watchers).forEach((key) => {
      const watch = watchers[key]
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

export const useSearch = ({ getTableData, immediate, useSelection } = {}) => {
  return pipe(
    useData({
      query: {},
      searchLoading: false,
      tableData: []
    }),
    useSelection && useData({
      selectionMap: {}
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

export const useSelectOptions = ({ options: selectOptions, getOptions, namespace, deps }) => {
  const methodName = makeCamelCase("get", namespace, "options")
  return pipe(
    useData({
      [makeCamelCase(namespace, "options")]: selectOptions
    }),
    getOptions && useMethods({
      [methodName]: getOptions
    }),
    !deps && getOptions && useLifecycle("created", function () {
      this[methodName]();
    }),
    deps && getOptions && useLifecycle("created", function () {
      let prevDeps = []
      this.$watch(() => deps.map(dep => get(this, dep)), (val) => {
        if (prevDeps.length !== val.length || prevDeps.some((d, i) => val[i] !== d)) {
          this[methodName]();
        }
        prevDeps = val
      })
    })
  )
}

export const useModalCtrl = ({ name, title, afterHandler } = {}) => {
  return pipe(
    useData({
      [makeCamelCase(name, "visible")]: false,
      [makeCamelCase(name, "title")]: title,
    }),
    useData({
      [makeCamelCase(name, "data")]: {}
    }),
    useMethods({
      [makeCamelCase("handle", name)](row, ...args) {
        this[makeCamelCase(name, "visible")] = true
        this[makeCamelCase(name, "data")] = row.constructor === Object ? row : {}
        afterHandler?.call(this, row, ...args)
      }
    })
  )
}

export const useModal = ({ onShow, formRules, doSubmit } = {}) => {
  return pipe(
      useProps({
        visible: Boolean,
        data: Object,
        title: String
      }),
      useWatch({
        visible: {
          handler(visible) {
            if (!visible) {
              return
            }
            if (formRules) {
              this.formLoading = false
              this.form = JSON.parse(JSON.stringify(this.data))
            }
            onShow?.call(this)
          },
          immediate: true
        }
      }),
      formRules && useData({
        formLoading: false,
        form: {},
        formRules,
      }),
      formRules && useMethods({
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
  );
};

// 删除 & 批量删除
export const useDelete = ({ doDelete, doBatchDelete } = {}) => {
  return pipe(
    doDelete && useMethods({
      handleDelete(...args) {
        this.$confirm("确认删除？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          doDelete.call(this, ...args)
        })
      }
    }),
    doBatchDelete && useMethods({
      handleBatchDelete() {
        this.$confirm("确认删除？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          doBatchDelete.call(this, Object.values(this.selectionMap))
        })
      }
    })
  )
}
