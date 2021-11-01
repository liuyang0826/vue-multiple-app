export const getTableData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{
                username: "张三"
            }, {
                username: "张三"
            }, {
                username: "张三"
            }])
        }, 1000);
    });
}