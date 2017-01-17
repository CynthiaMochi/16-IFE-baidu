function SearchPath(table) {
    this.table = table;
}
SearchPath.prototype = {
    init: function (start) {//传入初始点
        this.all = {};
        this.queue = [];
        var poi = this.createNode(start.x, start.y, 0, null);
        this.all[poi.x+''+poi.y] = poi;
        this.queue.unshift(poi);
        console.log(this.table)
    },
    createNode: function (x, y, dis, pre) {
        return {
            x: x || 0,
            y: y || 0,
            dis: dis || 0,
            pre: pre || null
        }
    },
    searchLoop: function (end) {
        //需要对比是不是障碍，以及到没到目标
        while(this.queue.length != 0) {
            var temp = this.queue.shift();
            if (!(temp.x == end.x && temp.y == end.y)) {
                this.findNextNode(temp);
            } else {
                break;
            }
        }
        console.log(this.all)
    },
    findNextNode: function (node) {
        // 存在，不是障碍
        var offsets = [
            {
                x: 0,
                y:1
            },{
                x: 0,
                y: -1
            },{
                x: 1,
                y: 0
            },{
                x: -1,
                y: 0
            },
        ].forEach(function (item) {
            var next = this.table.getNode(item.x+node.x, item.y+node.y);
            if(next && this.table.isBlock(next) && !this.all[next.x+''+next.y])
                var newNode = this.createNode(next.x, next.y, node.dis+1, node);
            this.all[next.x+''+next.y] = newNode;
            this.queue.push(newNode);
        })

    }

}
