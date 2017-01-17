//无效的命令不执行
/*
如图，新增元素“墙”，墙是正方形不可进入、越过的区域
新增修墙的指令，BUILD，执行指令时，会在当前方块面对的方向前修建一格墙壁，如果被指定修墙的地方超过边界墙或者已经有墙了，则取消修墙操作，并调用浏览器的console.log方法打印一个错误日志
新增粉刷的指令，BRU color，color是一个字符串，保持和css中颜色编码一致。执行指令时，如果当前方块蓝色边面对方向有紧相邻的墙，则将这个墙颜色改为参数颜色，如果没有，则通过调用浏览器的console.log方法，打印一个错误日志
尝试写一段代码，实现在空间内修建一个长长的五颜六色的墙或者有趣的图形
新增一个按钮，可以在空间内随机生成一些墙
增加一个指令：MOV TO x, y，会使得方块从当前位置移动到坐标为x，y的地方，移动过程中不能进入墙所在的地方，寻路算法请自行选择并实现，不做具体要求
*/
(function () {
    function App() {
        this.refreshBtn = $("#refresh");
        this.executeBtn = $("#execute");
        this.buildBtn = $("#build");
        this.commander = new Commander($("#command .line-number"), $('#command .line-command'));
        this.table = new tablePlay($("table tbody"), $("#box"));
        this.valiCommands = [];

        this.init()
    }

    App.prototype = {
        orders: [
            {
            pattern: /^go(\s+)?(\d+)?$/i,
            handler: function (arg) {

                var grid = this.setGrid(arg[1]);
                this.moveGrid(grid); 
            }
        }, {
            pattern:/^tun\s+(lef|rig|bac)$/i,
            handler: function (arg) {
                var direction = this.directions[arg[0].toLowerCase()];
                this.turn.apply(this, direction);
            }
        }, {
            //
            pattern:/^mov\s+to\s(\d+)[,\s+](\d+)\s*$/i,
            handler: function (arg) {
                this.moveTo(arg[0], arg[1])
            }
        }, {
            pattern:/^tra\s+(lef|rig|bot|top)(\s+)?(\w+)?$/i,
            handler: function (arg) {
                var arr = [];
                var grid = this.setGrid(arg[2], arg[0]);
                this.moveGrid(grid)
            }
        },{
            pattern:/^mov\s+(lef|rig|bot|top)(\s+)?(\w+)?$/i,
            handler: function (arg) {
                this.setDir(arg[0]);
                var grid = this.setGrid(arg[2]);
                this.moveGrid(grid);
            }
        }, {
            pattern:/^build$/i,
            handler: function () {
                var grid = this.setGrid();
                this.buildBlock(grid)
            }   
        }, {
            pattern:/^bru\s+(.*)$/i,
            handler: function (color) {
                var color = color || "#aaa";
                    this.setColor(color)
            }
        }
        ],
        init: function () {
            var self = this;
            addHandler(self.refreshBtn, 'click', function () {
                self.commander.refresh();
            });
            addHandler(self.executeBtn, 'click', function () {
                //应该先显示commands，不推入？
                //需要遍历commands和orders
                //先做验证
                var valiCommand;

                self.commander.getCommands();
                self.valiCommands = self.commander.commands.map(function (command, index) {
                    return self.validate(command, index)
                }).filter(function (vali) {
                    return vali;
                })
        

                valiCommand = self.valiCommands.shift();
                valiCommand();
                var timer = setInterval(function () {
                    //异步，需要重写逻辑，次数valiCommands为{}
                    if (self.valiCommands.length > 0) {
                        valiCommand = self.valiCommands.shift()
                        valiCommand();
                    } else {
                        clearInterval(timer)
                    }
                }, 1000)
            })
            addHandler(self.buildBtn, 'click', function () {
                self.table.buildBlock();
            });
            self.table.init();
            self.commander.init()
        },
        validate: function (string, index) {
            var command = this.parse(string);
            if (command) {
                return command.handler.bind(this.table, command.params);
            } else {
                this.commander.warn(index);
                return false;
            }
        },
        parse: function (string) {
            for (var i = 0; i < this.orders.length; i++) {
                var command = this.orders[i]
                var match = string.match(command.pattern);
                if (match) {
                    match.shift();
                    return {
                        handler: command.handler,
                        params: match
                    }
                }
            }
            
        },
    };

    var app = new App();


})()