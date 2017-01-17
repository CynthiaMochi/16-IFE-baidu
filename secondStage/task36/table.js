//通过动态设定旋转角度
//移动的话选择目标位置,设定一个position为absolute的小格子移动
function tablePlay(table, box) {
    this.table = table;
    this.grid = {
        x: 5,
        y: 5,
        dir: 1
    };
    this.grid.node = this.getNode(5, 5);
    this.box = box;
    this.all = {};
    this.queue = [];
}

tablePlay.prototype = {
    directions: {
    //dir, deg
    rig: [1, 2],
    lef: [-1, 0],
    bac: [2, 3]
    },
    dir: {
        top: 0,
        rig: 1,
        bot: 2,
        lef: 3
    },
    degs: [-90, 0, 90, 180],
    init: function () {
        this.box.style.transform = "rotate(0deg)";
        this.box.style.top = "250px";
        this.box.style.left = "250px";
    },
    turn: function (dir, deg) {
        //如果直接使用style只能获取行内元素
        //用getComputedStyle, transform会获得matrix
        this.grid.dir = (this.grid.dir+dir > -1? this.grid.dir+dir : 3)%4;
        var degs = +this.box.style.transform.match(/[-]*\d+/)[0];
        this.box.style.transform = "rotate("+(this.degs[deg]+degs)+"deg)";
    },
    setDir: function (dir) {
        //设定方向
        this.grid.dir = this.dir[dir.toLowerCase()];
        this.box.style.transform = "rotate("+this.degs[this.grid.dir]+"deg)";
    },
    setGrid: function (n, dir) {
        //返回某个方向上，距离当前点n位置的点
        var n = +n || 1;
        var newGrid = {
            x: this.grid.x,
            y: this.grid.y,
            dir: dir? this.dir[dir.toLowerCase()] : this.grid.dir
        };
        switch (newGrid.dir) {
            case 3:
                if (this.grid.y-n >= 1) {
                    newGrid.y = this.grid.y - n;
                } 
            break;
            case 1:
                if (this.grid.y+n <= 10) {
                    newGrid.y = this.grid.y + n;
                }
            break;
            case 0:
                if (this.grid.x-n >=1) {
                    newGrid.x = this.grid.x -n;
                }
            break;
            case 2:
                if (this.grid.x+n < 10) {
                    newGrid.x = this.grid.x + n;
                }
            break;
        }
        newGrid.node = this.getNode(newGrid.x, newGrid.y);
        return newGrid;
    },
    moveGrid: function (grid) {
        //设置offset
        //只有最后移动到了才确定位置
        if (this.isMoveable(grid, this.grid)) {
            var boxX = grid.node.offsetLeft,
                boxY = grid.node.offsetTop;
            this.box.style.top = boxY + 'px';
            this.box.style.left = boxX + 'px';
            for(var key in this.grid) {
                this.grid[key] = grid[key]
            }
        } else {
            console.error("前方为墙，不能行走")
        }
    },
    isMoveable: function (grid1, grid2) {
        //需要判断路上有没有墙
        //寻路的时候也需要
        var maxX = Math.max(grid1.x, grid2.x),
            maxY = Math.max(grid1.y, grid2.y),
            minX = Math.min(grid1.x, grid2.x),
            minY = Math.min(grid1.y, grid2.y); 
        for (var i = minX; i <= maxX; i++) {
            for (var j = minY; j <= maxY; j++) {
                var node = this.getNode(i, j);
                if (this.isBlock(node)) {
                    return false
                }
            }
        }
        return true;
    },
    isBlock: function (node) {
        return node.classList.contains("block");
    },
    buildBlock: function (grid) {
        //一个是随机建墙，只需要随机产生一系列数，加类
        //一个是在前面建墙，需要判断方向，位置，和前面的是不是墙
        //如果传入node就生成node之前的，否则随机建立
        //不能在box所在的位置建墙
        //传入原先的node
        var block, random;
        var grid = grid || null;
        if (grid) {
            if (!this.isBlock(grid.node)) {
                addClass(grid.node, "block");                
            } else {
                console.error("前方已经有墙")
            }
           // addClass(node, "block");
        } else {
            var i = 0;
            while(i < 3) {
                random = this.random();
                block = this.getNode(random.x, random.y);
                if (block != this.grid.node && !this.isBlock(block)) {
                    addClass(block, "block");
                    i++;
                }
            }
        }
    },
    moveTo: function (x, y) {
        //确保传入的是下一格
        this.all = {};
        this.queue = [];
        var poi = this.createNode(+x, +y, 0, null);
        this.all[poi.x+''+poi.y] = poi;
        this.queue.push(poi);
        this.searchLoop(this.grid.x, this.grid.y)
    },
    setColor: function (color) {
        // body...
        var node = this.setGrid().node;
        if (this.isBlock(node)) {
            node.style.background = color;
        } else {
            console.error("粉刷出错，前方有墙")
        }
    },
    random: function () {
        var x = Math.ceil(Math.random()*10);
        var y = Math.ceil(Math.random()*10);

        return {
            x: x,
            y: y
        }

    },
    getNode: function (x, y) {
        if (x <= 10 && x>=1 && y <=10 && y>=1) {
            return this.table.children[x].children[y];            
        } else {
            return null;
        }
    },
    createNode: function (x, y, dis, pre) {
        var obj = {
            x: x || 0,
            y: y || 0,
            dis: dis || 0,
            pre: pre || null
        }
        return obj
    },
    searchLoop: function (x, y) {
        //需要对比是不是障碍，以及到没到目标
        this.queue.push(1)
        while(this.queue.length != 0) {
            var temp = this.queue.shift();
            if (!(temp.x == x && temp.y == y)) {
                this.findNextNode(temp);
            } else {
                break;
            }
        }
        this.getPath(x ,y)
    },
    getPath: function (x,y) {
        var preNode = this.all[this.grid.x+''+this.grid.y].pre;
        while(!(preNode.x === x && preNode.y === y) && !!preNode.pre) {
            preNode = preNode.pre;
            this.moveNext(preNode)
        }
    },
    moveNext: function (nextNode) {
        if (nextNode.x > this.grid.x) {
            this.setDir('bot')
        } else if (nextNode.x < this.grid.x) {
            this.setDir('top')
        } else if (nextNode.y > this.grid.y) {
            this.setDir('rig')
        } else {
            this.setDir('lef')
        }
        nextNode.node = this.getNode(nextNode.x, nextNode.y)
        this.moveGrid(nextNode);
    },
    findNextNode: function (node) {
        // 存在，不是障碍
        var self = this;
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
            var nextX = item.x+node.x,
                nextY = item.y+node.y;
            var next = self.getNode(nextX, nextY);
            //console.log(node.x, node.y, nextX+''+nextY)
            if(!!next && !self.isBlock(next) && !self.all[nextX+''+nextY]) {
                var newNode = self.createNode(nextX, nextY, node.dis+1, node);
                self.all[nextX+''+nextY] = newNode;
                self.queue.push(newNode);
            } else if (!!self.all[nextX+''+nextY]) {
                if (self.all[nextX+''+nextY].dis < node.dis+1) {
                    self.all[nextX+''+nextY].dis = node.dis+1;
                }
            }
        })

    }
}
