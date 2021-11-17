import pipe from "./pipe";

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
  options.data = function () {
    return {
      ...data?.call(this),
      ...origin?.call(this),
    };
  }
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

export const useTableCurd = ({ doSearch, immediate, hasPager, hasSelection, rowKey = "id", onSelectionChange, doDelete, doBatchDelete, doToggleEnable, doMove } = {}) => {
  let selectionLen = 0
  let selectionMap = {}

  return pipe(
    useData(function () {
      return {
        query: {},
        searchLoading: false,
        tableData: []
      }
    }),
    useMethods({
      handleSearch () {
        this.updateTable()
      },
      async updateTable() {
        this.searchLoading = true;
        try {
          await doSearch.call(this)
        } finally {
          this.searchLoading = false;
          hasSelection && this.$nextTick(() => {
            this.tableData.forEach((row) => {
              this.$refs.table.toggleRowSelection(row, !!selectionMap[row[rowKey]])
            })
            selectionLen = this.tableData.filter(row => !!selectionMap[row[rowKey]]).length
          })
        }
      }
    }),
    immediate && useLifecycle("created", function () {
      this.handleSearch();
    }),
    hasPager && useData(function () {
      return {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }),
    hasPager && useMethods({
      handleSearch () {
        this.pageNum = 1
      },
      handleCurrentChange (val) {
        this.pageNum = val;
        this.updateTable()
      },
      handleSizeChange (val) {
        this.pageSize = val;
        this.updateTable()
      },
      indexMethod (index) {
        return this.pageSize * (this.pageNum -1) + index + 1;
      }
    }),
    hasSelection && useLifecycle("created", function () {
      selectionMap = {}
      selectionLen = 0
    }),
    hasSelection && useMethods({
      resetSelection(selectedRows) {
        selectionMap = selectedRows ? selectedRows.reduce((map, row) => ({...map, [row[rowKey]]: row}), {}) : {}
        selectionLen = this.tableData.filter(row => !!selectionMap[row[rowKey]]).length
        onSelectionChange(selectionMap)
      },
      handleSelect(selection, row) {
        if (selectionLen < selection.length) {
          selectionMap[row[rowKey]] = row;
        } else {
          delete selectionMap[row[rowKey]];
        }
        onSelectionChange(selectionMap)
        selectionLen = selection.length;
      },
      handleSelectAll(selection) {
        if (selection.length) {
          selection.forEach(row => {
            selectionMap[row[rowKey]] = row;
          });
        } else {
          this.tableData.forEach(row => {
            delete selectionMap[row[rowKey]];
          });
        }
        onSelectionChange(selectionMap)
        selectionLen = selection.length;
      }
    }),
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
          doBatchDelete.call(this, Object.values(selectionMap))
        })
      }
    }),
    doToggleEnable && useMethods({
      handleToggleEnable() {
        doToggleEnable.call(this)
      }
    }),
    doMove && useMethods({
      handleMove() {
        doMove.call(this)
      }
    })
  );
};

export const useSelectOptions = ({ options: selectOptions, getOptions, namespace, deps }) => {
  const methodName = makeCamelCase("get", namespace, "options")
  return pipe(
    useData(function () {
      return {
        [makeCamelCase(namespace, "options")]: selectOptions
      }
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

export const useModalCtrl = ({ namespace, title, afterHandler, data } = {}) => {
  data = data || function () {
    return {}
  }

  return pipe(
    useData(function () {
      return {
        [makeCamelCase(namespace, "visible")]: false,
        [makeCamelCase(namespace, "title")]: title,
      }
    }),
    useData(function () {
      return {
        [makeCamelCase(namespace, "data")]: data.call(this)
      }
    }),
    useMethods({
      [makeCamelCase("handle", namespace)](row, ...args) {
        this[makeCamelCase(namespace, "visible")] = true
        this[makeCamelCase(namespace, "data")] = row.constructor === Object ? row : data.call(this)
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
              this.$refs.form?.clearValidate()
            }
            onShow?.call(this)
          },
          immediate: true
        }
      }),
      formRules && useData(function () {
        return {
          formLoading: false,
          form: {},
          formRules,
        }
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
