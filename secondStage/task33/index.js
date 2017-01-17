function tablePlay(table, input, btn) {
    this.table = table;
    this.input = input;
    this.btn = btn; 
    this.grid = {
        x: 1,
        y: 1,
        dir: 1
    };
    this.node = this.getGrid(1,1)
    this.directions = ['top', 'right', 'bottom', 'left']
}
tablePlay.prototype = {
    init: function () {
        var self = this;
        addHandler(this.btn, 'click', function (e) {
            switch(self.input.value) {
                case 'TUN LEF':
                    self.setDir(-1);
                break;
                case 'TUN RIG':
                    self.setDir(1);
                break;
                case 'TUN BAC':
                    self.setDir(2);
                break;
                case 'GO':
                    self.moveGrid();
                break;
            }
        })
    },
    setDir: function (order) {
        this.grid.dir = (this.grid.dir+order > -1? this.grid.dir+order : 3)%4;
        this.node.innerHTML = "<div class='" + this.directions[this.grid.dir] + "'></div>";
    },
    moveGrid: function () {
        var grid = this.grid;
        this.node.innerHTML = "";
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
        this.node.innerHTML = "<div class='" +  this.directions[this.grid.dir] + "'></div>";
    },
    getGrid: function () {
        return this.table.children[this.grid.x].children[this.grid.y]
    }
}
var table = new tablePlay($("table tbody"),$("#order"),$("#execute"));
table.init();