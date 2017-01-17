//通过动态设定旋转角度
//移动的话选择目标位置,设定一个position为absolute的小格子移动
function tablePlay(table, box) {
    this.table = table;
    this.grid = {
        x: 5,
        y: 5,
        dir: 1
    };
    this.node = this.getGrid();
    this.box = box;
    this.degs = [-90, 0, 90, 180];
    this.directions = ['top', 'right', 'bottom', 'left'];
}

tablePlay.prototype = {
    init: function () {
        this.box.style.transform = "rotate(0deg)";
        this.box.style.top = "250px"
        this.box.style.left = "250px"
    },
    changeDir: function (dir, deg) {
        console.log("changeDir")
        //如果直接使用style只能获取行内元素
        //用getComputedStyle, transform会获得matrix
        this.grid.dir = (this.grid.dir+dir > -1? this.grid.dir+dir : 3)%4;
        var degs = +this.box.style.transform.match(/[-]*\d+/)[0];
        this.box.style.transform = "rotate("+(this.degs[deg]+degs)+"deg)";
    },
    setDir: function (dir) {
        console.log("setDir")
        this.grid.dir = dir;
        this.box.style.transform = "rotate("+this.degs[dir]+"deg)";
    },
    moveGrid: function (n) {
        console.log("moveGrid")
        var grid = this.grid;
        var n = +n || 1;
        switch (grid.dir) {
            case 3:
                if (grid.y-n >= 1) {
                    grid.y = grid.y - n;
                    this.node = this.getGrid();
                } 
            break;
            case 1:
                if (grid.y+n <= 10) {
                    grid.y = grid.y + n;
                    this.node = this.getGrid();
                }
            break;
            case 0:
                if (grid.x-n >=1) {
                    grid.x = grid.x -n;
                    this.node = this.getGrid();
                }
            break;
            case 2:
                if (grid.x+n < 10) {
                    grid.x = grid.x + n;
                    this.node = this.getGrid();
                }
            break;
        }
        console.log(grid)
        this.setGrid();
    },
    setGrid: function () {
        //设置offset
        console.log("setGrid")
        var boxX = this.node.offsetLeft,
            boxY = this.node.offsetTop;
        this.box.style.top = boxY + 'px';
        this.box.style.left = boxX + 'px';
    },
    getGrid: function () {
        console.log(this.grid)
        return this.table.children[this.grid.x].children[this.grid.y]
    }
}
