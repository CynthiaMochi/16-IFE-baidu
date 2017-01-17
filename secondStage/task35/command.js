//使用outline将input和textarea的边框去掉，否则focus的时候会很明显
var Commander = function (number, command) {
    this.numberList = number || null;
    this.orderInput = command;
    this.numbers = [];
    this.commands = [];
    this.lines = 1;
}
Commander.prototype = {
    init: function () {
        var self = this;

        addHandler(this.orderInput, 'keyup', function (e) {
            self.onRowChange();
        });
        addHandler(this.orderInput, 'scroll', function () {
            var top = self.orderInput.scrollTop;
            self.numberList.scrollTop = top;
        })
    },
    refresh: function () {
        this.orderInput.value = '';
        this.numberList.innerHTML = '<li><span>1</span></li>';
        this.commands = [];
        this.lines = 1;
    },
    onRowChange: function () {
        var rows = this.orderInput.value.split(/\n/);
        var top = this.orderInput.scrollTop;
        var rowArr = [];
        for(var i =0 ;i < rows.length ;i++){
            rowArr.push("<li><span>"+(i+1)+"</span></li>")
        }    
        this.numberList.innerHTML = rowArr.join('');
        this.numberList.scrollTop = top;
    },
    getCommands: function () {
        var values = (this.orderInput.value).split(/\n/);
        this.commands = values;
    },
    warn: function (index) {
        var spans = Array.prototype.slice.call(this.numberList.getElementsByTagName('span'));
            addClass(spans[index],"warn");
    },
    right: function (index) {
        var spans = Array.prototype.slice.call(this.numberList.getElementsByTagName('span'));
        
            removeClass(spans[index],"warn");
    },
    validate: function (orders, table) {
        var orderNames = Object.keys(orders);
        var vali = [];
        var self = this;
        this.commands.forEach(function (command, index) {
            var flag = false;
            for (var i =0, len = orderNames.length; i<len; i++) {
                var reg = new RegExp("^"+orderNames[i]+"\\s*\\d*");
                if(reg.test(command)) {
                    var number = command.match(/\d+/g) && command.match(/\d+/g).length == 1
                                ? command.match(/\d+/g)[0] 
                                : 1;
                    vali.unshift(orders[orderNames[i]].bind(table, number));
                    self.right(index);
                    flag = true;
                    break;
                }    
            }
            if (!flag) {
                //有一个不符合，就不执行
                self.warn(index);
            }
        })
        return vali;
    }

}