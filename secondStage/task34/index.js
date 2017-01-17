//通过动态设定旋转角度
//移动的话选择目标位置,设定一个position为absolute的小格子移动
function tablePlay(table, input, btn, box) {
    this.table = table;
    this.input = input;
    this.btn = btn; 
    this.grid = {
        x: 1,
        y: 1,
        dir: 1
    };
    this.node = this.getGrid(1,1);
    this.box = box;
    this.degs = [-90, 0, 90, 180];
    this.directions = ['top', 'right', 'bottom', 'left'];
}
var orders = {
    'TUN LEF': function () {
        this.changeDir(-1);
    },
    'TUN RIG': function () {
        this.changeDir(1);
    },
    'TUN BAC': function () {
        this.changeDir(2);
    },
    'GO': function () {
        this.moveGrid();
    },
    'TRA LEF': function () {
        this.setDir(3);
    },
    'TRA TOP': function () {
        this.setDir(0);
    },
    'TRA BOT': function () {
        this.setDir(2);
    },
    'TRA RIG': function () {
        this.setDir(1);
    },
    'MOV LEF': function () {
        this.setDir(3);
        this.moveGrid();
    },
    'MOV TOP': function () {
        this.setDir(0);
        this.moveGrid();
    },
    'MOV RIG': function () {
        this.setDir(1);
        this.moveGrid();
    },
    'MOV BOT': function () {
        this.setDir(2);
        this.moveGrid();
    },
}
tablePlay.prototype = {
    init: function () {
        var self = this;
        addHandler(this.btn, 'click', function (e) {
            orders[self.input.value].bind(self)()
        })
    },
    changeDir: function (dir) {
        //如果直接使用style只能获取行内元素
        //用getComputedStyle, transform会获得matrix
        this.grid.dir = (this.grid.dir+dir > -1? this.grid.dir+dir : 3)%4;
        var degs = this.box.style.transform ? +this.box.style.transform.match(/[-]*\d+/)[0] : 0;
        this.box.style.transform = "rotate("+(this.degs[dir]+degs)+"deg)";
    },
    setDir: function (dir) {
        this.grid.dir = dir;
        this.box.style.transform = "rotate("+(this.degs[dir])+"deg)";
    },
    moveGrid: function () {
        var grid = this.grid;
        switch (grid.dir) {
            case 3:
                if (grid.y > 1) {
                    this.node = this.getGrid(grid.x, --grid.y);
                } 
            break;
            case 1:
                if (grid.y <10) {
                    this.node = this.getGrid(grid.x, ++grid.y);
                }
            break;
            case 0:
                if (grid.x >1) {
                    this.node = this.getGrid(--grid.x, grid.y);
                }
            break;
            case 2:
                if (grid.x < 10) {
                    this.node = this.getGrid(++grid.x, grid.y);
                }
            break;
        }
        this.setGrid();
    },
    setGrid: function () {
        //设置offset
        var boxX = this.node.offsetLeft,
            boxY = this.node.offsetTop;
        this.box.style.top = boxY + 'px';
        this.box.style.left = boxX + 'px';
    },
    getGrid: function () {
        return this.table.children[this.grid.x].children[this.grid.y]
    }
}
var table = new tablePlay($("table tbody"),$("#order"),$("#execute"),$("#box"));
table.init();