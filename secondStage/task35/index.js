//无效的命令不执行
(function () {
    var refreshBtn = $("#refresh");
    var executeBtn = $("#execute");

    var commander = new Commander($("#command .line-number"), $('#command .line-command'));
    var table = new tablePlay($("table tbody"), $("#box"));
    var valiCommands = [],
        valiCommand;

    commander.init();
    table.init()
    addHandler(refreshBtn, 'click', function () {
        commander.refresh();
    });
    addHandler(executeBtn, 'click', function () {
        //如果有错误的指令，就不执行,commander.commands
        //应该先显示commands，不推入？
        //需要遍历commands和orders
        //先做验证
        
        commander.getCommands();
        valiCommands = commander.validate(orders, table);
        var i = 0;
        valiCommand = valiCommands.pop();
        valiCommand();
        var timer = setInterval(function () {
            //异步，需要重写逻辑，次数valiCommands为{}
            if (i < valiCommands.length) {
                valiCommand = valiCommands.pop()
                valiCommand();
            } else {
                clearInterval(timer)
            }
        }, 1000)
    })
var orders = {
    'TUN LEF': function () {
        this.changeDir(-1, 0);
    },
    'TUN RIG': function () {
        this.changeDir(1, 2);
    },
    'TUN BAC': function () {
        this.changeDir(2, 3);
    },
    'GO': function (n) {
        this.moveGrid(n);
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
    'MOV LEF': function (n) {
        this.setDir(3);
        this.moveGrid(n);
    },
    'MOV TOP': function (n) {
        this.setDir(0);
        this.moveGrid(n);
    },
    'MOV RIG': function (n) {
        this.setDir(1);
        this.moveGrid(n);
    },
    'MOV BOT': function (n) {
        this.setDir(2);
        this.moveGrid(n);
    },
}
    
})()