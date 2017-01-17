
var TableTool = (function () {
    function init(opts) {
        var instance = new tableSort(opts);
        return instance;
    }
    function tableSort(opts) {
        this.setOpts(opts);
        this.reRender = this.render();
        this.reRender();
        this.setHeadColor();
        this.bindEvents();
    }
    tableSort.prototype = {
        defaultOpts : {
            append: $('body'),
            data: {
                thead: [],
                sortable: [],
                tbody: [],
                isFrozen: true,
                headColor: "#ddd"
            }  
        },
        setOpts: function (opts) {
            //应该使用类似jquery的extend深复制
            if (typeof opts === 'object') {
                this.opts = opts;
            }
        },
        sort: function (dataKey, sortable) {
            //取出column的数据
            var sortBy = sortable || "des";
            var newData = {},
                originData = this.opts.data.tbody;
                if (sortBy === "des") {
                    newData = originData.sort(function (a, b) {
                        return a[dataKey] - b[dataKey];
                    })                
                } else {
                    newData = originData.sort(function (a, b) {
                        return b[dataKey] - a[dataKey];
                    })       
                }
            return newData;
        },
        fixed: function () {
            var self = this;
            var theadDom = $("thead", this.opts.append),
                tableDom = self.opts.append;

            if (theadDom.getBoundingClientRect().top < 0 && !theadDom.classList.contains("fixed-head")) {
                addClass(theadDom, "fixed-head");
            } else if ( tableDom.getBoundingClientRect().top < (0-tableDom.offsetHeight) || tableDom.getBoundingClientRect().top > 0) {
                removeClass(theadDom, 'fixed-head');
            } 
        },
        bindEvents: function () {
            //点击thead要判断点击的是第几个，以及是上还是下
            var self = this;
            var theadDom = $("thead", this.opts.append);
            delegateEvent(theadDom, 'div', 'click', function (e) {
                var node = e.target;
                var sortable = node.classList.contains("des") ? "des" : "aes",
                    dataKey = node.parentNode.dataset 
                      ? node.parentNode.dataset.key
                      : node.parentNode.getAttribute("data-key");
                var data = self.sort(dataKey, sortable);
                self.reRender(data);
            });
            if (this.opts.data.isFrozen) {
                addHandler(window, 'scroll', function () {
                    self.fixed();
                })
            }
        },
        setHeadColor: function () {
            var color = this.opts.data.headColor || this.defaultOpts.data.headColor;
            var theadDom = $("thead", this.opts.append);
            theadDom.style.backgroundColor = color;
        },
        render: function () {
            //应该头部就不再遍历了，写成闭包的形式比较好
            var tableHeadData = this.opts.data.thead,
                tableSortData = this.opts.data.sortable;
            var theadStr = "",
                tbodyStr = "",
                tableStr = "";
            var tableDom = this.opts.append;

            tableHeadData.forEach(function (item, index) {
                var theadTdStr = "";
                    theadTdStr = tableSortData[index] 
                                ? "<th data-key="+index+">"+item+"<div class='des'></div><div class='aes'></div></th>" 
                                : "<th>"+item+"</th>";
                theadStr += theadTdStr;
            })

            return function (data) {
                var tableBodyData = data || this.opts.data.tbody;
                var tbodyDom = document.createElement("tbody");
                var tbodyNode = $("tbody", tableDom),
                    theadNode = $("thead", tableDom);

                tbodyStr = "";
                tableBodyData.forEach(function (row, index) {
                    var tbodyTrStr = "";
                    row.forEach(function (item) {
                        var tbodyTdStr = "";
                        tbodyTdStr = "<td>"+item+"</td>";
                        tbodyTrStr += tbodyTdStr;
                    })
                    tbodyStr += "<tr>"+tbodyTrStr+"</tr>"; 
                })
                tbodyDom.innerHTML = tbodyStr;

                if (tbodyNode) {
                    tableDom.removeChild(tbodyNode);
                    tableDom.appendChild(tbodyDom);
                } else {
                    tableStr = "<thead>"+theadStr+"</thead><tbody>"+tbodyStr+"</tbody>";
                    tableDom.innerHTML = tableStr;
                }
            }
        }
    }

    return {
        init: init
    };
})()

var table1 = TableTool.init({
    append: $("#sortTable1"),
    data: {
        thead: ['姓名','语文','数学','英语','总分'],
        sortable: [0,1,1,1,1],
        tbody: [
            ['小明', 80, 90, 70, 240],
            ['小明', 90, 60, 90, 240],
            ['小明', 60, 100, 70, 230],
            ['小红', 60, 100, 70, 230],
            ['小红', 80, 100, 70, 230],
            ['小红', 80, 60, 90, 240],
            ['小红', 80, 60, 90, 240],
            ['小红', 80, 60, 90, 240],
            ['小亮', 80, 90, 70, 240],
            ['小亮', 80, 90, 70, 240],
            ['小红',90, 60, 90, 240],
            ['小明',90, 60, 90, 240],
            ['小明',90, 60, 90, 240],
            ['小亮', 80, 90, 70, 240],
            ['小红', 60, 100, 70, 230],
            ['小红', 60, 100, 70, 230],
            ['小红', 60, 100, 70, 230],
            ['小亮', 80, 90, 70, 240]
        ],
        isFrozen: true,
        headColor: "#345678"
    }
})
var table2 = TableTool.init({
    append: $("#sortTable2"),
    data: {
        thead: ['姓名','语文','数学','英语','总分'],
        sortable: [0,1,1,1,1],
        tbody: [
            ['小明', 80, 90, 70, 240],
            ['小明', 90, 60, 90, 240],
            ['小明', 60, 100, 70, 230],
            ['小红', 60, 100, 70, 230],
            ['小红', 80, 100, 70, 230],
            ['小红', 80, 60, 90, 240],
            ['小红', 80, 60, 90, 240],
            ['小红', 80, 60, 90, 240],
            ['小亮', 80, 90, 70, 240],
            ['小亮', 80, 90, 70, 240],
            ['小红',90, 60, 90, 240],
            ['小明',90, 60, 90, 240],
            ['小明',90, 60, 90, 240],
            ['小亮', 80, 90, 70, 240],
            ['小红', 60, 100, 70, 230],
            ['小红', 60, 100, 70, 230],
            ['小红', 60, 100, 70, 230],
            ['小亮', 80, 90, 70, 240]
        ],
        isFrozen: true,
        headColor: "red"
    }
})
