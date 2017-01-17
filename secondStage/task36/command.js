//使用outline将input和textarea的边框去掉，否则focus的时候会很明显
var Commander = function (number, command) {
    this.numberList = number || null;
    this.orderInput = command;
    this.numbers = [];
    this.commands = [];
    this.lines = 1;

    this.init();
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
        spans[index].classList.add("warn");
    }
}