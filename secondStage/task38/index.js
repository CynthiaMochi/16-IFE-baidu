//构建数据结构
//列：代号：名称
//根据是否能排序，添加类，css样式，绑定点击事件
//点击一次默认降序，再点一次升序

var tableData = [
        {name: '小明', Chinese: 80, Math: 90, English: 70, total: 240},
        {name: '小红', Chinese: 90, Math: 60, English: 90, total: 240},
        {name: '小亮', Chinese: 60, Math: 100, English: 70, total: 230}
    ];

function TableSort (dom, data) {
    this.dom = dom;
    this.data = data || [];

    this.init(data)
} 
TableSort.prototype = {
    constructor: TableSort,
    init: function () {
        var self = this;
        delegateEvent(this.dom, 'div', 'click', function (e) {
            var node = e.target;
            var sortable, dataKey;

            sortable = node.classList.contains("des") ? "des" : "aes";
            dataKey = node.parentNode.dataset 
                      ? node.parentNode.dataset.key
                      : node.parentNode.getAttribute("data-key");

            self.sort(dataKey, sortable);
            self.render()
            
        });

        self.render();
    },
    sort: function (dataKey, sortable) {
        //取出column的数据
        var sortBy = sortable || "des";
        var newData = {};
            if (sortBy === "des") {
                newData = this.data.sort(function (a, b) {
                    return a[dataKey] - b[dataKey];
                })                
            } else {
                newData = this.data.sort(function (a, b) {
                    return b[dataKey] - a[dataKey];
                })       
            }
        this.data = newData;
    },
    createBody: function () {
        var bodyRows = this.data.map(function (item) {
            var bodyRow = "";
            for(var key in item) {
                bodyRow += "<td>"+item[key]+"</td>";
            }
            return "<tr>"+bodyRow+"</tr>";
        })

        return bodyRows.join("");
    },
    render: function () {
        var tbodyDom = document.createElement("tbody");
        var tbodyNode = $("tbody", this.dom);
        tbodyDom.innerHTML = this.createBody();
        
        if (tbodyNode) {
            this.dom.removeChild(tbodyNode);
        }
        this.dom.appendChild(tbodyDom);
    }
};

var sortTable = new TableSort($("#sortTable"), tableData);