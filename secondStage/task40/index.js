//怎么获取日期的
//thead第一行用来切换月，年 和 第二行固定的星期
//tbody是日期，点击选中，data里保存着日期
//本月有的日期和上个月的样式不同
//注意大月小月,根据年，换算是否是闰年，一个月几天
//刷新的是数据，需要知道年，月来判断

//一周，一月几天都是自定义的
var CAL_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    CAL_MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var DateTool = (function () {
    function init(opts) {
        var instance = new DateTable(opts);
        return instance;
    }
    function DateTable(opts) {
        this.datePicker(opts);
        this.reRender = this.render();

        this.reRender(this.time);
        this.bindEvent();

    }

    DateTable.prototype = {
        defaultOpts: {
            setDate: new Date()
        },
        _dom: [
            {
                domClass: '.prev',
                handler: function () {
                    this.updateMonth(-1);
                    this.reRender(this.time);
                }
            },{
                domClass: '.next',
                handler: function () {
                    this.updateMonth(1);
                    this.reRender(this.time);
                }
            }
            // ,{
            //     domClass: '.switch',
            //     handler: 
            // }
        ],
        datePicker: function (opts) {
            if (typeof opts === 'object') {
                this.opts = $.extend({}, this.defaultOpts, opts);
            }
            this.time = this.getFullTime(new Date(this.opts.setDate));
            this.datePicker = this.opts.dom;
            this.selected = null;
        },
        bindEvent: function () {
            var self = this;
            this._dom.forEach(function (dom) {
                self.datePicker.find(dom.domClass).click(dom.handler.bind(self));
            })
            this.datePicker.delegate("td", 'click', function () {
                self.selected.removeClass('active');
                self.selected = $(this);
                $(this).toggleClass('active')
                alert(self.selected.data('day'))
            })
        },
        getFullTime: function (now) {
            var time = now || new Date(),
                year = time.getFullYear(),
                month = time.getMonth(),
                week = time.getDay(),
                day = time.getDate(),
                timeStr = year +'-'+(month+1)+'-'+day;
            return {
                date: time,
                year: year,
                week: week,
                day: day,
                month: month,
                timeStr: timeStr
            }
        },
        getDaysInMonth: function (year, month) {
            return (new Date(year, parseInt(month), 0)).getDate();
        },
        getDay: function (year, month, day) {
            return (new Date(year, month, day)).getDate();
        },
        updateMonth: function (dir) {
            this.time.month += dir;
            var time = new Date(this.time.year, this.time.month, this.time.day);
            this.time = this.getFullTime(time);
            $('.switch')[0].textContent = CAL_MONTH_LABELS[this.time.month] +' '+this.time.year;
        },
        updateYear: function (dir) {
            this.time.year += dir;
            var time = new Date(this.time.year, this.time.month, this.time.day);
            this.time = this.getFullTime(time);
        },
        generateHead: function () {
            //根据现在的时间或者传入的时间确定年
            var dateHead = document.createElement("thead");

            var pickerSwitchStr = '<tr><th class="prev"><i class="fa fa-angle-left fa-lg" aria-hidden="true"></i></th><th class="switch" data-action="switch" colspan="5">'+CAL_MONTH_LABELS[this.time.month] +' '+this.time.year+'</th><th class="next"><i class="fa fa-angle-right fa-lg" aria-hidden="true"></i></th></tr>',
                weekDayStr = '';

            CAL_DAY_LABELS.forEach(function (day) {
                weekDayStr += "<th>"+day+"</th>";
            }) 
            weekDayStr = "<tr>"+weekDayStr+"</tr>";
            dateHead.innerHTML = pickerSwitchStr+weekDayStr;
            return dateHead;
        },

        generateBody: function(now) {
            var time = now || this.getFullTime(this.time),
                startDay = new Date(time.year, time.month, 1).getDay(),
                monthLength = this.getDaysInMonth(time.year, time.month+1),
                dateBody = document.createElement('tbody'),
                dateBodyStr = "",
                tdStr = "",
                trStr = "",
                currentDate = 0,
                classNames ="";
                
            var n = 1,
                timeStr = '',
                neStartDay = 0 - startDay;

            for (var i = 0; i < 6; i++) {
                tdStr = "";
                for (var j = 0; j < 7; j++) {
                    if (n <= monthLength) {
                        //如果第一天不是0，就要从上个月开始
                        if (neStartDay++ >= 0) {
                            classNames = "day";
                            currentDate = n++; 
                            timeStr = time.year + '-' + (time.month+1) + '-' +currentDate;

                        } else {
                            currentDate = this.getDay(time.year, time.month, neStartDay); 
                            classNames = "day old";
                            timeStr = time.year + '-' + time.month + '-' +currentDate;
                        }
                    } else {
                        currentDate = this.getDay(time.year, time.month, n++); 
                        classNames = "day new";            
                        timeStr = time.year + '-' + (time.month+2) + '-' +currentDate;
                    } 
                    tdStr += '<td class="'+classNames+'" data-day="'+timeStr+'">'+currentDate+'</td>';
                }
                trStr += '<tr>'+tdStr+'</tr>';
            }
            dateBody.innerHTML = trStr;
            return dateBody;            
        },
        render: function () {
            var dateHead = this.generateHead();
            var dateBody;
            this.datePicker.append(dateHead);
            return function (now) {
                //利用Date对象会自动查找非法日期最近的日子，获取一个月的长度
                var dateBodyDom = this.datePicker.find('tbody')[0];
                dateBody = this.generateBody(now);
                if (dateBodyDom) {
                    dateBodyDom.remove();
                }
                this.datePicker.append(dateBody);
                this.selected = $('[data-day='+now.timeStr+']').addClass('active')
            }            
        }
    };
    return {
        init: init
    }
})()

var datepicker = DateTool.init({
    dom: $('#datePicker'),  
    setDate: "2017-3-31",
})